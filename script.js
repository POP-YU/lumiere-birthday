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
    host.innerHTML = captions.map((caption, index) => {
      const number = index + 1;
      const src = `https://pop-yu.github.io/lumiere-birthday/images/${number}.jpg`;
      return `<button class="memory-card" type="button" data-photo="${src}" data-caption="${caption}" aria-label="查看照片：${caption}">
        <img src="${src}" alt="${caption}" loading="lazy" decoding="async" width="960" height="1280">
        <span class="memory-label"><span>${caption}</span><i>${pad(number)}</i></span>
      </button>`;
    }).join('');
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

  function setupSound() {
    const audio = $('[data-audio]');
    const button = $('[data-sound]');
    if (!audio || !button) return;
    button.addEventListener('click', async () => {
      try {
        if (audio.paused) { await audio.play(); button.setAttribute('aria-pressed', 'true'); button.setAttribute('aria-label', '关闭环境音'); }
        else { audio.pause(); button.setAttribute('aria-pressed', 'false'); button.setAttribute('aria-label', '开启环境音'); }
      } catch { button.hidden = true; }
    });
    audio.addEventListener('error', () => { button.hidden = true; });
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
  setupReveal();
  setupDialogs();
  setupSound();
  setupMotion();
  setupCosmos();
  updateTime();
  window.setInterval(updateTime, 1000);
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

