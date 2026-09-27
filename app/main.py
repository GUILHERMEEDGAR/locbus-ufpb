"""
Aplicação FastAPI do LocBUS com suporte a Telemetria Colaborativa e Tempo Real via Server-Sent Events (SSE).
"""
import asyncio
import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.config import settings
from app.domain import CollaborativeIn, CollaborativeStatusOut
from app.events import event_broker
from app.services import (
    collaborative_buffer,
    calcular_status_geral,
    obter_historico_viagens,
    obter_itinerario_oficial,
)

logger = logging.getLogger("locbus.main")


async def sse_heartbeat_ticker():
    """
    Worker em background que envia status periódico (10s) para manter os clientes
    conectados em sincronia de tempo (idade de leitura, cálculo de ETA e TTL).
    """
    while True:
        try:
            await asyncio.sleep(10)
            if event_broker.active_subscribers_count > 0:
                current_status = calcular_status_geral().model_dump()
                await event_broker.broadcast("status", current_status)
        except asyncio.CancelledError:
            break
        except Exception as exc:
            logger.warning("Erro no ciclo do sse_heartbeat_ticker: %s", exc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerenciamento de ciclo de vida da aplicação com background workers."""
    ticker_task = asyncio.create_task(sse_heartbeat_ticker())
    try:
        yield
    finally:
        ticker_task.cancel()
        try:
            await ticker_task
        except asyncio.CancelledError:
            pass


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Sistema de Rastreamento e Telemetria em Tempo Real para Transporte Intercampi.",
    lifespan=lifespan,
)

# Garante existência dos diretórios
settings.STATIC_DIR.mkdir(parents=True, exist_ok=True)
settings.TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)

# Monta arquivos estáticos e templates
app.mount("/static", StaticFiles(directory=str(settings.STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(settings.TEMPLATES_DIR))

# Waypoints de simulação da rota circular completa (CCHLA <-> CI: Ida e Volta)
SIMULATION_WAYPOINTS = [
    # --- ETAPA 1: SENTIDO IDA (CCHLA -> CI) ---
    {"lat": -7.1397, "lon": -34.8450, "speed": 0.0, "origem": "CCHLA", "destino": "CI", "desc": "Parado no Terminal CCHLA (Campus I) - Embarque"},
    {"lat": -7.1404, "lon": -34.8442, "speed": 18.0, "origem": "CCHLA", "destino": "CI", "desc": "Saindo do estacionamento do CCHLA"},
    {"lat": -7.1415, "lon": -34.8430, "speed": 25.0, "origem": "CCHLA", "destino": "CI", "desc": "Via interna do Campus I"},
    {"lat": -7.1425, "lon": -34.8420, "speed": 22.0, "origem": "CCHLA", "destino": "CI", "desc": "Parada Reitoria / Praça da Alegria"},
    {"lat": -7.1438, "lon": -34.8410, "speed": 24.0, "origem": "CCHLA", "destino": "CI", "desc": "Passando pelo Centro de Ciências da Saúde (CCS)"},
    {"lat": -7.1448, "lon": -34.8404, "speed": 26.0, "origem": "CCHLA", "destino": "CI", "desc": "Parada do Hospital Universitário (HULW)"},
    {"lat": -7.1458, "lon": -34.8395, "speed": 35.0, "origem": "CCHLA", "destino": "CI", "desc": "Acessando a Via Expressa Padre Zé"},
    {"lat": -7.1472, "lon": -34.8378, "speed": 42.0, "origem": "CCHLA", "destino": "CI", "desc": "Entrando na Av. Sérgio Guerra (Principal dos Bancários)"},
    {"lat": -7.1492, "lon": -34.8356, "speed": 38.0, "origem": "CCHLA", "destino": "CI", "desc": "Av. Sérgio Guerra (altura dos bancos e comércios)"},
    {"lat": -7.1510, "lon": -34.8335, "speed": 30.0, "origem": "CCHLA", "destino": "CI", "desc": "Parada da Praça da Paz (Bancários)"},
    {"lat": -7.1530, "lon": -34.8308, "speed": 40.0, "origem": "CCHLA", "destino": "CI", "desc": "Av. Sérgio Guerra (Bancários Sul)"},
    {"lat": -7.1555, "lon": -34.8272, "speed": 42.0, "origem": "CCHLA", "destino": "CI", "desc": "Aproximando-se do Viaduto dos Bancários"},
    {"lat": -7.1578, "lon": -34.8242, "speed": 36.0, "origem": "CCHLA", "destino": "CI", "desc": "Trevo / Viaduto de Mangabeira"},
    {"lat": -7.1598, "lon": -34.8218, "speed": 32.0, "origem": "CCHLA", "destino": "CI", "desc": "Avenida Alfredo Ferreira da Rocha (Mangabeira)"},
    {"lat": -7.1615, "lon": -34.8196, "speed": 22.0, "origem": "CCHLA", "destino": "CI", "desc": "Rua do Centro de Informática"},
    {"lat": -7.1627, "lon": -34.8182, "speed": 0.0, "origem": "CCHLA", "destino": "CI", "desc": "Terminal CI (Mangabeira) - Chegada no Destino"},

    # --- ETAPA 2: SENTIDO VOLTA (CI -> CCHLA) ---
    {"lat": -7.1627, "lon": -34.8182, "speed": 0.0, "origem": "CI", "destino": "CCHLA", "desc": "Terminal CI (Mangabeira) - Embarque para Campus I"},
    {"lat": -7.1615, "lon": -34.8196, "speed": 20.0, "origem": "CI", "destino": "CCHLA", "desc": "Saindo do CI rumo à Av. Alfredo Ferreira da Rocha"},
    {"lat": -7.1598, "lon": -34.8218, "speed": 34.0, "origem": "CI", "destino": "CCHLA", "desc": "Av. Alfredo Ferreira da Rocha (Retorno)"},
    {"lat": -7.1578, "lon": -34.8242, "speed": 38.0, "origem": "CI", "destino": "CCHLA", "desc": "Passando pelo Viaduto de Mangabeira sentido Bancários"},
    {"lat": -7.1555, "lon": -34.8272, "speed": 40.0, "origem": "CI", "destino": "CCHLA", "desc": "Entrando na Av. Sérgio Guerra (Sentido Campus)"},
    {"lat": -7.1530, "lon": -34.8308, "speed": 36.0, "origem": "CI", "destino": "CCHLA", "desc": "Av. Sérgio Guerra (altura do Shopping Sul)"},
    {"lat": -7.1510, "lon": -34.8335, "speed": 28.0, "origem": "CI", "destino": "CCHLA", "desc": "Parada da Praça da Paz (Sentido Campus)"},
    {"lat": -7.1492, "lon": -34.8356, "speed": 38.0, "origem": "CI", "destino": "CCHLA", "desc": "Av. Sérgio Guerra norte (Bancários)"},
    {"lat": -7.1472, "lon": -34.8378, "speed": 42.0, "origem": "CI", "destino": "CCHLA", "desc": "Final da Av. Sérgio Guerra / Trevo Castelo Branco"},
    {"lat": -7.1458, "lon": -34.8395, "speed": 40.0, "origem": "CI", "destino": "CCHLA", "desc": "Via Expressa Padre Zé sentido Campus I"},
    {"lat": -7.1448, "lon": -34.8404, "speed": 25.0, "origem": "CI", "destino": "CCHLA", "desc": "Entrada Campus I / Hospital Universitário"},
    {"lat": -7.1438, "lon": -34.8410, "speed": 24.0, "origem": "CI", "destino": "CCHLA", "desc": "Passando pelo CCS"},
    {"lat": -7.1425, "lon": -34.8420, "speed": 20.0, "origem": "CI", "destino": "CCHLA", "desc": "Rotatória da Reitoria / Praça da Alegria"},
    {"lat": -7.1408, "lon": -34.8436, "speed": 18.0, "origem": "CI", "destino": "CCHLA", "desc": "Acesso final ao CCHLA"},
    {"lat": -7.1397, "lon": -34.8450, "speed": 0.0, "origem": "CI", "destino": "CCHLA", "desc": "Terminal CCHLA (Campus I) - Ciclo Completo Concluído!"},
]
sim_state = {"index": 0}


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Página principal do LocBUS com abas completas (Mapa, Histórico, Itinerário, Sobre)."""
    status = calcular_status_geral()
    collab = collaborative_buffer.get_consolidated_status()
    historico = obter_historico_viagens()
    itinerario = obter_itinerario_oficial()

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "status": status,
            "collab": collab,
            "historico": historico,
            "itinerario": itinerario,
            "app_name": settings.APP_NAME,
            "app_version": settings.APP_VERSION,
        }
    )


@app.get("/manifest.webmanifest", include_in_schema=False)
@app.get("/manifest.json", include_in_schema=False)
async def get_manifest():
    """Entrega o manifesto do Progressive Web App (PWA)."""
    manifest_file = settings.STATIC_DIR / "manifest.webmanifest"
    return FileResponse(manifest_file, media_type="application/manifest+json")


@app.get("/sw.js", include_in_schema=False)
async def get_service_worker():
    """Entrega o Service Worker com escopo na raiz do domínio."""
    sw_file = settings.STATIC_DIR / "sw.js"
    return FileResponse(
        sw_file,
        media_type="application/javascript",
        headers={
            "Service-Worker-Allowed": "/",
            "Cache-Control": "no-cache, no-store, must-revalidate"
        }
    )


@app.get("/favicon.ico", include_in_schema=False)
async def get_favicon():
    """Entrega o favicon do aplicativo."""
    icon_file = settings.STATIC_DIR / "icons" / "icon-192.png"
    return FileResponse(icon_file, media_type="image/png")


@app.get("/api/v1/status")
async def get_status():
    """Retorna o estado consolidado da linha e do ônibus."""
    return calcular_status_geral()


@app.get("/api/v1/events")
async def sse_stream(request: Request):
    """
    Canal de Streaming de Eventos em Tempo Real (Server-Sent Events - SSE).
    Elimina o polling contínuo de 4 segundos e envia atualizações instantâneas de telemetria,
    ETA e coordenadas do ônibus assim que novos dados são processados.
    """
    async def event_generator() -> AsyncGenerator[str, None]:
        queue = await event_broker.subscribe()
        try:
            # 1. Envia estado inicial imediatamente ao conectar para renderização instantânea
            initial_status = calcular_status_geral().model_dump()
            yield f"event: status\ndata: {json.dumps(initial_status)}\n\n"

            while True:
                try:
                    # Aguarda próximo evento com timeout de 15s para heartbeat ping
                    msg = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"event: {msg['event']}\ndata: {json.dumps(msg['data'])}\n\n"
                except asyncio.TimeoutError:
                    # Linha de comentário para manter a conexão HTTP ativa através de proxies/NAT
                    yield ": ping\n\n"
        except (asyncio.CancelledError, GeneratorExit):
            pass
        finally:
            await event_broker.unsubscribe(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/api/v1/events/stats")
async def get_events_stats():
    """Retorna métricas em tempo real sobre clientes conectados ao broker SSE."""
    return {
        "active_clients": event_broker.active_subscribers_count,
        "protocol": "Server-Sent Events (SSE)",
        "heartbeat_interval_seconds": 15,
        "background_sync_seconds": 10,
    }


@app.get("/api/v1/history")
async def get_history():
    """Retorna o histórico reconstruído dos últimos 7 dias a partir dos CSVs."""
    return obter_historico_viagens()


@app.get("/api/v1/history/export")
async def export_history_csv():
    """Exporta o histórico de viagens reconstruídas em arquivo CSV para download."""
    import io
    import csv
    historico = obter_historico_viagens()
    viagens = historico.get("viagens", [])

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Data", "Origem", "Destino", "Partida", "Chegada", "Duracao_Minutos", "Status", "Fonte"])

    for v in viagens:
        writer.writerow([
            v.get("data", ""),
            v.get("origem", ""),
            v.get("destino", ""),
            v.get("partida", ""),
            v.get("chegada", ""),
            v.get("duracao_min", ""),
            v.get("status", ""),
            v.get("fonte", "")
        ])

    csv_bytes = output.getvalue().encode("utf-8-sig")
    return StreamingResponse(
        io.BytesIO(csv_bytes),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=LocBUS_Historico_Viagens.csv"}
    )


@app.get("/api/v1/itinerary")
async def get_itinerary():
    """Retorna o itinerário oficial e a tabela de horários."""
    return obter_itinerario_oficial()


@app.post("/api/v1/telemetry/collaborative")
async def post_collaborative_telemetry(payload: CollaborativeIn):
    """
    Endpoint para recepção de telemetria colaborativa espontânea dos passageiros.
    Validação de geofencing, limites de acurácia e velocidade.
    Notifica instantaneamente todos os clientes via SSE.
    """
    success, message = collaborative_buffer.add_point(payload)
    if not success:
        raise HTTPException(status_code=422, detail=message)

    # Transmissão imediata via SSE
    current_status = calcular_status_geral().model_dump()
    await event_broker.broadcast("status", current_status)

    return {
        "status": "success",
        "message": message,
        "consolidated": collaborative_buffer.get_consolidated_status()
    }


@app.get("/api/v1/telemetry/collaborative/latest", response_model=CollaborativeStatusOut)
async def get_latest_collaborative():
    """Retorna a posição geográfica colaborativa ativa (ou status inativo se expirada)."""
    return collaborative_buffer.get_consolidated_status()


@app.post("/api/v1/simulation/step")
async def simulation_step():
    """
    Avança um passo na simulação de rota.
    Notifica instantaneamente todos os clientes conectados via SSE.
    """
    idx = sim_state["index"]
    wp = SIMULATION_WAYPOINTS[idx]

    # Atualiza o buffer com o ponto exato da simulação
    collaborative_buffer._points.clear()
    collab_input = CollaborativeIn(
        latitude=wp["lat"],
        longitude=wp["lon"],
        accuracy=5.0,
        speed=wp["speed"],
        heading=145.0,
        client_timestamp=datetime.now(timezone.utc)
    )
    collaborative_buffer.add_point(collab_input)

    sim_state["index"] = (idx + 1) % len(SIMULATION_WAYPOINTS)
    status_atual = calcular_status_geral()

    # Dispara atualização em tempo real para os clientes conectados
    await event_broker.broadcast("status", status_atual.model_dump())

    return {
        "simulated_point": wp,
        "step": idx + 1,
        "total_steps": len(SIMULATION_WAYPOINTS),
        "status": status_atual
    }


@app.post("/api/v1/simulation/reset")
async def simulation_reset():
    """Reinicia a simulação para o CCHLA e transmite atualização imediata."""
    sim_state["index"] = 0
    collaborative_buffer._points.clear()
    status_atual = calcular_status_geral()
    await event_broker.broadcast("status", status_atual.model_dump())
    return {"message": "Simulação reiniciada."}
