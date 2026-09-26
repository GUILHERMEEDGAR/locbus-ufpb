"""
Modelos e entidades de domínio do LocBUS.
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field

class StatusLocBUS(BaseModel):
    origem: str
    destino: str
    estado: Literal["AGUARDANDO", "EM_ROTA", "DESCONECTADO", "INDETERMINADO"]
    centro_atual: str
    eta_minutos: str
    confiabilidade: str
    modo_rastreamento: Literal["BLE_FIXO", "COLABORATIVO_PASSAGEIRO", "ESTIMADO"]
    ultima_atualizacao: str
    detalhes_colaboracao: Optional[dict] = None
    proxima_parada: Optional[str] = "Reitoria / Praça da Alegria"
    progresso_percentual: Optional[int] = 0
    etas_por_parada: Optional[list[dict]] = None


class CollaborativeIn(BaseModel):
    """
    Payload enviado pelo navegador do passageiro a bordo do ônibus.
    Sem identificação pessoal (LGPD compliant).
    """
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude decimal")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude decimal")
    accuracy: float = Field(..., ge=0.0, le=1000.0, description="Precisão horizontal em metros")
    speed: Optional[float] = Field(None, ge=0.0, le=150.0, description="Velocidade em km/h")
    heading: Optional[float] = Field(None, ge=0.0, le=360.0, description="Rumo em graus")
    client_timestamp: Optional[datetime] = Field(None, description="Horário de captura no celular")


class CollaborativePoint(BaseModel):
    latitude: float
    longitude: float
    accuracy: float
    speed: Optional[float] = None
    heading: Optional[float] = None
    received_at: datetime
    is_valid: bool = True


class CollaborativeStatusOut(BaseModel):
    active: bool
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    accuracy: Optional[float] = None
    speed_kmh: Optional[float] = None
    heading: Optional[float] = None
    source: str = "Crowdsourcing de Passageiros"
    collaborators_count: int = 0
    age_seconds: Optional[int] = None
    human_status: str
