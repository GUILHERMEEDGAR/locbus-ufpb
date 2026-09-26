/**
 * tabs.js - Gerenciamento de abas (Mapa, Histórico, Itinerário, Sobre),
 * filtros interativos da tabela de viagens e alternador de turnos.
 * Autor: Guilherme Edgar C.S.R. Guedes
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Alternância de Abas Principais
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (!targetId) return;

      // Atualiza botões
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Atualiza visualizações
      tabViews.forEach(view => {
        if (view.id === targetId) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      // Se ativou o mapa, revalida dimensões do Leaflet
      if (targetId === 'tab-view-mapa' && window.map) {
        setTimeout(() => {
          window.map.invalidateSize();
        }, 150);
      }
    });
  });

  // 2. Alternância de Turnos no Itinerário (Manhã, Tarde, Noite)
  const shiftButtons = document.querySelectorAll('.shift-btn');
  const shiftPanels = document.querySelectorAll('.shift-panel');

  shiftButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const shift = btn.getAttribute('data-shift');
      if (!shift) return;

      shiftButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      shiftPanels.forEach(panel => {
        if (panel.id === `shift-${shift}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // 3. Filtros Rápidos da Tabela de Viagens (Histórico)
  const pillFilters = document.querySelectorAll('.pill-filter');
  const tripRows = document.querySelectorAll('#trips-table tbody tr');
  const searchInput = document.getElementById('input-search-trip');

  function applyFilters() {
    const activePill = document.querySelector('.pill-filter.active');
    const filterType = activePill ? activePill.getAttribute('data-filter') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    tripRows.forEach(row => {
      const origem = row.getAttribute('data-origem') || '';
      const destino = row.getAttribute('data-destino') || '';
      const date = row.getAttribute('data-date') || '';
      const text = row.textContent.toLowerCase();

      let matchType = true;
      if (filterType === 'cchla-ci') {
        matchType = (origem === 'CCHLA' && destino === 'CI');
      } else if (filterType === 'ci-cchla') {
        matchType = (origem === 'CI' && destino === 'CCHLA');
      }

      let matchQuery = true;
      if (query) {
        matchQuery = text.includes(query);
      }

      if (matchType && matchQuery) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  pillFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      pillFilters.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
});
