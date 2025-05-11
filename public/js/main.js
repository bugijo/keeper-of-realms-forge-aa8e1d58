
// Função de utilitários
const createToast = (message, type = 'success') => {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  
  if (!toast || !toastMessage) return;
  
  // Configurar o toast
  toastMessage.textContent = message;
  
  // Configurar o ícone baseado no tipo
  if (type === 'success') {
    toast.className = 'fixed bottom-4 right-4 bg-fantasy-dark border border-fantasy-purple/30 p-4 rounded-lg shadow-lg toast-success';
    toastIcon.innerHTML = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />';
    toastIcon.classList.add('text-green-400');
    toastIcon.classList.remove('text-red-400');
  } else {
    toast.className = 'fixed bottom-4 right-4 bg-fantasy-dark border border-fantasy-purple/30 p-4 rounded-lg shadow-lg toast-error';
    toastIcon.innerHTML = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />';
    toastIcon.classList.add('text-red-400');
    toastIcon.classList.remove('text-green-400');
  }
  
  // Exibir o toast com animação
  toast.classList.remove('hidden');
  toast.classList.add('toast-enter');
  
  // Auto-fechar o toast após 3 segundos
  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('toast-exit');
    }, 300);
  }, 3000);
};

// Menu Móvel
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
      }
    });
  }
});

// Inicialização do cliente Supabase
const SUPABASE_URL = 'https://iilbczoanafeqzjqovjb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbGJjem9hbmFmZXF6anFvdmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzAzMzEsImV4cCI6MjA1OTgwNjMzMX0.bFE7xLdOURKvfIHIzrTYJPWhCI08SvDhgsen2OwK2_k';

let supabase;
if (window.supabase) {
  supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error('Supabase não está carregado corretamente.');
}

// Função para verificar usuário atual
const getCurrentUser = async () => {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    return data.session?.user || null;
  } catch (err) {
    console.error('Erro ao obter usuário atual:', err);
    return null;
  }
};
