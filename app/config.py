"""
Configurações do LocBUS e do Módulo Colaborativo de Telemetria (Crowdsourcing).
"""
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

class Settings(BaseModel):
    APP_NAME: str = "LocBUS - Mobilidade Circular Universitária"
    APP_VERSION: str = "2.3.0-pwa-realtime"
    
    # Diretórios
    TEMPLATES_DIR: Path = BASE_DIR / "Templates"
    STATIC_DIR: Path = BASE_DIR / "static"
    DATA_DIR: Path = PROJECT_ROOT / "data"
    TELEMETRY_DIR: Path = DATA_DIR / "telemetria"
    
    # Parâmetros da Janela de Telemetria Colaborativa
    COLLABORATIVE_TTL_SECONDS: int = 180  # Coordenada expira após 3 minutos sem atualização
    COLLABORATIVE_GEOFENCE_TOLERANCE_METERS: float = 250.0  # Envelope de tolerância do corredor viário (250m)
    COLLABORATIVE_MIN_ACCURACY_METERS: float = 250.0  # Descartar leituras com erro maior que 250m
    COLLABORATIVE_MAX_SPEED_KMH: float = 85.0  # Descarte se v > 85km/h (incompatível com ônibus urbano)
    COLLABORATIVE_SAMPLING_INTERVAL_SEC: int = 10  # Intervalo recomendado de envio pelo frontend
    
    # Coordenadas de Referência (UFPB Campus I e Mangabeira)
    PONTO_CCHLA: tuple[float, float] = (-7.1397, -34.8450)
    PONTO_CI: tuple[float, float] = (-7.1627, -34.8182)
    
    # Bounding Box Oficial do Corredor (AUD_13)
    BBOX_NORTH: float = -7.132171
    BBOX_SOUTH: float = -7.171978
    BBOX_WEST: float = -34.861144
    BBOX_EAST: float = -34.807573

settings = Settings()
