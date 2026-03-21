import './style.css';

console.log("Antigravity custom interactions loaded onto Webflow!");

// Prevent old scripts from running if they were cached
document.querySelectorAll('script[src*="replace_home_body"], script[src*="replace_blog_body"]').forEach(s => s.remove());

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  function loadStyle(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url + '?v=' + Date.now();
    document.head.appendChild(link);
  }

  function loadBody(url) {
    fetch(url + '?v=' + Date.now())
      .then(r => r.text())
      .then(html => {
        document.body.innerHTML = html;
        if (window.Webflow) {
          window.Webflow.destroy();
          window.Webflow.ready();
          window.Webflow.require('ix2').init();
        }
      })
      .catch(err => console.error("Error loading body:", err));
  }

  if (path === '/' || path === '/index.html') {
    loadStyle('https://cdn.jsdelivr.net/gh/AquiferGrowth/ag-ryse-jamie@main/styles-home.css');
    loadBody('https://cdn.jsdelivr.net/gh/AquiferGrowth/ag-ryse-jamie@main/body-home.html');
  } else if (path.startsWith('/blogs') || path.startsWith('/detail_blog')) {
    loadStyle('https://cdn.jsdelivr.net/gh/AquiferGrowth/ag-ryse-jamie@main/styles-blogs.css');
    loadBody('https://cdn.jsdelivr.net/gh/AquiferGrowth/ag-ryse-jamie@main/body-blogs.html');
  }
});
