// --------------------------------------------------------------------------
// Custom Interactivity Code
// --------------------------------------------------------------------------
// Anything you write below this line will be bundled, optimized, and 
// hosted securely for your Webflow site! This code is totally safe for SEO
// natively.

console.log("Antigravity custom interactions loaded onto Webflow!");

// Example interaction: (You can delete this later or replace with real logic)
// document.querySelectorAll('.button').forEach(btn => btn.addEventListener('click', () => { ... }));

// Dynamically override Webflow textual content from Antigravity:
document.querySelectorAll('.page_heading-copy').forEach(el => {
  if (el.textContent.includes("Latest Reviews & Insights") || el.textContent.includes("Latest Review & Blogs")) {
    el.textContent = "Latest Review & Blogs";
  }
});


// --------------------------------------------------------------------------
// Local Development ONLY (This gets completely removed automatically for production)
// --------------------------------------------------------------------------
if (import.meta.env.DEV) {
  import('./local-dev.js');
}
