# Imagem base oficial Python otimizada
FROM python:3.12-slim

# Evita criação de arquivos .pyc e ativa buffer imediato nos logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Diretório de trabalho na aplicação
WORKDIR /app

# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala as dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código da aplicação
COPY . .

# Expõe a porta padrão
EXPOSE 8000

# Inicializa o servidor FastAPI com suporte dinâmico à variável $PORT (Render / Nuvem / CEAR)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
