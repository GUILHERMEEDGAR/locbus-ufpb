"""
Módulo de Eventos em Tempo Real (Server-Sent Events - SSE) para o LocBUS.
Gerencia o canal assíncrono de streaming pub/sub para envio instantâneo
de atualizações de telemetria e coordenadas geográficas aos clientes conectados.
"""
import asyncio
import json
import logging
from typing import Set, Dict, Any, AsyncGenerator

logger = logging.getLogger("locbus.events")


class EventBroker:
    """
    Broker assíncrono pub/sub para Server-Sent Events (SSE).
    Distribui eventos de telemetria e status para múltiplos navegadores sem sobrecarga de rede.
    """
    def __init__(self):
        self._subscribers: Set[asyncio.Queue] = set()
        self._lock = asyncio.Lock()

    async def subscribe(self) -> asyncio.Queue:
        """Registra um novo cliente e retorna uma fila individual de eventos."""
        queue: asyncio.Queue = asyncio.Queue(maxsize=100)
        async with self._lock:
            self._subscribers.add(queue)
        logger.info("Cliente SSE conectado. Clientes ativos: %d", len(self._subscribers))
        return queue

    async def unsubscribe(self, queue: asyncio.Queue) -> None:
        """Remove a fila de um cliente desconectado."""
        async with self._lock:
            self._subscribers.discard(queue)
        logger.info("Cliente SSE desconectado. Clientes ativos: %d", len(self._subscribers))

    async def broadcast(self, event_name: str, data: Dict[str, Any]) -> None:
        """
        Transmite o evento para todos os clientes ativos.
        Em caso de fila cheia em clientes lentos, descarta o item antigo para preservar a baixa latência.
        """
        payload = {"event": event_name, "data": data}
        async with self._lock:
            subscribers = list(self._subscribers)

        for q in subscribers:
            try:
                q.put_nowait(payload)
            except asyncio.QueueFull:
                try:
                    q.get_nowait()
                    q.put_nowait(payload)
                except Exception:
                    pass

    @property
    def active_subscribers_count(self) -> int:
        return len(self._subscribers)


# Instância global do broker SSE
event_broker = EventBroker()
