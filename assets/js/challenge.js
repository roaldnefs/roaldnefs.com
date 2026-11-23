(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (id) => document.getElementById(id);

  // Count a number up or down to its new value.
  function tween(node, to) {
    const from = +node.dataset.v || 0;
    node.dataset.v = to;
    if (reduced || from === to) { node.textContent = to; return; }
    const run = node._run = {};
    const t0 = performance.now();
    (function step(t) {
      if (node._run !== run) return;
      const k = Math.min(1, (t - t0) / 600);
      node.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  // ---------- Hero: stream of text behind the title ----------
  // Random CAN frames by default. A page can pass its own fragments as a JSON
  // list in data-words, which are then shuffled into the lines instead.
  const hex = (n, len) => Math.floor(Math.random() * n).toString(16).toUpperCase().padStart(len, '0');
  const heroBus = el('heroBus');
  if (heroBus) {
    let frame = () => hex(0x800, 3) + '  ' + Array.from({ length: 8 }, () => hex(256, 2)).join(' ');
    if (heroBus.dataset.words) {
      const words = JSON.parse(heroBus.dataset.words);
      frame = () => words[Math.floor(Math.random() * words.length)].padEnd(26);
    }
    const lines = Array.from({ length: 28 }, () => Array.from({ length: 7 }, frame).join('      ')).join('\n');
    const stream = document.createElement('div');
    stream.textContent = lines + '\n' + lines;
    heroBus.appendChild(stream);
  }

  // ---------- Challenges: number label, status chip ----------
  const challenges = [...document.querySelectorAll('.challenge')].map((node) => {
    const h3 = node.querySelector('h3');
    const [num, title] = h3.textContent.split(' // ');
    const label = document.createElement('span');
    label.className = 'ch-num';
    label.textContent = num;
    const time = document.createElement('span');
    time.className = 'ch-time';
    time.textContent = '\u2248 ' + node.dataset.min + ' min';
    label.appendChild(time);
    h3.replaceChildren(label, title);
    const status = document.createElement('span');
    status.className = 'challenge-status';
    node.appendChild(status);
    return { node, status, minutes: +node.dataset.min, short: 'short' in node.dataset, recap: node.querySelector('.recap'), boxes: [...node.querySelectorAll('.mission input[type="checkbox"]')] };
  });

  // ---------- Score ----------
  // Ticks are persisted per device; localStorage may be blocked (private mode,
  // cleared storage), so every access is guarded.
  const boxes = [...document.querySelectorAll('ul.mission input[type="checkbox"]')];

  // Each challenge page keeps its own storage, ranks and celebration text, read
  // from a data-store attribute; the car page omits it and uses these defaults.
  const storeEl = document.querySelector('[data-store]');
  const store = (storeEl && storeEl.dataset.store) || 'virtual-cluster-challenges';

  // Ticks are stored by position: bump the version when objectives are added or reordered.
  const KEY = store + '-score-v1';
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (e) { return []; }
  };
  const write = (arr) => {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
  };

  const totalEl = el('scoreTotal'), maxEl = el('scoreMax'), fillEl = el('scoreFill'),
        needleEl = el('scoreNeedle'), countEl = el('scoreCount'), ofEl = el('scoreOf'),
        rankEl = el('scoreRank'), resetEl = el('scoreReset'), celebEl = el('celebration'),
        sectionsEl = el('scoreSections');

  // Read each task's points from its .pts label; max scales with the tasks present.
  let fullMax = 0;
  boxes.forEach((cb) => {
    const n = parseInt(cb.parentElement.querySelector('.pts').textContent.replace(/[^0-9]/g, ''), 10) || 0;
    cb.dataset.pts = n;
    fullMax += n;
  });
  const active = (cb) => !cb.closest('.challenge').hidden;

  // One progress row per section in the score panel.
  const sections = [...document.querySelectorAll('.section-head')].map((head) => {
    const h2 = head.querySelector('h2');
    const sectionBoxes = [];
    for (let n = head.nextElementSibling; n && !n.matches('.section-head, h2'); n = n.nextElementSibling) {
      if (n.matches('.challenge')) sectionBoxes.push(...n.querySelectorAll('.mission input[type="checkbox"]'));
    }
    const li = document.createElement('li');
    li.innerHTML = '<a></a><span class="sbar"><i></i></span><span class="snum"></span>';
    li.querySelector('a').textContent = h2.textContent;
    li.querySelector('a').href = '#' + h2.id;
    sectionsEl.appendChild(li);
    return { boxes: sectionBoxes, bar: li.querySelector('i'), num: li.querySelector('.snum') };
  });

  // Ranks keyed on fraction of max, so they stay sane as challenges are added.
  // A page can set its own with a data-ranks attribute on the score panel.
  let ranks = [
    [0,    'Passenger'],
    [0.15, 'Bus Sniffer'],
    [0.35, 'Frame Forger'],
    [0.55, 'Needle Bender'],
    [0.80, 'Seed Cracker'],
    [1,    'Cluster Overlord']
  ];
  const scoreBox = document.querySelector('.score');
  if (scoreBox && scoreBox.dataset.ranks) {
    try {
      const custom = JSON.parse(scoreBox.dataset.ranks);
      if (Array.isArray(custom) && custom.length) ranks = custom;
    } catch (e) {}
  }
  const cdata = (celebEl && celebEl.dataset) || {};
  const rankFor = (frac) => {
    let r = ranks[0][1];
    for (const [t, name] of ranks) if (frac >= t) r = name;
    return r;
  };

  function confetti() {
    if (reduced) return;
    const layer = document.createElement('div');
    layer.className = 'confetti';
    const colors = ['#7aa2ff', '#9dbaff', '#ffffff', '#f8c98a'];
    for (let i = 0; i < 90; i++) {
      const piece = document.createElement('i');
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = (2.2 + Math.random() * 2.4) + 's';
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.setProperty('--spin', (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 540) + 'deg');
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 6000);
  }

  const saved = new Set(read());
  boxes.forEach((cb, i) => { if (saved.has(i)) cb.checked = true; });

  // Confetti only fires on a live transition, not when a finished page is reloaded.
  let wasMaxed = true;

  // silent: refresh everything but never fire confetti (page load, route switch).
  function update(silent) {
    let total = 0, max = 0, count = 0, of = 0;
    const checked = [];
    boxes.forEach((cb, i) => {
      if (cb.checked) checked.push(i);
      if (!active(cb)) return;
      of++;
      max += +cb.dataset.pts;
      if (cb.checked) { total += +cb.dataset.pts; count++; }
    });
    maxEl.textContent = max;
    ofEl.textContent = of;
    const frac = total / max;
    const maxed = total === max;
    tween(totalEl, total);
    countEl.textContent = count;
    fillEl.style.strokeDasharray = (frac * 100) + ' 100';
    needleEl.style.transform = 'rotate(' + (-120 + 240 * frac) + 'deg)';
    rankEl.textContent = rankFor(frac);
    celebEl.classList.toggle('show', maxed);
    const short = challenges.some((c) => c.node.hidden);
    el('celebrationTitle').textContent = short ? (cdata.titleShort || 'Short route complete') : (cdata.titleFull || 'Cluster Overlord');
    el('celebrationText').textContent = short ? (cdata.textShort || 'You have done the essentials. Switch to the full route for ten more challenges.') : (cdata.textFull || 'All objectives done. Nice work.');
    for (const c of challenges) {
      const done = c.boxes.filter((cb) => cb.checked).length;
      const complete = done === c.boxes.length;
      c.status.textContent = complete ? 'Cleared' : done + ' / ' + c.boxes.length;
      c.node.classList.toggle('done', complete);
      if (c.recap) c.recap.hidden = !complete;
    }
    for (const s of sections) {
      const on = s.boxes.filter(active);
      const done = on.filter((cb) => cb.checked).length;
      s.bar.style.width = (done / on.length * 100) + '%';
      s.num.textContent = done + '/' + on.length;
    }
    if (maxed && !wasMaxed && silent !== true) confetti();
    wasMaxed = maxed;
    write(checked);
  }

  boxes.forEach((cb) => cb.addEventListener('change', () => update()));
  resetEl.addEventListener('click', () => {
    if (window.confirm('Clear all ticked objectives?')) {
      boxes.forEach((cb) => { cb.checked = false; });
      asks.forEach(clearAsk);
      update();
    }
  });

  // ---------- Answer-checked objectives ----------
  // The answer is never in the page: only a salted SHA-256 of it is. We hash
  // what the visitor types and compare. Short answers can still be brute-forced,
  // so this stops casual peeking at source, not a determined solver.
  const SALT = 'vcc:1:';
  const norm = (s, mode) => {
    s = s.toLowerCase().trim();
    if (mode === 'strict') return s.replace(/\s+/g, '');
    return s.replace(/^0x/, '').replace(/[^a-z0-9]/g, '');
  };
  async function sha(s) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function solveAsk(ask) {
    ask.node.classList.add('solved');
    ask.node.classList.remove('wrong');
    ask.input.readOnly = true;
    ask.button.disabled = true;
    ask.msg.textContent = 'Correct.';
    ask.msg.className = 'answer-msg ok';
  }
  function clearAsk(ask) {
    ask.node.classList.remove('solved', 'wrong');
    ask.input.readOnly = false;
    ask.input.value = '';
    ask.button.disabled = false;
    ask.msg.textContent = '';
    ask.msg.className = 'answer-msg';
  }

  const asks = [...document.querySelectorAll('.mission li.ask')].map((node) => {
    const ask = {
      node,
      box: node.querySelector('input[type="checkbox"]'),
      input: node.querySelector('.answer input'),
      button: node.querySelector('.answer button'),
      msg: node.querySelector('.answer-msg'),
      hashes: node.dataset.answer.split(' '),
      mode: node.dataset.mode,
    };
    node.querySelector('.answer').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (ask.box.checked) return;
      const value = ask.input.value.trim();
      if (!value) return;
      let h = '';
      try { h = await sha(SALT + norm(value, ask.mode)); } catch (err) { /* no crypto.subtle */ }
      if (ask.hashes.includes(h)) {
        ask.box.checked = true;
        solveAsk(ask);
        update();
      } else {
        ask.node.classList.remove('wrong');
        void ask.node.offsetWidth;
        ask.node.classList.add('wrong');
        ask.msg.textContent = 'Not quite. Try again.';
        ask.msg.className = 'answer-msg no';
      }
    });
    return ask;
  });
  // Restore the solved look for answers cleared correctly in a past visit.
  asks.forEach((ask) => { if (ask.box.checked) solveAsk(ask); });

  // ---------- Routes: short hides every challenge without data-short ----------
  const ROUTE_KEY = store + '-route';
  const routeButtons = [...document.querySelectorAll('.route')];
  const describe = (list) => {
    const minutes = list.reduce((a, c) => a + c.minutes, 0);
    const pts = list.reduce((a, c) => a + c.boxes.reduce((b, cb) => b + +cb.dataset.pts, 0), 0);
    const time = minutes < 60 ? 'about ' + minutes + ' min' : 'about ' + (Math.round(minutes / 30) / 2) + ' hours';
    return list.length + ' challenges \u00b7 ' + time + ' \u00b7 ' + pts + ' points';
  };
  const shortMeta = el('routeShortMeta');
  if (shortMeta) shortMeta.textContent = describe(challenges.filter((c) => c.short));
  const fullMeta = el('routeFullMeta');
  if (fullMeta) fullMeta.textContent = describe(challenges);

  function setRoute(route, save) {
    for (const c of challenges) c.node.hidden = route === 'short' && !c.short;
    for (const b of routeButtons) b.setAttribute('aria-checked', String(b.dataset.route === route));
    if (save) { try { localStorage.setItem(ROUTE_KEY, route); } catch (e) {} }
    update(true);
  }
  routeButtons.forEach((b) => b.addEventListener('click', () => setRoute(b.dataset.route, true)));

  // A link with ?route=short (or full) picks the route, handy for a workshop.
  let route = new URLSearchParams(location.search).get('route');
  if (route !== 'short' && route !== 'full') {
    try { route = localStorage.getItem(ROUTE_KEY); } catch (e) {}
  }
  setRoute(route === 'short' ? 'short' : 'full', false);

  // ---------- Gauge: sweep to the end stop and back when it first comes into view ----------
  const gauge = document.querySelector('.gauge');
  if (!reduced && gauge && 'IntersectionObserver' in window) {
    const sweep = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      sweep.disconnect();
      needleEl.style.transform = 'rotate(120deg)';
      fillEl.style.strokeDasharray = '100 100';
      setTimeout(() => update(true), 900);
    }, { threshold: 0.6 });
    sweep.observe(gauge);
  }

  // ---------- Hero stats count up ----------
  [['statChallenges', challenges.length], ['statObjectives', boxes.length], ['statPoints', fullMax]]
    .forEach(([id, value]) => tween(el(id), value));

  // ---------- Fade blocks in as they scroll into view ----------
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.shot, .target, .challenge, .diagram, .section-head, .score, .frame, .prose > .code, .prose > .table-wrap, .prose > .callout, .prose > .steps')
      .forEach((node) => { node.classList.add('rv'); io.observe(node); });
  }
})();
