// ═══════════════════════════════════════════════════════
// main.js — IT Run Academy
// ═══════════════════════════════════════════════════════

// ── Мобильное меню ──────────────────────────────────────
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const h = document.getElementById('hamburger');
  menu.classList.toggle('open');
  h.style.opacity = menu.classList.contains('open') ? '0.5' : '1';
}

function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').style.opacity = '1';
}

// ── FAQ — аккордеон ──────────────────────────────────────
function toggleFaq(el) {
  const item = el.parentElement;
  const wasOpen = item.classList.contains('open');
  // Закрываем все открытые элементы
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ── Reveal on scroll — плавное появление секций ─────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Задержка зависит от позиции элемента среди соседей
      const idx = Array.from(entry.target.parentElement.children).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 60 * idx);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Закрытие мобильного меню по клику снаружи ───────────
document.addEventListener('click', (e) => {
  if (!e.target.closest('nav') && !e.target.closest('.mobile-menu')) {
    closeMenu();
  }
});

// ── Авто-скрытие флеш-сообщений (заявка принята и т.п.) ─
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-msg').forEach(msg => {
    setTimeout(() => {
      msg.style.transition = 'opacity 0.5s';
      msg.style.opacity = '0';
      setTimeout(() => msg.remove(), 500);
    }, 4000);
  });
});


// ═══════════════════════════════════════════════════════
// СЛАЙДЕР КУРСОВ (секция #programs)
// Активируется когда courses_count > 3
// ═══════════════════════════════════════════════════════

// Текущий индекс карточки в основном слайдере
let sliderIndex = 0;

/**
 * Листает основной слайдер курсов.
 * @param {number} dir — направление: +1 вперёд, -1 назад
 */
function slideCourses(dir) {
  const slider = document.getElementById('coursesSlider');
  if (!slider) return;

  const cards = slider.querySelectorAll('.course-card');
  const total = cards.length;
  if (total === 0) return;

  // Обновляем индекс с зацикливанием
  sliderIndex = (sliderIndex + dir + total) % total;

  // Scroll к нужной карточке
  const card = cards[sliderIndex];
  slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: 'smooth' });

  // Обновляем точки-индикаторы
  updateDots(sliderIndex);
}

/**
 * Обновляет активную точку-индикатор.
 * @param {number} idx — индекс активной карточки
 */
function updateDots(idx) {
  const dots = document.querySelectorAll('#sliderDots .slider-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

/**
 * Инициализирует точки-индикаторы слайдера.
 * Вызывается один раз при загрузке страницы.
 */
function initSliderDots() {
  const slider = document.getElementById('coursesSlider');
  const dotsContainer = document.getElementById('sliderDots');
  if (!slider || !dotsContainer) return;

  const cards = slider.querySelectorAll('.course-card');
  dotsContainer.innerHTML = '';

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => {
      sliderIndex = i;
      const card = cards[i];
      slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: 'smooth' });
      updateDots(i);
    });
    dotsContainer.appendChild(dot);
  });

  // Обновляем активную точку при ручной прокрутке (свайп на телефоне)
  slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - slider.offsetLeft - scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    if (closest !== sliderIndex) {
      sliderIndex = closest;
      updateDots(sliderIndex);
    }
  }, { passive: true });
}


// ═══════════════════════════════════════════════════════
// ВЫБОР КУРСА В CTA-ФОРМЕ
// ═══════════════════════════════════════════════════════

// Индекс текущей позиции мини-слайдера выбора курса
let csIndex = 0;

/**
 * Выбирает курс в форме заявки.
 * Обновляет скрытый input, подсвечивает кнопку, показывает название.
 * @param {HTMLElement} btn — кнопка, по которой кликнули
 * @param {string|number} id — ID курса (или '' для «любой»)
 * @param {string} name — название курса для отображения
 */
function pickCourse(btn, id, name) {
  // Снимаем active со всех кнопок выбора курса
  document.querySelectorAll('.course-select-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Записываем в скрытое поле формы
  const input = document.getElementById('selected-course-input');
  if (input) input.value = id;

  // Показываем/скрываем подпись выбранного курса
  const label = document.getElementById('courseSelectedLabel');
  const nameEl = document.getElementById('courseSelectedName');
  if (label && nameEl) {
    if (id) {
      nameEl.textContent = name;
      label.style.display = 'block';
    } else {
      label.style.display = 'none';
    }
  }
}

/**
 * Листает мини-слайдер выбора курса в форме.
 * @param {number} dir — +1 или -1
 */
function slideSelectCourses(dir) {
  const slider = document.getElementById('courseSelectSlider');
  if (!slider) return;

  const btns = slider.querySelectorAll('.course-select-btn');
  const total = btns.length;
  if (total === 0) return;

  csIndex = (csIndex + dir + total) % total;

  const btn = btns[csIndex];
  slider.scrollTo({ left: btn.offsetLeft - slider.offsetLeft - 8, behavior: 'smooth' });
}

/**
 * Если пользователь кликнул «Записаться» прямо на карточке курса,
 * мы передаём ID и название курса в CTA-форму и скроллим туда.
 * @param {number} courseId — ID курса из Django
 * @param {string} courseName — название курса
 */
function selectCourseAndScroll(courseId, courseName) {
  // Находим кнопку курса в форме и кликаем её
  const btn = document.querySelector(`.course-select-btn[data-id="${courseId}"]`);
  if (btn) {
    pickCourse(btn, courseId, courseName);
  } else {
    // Если кнопки нет (например, другая разметка), просто пишем в hidden input
    const input = document.getElementById('selected-course-input');
    if (input) input.value = courseId;
  }
  // Скролл к CTA будет обработан через href="#cta" на ссылке
}


// ── Инициализация при загрузке страницы ─────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Инициализируем точки слайдера курсов (если слайдер есть)
  if (window.COURSES_COUNT > 3) {
    initSliderDots();
  }
});
