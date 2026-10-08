import pytest
from fastapi.testclient import TestClient
from app_pedras_de_fogo.main import app

client = TestClient(app)

def test_pedras_de_fogo_index():
    response = client.get("/")
    assert response.status_code == 200
    assert "Pedras de Fogo" in response.text

def test_pedras_de_fogo_telemetry_flow():
    payload = {
        "latitude": -7.40215,
        "longitude": -35.11638,
        "accuracy": 8.5,
        "speed": 15.2,
        "heading": 90.0,
        "device_id": "teste-automatizado"
    }
    # Envio de telemetria
    response = client.post("/api/telemetry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["point"]["latitude"] == -7.40215
    assert data["point"]["device_id"] == "teste-automatizado"

    # Checar status
    status_resp = client.get("/api/status")
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["total_points"] >= 1
    assert status_data["latest"]["latitude"] == -7.40215

    # Limpar buffer
    clear_resp = client.post("/api/clear")
    assert clear_resp.status_code == 200
    assert clear_resp.json()["total_points"] == 0
