"""
Testes automatizados para validação do Módulo Colaborativo do LocBUS.
"""
from fastapi.testclient import TestClient
from app.main import app
from app.services import collaborative_buffer, calcular_status_geral

client = TestClient(app)

def test_home_page_renders():
    """Garante que a página inicial HTML é servida com sucesso (HTTP 200)."""
    response = client.get("/")
    assert response.status_code == 200
    assert "LocBUS" in response.text
    assert "Estou no Ônibus • Compartilhar" in response.text
    assert "lgpd-modal" in response.text

def test_status_endpoint():
    """Valida o contrato do endpoint de status geral."""
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert "origem" in data
    assert "destino" in data
    assert "eta_minutos" in data
    assert "modo_rastreamento" in data

def test_valid_collaborative_telemetry():
    """Testa envio de coordenada válida dentro do corredor UFPB."""
    collaborative_buffer._points.clear()
    
    payload = {
        "latitude": -7.1465,
        "longitude": -34.8390,
        "accuracy": 12.0,
        "speed": 32.5,
        "heading": 180.0
    }
    response = client.post("/api/v1/telemetry/collaborative", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    
    # Verifica que o buffer agora está ativo
    latest_resp = client.get("/api/v1/telemetry/collaborative/latest")
    assert latest_resp.status_code == 200
    latest_data = latest_resp.json()
    assert latest_data["active"] is True
    assert latest_data["collaborators_count"] == 1
    assert latest_data["latitude"] == -7.1465

def test_invalid_collaborative_geofence():
    """Testa rejeição de coordenada fora do perímetro da UFPB/Mangabeira (ex: em outra cidade)."""
    payload = {
        "latitude": -23.5505, # São Paulo
        "longitude": -46.6333,
        "accuracy": 10.0,
        "speed": 20.0
    }
    response = client.post("/api/v1/telemetry/collaborative", json=payload)
    assert response.status_code == 422
    assert "fora do perímetro" in response.json()["detail"]

def test_invalid_speed_limit():
    """Testa descarte de velocidades anômalas (ex: 120 km/h)."""
    payload = {
        "latitude": -7.1465,
        "longitude": -34.8390,
        "accuracy": 10.0,
        "speed": 120.0 # Excessivo para ônibus urbano
    }
    response = client.post("/api/v1/telemetry/collaborative", json=payload)
    assert response.status_code == 422
    assert "Velocidade reportada" in response.json()["detail"]

def test_simulation_step():
    """Valida o avanço do modo de simulação."""
    response = client.post("/api/v1/simulation/step")
    assert response.status_code == 200
    data = response.json()
    assert "simulated_point" in data
    assert "step" in data
    assert data["step"] >= 1

def test_history_endpoint():
    """Valida endpoint de histórico com dados reais reconstruídos dos CSVs."""
    response = client.get("/api/v1/history")
    assert response.status_code == 200
    data = response.json()
    assert "viagens" in data
    assert "estatisticas" in data
    assert data["estatisticas"]["total_viagens"] >= 1
    assert "grafico_dias" in data

def test_itinerary_endpoint():
    """Valida endpoint de itinerário e horários programados."""
    response = client.get("/api/v1/itinerary")
    assert response.status_code == 200
    data = response.json()
    assert "paradas" in data
    assert len(data["paradas"]) == 8
    assert "horarios" in data
    assert "manha" in data["horarios"]
    assert "tarde" in data["horarios"]
    assert "noite" in data["horarios"]


def test_history_export_csv():
    """Valida o endpoint de download do histórico em CSV."""
    response = client.get("/api/v1/history/export")
    assert response.status_code == 200
    assert "text/csv" in response.headers.get("content-type", "")
    assert "attachment" in response.headers.get("content-disposition", "")
    content = response.text
    assert "Data,Origem,Destino" in content
    assert "CCHLA" in content
    assert "CI" in content


