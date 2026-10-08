"""
Aplicação de Teste de Telemetria e Compartilhamento de Localização
Configurada para testes locais em Pedras de Fogo - PB / PE
"""
import asyncio
from datetime import datetime, timezone
import json
import math
from typing import List, Optional
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="LocBUS - Teste Pedras de Fogo",
    description="Ambiente de validação de envio de coordenadas GPS e streaming de telemetria em tempo real"
)

# Servir estáticos e templates
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Ponto de referência: Centro de Pedras de Fogo - PB
PEDRAS_DE_FOGO_CENTER = {
    "lat": -7.4021,
    "lon": -35.1164,
    "cidade": "Pedras de Fogo - PB"
}

class TelemetryPayload(BaseModel):
    latitude: float = Field(..., description="Latitude do dispositivo")
    longitude: float = Field(..., description="Longitude do dispositivo")
    accuracy: float = Field(..., description="Precisão em metros do GPS")
    speed: Optional[float] = Field(None, description="Velocidade em km/h")
    heading: Optional[float] = Field(None, description="Direção do movimento (graus)")
    client_timestamp: Optional[str] = None
    device_id: Optional[str] = "usuario-teste"

class TelemetryRecord(BaseModel):
    latitude: float
    longitude: float
    accuracy: float
    speed: Optional[float]
    heading: Optional[float]
    received_at: str
    age_seconds: int = 0
    device_id: str

# Buffer em memória e fila SSE para broadcast instantâneo
telemetry_history: List[dict] = []
event_subscribers: List[asyncio.Queue] = []

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2.0)**2
    return R * 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

@app.get("/", response_class=HTMLResponse)
async def index_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "center": PEDRAS_DE_FOGO_CENTER,
            "total_points": len(telemetry_history)
        }
    )

@app.post("/api/telemetry")
async def receive_telemetry(payload: TelemetryPayload):
    now = datetime.now()
    now_str = now.strftime("%H:%M:%S")

    # Calcula distância até a referência de Pedras de Fogo
    dist_ref = haversine_km(
        payload.latitude, payload.longitude,
        PEDRAS_DE_FOGO_CENTER["lat"], PEDRAS_DE_FOGO_CENTER["lon"]
    )

    record = {
        "latitude": round(payload.latitude, 6),
        "longitude": round(payload.longitude, 6),
        "accuracy": round(payload.accuracy, 1),
        "speed": round(payload.speed, 1) if payload.speed is not None else 0.0,
        "heading": round(payload.heading, 1) if payload.heading is not None else None,
        "received_at": now_str,
        "timestamp_iso": now.isoformat(),
        "device_id": payload.device_id or "usuario-teste",
        "distancia_centro_km": round(dist_ref, 2)
    }

    # Armazena últimos 200 pontos
    telemetry_history.append(record)
    if len(telemetry_history) > 200:
        telemetry_history.pop(0)

    # Dispara broadcast SSE para todos os clientes conectados
    data_json = json.dumps(record)
    for q in list(event_subscribers):
        try:
            q.put_nowait(f"data: {data_json}\n\n")
        except Exception:
            pass

    return {
        "status": "success",
        "message": "Ponto de telemetria recebido em Pedras de Fogo!",
        "point": record,
        "total_recorded": len(telemetry_history)
    }

@app.get("/api/status")
async def get_status():
    latest = telemetry_history[-1] if telemetry_history else None
    return {
        "total_points": len(telemetry_history),
        "latest": latest,
        "history": telemetry_history[-30:] # Últimos 30 pontos para o rastro
    }

@app.post("/api/clear")
async def clear_history():
    telemetry_history.clear()
    return {"status": "cleared", "total_points": 0}

@app.get("/api/events")
async def sse_stream(request: Request):
    queue: asyncio.Queue = asyncio.Queue()
    event_subscribers.append(queue)

    async def event_generator():
        try:
            # Envia evento de boas-vindas inicial
            yield f"event: connected\ndata: {json.dumps({'message': 'Conectado ao SSE de Pedras de Fogo'})}\n\n"
            
            # Se já houver um ponto gravado, envia de imediato
            if telemetry_history:
                yield f"data: {json.dumps(telemetry_history[-1])}\n\n"

            while True:
                if await request.is_disconnected():
                    break
                try:
                    # Aguarda nova mensagem com timeout de 15s para envio de heartbeat
                    msg = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield msg
                except asyncio.TimeoutError:
                    yield ": ping\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            if queue in event_subscribers:
                event_subscribers.remove(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
