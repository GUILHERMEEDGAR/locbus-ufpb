"""
Script de Inicialização da Aplicação de Teste de Geolocalização (Pedras de Fogo)
Executa na porta 8001 para não interferir na aplicação principal LocBUS (porta 8000).
"""
import sys
import subprocess
from pathlib import Path

# Configura encoding UTF-8 no terminal Windows para evitar erro com emojis / acentos
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Auto-detecção e troca automática para o ambiente virtual (.venv) se executado com Python global
BASE_DIR = Path(__file__).resolve().parent
VENV_PYTHON = BASE_DIR / ".venv" / "Scripts" / "python.exe"

if VENV_PYTHON.exists() and Path(sys.executable).resolve() != VENV_PYTHON.resolve():
    script_path = str(Path(__file__).resolve())
    result = subprocess.run([str(VENV_PYTHON), script_path, *sys.argv[1:]])
    sys.exit(result.returncode)

import socket
import uvicorn

def get_local_ip() -> str:
    """Descobre o IP da máquina na rede Wi-Fi / LAN local."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    local_ip = get_local_ip()
    port = 8001

    print("=" * 65)
    print("[*] LOCBUS - AMBIENTE DE TESTE DE LOCALIZACAO (PEDRAS DE FOGO)")
    print("=" * 65)
    print(f"-> Acesso no seu PC:           http://localhost:{port}")
    print(f"-> Acesso no Celular (Wi-Fi):  http://{local_ip}:{port}")
    print("-" * 65)
    print("[i] DICA PARA TESTE NO CELULAR (GPS):")
    print("Navegadores moveis exigem contexto seguro para liberar o GPS.")
    print("Caso acesse pelo IP do Wi-Fi e o GPS nao libere no Chrome do Android:")
    print("1. Abra no Chrome do celular: chrome://flags")
    print("2. Pesquise por: 'Insecure origins treated as secure'")
    print(f"3. Adicione: http://{local_ip}:{port} e marque 'Enabled'")
    print("4. Reinicie o Chrome no celular e o GPS funcionara 100%!")
    print("=" * 65)
    print("Pressione CTRL+C para encerrar o servidor quando terminar.\n")

    uvicorn.run(
        "app_pedras_de_fogo.main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
