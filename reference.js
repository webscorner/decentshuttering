document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.menu');
  var navigation = document.querySelector('.navlinks');
  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var isOpen = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var statsSection = document.querySelector('.stats');
  var counters = document.querySelectorAll('.stats [data-count]');
  if (statsSection && counters.length) {
    var animateCounters = function () {
      counters.forEach(function (counter) {
        var target = Number(counter.getAttribute('data-count'));
        var suffix = counter.getAttribute('data-suffix') || '';
        var duration = 1800;
        var startTime;

        counter.textContent = '0' + suffix;
        var updateCounter = function (timestamp) {
          if (startTime === undefined) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var easedProgress = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.round(target * easedProgress) + suffix;
          if (progress < 1) window.requestAnimationFrame(updateCounter);
        };
        window.requestAnimationFrame(updateCounter);
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      statsSection.classList.add('is-visible');
    } else if ('IntersectionObserver' in window) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          statsSection.classList.add('is-visible');
          animateCounters();
          statsObserver.disconnect();
        });
      }, { threshold: 0.3 });
      statsObserver.observe(statsSection);
    } else {
      statsSection.classList.add('is-visible');
      animateCounters();
    }
  }
});
