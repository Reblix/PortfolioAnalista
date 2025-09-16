// script.js

document.addEventListener('DOMContentLoaded', () => {
  
  // Função para o efeito de revelação (scroll reveal)
  const setupIntersectionObserver = () => {
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Opcional: para animar apenas uma vez
          }
        });
      }, { threshold: 0.1 });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback para navegadores sem IntersectionObserver
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  };

  // Lógica para o menu de navegação móvel (hambúrguer)
  const setupMobileMenu = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-active');
        const isExpanded = navMenu.classList.contains('is-active');
        navToggle.setAttribute('aria-expanded', isExpanded);
      });
    }
  };

  // Atualiza o ano no rodapé
  const updateFooterYear = () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  };

  // Inicializa todas as funções
  setupIntersectionObserver();
  setupMobileMenu();
  updateFooterYear();
  
});