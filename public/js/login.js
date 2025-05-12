
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar Supabase client (já feito no main.js)
  
  // Elementos do DOM
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginSection = document.getElementById('loginSection');
  const signupSection = document.getElementById('signupSection');
  const showSignupLink = document.getElementById('showSignup');
  const showLoginLink = document.getElementById('showLogin');
  const forgotPasswordButton = document.getElementById('forgotPassword');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const togglePassword = document.getElementById('togglePassword');
  const toggleSignupPassword = document.getElementById('toggleSignupPassword');
  const passwordField = document.getElementById('password');
  const signupPasswordField = document.getElementById('signupPassword');
  const passwordStrength = document.getElementById('passwordStrength');
  const passwordFeedback = document.getElementById('passwordFeedback');
  const googleSignInButton = document.getElementById('googleSignIn');
  const anonymousSignInButton = document.getElementById('anonymousSignIn');
  
  // Verificar se está logado e redirecionar se necessário
  checkAuthState().then(user => {
    if (user) {
      // Usuário já está logado, redirecionar para a página principal
      createToast('Você já está logado!', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  });
  
  // Adicionar event listeners
  if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginSection.classList.add('hidden');
      signupSection.classList.remove('hidden');
    });
  }
  
  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      signupSection.classList.add('hidden');
      loginSection.classList.remove('hidden');
    });
  }
  
  // Toggle password visibility
  if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', () => togglePasswordVisibility(passwordField, togglePassword));
  }
  
  if (toggleSignupPassword && signupPasswordField) {
    toggleSignupPassword.addEventListener('click', () => togglePasswordVisibility(signupPasswordField, toggleSignupPassword));
  }
  
  // Password strength meter
  if (signupPasswordField && passwordStrength && passwordFeedback) {
    signupPasswordField.addEventListener('input', updatePasswordStrength);
  }
  
  // Forgot password modal
  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener('click', (e) => {
      e.preventDefault();
      forgotPasswordModal.classList.remove('hidden');
      forgotPasswordModal.classList.add('flex');
    });
  }
  
  if (closeForgotModal) {
    closeForgotModal.addEventListener('click', () => {
      forgotPasswordModal.classList.add('hidden');
      forgotPasswordModal.classList.remove('flex');
    });
  }
  
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        createToast('Login realizado com sucesso!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        createToast('Erro ao fazer login: ' + (error.message || 'Credenciais inválidas'), 'error');
      }
    });
  }
  
  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      
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
        
        createToast('Conta criada com sucesso! Verifique seu email para confirmar.', 'success');
        
        // Automaticamente fazer login após registro
        await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
        
      } catch (error) {
        console.error('Erro ao criar conta:', error);
        createToast('Erro ao criar conta: ' + (error.message || 'Tente novamente'), 'error');
      }
    });
  }
  
  // Forgot password form submission
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('recoveryEmail').value;
      
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password.html'
        });
        
        if (error) throw error;
        
        createToast('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
        forgotPasswordModal.classList.add('hidden');
        forgotPasswordModal.classList.remove('flex');
        
      } catch (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        createToast('Erro ao enviar email: ' + (error.message || 'Tente novamente'), 'error');
      }
    });
  }
  
  // Google Sign In
  if (googleSignInButton) {
    googleSignInButton.addEventListener('click', async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/index.html'
          }
        });
        
        if (error) throw error;
        
      } catch (error) {
        console.error('Erro ao fazer login com Google:', error);
        createToast('Erro ao fazer login com Google: ' + (error.message || 'Tente novamente'), 'error');
      }
    });
  }
  
  // Anonymous Sign In
  if (anonymousSignInButton) {
    anonymousSignInButton.addEventListener('click', async () => {
      try {
        createToast('Entrando no modo visitante...', 'success');
        
        // Gerar email e senha aleatórios para login anônimo
        const randomEmail = `visitor_${Math.random().toString(36).substring(2, 12)}@example.com`;
        const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Tentar criar conta anônima
        await supabase.auth.signUp({
          email: randomEmail,
          password: randomPassword,
          options: {
            data: {
              name: 'Aventureiro Visitante'
            }
          }
        });
        
        // Fazer login com a conta recém-criada
        await supabase.auth.signInWithPassword({
          email: randomEmail,
          password: randomPassword
        });
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        
      } catch (error) {
        console.error('Erro ao entrar como visitante:', error);
        createToast('Erro ao entrar como visitante: ' + (error.message || 'Tente novamente'), 'error');
      }
    });
  }
  
  // Funções auxiliares
  function togglePasswordVisibility(passwordField, toggleButton) {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    // Alterar o ícone
    if (type === 'text') {
      toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
      `;
    } else {
      toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
        </svg>
      `;
    }
  }
  
  function updatePasswordStrength() {
    const password = signupPasswordField.value;
    
    // Calcular a força da senha
    let strength = 0;
    
    // Critérios de força
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    if (password.match(/[\W]+/)) strength += 25; // Caracteres especiais
    
    // Limitar a 100%
    strength = Math.min(strength, 100);
    
    // Atualizar o indicador visual
    passwordStrength.style.width = `${strength}%`;
    
    // Definir a cor com base na força
    if (strength < 25) {
      passwordStrength.className = 'h-full bg-red-500 transition-all duration-300';
      passwordFeedback.textContent = 'Senha muito fraca';
    } else if (strength < 50) {
      passwordStrength.className = 'h-full bg-orange-400 transition-all duration-300';
      passwordFeedback.textContent = 'Senha fraca';
    } else if (strength < 75) {
      passwordStrength.className = 'h-full bg-yellow-300 transition-all duration-300';
      passwordFeedback.textContent = 'Senha média';
    } else {
      passwordStrength.className = 'h-full bg-green-400 transition-all duration-300';
      passwordFeedback.textContent = 'Senha forte';
    }
  }
});
