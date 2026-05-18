function statusBadge(status) {
    const map = {
        disponivel:      ['badge-success', 'Disponível'],
        em_negociacao:   ['badge-warning', 'Em negociação'],
        reservado:       ['badge-info',    'Reservado'],
        vendido:         ['badge-danger',  'Vendido'],
        novo:            ['badge-accent',  'Novo'],
        em_contato:      ['badge-info',    'Em contato'],
        visita_marcada:  ['badge-warning', 'Visita marcada'],
        proposta:        ['badge-warning', 'Proposta'],
        fechado:         ['badge-success', 'Fechado'],
        perdido:         ['badge-danger',  'Perdido'],
    };
    const [cls, label] = map[status] || ['badge-muted', status || '—'];
    return `<span class="badge ${cls}">${label}</span>`;
}

function formatPrice(v) {
    return 'R$ ' + Number(v).toLocaleString('pt-BR');
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

function showToast(msg, type = 'dark') {
    const t = document.createElement('div');
    t.textContent = msg;
    const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#111827';
    t.style.cssText = `position:fixed;bottom:24px;right:24px;background:${bg};color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;z-index:9999;opacity:0;transition:.3s;box-shadow:0 4px 12px rgba(0,0,0,.2)`;
    document.body.appendChild(t);
    setTimeout(() => t.style.opacity = '1', 10);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

async function loadDashboard() {
    const [{ data: imoveis }, { data: leads }] = await Promise.all([
        sb.from('imoveis').select('status, destaque, publicado, titulo, bairro, preco, foto_capa, id'),
        sb.from('leads').select('*').order('created_at', { ascending: false })
    ]);

    document.getElementById('stat-ativos').textContent   = imoveis?.filter(i => i.status !== 'vendido').length ?? '—';
    document.getElementById('stat-vendidos').textContent = imoveis?.filter(i => i.status === 'vendido').length ?? '—';
    document.getElementById('stat-leads').textContent    = leads?.length ?? '—';
    document.getElementById('stat-novos').textContent    = leads?.filter(l => l.status === 'novo').length ?? '—';

    // Recent leads
    const leadsBody = document.getElementById('leads-tbody');
    const recent = (leads || []).slice(0, 8);
    if (!recent.length) {
        leadsBody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><span class="empty-icon">📭</span>Nenhum lead ainda</div></td></tr>';
    } else {
        leadsBody.innerHTML = recent.map(l => `
            <tr>
                <td><strong>${l.nome}</strong></td>
                <td>
                    ${l.telefone ? `<div>${l.telefone}</div>` : ''}
                    ${l.email ? `<div style="color:var(--muted);font-size:11px">${l.email}</div>` : ''}
                </td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);font-size:12px">
                    ${l.mensagem || '—'}
                </td>
                <td>${statusBadge(l.status)}</td>
                <td style="color:var(--muted);font-size:11px;white-space:nowrap">${formatDate(l.created_at)}</td>
            </tr>`).join('');
    }

    // Imoveis table
    const imoveisBody = document.getElementById('imoveis-tbody');
    const list = (imoveis || []).slice(0, 6);
    if (!list.length) {
        imoveisBody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><span class="empty-icon">🏠</span>Nenhum imóvel</div></td></tr>';
    } else {
        imoveisBody.innerHTML = list.map(i => `
            <tr>
                <td>
                    <div class="property-thumb">
                        ${i.foto_capa ? `<img src="${i.foto_capa}" class="thumb-sm" onerror="this.style.display='none'">` : '<div style="width:48px;height:36px;background:var(--bg);border-radius:6px"></div>'}
                        <div>
                            <div style="font-weight:600;font-size:13px">${i.titulo}</div>
                            <div style="color:var(--muted);font-size:11px">${i.bairro || ''}</div>
                        </div>
                    </div>
                </td>
                <td>${statusBadge(i.status)}</td>
                <td><strong>${formatPrice(i.preco)}</strong></td>
                <td>${i.destaque ? '<span class="badge badge-accent">⭐ Destaque</span>' : '<span class="badge badge-muted">—</span>'}</td>
                <td><a href="imovel-form.html?id=${i.id}" class="btn-admin btn-outline-admin btn-sm">Editar</a></td>
            </tr>`).join('');
    }
}
