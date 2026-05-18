async function loadLeads() {
    const status = document.getElementById('filter-status')?.value;
    let query = sb.from('leads').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    const tbody = document.getElementById('leads-tbody');

    if (error || !data?.length) {
        tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><span class="empty-icon">📭</span>Nenhum lead recebido ainda</div></td></tr>';
        return;
    }

    tbody.innerHTML = data.map(l => {
        const tel = l.telefone ? l.telefone.replace(/\D/g, '') : '';
        return `
        <tr>
            <td><strong>${l.nome}</strong></td>
            <td>
                ${l.telefone
                    ? `<a href="https://wa.me/55${tel}" target="_blank" class="btn-admin btn-outline-admin btn-sm" style="white-space:nowrap">
                           📱 ${l.telefone}
                       </a>`
                    : '<span style="color:var(--muted)">—</span>'}
            </td>
            <td style="font-size:12px;color:var(--muted)">${l.email || '—'}</td>
            <td style="max-width:220px;font-size:12px;color:var(--muted)">
                <span title="${l.mensagem || ''}">${(l.mensagem || '—').substring(0, 55)}${(l.mensagem || '').length > 55 ? '...' : ''}</span>
            </td>
            <td>
                <select onchange="updateLeadStatus('${l.id}', this.value)" class="form-control-admin" style="padding:4px 8px;font-size:12px;width:auto">
                    <option value="novo"           ${l.status==='novo'           ?'selected':''}>Novo</option>
                    <option value="em_contato"     ${l.status==='em_contato'     ?'selected':''}>Em contato</option>
                    <option value="visita_marcada" ${l.status==='visita_marcada' ?'selected':''}>Visita marcada</option>
                    <option value="proposta"       ${l.status==='proposta'       ?'selected':''}>Proposta</option>
                    <option value="fechado"        ${l.status==='fechado'        ?'selected':''}>Fechado</option>
                    <option value="perdido"        ${l.status==='perdido'        ?'selected':''}>Perdido</option>
                </select>
            </td>
            <td style="color:var(--muted);font-size:11px;white-space:nowrap">${formatDate(l.created_at)}</td>
            <td>
                <button onclick="deleteLead('${l.id}')" class="btn-admin btn-danger-sm btn-sm">Excluir</button>
            </td>
        </tr>`;
    }).join('');
}

async function updateLeadStatus(id, status) {
    await sb.from('leads').update({ status }).eq('id', id);
    showToast('Status atualizado', 'success');
}

async function deleteLead(id) {
    if (!confirm('Excluir este lead?')) return;
    await sb.from('leads').delete().eq('id', id);
    showToast('Lead excluído');
    loadLeads();
}
