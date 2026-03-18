import Papa from 'papaparse';

// Antigravity local dev environment
console.log("Vite local development connected to Webflow HTML successfully!");

function initLocalDev() {
  fetch('/blogs.csv')
    .then(response => response.text())
    .then(csvText => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const blogs = results.data.filter(b => b.Draft !== 'true' && b.Name);
          
          const path = window.location.pathname;
          
          if (path.includes('detail_blog-posts')) {
            renderBlogDetail(blogs);
          } else if (path.includes('blogs.html')) {
            renderBlogsPage(blogs);
          } else {
            renderIndexPage(blogs);
          }
        }
      });
    });
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initLocalDev);
} else {
  initLocalDev();
}

function populateList(container, blogsToRender) {
  if (!container) return;
  const templateItem = container.querySelector('.w-dyn-item');
  if (!templateItem) return;
  
  const templateHtml = templateItem.outerHTML;
  container.innerHTML = '';
  
  const emptyState = container.parentElement.querySelector('.w-dyn-empty');
  
  if (!blogsToRender || blogsToRender.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  if (emptyState) emptyState.style.display = 'none';

  blogsToRender.forEach(blog => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateHtml;
    const item = tempDiv.firstElementChild;
    
    // Background Image
    const bgContainer = item.querySelector('.new_image_bg');
    if (bgContainer && blog['Main Image']) {
      bgContainer.style.backgroundImage = `url('${blog['Main Image']}')`;
    }
    
    // Image tag
    const imgTag = item.querySelector('.blog-card-hero-image') || item.querySelector('.featured-hero-image');
    if (imgTag && blog['Main Image']) {
      imgTag.src = blog['Main Image'];
      imgTag.classList.remove('w-dyn-bind-empty');
    }
    
    // Category
    const categoryEls = item.querySelectorAll('.blog_category, .category-badge');
    categoryEls.forEach(el => {
      el.textContent = blog['Blog category'] || '';
      el.classList.remove('w-dyn-bind-empty');
    });
    
    // Title
    const titleEls = item.querySelectorAll('.blog-card-post-title-copy, .blog-card-post-title, .blog-post-title');
    titleEls.forEach(el => {
      el.textContent = blog['Name'] || '';
      el.classList.remove('w-dyn-bind-empty');
    });
    
    // Excerpt
    const excerptEls = item.querySelectorAll('.rte-excerpt-copy, .post-summary');
    excerptEls.forEach(el => {
      el.textContent = blog['Excerpt'] || '';
      el.classList.remove('w-dyn-bind-empty');
    });
    
    // Date
    const dateEls = item.querySelectorAll('.post-date');
    dateEls.forEach(el => {
      const rawDate = blog['Published Date'];
      if (rawDate) {
         try {
           const d = new Date(rawDate);
           if (!isNaN(d)) el.textContent = d.toLocaleDateString();
         } catch(e) {}
      }
      el.classList.remove('w-dyn-bind-empty');
    });

    // Read More specific logic (some use this element for date in index)
    const readMoreEls = item.querySelectorAll('.read-more-btn-copy');
    readMoreEls.forEach(el => {
      const rawDate = blog['Published Date'];
      let formattedDate = 'Read More';
      if (rawDate) {
         try {
           const d = new Date(rawDate);
           if (!isNaN(d)) formattedDate = d.toLocaleDateString();
         } catch(e) {}
      }
      el.textContent = formattedDate;
      el.classList.remove('w-dyn-bind-empty');
    });
    
    // Link
    const linkEls = item.querySelectorAll('a.read-blog-btn-copy, a.read-blog-btn');
    linkEls.forEach(el => {
      if (blog['Slug']) el.href = `/detail_blog-posts.html?slug=${blog['Slug']}`;
    });
    
    container.appendChild(item);
  });
}

function renderIndexPage(blogs) {
  const container = document.querySelector('.collection-list-2-copy');
  populateList(container, blogs);
}

function renderBlogsPage(blogs) {
  const tabs = {
    'Tab 1': (b) => true,
    'Tab 2': (b) => b['Blog category'] && b['Blog category'].toLowerCase().includes('lighting'),
    'Tab 3': (b) => b['Blog category'] && b['Blog category'].toLowerCase().includes('automation'),
    'Tab 4': (b) => b['Blog category'] && (b['Blog category'].toLowerCase().includes('essential') || b['Blog category'].toLowerCase().includes('smart'))
  };

  document.querySelectorAll('.w-tab-pane').forEach(pane => {
     const tabName = pane.getAttribute('data-w-tab');
     const filterFn = tabs[tabName];
     if (!filterFn) return;
     
     const filteredBlogs = blogs.filter(filterFn);
     
     // Featured (first item)
     const heroList = pane.querySelector('.hero-feature-list');
     if (heroList) {
        populateList(heroList, filteredBlogs.length > 0 ? [filteredBlogs[0]] : []);
     }
     
     // Rest
     const restList = pane.querySelector('.collection-list-2');
     if (restList) {
        populateList(restList, filteredBlogs.slice(1));
     }
  });
}

function renderBlogDetail(blogs) {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  const currentBlog = blogs.find(b => b.Slug === slug);
  if (!currentBlog) {
    console.error("Blog post not found in CSV!");
    return;
  }
  
  // Update Header / Details
  const titleEl = document.querySelector('.blog-post-title');
  if (titleEl) {
    titleEl.textContent = currentBlog['Name'] || '';
    titleEl.classList.remove('w-dyn-bind-empty');
  }
  
  const imgEl = document.querySelector('.blog-post-image');
  if (imgEl && currentBlog['Main Image']) {
    imgEl.src = currentBlog['Main Image'];
    imgEl.classList.remove('w-dyn-bind-empty');
  }
  
  const dateEl = document.querySelector('.text-block-5.date');
  if (dateEl) {
    const rawDate = currentBlog['Published Date'];
    if (rawDate) {
       try {
         const d = new Date(rawDate);
         if (!isNaN(d)) dateEl.textContent = d.toLocaleDateString();
       } catch(e) {}
    }
    dateEl.classList.remove('w-dyn-bind-empty');
  }
  
  const bodyEl = document.querySelector('.post-body');
  if (bodyEl) {
    bodyEl.innerHTML = currentBlog['Body'] || '';
    bodyEl.classList.remove('w-dyn-bind-empty');
  }
  
  const finalThoughtsEl = document.querySelector('.italic-text');
  if (finalThoughtsEl) {
    const ft = currentBlog['Final thoughts'];
    if (ft && ft.trim() !== '') {
      finalThoughtsEl.textContent = ft;
      finalThoughtsEl.classList.remove('w-dyn-bind-empty');
    } else {
      const wrapper = document.querySelector('.final-thoghts-section');
      if (wrapper) wrapper.style.display = 'none';
    }
  }

  // Populate Related Articles
  const relatedContainer = document.querySelector('.related-blog-list');
  const relatedBlogs = blogs.filter(b => b.Slug !== slug).slice(0, 3);
  populateList(relatedContainer, relatedBlogs);
}
