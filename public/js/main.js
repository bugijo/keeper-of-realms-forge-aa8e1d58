
// Para todo o site
document.addEventListener('DOMContentLoaded', async function() {
  // Inicializar o cliente Supabase
  supabase = supabase.createClient(
    'https://iilbczoanafeqzjqovjb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbGJjem9hbmFmZXF6anFvdmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzAzMzEsImV4cCI6MjA1OTgwNjMzMX0.bFE7xLdOURKvfIHIzrTYJPWhCI08SvDhgsen2OwK2_k'
  );

  // Setupar o menu mobile
  setupMobileMenu();
  
  // Verificar autenticação e atualizar a UI
  await checkAuthState();
});

// Configuração do menu mobile
function setupMobileMenu() {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Verificar estado de autenticação atual
async function checkAuthState() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user || null;
    
    updateAuthUI(user);
    return user;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    updateAuthUI(null);
    return null;
  }
}

// Atualizar UI baseado no estado de autenticação
function updateAuthUI(user) {
  // Elementos da UI para autenticação
  const loginButtons = document.querySelectorAll('.login-button');
  const logoutButtons = document.querySelectorAll('.logout-button');
  const userDisplays = document.querySelectorAll('.user-display');
  const authLinks = document.querySelectorAll('.auth-required-link');
  const guestLinks = document.querySelectorAll('.guest-only-link');
  
  if (user) {
    // Usuário autenticado
    console.log('Usuário autenticado:', user);
    
    // Atualizar botões de login para logout
    loginButtons.forEach(button => {
      if (button) {
        button.textContent = 'Sair';
        button.classList.remove('login-button');
        button.classList.add('logout-button');
        
        // Substituir event listeners
        button.replaceWith(button.cloneNode(true));
        document.querySelector('.logout-button').addEventListener('click', handleLogout);
      }
    });
    
    // Mostrar nome do usuário
    userDisplays.forEach(display => {
      if (display) {
        display.textContent = user.user_metadata?.name || user.email || 'Usuário';
        display.classList.remove('hidden');
      }
    });
    
    // Mostrar links que requerem autenticação
    authLinks.forEach(link => {
      if (link) link.classList.remove('hidden');
    });
    
    // Esconder links apenas para visitantes
    guestLinks.forEach(link => {
      if (link) link.classList.add('hidden');
    });
  } else {
    // Usuário não autenticado
    console.log('Usuário não autenticado');
    
    // Atualizar botões de logout para login
    logoutButtons.forEach(button => {
      if (button) {
        button.textContent = 'Entrar';
        button.classList.remove('logout-button');
        button.classList.add('login-button');
        
        // Substituir event listeners
        button.replaceWith(button.cloneNode(true));
        document.querySelector('.login-button').addEventListener('click', showLoginModal);
      }
    });
    
    // Esconder nome do usuário
    userDisplays.forEach(display => {
      if (display) {
        display.textContent = '';
        display.classList.add('hidden');
      }
    });
    
    // Esconder links que requerem autenticação
    authLinks.forEach(link => {
      if (link) link.classList.add('hidden');
    });
    
    // Mostrar links apenas para visitantes
    guestLinks.forEach(link => {
      if (link) link.classList.remove('hidden');
    });
  }
}

// Função para mostrar o modal de login
function showLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.classList.remove('hidden');
    loginModal.classList.add('flex');
  } else {
    // Se não existe um modal de login na página atual, redirecionar para a página de login
    window.location.href = 'login.html';
  }
}

// Função para esconder o modal de login
function hideLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
  }
}

// Função para mostrar o modal de registro
function showSignupModal() {
  const signupModal = document.getElementById('signupModal');
  if (signupModal) {
    signupModal.classList.remove('hidden');
    signupModal.classList.add('flex');
  }
  hideLoginModal();
}

// Função para esconder o modal de registro
function hideSignupModal() {
  const signupModal = document.getElementById('signupModal');
  if (signupModal) {
    signupModal.classList.add('hidden');
    signupModal.classList.remove('flex');
  }
}

// Função para fazer logout
async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // Atualizar UI
    updateAuthUI(null);
    
    // Mostrar toast de sucesso
    createToast('Você saiu com sucesso!', 'success');
    
    // Redirecionar para a página inicial após um pequeno delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    createToast('Erro ao sair: ' + error.message, 'error');
  }
}

// Função para criar um toast
function createToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) {
    // Criar toast se não existir
    const toastHTML = `
      <div id="toast" class="fixed bottom-4 right-4 bg-fantasy-dark border border-fantasy-purple/30 p-4 rounded-lg shadow-lg z-50">
        <div class="flex items-center gap-2">
          <svg id="toastIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span id="toastMessage" class="text-white">${message}</span>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const newToast = document.getElementById('toast');
    
    // Atualizar o ícone baseado no tipo
    updateToastIcon(type);
    
    // Esconder o toast após 3 segundos
    setTimeout(() => {
      if (newToast) newToast.remove();
    }, 3000);
  } else {
    // Atualizar toast existente
    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) toastMessage.textContent = message;
    
    // Atualizar o ícone
    updateToastIcon(type);
    
    // Mostrar o toast
    toast.classList.remove('hidden');
    
    // Esconder o toast após 3 segundos
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
}

// Atualizar o ícone do toast baseado no tipo
function updateToastIcon(type) {
  const toastIcon = document.getElementById('toastIcon');
  if (!toastIcon) return;
  
  if (type === 'success') {
    toastIcon.className = 'h-5 w-5 text-green-400';
    toastIcon.innerHTML = `
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    `;
  } else {
    toastIcon.className = 'h-5 w-5 text-red-400';
    toastIcon.innerHTML = `
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    `;
  }
}
