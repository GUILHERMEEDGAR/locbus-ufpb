# 🚀 GUIA DE DEPLOY: NUVEM IMEDIATA (RENDER) & SERVIDOR CEAR/UFPB

Este documento contém o passo a passo completo para colocar o **LocBUS** no ar imediatamente na nuvem para a apresentação, bem como as diretrizes de implantação definitiva no servidor institucional do **Centro de Energias Alternativas e Renováveis (CEAR/UFPB)**.

---

## ☁️ PARTE 1: Deploy Imediato na Nuvem (Render - Gratuito)
*Tempo estimado: 3 a 5 minutos.*

O Render hospeda a aplicação gratuitamente em HTTPS, com link perpétuo e sem depender do computador pessoal ligado.

### Passo 1: Subir as alterações para o GitHub
No terminal do projeto, execute:
```bash
git add .
git commit -m "feat: dockerfile, render blueprint e preparacao para nuvem v1.2.1"
git push origin main
```

### Passo 2: Criar a aplicação no Render
1. Acesse **[dashboard.render.com](https://dashboard.render.com/)** e faça login com sua conta do GitHub.
2. Clique no botão **"New +"** (canto superior direito) e selecione **"Web Service"**.
3. Escolha a opção **"Build and deploy from a Git repository"** e selecione o repositório do **LocBUS**.
4. Preencha os campos simples:
   - **Name:** `locbus-ufpb` *(Importante: este nome gera a URL exata `https://locbus-ufpb.onrender.com` já configurada no APK Android)*
   - **Region:** Ohio (US East) ou Oregon (US West)
   - **Branch:** `main`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan Type:** `Free`
5. Clique em **"Create Web Service"**.

> 💡 **Pronto!** Em cerca de 2 minutos o Render compilará e colocará a aplicação no ar em:  
> **`https://locbus-ufpb.onrender.com`**

---

## 📱 PARTE 2: Aplicativo Android Nativo (`LocBUS-v1.2.1.apk`)

O aplicativo Android já foi compilado, assinado digitalmente e sincronizado:
* **Arquivo gerado:** `LocBUS-v1.2.1.apk` (e alias `LocBUS.apk`)
* **Apontamento:** Conectado nativamente em `https://locbus-ufpb.onrender.com`.
* **Benefício:** Uma vez implantado no Render, qualquer usuário com o app instalado no celular poderá abrir o LocBUS e rastrear o ônibus sem necessidade de cabos, tunnels temporários ou PC ligado.

---

## 🏫 PARTE 3: Implantação Institucional no Servidor do CEAR/UFPB

Para apresentar ao professor e à equipe de TI do CEAR, o projeto já inclui a arquitetura profissional em contêineres e proxy reverso.

### Arquivos preparados no projeto:
1. **`Dockerfile`**: Imagem Linux oficial leve baseada em `python:3.12-slim`.
2. **`docker-compose.yml`**: Orquestrador com política de reinicialização automática (`restart: always`).
3. **`infra_cear/locbus_cear_nginx.conf`**: Configuração do Nginx com suporte vital a **Server-Sent Events (SSE)** (`proxy_buffering off; chunked_transfer_encoding off;`).

### Como a equipe do CEAR coloca no ar:
1. **Clonar o repositório no servidor do CEAR:**
   ```bash
   git clone <URL_DO_REPOSITORIO> /opt/locbus
   cd /opt/locbus
   ```

2. **Subir com Docker Compose:**
   ```bash
   docker compose up -d
   ```

3. **Ativar o Proxy Reverso no Nginx do CEAR:**
   - Copiar `infra_cear/locbus_cear_nginx.conf` para `/etc/nginx/sites-available/locbus.cear.ufpb.br`.
   - Criar o link simbólico e recarregar o Nginx:
     ```bash
     ln -s /etc/nginx/sites-available/locbus.cear.ufpb.br /etc/nginx/sites-enabled/
     nginx -t && systemctl reload nginx
     ```

---

## 📊 Resumo de URLs

| Ambiente | Tipo | Endereço |
|---|---|---|
| **Nuvem Oficial (Apresentação)** | Render (PaaS) | `https://locbus-ufpb.onrender.com` |
| **Local (Desenvolvimento)** | PC Local | `http://127.0.0.1:8000` |
| **Futuro CEAR/UFPB** | Infraestrutura Universitária | `https://locbus.cear.ufpb.br` |
