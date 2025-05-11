
document.addEventListener('DOMContentLoaded', async function() {
  // Elementos DOM para autenticação
  const loginButton = document.getElementById('loginButton');
  const mobileLoginButton = document.getElementById('mobileLoginButton');
  const loginModal = document.getElementById('loginModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const loginForm = document.getElementById('loginForm');
  const signupModal = document.getElementById('signupModal');
  const closeSignupModal = document.getElementById('closeSignupModal');
  const signupForm = document.getElementById('signupForm');
  const showSignupLink = document.getElementById('showSignup');
  const showLoginLink = document.getElementById('showLogin');
  const userDisplay = document.getElementById('userDisplay');
  const mobileUserDisplay = document.getElementById('mobileUserDisplay');
  
  // Verificar estado de autenticação e atualizar interface
  async function checkAuthState() {
    const user = await getCurrentUser();
    
    if (user) {
      if (loginButton) {
        loginButton.textContent = 'Sair';
        loginButton.href = '#';
        loginButton.onclick = logout;
      }
      if (mobileLoginButton) {
        mobileLoginButton.textContent = 'Sair';
        mobileLoginButton.href = '#';
        mobileLoginButton.onclick = logout;
      }
      if (userDisplay) {
        userDisplay.textContent = user.user_metadata?.name || user.email;
        userDisplay.classList.remove('hidden');
      }
      if (mobileUserDisplay) {
        mobileUserDisplay.textContent = user.user_metadata?.name || user.email;
        mobileUserDisplay.classList.remove('hidden');
      }
    } else {
      if (loginButton) {
        loginButton.textContent = 'Entrar';
        loginButton.href = '#';
        loginButton.onclick = showLoginModal;
      }
      if (mobileLoginButton) {
        mobileLoginButton.textContent = 'Entrar';
        mobileLoginButton.href = '#';
        mobileLoginButton.onclick = showLoginModal;
      }
      if (userDisplay) {
        userDisplay.textContent = '';
        userDisplay.classList.add('hidden');
      }
      if (mobileUserDisplay) {
        mobileUserDisplay.textContent = '';
        mobileUserDisplay.classList.add('hidden');
      }
    }
  }
  
  // Exibir modal de login
  function showLoginModal(e) {
    if (e) e.preventDefault();
    if (loginModal) {
      loginModal.classList.remove('hidden');
    }
    if (signupModal) {
      signupModal.classList.add('hidden');
    }
  }
  
  // Exibir modal de registro
  function showSignupModal(e) {
    if (e) e.preventDefault();
    if (signupModal) {
      signupModal.classList.remove('hidden');
    }
    if (loginModal) {
      loginModal.classList.add('hidden');
    }
  }
  
  // Fechar modal de login
  function closeLoginModalFn() {
    if (loginModal) {
      loginModal.classList.add('hidden');
    }
  }
  
  // Fechar modal de registro
  function closeSignupModalFn() {
    if (signupModal) {
      signupModal.classList.add('hidden');
    }
  }
  
  // Enviar formulário de login
  async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Login bem-sucedido
      closeLoginModalFn();
      createToast('Login realizado com sucesso!', 'success');
      checkAuthState();
      
      // Se estiver na página que precisa de autenticação, recarregar para mostrar os dados
      const currentPath = window.location.pathname;
      if (currentPath.includes('inventory.html') || 
          currentPath.includes('character.html') || 
          currentPath.includes('tables.html')) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      createToast(`Erro ao fazer login: ${err.message}`, 'error');
    }
  }
  
  // Enviar formulário de registro
  async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      // Registro bem-sucedido
      closeSignupModalFn();
      createToast('Conta criada com sucesso! Verifique seu email para confirmar.', 'success');
      
      // Automaticamente fazer login após registro
      const { loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!loginError) {
        checkAuthState();
        
        // Se estiver na página que precisa de autenticação, recarregar para mostrar os dados
        const currentPath = window.location.pathname;
        if (currentPath.includes('inventory.html') || 
            currentPath.includes('character.html') || 
            currentPath.includes('tables.html')) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
      
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      createToast(`Erro ao criar conta: ${err.message}`, 'error');
    }
  }
  
  // Função de logout
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Logout bem-sucedido
      createToast('Você saiu com sucesso!', 'success');
      checkAuthState();
      
      // Se estiver na página que precisa de autenticação, redirecionar para a página inicial
      const currentPath = window.location.pathname;
      if (currentPath.includes('inventory.html') || 
          currentPath.includes('character.html') || 
          currentPath.includes('tables.html')) {
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }
      
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      createToast(`Erro ao fazer logout: ${err.message}`, 'error');
    }
  }
  
  // Adicionar event listeners
  if (loginButton) {
    loginButton.addEventListener('click', showLoginModal);
  }
  
  if (mobileLoginButton) {
    mobileLoginButton.addEventListener('click', showLoginModal);
  }
  
  if (closeLoginModal) {
    closeLoginModal.addEventListener('click', closeLoginModalFn);
  }
  
  if (closeSignupModal) {
    closeSignupModal.addEventListener('click', closeSignupModalFn);
  }
  
  if (showSignupLink) {
    showSignupLink.addEventListener('click', showSignupModal);
  }
  
  if (showLoginLink) {
    showLoginLink.addEventListener('click', showLoginModal);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Verificar estado de autenticação ao carregar a página
  checkAuthState();
  
  // Escutar por mudanças no estado de autenticação
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
      checkAuthState();
    }
  });
});
