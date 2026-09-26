"""
Testes automatizados para validação do canal de Server-Sent Events (SSE) do LocBUS.
"""
import asyncio
import json
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.events import event_broker

client = TestClient(app)


def test_events_stats_endpoint():
    """Valida o endpoint de métricas operacionais do broker SSE."""
    response = client.get("/api/v1/events/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["protocol"] == "Server-Sent Events (SSE)"
    assert "active_clients" in data
    assert "heartbeat_interval_seconds" in data
    assert data["heartbeat_interval_seconds"] == 15


@pytest.mark.anyio
async def test_event_broker_pub_sub():
    """Valida o broadcasting assíncrono para assinantes conectados."""
    queue = await event_broker.subscribe()
    assert event_broker.active_subscribers_count >= 1

    test_payload = {
        "origem": "CCHLA",
        "destino": "CI",
        "estado": "EM_ROTA",
        "eta_minutos": "14 min"
    }
    await event_broker.broadcast("status", test_payload)

    msg = await queue.get()
    assert msg["event"] == "status"
    assert msg["data"] == test_payload

    await event_broker.unsubscribe(queue)


@pytest.mark.anyio
async def test_sse_endpoint_asgi_stream():
    """
    Valida que a rota /api/v1/events inicia o canal de streaming ASGI
    e envia o payload inicial de status conforme o padrão SSE (text/event-stream).
    """
    messages_received = []

    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": "GET",
        "path": "/api/v1/events",
        "raw_path": b"/api/v1/events",
        "query_string": b"",
        "headers": [],
        "client": ("127.0.0.1", 50000),
        "server": ("127.0.0.1", 80),
    }

    async def receive():
        return {"type": "http.disconnect"}

    async def send(message):
        messages_received.append(message)
        if message["type"] == "http.response.body" and message.get("body"):
            # Cancela após receber o primeiro evento SSE
            raise asyncio.CancelledError()

    try:
        await app(scope, receive, send)
    except (asyncio.CancelledError, GeneratorExit):
        pass

    types = [m["type"] for m in messages_received]
    assert "http.response.start" in types
    assert "http.response.body" in types

    start_msg = next(m for m in messages_received if m["type"] == "http.response.start")
    assert start_msg["status"] == 200
    headers = dict(start_msg["headers"])
    assert b"text/event-stream" in headers.get(b"content-type", b"")

    body_msg = next(m for m in messages_received if m["type"] == "http.response.body" and m.get("body"))
    raw_body = body_msg["body"].decode("utf-8")
    assert "event: status" in raw_body
    assert "data: " in raw_body

    # Extrai e valida o JSON enviado
    data_line = [l for l in raw_body.split("\n") if l.startswith("data: ")][0]
    data = json.loads(data_line.replace("data: ", ""))
    assert "origem" in data
    assert "destino" in data
    assert "eta_minutos" in data
