(() => {
  'use strict';

  const relationshipStart = new Date('2026-01-11T00:00:00+08:00');
  const memories = [
    { date: '2025.06.23', title: '相遇坐标', copy: '那天晚风和你的裙摆一样温柔，宇宙的引力从此有了确切的方向。', tag: 'FIRST SIGNAL' },
    { date: '2026.01.11', title: '时间开始有名字', copy: '从这一天开始，普通的日期也被赋予了值得纪念的光。', tag: 'LOVE LOG' },
    { date: '未来时空', title: '仍然会是第一天', copy: '在下一个、下下个光年里，依然会像第一天那样为你着迷。', tag: 'FUTURE NOTE' },
    { date: '专属注记', title: '岁岁年年', copy: '愿你的岁岁年年，都有漫天星光和永远不退场的偏爱。', tag: 'ORBIT NOTE' },
    { date: '永久备份', title: '无法褪色的章节', copy: '这段时光已被刻入宇宙背景辐射，无可擦除，永不褪色。', tag: 'ARCHIVE' },
    { date: '深空信号', title: '唯一值得减速停靠', copy: '跨越星系的漫长旅途中，你是唯一值得我减速停靠的引力场。', tag: 'SIGNAL 042' },
    { date: '生日这一天', title: '北极星', copy: '从那年秋天开始，我的世界便只有你这一颗北极星。生日快乐，花花。', tag: 'NORTH STAR' },
    { date: '无限靠近', title: '温柔的常数', copy: '你是我加速膨胀的宇宙里，唯一温柔而笃定的常数。', tag: 'COSMIC' }
  ];

  const photoCaptions = ['心动存档', '一起走过的晴天', '偷偷收藏的笑', '星光落在肩上', '我们的散步轨迹', '轻轻靠近的瞬间', '夏日的信', '在同一片天空下', '小小的仪式感', '被记住的温柔', '永远的我们'];
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function pad(value) { return String(Math.max(0, value)).padStart(2, '0'); }
  function updateChronograph() {
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
    if (days < 0) { const previousMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate(); days += previousMonthDays; months--; }
    if (months < 0) { months += 12; years--; }
    const values = { years, months, days, hours, minutes, seconds };
    Object.entries(values).forEach(([key, value]) => {
      const node = $(`[data-count="${key}"]`);
      if (node) node.textContent = pad(value);
    });
  }

  function renderSignals() {
    const list = $('[data-signals]');
    if (!list) return;
    list.innerHTML = memories.map((memory, index) => `
      <li class="signal reveal">
        <div class="signal-meta"><span>${memory.date}</span><span>${pad(index + 1)} / ${pad(memories.length)}</span></div>
        <h3>${memory.title}</h3>
        <p>${memory.copy}</p>
        <span class="signal-tag">${memory.tag}</span>
      </li>`).join('');
  }

  function renderGallery() {
    const gallery = $('[data-gallery]');
    if (!gallery) return;
    gallery.innerHTML = photoCaptions.map((caption, index) => {
      const imageIndex = index + 1;
      const photo = `https://pop-yu.github.io/lumiere-birthday/images/${imageIndex}.jpg`;
      return `<button class="memory" type="button" data-photo="${photo}" data-caption="${caption}" aria-label="查看照片：${caption}">
        <img src="${photo}" alt="${caption}" loading="lazy" decoding="async" width="960" height="1280">
        <span class="memory-label"><span>${caption}</span><small>${pad(imageIndex)}</small></span>
      </button>`;
    }).join('');
  }

  function setupDialog() {
    const dialog = $('[data-dialog]');
    const openers = $$('[data-letter]');
    const closers = $$('[data-close]');
    openers.forEach(button => button.addEventListener('click', () => dialog?.showModal()));
    closers.forEach(button => button.addEventListener('click', () => dialog?.close()));
    dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

    const lightbox = $('[data-lightbox]');
    const image = $('[data-lightbox-image]');
    const caption = $('[data-lightbox-caption]');
    document.addEventListener('click', event => {
      const memory = event.target.closest('[data-photo]');
      if (!memory || !lightbox) return;
      image.src = memory.dataset.photo;
      image.alt = memory.dataset.caption || '';
      caption.textContent = memory.dataset.caption || '';
      lightbox.showModal();
    });
    $('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
    lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  }

  function setupSound() {
    const audio = $('[data-audio]');
    const button = $('[data-sound]');
    if (!audio || !button) return;
    const label = $('.sound-label', button);
    const setState = (playing) => {
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? '关闭环境音' : '开启环境音');
      if (label) label.textContent = playing ? 'SOUND ON' : 'SOUND OFF';
    };
    button.addEventListener('click', async () => {
      try {
        if (audio.paused) { await audio.play(); setState(true); }
        else { audio.pause(); setState(false); }
      } catch { setState(false); button.title = '环境音暂不可用'; }
    });
    audio.addEventListener('error', () => { button.hidden = true; });
  }

  function setupMotion() {
    const header = $('[data-header]');
    const setScrollState = () => header?.classList.toggle('is-scrolled', window.scrollY > 28);
    setScrollState(); window.addEventListener('scroll', setScrollState, { passive: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      window.addEventListener('pointermove', event => {
        document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
        document.documentElement.style.setProperty('--my', `${event.clientY}px`);
      }, { passive: true });
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    $$('.reveal').forEach(element => observer.observe(element));
  }

  renderSignals();
  renderGallery();
  setupDialog();
  setupSound();
  setupMotion();
  updateChronograph();
  window.setInterval(updateChronograph, 1000);
  $('[data-year]').textContent = new Date().getFullYear();
})();

