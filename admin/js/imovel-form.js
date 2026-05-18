let editId = null;

async function initForm() {
    const params = new URLSearchParams(window.location.search);
    editId = params.get('id');
    if (editId) {
        document.getElementById('form-title').textContent = 'Editar Imóvel';
        const { data } = await sb.from('imoveis').select('*').eq('id', editId).single();
        if (data) fillForm(data);
    }
}

function fillForm(d) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
    set('titulo', d.titulo); set('tipo', d.tipo); set('finalidade', d.finalidade);
    set('descricao', d.descricao); set('bairro', d.bairro); set('cidade', d.cidade || 'Belém');
    set('endereco', d.endereco); set('metragem', d.metragem); set('quartos', d.quartos);
    set('suites', d.suites); set('banheiros', d.banheiros); set('vagas', d.vagas);
    set('preco', d.preco); set('status', d.status); set('foto_capa', d.foto_capa);

    document.getElementById('publicado').checked = d.publicado !== false;
    document.getElementById('destaque').checked  = !!d.destaque;

    if (d.foto_capa) {
        document.getElementById('foto-preview').innerHTML =
            `<img src="${d.foto_capa}" style="width:100%;height:180px;object-fit:cover;border-radius:8px" onerror="this.style.display='none'">`;
    }
}

async function saveImovel() {
    const titulo = document.getElementById('titulo').value.trim();
    const preco  = parseFloat(document.getElementById('preco').value);
    if (!titulo || !preco) { showFormAlert('Preencha o título e o preço.', 'error'); return; }

    const payload = {
        titulo, preco,
        tipo:        document.getElementById('tipo').value,
        finalidade:  document.getElementById('finalidade').value,
        descricao:   document.getElementById('descricao').value  || null,
        bairro:      document.getElementById('bairro').value     || null,
        cidade:      document.getElementById('cidade').value     || 'Belém',
        endereco:    document.getElementById('endereco').value   || null,
        metragem:    parseFloat(document.getElementById('metragem').value)  || null,
        quartos:     parseInt(document.getElementById('quartos').value)     || 0,
        suites:      parseInt(document.getElementById('suites').value)      || 0,
        banheiros:   parseInt(document.getElementById('banheiros').value)   || 0,
        vagas:       parseInt(document.getElementById('vagas').value)       || 0,
        status:      document.getElementById('status').value,
        publicado:   document.getElementById('publicado').checked,
        destaque:    document.getElementById('destaque').checked,
        foto_capa:   document.getElementById('foto_capa').value  || null,
    };

    const btn = document.querySelector('.topbar-actions .btn-admin');
    if (btn) { btn.textContent = 'Salvando...'; btn.disabled = true; }

    const op = editId
        ? sb.from('imoveis').update(payload).eq('id', editId)
        : sb.from('imoveis').insert([payload]);

    const { error } = await op;

    if (error) {
        showFormAlert('Erro ao salvar: ' + error.message, 'error');
        if (btn) { btn.innerHTML = '<i data-lucide="save"></i> Salvar Imóvel'; btn.disabled = false; }
    } else {
        showFormAlert('Imóvel salvo com sucesso! Redirecionando...', 'success');
        setTimeout(() => window.location.href = 'imoveis.html', 1400);
    }
}

function showFormAlert(msg, type) {
    const el = document.getElementById('form-alert');
    el.textContent = msg;
    el.className = `alert alert-${type}`;
    el.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
