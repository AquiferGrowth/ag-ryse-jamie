import './style.css';
import './design-system.css';

// --------------------------------------------------------------------------
// Inject CSS stylesheet into Webflow page
// --------------------------------------------------------------------------
// Webflow only loads app.js via the footer script tag.
// This injects the companion CSS file so styles reach the live site too.
(function() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://ag-ryse-jamie.pages.dev/app.css';
  document.head.appendChild(link);
})();

// --------------------------------------------------------------------------
// Custom Interactivity Code
// --------------------------------------------------------------------------
// Anything you write below this line will be bundled, optimized, and 
// hosted securely for your Webflow site! This code is totally safe for SEO
// natively.

console.log("Antigravity custom interactions loaded onto Webflow!");

// Example interaction: (You can delete this later or replace with real logic)
// document.querySelectorAll('.button').forEach(btn => btn.addEventListener('click', () => { ... }));
