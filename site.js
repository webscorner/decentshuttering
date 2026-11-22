document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.menu-toggle');
  var navigation = document.querySelector('.nav-links');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var isOpen = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });

  var filterButtons = document.querySelectorAll('[data-filter]');
  var productCards = document.querySelectorAll('.product-card[data-category]');
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter');
      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      productCards.forEach(function (card) {
        card.hidden = filter !== 'all' && card.getAttribute('data-category') !== filter;
      });
    });
  });

  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    var params = new URLSearchParams(window.location.search);
    var requestedProduct = params.get('product');
    var productField = contactForm.querySelector('[name="product"]');
    if (requestedProduct && productField) {
      productField.value = requestedProduct;
    }
  }

  var blogGrid = document.querySelector('#blog-grid');
  var articleList = document.querySelector('#article-list');
  if (blogGrid && articleList) {
    var escapeHtml = function (value) {
      return String(value || '').replace(/[&<>"']/g, function (character) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
      });
    };
    var postId = function (slug) {
      return 'post-' + String(slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    };
    var paragraphMarkup = function (body) {
      return String(body || '').trim().split(/\n\s*\n/).filter(Boolean).map(function (paragraph) {
        return '<p>' + escapeHtml(paragraph).replace(/\n/g, '<br>') + '</p>';
      }).join('');
    };
    fetch('content/blogs.json')
      .then(function (response) {
        if (!response.ok) throw new Error('Unable to load blog posts (' + response.status + ').');
        return response.json();
      })
      .then(function (content) {
        var posts = Array.isArray(content.posts) ? content.posts.filter(function (post) {
          return post && post.title && post.slug && post.body;
        }) : [];
        posts.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
        if (!posts.length) {
          blogGrid.innerHTML = '<p class="blog-status">No articles have been published yet.</p>';
          articleList.replaceChildren();
          return;
        }
        blogGrid.innerHTML = posts.map(function (post) {
          var id = postId(post.slug);
          var image = escapeHtml(post.image || 'images/hero-construction.jpg');
          var imageAlt = escapeHtml(post.image_alt || post.title);
          return '<article class="blog-card"><a class="blog-image" href="#' + id + '"><img src="' + image + '" alt="' + imageAlt + '" loading="lazy"><span>' + escapeHtml(post.category) + '</span></a><div class="blog-card-body"><p class="blog-meta">' + escapeHtml(post.date) + '</p><h3><a href="#' + id + '">' + escapeHtml(post.title) + '</a></h3><p>' + escapeHtml(post.excerpt) + '</p><a class="text-link" href="#' + id + '">Read article <span aria-hidden="true">→</span></a></div></article>';
        }).join('');
        articleList.innerHTML = posts.map(function (post) {
          return '<article class="article-preview" id="' + postId(post.slug) + '"><p class="eyebrow">' + escapeHtml(post.category) + (post.date ? ' · ' + escapeHtml(post.date) : '') + '</p><h2>' + escapeHtml(post.title) + '</h2>' + paragraphMarkup(post.body) + '<a class="text-link" href="contact.html#contact-form">Discuss your requirements with DSS <span aria-hidden="true">→</span></a></article>';
        }).join('');
      })
      .catch(function (error) {
        blogGrid.innerHTML = '<p class="blog-status">Articles could not be loaded. Please try again later.</p>';
        articleList.replaceChildren();
        console.error(error);
      });
  }
});
