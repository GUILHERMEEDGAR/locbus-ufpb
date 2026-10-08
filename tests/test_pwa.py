"""
Testes automatizados para validação do suporte a Progressive Web App (PWA) do LocBUS.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_manifest_webmanifest_endpoint():
    """Valida a entrega e o esquema do arquivo manifest.webmanifest."""
    response = client.get("/manifest.webmanifest")
    assert response.status_code == 200
    assert "application/manifest+json" in response.headers.get("content-type", "")

    manifest = response.json()
    assert manifest["short_name"] == "LocBUS"
    assert manifest["display"] == "standalone"
    assert manifest["start_url"] == "/"
    assert manifest["theme_color"] == "#090d16"
    assert len(manifest["icons"]) >= 3

    # Verifica se os ícones declarados possuem resoluções padrão PWA
    sizes = [icon["sizes"] for icon in manifest["icons"]]
    assert "192x192" in sizes
    assert "512x512" in sizes

    # Verifica shortcuts
    assert len(manifest["shortcuts"]) >= 2


def test_manifest_json_alias():
    """Garante compatibilidade com o caminho alternativo /manifest.json."""
    response = client.get("/manifest.json")
    assert response.status_code == 200
    assert "application/manifest+json" in response.headers.get("content-type", "")
    assert response.json()["short_name"] == "LocBUS"


def test_service_worker_endpoint():
    """Valida a entrega do sw.js com os cabeçalhos de escopo raiz obrigatórios."""
    response = client.get("/sw.js")
    assert response.status_code == 200
    assert "application/javascript" in response.headers.get("content-type", "")
    assert response.headers.get("Service-Worker-Allowed") == "/"

    sw_code = response.text
    assert "locbus-" in sw_code
    assert "PRECACHE_ASSETS" in sw_code
    assert "cartocdn.com" in sw_code  # Estratégia de cache dos mapas


def test_pwa_icons_and_favicon():
    """Valida se os arquivos de ícones PNG e SVG estão acessíveis."""
    resp_icon192 = client.get("/static/icons/icon-192.png")
    assert resp_icon192.status_code == 200
    assert "image/png" in resp_icon192.headers.get("content-type", "")

    resp_icon512 = client.get("/static/icons/icon-512.png")
    assert resp_icon512.status_code == 200
    assert "image/png" in resp_icon512.headers.get("content-type", "")

    resp_svg = client.get("/static/icons/icon.svg")
    assert resp_svg.status_code == 200
    assert "image/svg+xml" in resp_svg.headers.get("content-type", "")

    resp_fav = client.get("/favicon.ico")
    assert resp_fav.status_code == 200
    assert "image/png" in resp_fav.headers.get("content-type", "")


def test_home_page_pwa_meta_tags():
    """Garante que a página inicial HTML possui todas as meta tags de PWA e elementos de UX."""
    response = client.get("/")
    assert response.status_code == 200
    html = response.text

    assert 'rel="manifest" href="/manifest.webmanifest"' in html
    assert 'name="theme-color" content="#090d16"' in html
    assert 'name="apple-mobile-web-app-capable" content="yes"' in html
    assert 'id="btn-install-pwa"' in html
    assert 'id="offline-banner"' in html
    assert '/static/js/pwa.js' in html
