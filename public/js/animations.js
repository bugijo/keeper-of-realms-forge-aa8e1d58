
document.addEventListener('DOMContentLoaded', function() {
  // Animação para a seção de boas-vindas
  const welcomeSection = document.getElementById('welcomeSection');
  if (welcomeSection) {
    setTimeout(() => {
      welcomeSection.classList.add('fade-in');
      welcomeSection.classList.remove('opacity-0');
    }, 300);
  }
  
  // Animação para as ações rápidas
  const quickActions = document.querySelectorAll('.quick-action');
  quickActions.forEach((action) => {
    const delay = action.getAttribute('data-delay') || 0;
    setTimeout(() => {
      action.classList.add('fade-in');
      action.classList.remove('opacity-0');
    }, 500 + (parseInt(delay) * 200));
  });
  
  // Animação para as missões
  const missionItems = document.querySelectorAll('.mission-item');
  missionItems.forEach((item) => {
    const index = item.getAttribute('data-index') || 0;
    setTimeout(() => {
      item.classList.add('fade-in');
      item.classList.remove('opacity-0');
    }, 800 + (parseInt(index) * 200));
  });
});
