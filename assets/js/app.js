(function () {
  const D = window.HDATA, A = window.ART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  A.installDefs();

  /* decorações em escrita inventada */
  $('.title-script').innerHTML = A.script(10, 22, 240, 3, 1.1);
  $('.foot-script').innerHTML = A.script(10, 18, 280, 99, 1);

  /* ── animações só quando visíveis ── */
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('on', e.isIntersecting)), { rootMargin: '80px' });
  const watch = root => $$('.art', root).forEach(el => io.observe(el));

  /* ═════════ ROTEADOR DE ABAS ═════════ */
  const tabs = ['historia', 'ciencia', 'consulta'];
  function route() {
    const id = (location.hash || '#historia').slice(1);
    const tab = tabs.includes(id) ? id : 'historia';
    tabs.forEach(t => { $('#aba-' + t).hidden = t !== tab; });
    $$('.tabs a').forEach(a => a.dataset.tab === tab ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    document.body.dataset.tab = tab;
    if (tab !== 'historia') document.body.dataset.era = 'hahnemann';
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (tab === 'historia') buildTimeline();
    if (tab === 'ciencia') buildScience();
    onScroll();
  }
  $$('.tabs a').forEach(a => a.addEventListener('click', () => { if (location.hash === a.getAttribute('href')) route(); }));
  window.addEventListener('hashchange', route);

  /* ═════════ CONSULTA ═════════ */
  const chipsEl = $('#chips'), q = $('#q'), stage = $('#stage'), fig = $('#plateFig'), result = $('#result');
  let chosen = null;
  D.complaints.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.setAttribute('role', 'listitem'); b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `${miniIcon(c.id)}<span>${c.chip}</span>`;
    b.onclick = () => {
      chosen = c; q.value = c.chip;
      $$('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      answer(c.chip, c);
    };
    chipsEl.appendChild(b);
  });
  function miniIcon(id) {
    const m = { hematoma: ['#7d55a3', '#eec19d'], coriza: ['#a98bc9', '#93bfe0'], insonia: ['#e9bd34', '#3d62a8'], digestao: ['#e39aa3', '#97bd55'], picada: ['#e9bd34', '#7e5233'], enjoo: ['#3d62a8', '#93bfe0'] }[id];
    return `<svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="9" fill="${m[1]}"/><circle cx="15" cy="15" r="5" fill="${m[0]}"/></svg>`;
  }
  q.addEventListener('input', () => { if (chosen && q.value !== chosen.chip) { chosen = null; $$('.chip').forEach(x => x.setAttribute('aria-pressed', 'false')); } });
  $('#ask').addEventListener('submit', e => {
    e.preventDefault();
    const t = q.value.trim();
    if (!t) { q.focus(); return; }
    if (chosen && t === chosen.chip) answer(t, chosen); else consult(t);
  });
  q.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) $('#ask').requestSubmit(); });

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function match(text) {
    const t = ' ' + norm(text) + ' ';
    let best = null, score = 0;
    D.complaints.forEach(c => { const s = c.keywords.filter(k => t.includes(norm(k))).length; if (s > score) { score = s; best = c; } });
    return best;
  }

  function answer(text, fromChip) {
    const urgent = D.urgent.filter(u => u.re.test(text) || u.re.test(norm(text)));
    const c = fromChip || match(text);
    // ilustração só para as queixas de exemplo
    if (fromChip) {
      stage.hidden = false;
      fig.innerHTML = A.complaint[c.id]() + `<figcaption>${c.title} — prancha ilustrada</figcaption>`;
      watch(fig);
    } else { stage.hidden = true; fig.innerHTML = ''; }

    let h = '';
    if (urgent.length) h += `<div class="card urgent wide"><h4>Atenção primeiro</h4>${urgent.map(u => `<p>${u.msg}</p>`).join('')}</div>`;
    if (c) {
      h += `<div class="res-grid">
        <div class="card body wide"><span class="kicker">o que acontece no corpo</span><h4>${c.title}</h4><p>${c.whatHappens}</p>${!fromChip ? `<p><i>Sua descrição lembra este caso. Escolha o exemplo “${c.chip}” acima para ver a prancha ilustrada.</i></p>` : ''}</div>
        <div class="card trad"><span class="kicker">na tradição homeopática</span><h4>Medicamentos citados nos livros</h4>
          <ul class="rem">${c.remedies.map(r => `<li><b>${r.name}</b><span class="orig">${r.origin}</span><br>${r.note}</li>`).join('')}</ul></div>
        <div class="card"><span class="kicker">individualização</span><h4>O que o homeopata perguntaria</h4><p>${c.modalities}</p>
          <p>Na homeopatia clássica a escolha depende dessas respostas — por isso dois pacientes com a mesma queixa podem receber medicamentos diferentes.</p></div>
        <div class="card alert"><span class="kicker">sinais de alerta</span><h4>Procure um médico se…</h4><ul>${c.redFlags.map(r => `<li>${r}</li>`).join('')}</ul></div>
        <div class="card sci"><span class="kicker">o que a ciência diz</span><h4>O que comprovadamente ajuda</h4><p>${c.science}</p></div>
      </div>`;
    } else {
      h += `<div class="res-grid">
        <div class="card body wide"><span class="kicker">como seria uma consulta</span><h4>Um homeopata começaria perguntando… muito</h4>
          <p>Não temos uma prancha para essa queixa, mas podemos mostrar como o raciocínio funciona. Uma consulta homeopática clássica dura cerca de uma hora e quer saber:</p>
          <ul><li><b>Modalidades:</b> o que melhora e o que piora o sintoma (frio, calor, movimento, repouso, hora do dia)?</li>
          <li><b>Sensações:</b> é queimação, pontada, peso, latejamento?</li>
          <li><b>A pessoa inteira:</b> sono, sede, apetite, humor, medos.</li></ul>
          <p>Com isso o homeopata procura, num “repertório”, o medicamento cujo retrato na Matéria Médica mais se parece com o seu.</p></div>
        <div class="card alert"><span class="kicker">sempre vale</span><h4>Procure um médico se…</h4><ul><li>o sintoma é forte, novo ou diferente de tudo</li><li>dura mais que alguns dias ou só piora</li><li>vem com febre alta, falta de ar, dor no peito, desmaio ou sangramento</li></ul></div>
        <div class="card sci"><span class="kicker">o que a ciência diz</span><h4>Remédios homeopáticos e evidência</h4><p>As grandes revisões não encontraram efeito dos medicamentos homeopáticos além do placebo. Veja os detalhes na aba <a href="#ciencia">Ciência</a>.</p></div>
      </div>`;
    }
    result.innerHTML = h;
    const tgt = fromChip ? stage : result;
    requestAnimationFrame(() => { const y = tgt.getBoundingClientRect().top + scrollY - 150; window.scrollTo({ top: y, behavior: 'smooth' }); });
  }

  /* ── consulta com IA (função /api/anamnese no Vercel) ── */
  const API = /vercel\.app$/.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && location.port === '3000'
    ? '/api/anamnese' : 'https://homeopatia.vercel.app/api/anamnese';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const list = a => Array.isArray(a) && a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const row = (k, v) => v ? `<div class="an-row"><span class="an-k">${k}</span><div>${v}</div></div>` : '';
  let busy = false;
  async function consult(text) {
    if (busy) return; busy = true;
    const btn = $('#ask button[type=submit]'); btn.disabled = true;
    stage.hidden = true; fig.innerHTML = '';
    result.innerHTML = `<div class="card body wide loading"><span class="kicker">consultório</span><h4>Montando sua anamnese…</h4><p>Organizando o que você contou como um homeopata faria. Isso leva uns 20 a 40 segundos.</p><div class="dots"><i></i><i></i><i></i></div></div>`;
    requestAnimationFrame(() => window.scrollTo({ top: result.getBoundingClientRect().top + scrollY - 150, behavior: 'smooth' }));
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 70000);
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texto: text }), signal: ctl.signal });
      clearTimeout(to);
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Não foi possível gerar a anamnese agora.');
      renderAnamnese(d, text);
    } catch (e) {
      answer(text, null);
      result.insertAdjacentHTML('afterbegin', `<div class="card alert wide"><span class="kicker">aviso</span><h4>A anamnese completa não respondeu</h4><p>${esc(e.name === 'AbortError' ? 'Demorou demais para responder.' : e.message)} Enquanto isso, veja a orientação geral abaixo.</p></div>`);
    } finally { busy = false; btn.disabled = false; }
  }
  function renderAnamnese(d, text) {
    const urgentLocal = D.urgent.filter(u => u.re.test(text) || u.re.test(norm(text)));
    let h = '';
    if (d.urgente) h += `<div class="card urgent wide"><h4>Atenção primeiro</h4><p>${esc(d.urgente)}</p></div>`;
    else if (urgentLocal.length) h += `<div class="card urgent wide"><h4>Atenção primeiro</h4>${urgentLocal.map(u => `<p>${u.msg}</p>`).join('')}</div>`;
    const an = row('Queixa principal', esc(d.queixa_principal)) + row('História', esc(d.historia)) + row('Sensações', list(d.sensacoes)) +
      row('Piora com', list(d.piora)) + row('Melhora com', list(d.melhora)) + row('Sintomas que acompanham', list(d.concomitantes)) +
      row('Sintomas gerais', list(d.gerais)) + row('Mente e emoções', list(d.mentais));
    h += `<div class="res-grid">
      <div class="card body wide"><span class="kicker">anamnese homeopática</span><h4>Seu caso, organizado</h4><p>${esc(d.resumo)}</p>${an ? `<div class="an">${an}</div>` : ''}</div>`;
    if (d.perguntas_que_faltam && d.perguntas_que_faltam.length) h += `<div class="card wide"><span class="kicker">para completar o caso</span><h4>O homeopata ainda perguntaria</h4>${list(d.perguntas_que_faltam)}<p><i>Responda essas perguntas na caixa acima, junto com o que você já escreveu, e peça de novo para uma anamnese mais completa.</i></p></div>`;
    if (d.no_corpo) h += `<div class="card body"><span class="kicker">o que acontece no corpo</span><h4>Por dentro</h4><p>${esc(d.no_corpo)}</p></div>`;
    if (d.medicamentos_da_tradicao && d.medicamentos_da_tradicao.length) h += `<div class="card trad"><span class="kicker">na tradição homeopática</span><h4>Medicamentos citados nos livros</h4>
      <ul class="rem">${d.medicamentos_da_tradicao.map(m => `<li><b>${esc(m.nome)}</b><span class="orig">${esc(m.origem)}</span><br>${esc(m.por_que)}</li>`).join('')}</ul></div>`;
    if (d.procurar_medico_se && d.procurar_medico_se.length) h += `<div class="card alert"><span class="kicker">sinais de alerta</span><h4>Procure um médico se…</h4>${list(d.procurar_medico_se)}</div>`;
    if (d.ciencia) h += `<div class="card sci"><span class="kicker">o que a ciência diz</span><h4>O que comprovadamente ajuda</h4><p>${esc(d.ciencia)}</p></div>`;
    h += `</div>`;
    const c = match(text);
    if (c) h += `<p class="an-note"><i>Sua descrição lembra o exemplo “${esc(c.chip)}”. Toque nele acima para ver a prancha ilustrada.</i></p>`;
    result.innerHTML = h;
  }

  /* princípios — caixinhas que viram */
  const pr = $('#principles');
  D.principles.forEach(p => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pr'; b.setAttribute('aria-expanded', 'false');
    b.innerHTML = `<div class="pr-in">
      <div class="pr-face pr-front">${A.principle[p.id]()}<h3>${p.title}</h3><span class="latin">${p.latin}</span><p>${p.short}</p><span class="flip-hint">virar ↻</span></div>
      <div class="pr-face pr-back"><h3>${p.title}</h3><p>${p.long}</p><p class="sci-n"><b>Olhar científico:</b> ${p.sci}</p></div></div>`;
    b.onclick = () => { const o = b.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); };
    pr.appendChild(b);
  });
  watch(pr);

  /* ═════════ HISTÓRIA ═════════ */
  let tlBuilt = false, tl = null;
  function fmtYear(y) { y = Math.round(y); return y < 0 ? `${-y} a.C.` : String(y); }
  const eraName = { antiga: 'Antiguidade e Renascimento', hahnemann: 'A vida de Hahnemann', brasil: 'Expansão pelo mundo', moderna: 'Século XX', contemporanea: 'Século XXI' };

  function buildTimeline() {
    if (tlBuilt) { layoutVines(); return; }
    tlBuilt = true;
    const ol = $('#events'), dots = $('#tlDots');
    let prev = null, html = '';
    D.timeline.forEach((e, i) => {
      if (prev) {
        const dy = e.y - prev.y;
        if (dy > 60) html += `<li class="gap-note" aria-hidden="true"><span>⋯ ${dy.toLocaleString('pt-BR')} anos se passam ⋯</span></li>`;
      }
      const gap = prev ? 0 : 0;
      const next = D.timeline[i + 1];
      const g = next ? Math.min(220, 30 + Math.sqrt(Math.max(1, next.y - e.y)) * 14) : 40;
      const rot = ((i * 37) % 5 - 2) * .35;
      html += `<li class="ev${e.big ? ' big' : ''}" data-i="${i}" style="--gap:${g}px;--rot:${rot}deg"><div class="ev-card">
        <span class="ev-year">${e.label}</span><h3>${e.title}</h3>
        ${e.art && A.history[e.art] ? A.history[e.art]() : ''}<p>${e.text}</p></div></li>`;
      prev = e;
    });
    ol.innerHTML = html;
    dots.innerHTML = D.timeline.map((e, i) => `<button type="button" data-i="${i}" data-l="${e.label} · ${e.title}" aria-label="${e.label}: ${e.title}"></button>`).join('');
    dots.onclick = ev => { const i = ev.target.dataset.i; if (i == null) return; const el = $(`.ev[data-i="${i}"]`); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * .3, behavior: 'smooth' }); };
    watch(ol);
    const seen = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('seen'); }), { rootMargin: '0px 0px -18% 0px' });
    $$('.ev', ol).forEach(el => seen.observe(el));
    // as ilustrações podem mudar a altura; recalcula
    requestAnimationFrame(layoutVines);
    window.addEventListener('resize', debounce(layoutVines, 200));
    document.fonts && document.fonts.ready.then(layoutVines);
  }

  function layoutVines() {
    const box = $('#timeline'); if (!box || box.offsetParent === null) return;
    const h = box.offsetHeight;
    const evs = $$('.ev', box).map(el => ({ el, i: +el.dataset.i, top: el.offsetTop + 30 }));
    tl = { box, h, evs, sides: [] };
    ['L', 'R'].forEach((s, k) => {
      const svg = $('#vine' + s); const w = innerWidth < 760 ? 34 : 70;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.style.height = h + 'px';
      const v = growVine(h, w, k ? 'r' : 'l', 17 + k * 31);
      svg.innerHTML = v.svg;
      const stem = svg.querySelector('.stem'), len = stem.getTotalLength();
      // tabela y → comprimento
      const table = []; for (let l = 0; l <= len; l += 12) table.push([stem.getPointAtLength(l).y, l]);
      $$('.stem,.stem2', svg).forEach(p => { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
      const lfs = $$('.lf', svg).map(el => ({ el, y: +el.dataset.y, on: false }));
      tl.sides.push({ svg, len, table, lfs, paths: $$('.stem,.stem2', svg) });
    });
    onScroll();
  }

  function growVine(h, w, side, seed) {
    let a = seed; const r = () => { a = (a * 9301 + 49297) % 233280; return a / 233280; };
    let d = `M${w / 2} 0`, y = 0, x = w / 2; const pts = [];
    while (y < h) {
      const ny = Math.min(h, y + 140 + r() * 90), nx = w * (.25 + r() * .5);
      d += ` C${x} ${y + 60} ${nx} ${ny - 60} ${nx} ${ny}`; pts.push([x, y, nx, ny]); x = nx; y = ny;
    }
    const sc = w / 70; let leaves = '';
    const cols = ['#5f8f34', '#97bd55', '#6f9a3c', '#a3c165'];
    const fcols = [['#e39aa3', '#e9bd34'], ['#a98bc9', '#e9bd34'], ['#e9bd34', '#c4473a'], ['#93bfe0', '#f3e3bd']];
    for (let ly = 60; ly < h - 20; ly += 34 + r() * 30) {
      // aproxima x pelo segmento
      const seg = pts.find(p => ly <= p[3]) || pts[pts.length - 1];
      const t = (ly - seg[1]) / Math.max(1, seg[3] - seg[1]);
      const lx = seg[0] + (seg[2] - seg[0]) * (t * t * (3 - 2 * t));
      const dir = r() < .5 ? -1 : 1, L = (16 + r() * 14) * sc, rot = dir < 0 ? 180 + 20 + r() * 30 : -20 - r() * 30;
      if (r() < .13) {
        const [pc, cc] = fcols[Math.floor(r() * fcols.length)], R = (9 + r() * 6) * sc, n = 5 + Math.floor(r() * 4);
        let f = `<g class="lf fl" data-y="${ly}" style="transform-origin:${lx}px ${ly}px"><path d="M${lx} ${ly} q${dir * 8 * sc} -6 ${dir * 14 * sc} -14" stroke="#4f7a2c" stroke-width="1.5" fill="none"/><g transform="translate(${lx + dir * 14 * sc} ${ly - 14 * sc})">`;
        for (let i = 0; i < n; i++) f += `<ellipse cx="0" cy="${-R * .55}" rx="${R * .32}" ry="${R * .55}" transform="rotate(${i * 360 / n})" fill="${pc}" stroke="#3a2a1e" stroke-width=".7"/>`;
        f += `<circle r="${R * .28}" fill="${cc}" stroke="#3a2a1e" stroke-width=".7"/></g></g>`;
        leaves += f;
      } else {
        const c = cols[Math.floor(r() * cols.length)];
        leaves += `<g class="lf" data-y="${ly}" style="transform-origin:${lx}px ${ly}px"><path transform="translate(${lx} ${ly}) rotate(${rot})" d="M0 0 C${L * .3} ${-L * .3} ${L * .75} ${-L * .26} ${L} 0 C${L * .75} ${L * .26} ${L * .3} ${L * .3} 0 0Z" fill="${c}" fill-opacity=".85" stroke="#3a2a1e" stroke-width=".8"/><path transform="translate(${lx} ${ly}) rotate(${rot})" d="M2 0 H${L * .9}" stroke="#3a2a1e" stroke-width=".5" opacity=".6"/></g>`;
        if (r() < .3) leaves += `<g class="lf" data-y="${ly + 8}" style="transform-origin:${lx}px ${ly + 8}px"><path d="M${lx} ${ly + 8} c${-dir * 10 * sc} -2 ${-dir * 14 * sc} -12 ${-dir * 8 * sc} -16 c4 -3 8 2 4 6" fill="none" stroke="#6f9a3c" stroke-width="1.1"/></g>`;
      }
    }
    return { svg: `<path class="stem" d="${d}"/><path class="stem2" d="${d}" transform="translate(1.2 0)"/>${leaves}` };
  }

  function updateTimeline() {
    if (!tl || $('#aba-historia').hidden) { $('#yearMeter').classList.remove('show'); $('#tlDots').classList.remove('show'); return; }
    const top = tl.box.getBoundingClientRect().top + scrollY;
    const front = scrollY + innerHeight * .78 - top; // até onde a planta cresce
    // plantas
    tl.sides.forEach(s => {
      let l = 0; if (front > 0) { const T = s.table; let i = 0; while (i < T.length - 1 && T[i + 1][0] < front) i++; l = T[i] ? T[i][1] : 0; if (front >= tl.h) l = s.len; }
      const off = s.len - l;
      s.paths.forEach(p => { p.style.strokeDashoffset = off; });
      s.lfs.forEach(o => { const on = o.y < front; if (on !== o.on) { o.on = on; o.el.classList.toggle('show', on); } });
    });
    // linha central
    $('#spineFill').style.height = Math.max(0, Math.min(tl.h - 80, scrollY + innerHeight * .5 - top)) + 'px';
    // contador de ano
    const mid = scrollY + innerHeight * .5 - top;
    const ev = tl.evs; let k = 0; while (k < ev.length - 1 && ev[k + 1].top < mid) k++;
    const a = D.timeline[ev[k].i], b = D.timeline[ev[Math.min(k + 1, ev.length - 1)].i];
    const span = ev[Math.min(k + 1, ev.length - 1)].top - ev[k].top;
    const f = span > 0 ? Math.max(0, Math.min(1, (mid - ev[k].top) / span)) : 0;
    const yr = mid < ev[0].top ? a.y : a.y + (b.y - a.y) * f;
    $('#ymYear').textContent = fmtYear(yr);
    const era = (f > .5 ? b : a).era;
    $('#ymEra').textContent = eraName[era] || '';
    if (document.body.dataset.era !== era) document.body.dataset.era = era;
    const inside = scrollY + innerHeight > top + 100 && scrollY < top + tl.h - innerHeight * .4;
    $('#yearMeter').classList.toggle('show', inside);
    $('#tlDots').classList.toggle('show', inside);
    $$('#tlDots button').forEach((d, i) => d.classList.toggle('on', i === ev[k].i));
  }

  /* ═════════ CIÊNCIA ═════════ */
  let sciBuilt = false;
  function buildScience() {
    if (sciBuilt) return; sciBuilt = true;
    $$('.art-slot').forEach(s => { const [g, k] = s.dataset.art.split('.'); s.innerHTML = A[g][k](); });
    watch($('#aba-ciencia'));
    // escada
    const R = $('#ladderRange'); R.max = D.ladder.length - 1;
    const sup = n => String(n).replace(/-/g, '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    function setStep(i) {
      const s = D.ladder[i], n = s.n, mols = 18 - 2 * n;
      $('#potN').textContent = n + 'C';
      $('#potRatio').textContent = n === 0 ? 'tintura-mãe (sem diluir)' : `diluição de 1 para 10${sup(2 * n)}`;
      $('#cmpIcon').innerHTML = A.science.cmpIcon(s.icon);
      $('#cmpVol').textContent = s.vol; $('#cmpTxt').textContent = s.cmp;
      $('#molTxt').textContent = mols >= 3 ? `~10${sup(mols)} moléculas` : mols >= 0 ? `~${Math.pow(10, mols)} molécula${mols ? 's' : ''}` : `chance de achar 1: uma em 10${sup(-mols)}`;
      $('#ladderFlask').innerHTML = A.science.flask(mols);
      $('#ladderNote').textContent = n === 6 ? 'Muitos produtos vendidos em farmácia são 6C ou 12C.' : n === 9 ? 'Aqui sobra, em média, uma molécula. Daqui pra cima, provavelmente nenhuma.' : n === 12 ? '12C: passamos do número de Avogadro. Mesmo 1 mol inteiro já teria sumido.' : n === 30 ? '30C é uma potência muito comum. Para achar 1 molécula, a esfera de água seria maior que nossa vizinhança de estrelas.' : '';
      watch($('#ladder'));
    }
    R.oninput = () => setStep(+R.value); setStep(0);
    let timer = null;
    $('#ladderPlay').onclick = () => {
      if (timer) { clearInterval(timer); timer = null; $('#ladderPlay').textContent = '▶ subir a escada'; return; }
      if (+R.value >= +R.max) R.value = 0;
      $('#ladderPlay').textContent = '❚❚ pausar';
      timer = setInterval(() => { if (+R.value >= +R.max) { clearInterval(timer); timer = null; $('#ladderPlay').textContent = '▶ subir a escada'; return; } R.value = +R.value + 1; setStep(+R.value); }, 1500);
    };
  }

  /* ═════════ SCROLL ═════════ */
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      // histerese: a diferença entre os limites (130px) é maior que o quanto o cabeçalho encolhe,
      // então encolher nunca joga a rolagem de volta para o outro lado do limite (era o que fazia tremer)
      const top = $('.top'), c = top.classList.contains('compact');
      if (!c && scrollY > 160) top.classList.add('compact');
      else if (c && scrollY < 30) top.classList.remove('compact');
      updateTimeline();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  function debounce(f, t) { let h; return () => { clearTimeout(h); h = setTimeout(f, t); }; }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  route();
  window.addEventListener('load', () => { window.scrollTo(0, 0); onScroll(); });
})();
