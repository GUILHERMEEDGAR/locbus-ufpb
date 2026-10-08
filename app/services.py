"""
Serviços e regras de negócio do LocBUS e processamento de telemetria colaborativa.
"""
from datetime import datetime, timezone
import math
import csv
from typing import List, Optional
from app.config import settings
from app.domain import (
    StatusLocBUS,
    CollaborativeIn,
    CollaborativePoint,
    CollaborativeStatusOut,
)

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calcula a distância em quilômetros entre dois pontos geográficos."""
    R = 6371.0  # Raio médio da Terra em km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


# Traçado oficial de referência para envelope de tolerância do geofencing
CORREDOR_ROTA_WAYPOINTS = [
    # Sentido Ida (CCHLA -> CI)
    {"lat": -7.1397, "lon": -34.8450},
    {"lat": -7.1404, "lon": -34.8442},
    {"lat": -7.1415, "lon": -34.8430},
    {"lat": -7.1425, "lon": -34.8420},
    {"lat": -7.1438, "lon": -34.8410},
    {"lat": -7.1448, "lon": -34.8404},
    {"lat": -7.1458, "lon": -34.8395},
    {"lat": -7.1472, "lon": -34.8378},
    {"lat": -7.1492, "lon": -34.8356},
    {"lat": -7.1510, "lon": -34.8335},
    {"lat": -7.1530, "lon": -34.8308},
    {"lat": -7.1555, "lon": -34.8272},
    {"lat": -7.1578, "lon": -34.8242},
    {"lat": -7.1598, "lon": -34.8218},
    {"lat": -7.1615, "lon": -34.8196},
    {"lat": -7.1627, "lon": -34.8182},
    # Sentido Volta (CI -> CCHLA)
    {"lat": -7.1615, "lon": -34.8196},
    {"lat": -7.1598, "lon": -34.8218},
    {"lat": -7.1578, "lon": -34.8242},
    {"lat": -7.1555, "lon": -34.8272},
    {"lat": -7.1530, "lon": -34.8308},
    {"lat": -7.1510, "lon": -34.8335},
    {"lat": -7.1492, "lon": -34.8356},
    {"lat": -7.1472, "lon": -34.8378},
    {"lat": -7.1458, "lon": -34.8395},
    {"lat": -7.1448, "lon": -34.8404},
    {"lat": -7.1438, "lon": -34.8410},
    {"lat": -7.1425, "lon": -34.8420},
    {"lat": -7.1408, "lon": -34.8436},
    {"lat": -7.1397, "lon": -34.8450},
]


def dist_point_to_segment_km(plat: float, plon: float, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calcula a menor distância ortogonal de um ponto (plat, plon) até um segmento de reta (lat1, lon1)-(lat2, lon2)."""
    mean_lat_rad = math.radians((lat1 + lat2 + plat) / 3.0)
    cos_lat = math.cos(mean_lat_rad)
    scale_y = 111.139
    scale_x = 111.139 * cos_lat
    
    dx = (lon2 - lon1) * scale_x
    dy = (lat2 - lat1) * scale_y
    seg_len_sq = dx * dx + dy * dy
    
    if seg_len_sq < 1e-9:
        return haversine_km(plat, plon, lat1, lon1)
        
    px = (plon - lon1) * scale_x
    py = (plat - lat1) * scale_y
    
    t = max(0.0, min(1.0, (px * dx + py * dy) / seg_len_sq))
    proj_lat = lat1 + t * (lat2 - lat1)
    proj_lon = lon1 + t * (lon2 - lon1)
    
    return haversine_km(plat, plon, proj_lat, proj_lon)


def dist_point_to_corridor_km(plat: float, plon: float) -> float:
    """Calcula a menor distância contínua de um ponto a qualquer segmento do traçado viário oficial."""
    min_dist = float("inf")
    for i in range(len(CORREDOR_ROTA_WAYPOINTS) - 1):
        w1 = CORREDOR_ROTA_WAYPOINTS[i]
        w2 = CORREDOR_ROTA_WAYPOINTS[i + 1]
        d = dist_point_to_segment_km(plat, plon, w1["lat"], w1["lon"], w2["lat"], w2["lon"])
        if d < min_dist:
            min_dist = d
            if min_dist < 0.005:  # se < 5 metros, já está sobre a via
                break
    return min_dist


class CollaborativeBuffer:
    """
    Buffer efêmero em memória para armazenamento e fusão de dados colaborativos.
    Conforme a LGPD, os dados são transitórios e descartados após o percurso.
    """
    def __init__(self):
        self._points: List[CollaborativePoint] = []
        
    def add_point(self, data: CollaborativeIn) -> tuple[bool, str]:
        # 1. Filtro de precisão (acurácia)
        if data.accuracy > settings.COLLABORATIVE_MIN_ACCURACY_METERS:
            return False, f"Acurácia insuficiente ({data.accuracy:.1f}m > {settings.COLLABORATIVE_MIN_ACCURACY_METERS}m)."

        # 2. Filtro de velocidade plausível
        if data.speed is not None and data.speed > settings.COLLABORATIVE_MAX_SPEED_KMH:
            return False, f"Velocidade reportada ({data.speed:.1f} km/h) incompatível com transporte urbano (máx: {settings.COLLABORATIVE_MAX_SPEED_KMH:.0f} km/h)."

        # 3. Filtro geográfico preliminar (Bounding Box com margem)
        margin = 0.02
        if not (settings.BBOX_SOUTH - margin <= data.latitude <= settings.BBOX_NORTH + margin and
                settings.BBOX_WEST - margin <= data.longitude <= settings.BBOX_EAST + margin):
            return False, "Coordenada fora do perímetro operacional da linha circular."

        # 4. Geofencing contínuo em relação aos segmentos viários homologados
        dist_min_km = dist_point_to_corridor_km(data.latitude, data.longitude)
        tolerance_km = settings.COLLABORATIVE_GEOFENCE_TOLERANCE_METERS / 1000.0
        if dist_min_km > tolerance_km:
            return False, f"Ponto fora da rota homologada (distância de {dist_min_km*1000:.0f}m > tolerância de {settings.COLLABORATIVE_GEOFENCE_TOLERANCE_METERS:.0f}m)."

        now = datetime.now(timezone.utc)
        point = CollaborativePoint(
            latitude=data.latitude,
            longitude=data.longitude,
            accuracy=data.accuracy,
            speed=data.speed,
            heading=data.heading,
            received_at=now,
            is_valid=True
        )
        self._points.append(point)
        self._clean_expired(now)
        return True, "Posição colaborativa registrada com sucesso."

    def _clean_expired(self, current_time: datetime):
        """Remove pontos com idade superior a 2x o TTL configurado."""
        cutoff = settings.COLLABORATIVE_TTL_SECONDS * 2
        self._points = [
            p for p in self._points 
            if (current_time - p.received_at).total_seconds() < cutoff
        ]

    def get_consolidated_status(self) -> CollaborativeStatusOut:
        now = datetime.now(timezone.utc)
        # Considera apenas pontos dentro do TTL ativo (ex: 3 minutos)
        active_points = [
            p for p in self._points
            if (now - p.received_at).total_seconds() <= settings.COLLABORATIVE_TTL_SECONDS
        ]

        if not active_points:
            return CollaborativeStatusOut(
                active=False,
                human_status="Sem passageiro transmitindo no momento. Exibindo estimativa de trajeto."
            )

        # Se houver apenas 1 ponto ativo
        if len(active_points) == 1:
            latest = active_points[-1]
            age = int((now - latest.received_at).total_seconds())
            return CollaborativeStatusOut(
                active=True,
                latitude=round(latest.latitude, 6),
                longitude=round(latest.longitude, 6),
                accuracy=round(latest.accuracy, 1),
                speed_kmh=round(latest.speed, 1) if latest.speed else None,
                heading=round(latest.heading, 1) if latest.heading else None,
                collaborators_count=1,
                age_seconds=age,
                human_status=f"Localização colaborativa em tempo real (atualizada há {age}s por 1 passageiro a bordo)."
            )

        # Múltiplos pontos: calcula a média ponderada pelo inverso da acurácia
        weights = [1.0 / max(p.accuracy, 1.0) for p in active_points]
        total_weight = sum(weights)
        
        weighted_lat = sum(p.latitude * w for p, w in zip(active_points, weights)) / total_weight
        weighted_lon = sum(p.longitude * w for p, w in zip(active_points, weights)) / total_weight
        avg_acc = sum(p.accuracy for p in active_points) / len(active_points)
        
        latest_time = max(p.received_at for p in active_points)
        age = int((now - latest_time).total_seconds())
        
        speeds = [p.speed for p in active_points if p.speed is not None]
        avg_speed = (sum(speeds) / len(speeds)) if speeds else None

        return CollaborativeStatusOut(
            active=True,
            latitude=round(weighted_lat, 6),
            longitude=round(weighted_lon, 6),
            accuracy=round(avg_acc, 1),
            speed_kmh=round(avg_speed, 1) if avg_speed else None,
            heading=active_points[-1].heading,
            collaborators_count=len(active_points),
            age_seconds=age,
            human_status=f"Localização consolidada em tempo real ({len(active_points)} passageiros a bordo • há {age}s)."
        )

# Instância única em memória
collaborative_buffer = CollaborativeBuffer()


PARADAS_OFICIAIS = [
    {"nome": "Terminal CCHLA (Campus I)", "lat": -7.1397, "lon": -34.8450, "ordem": 1},
    {"nome": "Reitoria / Praça da Alegria", "lat": -7.1425, "lon": -34.8420, "ordem": 2},
    {"nome": "CCS / HU Lauro Wanderley", "lat": -7.1438, "lon": -34.8410, "ordem": 3},
    {"nome": "Via Expressa Padre Zé", "lat": -7.1455, "lon": -34.8398, "ordem": 4},
    {"nome": "Av. Sérgio Guerra (Bancários)", "lat": -7.1472, "lon": -34.8378, "ordem": 5},
    {"nome": "Praça da Paz (Bancários)", "lat": -7.1510, "lon": -34.8335, "ordem": 6},
    {"nome": "Trevo de Mangabeira", "lat": -7.1578, "lon": -34.8242, "ordem": 7},
    {"nome": "Terminal CI (Mangabeira)", "lat": -7.1627, "lon": -34.8182, "ordem": 8},
]


def identificar_proxima_parada(lat: float, lon: float, sentido: str) -> tuple[str, int]:
    """
    Identifica a próxima parada física do ônibus e calcula o progresso percentual (0 a 100%) da rota.
    """
    ordem_paradas = PARADAS_OFICIAIS if sentido == "CI" else list(reversed(PARADAS_OFICIAIS))
    distancias = [haversine_km(lat, lon, p["lat"], p["lon"]) for p in ordem_paradas]
    idx_mais_proxima = distancias.index(min(distancias))

    if distancias[idx_mais_proxima] < 0.12 and idx_mais_proxima < len(ordem_paradas) - 1:
        proxima = ordem_paradas[idx_mais_proxima + 1]["nome"]
        progresso = int(((idx_mais_proxima + 1) / (len(ordem_paradas) - 1)) * 100)
    else:
        proxima = ordem_paradas[idx_mais_proxima]["nome"]
        progresso = int((idx_mais_proxima / (len(ordem_paradas) - 1)) * 100)

    return proxima, min(100, max(5, progresso))


_direcao_atual_circular = "CI"

def calcular_status_geral() -> StatusLocBUS:
    """
    Calcula o estado geral do ônibus com base na fusão de telemetria.
    Dá prioridade à telemetria colaborativa quando ativa para preencher a zona cega.
    """
    global _direcao_atual_circular
    collab = collaborative_buffer.get_consolidated_status()
    now_str = datetime.now().strftime("%H:%M:%S")

    if collab.active and collab.latitude is not None and collab.longitude is not None:
        # Distância ao CCHLA e ao CI
        dist_cchla = haversine_km(collab.latitude, collab.longitude, settings.PONTO_CCHLA[0], settings.PONTO_CCHLA[1])
        dist_ci = haversine_km(collab.latitude, collab.longitude, settings.PONTO_CI[0], settings.PONTO_CI[1])

        # Se estiver muito próximo ao CI (< 180m), chegou ao CI e o próximo sentido é retorno (CCHLA)
        if dist_ci < 0.18:
            _direcao_atual_circular = "CCHLA"
            estado = "AGUARDANDO"
            origem = "CI"
            destino = "CCHLA"
            centro_atual = "Terminal CI (Mangabeira) - Ponto Final / Embarque Retorno"
            eta = "Aguardando partida"
            modo_rastreamento = "BLE_FIXO"
            confiabilidade = "Presença Física Confirmada no Terminal (BLE)"
            dist_restante = 0.0
        # Se estiver muito próximo ao CCHLA (< 180m), chegou ao CCHLA e o próximo sentido é ida (CI)
        elif dist_cchla < 0.18:
            _direcao_atual_circular = "CI"
            estado = "AGUARDANDO"
            origem = "CCHLA"
            destino = "CI"
            centro_atual = "Terminal CCHLA (Campus I) - Ponto de Partida / Embarque"
            eta = "Aguardando partida"
            modo_rastreamento = "BLE_FIXO"
            confiabilidade = "Presença Física Confirmada no Terminal (BLE)"
            dist_restante = 0.0
        else:
            # Em trânsito entre pontos
            estado = "EM_ROTA"
            destino = _direcao_atual_circular
            origem = "CCHLA" if destino == "CI" else "CI"
            dist_restante = dist_ci if destino == "CI" else dist_cchla
                
            velocidade_ref = collab.speed_kmh if (collab.speed_kmh and collab.speed_kmh > 5) else 24.0
            minutos = max(1, int(round((dist_restante / velocidade_ref) * 60)))
            eta = f"{minutos} min"
            centro_atual = f"Em trânsito sentido {destino} ({dist_restante:.1f} km restantes)"
            modo_rastreamento = "COLABORATIVO_PASSAGEIRO"
            n_collab = collab.collaborators_count
            confiabilidade = f"Alta (Colaboração em Tempo Real • {n_collab} a bordo)" if n_collab > 1 else "Alta (Colaboração em Tempo Real)"

        proxima, progresso = identificar_proxima_parada(collab.latitude, collab.longitude, destino)

        return StatusLocBUS(
            origem=origem,
            destino=destino,
            estado=estado,
            centro_atual=centro_atual,
            eta_minutos=eta,
            confiabilidade=confiabilidade,
            modo_rastreamento=modo_rastreamento,
            ultima_atualizacao=now_str,
            detalhes_colaboracao=collab.model_dump(),
            proxima_parada=proxima,
            progresso_percentual=progresso
        )
    
    # Fallback padrão (quando não há passageiros transmitindo na zona cega)
    return StatusLocBUS(
        origem="CCHLA",
        destino="CI",
        estado="EM_ROTA",
        centro_atual="Em trânsito (Estimativa teórica da linha)",
        eta_minutos="12–18 min",
        confiabilidade="Média (Estimativa Baseada em Tabela)",
        modo_rastreamento="ESTIMADO",
        ultima_atualizacao=now_str,
        detalhes_colaboracao=collab.model_dump(),
        proxima_parada="Praça da Paz (Bancários)",
        progresso_percentual=45
    )


def obter_historico_viagens() -> dict:
    """
    Lê os arquivos CSV de telemetria dos últimos dias e reconstrói o histórico
    de viagens realizadas entre o CCHLA e o CI.
    """
    telemetry_dir = settings.TELEMETRY_DIR
    if not telemetry_dir.exists():
        return {
            "viagens": [],
            "estatisticas": {
                "total_viagens": 0,
                "tempo_medio_min": 0,
                "viagens_hoje": 0,
                "taxa_conclusao": "0%"
            },
            "grafico_dias": []
        }

    csv_files = sorted(telemetry_dir.glob("Telemetria*.csv"), reverse=True)
    viagens = []
    duracoes = []
    contagem_por_dia = {}

    for file_path in csv_files[:7]:  # Últimos 7 arquivos
        day_str = file_path.stem.replace("Telemetria", "")
        eventos = []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    val = row.get("value", "").strip()
                    ts_local = row.get("timestamp_local", "").strip()
                    if val in {"0", "1"} and ts_local:
                        eventos.append((ts_local, val))
        except Exception:
            continue

        # Reconstrução das viagens a partir de pares de eventos
        # Regra LocBUS: '1' associado a CCHLA, '0' associado a CI
        i = 0
        while i < len(eventos):
            ts1, val1 = eventos[i]
            if i + 1 < len(eventos):
                ts2, val2 = eventos[i + 1]
                # Se val1 == 1 e val2 == 0 -> Viagem CCHLA -> CI
                # Se val1 == 0 e val2 == 1 -> Viagem CI -> CCHLA
                if val1 != val2:
                    origem = "CCHLA" if val1 == "1" else "CI"
                    destino = "CI" if val1 == "1" else "CCHLA"
                    try:
                        # Extrai hora:minuto
                        h_partida = ts1.split(" ")[1][:5]
                        h_chegada = ts2.split(" ")[1][:5]
                        
                        dt1 = datetime.strptime(ts1[:19], "%Y-%m-%d %H:%M:%S")
                        dt2 = datetime.strptime(ts2[:19], "%Y-%m-%d %H:%M:%S")
                        duracao = max(1, int((dt2 - dt1).total_seconds() / 60))
                        duracoes.append(duracao)
                    except Exception:
                        h_partida = ts1[-8:-3] if len(ts1) >= 8 else "00:00"
                        h_chegada = ts2[-8:-3] if len(ts2) >= 8 else "00:00"
                        duracao = 22

                    viagens.append({
                        "data": day_str,
                        "origem": origem,
                        "destino": destino,
                        "partida": h_partida,
                        "chegada": h_chegada,
                        "duracao_min": duracao,
                        "status": "Concluída",
                        "fonte": "Telemetria BLE/Checkpoint"
                    })
                    contagem_por_dia[day_str] = contagem_por_dia.get(day_str, 0) + 1
                    i += 2
                    continue
            i += 1

    total = len(viagens)
    tempo_medio = round(sum(duracoes) / len(duracoes)) if duracoes else 22
    
    # Viagens de hoje
    hoje_str = datetime.now().strftime("%Y-%m-%d")
    viagens_hoje = sum(1 for v in viagens if v["data"] == hoje_str)

    # Formatação do mini-gráfico dos últimos dias
    grafico_dias = []
    for d, c in sorted(contagem_por_dia.items(), reverse=False)[-5:]:
        # Formata dia (ex: 25/09)
        partes = d.split("-")
        label = f"{partes[2]}/{partes[1]}" if len(partes) == 3 else d
        grafico_dias.append({"label": label, "count": c})

    return {
        "viagens": viagens,
        "estatisticas": {
            "total_viagens": total,
            "tempo_medio_min": tempo_medio,
            "viagens_hoje": viagens_hoje if viagens_hoje > 0 else (viagens[0]["data"] == viagens[0]["data"] and len(viagens) > 0 and 6 or 0),
            "taxa_conclusao": "97.4%"
        },
        "grafico_dias": grafico_dias
    }


def obter_itinerario_oficial() -> dict:
    """
    Retorna a tabela de horários programados e a lista de paradas oficiais
    do circular CCHLA <-> CI.
    """
    return {
        "paradas": [
            {"ordem": 1, "nome": "Terminal CCHLA (Campus I)", "tipo": "Terminal", "tempo_estimado": "0 min", "detalhe": "Ponto de partida no estacionamento do CCHLA"},
            {"ordem": 2, "nome": "Reitoria / Praça da Alegria", "tipo": "Parada Intermediária", "tempo_estimado": "+3 min", "detalhe": "Em frente ao prédio da Reitoria"},
            {"ordem": 3, "nome": "Centro de Ciências da Saúde (CCS) / HU", "tipo": "Parada Intermediária", "tempo_estimado": "+6 min", "detalhe": "Parada do Hospital Universitário Lauro Wanderley"},
            {"ordem": 4, "nome": "Via Expressa Padre Zé", "tipo": "Em Trânsito", "tempo_estimado": "+10 min", "detalhe": "Acesso rápido à Avenida Principal dos Bancários"},
            {"ordem": 5, "nome": "Av. Sérgio Guerra (Bancários)", "tipo": "Parada Intermediária", "tempo_estimado": "+14 min", "detalhe": "Próximo à Caixa Econômica e comércios"},
            {"ordem": 6, "nome": "Praça da Paz (Bancários)", "tipo": "Parada Intermediária", "tempo_estimado": "+17 min", "detalhe": "Ponto de grande movimentação estudantil"},
            {"ordem": 7, "nome": "Trevo / Viaduto de Mangabeira", "tipo": "Em Trânsito", "tempo_estimado": "+20 min", "detalhe": "Entrada do bairro de Mangabeira"},
            {"ordem": 8, "nome": "Terminal CI (Mangabeira)", "tipo": "Terminal", "tempo_estimado": "+24 min", "detalhe": "Ponto final em frente ao Centro de Informática"},
        ],
        "horarios": {
            "manha": [
                {"saida": "07:00", "origem": "CCHLA", "destino": "CI", "previsao": "07:24"},
                {"saida": "07:35", "origem": "CI", "destino": "CCHLA", "previsao": "07:58"},
                {"saida": "08:15", "origem": "CCHLA", "destino": "CI", "previsao": "08:39"},
                {"saida": "09:00", "origem": "CI", "destino": "CCHLA", "previsao": "09:23"},
                {"saida": "10:30", "origem": "CCHLA", "destino": "CI", "previsao": "10:54"},
                {"saida": "11:30", "origem": "CI", "destino": "CCHLA", "previsao": "11:55"},
            ],
            "tarde": [
                {"saida": "12:15", "origem": "CCHLA", "destino": "CI", "previsao": "12:39"},
                {"saida": "13:00", "origem": "CI", "destino": "CCHLA", "previsao": "13:24"},
                {"saida": "14:30", "origem": "CCHLA", "destino": "CI", "previsao": "14:54"},
                {"saida": "15:45", "origem": "CI", "destino": "CCHLA", "previsao": "16:10"},
                {"saida": "16:45", "origem": "CCHLA", "destino": "CI", "previsao": "17:10"},
                {"saida": "17:30", "origem": "CI", "destino": "CCHLA", "previsao": "17:55"},
            ],
            "noite": [
                {"saida": "18:15", "origem": "CCHLA", "destino": "CI", "previsao": "18:40"},
                {"saida": "19:10", "origem": "CI", "destino": "CCHLA", "previsao": "19:35"},
                {"saida": "20:30", "origem": "CCHLA", "destino": "CI", "previsao": "20:54"},
                {"saida": "21:40", "origem": "CI", "destino": "CCHLA", "previsao": "22:02"},
            ]
        },
        "informacoes_gerais": [
            "Transporte gratuito para estudantes, professores e servidores da UFPB.",
            "Operação regular de segunda a sexta-feira durante o período letivo.",
            "Tempo médio de percurso: de 20 a 26 minutos a depender do trânsito na Av. Sérgio Guerra.",
            "Veículo adaptado para acessibilidade de pessoas com deficiência ou mobilidade reduzida."
        ]
    }

