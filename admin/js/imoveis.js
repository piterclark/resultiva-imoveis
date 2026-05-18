async function loadImoveis() {
    const status = document.getElementById('filter-status')?.value;
    let query = sb.from('imoveis').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    const tbody = document.getElementById('imoveis-tbody');

    if (error || !data?.length) {
        tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><span class="empty-icon">🏠</span>Nenhum imóvel encontrado</div></td></tr>';
        return;
    }

    tbody.innerHTML = data.map(i => `
        <tr>
            <td>
                <div class="property-thumb">
                    ${i.foto_capa
                        ? `<img src="${i.foto_capa}" class="thumb-sm" onerror="this.style.display='none'">`
                        : '<div style="width:48px;height:36px;background:var(--bg);border-radius:6px"></div>'}
                    <div>
                        <div style="font-weight:600;font-size:13px">${i.titulo}</div>
                        <div style="color:var(--muted);font-size:11px">${i.bairro || ''} ${i.metragem ? '· ' + i.metragem + 'm²' : ''}</div>
                    </div>
                </div>
            </td>
            <td style="text-transform:capitalize;font-size:13px">${i.tipo}</td>
            <td><strong>${formatPrice(i.preco)}</strong></td>
            <td>
                <select onchange="updateImStatus('${i.id}', this.value)" class="form-control-admin" style="padding:4px 8px;font-size:12px;width:auto">
                    <option value="disponivel"    ${i.status==='disponivel'    ?'selected':''}>Disponível</option>
                    <option value="em_negociacao" ${i.status==='em_negociacao' ?'selected':''}>Em negociação</option>
                    <option value="reservado"     ${i.status==='reservado'     ?'selected':''}>Reservado</option>
                    <option value="vendido"       ${i.status==='vendido'       ?'selected':''}>Vendido</option>
                </select>
            </td>
            <td>
                <button onclick="toggleDestaque('${i.id}',${i.destaque})"
                    class="btn-admin btn-sm ${i.destaque ? 'btn-accent-sm' : 'btn-outline-admin'}">
                    ${i.destaque ? '⭐ Sim' : '— Não'}
                </button>
            </td>
            <td>
                <button onclick="togglePublicado('${i.id}',${i.publicado})"
                    class="btn-admin btn-sm ${i.publicado ? 'btn-accent-sm' : 'btn-outline-admin'}">
                    ${i.publicado ? '✓ Sim' : '✗ Não'}
                </button>
            </td>
            <td>
                <div class="flex gap-2">
                    <a href="imovel-form.html?id=${i.id}" class="btn-admin btn-outline-admin btn-sm">Editar</a>
                    <button onclick="deleteImovel('${i.id}')" class="btn-admin btn-danger-sm btn-sm">Excluir</button>
                </div>
            </td>
        </tr>`).join('');
}

async function updateImStatus(id, status) {
    await sb.from('imoveis').update({ status }).eq('id', id);
    showToast('Status atualizado', 'success');
}

async function toggleDestaque(id, current) {
    await sb.from('imoveis').update({ destaque: !current }).eq('id', id);
    loadImoveis();
}

async function togglePublicado(id, current) {
    await sb.from('imoveis').update({ publicado: !current }).eq('id', id);
    loadImoveis();
}

async function deleteImovel(id) {
    if (!confirm('Excluir este imóvel permanentemente?')) return;
    await sb.from('imoveis').delete().eq('id', id);
    showToast('Imóvel excluído');
    loadImoveis();
}
