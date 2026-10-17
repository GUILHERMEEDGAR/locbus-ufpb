"""
Testes automatizados para validação do recurso de Seleção de Parada e Confirmação de Chegada do Ônibus.
"""
from fastapi.testclient import TestClient
from app.main import app
from app.services import stop_reports_manager

client = TestClient(app)

def test_user_stop_report_arrived():
    """Valida registro de relato de que o ônibus chegou na parada."""
    stop_reports_manager._reports.clear()

    payload = {
        "stop_id": 7,
        "stop_name": "CCJ (Direito)",
        "status": "chegou",
        "latitude": -7.14187,
        "longitude": -34.84888
    }
    response = client.post("/api/v1/stops/report", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "CCJ" in data["message"]
    assert data["summary"]["stop_id"] == 7
    assert data["summary"]["status"] == "chegou"
    assert data["summary"]["total_confirmacoes"] == 1


def test_user_stop_report_waiting_and_departed():
    """Valida relatos de espera e partida de uma parada."""
    stop_reports_manager._reports.clear()

    # Relato de espera
    resp_wait = client.post("/api/v1/stops/report", json={
        "stop_id": 4,
        "stop_name": "CCTA",
        "status": "nao_chegou"
    })
    assert resp_wait.status_code == 200
    assert resp_wait.json()["summary"]["status"] == "nao_chegou"

    # Relato de partida
    resp_dep = client.post("/api/v1/stops/report", json={
        "stop_id": 4,
        "stop_name": "CCTA",
        "status": "partiu"
    })
    assert resp_dep.status_code == 200
    assert resp_dep.json()["summary"]["status"] == "partiu"
    assert resp_dep.json()["summary"]["total_confirmacoes"] == 2


def test_get_all_stop_reports():
    """Garante que a lista consolidada de relatos por parada é retornada corretamente."""
    stop_reports_manager._reports.clear()

    client.post("/api/v1/stops/report", json={
        "stop_id": 1,
        "stop_name": "ETS",
        "status": "chegou"
    })
    client.post("/api/v1/stops/report", json={
        "stop_id": 6,
        "stop_name": "CT",
        "status": "nao_chegou"
    })

    response = client.get("/api/v1/stops/reports")
    assert response.status_code == 200
    data = response.json()
    assert data["total_active_stops"] == 2
    assert "1" in data["reports"] or 1 in data["reports"]
    assert "6" in data["reports"] or 6 in data["reports"]


def test_invalid_stop_report_status():
    """Verifica rejeição (422) quando o status é inválido."""
    payload = {
        "stop_id": 5,
        "stop_name": "CCHLA",
        "status": "status_inexistente"
    }
    response = client.post("/api/v1/stops/report", json=payload)
    assert response.status_code == 422
