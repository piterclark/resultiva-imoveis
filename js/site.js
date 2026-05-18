const SUPABASE_URL = 'https://giaajhfelosbrdtmouia.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SGhAYsMeOMgiA2mvrZHu0w_keKD5fmo';
const siteDb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function fmtPrice(v) {
    return 'R$ ' + Number(v).toLocaleString('pt-BR');
}

// ─ Home: imóvel destaque ─
async function loadFeatured() {
    const el = document.getElementById('featured-card');
    if (!el) return;

    const { data } = await siteDb.from('imoveis')
        .select('*').eq('destaque', true).eq('publicado', true).limit(1).single();

    if (!data) return;

    el.innerHTML = `
        <div class="property-img" style="height:100%">
            <img src="${data.foto_capa || ''}" alt="${data.titulo}" onerror="this.style.display='none'">
            <div class="badge" style="position:absolute;top:20px;left:20px;background:var(--color-primary)">Destaque do Mês</div>
        </div>
        <div class="property-content" style="padding:40px">
            <span class="property-type">${data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1)}</span>
            <h3 class="property-title" style="font-size:2rem;margin-bottom:12px">${data.titulo}</h3>
            <p class="property-location">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                ${data.bairro || ''}, ${data.cidade || 'Belém'} - ${data.estado || 'PA'}
            </p>
            ${data.descricao ? `<p class="mb-3" style="color:var(--color-text-muted)">${data.descricao}</p>` : ''}
            <div class="property-features">
                ${data.suites ? `<div class="feature-item"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg> ${data.suites} Suíte${data.suites > 1 ? 's' : ''}</div>` : data.quartos ? `<div class="feature-item">🛏 ${data.quartos} Quarto${data.quartos > 1 ? 's' : ''}</div>` : ''}
                ${data.metragem ? `<div class="feature-item"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/></svg> ${data.metragem}m²</div>` : ''}
                ${data.vagas ? `<div class="feature-item"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg> ${data.vagas} Vaga${data.vagas > 1 ? 's' : ''}</div>` : ''}
            </div>
            <div class="property-price mb-4">${fmtPrice(data.preco)}</div>
            <a href="detalhe.html" class="btn btn-dark">Ver Detalhes do Imóvel</a>
        </div>`;

    el.style.display = 'grid';
    el.style.gridTemplateColumns = '1.2fr 1fr';
}

// ─ Home: imóveis recentes ─
async function loadRecentes() {
    const grid = document.getElementById('recentes-grid');
    if (!grid) return;

    const { data } = await siteDb.from('imoveis')
        .select('*').eq('publicado', true).eq('destaque', false)
        .order('created_at', { ascending: false }).limit(3);

    if (!data?.length) return;

    grid.innerHTML = data.map(i => `
        <article class="property-card">
            <div class="property-img">
                <img src="${i.foto_capa || ''}" alt="${i.titulo}" onerror="this.style.display='none'">
                ${i.status === 'vendido'
                    ? '<div class="badge" style="position:absolute;top:15px;right:15px;background:#ef4444;color:#fff">Vendido</div>'
                    : '<div class="badge" style="position:absolute;top:15px;right:15px">Novo</div>'}
            </div>
            <div class="property-content">
                <span class="property-type">${i.tipo}</span>
                <h3 class="property-title">${i.titulo}</h3>
                <p class="property-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                    ${i.bairro || ''}, ${i.cidade || 'Belém'}
                </p>
                <div class="property-features">
                    ${(i.suites || i.quartos) ? `<div class="feature-item">🛏 ${i.suites || i.quartos} ${i.suites ? 'Suíte' + (i.suites > 1 ? 's' : '') : 'Quarto' + (i.quartos > 1 ? 's' : '')}</div>` : ''}
                    ${i.metragem ? `<div class="feature-item">📐 ${i.metragem}m²</div>` : ''}
                </div>
                <div class="property-price">${fmtPrice(i.preco)}</div>
            </div>
        </article>`).join('');
}

// ─ Formulário de contato → salva como lead ─
async function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;

    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const nome     = form.querySelector('input[type="text"]')?.value  || '';
    const email    = form.querySelector('input[type="email"]')?.value || '';
    const telefone = form.querySelector('input[type="tel"]')?.value   || '';
    const mensagem = form.querySelector('textarea')?.value            || '';

    const { error } = await siteDb.from('leads').insert([{ nome, email, telefone, mensagem }]);

    if (error) {
        btn.textContent = 'Erro ao enviar';
        btn.style.background = 'var(--color-danger, #ef4444)';
    } else {
        btn.textContent = '✓ Mensagem enviada!';
        btn.style.background = '#10b981';
        form.reset();
    }

    setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    loadFeatured();
    loadRecentes();
    const contactForm = document.querySelector('#contato form');
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);
});
