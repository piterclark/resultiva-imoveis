async function checkAuth() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { window.location.href = 'login.html'; return null; }
    return session;
}

async function logout() {
    await sb.auth.signOut();
    window.location.href = 'login.html';
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const err = document.getElementById('login-error');
        btn.textContent = 'Entrando...';
        btn.disabled = true;
        err.style.display = 'none';

        const { error } = await sb.auth.signInWithPassword({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        });

        if (error) {
            err.textContent = 'E-mail ou senha incorretos.';
            err.style.display = 'block';
            btn.textContent = 'Entrar no Painel';
            btn.disabled = false;
        } else {
            window.location.href = 'dashboard.html';
        }
    });
}
