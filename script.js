(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const relationshipStart = new Date('2026-01-11T00:00:00+08:00');
  const signals = [
    ['2025.06.23', '相遇坐标', '那天晚风和你的裙摆一样温柔，宇宙的引力从此有了确切的方向。', 'FIRST SIGNAL'],
    ['2026.01.11', '时间有了名字', '从这一天开始，普通的日期也被赋予了值得纪念的光。', 'LOVE LOG'],
    ['未来时空', '仍然会是第一天', '在下一个、下下个光年里，依然会像第一天那样为你着迷。', 'FUTURE NOTE'],
    ['专属注记', '岁岁年年', '愿你的岁岁年年，都有漫天星光和永远不退场的偏爱。', 'ORBIT NOTE'],
    ['永久备份', '无法褪色的章节', '这段时光已被刻入宇宙背景辐射，无可擦除，永不褪色。', 'ARCHIVE'],
    ['深空信号', '唯一值得停靠', '跨越星系的漫长旅途中，你是唯一值得我减速停靠的引力场。', 'SIGNAL 042'],
    ['生日这一天', '北极星', '从那年秋天开始，我的世界便只有你这一颗北极星。生日快乐，花花。', 'NORTH STAR'],
    ['无限靠近', '温柔的常数', '你是我加速膨胀的宇宙里，唯一温柔而笃定的常数。', 'COSMIC']
  ];
  const captions = ['心动存档', '一起走过的晴天', '偷偷收藏的笑', '星光落在肩上', '我们的散步轨迹', '轻轻靠近的瞬间', '夏日的信', '在同一片天空下', '小小的仪式感', '被记住的温柔', '永远的我们'];
  const memorySizes = [[1080, 1440], [1081, 1600], [1200, 1600], [1080, 1440], [1200, 1600], [1200, 1600], [1208, 1600], [957, 1600], [1080, 1510], [1200, 1600], [1214, 1600]];
  const memoryNotes = [
    '那一刻没有盛大配乐，却成了后来所有故事的序章。',
    '晴天很普通，因为和你一起，才被我认真保存。',
    '宇宙里有无数种光，我还是最喜欢你笑起来的那一种。',
    '光落在你肩上，而我的目光刚好在那里停留。',
    '走过的路不需要名字，只要身边的人一直是你。',
    '距离慢慢缩短，两个世界从此共享同一条轨道。',
    '把夏天折成一封信，收件人永远只有一个。',
    '抬头看见同一片天，就像我们从来没有离得很远。',
    '浪漫不是隆重，是每一个小小瞬间都愿意为你用心。',
    '温柔被镜头记住，也被我一遍又一遍放在心里。',
    '这一帧没有终点，它只是我们下一段故事的开始。'
  ];
  const pad = value => String(Math.max(0, value)).padStart(2, '0');

  function renderSignals() {
    const host = $('[data-signals]');
    if (!host) return;
    host.innerHTML = signals.map((item, index) => `<article class="signal-card reveal" data-index="${pad(index + 1)}">
      <div class="signal-top"><span>${item[0]}</span><span>${pad(index + 1)} / ${pad(signals.length)}</span></div>
      <h3>${item[1]}</h3><p>${item[2]}</p><small>${item[3]}</small>
    </article>`).join('');
  }

  function renderGallery() {
    const host = $('[data-gallery]');
    if (!host) return;
    const slides = captions.map((caption, index) => {
      const number = index + 1;
      const src = `https://pop-yu.github.io/lumiere-birthday/images/${number}.jpg`;
      const [width, height] = memorySizes[index];
      const imageSource = index === 0 ? `src="${src}"` : `data-src="${src}"`;
      return `<article class="memory-slide${index === 0 ? ' is-active' : ''}" data-memory-slide="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}" style="--photo-ratio:${width} / ${height}">
        <span class="memory-ambient" aria-hidden="true"><img ${imageSource} alt="" loading="lazy" decoding="async" width="${width}" height="${height}"></span>
        <button class="memory-picture" type="button" data-memory-photo data-photo="${src}" data-caption="${caption}" aria-label="放大完整照片：${caption}" tabindex="${index === 0 ? '0' : '-1'}"><span class="memory-photo-shell"><img ${imageSource} alt="${caption}，完整照片" loading="lazy" decoding="async" fetchpriority="low" width="${width}" height="${height}"></span></button>
        <span class="memory-frame-mark" aria-hidden="true"><i>✦</i><b>${pad(number)}</b></span>
      </article>`;
    }).join('');
    const rail = captions.map((caption, index) => `<button type="button" class="memory-dot${index === 0 ? ' is-active' : ''}" data-memory-jump="${index}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" aria-label="切换到第 ${index + 1} 帧：${caption}"><span>${pad(index + 1)}</span><i></i></button>`).join('');
    const steps = captions.map((_, index) => `<div class="memory-step" data-memory-step="${index}" aria-hidden="true"></div>`).join('');
    host.innerHTML = `<div class="memory-sticky">
      <div class="memory-stack">${slides}</div>
      <div class="memory-copy" aria-live="polite">
        <p class="overline"><span>✦</span> ORIGINAL RATIO / NO CROP <b data-memory-current>01</b></p>
        <h3 data-memory-caption>${captions[0]}</h3>
        <p data-memory-note>${memoryNotes[0]}</p>
        <div class="memory-nav"><button type="button" data-memory-prev aria-label="上一帧">←</button><button type="button" data-memory-next aria-label="下一帧">→</button></div>
      </div>
      <div class="memory-counter" aria-hidden="true"><strong data-memory-counter>01</strong><span>/ ${pad(captions.length)}</span></div>
      <div class="memory-rail" role="tablist" aria-label="选择记忆帧">${rail}</div>
      <div class="memory-progress" aria-hidden="true"><i data-memory-progress></i></div>
      <p class="memory-scroll-cue" aria-hidden="true">SCROLL TO TRAVEL <i></i></p>
    </div><div class="memory-steps">${steps}</div>`;
  }

  function setupMemoryGallery() {
    const host = $('[data-gallery]');
    if (!host) return;
    const slides = $$('[data-memory-slide]', host);
    const photoButtons = $$('[data-memory-photo]', host);
    const dots = $$('[data-memory-jump]', host);
    const steps = $$('[data-memory-step]', host);
    const current = $('[data-memory-current]', host);
    const counter = $('[data-memory-counter]', host);
    const caption = $('[data-memory-caption]', host);
    const note = $('[data-memory-note]', host);
    const copy = $('.memory-copy', host);
    const progress = $('[data-memory-progress]', host);
    const previous = $('[data-memory-prev]', host);
    const next = $('[data-memory-next]', host);
    let active = -1;

    const loadSlide = index => {
      const slide = slides[index];
      if (!slide) return;
      $$('img[data-src]', slide).forEach(image => {
        image.src = image.dataset.src;
        image.removeAttribute('data-src');
      });
    };

    const activate = index => {
      const target = Math.max(0, Math.min(captions.length - 1, index));
      const changed = target !== active;
      [target - 1, target, target + 1].forEach(loadSlide);
      active = target;
      slides.forEach((slide, itemIndex) => {
        const isActive = itemIndex === target;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        if (photoButtons[itemIndex]) photoButtons[itemIndex].tabIndex = isActive ? 0 : -1;
      });
      dots.forEach((dot, itemIndex) => {
        const isActive = itemIndex === target;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
      if (current) current.textContent = pad(target + 1);
      if (counter) counter.textContent = pad(target + 1);
      if (caption) caption.textContent = captions[target];
      if (note) note.textContent = memoryNotes[target];
      if (progress) progress.style.transform = `scaleX(${(target + 1) / captions.length})`;
      if (previous) previous.disabled = target === 0;
      if (next) next.disabled = target === captions.length - 1;
      if (changed && copy && !reducedMotion && typeof copy.animate === 'function') {
        copy.animate([{ opacity: .35, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    };
    const travelTo = index => {
      activate(index);
      steps[index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    };

    dots.forEach((dot, index) => dot.addEventListener('click', () => travelTo(index)));
    previous?.addEventListener('click', () => travelTo(active - 1));
    next?.addEventListener('click', () => travelTo(active + 1));
    host.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); travelTo(active - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); travelTo(active + 1); }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) activate(Number(entry.target.dataset.memoryStep));
      }), { threshold: 0, rootMargin: '-46% 0px -46% 0px' });
      steps.forEach(step => observer.observe(step));
    }
    activate(0);
  }

  function updateTime() {
    const now = new Date();
    let years = now.getFullYear() - relationshipStart.getFullYear();
    let months = now.getMonth() - relationshipStart.getMonth();
    let days = now.getDate() - relationshipStart.getDate();
    let hours = now.getHours() - relationshipStart.getHours();
    let minutes = now.getMinutes() - relationshipStart.getMinutes();
    let seconds = now.getSeconds() - relationshipStart.getSeconds();
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) { days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); months--; }
    if (months < 0) { months += 12; years--; }
    Object.entries({ years, months, days, hours, minutes, seconds }).forEach(([key, value]) => {
      const node = $(`[data-count="${key}"]`);
      if (node) node.textContent = pad(value);
    });
  }

  function setupReveal() {
    if (reducedMotion || !('IntersectionObserver' in window)) { $$('.reveal').forEach(node => node.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .11, rootMargin: '0px 0px -4% 0px' });
    $$('.reveal').forEach(node => observer.observe(node));
  }

  function setupDialogs() {
    const letter = $('[data-dialog]');
    $$('[data-letter]').forEach(button => button.addEventListener('click', () => letter?.showModal()));
    $('[data-close]')?.addEventListener('click', () => letter?.close());
    letter?.addEventListener('click', event => { if (event.target === letter) letter.close(); });

    const lightbox = $('[data-lightbox]');
    const image = $('[data-lightbox-image]');
    const caption = $('[data-lightbox-caption]');
    document.addEventListener('click', event => {
      const card = event.target.closest('[data-photo]');
      if (!card || !lightbox || !image || !caption) return;
      image.src = card.dataset.photo;
      image.alt = card.dataset.caption || '';
      caption.textContent = card.dataset.caption || '';
      lightbox.showModal();
    });
    $('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
    lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  }

  function setupMotion() {
    const header = $('[data-header]');
    const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    if (reducedMotion) return;
    window.addEventListener('pointermove', event => {
      document.documentElement.style.setProperty('--px', `${event.clientX}px`);
      document.documentElement.style.setProperty('--py', `${event.clientY}px`);
    }, { passive: true });
  }

  function setupCosmos() {
    const canvas = $('#cosmos');
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let animation = 0;
    let stars = [];
    let comet = null;

    const makeStar = () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.15 + .15,
      alpha: Math.random() * .72 + .2, phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - .5) * .000035,
      hue: Math.random() > .82 ? (Math.random() > .5 ? 'gold' : 'blue') : 'white'
    });
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight; ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(190, Math.max(80, Math.round(width * height / 9000))) }, makeStar);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = reducedMotion ? star.alpha : star.alpha * (.65 + Math.sin(frame * .018 + star.phase) * .35);
        if (!reducedMotion) { star.y += star.drift; if (star.y < 0) star.y = 1; if (star.y > 1) star.y = 0; }
        context.beginPath(); context.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        context.fillStyle = star.hue === 'gold' ? `rgba(243,206,145,${twinkle})` : star.hue === 'blue' ? `rgba(159,184,255,${twinkle})` : `rgba(241,236,223,${twinkle})`; context.fill();
      }
      if (!reducedMotion && !comet && frame % 520 === 0) comet = { x: width * (.45 + Math.random() * .45), y: -30, life: 0 };
      if (comet) {
        comet.x -= 9; comet.y += 6; comet.life++;
        const gradient = context.createLinearGradient(comet.x, comet.y, comet.x + 120, comet.y - 80);
        gradient.addColorStop(0, 'rgba(241,236,223,.85)'); gradient.addColorStop(1, 'rgba(159,184,255,0)');
        context.beginPath(); context.moveTo(comet.x, comet.y); context.lineTo(comet.x + 120, comet.y - 80); context.strokeStyle = gradient; context.lineWidth = 1; context.stroke();
        if (comet.life > 95 || comet.x < -140) comet = null;
      }
      frame++;
      if (!reducedMotion && !document.hidden) animation = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(animation);
      if (!document.hidden && !reducedMotion) animation = requestAnimationFrame(draw);
    });
  }

  renderSignals();
  renderGallery();
  setupMemoryGallery();
  setupReveal();
  setupDialogs();
  setupMotion();
  setupCosmos();
  updateTime();
  window.setInterval(updateTime, 1000);
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

