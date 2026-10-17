"""
Testes automatizados para a versão embarcada do aplicativo (LocBUS Tracker).
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_tracker_page_renders():
    """Garante que a página dedicada do rastreador embarcado é servida com sucesso."""
    response = client.get("/tracker")
    assert response.status_code == 200
    assert "LocBUS Tracker" in response.text
    assert "Dispositivo Embarcado" in response.text
    assert "mini-radar-map" in response.text
    assert "Wake Lock" in response.text
    assert "TRANSMISSÃO ATIVA" in response.text


def test_tracker_page_aliases():
    """Garante que as rotas amigáveis /onibus e /motorista funcionam."""
    resp_onibus = client.get("/onibus")
    assert resp_onibus.status_code == 200
    assert "LocBUS Tracker" in resp_onibus.text

    resp_motorista = client.get("/motorista")
    assert resp_motorista.status_code == 200
    assert "LocBUS Tracker" in resp_motorista.text


def test_tracker_manifest():
    """Garante entrega correta do manifest PWA do rastreador."""
    response = client.get("/manifest-tracker.webmanifest")
    assert response.status_code == 200
    data = response.json()
    assert data["short_name"] == "LocBUS Tracker"
    assert data["start_url"] == "/tracker"
    assert data["display"] == "standalone"


def test_eduroam_batch_telemetry():
    """Valida o descarregamento em lote de pontos acumulados offline durante o percurso."""
    batch_payload = {
        "points": [
            {
                "latitude": -7.1397,
                "longitude": -34.8450,
                "accuracy": 8.0,
                "speed": 25.0,
                "heading": 120.0,
                "client_timestamp": "2026-10-17T16:00:00Z"
            },
            {
                "latitude": -7.1425,
                "longitude": -34.8420,
                "accuracy": 7.5,
                "speed": 30.0,
                "heading": 135.0,
                "client_timestamp": "2026-10-17T16:00:04Z"
            },
            {
                "latitude": -7.1448,
                "longitude": -34.8404,
                "accuracy": 9.0,
                "speed": 28.0,
                "heading": 140.0,
                "client_timestamp": "2026-10-17T16:00:08Z"
            }
        ]
    }
    response = client.post("/api/v1/telemetry/collaborative/batch", json=batch_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_points"] == 3
    assert data["accepted_points"] >= 1
    assert "Buffer Eduroam" in data["message"]

