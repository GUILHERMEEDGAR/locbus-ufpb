"""
Testes automatizados para validação da simulação de rota circular (31 waypoints)
e ciclo de trânsito CCHLA <-> CI do LocBUS.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app, SIMULATION_WAYPOINTS, sim_state

client = TestClient(app)


def test_simulation_reset():
    """Valida que o endpoint de reset retorna o índice para o início (CCHLA)."""
    response = client.post("/api/v1/simulation/reset")
    assert response.status_code == 200
    data = response.json()
    assert "Simulação reiniciada" in data["message"]
    assert sim_state["index"] == 0


def test_simulation_single_step():
    """Valida o avanço de um único passo da simulação."""
    client.post("/api/v1/simulation/reset")

    response = client.post("/api/v1/simulation/step")
    assert response.status_code == 200
    data = response.json()

    assert data["step"] == 1
    assert data["total_steps"] == len(SIMULATION_WAYPOINTS)
    assert data["total_steps"] == 31
    assert data["simulated_point"]["origem"] == "CCHLA"
    assert data["simulated_point"]["destino"] == "CI"
    assert "status" in data


def test_simulation_complete_31_cycle():
    """
    Percorre os 31 waypoints da rota circular completa e valida:
    1. Fase de Ida (CCHLA -> CI): passos 1 a 16.
    2. Fase de Volta (CI -> CCHLA): passos 17 a 31.
    3. Retorno cíclico: passo 32 deve recomeçar do índice 0 (ponto 1).
    """
    client.post("/api/v1/simulation/reset")

    # Percorre todos os 31 pontos
    for expected_step in range(1, 32):
        res = client.post("/api/v1/simulation/step")
        assert res.status_code == 200
        payload = res.json()

        assert payload["step"] == expected_step
        ponto = payload["simulated_point"]

        if expected_step <= 16:
            # Trajeto de Ida
            assert ponto["origem"] == "CCHLA"
            assert ponto["destino"] == "CI"
        else:
            # Trajeto de Volta
            assert ponto["origem"] == "CI"
            assert ponto["destino"] == "CCHLA"

    # Passo 32 deve ciclar de volta ao ponto 1
    res_ciclo = client.post("/api/v1/simulation/step")
    assert res_ciclo.status_code == 200
    payload_ciclo = res_ciclo.json()
    assert payload_ciclo["step"] == 1
    assert payload_ciclo["simulated_point"]["desc"] == SIMULATION_WAYPOINTS[0]["desc"]


def test_simulation_telemetry_consistency():
    """Valida que o avanço da simulação injeta coordenadas válidas e velocidade coerente."""
    client.post("/api/v1/simulation/reset")

    # Passo 1: Parado no CCHLA
    res1 = client.post("/api/v1/simulation/step")
    p1 = res1.json()["simulated_point"]
    assert p1["speed"] == 0.0

    # Passo 8: Em trânsito na Av. Sérgio Guerra (velocidade > 0)
    for _ in range(7):
        res_transit = client.post("/api/v1/simulation/step")

    data_transit = res_transit.json()
    p_transit = data_transit["simulated_point"]
    assert p_transit["speed"] > 0.0
    assert -7.165 <= p_transit["lat"] <= -7.135
    assert -34.850 <= p_transit["lon"] <= -34.815
