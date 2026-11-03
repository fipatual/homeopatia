/* ═══════════════════════════════════════════════════════════════
   ART — ilustrações em SVG no espírito do Codex Seraphinianus:
   lápis de cor, papel creme, cortes transversais, cotas técnicas
   e legendas numa escrita inventada.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  const PAL = {
    red: '#c4473a', rose: '#e39aa3', purple: '#7d55a3', violet: '#a98bc9', blue: '#3d62a8',
    sky: '#93bfe0', teal: '#3f8f8a', green: '#5f8f34', leaf: '#97bd55', yellow: '#e9bd34',
    ochre: '#c98a35', orange: '#e07b39', brown: '#7e5233', skin: '#eec19d', cream: '#f3e3bd',
    gray: '#9a948a', white: '#fbf6ea', ink: '#3a2a1e', gold: '#d9a62e', pink: '#f0b9c4', mud: '#a3965a'
  };
  const INK = PAL.ink;

  /* ---------- defs globais (injetados uma vez) ---------- */
  function installDefs() {
    if (document.getElementById('art-defs')) return;
    let pats = '';
    Object.entries(PAL).forEach(([k, c], i) => {
      const ang = 30 + (i * 17) % 40;
      pats += `<pattern id="p-${k}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})">
        <rect width="5" height="5" fill="${c}" opacity=".5"/>
        <path d="M0 1.2h5M0 3.7h5" stroke="${c}" stroke-width="1.5" opacity=".9"/></pattern>`;
    });
    const svg = `<svg id="art-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      ${pats}
      <pattern id="p-shade" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
        <path d="M0 2h4" stroke="${INK}" stroke-width=".7" opacity=".35"/></pattern>
      <pattern id="p-cross" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 2.5h5M2.5 0v5" stroke="${INK}" stroke-width=".5" opacity=".3"/></pattern>
      <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="w"/>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="8" result="g"/>
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="m"/>
        <feComposite in="d" in2="m" operator="in"/>
      </filter>
      <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 1 L9 5 L0 9" fill="none" stroke="${INK}" stroke-width="1.4"/></marker>
      <marker id="tick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M5 0 V10" stroke="${INK}" stroke-width="1"/></marker>
    </defs></svg>`;
    document.body.insertAdjacentHTML('afterbegin', svg);
  }

  /* ---------- utilidades ---------- */
  const P = c => `url(#p-${c})`;
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* Escrita inventada: laços cursivos determinísticos */
  function script(x, y, w, seed = 1, s = 1) {
    const r = rng(seed); let d = '', cx = x; const xh = 6 * s;
    while (cx < x + w - 8 * s) {
      const word = 2 + Math.floor(r() * 5);
      d += `M${cx.toFixed(1)} ${y}`;
      for (let i = 0; i < word && cx < x + w - 8 * s; i++) {
        const t = r(), gw = (5 + r() * 4) * s;
        if (t < .25) d += ` c${1 * s} ${-xh * 2.2} ${gw} ${-xh * 2.2} ${gw * .3} 0 s${gw * .5} ${-xh * .4} ${gw * .7} 0`;
        else if (t < .45) d += ` c${gw * .2} ${-xh} ${gw * .8} ${-xh} ${gw * .5} ${-xh * .1} c${-gw * .3} ${xh * .1} ${-gw * .3} ${-xh * .7} ${gw * .5} 0`;
        else if (t < .6) d += ` c${gw * .3} ${xh * 1.8} ${gw * .7} ${xh * 1.8} ${gw * .4} 0 c0 ${-xh * .6} ${gw * .3} ${-xh * .6} ${gw * .6} 0`;
        else if (t < .8) d += ` q${gw * .5} ${-xh * 1.4} ${gw} 0`;
        else d += ` c${gw * .2} ${-xh * .9} ${gw * .9} ${-xh * .9} ${gw * .5} 0 a${xh * .35} ${xh * .35} 0 1 0 ${gw * .5} 0`;
        cx += gw;
      }
      if (r() < .3) d += ` M${(cx - 3 * s).toFixed(1)} ${y - xh * 1.6} h.4`;
      cx += (5 + r() * 5) * s;
    }
    return `<path d="${d}" class="scr" fill="none" stroke="${INK}" stroke-width="${0.8 * Math.max(1, s * .9)}" stroke-linecap="round"/>`;
  }
  /* Legenda com linha de chamada */
  function lab(x, y, tx, ty, text, anchor = 'start') {
    return `<path d="M${x} ${y} L${tx} ${ty}" class="lead"/><circle cx="${x}" cy="${y}" r="1.6" fill="${INK}"/>
      <text x="${tx + (anchor === 'end' ? -3 : anchor === 'middle' ? 0 : 3)}" y="${ty + 3}" text-anchor="${anchor}" class="lbl">${text}</text>`;
  }
  /* Cota técnica (estilo prancha) */
  function dim(x1, y1, x2, y2, text, off = 0) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, vert = Math.abs(x1 - x2) < Math.abs(y1 - y2);
    if (vert && off === 'l') return `<path d="M${x1} ${y1} L${x2} ${y2}" class="dim" marker-start="url(#tick)" marker-end="url(#tick)"/><text x="${mx - 5}" y="${my + 3}" text-anchor="end" class="dimt">${text}</text>`;
    return `<path d="M${x1} ${y1} L${x2} ${y2}" class="dim" marker-start="url(#tick)" marker-end="url(#tick)"/>
      <text x="${vert ? mx + 5 + off : mx}" y="${vert ? my + 3 : my - 4 + off}" text-anchor="${vert ? 'start' : 'middle'}" class="dimt">${text}</text>`;
  }
  /* Moldura de prancha com título em escrita inventada */
  let plateN = 0;
  const corner = (x, y, sx, sy) => `<path transform="translate(${x} ${y}) scale(${sx} ${sy})" d="M0 22 C0 8 8 0 22 0 M4 26 C4 12 12 4 26 4 M10 10 c6 -4 10 2 6 6 c-3 3 -7 0 -5 -3" fill="none" stroke="${INK}" stroke-width=".8" opacity=".7"/>`;
  function plate(w, h, body, seed = 7, caption = '') {
    const id = 'clip' + (++plateN);
    return `<svg viewBox="0 0 ${w} ${h}" class="art" role="img" aria-label="${caption}">
      <defs><clipPath id="${id}"><rect x="10" y="10" width="${w - 20}" height="${h - 20}"/></clipPath></defs>
      ${corner(14, 14, 1, 1)}${corner(w - 14, 14, -1, 1)}${corner(14, h - 14, 1, -1)}${corner(w - 14, h - 14, -1, -1)}
      <rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="none" stroke="${INK}" stroke-width="1.1" opacity=".75"/>
      <rect x="10" y="10" width="${w - 20}" height="${h - 20}" fill="none" stroke="${INK}" stroke-width=".5" opacity=".5"/>
      <g opacity=".85">${script(w / 2 - 55, 30, 110, seed, 1.15)}</g>
      <g clip-path="url(#${id})">${body}</g>
    </svg>`;
  }
  const flower = (cx, cy, r, n, col, center, rot = 0) => {
    let s = `<g transform="translate(${cx} ${cy}) rotate(${rot})">`;
    for (let i = 0; i < n; i++) s += `<path d="M0 0 C${r * .25} ${-r * .3} ${r * .2} ${-r} 0 ${-r} C${-r * .2} ${-r} ${-r * .25} ${-r * .3} 0 0Z" transform="rotate(${i * 360 / n})" fill="${P(col)}" class="ink"/>`;
    return s + `<circle r="${r * .28}" fill="${P(center)}" class="ink"/></g>`;
  };
  const leaf = (x, y, l, rot, col = 'leaf') => `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0 C${l * .3} ${-l * .28} ${l * .75} ${-l * .25} ${l} 0 C${l * .75} ${l * .25} ${l * .3} ${l * .28} 0 0Z M2 0 H${l * .9}" fill="${P(col)}" class="ink"/>`;

  /* ═══════════════ QUEIXAS — pranchas em estilo gravura ═══════════════
     Traço nítido (sem o filtro de lápis), hachuras para sombra e
     detalhe anatômico. As animações (classe .anim) foram mantidas. */
  const complaint = {};
  const CW = 560, CH = 380;
  const cp = (b, seed, lbl) => plate(CW, CH, b, seed, lbl);
  const uid = () => 'cq' + (++gid);
  const labc = (px, py, tx, ty, text, cls = 'lbl') => {
    const lines = Array.isArray(text) ? text : [text], an = px > tx ? 'end' : 'start', dx = an === 'end' ? -3 : 3;
    return `<path d="M${px} ${py} L${tx} ${ty}" class="lead"/><circle cx="${px}" cy="${py}" r="1.6" fill="${INK}"/>` +
      lines.map((t, i) => `<text x="${tx + dx}" y="${ty + 3 + i * 11}" text-anchor="${an}" class="${cls}">${t}</text>`).join('');
  };
  /* hemácia: disco bicôncavo */
  const rbc = (x, y, r = 4, rot = 0, cls = '', st = '') => `<g class="${cls}" style="${st}"><g transform="translate(${x} ${y}) rotate(${rot})"><ellipse rx="${r}" ry="${r * .78}" fill="${PAL.red}" stroke="${INK}" stroke-width=".45"/><ellipse rx="${r * .45}" ry="${r * .32}" fill="#e0837a"/></g></g>`;
  /* pelos curtos em volta de uma elipse (abelha, etc.) */
  const fuzz = (cx, cy, rx, ry, n, seed, len = 4, col = INK, w = .5) => {
    const r = rng(seed); let d = '';
    for (let i = 0; i < n; i++) { const a = r() * 6.283, k = .75 + r() * .3, x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k, l = len * (.6 + r() * .8), b = a + (r() - .5) * .9; d += `M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(b) * l).toFixed(1)} ${(Math.sin(b) * l).toFixed(1)} `; }
    return `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  /* linhas paralelas recortadas numa forma (hachura de gravura direcional) */
  const hatchIn = (clip, x0, y0, x1, y1, gap, ang, op = .35, w = .6) => {
    let d = ''; const L = Math.hypot(x1 - x0, y1 - y0) * 1.5, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    for (let t = -L / 2; t < L / 2; t += gap) d += `M${-L / 2} ${t} H${L / 2} `;
    return `<g clip-path="url(#${clip})"><path d="${d}" transform="translate(${cx} ${cy}) rotate(${ang})" stroke="${INK}" stroke-width="${w}" opacity="${op}" fill="none"/></g>`;
  };
  const grad = (id, stops, r = false) => r
    ? `<radialGradient id="${id}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`
    : `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;

  /* ─────────── 1. PANCADA / HEMATOMA ─────────── */
  complaint.hematoma = () => {
    const g1 = uid(), g2 = uid(), cl = uid(), clF = uid(), clL = uid();
    const L = 238, R = 438, T = 112, B = 322, DX = 30, DY = -24;
    const yE = 126, yD = 206, yH = 280;
    // epiderme: camadas de células
    let epi = '';
    for (let row = 0; row < 3; row++) for (let x = L + (row % 2) * 4; x < R - 2; x += 8) epi += `<rect x="${x + .6}" y="${T + 1 + row * 4.4}" width="7" height="3.8" rx="1.6" fill="${row ? PAL.skin : '#e7b48c'}" stroke="${INK}" stroke-width=".3"/>`;
    // colágeno
    const rc = rng(5); let col = '';
    for (let i = 0; i < 26; i++) { const x = L + 6 + rc() * 190, y = yE + 18 + rc() * 70; col += `M${x.toFixed(1)} ${y.toFixed(1)} c4 -3 8 3 12 0 s8 3 12 0 `; }
    // alças capilares das papilas
    let pap = '';
    for (let x = L + 12; x < R - 10; x += 22) pap += `<path d="M${x} ${yE + 16} V${yE + 6} a4 4 0 0 1 8 0 V${yE + 16}" fill="none" stroke="${PAL.red}" stroke-width="1.6"/><path d="M${x + 8} ${yE + 16} V${yE + 6}" stroke="${PAL.blue}" stroke-width="1.6" opacity=".7"/>`;
    // gordura: lóbulos
    const rf = rng(11); let fat = '';
    for (let row = 0; row < 4; row++) for (let x = L + 10 + (row % 2) * 10; x < R - 6; x += 20) { const y = yD + 10 + row * 18, rr = 8.5 + rf() * 1.5; fat += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${P('yellow')}" stroke="${INK}" stroke-width=".55"/><path d="M${x - rr * .5} ${y - rr * .45} a${rr * .6} ${rr * .6} 0 0 1 ${rr * .7} -${rr * .25}" stroke="#fff" stroke-width="1.2" opacity=".7" fill="none"/>`; }
    // músculo: fibras com estrias
    let mus = '', str = '';
    for (let y = yH + 4; y < B; y += 6) mus += `M${L} ${y} H${R} `;
    for (let x = L + 3; x < R; x += 3.2) str += `M${x} ${yH} V${B} `;
    // vaso principal com hemácias
    let inside = '';
    for (let x = L + 8; x < R - 4; x += 13) if (x < 338 || x > 362) inside += rbc(x, 166 + Math.sin(x / 9) * 1.2, 3.6, (x * 7) % 40 - 20);
    // hemácias vazando
    let leak = '';
    for (let i = 0; i < 12; i++) { const a = -2.6 + i * .45; leak += rbc(350, 168, 3.4, i * 30, 'cell', `--dx:${(Math.cos(a) * (22 + i * 2.4)).toFixed(1)}px;--dy:${(Math.sin(a) * 16 + 14).toFixed(1)}px;animation-delay:${(i * .29).toFixed(2)}s`); }
    // arnica
    const ray = (a) => `<path transform="rotate(${a})" d="M0 -6 C3 -10 3.4 -22 1.8 -27 L.9 -25.4 L0 -27.6 L-.9 -25.4 L-1.8 -27 C-3.4 -22 -3 -10 0 -6Z" fill="${P('yellow')}" stroke="${INK}" stroke-width=".55"/><path transform="rotate(${a})" d="M0 -8 V-24" stroke="${PAL.ochre}" stroke-width=".4"/>`;
    const rd = rng(3); let disc = '';
    for (let i = 0; i < 40; i++) { const a = i * 2.4, d = Math.sqrt(i / 40) * 8.5; disc += `<circle cx="${(Math.cos(a) * d).toFixed(1)}" cy="${(Math.sin(a) * d).toFixed(1)}" r=".9" fill="${PAL.brown}"/>`; }
    // perna (deslocada)
    const leg = 'M128 148 C140 178 160 205 176 226 C183 236 184 249 177 262 C170 286 168 310 168 330 C170 338 186 342 204 346 C214 349 218 356 212 360 L150 360 C146 352 148 342 148 334 C146 312 142 290 140 270 C136 254 130 244 120 236 C104 218 88 196 72 160 Z';
    return cp(`<defs>
      ${grad(g1, [[0, '#5a2f6e', .95], [.55, '#7d55a3', .7], [1, '#7d55a3', 0]], true)}
      ${grad(g2, [[0, '#7d3f8f', .55], [1, '#7d3f8f', 0]], true)}
      <clipPath id="${cl}"><path d="${leg}" transform="translate(30 8)"/></clipPath>
      <clipPath id="${clF}"><rect x="${L}" y="${T}" width="${R - L}" height="${B - T}"/></clipPath>
      <clipPath id="${clL}"><path d="M${R} ${T} L${R + DX} ${T + DY} L${R + DX} ${B + DY} L${R} ${B}Z"/></clipPath></defs>

    <!-- ARNICA (gravura botânica) -->
    <path d="M70 176 C72 140 76 110 80 76" class="ink" stroke-width="1.3"/>
    ${leafV(74, 150, 30, -158, 'green')}${leafV(75, 148, 28, -24, 'leaf')}${leafV(78, 116, 22, -166, 'leaf')}${leafV(78, 114, 20, -14, 'green')}
    <g transform="translate(81 70)">${[...Array(13)].map((_, i) => ray(i * 27.7 + 6)).join('')}
      <circle r="9.5" fill="${P('orange')}" class="ink thin"/>${disc}<path d="M-9 4 A9.5 9.5 0 0 0 7 7" fill="url(#p-shade)"/></g>
    <path d="M78 96 C88 96 96 90 100 82" class="ink thin"/><ellipse cx="102" cy="78" rx="4" ry="6" transform="rotate(30 102 78)" fill="${P('green')}" class="ink thin"/>
    <text x="72" y="194" text-anchor="middle" class="lbl s">Arnica montana</text>

    <!-- PERNA -->
    <g transform="translate(30 8)">
      <path d="${leg}" fill="${P('skin')}" class="ink"/>
    </g>
    ${hatchIn(cl, 150, 150, 230, 370, 3.4, -50, .16)}
    <g transform="translate(30 8)">
      <path d="M118 234 C126 250 132 262 136 280 M150 300 C152 320 152 330 150 338 M74 164 C90 194 104 214 120 232" class="ink thin" opacity=".5"/>
      <path d="M170 236 C176 240 178 250 174 258" class="ink thin"/><path d="M160 344 C172 350 196 352 212 358" class="ink thin" opacity=".6"/>
      <path d="M190 352 c2 -3 6 -3 8 0 M199 354 c2 -3 5 -3 7 0" class="ink thin"/>
      <ellipse cx="169" cy="240" rx="16" ry="13" fill="url(#${g1})" class="bz bz1"/>
      <ellipse cx="169" cy="240" rx="16" ry="13" fill="${PAL.green}" opacity="0" class="bz bz2" style="filter:blur(2px)"/>
      <ellipse cx="169" cy="240" rx="16" ry="13" fill="${PAL.yellow}" opacity="0" class="bz bz3" style="filter:blur(2.5px)"/>
    </g>
    <!-- LUPA -->
    <path d="M214 268 L236 300" stroke="${PAL.brown}" stroke-width="7" stroke-linecap="round"/><path d="M214 268 L236 300" stroke="${INK}" stroke-width="7.8" stroke-linecap="round" opacity=".25"/>
    <circle cx="199" cy="248" r="24" fill="${PAL.white}" fill-opacity=".18" stroke="${PAL.gold}" stroke-width="4"/>
    <circle cx="199" cy="248" r="24" fill="none" class="ink thin"/><circle cx="199" cy="248" r="26.4" fill="none" class="ink thin"/>
    <path d="M184 236 a18 18 0 0 1 14 -8" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
    <path d="M216 230 L${L} ${T}" class="lead" stroke-dasharray="3 3"/><path d="M220 262 L${L} ${B}" class="lead" stroke-dasharray="3 3"/>

    <!-- BLOCO DE PELE: face superior -->
    <path d="M${L} ${T} L${L + DX} ${T + DY} L${R + DX} ${T + DY} L${R} ${T}Z" fill="${P('skin')}" class="ink"/>
    ${[...Array(9)].map((_, i) => `<path d="M${L + 14 + i * 22} ${T - 2} q${DX * .5} ${DY * .5 - 3} ${DX - 4} ${DY + 4}" class="ink thin" opacity=".35"/>`).join('')}
    <!-- face lateral -->
    <path d="M${R} ${T} L${R + DX} ${T + DY} L${R + DX} ${B + DY} L${R} ${B}Z" fill="${PAL.cream}" class="ink"/>
    ${[[yE, '#e7b48c'], [yD, PAL.pink], [yH, PAL.yellow], [B, PAL.red]].map(([y], i, a) => `<path d="M${R} ${y} L${R + DX} ${y + DY}" class="ink thin"/>`).join('')}
    <path d="M${R} ${T} L${R + DX} ${T + DY} L${R + DX} ${yE + DY} L${R} ${yE}Z" fill="${P('ochre')}" opacity=".7"/>
    <path d="M${R} ${yE} L${R + DX} ${yE + DY} L${R + DX} ${yD + DY} L${R} ${yD}Z" fill="${P('pink')}" opacity=".8"/>
    <path d="M${R} ${yD} L${R + DX} ${yD + DY} L${R + DX} ${yH + DY} L${R} ${yH}Z" fill="${P('yellow')}" opacity=".7"/>
    <path d="M${R} ${yH} L${R + DX} ${yH + DY} L${R + DX} ${B + DY} L${R} ${B}Z" fill="${P('red')}" opacity=".7"/>
    ${XH(`M${R} ${T} L${R + DX} ${T + DY} L${R + DX} ${B + DY} L${R} ${B}Z`)}
    <!-- face frontal: camadas -->
    <g clip-path="url(#${clF})">
      <rect x="${L}" y="${T}" width="${R - L}" height="${yE - T}" fill="#f1d3b4"/>${epi}
      <rect x="${L}" y="${yE}" width="${R - L}" height="${yD - yE}" fill="#f6d6db"/>
      <path d="${col}" stroke="#c98b96" stroke-width=".7" fill="none"/>
      ${pap}
      <rect x="${L}" y="${yD}" width="${R - L}" height="${yH - yD}" fill="#f7ecc8"/>${fat}
      <rect x="${L}" y="${yH}" width="${R - L}" height="${B - yH}" fill="#d9776b"/>
      <path d="${mus}" stroke="#8e2f27" stroke-width=".7" fill="none"/><path d="${str}" stroke="#8e2f27" stroke-width=".35" opacity=".5" fill="none"/>
      <!-- folículo, pelo e glândula sebácea -->
      <path d="M266 ${yE} C264 150 264 180 268 196 M276 ${yE} C278 150 278 180 274 196" class="ink thin" fill="#f3c9a8"/>
      <ellipse cx="271" cy="198" rx="8" ry="7" fill="${P('brown')}" class="ink thin"/>
      <path d="M271 196 C271 170 271 140 271 ${T}" stroke="${PAL.brown}" stroke-width="2.2" fill="none"/>
      <path d="M278 146 c8 -6 16 0 12 8 c6 4 2 12 -6 10 c-2 4 -6 4 -6 0" fill="${P('yellow')}" class="ink thin"/>
      <path d="M266 176 L300 132" stroke="#b05a50" stroke-width="2" opacity=".7"/>
      <!-- glândula sudorípara -->
      <path d="M404 ${T} c-4 10 4 18 -2 28 s4 18 -2 28 s4 14 0 22" stroke="${PAL.teal}" stroke-width="1.6" fill="none"/>
      <path d="M392 196 m0 0 a9 6 0 1 1 18 0 a8 5 0 1 1 -16 1 a6 4 0 1 1 13 -1 a4 3 0 1 1 -9 1" stroke="${PAL.teal}" stroke-width="1.8" fill="none"/>
      <!-- nervo -->
      <path d="M${L} 190 C300 186 330 196 380 186 C392 184 400 176 404 168 M380 186 l8 6 M380 186 l6 -8" stroke="${PAL.gold}" stroke-width="1.5" fill="none"/>
      <!-- vaso principal rompido -->
      <path d="M${L} 160 C280 156 310 162 340 159 L343 155 L346 161 L341 166 L344 172 C310 175 280 168 ${L} 172Z" fill="#f2c4c0" stroke="${INK}" stroke-width=".7"/>
      <path d="M${R} 158 C400 156 380 162 362 159 L359 155 L356 162 L361 166 L357 172 C380 175 400 170 ${R} 172Z" fill="#f2c4c0" stroke="${INK}" stroke-width=".7"/>
      ${inside}
      <g class="anim"><ellipse cx="352" cy="176" rx="44" ry="22" fill="url(#${g2})" class="stain"/>${leak}
        <g class="macro" style="transform-origin:384px 194px;transform-box:view-box"><path d="M374 190 c4 -8 14 -8 18 -2 c6 -2 10 4 6 8 c4 6 -2 12 -8 9 c-4 6 -14 4 -14 -2 c-6 -2 -6 -10 -2 -13z" fill="${P('violet')}" stroke="${INK}" stroke-width=".6"/><circle cx="385" cy="195" r="3.6" fill="${PAL.purple}"/>${rbc(377, 199, 2.4, 20)}</g></g>
    </g>
    <rect x="${L}" y="${T}" width="${R - L}" height="${B - T}" fill="none" class="ink"/>
    ${[yE, yD, yH].map(y => `<path d="M${L} ${y} H${R}" class="ink thin"/>`).join('')}
    <path d="M271 ${T} C274 98 282 86 296 74" stroke="${PAL.brown}" stroke-width="2.2" fill="none"/>
    <!-- legendas à direita -->
    ${labc(R + DX - 2, T + DY + 8, 480, 98, 'epiderme')}
    ${labc(R + DX - 2, (yE + yD) / 2 + DY, 480, 150, 'derme')}
    ${labc(R + DX - 2, (yD + yH) / 2 + DY, 480, 222, 'gordura')}
    ${labc(R + DX - 2, (yH + B) / 2 + DY, 480, 282, 'músculo')}
    ${labc(352, 166, 362, 58, 'capilar rompido')}
    ${labc(392, 194, 480, 318, ['macrófago', '“come” o', 'sangue'], 'lbl s')}
    ${labc(285, 150, 228, 82, 'gl. sebácea')}
    <!-- evolução das cores -->
    ${[['#6b3a7d', 'dia 1', 'hemoglobina'], ['#6f8f3a', 'dia 5', 'biliverdina'], ['#d6aa2c', 'dia 8', 'bilirrubina'], ['#eec19d', 'dia 14', 'some']].map(([c, d, m], i) => {
      const x = 268 + i * 52; return `<g transform="translate(${x} 334)"><rect x="-15" y="-9" width="30" height="18" rx="5" fill="${P('skin')}" stroke="${INK}" stroke-width=".6"/><ellipse rx="9" ry="5.5" fill="${c}" opacity=".8" style="filter:blur(1.2px)"/><rect x="-18" y="-12" width="36" height="24" rx="7" class="ring" style="animation-delay:${i * 1.2}s"/>
      <text y="20" text-anchor="middle" class="lbl s" style="font-size:8.5px">${d}</text><text y="29" text-anchor="middle" class="lbl s" style="font-size:8px">${m}</text></g>`; }).join('')}
    <path d="M285 334 h6 M337 334 h6 M389 334 h6" class="ink thin" marker-end="url(#arr)"/>
    ${dim(R + DX + 10, T + DY, R + DX + 10, yD + DY, '≈ 2 mm')}`, 11, 'Gravura: perna com hematoma no joelho, lupa e bloco de pele em corte mostrando capilar rompido, hemácias vazando e macrófago; cores do hematoma ao longo dos dias');
  };

  /* ─────────── 2. CORIZA / CEBOLA ─────────── */
  complaint.coriza = () => {
    const ce = uid(), cb = uid(), ir = uid(), gt = uid();
    const ox = 140, oy = 248, ORX = 96, ORY = 30;
    // anéis excêntricos da cebola
    let rings = '';
    const N = 10;
    for (let i = 0; i < N; i++) {
      const k = 1 - i / N, rx = ORX * k, ry = ORY * k, cx = ox - (1 - k) * 10, cy = oy - (1 - k) * 2;
      rings += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${i % 2 ? '#f7f1f6' : '#c9a8d6'}" stroke="${INK}" stroke-width="${i ? .55 : 1.2}"/>`;
      if (i % 2 === 0 && i) rings += `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 1.6}" ry="${ry - .8}" fill="none" stroke="#fff" stroke-width=".7" opacity=".7"/>`;
    }
    // raízes
    const rr = rng(8); let roots = '';
    for (let i = 0; i < 22; i++) { const x = ox - 14 + rr() * 28, l = 16 + rr() * 22; roots += `M${x.toFixed(1)} 342 q${((rr() - .5) * 20).toFixed(1)} ${(l * .6).toFixed(1)} ${((rr() - .5) * 26).toFixed(1)} ${l.toFixed(1)} `; }
    // estrias do bulbo
    let ve = '';
    for (let i = -4; i <= 4; i++) ve += `M${ox + i * 20} ${oy + 6} Q${ox + i * 17} ${oy + 70} ${ox + i * 2} 340 `;
    // íris radial
    let irl = ''; for (let a = 0; a < 360; a += 9) { const t = a * Math.PI / 180; irl += `M${(Math.cos(t) * 8).toFixed(1)} ${(Math.sin(t) * 8).toFixed(1)} L${(Math.cos(t) * 21).toFixed(1)} ${(Math.sin(t) * 21).toFixed(1)} `; }
    // molécula sin-propanotial-S-óxido
    const mol = (x, y, d) => `<g class="vapor" style="animation-delay:${d}s"><g transform="translate(${x} ${y}) scale(.9)">
      <path d="M0 0 L9 -5 L18 0 L27 -5 L34 -12" stroke="${INK}" stroke-width="1.6"/>
      <circle cx="0" cy="0" r="3.6" fill="#4a4a4a" stroke="${INK}" stroke-width=".5"/><circle cx="9" cy="-5" r="3.6" fill="#4a4a4a" stroke="${INK}" stroke-width=".5"/><circle cx="18" cy="0" r="3.6" fill="#4a4a4a" stroke="${INK}" stroke-width=".5"/>
      <circle cx="27" cy="-5" r="4.4" fill="${PAL.yellow}" stroke="${INK}" stroke-width=".5"/><circle cx="34" cy="-12" r="3.8" fill="${PAL.red}" stroke="${INK}" stroke-width=".5"/>
      <circle cx="-4" cy="4" r="1.8" fill="#fff" stroke="${INK}" stroke-width=".4"/><circle cx="-4" cy="-4" r="1.8" fill="#fff" stroke="${INK}" stroke-width=".4"/><circle cx="9" cy="-11" r="1.8" fill="#fff" stroke="${INK}" stroke-width=".4"/><circle cx="18" cy="6" r="1.8" fill="#fff" stroke="${INK}" stroke-width=".4"/></g></g>`;
    return cp(`<defs>
      <clipPath id="${cb}"><path d="M${ox - ORX} ${oy} C${ox - ORX - 4} ${oy + 64} ${ox - 40} 340 ${ox} 342 C${ox + 40} 340 ${ox + ORX + 4} ${oy + 64} ${ox + ORX} ${oy}Z"/></clipPath>
      <clipPath id="${ir}"><circle cx="0" cy="0" r="21"/></clipPath>
      ${grad(gt, [[0, '#d7ecf8', .95], [1, '#93bfe0', .9]])}</defs>

    <!-- metade inferior da cebola, face do corte para cima -->
    <path d="M${ox - ORX} ${oy} C${ox - ORX - 4} ${oy + 64} ${ox - 40} 340 ${ox} 342 C${ox + 40} 340 ${ox + ORX + 4} ${oy + 64} ${ox + ORX} ${oy}Z" fill="${P('purple')}" class="ink"/>
    <g clip-path="url(#${cb})"><path d="${ve}" stroke="${INK}" stroke-width=".5" opacity=".45" fill="none"/></g>
    ${hatchIn(cb, ox, oy, ox + ORX, 340, 2.6, -35, .35)}
    <path d="M${ox - 18} 342 h36" stroke="${PAL.brown}" stroke-width="4"/><path d="${roots}" stroke="${PAL.ochre}" stroke-width=".7" fill="none"/>
    <ellipse cx="${ox}" cy="${oy}" rx="${ORX + 2}" ry="${ORY + 1.4}" fill="${P('ochre')}" stroke="${INK}" stroke-width="1"/>
    ${rings}
    <path d="M${ox - 6} ${oy - 2} q3 -2 6 0" class="ink thin"/>
    <!-- metade superior, tombada -->
    <g transform="translate(476 300) rotate(-14) scale(.82)">
      <path d="M-62 0 C-64 -34 -34 -58 -4 -60 C10 -74 14 -84 22 -92 M-4 -60 C30 -60 62 -34 60 0Z" fill="${P('ochre')}" class="ink"/>
      ${[-40, -22, -4, 14, 32, 48].map(x => `<path d="M${x} -2 Q${x * .6} -40 -4 -58" class="ink thin" opacity=".5"/>`).join('')}
      <path d="M10 -54 L18 -46 M-30 -30 l6 -10 M30 -20 l-4 8" class="ink thin" opacity=".6"/>
      <path d="M-4 -60 C30 -60 62 -34 60 0 L36 0 C40 -30 20 -52 -4 -60Z" fill="url(#p-cross)"/>
      <ellipse cx="0" cy="0" rx="61" ry="18" fill="#c9a8d6" class="ink"/>${[48, 37, 26, 16, 7].map((r, i) => `<ellipse cx="${-(61 - r) * .12}" cy="0" rx="${r}" ry="${r * .29}" fill="${i % 2 ? '#c9a8d6' : '#f7f1f6'}" stroke="${INK}" stroke-width=".5"/>`).join('')}
    </g>
    <!-- faca -->
    <g transform="translate(256 370) rotate(-4)">
      <path d="M0 0 C40 -4 110 -14 150 -14 L150 -2 L0 2Z" fill="${P('gray')}" class="ink"/><path d="M8 -1 C50 -5 110 -10 148 -10" stroke="#fff" stroke-width=".9" opacity=".8"/>
      <rect x="150" y="-16" width="8" height="16" fill="${P('gray')}" class="ink thin"/>
      <path d="M158 -15 h62 c6 0 8 4 8 7 s-2 7 -8 7 h-62z" fill="${P('brown')}" class="ink"/>
      <path d="M162 -11 c18 -2 36 2 56 0 M162 -5 c22 2 40 -2 58 1" class="ink thin" opacity=".5"/>
      ${[172, 192, 212].map(x => `<circle cx="${x}" cy="-8" r="1.8" fill="${PAL.cream}" stroke="${INK}" stroke-width=".5"/>`).join('')}</g>

    <!-- olho em vista frontal -->
    <g transform="translate(420 118)">
      <path d="M-82 4 C-56 -40 46 -48 80 -6" fill="none" class="ink" stroke-width="1"/>
      <path d="M-76 6 C-40 -34 40 -36 76 0 C40 34 -40 34 -76 6Z" fill="${PAL.white}" class="ink" stroke-width="1.3"/>
      <path d="M-58 10 c8 -2 12 2 20 0 M40 14 c6 -4 12 -2 18 -6 M-50 -4 c6 2 10 -2 16 0" stroke="#d26a6a" stroke-width=".5" fill="none"/>
      <g><circle r="22" fill="#4f78b8" stroke="${INK}" stroke-width=".9"/><g clip-path="url(#${ir})"><path d="${irl}" stroke="#23406f" stroke-width=".7" opacity=".8"/></g>
        <circle r="22" fill="none" stroke="#1f3360" stroke-width="2.2" opacity=".7"/><circle r="8.5" fill="#15110d"/><ellipse cx="-6" cy="-7" rx="4" ry="2.6" fill="#fff" transform="rotate(-30 -6 -7)"/></g>
      <path d="M-76 6 C-40 -34 40 -36 76 0" fill="none" stroke="${INK}" stroke-width="2.2"/>
      ${[...Array(15)].map((_, i) => { const t = .08 + i * .06, x = -76 + 152 * t, y = -32 * Math.sin(Math.PI * t) + 4; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q${(-4 + i * .5).toFixed(1)} -8 ${(-3 + i * .6).toFixed(1)} -13" class="ink thin" stroke-width=".8"/>`; }).join('')}
      <path d="M-76 6 C-40 34 40 34 76 0" fill="none" class="ink thin"/>
      <ellipse cx="-74" cy="6" rx="4" ry="5" fill="#e79aa3" stroke="${INK}" stroke-width=".5"/>
      <!-- glândula lacrimal -->
      <path d="M44 -44 c10 -12 30 -8 34 2 c8 2 8 14 0 16 c-2 8 -16 10 -24 4 c-12 2 -18 -14 -10 -22z" fill="${P('pink')}" class="ink thin"/>
      <path d="M50 -22 L46 -14 M58 -20 L56 -10 M66 -22 L66 -10" stroke="${PAL.sky}" stroke-width="1.2"/>
      <!-- canalículos e ducto lacrimonasal -->
      <path d="M-74 2 C-84 0 -90 -4 -92 -10 M-74 10 C-84 12 -90 10 -92 6" stroke="${PAL.blue}" stroke-width="1.2" fill="none"/>
      <path d="M-98 -16 C-100 -4 -96 30 -94 60 C-93 80 -98 104 -96 122" stroke="${PAL.blue}" stroke-width="5" fill="none" opacity=".35"/>
      <path d="M-98 -16 C-100 -4 -96 30 -94 60 C-93 80 -98 104 -96 122" stroke="${PAL.blue}" stroke-width="1" fill="none" stroke-dasharray="3 2"/>
      <ellipse cx="-96" cy="-14" rx="6" ry="9" fill="${PAL.sky}" stroke="${INK}" stroke-width=".6"/>
      <!-- nariz -->
      <path d="M-104 -6 C-110 40 -120 96 -128 118 C-132 130 -124 138 -112 136 C-106 142 -96 144 -90 138 M-62 136 C-56 142 -46 142 -42 136 C-30 138 -24 130 -28 120" class="ink" fill="none" stroke-width="1.1"/>
      <path d="M-104 128 c4 4 10 4 14 0 M-56 128 c4 4 10 4 14 0" class="ink thin"/>
    </g>
    <g class="anim">
      ${[0, 1, 2].map(i => `<path class="tear" style="animation-delay:${i * .9}s" d="M${352 + i * 18} 132 c-3 6 -5 9 -5 12 a5 5 0 0 0 10 0 c0 -3 -2 -6 -5 -12z" fill="url(#${gt})" stroke="${INK}" stroke-width=".6"/>`).join('')}
      ${[0, 1, 2, 3].map(i => `<circle class="duct" style="animation-delay:${i * .6}s" cx="323" cy="106" r="2" fill="${PAL.blue}"/>`).join('')}
      <path class="drip" d="M313 260 c-2.4 5 -4.4 8 -4.4 10.4 a4.4 4.4 0 0 0 8.8 0 c0 -2.4 -2 -5.4 -4.4 -10.4z" fill="url(#${gt})" stroke="${INK}" stroke-width=".6"/>
      ${[0, 1, 2, 3, 4].map(i => `<path class="vapor" style="animation-delay:${(i * .7).toFixed(1)}s" d="M${ox - 20 + i * 12} ${oy - 10} c-6 -8 6 -14 0 -22 s6 -14 0 -22" fill="none" stroke="${PAL.violet}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`).join('')}
      ${mol(ox - 30, oy - 30, 0)}${mol(ox + 10, oy - 24, 1.4)}${mol(ox - 4, oy - 40, 2.8)}
    </g>
    ${labc(486, 84, 470, 54, 'glândula lacrimal')}
    ${labc(325, 186, 362, 196, ['ducto lacrimonasal:', 'a lágrima desce', 'para o nariz'])}
    <path d="M${ox + 4} ${oy - 52} L${ox + 40} 120" class="lead"/><circle cx="${ox + 4}" cy="${oy - 52}" r="1.6" fill="${INK}"/>
    <text x="${ox + 40}" y="104" text-anchor="middle" class="lbl">gás irritante com enxofre</text><text x="${ox + 40}" y="116" text-anchor="middle" class="lbl s">(sin-propanotial-S-óxido)</text>
    <path d="M${ox - 70} ${oy - 2} L40 206" class="lead"/><circle cx="${ox - 70}" cy="${oy - 2}" r="1.6" fill="${INK}"/>
    <text x="30" y="188" class="lbl">cada anel</text><text x="30" y="200" class="lbl">é uma folha</text>
    ${dim(ox - ORX, 356, ox + ORX, 356, '')}<text x="${ox + ORX + 6}" y="359" class="dimt">≈ 8 cm</text>`, 23, 'Gravura: cebola cortada liberando molécula irritante que faz o olho lacrimejar; a lágrima desce pelo ducto lacrimonasal e o nariz escorre');
  };

  /* ─────────── 3. INSÔNIA ─────────── */
  complaint.insonia = () => {
    const cbr = uid(), csk = uid(), cin = uid(), cmn = uid();
    const head = 'M150 368 C150 340 132 330 120 314 C104 312 92 306 94 290 C90 284 86 278 92 272 C84 268 82 260 88 254 C78 246 70 236 78 226 C88 214 92 206 90 192 C84 146 110 92 176 80 C246 68 302 116 302 184 C302 236 276 262 270 300 C266 330 270 352 272 368';
    const brain = 'M114 196 C110 146 144 108 190 104 C244 100 284 140 280 190 C278 214 262 226 240 228 C222 238 196 240 172 234 C146 236 122 224 114 196Z';
    let star = '';
    const sp = [[40, 70, 6], [92, 50, 4], [250, 46, 5], [312, 66, 7], [356, 40, 4], [530, 60, 5], [500, 96, 3.5]];
    sp.forEach(([x, y, s], i) => { star += `<path class="twinkle" style="animation-delay:${i * .37}s;transform-origin:${x}px ${y}px" d="M${x} ${y - s} L${x + s * .25} ${y - s * .25} L${x + s} ${y} L${x + s * .25} ${y + s * .25} L${x} ${y + s} L${x - s * .25} ${y + s * .25} L${x - s} ${y} L${x - s * .25} ${y - s * .25}Z" fill="${PAL.yellow}" stroke="${INK}" stroke-width=".5"/>`; });
    const gear = (x, y, r, n, col, cls, dur) => {
      let d = ''; for (let i = 0; i < n; i++) { const a0 = i / n * 6.283, a1 = (i + .25) / n * 6.283, a2 = (i + .5) / n * 6.283, a3 = (i + .75) / n * 6.283, R2 = r + 4;
        d += `${i ? 'L' : 'M'}${(x + Math.cos(a0) * r).toFixed(1)} ${(y + Math.sin(a0) * r).toFixed(1)} L${(x + Math.cos(a1) * R2).toFixed(1)} ${(y + Math.sin(a1) * R2).toFixed(1)} L${(x + Math.cos(a2) * R2).toFixed(1)} ${(y + Math.sin(a2) * R2).toFixed(1)} L${(x + Math.cos(a3) * r).toFixed(1)} ${(y + Math.sin(a3) * r).toFixed(1)} `; }
      return `<g class="gear ${cls}" style="transform-origin:${x}px ${y}px;animation-duration:${dur}s"><path d="${d}Z" fill="${P(col)}" stroke="${INK}" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${r * .55}" fill="none" stroke="${INK}" stroke-width=".6"/>${[0, 1, 2, 3, 4, 5].map(k => `<path d="M${x} ${y} L${(x + Math.cos(k * 1.047) * r * .55).toFixed(1)} ${(y + Math.sin(k * 1.047) * r * .55).toFixed(1)}" stroke="${INK}" stroke-width="1.2"/>`).join('')}<circle cx="${x}" cy="${y}" r="2.4" fill="${INK}"/></g>`;
    };
    // molécula de purina (adenosina/cafeína) simplificada
    const purine = (x, y, s, col, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -8 L7 -4 L7 4 L0 8 L-7 4 L-7 -4Z M7 -4 L14 -7 L18 0 L14 7 L7 4" fill="${col}" stroke="${INK}" stroke-width=".9"/>${extra}</g>`;
    const ade = (x, y, cls = '', st = '') => `<g class="${cls}" style="${st}">${purine(x, y, .9, PAL.violet, `<path d="M-7 4 L-12 10" stroke="${INK}" stroke-width=".9"/><path d="M-12 10 l-6 2 l-2 7 l6 3 l5 -5z" fill="${PAL.rose}" stroke="${INK}" stroke-width=".8"/>`)}</g>`;
    const caf = (x, y) => purine(x, y, .9, PAL.ochre, `${[[0, -8, 0, -14], [-7, 4, -12, 8], [14, -7, 18, -11]].map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="${INK}" stroke-width=".9"/><circle cx="${c}" cy="${d}" r="2.6" fill="#6d6d6d" stroke="${INK}" stroke-width=".5"/>`).join('')}`);
    // receptor em forma de bolso
    const rec = (x, y) => `<path d="M${x - 16} ${y} V${y - 18} C${x - 16} ${y - 24} ${x - 10} ${y - 26} ${x - 8} ${y - 20} V${y - 10} H${x + 8} V${y - 20} C${x + 10} ${y - 26} ${x + 16} ${y - 24} ${x + 16} ${y - 18} V${y}Z" fill="${P('sky')}" stroke="${INK}" stroke-width=".8"/>`;
    const rv = rng(14); let ves = '';
    for (let i = 0; i < 9; i++) ves += `<circle cx="${(424 + rv() * 52).toFixed(1)}" cy="${(132 + rv() * 22).toFixed(1)}" r="${(4 + rv() * 2).toFixed(1)}" fill="#fff" stroke="${INK}" stroke-width=".6"/><circle cx="${(424 + rv() * 52).toFixed(1)}" cy="${(132 + rv() * 22).toFixed(1)}" r="1" fill="${PAL.purple}"/>`;
    return cp(`<defs>
      <clipPath id="${cbr}"><path d="${brain}"/></clipPath>
      <clipPath id="${csk}"><path d="${head}"/></clipPath>
      <clipPath id="${cin}"><circle cx="450" cy="178" r="66"/></clipPath>
      <clipPath id="${cmn}"><circle cx="58" cy="102" r="26"/></clipPath></defs>
    <!-- céu noturno -->
    ${[...Array(5)].map((_, i) => `<path d="M${18 + i * 6} ${46 + i * 6} h${120 - i * 22}" class="ink thin" opacity=".25"/>`).join('')}
    <circle cx="58" cy="102" r="26" fill="${P('yellow')}" class="ink"/>
    <g clip-path="url(#${cmn})"><circle cx="72" cy="94" r="24" fill="url(#p-cross)"/><circle cx="76" cy="90" r="22" fill="url(#p-shade)"/></g>
    ${[[50, 94, 4], [62, 112, 3], [44, 110, 2.2], [56, 82, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" class="ink thin" opacity=".6"/>`).join('')}
    <g class="anim">${star}</g>
    <!-- cabeça em corte sagital -->
    <path d="${head}" fill="${P('skin')}" class="ink"/>
    ${hatchIn(csk, 220, 120, 310, 370, 3, -60, .25)}
    <path d="M106 196 C100 140 140 98 190 94 C252 90 292 136 290 192 C288 222 270 236 246 240 C226 250 196 252 170 246 C140 248 110 232 106 196Z" fill="${P('cream')}" class="ink thin"/>
    ${[...Array(30)].map((_, i) => { const r = rng(i + 100); const a = r() * 3.14 + 3.14, d = .93; return `<circle cx="${(198 + Math.cos(a) * 92 * d).toFixed(1)}" cy="${(170 + Math.sin(a) * 74 * d).toFixed(1)}" r=".9" fill="${INK}" opacity=".5"/>`; }).join('')}
    <path d="${brain}" fill="#f2c6c9" class="ink"/>
    ${gyri(110, 284, 100, 240, 33, cbr, 8)}
    <path d="M150 196 C170 176 230 174 254 196 C236 186 172 186 150 196Z" fill="${P('cream')}" class="ink thin"/>
    <!-- cerebelo e tronco -->
    <path d="M232 230 C250 226 274 230 280 246 C282 262 262 270 240 266 C226 262 222 240 232 230Z" fill="#e9b3b7" class="ink thin"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${234 + i} ${236 + i * 6} C${248 + i} ${232 + i * 6} ${268 - i} ${236 + i * 6} ${278 - i * 2} ${244 + i * 5}" class="ink thin" opacity=".7"/>`).join('')}
    <path d="M206 232 C210 252 216 272 214 300 L228 300 C228 276 228 254 230 236Z" fill="#efc0b6" class="ink thin"/>
    <path d="M214 300 C214 330 216 350 218 368 M228 300 C228 330 230 350 232 368" class="ink thin"/>
    <path d="M200 186 c4 -6 10 -6 12 0 c-2 6 -10 6 -12 0z" fill="${P('green')}" class="ink thin"/>
    <circle cx="96" cy="196" r="4.4" fill="${INK}"/><path d="M86 188 q8 -6 18 -2" class="ink thin"/>
    <g class="anim">
      ${gear(150, 160, 16, 10, 'gold', 'g1', 4)}${gear(176, 140, 10, 7, 'orange', 'g2', 2.8)}${gear(180, 176, 9, 7, 'teal', 'g2', 3.2)}
      ${[[130, 128], [236, 132], [212, 150]].map(([x, y], i) => `<path class="spark" style="animation-delay:${i * .5}s" d="M${x} ${y} l5 -8 l-2 7 l7 -3 l-6 9" fill="none" stroke="${PAL.orange}" stroke-width="1.4"/>`).join('')}
    </g>
    <!-- relógio -->
    <g transform="translate(352 92)">
      <circle r="31" fill="${PAL.white}" stroke="${INK}" stroke-width="1.6"/><circle r="27" fill="none" class="ink thin"/>
      ${[...Array(12)].map((_, i) => { const a = i * .5236; return `<path d="M${(Math.sin(a) * 23).toFixed(1)} ${(-Math.cos(a) * 23).toFixed(1)} L${(Math.sin(a) * 27).toFixed(1)} ${(-Math.cos(a) * 27).toFixed(1)}" stroke="${INK}" stroke-width="${i % 3 ? .7 : 1.6}"/>`; }).join('')}
      <path d="M0 0 L${(Math.sin(3.2 * .5236) * 13).toFixed(1)} ${(-Math.cos(3.2 * .5236) * 13).toFixed(1)}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M0 0 L${(Math.sin(7 * .1047) * 20).toFixed(1)} ${(-Math.cos(7 * .1047) * 20).toFixed(1)}" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>
      <g class="anim"><path class="hand" d="M0 4 V-22" stroke="${PAL.red}" stroke-width=".9" style="transform-origin:0px 0px"/></g>
      <circle r="2" fill="${INK}"/><path d="M-22 -26 l-6 -6 M22 -26 l6 -6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <text x="40" y="4" class="lbl s">3h07 —</text><text x="40" y="15" class="lbl s">e nada de sono</text></g>
    <!-- sinapse ampliada -->
    <path d="M262 168 C300 168 350 176 384 178" class="lead" stroke-dasharray="3 3"/>
    <circle cx="450" cy="178" r="66" fill="${PAL.white}" stroke="${INK}" stroke-width="2"/>
    <g clip-path="url(#${cin})">
      <path d="M384 158 C404 120 420 112 450 112 C480 112 496 120 516 158Z" fill="#f4dfc8" stroke="${INK}" stroke-width=".9"/>${ves}
      <path d="M384 210 H520 V250 H384Z" fill="#eadff0"/><path d="M384 210 H520" stroke="${INK}" stroke-width=".9"/>
      ${rec(414, 212)}${rec(452, 212)}${rec(490, 212)}
      ${ade(414, 196)}${caf(452, 196)}${caf(490, 196)}
      <g class="anim">${ade(430, 178, 'bounce', 'animation-delay:.2s')}${ade(474, 172, 'bounce', 'animation-delay:1.1s')}</g>
    </g>
    <circle cx="450" cy="178" r="66" fill="none" stroke="${PAL.gold}" stroke-width="3" opacity=".6"/>
    <text x="450" y="126" text-anchor="middle" class="lbl s">neurônio</text>
    <text x="414" y="226" text-anchor="middle" class="lbl s" style="font-size:8.5px">adenosina</text><text x="471" y="226" text-anchor="middle" class="lbl s" style="font-size:8.5px">cafeína</text>
    <text x="450" y="238" text-anchor="middle" class="lbl s" style="font-size:8.5px">receptores</text>
    <text x="450" y="258" text-anchor="middle" class="lbl s">a cafeína ocupa a vaga da adenosina,</text><text x="450" y="269" text-anchor="middle" class="lbl s">a molécula que avisa “hora de dormir”</text>
    <!-- cereja de café em corte -->
    <g transform="translate(486 330) scale(.85)">
      <path d="M0 -38 C10 -48 24 -54 40 -50" class="ink"/>${leafV(40, -50, 34, -20, 'green')}
      <ellipse rx="46" ry="36" fill="${P('red')}" class="ink"/>${SH('M10 -34 A46 36 0 0 1 40 22 A40 30 0 0 0 10 -34Z')}
      <ellipse rx="40" ry="30" fill="#f4dc8a" stroke="${INK}" stroke-width=".7"/>
      <path d="M-2 -24 C-32 -24 -34 24 -2 24Z M2 -24 C32 -24 34 24 2 24Z" fill="#f7efd6" stroke="${INK}" stroke-width=".7"/>
      <path d="M-5 -21 C-29 -21 -30 21 -5 21Z M5 -21 C29 -21 30 21 5 21Z" fill="${P('leaf')}" stroke="${INK}" stroke-width=".9"/>
      <path d="M-14 -16 C-10 -6 -18 4 -12 16 M14 -16 C10 -6 18 4 12 16" class="ink thin"/>
      <ellipse cx="-14" cy="-20" rx="16" ry="4" fill="#fff" opacity=".35" transform="rotate(-10)"/></g>
    ${labc(470, 330, 428, 352, ['dois grãos', 'na cereja do café'])}
    ${labc(206, 186, 318, 312, ['glândula pineal:', 'faz melatonina', 'no escuro'])}
    ${labc(150, 156, 214, 66, 'córtex acelerado')}`, 31, 'Gravura: cabeça em corte sagital com cérebro, engrenagens girando e glândula pineal; relógio às 3h07; sinapse ampliada em que a cafeína ocupa o receptor da adenosina; cereja de café em corte');
  };

  /* ─────────── 4. DIGESTÃO ─────────── */
  complaint.digestao = () => {
    const cs = uid(), cm = uid(), cpit = uid();
    const outer = 'M168 46 L168 104 C166 112 160 116 156 122 C126 150 108 186 112 224 C116 262 132 286 162 300 C200 318 252 320 300 304 C342 290 366 254 370 210 C374 160 362 112 330 84 C306 64 266 60 236 74 C218 84 206 98 196 108 L196 46Z';
    const inner = 'M176 46 L176 108 C172 118 166 124 162 130 C136 156 120 190 124 224 C128 256 142 278 168 290 C204 306 252 308 296 294 C334 280 354 248 358 210 C362 164 350 120 322 94 C300 76 266 72 240 86 C222 96 210 106 202 116 L188 116 L188 46Z';
    const r = rng(23); let rug = '';
    for (let i = 0; i < 7; i++) { const y = 140 + i * 20; rug += `M${150 + r() * 10} ${y} C${200} ${y - 14 + r() * 8} ${260} ${y + 10 - r() * 8} ${330 + r() * 12} ${y - 6} `; }
    const lake = 'M126 236 C160 230 200 244 240 236 C280 228 320 242 356 230 C352 262 330 284 296 294 C252 308 204 306 168 290 C146 280 132 262 126 236Z';
    const chymeTop = 'M126 236 C160 230 200 244 240 236 C280 228 320 242 356 230';
    let bubs = '';
    for (let i = 0; i < 10; i++) bubs += `<circle class="bub" style="animation-delay:${(i * .37).toFixed(2)}s" cx="${150 + i * 20}" cy="${270 + (i % 3) * 8}" r="${2.4 + (i % 3) * 1.4}" fill="#fff" fill-opacity=".5" stroke="${PAL.green}" stroke-width="1"/>`;
    // fosseta gástrica
    let pit = '';
    pit += `<path d="M400 74 H540 V120 C520 120 512 128 508 150 L500 200 H440 L432 150 C428 128 420 120 400 120Z" fill="#f4c6cc" stroke="${INK}" stroke-width=".8"/>`;
    pit += `<path d="M400 74 H540 V92 H400Z" fill="#c7d6e0" opacity=".9"/><path d="M400 92 H540" stroke="${INK}" stroke-width=".6" stroke-dasharray="2 2"/>`;
    for (let i = 0; i < 6; i++) pit += `<path d="M${404 + i * 22} 94 h18 v24 h-18z" fill="#fbe7c9" stroke="${INK}" stroke-width=".5"/>`;
    [[446, 160], [494, 160], [452, 184], [488, 184]].forEach(([x, y]) => { pit += `<path d="M${x - 10} ${y} l10 -12 l10 12 l-10 10z" fill="${P('pink')}" stroke="${INK}" stroke-width=".6"/><circle cx="${x}" cy="${y}" r="2.6" fill="${PAL.purple}"/><path d="M${x - 4} ${y - 2} h8" stroke="${INK}" stroke-width=".4"/>`; });
    let hp_ = '';
    for (let i = 0; i < 7; i++) hp_ += `<text class="hplus" style="animation-delay:${(i * .45).toFixed(2)}s" x="${458 + (i % 4) * 9}" y="190" font-size="8" fill="${PAL.red}" font-family="serif">H⁺</text>`;
    return cp(`<defs><clipPath id="${cs}"><path d="${inner}"/></clipPath><clipPath id="${cm}"><path d="${outer}"/></clipPath><clipPath id="${cpit}"><circle cx="470" cy="136" r="62"/></clipPath></defs>
    <g class="anim"><g class="peri" style="transform-origin:240px 200px">
      <!-- parede: serosa/muscular -->
      <path d="${outer}" fill="#e4968c" class="ink" stroke-width="1.6"/>
      ${hatchIn(cm, 110, 46, 372, 322, 2.4, 70, .35, .55)}
      <path d="${outer}" fill="none" stroke="${INK}" stroke-width="1.6"/>
      <path d="M172 46 L172 106 C169 115 163 120 159 126 C131 153 114 188 118 224 C122 259 137 282 165 295 C202 312 252 314 298 299 C338 285 360 251 364 210 C368 162 356 116 326 89 C303 70 266 66 238 80 C220 90 208 102 199 112 L192 112 L192 46" fill="none" stroke="#f6dcc6" stroke-width="1.4"/>
      <!-- mucosa -->
      <path d="${inner}" fill="#f6c9cf" stroke="${INK}" stroke-width=".9"/>
      <g clip-path="url(#${cs})"><path d="${rug}" stroke="#c97d89" stroke-width="2.6" fill="none"/><path d="${rug}" stroke="#fff" stroke-width=".8" fill="none" opacity=".7" transform="translate(0 -2)"/>
        <path d="${lake}" fill="#c9cf7c" opacity=".85"/><path d="${chymeTop}" fill="none" stroke="#8a9a3a" stroke-width="1"/>
        <!-- comida -->
        <rect x="190" y="214" width="20" height="13" rx="3" fill="${P('ochre')}" stroke="${INK}" stroke-width=".6" transform="rotate(18 200 220)"/>
        <circle cx="242" cy="226" r="8" fill="${P('red')}" stroke="${INK}" stroke-width=".6"/><path d="M236 222 a6 6 0 0 1 8 -2" stroke="#fff" fill="none"/>
        <path d="M268 212 l18 4 l-4 13 l-16 -4z" fill="${P('yellow')}" stroke="${INK}" stroke-width=".6"/>
        <ellipse cx="166" cy="226" rx="11" ry="6" fill="${P('green')}" stroke="${INK}" stroke-width=".6"/>
        <path d="M300 230 c8 -10 20 -6 24 2" fill="${P('brown')}" stroke="${INK}" stroke-width=".6"/>
        ${bubs}
        <!-- bolha de gás no fundo -->
        <path d="M240 88 C262 76 300 80 320 96 C306 110 260 112 240 88Z" fill="#fff" fill-opacity=".85" stroke="${INK}" stroke-width=".7"/>
        <!-- onda peristáltica -->
        <g class="pwave" style="offset-path:path('M338 120 C320 190 260 240 150 240')"><ellipse rx="5" ry="34" fill="#b5574f" opacity=".3"/><path d="M-3 -34 Q2 0 -3 34 M3 -34 Q-2 0 3 34" stroke="#8e3a33" stroke-width=".8" fill="none" opacity=".6"/></g>
      </g>
      <!-- piloro e duodeno -->
      <path d="M118 224 C112 244 104 258 92 268 C80 278 64 282 46 296 L36 280 C54 266 70 260 82 252 C94 244 104 236 110 222Z" fill="#e4968c" class="ink"/>
      <ellipse cx="108" cy="246" rx="7" ry="13" transform="rotate(35 108 246)" fill="#b5574f" class="ink thin"/>
    </g>
    <circle class="belch" cx="182" cy="110" r="7" fill="#fff" fill-opacity=".9" stroke="${INK}" stroke-width=".7"/></g>
    <!-- fosseta gástrica ampliada -->
    <path d="M300 160 C340 150 380 140 410 136" class="lead" stroke-dasharray="3 3"/>
    <circle cx="470" cy="136" r="62" fill="${PAL.white}" stroke="${INK}" stroke-width="2"/>
    <g clip-path="url(#${cpit})">${pit}<g class="anim">${hp_}</g></g>
    <circle cx="470" cy="136" r="62" fill="none" stroke="${PAL.gold}" stroke-width="3" opacity=".6"/>
    <text x="470" y="214" text-anchor="middle" class="lbl s">fosseta gástrica: células que fazem ácido</text>
    <!-- semente de noz-vômica -->
    <g transform="translate(456 298)">
      <circle r="34" fill="${P('gray')}" class="ink"/><circle r="30" fill="#e7e0cf" stroke="${INK}" stroke-width=".6"/>
      ${[...Array(64)].map((_, i) => { const a = i * .0982; return `<path d="M${(Math.cos(a) * 4).toFixed(1)} ${(Math.sin(a) * 4).toFixed(1)} Q${(Math.cos(a + .2) * 18).toFixed(1)} ${(Math.sin(a + .2) * 18).toFixed(1)} ${(Math.cos(a + .1) * 29).toFixed(1)} ${(Math.sin(a + .1) * 29).toFixed(1)}" stroke="${INK}" stroke-width=".35" opacity=".55" fill="none"/>`; }).join('')}
      <circle r="3.4" fill="${PAL.brown}" stroke="${INK}" stroke-width=".5"/>${SH('M8 -29 A30 30 0 0 1 8 29 A34 34 0 0 0 8 -29Z')}
      <ellipse cx="62" cy="0" rx="7" ry="32" fill="${P('gray')}" class="ink thin"/></g>
    ${dim(422, 344, 490, 344, '')}<text x="456" y="358" text-anchor="middle" class="dimt">≈ 2,5 cm</text>
    <text x="456" y="258" text-anchor="middle" class="lbl s">semente de noz-vômica</text>
    ${labc(182, 70, 120, 60, 'esôfago')}
    ${labc(282, 92, 300, 52, 'gás no fundo → arroto')}
    ${labc(300, 168, 384, 232, 'pregas gástricas')}
    ${labc(220, 270, 236, 352, 'suco gástrico (pH ≈ 2)')}
    ${labc(104, 252, 76, 330, 'piloro')}
    ${labc(122, 180, 88, 126, ['parede', 'muscular'])}`, 41, 'Gravura: estômago em corte com pregas, comida, suco gástrico, bolhas e onda peristáltica; fosseta gástrica ampliada liberando ácido; semente de noz-vômica');
  };

  /* ─────────── 5. PICADA DE ABELHA ─────────── */
  complaint.picada = () => {
    const ce = uid(), cs = uid(), sw = uid(), ab = uid();
    const L = 250, R = 520, T = 236, yE = 252, yD = 320, B = 366;
    // olho composto
    let hex = ''; for (let y = -14; y < 16; y += 3.4) for (let x = -10 + ((Math.round(y / 3.4)) % 2) * 1.7; x < 10; x += 3.4) hex += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="none" stroke="#000" stroke-width=".3"/>`;
    const surf = `M${L} ${T} C330 ${T} 350 ${T - 1} 370 ${T - 14} C380 ${T - 22} 400 ${T - 22} 410 ${T - 14} C430 ${T - 1} 450 ${T} ${R} ${T}`;
    const wing = (d, veins) => `<path d="${d}" fill="#dceaf4" fill-opacity=".55" stroke="${INK}" stroke-width=".8"/><path d="${veins}" stroke="${INK}" stroke-width=".5" fill="none" opacity=".75"/>`;
    return cp(`<defs><clipPath id="${ce}"><ellipse cx="0" cy="0" rx="10" ry="16"/></clipPath>
      <clipPath id="${cs}"><path d="${surf} L${R} ${B} L${L} ${B}Z"/></clipPath>
      ${grad(sw, [[0, PAL.red, .5], [1, PAL.red, 0]], true)}
      <clipPath id="${ab}"><path d="M0 -26 C40 -30 78 -14 86 6 C78 24 40 34 0 26 C-8 10 -8 -12 0 -26Z"/></clipPath></defs>
    <!-- ABELHA -->
    <g transform="translate(160 132) rotate(-12)">
      <!-- asas (animadas) -->
      <g class="anim">
        <g class="wing" style="transform-origin:-4px -20px">${wing('M-6 -22 C-20 -70 30 -104 72 -92 C96 -84 92 -60 70 -48 C44 -34 14 -26 -6 -22Z', 'M-6 -22 C14 -46 40 -72 72 -88 M4 -30 C24 -46 50 -58 76 -62 M24 -50 L40 -38 M44 -68 L54 -50 M-2 -40 C10 -62 28 -82 48 -94')}</g>
        <g class="wing w2" style="transform-origin:2px -18px">${wing('M2 -18 C10 -50 56 -66 84 -54 C98 -46 90 -30 70 -24 C48 -18 22 -16 2 -18Z', 'M2 -18 C30 -30 56 -44 84 -52 M30 -22 L46 -42 M56 -26 L66 -46')}</g>
      </g>
      <!-- abdômen -->
      <path d="M0 -26 C40 -30 78 -14 86 6 C78 24 40 34 0 26 C-8 10 -8 -12 0 -26Z" fill="${P('yellow')}" class="ink"/>
      <g clip-path="url(#${ab})">${[14, 32, 50, 68].map(x => `<path d="M${x} -40 C${x - 8} -10 ${x - 8} 14 ${x} 40 L${x + 10} 40 C${x + 2} 14 ${x + 2} -10 ${x + 10} -40Z" fill="#3b2a1a"/>`).join('')}
        ${hatchIn(ab, 0, 0, 86, 34, 2.2, -30, .35)}</g>
      ${fuzz(40, 0, 44, 24, 90, 4, 4, '#5a3e1e', .45)}
      <path d="M86 6 L100 9 L86 11Z" fill="${INK}"/>
      <!-- tórax -->
      <ellipse cx="-22" cy="-2" rx="24" ry="22" fill="${P('ochre')}" class="ink"/>${fuzz(-22, -2, 24, 22, 120, 9, 5, '#5a3e1e', .5)}
      ${SH('M-22 20 A24 22 0 0 0 2 -2 A20 20 0 0 1 -22 20Z')}
      <!-- cabeça -->
      <ellipse cx="-56" cy="2" rx="16" ry="19" fill="${P('brown')}" class="ink"/>
      <g transform="translate(-58 0)"><ellipse rx="10" ry="16" fill="#2d241c" stroke="${INK}" stroke-width=".6"/><g clip-path="url(#${ce})">${hex}</g><ellipse cx="-3" cy="-7" rx="2.6" ry="4" fill="#fff" opacity=".45"/></g>
      ${[[-50, -16], [-46, -14], [-54, -15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#000"/>`).join('')}
      <path d="M-62 -14 L-74 -34 L-90 -40 M-58 -16 L-66 -40 L-80 -50" class="ink" stroke-width="1.2"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${-74 - i * 2.6}" cy="${-34 - i}" r=".9" fill="${INK}"/><circle cx="${-66 - i * 2.4}" cy="${-40 - i * 1.6}" r=".9" fill="${INK}"/>`).join('')}
      <path d="M-66 16 l-6 6 l4 2 M-60 18 l-2 8 l4 0" class="ink thin"/>
      <!-- pernas articuladas -->
      ${[[-34, 16, -40, 36, -52, 50], [-20, 18, -16, 40, -26, 58], [-8, 16, 8, 38, 2, 62]].map(([a, b, c, d, e, f], i) => `<path d="M${a} ${b} L${c} ${d} L${e} ${f}" class="ink" stroke-width="1.6"/><path d="M${e} ${f} l-4 3 M${e} ${f} l2 4" class="ink thin"/>${fuzz((a + c) / 2, (b + d) / 2, 3, 8, 10, 30 + i, 3, INK, .4)}`).join('')}
      <ellipse cx="6" cy="44" rx="6" ry="9" fill="${P('orange')}" stroke="${INK}" stroke-width=".6"/>
    </g>
    <!-- PELE EM CORTE -->
    <path d="${surf} L${R} ${B} L${L} ${B}Z" fill="#f7ecc8" class="ink"/>
    <g clip-path="url(#${cs})">
      <rect x="${L}" y="${T - 30}" width="${R - L}" height="${yE - T + 30}" fill="#f1d3b4"/>
      ${[...Array(34)].map((_, i) => `<rect x="${L + i * 8 + .5}" y="${yE - 6}" width="7" height="5" rx="2" fill="#efc59e" stroke="${INK}" stroke-width=".3"/>`).join('')}
      <rect x="${L}" y="${yE}" width="${R - L}" height="${yD - yE}" fill="#f6d6db"/>
      ${[...Array(22)].map((_, i) => { const rr = rng(i + 70); const x = L + 4 + rr() * 260, y = yE + 8 + rr() * 54; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} c4 -3 8 3 12 0 s8 3 12 0" stroke="#c98b96" stroke-width=".6" fill="none"/>`; }).join('')}
      ${[...Array(14)].map((_, i) => `<circle cx="${L + 10 + i * 20}" cy="${yD + 16 + (i % 2) * 10}" r="9" fill="${P('yellow')}" stroke="${INK}" stroke-width=".5"/>`).join('')}
      <!-- capilar que dilata -->
      <g class="anim"><g class="dilate" style="transform-origin:385px 296px;transform-box:view-box"><path d="M${L} 292 C320 288 360 300 400 294 C440 288 480 298 ${R} 294 L${R} 302 C480 306 440 296 400 302 C360 308 320 296 ${L} 300Z" fill="#e88a80" stroke="${INK}" stroke-width=".6"/></g></g>
      <!-- terminação nervosa -->
      <path d="M${R} 312 C480 310 450 290 430 276 L420 266 M430 276 L432 262 M430 276 L440 268" stroke="${PAL.gold}" stroke-width="1.6" fill="none"/>
      <!-- mastócito -->
      <circle cx="320" cy="282" r="13" fill="${P('violet')}" stroke="${INK}" stroke-width=".7"/><ellipse cx="322" cy="284" rx="5" ry="4" fill="${PAL.purple}"/>
      ${[...Array(10)].map((_, i) => `<circle cx="${(320 + Math.cos(i * .63) * 8.5).toFixed(1)}" cy="${(282 + Math.sin(i * .63) * 8.5).toFixed(1)}" r="1.5" fill="${PAL.purple}"/>`).join('')}
      <g class="anim">
        <ellipse class="swell" cx="390" cy="${T - 4}" rx="70" ry="26" fill="url(#${sw})"/>
        ${[...Array(12)].map((_, i) => `<circle class="venom" style="animation-delay:${(i * .26).toFixed(2)}s;--dx:${((i % 2 ? 1 : -1) * (10 + i * 4))}px;--dy:${(i % 3) * 7 - 4}px" cx="390" cy="300" r="2.2" fill="${PAL.mud}" stroke="${INK}" stroke-width=".3"/>`).join('')}
        ${[...Array(8)].map((_, i) => `<circle class="hist" style="animation-delay:${(i * .4).toFixed(1)}s;--dx:${(Math.cos(i * .8) * 30).toFixed(1)}px;--dy:${(Math.sin(i * .8) * 18 - 6).toFixed(1)}px" cx="320" cy="282" r="1.7" fill="${PAL.purple}"/>`).join('')}
      </g>
    </g>
    <path d="${surf}" fill="none" stroke="${INK}" stroke-width="1.4"/>
    <path d="M${L} ${yE} C330 ${yE} 350 ${yE - 6} 380 ${yE - 6} C410 ${yE - 6} 440 ${yE} ${R} ${yE}" class="ink thin" fill="none"/>
    <path d="M${L} ${yD} H${R}" class="ink thin"/>
    <!-- ferrão farpado + bolsa de veneno -->
    <path d="M386 ${T - 20} L390 304 L394 ${T - 20}" fill="${P('brown')}" stroke="${INK}" stroke-width=".8"/>
    ${[...Array(8)].map((_, i) => `<path d="M${387 + i * .4} ${T - 8 + i * 9} l-5 -5 M${393 - i * .4} ${T - 8 + i * 9} l5 -5" stroke="${INK}" stroke-width=".7"/>`).join('')}
    <g class="anim"><g class="sac" style="transform-origin:390px 196px">
      <path d="M390 ${T - 20} C378 ${T - 26} 372 ${T - 40} 378 ${T - 52} C384 ${T - 62} 398 ${T - 62} 403 ${T - 52} C408 ${T - 40} 402 ${T - 26} 390 ${T - 20}Z" fill="${P('yellow')}" stroke="${INK}"/>
      ${[0, 1, 2, 3].map(i => `<path d="M${380 + i} ${T - 48 + i * 6} C386 ${T - 52 + i * 6} 396 ${T - 52 + i * 6} ${401 - i} ${T - 48 + i * 6}" stroke="${INK}" stroke-width=".4" fill="none"/>`).join('')}
      <path d="M398 ${T - 58} c8 -6 18 -4 22 2" class="ink thin"/></g></g>
    ${labc(401, T - 46, 432, 156, ['bolsa de veneno', '(segue bombeando)'])}
    ${labc(392, 270, 300, 212, 'ferrão com farpas')}
    ${labc(320, 282, 242, 268, ['mastócito solta', 'histamina'])}
    ${labc(436, 272, 470, 210, ['nervo:', 'dor e ardor'])}
    ${labc(470, 298, 242, 320, ['vaso dilata:', 'vermelhidão'])}
    ${labc(372, T - 12, 330, 188, 'inchaço')}
    ${dim(366, T - 20, 366, 304, '≈ 2 mm', 'l')}`, 53, 'Gravura: abelha com asas batendo e corte da pele com ferrão farpado, bolsa de veneno bombeando, veneno se espalhando, mastócito soltando histamina, vaso dilatado e inchaço');
  };

  /* ─────────── 6. ENJOO DE MOVIMENTO ─────────── */
  complaint.enjoo = () => {
    const ci = uid(), cc = uid(), sky = uid();
    // trajetórias dos canais (também usadas no offset-path das partículas)
    const can = [
      ['M402 150 C360 150 352 74 404 66 C456 58 470 128 430 146', 'ant'],
      ['M434 158 C470 120 538 118 540 166 C542 212 478 216 452 182', 'post'],
      ['M410 168 C380 196 404 236 452 232 C498 228 506 190 470 176', 'lat']
    ];
    const r = rng(41); let sea = '';
    for (let i = 0; i < 6; i++) { const y = 186 + i * 5; let x = 16 + r() * 18; while (x < 250) { const w = 8 + r() * 30; sea += `M${x.toFixed(1)} ${y} h${Math.min(w, 252 - x).toFixed(1)} `; x += w + 4 + r() * 10; } }
    let coch = ''; // espiral da cóclea (2,5 voltas)
    for (let t = 0; t <= 15.7; t += .25) { const rr = 30 * Math.exp(-t * .1), x = 352 + Math.cos(t) * rr, y = 214 + Math.sin(t) * rr * .9; coch += `${t ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `; }
    let hairs = '';
    for (let i = 0; i < 9; i++) { const x = 412 + i * 9; hairs += `<path d="M${x} 334 v-18" stroke="${INK}" stroke-width=".6"/><path d="M${x - 1.6} 318 v-14 M${x} 318 v-18 M${x + 1.6} 318 v-12" stroke="${INK}" stroke-width=".4"/><rect x="${x - 4}" y="334" width="8" height="16" rx="3" fill="${P('pink')}" stroke="${INK}" stroke-width=".5"/>`; }
    const scn = 'scn' + (gid + 1);
    return cp(`<defs><clipPath id="${ci}"><circle cx="452" cy="314" r="54"/></clipPath><clipPath id="${scn}"><rect x="16" y="40" width="240" height="172"/></clipPath>
      ${grad(sky, [[0, '#f7efd9', 1], [1, '#e6eef2', 1]])}</defs>
    <!-- cena do mar -->
    <rect x="16" y="52" width="240" height="160" fill="url(#${sky})" class="ink thin"/>
    ${[...Array(4)].map((_, i) => `<path d="M${40 + i * 10} ${80 + i * 5} h${60 - i * 12}" class="ink thin" opacity=".35"/>`).join('')}
    <path d="M150 74 q5 -4 10 0 q5 -4 10 0 M196 92 q4 -3 8 0 q4 -3 8 0" class="ink thin"/>
    <path d="M16 178 H256" class="ink thin"/>
    <path d="M16 178 C40 170 60 172 80 178Z" fill="${P('green')}" class="ink thin"/>
    <path d="${sea}" stroke="${PAL.blue}" stroke-width=".8" opacity=".75" fill="none"/>
    <g class="anim" clip-path="url(#${scn})"><g class="boat">
      <path d="M60 170 L196 170 Q190 188 172 194 L82 194 Q66 188 60 170Z" fill="${P('brown')}" stroke="${INK}"/>${XH('M64 178 L192 178 Q186 188 172 194 L82 194 Q70 188 64 178Z')}
      <path d="M62 174 H194" stroke="${INK}" stroke-width=".6"/>
      <rect x="110" y="148" width="44" height="22" fill="${P('cream')}" stroke="${INK}"/><rect x="118" y="154" width="10" height="8" fill="${PAL.sky}" stroke="${INK}" stroke-width=".6"/><rect x="136" y="154" width="10" height="8" fill="${PAL.sky}" stroke="${INK}" stroke-width=".6"/>
      <circle cx="123" cy="158" r="2.6" fill="${P('skin')}" stroke="${INK}" stroke-width=".5"/>
      <path d="M104 148 h56 l-6 -6 h-44z" fill="${P('red')}" stroke="${INK}" stroke-width=".8"/>
      <path d="M90 170 V86" stroke="${INK}" stroke-width="1.8"/><path d="M92 90 C112 110 118 140 108 166 L92 166Z" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/>${SH('M100 104 C112 120 114 146 108 166 L102 166 C106 144 106 122 100 104Z')}
      <path d="M90 86 l12 3 l-12 4z" fill="${PAL.red}"/></g>
      <path class="waves" d="M-80 198 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="${PAL.blue}" stroke-width="1.4"/>
      <path class="waves w2" d="M-60 206 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="${PAL.teal}" stroke-width="1.1"/></g>
    <!-- OUVIDO INTERNO -->
    ${can.map(([d]) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#f3e6c9" stroke-width="11" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#a9cde6" stroke-width="5" stroke-linecap="round"/>`).join('')}
    ${[[430, 146], [452, 182], [470, 176]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="8" fill="#f3e6c9" stroke="${INK}"/><ellipse cx="${x}" cy="${y}" rx="5" ry="4" fill="#a9cde6"/>`).join('')}
    <ellipse cx="420" cy="170" rx="26" ry="18" fill="#f3e6c9" stroke="${INK}" stroke-width="1.2"/><ellipse cx="420" cy="170" rx="18" ry="11" fill="#a9cde6" opacity=".9"/>
    <path d="${coch}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="${coch}" fill="none" stroke="#f4d4cf" stroke-width="10.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${coch}" fill="none" stroke="${INK}" stroke-width=".5" stroke-dasharray="1 2.4" opacity=".7"/>
    <path d="M382 214 C390 196 398 184 404 178" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M382 214 C390 196 398 184 404 178" fill="none" stroke="#f4d4cf" stroke-width="10.6" stroke-linecap="round"/>
    <path d="M436 186 C450 222 470 236 520 250 M432 190 C446 230 470 244 520 258" stroke="${PAL.gold}" stroke-width="2.6" fill="none"/><path d="M434 188 C448 226 470 240 520 254" stroke="${INK}" stroke-width=".4" fill="none"/>
    <g class="anim">${can.map(([d], k) => [0, 1, 2].map(i => `<circle class="flow" r="2.2" fill="${PAL.blue}" style="offset-path:path('${d}');animation-delay:${(k * .3 + i * .5).toFixed(1)}s"/>`).join('')).join('')}</g>
    <!-- detalhe: cúpula da ampola -->
    <path d="M452 182 C452 220 452 240 452 258" class="lead" stroke-dasharray="3 3"/>
    <circle cx="452" cy="314" r="54" fill="#e3eff6" stroke="${INK}" stroke-width="2"/>
    <g clip-path="url(#${ci})">
      <path d="M396 350 C420 340 484 340 508 350 V372 H396Z" fill="${P('pink')}" stroke="${INK}" stroke-width=".6"/>${hairs}
      <g class="anim"><g class="cupula" style="transform-origin:452px 336px">
        <path d="M408 336 C408 296 430 268 452 266 C474 268 496 296 496 336Z" fill="#fbf6ea" fill-opacity=".75" stroke="${INK}" stroke-width=".9"/>
        ${[0, 1, 2, 3].map(i => `<path d="M${422 + i * 10} 334 C${424 + i * 9} 310 ${436 + i * 5} 290 ${448 + i * 2} 278" stroke="${INK}" stroke-width=".35" fill="none" opacity=".5"/>`).join('')}</g>
        <path class="fluid" d="M404 294 h18 m-4 -4 l4 4 l-4 4" stroke="${PAL.blue}" stroke-width="1.4" fill="none"/></g>
    </g>
    <circle cx="452" cy="314" r="54" fill="none" stroke="${PAL.gold}" stroke-width="3" opacity=".6"/>
    <!-- conflito olho × ouvido -->
    <g transform="translate(60 262)"><path d="M-30 0 C-12 -18 12 -18 30 0 C12 18 -12 18 -30 0Z" fill="${PAL.white}" class="ink"/><circle r="11" fill="#5f8f34" stroke="${INK}" stroke-width=".7"/><circle r="4.6" fill="#15110d"/><circle cx="-3" cy="-3" r="1.8" fill="#fff"/><path d="M-30 0 C-12 -18 12 -18 30 0" fill="none" stroke="${INK}" stroke-width="1.8"/></g>
    <g transform="translate(206 300)"><path d="M-46 0 C-50 -30 -20 -46 8 -42 C36 -40 50 -20 46 4 C44 18 30 24 16 22 C8 34 -4 40 -10 30 C-28 30 -44 20 -46 0Z" fill="#f2c6c9" class="ink"/>
      <path d="M-34 -8 c6 -8 14 0 20 -8 s14 2 20 -6 M-36 8 c8 -6 16 2 24 -4 s16 4 24 -2 M-20 -26 c6 -4 12 2 18 -2" class="ink thin" opacity=".6"/>
      <circle cx="2" cy="26" r="5" fill="${PAL.red}" opacity=".8" class="flash"/></g>
    <path d="M92 262 C130 262 170 278 196 320" stroke="${PAL.blue}" stroke-width="1.6" fill="none" marker-end="url(#arr)" stroke-dasharray="4 3"/>
    <path d="M360 236 C330 300 260 330 214 330" stroke="${PAL.red}" stroke-width="1.6" fill="none" marker-end="url(#arr)" stroke-dasharray="4 3"/>
    <text x="104" y="250" class="lbl s">olho: “estamos parados”</text>
    <text x="300" y="300" class="lbl s" text-anchor="middle">ouvido: “estamos balançando!”</text>
    <text x="206" y="356" text-anchor="middle" class="lbl em">cérebro: “?!” → enjoo</text>
    ${labc(404, 70, 396, 54, 'canais semicirculares')}
    ${labc(352, 214, 300, 234, 'cóclea (audição)')}
    <text x="522" y="240" text-anchor="middle" class="lbl s">nervo</text>
    ${labc(440, 300, 392, 330, ['a cúpula se dobra', 'com o líquido'], 'lbl s')}`, 67, 'Gravura: barco balançando no mar; ouvido interno com canais semicirculares, cóclea e nervo, com líquido em movimento; detalhe da cúpula se dobrando sobre as células ciliadas; olho e ouvido mandando sinais conflitantes ao cérebro');
  };

  /* ═══════════════ PRINCÍPIOS — vinhetas em estilo gravura ═══════════════
     Mesmo tratamento das pranchas da Consulta: traço nítido, hachuras,
     sem o filtro de lápis, com pequenas animações. */
  const principle = {};
  const ico = (b, lbl) => `<svg viewBox="0 0 240 160" class="art icon" role="img" aria-label="${lbl}">${b}</svg>`;
  const ground = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * .07}" fill="url(#p-shade)"/>`;
  /* silhueta humana de frente, simétrica */
  const bodyPath = 'M126 44 C138 45 148 50 151 60 L158 100 C159 106 154 108 152 104 L145 70 L143 96 C146 104 146 110 144 118 L141 150 L128 150 L122 108 L120 104 L118 108 L112 150 L99 150 L96 118 C94 110 94 104 97 96 L95 70 L88 104 C86 108 81 106 82 100 L89 60 C92 50 102 45 114 44 Z';
  const figure = (fill, hatch = true) => {
    const c = uid();
    return `<defs><clipPath id="${c}"><path d="${bodyPath}"/><circle cx="120" cy="31" r="12"/></clipPath></defs>
      <circle cx="120" cy="31" r="12" fill="${fill}" class="ink"/>
      <path d="${bodyPath}" fill="${fill}" class="ink"/>
      ${hatch ? hatchIn(c, 120, 20, 160, 150, 2.6, -55, .22) : ''}
      <path d="M113 44 C116 47 124 47 127 44" class="ink thin"/><path d="M120 104 V84 M110 62 C114 66 126 66 130 62" class="ink thin" opacity=".5"/>`;
  };
  const vial = (x, y, liq, label = '', s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-9" y="-30" width="18" height="40" rx="5" fill="${PAL.white}" stroke="${INK}" stroke-width="1"/>
      <rect x="-7.5" y="-12" width="15" height="20.5" rx="3.6" fill="${liq}" opacity=".75"/>
      <rect x="-6" y="-38" width="12" height="9" rx="1.5" fill="${P('brown')}" stroke="${INK}" stroke-width=".8"/>
      <path d="M-6 -34 h12" stroke="${INK}" stroke-width=".4"/>
      <rect x="-8" y="-24" width="16" height="10" fill="${PAL.cream}" stroke="${INK}" stroke-width=".5"/>
      ${label ? `<text y="-17" text-anchor="middle" style="font:italic 4.6px var(--fell);fill:${INK}">${label}</text>` : `<path d="M-5 -20 h10 M-4 -17 h8" stroke="${INK}" stroke-width=".4"/>`}
      <path d="M-6 -27 V6" stroke="#fff" stroke-width="1.6" opacity=".7"/></g>`;

  /* 1. Semelhante cura semelhante: cebola → lágrima; cebola diluída → coriza */
  principle.similia = () => {
    const cb = uid();
    const rings = [34, 28, 22, 16, 10, 4].map((r, i) => `<ellipse cx="${52 - (34 - r) * .12}" cy="98" rx="${r}" ry="${r * .3}" fill="${i % 2 ? '#f7f1f6' : '#c9a8d6'}" stroke="${INK}" stroke-width="${i ? .5 : 1}"/>`).join('');
    let irl = ''; for (let a = 0; a < 360; a += 15) { const t = a * Math.PI / 180; irl += `M${(160 + Math.cos(t) * 3.4).toFixed(1)} ${(46 + Math.sin(t) * 3.4).toFixed(1)} L${(160 + Math.cos(t) * 8.6).toFixed(1)} ${(46 + Math.sin(t) * 8.6).toFixed(1)} `; }
    return ico(`<defs><clipPath id="${cb}"><path d="M18 98 C16 126 36 140 52 140 C68 140 88 126 86 98Z"/></clipPath></defs>
    ${ground(52, 146, 40)}${ground(204, 146, 20)}
    <path d="M18 98 C16 126 36 140 52 140 C68 140 88 126 86 98Z" fill="${P('purple')}" class="ink"/>
    ${hatchIn(cb, 52, 98, 88, 140, 2.2, -35, .3)}
    <path d="M30 104 Q34 126 52 138 M74 104 Q70 126 52 138 M52 102 V138" stroke="${INK}" stroke-width=".45" opacity=".45" fill="none"/>
    ${[...Array(9)].map((_, i) => `<path d="M${46 + i * 1.5} 140 q${-4 + i} 6 ${-6 + i * 1.6} 10" stroke="${PAL.ochre}" stroke-width=".6" fill="none"/>`).join('')}
    <ellipse cx="52" cy="98" rx="35.5" ry="11" fill="${P('ochre')}" stroke="${INK}" stroke-width=".9"/>${rings}
    <g class="anim">${[0, 1, 2].map(i => `<path class="vap2" style="animation-delay:${i * .9}s" d="M${44 + i * 8} 88 c-4 -5 4 -9 0 -14 s4 -9 0 -14" fill="none" stroke="${PAL.violet}" stroke-width="1.3" stroke-linecap="round"/>`).join('')}</g>
    <!-- olho que lacrimeja -->
    <path d="M132 46 C144 30 176 30 188 46 C176 60 144 60 132 46Z" fill="${PAL.white}" class="ink"/>
    <circle cx="160" cy="46" r="9" fill="#4f78b8" stroke="${INK}" stroke-width=".7"/><path d="${irl}" stroke="#23406f" stroke-width=".5"/><circle cx="160" cy="46" r="3.6" fill="#15110d"/><circle cx="157.6" cy="43.4" r="1.4" fill="#fff"/>
    <path d="M132 46 C144 30 176 30 188 46" fill="none" stroke="${INK}" stroke-width="1.6"/>
    ${[...Array(9)].map((_, i) => { const t = .12 + i * .095, x = 132 + 56 * t, y = 46 - 18 * Math.sin(Math.PI * t); return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(-1.5 + i * .4).toFixed(1)} -4.5" class="ink thin" stroke-width=".6"/>`; }).join('')}
    <g class="anim"><path class="tear2" d="M138 54 c-1.6 3.4 -2.8 5 -2.8 6.6 a2.8 2.8 0 0 0 5.6 0 c0 -1.6 -1.2 -3.2 -2.8 -6.6z" fill="#a9cde6" stroke="${INK}" stroke-width=".5"/></g>
    <!-- seta ornamental -->
    <path d="M84 78 C96 50 112 44 126 46" fill="none" stroke="${INK}" stroke-width=".9" marker-end="url(#arr)"/>
    <text x="96" y="40" text-anchor="middle" class="lbl s" style="font-size:8.5px">provoca</text>
    <!-- frasco com a cebola diluída -->
    ${vial(204, 136, PAL.violet, 'Allium cepa', 1.15)}
    <path d="M168 62 C186 70 198 80 202 92" fill="none" stroke="${INK}" stroke-width=".9" stroke-dasharray="2.6 2" marker-end="url(#arr)"/>
    <text x="214" y="70" text-anchor="middle" class="lbl s" style="font-size:8.5px">trataria</text>
    <text x="52" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">cebola: faz lacrimejar</text>
    <text x="204" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">diluída: p/ coriza</text>`, 'Gravura: a cebola provoca lágrimas; a cebola diluída, num frasco, seria usada para coriza');
  };

  /* 2. Experimentação no ser humano saudável: o diário */
  principle.experimentacao = () => {
    let rl = ''; for (let i = 0; i < 9; i++) rl += `M46 ${62 + i * 8.4} L114 ${58 + i * 8.4} M126 ${58 + i * 8.4} L194 ${62 + i * 8.4} `;
    const barbs = [...Array(14)].map((_, i) => { const t = i / 14, x = 214 - t * 40, y = 10 + t * 56; return `M${x.toFixed(1)} ${y.toFixed(1)} l${(6 - t * 3).toFixed(1)} ${(-2 + t).toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)} l${(-3 + t).toFixed(1)} ${(4 - t).toFixed(1)}`; }).join(' ');
    return ico(`${ground(120, 146, 92)}
    <!-- livro aberto -->
    <path d="M30 52 L120 44 L120 140 L30 146Z" fill="${P('brown')}" class="ink"/><path d="M120 44 L210 52 L210 146 L120 140Z" fill="${P('brown')}" class="ink"/>
    <path d="M36 50 Q78 40 118 48 L118 136 Q78 128 36 140Z" fill="${PAL.white}" class="ink thin"/>
    <path d="M122 48 Q162 40 204 50 L204 140 Q162 128 122 136Z" fill="${PAL.white}" class="ink thin"/>
    ${SH('M106 46 Q113 46 118 48 L118 136 Q113 134 106 133Z')}${SH('M122 48 Q127 46 134 46 L134 133 Q127 134 122 136Z')}
    <path d="${rl}" stroke="${PAL.sky}" stroke-width=".5" opacity=".8" fill="none"/>
    <text x="50" y="58" class="lbl s" style="font-size:7.5px">dia 1</text><text x="130" y="56" class="lbl s" style="font-size:7.5px">dia 2</text>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => script(48, 68 + i * 8.4 - i * .45, 62 - (i % 3) * 8, 300 + i, .32)).join('')}
    ${[0, 1, 2].map(i => script(128, 66 + i * 8.4 + i * .45, 60 - i * 10, 320 + i, .32)).join('')}
    <!-- pequeno esboço: termômetro e lua (sono) -->
    <g transform="translate(150 106)"><rect x="-2" y="-16" width="4" height="22" rx="2" fill="${PAL.white}" stroke="${INK}" stroke-width=".5"/><circle cy="8" r="3.6" fill="${PAL.red}" stroke="${INK}" stroke-width=".5"/><rect x="-1" y="-6" width="2" height="12" fill="${PAL.red}"/></g>
    <path d="M178 98 a8 8 0 1 0 8 12 a6 6 0 1 1 -8 -12z" fill="${P('yellow')}" stroke="${INK}" stroke-width=".6"/>
    <path d="M142 128 c6 -2 10 2 16 0" stroke="${INK}" stroke-width=".5" fill="none"/>
    <!-- linha sendo escrita -->
    <g class="anim"><path class="writeline" d="M128 ${66 + 3 * 8.4} c3 -4 5 3 8 0 s5 -4 8 0 s5 3 8 0 s4 -4 8 0" stroke="${INK}" stroke-width=".7" fill="none" pathLength="1"/>
    <!-- pena -->
    <g class="quill"><path d="M174 66 C186 40 204 18 222 8 C214 24 200 48 176 68Z" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/>
      <path d="${barbs}" stroke="${INK}" stroke-width=".35" opacity=".6"/>
      <path d="M222 8 C200 30 186 50 172 72" stroke="${PAL.brown}" stroke-width="1.2" fill="none"/><path d="M172 72 l-3 6" stroke="${INK}" stroke-width="1.2"/></g></g>
    <!-- tinteiro e frasco -->
    <path d="M206 132 h22 v10 c0 4 -22 4 -22 0z" fill="${P('gray')}" class="ink"/><ellipse cx="217" cy="132" rx="11" ry="3" fill="#2a2420" stroke="${INK}" stroke-width=".6"/>
    ${vial(22, 140, PAL.sky)}
    <text x="120" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">tudo o que o voluntário sentir vai para o diário</text>`, 'Gravura: diário aberto de experimentação com anotações, uma pena escrevendo, tinteiro e frasco');
  };

  /* 3. Dose mínima e dinamização: a escada */
  principle.dose = () => {
    const steps = [[30, 130], [86, 112], [142, 94], [198, 76]];
    const dots = [14, 6, 2, 0]; const r = rng(77);
    const flask = (x, y, i) => {
      const c = uid(); let d = '';
      for (let k = 0; k < dots[i]; k++) { const a = r() * 6.28, rr = Math.sqrt(r()) * 9; d += `<circle cx="${(x + Math.cos(a) * rr).toFixed(1)}" cy="${(y - 12 + Math.sin(a) * rr * .6).toFixed(1)}" r="1.3" fill="${PAL.purple}"/>`; }
      return `<defs><clipPath id="${c}"><circle cx="${x}" cy="${y - 13}" r="13"/></clipPath></defs>
        <path d="M${x - 4} ${y - 40} h8 v12 c8 3 10 9 10 15 a14 14 0 0 1 -28 0 c0 -6 2 -12 10 -15z" fill="${PAL.white}" class="ink"/>
        <rect x="${x - 15}" y="${y - 18}" width="30" height="20" fill="#b89ad0" opacity="${[.9, .55, .3, .12][i]}" clip-path="url(#${c})"/>${d}
        <path d="M${x - 9} ${y - 22} a10 10 0 0 0 -1 12" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/>
        <rect x="${x - 5}" y="${y - 44}" width="10" height="6" rx="1" fill="${P('brown')}" stroke="${INK}" stroke-width=".6"/>`;
    };
    return ico(`
    <!-- degraus de madeira -->
    <path d="M6 132 H58 V114 H114 V96 H170 V78 H234 V150 H6Z" fill="${P('ochre')}" class="ink"/>
    ${XH('M6 140 H234 V150 H6Z')}<path d="M6 140 H234" class="ink thin"/>
    ${[[58, 114, 132], [114, 96, 114], [170, 78, 96]].map(([x, y1, y2]) => `<path d="M${x} ${y1} V${y2}" fill="none" stroke="${INK}" stroke-width=".5"/>${SH(`M${x - 6} ${y1} H${x} V${y2} H${x - 6}Z`)}`).join('')}
    ${steps.map(([x, y], i) => flask(x, y, i)).join('')}
    <!-- conta-gotas entre os frascos -->
    ${[0, 1, 2].map(i => { const [x0, y0] = steps[i], [x1, y1] = steps[i + 1]; return `<path d="M${x0 + 8} ${y0 - 48} C${x0 + 20} ${y0 - 66} ${x1 - 16} ${y1 - 70} ${x1 - 2} ${y1 - 52}" fill="none" stroke="${INK}" stroke-width=".7" stroke-dasharray="2 2" marker-end="url(#arr)"/>
      <text x="${(x0 + x1) / 2 + 2}" y="${(y0 + y1) / 2 - 62}" text-anchor="middle" class="lbl s" style="font-size:7.5px">1 : 100</text>`; }).join('')}
    <g class="anim">${[1, 2, 3].map(i => `<path class="drip2" style="animation-delay:${i * .6}s" d="M${steps[i][0]} ${steps[i][1] - 56} c-1.4 3 -2.4 4.4 -2.4 5.6 a2.4 2.4 0 0 0 4.8 0 c0 -1.2 -1 -2.6 -2.4 -5.6z" fill="#b89ad0" stroke="${INK}" stroke-width=".4"/>`).join('')}</g>
    ${['TM', '1C', '2C', '… 30C'].map((t, i) => `<text x="${steps[i][0]}" y="${steps[i][1] + 10}" text-anchor="middle" style="font:italic 9px var(--fell);fill:${INK}">${t}</text>`).join('')}
    <text x="234" y="158" text-anchor="end" class="lbl s" style="font-size:8.5px">cada vez menos substância</text>`, 'Gravura: escada de madeira com frascos de diluição cada vez mais claros, da tintura-mãe a 30C');
  };

  /* 4. Medicamento único: um frasco sob a redoma */
  principle.unico = () => {
    const c = uid();
    return ico(`<defs>${grad(c, [[0, '#ffffff', .55], [1, '#dfeaf0', .2]])}</defs>
    ${ground(150, 146, 52)}${ground(46, 146, 30)}
    <!-- várias misturas (riscadas) -->
    ${vial(32, 138, PAL.green, '', .85)}${vial(48, 136, PAL.orange, '', .85)}${vial(64, 138, PAL.rose, '', .85)}
    <path d="M28 120 C40 126 56 126 68 120" stroke="${PAL.red}" stroke-width=".8" fill="none"/>
    <path d="M20 96 L76 142 M76 96 L20 142" stroke="${PAL.red}" stroke-width="1.6" opacity=".7"/>
    <text x="48" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">misturas</text>
    <!-- pedestal -->
    <path d="M108 140 H192 L186 132 H114Z" fill="${P('gold')}" class="ink"/>${SH('M170 132 H186 L192 140 H176Z')}
    <rect x="118" y="124" width="64" height="8" rx="2" fill="${P('ochre')}" class="ink"/>
    <path d="M122 128 h56" stroke="${INK}" stroke-width=".4"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${126 + i * 8}" cy="136" r="1.2" fill="${INK}" opacity=".6"/>`).join('')}
    <!-- frasco -->
    ${vial(150, 108, PAL.sky, 'um só', 1.5)}
    <!-- redoma de vidro -->
    <path d="M116 124 V62 C116 30 184 30 184 62 V124" fill="url(#${c})" stroke="${INK}" stroke-width="1"/>
    <path d="M144 26 h12 v6 h-12z" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/><circle cx="150" cy="22" r="4.5" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/>
    <path d="M114 124 H186" stroke="${INK}" stroke-width="1.4"/>
    <g class="anim"><path class="shine" d="M124 112 V64 C124 48 134 40 144 38" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <path d="M176 100 V64 C176 54 172 48 166 44" stroke="${INK}" stroke-width=".4" fill="none" opacity=".5"/>
    <text x="150" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">um medicamento por vez</text>`, 'Gravura: três frascos misturados riscados ao lado de um único frasco sob uma redoma de vidro');
  };

  /* 5. Individualização: três criaturas, três “gripes” diferentes */
  principle.individualizacao = () => {
    const legs = (x, y, shoe) => `<path d="M${x - 7} ${y} C${x - 8} ${y + 10} ${x - 10} ${y + 18} ${x - 9} ${y + 26} M${x + 7} ${y} C${x + 8} ${y + 10} ${x + 9} ${y + 18} ${x + 8} ${y + 26}" stroke="${INK}" stroke-width="3.6" fill="none"/>
      <path d="M${x - 7} ${y} C${x - 8} ${y + 10} ${x - 10} ${y + 18} ${x - 9} ${y + 26} M${x + 7} ${y} C${x + 8} ${y + 10} ${x + 9} ${y + 18} ${x + 8} ${y + 26}" stroke="${PAL.skin}" stroke-width="2.4" fill="none"/>
      <path d="M${x - 15} ${y + 30} C${x - 16} ${y + 25} ${x - 7} ${y + 24} ${x - 5} ${y + 28} V${y + 31} H${x - 15}Z M${x + 4} ${y + 28} C${x + 6} ${y + 24} ${x + 16} ${y + 25} ${x + 15} ${y + 30} V${y + 31} H${x + 4}Z" fill="${shoe}" stroke="${INK}" stroke-width=".7"/>`;
    const eye = (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" stroke="${INK}" stroke-width=".5"/><circle cx="${x + .5}" cy="${y + .4}" r="1.2" fill="${INK}"/>`;
    const c1 = uid(), c2 = uid(), c3 = uid();
    let spikes = ''; const r = rng(5);
    for (let i = 0; i < 26; i++) { const a = -3.0 + i * .12, x = 42 + Math.cos(a) * 24, y = 84 + Math.sin(a) * 22; spikes += `M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * (6 + r() * 6)).toFixed(1)} ${(Math.sin(a) * (6 + r() * 6)).toFixed(1)} `; }
    const blobs = [[200, 76, '#d94a4a'], [214, 78, '#4f78b8'], [194, 90, '#e9bd34'], [208, 92, '#5f8f34'], [222, 92, '#e07b39'], [201, 104, '#a98bc9'], [216, 104, '#d94a4a']];
    return ico(`<defs><clipPath id="${c1}"><ellipse cx="42" cy="88" rx="24" ry="22"/></clipPath><clipPath id="${c2}"><path d="M102 112 C100 80 110 50 120 34 C130 50 140 80 138 112Z"/></clipPath><clipPath id="${c3}"><rect x="182" y="66" width="52" height="48" rx="12"/></clipPath></defs>
    ${ground(42, 146, 26)}${ground(120, 146, 24)}${ground(208, 146, 28)}
    <g class="anim">
    <g class="bob" style="animation-delay:0s">
      ${legs(42, 108, PAL.red)}
      <ellipse cx="42" cy="88" rx="24" ry="22" fill="${P('rose')}" class="ink"/><path d="${spikes}" stroke="#b3475a" stroke-width=".9" fill="none"/>
      ${hatchIn(c1, 42, 88, 66, 110, 2.2, -40, .3)}${eye(36, 84)}${eye(48, 84)}<path d="M38 94 q4 -3 8 0" class="ink thin"/>
      <g transform="translate(18 44)"><path d="M0 0 h16 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-8 l-4 4 v-4 h-4 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4z" fill="#fff" stroke="${INK}" stroke-width=".6"/>
        ${[0, 60, 120].map(a => `<path d="M8 3 V13" transform="rotate(${a} 8 8)" stroke="${PAL.blue}" stroke-width="1"/>`).join('')}</g></g>
    <g class="bob" style="animation-delay:.4s">
      ${legs(120, 112, PAL.blue)}
      <path d="M102 112 C100 80 110 50 120 34 C130 50 140 80 138 112Z" fill="${P('teal')}" class="ink"/>
      <g clip-path="url(#${c2})">${[48, 62, 76, 90, 104].map(y => `<path d="M96 ${y} Q120 ${y + 6} 144 ${y}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".8"/>`).join('')}</g>
      ${hatchIn(c2, 130, 70, 140, 112, 2.2, -50, .3)}${eye(115, 70)}${eye(126, 70)}<path d="M116 80 q4 3 8 0" class="ink thin"/>
      <g transform="translate(140 28)"><path d="M0 0 h16 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-8 l-4 4 v-4 h-4 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4z" fill="#fff" stroke="${INK}" stroke-width=".6"/>
        <path d="M8 13 c-3 0 -4 -3 -2 -6 c1 2 2 2 2 -2 c3 2 4 6 2 8z" fill="${PAL.orange}" stroke="${INK}" stroke-width=".4"/></g></g>
    <g class="bob" style="animation-delay:.8s">
      ${legs(208, 112, PAL.green)}
      <rect x="182" y="66" width="52" height="48" rx="12" fill="#55524c" class="ink"/>
      ${blobs.map(([x, y, col]) => `<rect x="${x - 6}" y="${y - 4}" width="12" height="8" rx="3" fill="${col}" stroke="${INK}" stroke-width=".4"/>`).join('')}
      ${hatchIn(c3, 220, 90, 234, 114, 2, -50, .35)}
      <path d="M190 66 l-4 -10 l-4 2 M190 66 l2 -12 M228 66 l4 -10 l4 2" stroke="${PAL.ochre}" stroke-width="1.4" fill="none"/>
      <g transform="translate(176 32)"><path d="M0 0 h16 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-4 l-4 4 v-4 h-8 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4z" fill="#fff" stroke="${INK}" stroke-width=".6"/>
        <path d="M8 3 c-2 4 -3.4 5.6 -3.4 7.2 a3.4 3.4 0 0 0 6.8 0 c0 -1.6 -1.4 -3.2 -3.4 -7.2z" fill="${PAL.sky}" stroke="${INK}" stroke-width=".4"/></g></g>
    </g>
    <text x="42" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">sente frio</text>
    <text x="120" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">sente calor</text>
    <text x="208" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">tem muita sede</text>`, 'Gravura: três criaturas fantásticas com a mesma gripe, uma sentindo frio, outra calor e outra sede');
  };

  /* 6. Força vital */
  principle.vital = () => {
    let rays = '';
    for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283, L = i % 2 ? 10 : 18, r0 = 50; rays += `<path d="M${(120 + Math.cos(a) * r0).toFixed(1)} ${(84 + Math.sin(a) * r0 * .92).toFixed(1)} L${(120 + Math.cos(a) * (r0 + L)).toFixed(1)} ${(84 + Math.sin(a) * (r0 + L) * .92).toFixed(1)}" stroke="${i % 2 ? PAL.yellow : PAL.gold}" stroke-width="${i % 2 ? 1 : 1.8}" stroke-linecap="round"/>`; }
    let sp = 'M120 76 '; for (let t = 0; t < 18.8; t += .3) { const r = 1 + t * .9; sp += `L${(120 + Math.cos(t) * r).toFixed(1)} ${(76 + Math.sin(t) * r * .95).toFixed(1)} `; }
    return ico(`${ground(120, 152, 34)}
    <ellipse cx="120" cy="84" rx="56" ry="52" fill="none" stroke="${PAL.gold}" stroke-width=".7" stroke-dasharray="1.4 3"/>
    <g class="anim"><g class="glow" style="transform-origin:120px 84px">${rays}</g></g>
    ${figure(PAL.cream)}
    <g class="anim"><g class="spinslow" style="transform-origin:120px 76px"><path d="${sp}" stroke="${PAL.orange}" stroke-width="1.3" fill="none"/></g></g>
    <circle cx="120" cy="76" r="3" fill="${PAL.gold}" stroke="${INK}" stroke-width=".5"/>
    <text x="120" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">vitalismo: ideia do século XVIII</text>`, 'Gravura: figura humana com uma espiral luminosa no peito e raios em volta, representando a força vital');
  };

  /* 7. Lei de cura de Hering */
  principle.hering = () => {
    const out = [[150, 62, 196, 50], [150, 84, 200, 88], [90, 62, 44, 50], [90, 84, 40, 88]];
    return ico(`${ground(120, 152, 34)}
    ${figure(PAL.skin)}
    <!-- órgãos internos -->
    <path d="M114 66 c-6 -6 -14 2 -6 10 l8 8 l8 -8 c8 -8 0 -16 -6 -10 l-2 2z" fill="${PAL.red}" stroke="${INK}" stroke-width=".7" transform="translate(4 -4) scale(.9)" style="transform-origin:120px 74px"/>
    <path d="M106 70 C100 74 100 86 106 92 M134 70 C140 74 140 86 134 92" stroke="#c98b96" stroke-width="3" fill="none" opacity=".6"/>
    <!-- setas de dentro para fora -->
    <g class="anim">${out.map(([x1, y1, x2, y2]) => `<path class="flowdash" d="M${x1 - (x1 > 120 ? 20 : -20)} ${y1 + 6} L${x2} ${y2}" stroke="${PAL.red}" stroke-width="1.4" fill="none" stroke-dasharray="3 3" marker-end="url(#arr)"/>`).join('')}
      <path class="flowdash" d="M164 40 C176 70 176 110 160 150" stroke="${PAL.blue}" stroke-width="1.4" fill="none" stroke-dasharray="3 3" marker-end="url(#arr)"/></g>
    <text x="214" y="40" text-anchor="middle" class="lbl s" style="font-size:8px">para fora</text><text x="26" y="40" text-anchor="middle" class="lbl s" style="font-size:8px">para fora</text>
    <text x="198" y="128" text-anchor="middle" class="lbl s" style="font-size:8px">de cima</text><text x="198" y="138" text-anchor="middle" class="lbl s" style="font-size:8px">para baixo</text>
    <text x="120" y="158" text-anchor="middle" class="lbl s" style="font-size:8.5px">dos órgãos para a pele</text>`, 'Gravura: figura humana com coração no peito e setas saindo de dentro para fora e descendo de cima para baixo');
  };

  /* ═══════════════ HISTÓRIA ═══════════════ */
  const history = {};
  const hp = (b, seed, lbl) => plate(340, 230, b, seed, lbl);
  /* Hipócrates: balança clássica em estilo de gravura (traço limpo, hachuras, sem tremido de lápis) */
  history.hipocrates = () => {
    const flame = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 0 C-10 0 -11 -12 -6 -20 C-4 -24 -5 -28 -3 -32 C0 -26 4 -26 3 -35 C9 -28 12 -18 9 -8 C8 -3 5 0 0 0Z" fill="${P('orange')}" class="ink thin"/>
      <path d="M0 -2 C-5 -2 -5 -9 -2 -14 C-1 -11 1 -11 1 -17 C4 -12 5 -7 3 -3 C2 -2 1 -2 0 -2Z" fill="${PAL.yellow}" opacity=".85"/></g>`;
    const crystal = (x, y, r) => `<g transform="translate(${x} ${y})" stroke="${PAL.blue}" stroke-linecap="round" fill="none">
      ${[0, 60, 120, 180, 240, 300].map(a => `<g transform="rotate(${a})"><path d="M0 0 V${-r}" stroke-width="1.3"/>
        <path d="M0 ${-r * .45} l${-r * .28} ${-r * .2} M0 ${-r * .45} l${r * .28} ${-r * .2} M0 ${-r * .72} l${-r * .2} ${-r * .14} M0 ${-r * .72} l${r * .2} ${-r * .14}" stroke-width=".8"/></g>`).join('')}
      <circle r="${r * .16}" stroke-width=".8" fill="${PAL.sky}"/></g>`;
    const chain = (x1, y1, x2, y2, o = 1) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="2.6 1.3" opacity="${o}" fill="none"/>`;
    const pan = cx => `${chain(cx, 76, cx, 138, .45)}${chain(cx, 76, cx - 29, 142)}${chain(cx, 76, cx + 29, 142)}
      <path d="M${cx - 30} 142 Q${cx - 28} 161 ${cx} 161 Q${cx + 28} 161 ${cx + 30} 142Z" fill="${P('gold')}" class="ink"/>
      <path d="M${cx - 30} 142 Q${cx - 28} 161 ${cx} 161 Q${cx + 28} 161 ${cx + 30} 142Z" fill="url(#p-shade)"/>
      <path d="M${cx - 26} 147 Q${cx - 18} 157 ${cx - 2} 158" class="ink thin" stroke="${PAL.white}" opacity=".7"/>
      <ellipse cx="${cx}" cy="142" rx="30" ry="4.5" fill="${P('ochre')}" class="ink"/>`;
    let key = '';
    for (let x = 136; x < 202; x += 9) key += `M${x} 208 v-6 h6 v4 h-3 v-2 `;
    return hp(`
    <ellipse cx="170" cy="212" rx="58" ry="3" fill="url(#p-shade)"/>
    <!-- pedestal e coluna -->
    <rect x="132" y="200" width="76" height="10" fill="${P('cream')}" class="ink"/><rect x="194" y="200" width="14" height="10" fill="url(#p-shade)"/>
    <path d="${key}" class="ink thin" opacity=".75"/>
    <rect x="146" y="194" width="48" height="6" fill="${P('cream')}" class="ink"/>
    <rect x="157" y="189" width="26" height="5" rx="2.5" fill="${P('cream')}" class="ink"/>
    <rect x="162" y="86" width="16" height="103" fill="${P('cream')}" class="ink"/><rect x="173" y="86" width="5" height="103" fill="url(#p-shade)"/>
    <path d="M165.2 88 V187 M168.4 88 V187 M171.6 88 V187 M174.8 88 V187" class="ink thin" opacity=".55"/>
    <rect x="160" y="83" width="20" height="3" fill="${P('cream')}" class="ink thin"/>
    <path d="M155 80 Q170 86 185 80" fill="${P('cream')}" class="ink thin"/>
    <path d="M158 84 m-3 0 a3 3 0 1 1 3 3 a1.6 1.6 0 1 1 -1.6 -1.6 M182 84 m3 0 a3 3 0 1 0 -3 3 a1.6 1.6 0 1 0 1.6 -1.6" class="ink thin"/>
    <rect x="153" y="76" width="34" height="4" fill="${P('cream')}" class="ink"/>
    <path d="M165 76 L170 69 L175 76Z" fill="${P('ochre')}" class="ink thin"/>
    <!-- fiel e escala -->
    <path d="M163.2 47.2 A20 20 0 0 1 176.8 47.2" class="ink thin"/>
    ${[-110, -100, -90, -80, -70].map(a => { const r = Math.PI * a / 180; return `<path d="M${170 + 20 * Math.cos(r)} ${66 + 20 * Math.sin(r)} L${170 + 23 * Math.cos(r)} ${66 + 23 * Math.sin(r)}" class="ink thin"/>`; }).join('')}
    <path d="M170 62 L168.8 58 L170 47 L171.2 58Z" fill="${INK}"/>
    <!-- travessão -->
    <path d="M72 64.6 Q170 60 268 64.6 L268 67.4 Q170 72 72 67.4Z" fill="${P('gold')}" class="ink"/>
    <circle cx="170" cy="66" r="5.5" fill="${P('gold')}" class="ink"/><circle cx="170" cy="66" r="1.6" fill="${INK}"/>
    <circle cx="72" cy="66" r="3" fill="${P('gold')}" class="ink thin"/><circle cx="268" cy="66" r="3" fill="${P('gold')}" class="ink thin"/>
    <path d="M72 69 V73.5 M268 69 V73.5" class="ink thin"/><circle cx="72" cy="75" r="1.8" class="ink thin" fill="none"/><circle cx="268" cy="75" r="1.8" class="ink thin" fill="none"/>
    <!-- pratos -->
    ${pan(72)}${pan(268)}
    ${flame(60, 141, .95)}${crystal(87, 125, 13)}
    ${flame(255, 141, .9)}${flame(281, 141, .9)}
    <text x="72" y="182" text-anchor="middle" class="lbl">contraria contrariis</text>
    <text x="72" y="196" text-anchor="middle" class="lbl s">cura pelos contrários</text>
    <text x="268" y="182" text-anchor="middle" class="lbl">similia similibus</text>
    <text x="268" y="196" text-anchor="middle" class="lbl s">cura pelos semelhantes</text>`, 101, 'Balança clássica em equilíbrio: à esquerda fogo e gelo (cura pelos contrários), à direita fogo e fogo (cura pelos semelhantes)');
  };
  /* ---------- utilidades do estilo gravura ---------- */
  let gid = 0;
  const SH = d => `<path d="${d}" fill="url(#p-shade)"/>`;
  const XH = d => `<path d="${d}" fill="url(#p-cross)"/>`;
  const sphere = (x, y, r, col) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P(col)}" class="ink thin"/>
    <path d="M${x - r * .5} ${y + r * .866} A${r} ${r} 0 0 0 ${x + r} ${y} A${r * 1.25} ${r * 1.25} 0 0 1 ${x - r * .5} ${y + r * .866}Z" fill="url(#p-shade)"/>
    <ellipse cx="${x - r * .35}" cy="${y - r * .38}" rx="${r * .24}" ry="${r * .14}" fill="${PAL.white}" opacity=".9" transform="rotate(-35 ${x - r * .35} ${y - r * .38})"/>`;
  /* sulcos sinuosos (cérebro, noz): pequenas curvas em C e S, recortadas numa forma */
  const gyri = (x0, x1, y0, y1, seed, clip, sp = 8) => {
    const r = rng(seed); let d = '';
    for (let y = y0; y < y1; y += sp) for (let x = x0 + (Math.round(y / sp) % 2) * sp / 2; x < x1; x += sp) {
      const px = x + (r() - .5) * 4, py = y + (r() - .5) * 4, a = r() * 6.283, L = 7 + r() * 5, c = Math.cos(a), sn = Math.sin(a), b = (r() < .5 ? 1 : -1) * (3 + r() * 3);
      const ex = px + c * L, ey = py + sn * L;
      if (r() < .5) d += `M${px.toFixed(1)} ${py.toFixed(1)} Q${(px + c * L / 2 - sn * b * 1.6).toFixed(1)} ${(py + sn * L / 2 + c * b * 1.6).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} `;
      else d += `M${px.toFixed(1)} ${py.toFixed(1)} C${(px + c * L * .3 - sn * b).toFixed(1)} ${(py + sn * L * .3 + c * b).toFixed(1)} ${(px + c * L * .7 + sn * b).toFixed(1)} ${(py + sn * L * .7 - c * b).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} `;
    }
    return `<path d="${d}" class="ink thin" fill="none" opacity=".75" clip-path="url(#${clip})"/>`;
  };
  /* folha com nervuras */
  const leafV = (x, y, l, rot, col = 'leaf') => {
    const w = l * .3; let v = '';
    [.2, .36, .52, .68, .82].forEach(t => { v += `M${l * t} 0 q${l * .07} ${-w * .5} ${l * .16} ${-w * .78} M${l * t} 0 q${l * .07} ${w * .5} ${l * .16} ${w * .78} `; });
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M0 0 C${l * .25} ${-w} ${l * .72} ${-w} ${l} 0 C${l * .72} ${w} ${l * .25} ${w} 0 0Z" fill="${P(col)}" class="ink thin"/>
      <path d="M0 0 C${l * .25} ${w} ${l * .72} ${w} ${l} 0 L0 0Z" fill="url(#p-shade)"/>
      <path d="M0 0 H${l * .96} ${v}" class="ink thin" stroke-width=".55"/></g>`;
  };
  /* linhas de texto tipográfico */
  const textLines = (x, y0, w, n, seed, gap = 7) => {
    const r = rng(seed); let d = '';
    for (let i = 0; i < n; i++) {
      const y = y0 + i * gap, last = i === n - 1 || r() < .12; let cx = x + (i === 0 || r() < .1 ? 8 : 0); const end = last ? x + w * (.35 + r() * .4) : x + w;
      while (cx < end - 3) { const ww = Math.min(4 + r() * 12, end - cx); d += `M${cx.toFixed(1)} ${y} h${ww.toFixed(1)} `; cx += ww + 2.5; }
    }
    return `<path d="${d}" stroke="${INK}" stroke-width="1.1" opacity=".55" fill="none"/>`;
  };

  history.paracelso = () => {
    const a = 'hc' + (++gid), b = 'hc' + (++gid), c = 'hc' + (++gid);
    return hp(`<defs>
      <clipPath id="${a}"><path d="M100 76 C70 76 56 96 56 124 C56 150 72 172 97 172 Z"/></clipPath>
      <clipPath id="${b}"><path d="M103 76 C130 76 144 96 144 124 C144 150 128 172 103 172 Z"/></clipPath>
      <clipPath id="${c}"><path d="M245 72 A42 50 0 0 0 245 172Z M248 72 A42 50 0 0 1 248 172Z"/></clipPath></defs>
    <text x="170" y="54" text-anchor="middle" class="lbl s">dosis sola facit venenum</text>
    <ellipse cx="100" cy="189" rx="52" ry="2.6" fill="url(#p-shade)"/><ellipse cx="246" cy="177" rx="48" ry="2.4" fill="url(#p-shade)"/>
    <!-- noz em corte -->
    <path d="M100 62 C62 62 42 90 42 124 C42 160 66 186 100 186 C134 186 158 160 158 124 C158 90 138 62 100 62Z" fill="${P('brown')}" class="ink"/>
    ${XH('M100 62 C62 62 42 90 42 124 C42 160 66 186 100 186 C134 186 158 160 158 124 C158 90 138 62 100 62Z')}
    <path d="M100 70 C68 70 50 94 50 124 C50 154 70 178 100 178 C130 178 150 154 150 124 C150 94 132 70 100 70Z" fill="${P('cream')}" class="ink thin"/>
    <path d="M100 76 C70 76 56 96 56 124 C56 150 72 172 97 172 Z M103 76 C130 76 144 96 144 124 C144 150 128 172 103 172 Z" fill="${P('ochre')}" class="ink thin"/>
    ${gyri(52, 150, 78, 176, 5, a, 7)}${gyri(52, 150, 78, 176, 9, b, 7)}
    <path d="M118 80 C140 92 146 124 140 150 C134 164 124 172 106 174 L106 80Z" fill="url(#p-shade)" opacity=".8"/>
    <path d="M98 70 V178 M102 70 V178" class="ink thin"/><path d="M98 70 H102 V178 H98Z" fill="${P('brown')}"/>
    <!-- cérebro visto de cima -->
    <path d="M245 72 A42 50 0 0 0 245 172Z" fill="${P('rose')}" class="ink"/><path d="M248 72 A42 50 0 0 1 248 172Z" fill="${P('rose')}" class="ink"/>
    ${gyri(200, 294, 70, 176, 21, c, 7)}
    <path d="M264 76 C284 86 292 108 290 128 C288 150 278 164 256 171 L252 74Z" fill="url(#p-shade)" opacity=".8"/>
    <text x="173" y="130" text-anchor="middle" style="font:22px var(--fell);fill:${INK}">≈</text>
    <text x="100" y="204" text-anchor="middle" class="lbl">noz em corte</text>
    <text x="246" y="204" text-anchor="middle" class="lbl">cérebro, vista superior</text>`, 113, 'Gravura: noz cortada ao meio ao lado de um cérebro visto de cima, semelhantes na forma');
  };

  history.quina = () => {
    const fl = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 V-8" class="ink thin" stroke-width=".6"/>
      <path d="M-1.6 -6 L-1.2 -12 L1.2 -12 L1.6 -6Z" fill="${P('pink')}" class="ink thin" stroke-width=".5"/>
      ${[0, 72, 144, 216, 288].map(a => `<path transform="translate(0 -12.5) rotate(${a})" d="M0 0 C1.5 -1.2 1.5 -3.6 0 -4.6 C-1.5 -3.6 -1.5 -1.2 0 0Z" fill="${P('rose')}" class="ink thin" stroke-width=".45"/>`).join('')}</g>`;
    const rc = 'hc' + (++gid); const r = rng(31);
    let cells = '';
    [[250, 72, 0], [282, 80, 1], [262, 102, 0], [240, 98, 0], [286, 108, 0], [266, 60, 0]].forEach(([x, y, inf]) => {
      cells += `<ellipse cx="${x}" cy="${y}" rx="10" ry="9" fill="${P('red')}" class="ink thin"/><ellipse cx="${x}" cy="${y}" rx="4.6" ry="4" fill="${PAL.rose}" opacity=".7"/>`;
      if (inf) cells += `<circle cx="${x + 2}" cy="${y - 1}" r="3.4" fill="none" stroke="${PAL.purple}" stroke-width="1.3"/><circle cx="${x + 5}" cy="${y - 2.6}" r="1.4" fill="${PAL.purple}"/>`;
    });
    let bark = '';
    for (let i = 0; i < 7; i++) bark += `M${8 + i * 11} ${-14 - i * .7 + r() * 3} l${4 + r() * 4} ${1 + r() * 2} `;
    return hp(`<defs><clipPath id="${rc}"><circle cx="264" cy="86" r="31"/></clipPath></defs>
    <!-- ramo de Cinchona -->
    <path d="M36 204 C58 164 92 116 150 70" class="ink" stroke-width="1.6"/>
    ${leafV(56, 172, 46, -158, 'green')}${leafV(58, 170, 44, -28, 'leaf')}
    ${leafV(82, 136, 42, -165, 'leaf')}${leafV(84, 134, 40, -18, 'green')}
    ${leafV(110, 104, 36, -170, 'green')}${leafV(112, 102, 34, -8, 'leaf')}
    ${leafV(134, 82, 26, -175, 'leaf')}${leafV(136, 80, 24, 8, 'green')}
    <path d="M150 70 l6 -8 M150 70 l-4 -10 M150 70 l12 -2 M156 62 l8 -6" class="ink thin" stroke-width=".6"/>
    ${fl(156, 62, 20)}${fl(146, 60, -25)}${fl(162, 68, 70)}${fl(164, 56, 45)}${fl(152, 52, 0)}${fl(140, 64, -60)}
    <!-- campo do microscópio -->
    <circle cx="264" cy="86" r="34" fill="none" class="ink" stroke-width="2.2"/>
    <circle cx="264" cy="86" r="31" fill="${PAL.white}" class="ink thin"/>
    <g clip-path="url(#${rc})">${cells}</g>
    <path d="M240 108 A31 31 0 0 0 292 98" fill="none" stroke="${INK}" stroke-width="3" opacity=".15"/>
    <text x="264" y="134" text-anchor="middle" class="lbl s">hemácia com plasmódio</text>
    <!-- casca enrolada -->
    <ellipse cx="244" cy="188" rx="54" ry="2.6" fill="url(#p-shade)"/>
    <g transform="translate(196 168) rotate(-4)">
      <path d="M0 -16 L92 -20 A9 17 0 0 1 92 14 L0 18Z" fill="${P('brown')}" class="ink"/>
      <path d="M0 4 L92 2 A9 17 0 0 1 92 14 L0 18Z" fill="url(#p-cross)"/>
      <path d="${bark}" class="ink thin" opacity=".7"/><path d="M6 -6 L88 -9 M8 8 L86 6" class="ink thin" opacity=".45"/>
      <ellipse cx="0" cy="1" rx="9" ry="17" fill="${P('orange')}" class="ink thin"/>
      <path d="M0 1 m0 -11 a7 11 0 1 0 6 6 a4.5 7 0 1 0 -4 -4 a2.4 3.6 0 1 0 2 2" class="ink thin" fill="none"/></g>
    <text x="104" y="210" text-anchor="middle" class="lbl">Cinchona officinalis</text>
    <text x="244" y="210" text-anchor="middle" class="lbl s">casca: fonte da quinina</text>`, 127, 'Gravura botânica: ramo de quina, casca enrolada e hemácia com o parasita da malária');
  };

  history.organon = () => hp(`
    <ellipse cx="170" cy="204" rx="140" ry="4" fill="url(#p-shade)"/>
    <path d="M36 78 L36 198 Q104 186 170 204 Q236 186 304 198 L304 78 Q236 66 170 84 Q104 66 36 78Z" fill="${P('brown')}" class="ink"/>
    ${[6, 4, 2].map(o => `<path d="M${42 - o / 2} ${190 + o} Q104 ${178 + o} 168 ${196 + o} M${298 + o / 2} ${190 + o} Q236 ${178 + o} 172 ${196 + o}" class="ink thin" opacity=".55"/>`).join('')}
    <path d="M42 74 Q106 62 168 82 L168 194 Q106 176 42 188Z" fill="${PAL.white}" class="ink thin"/>
    <path d="M172 82 Q234 62 298 74 L298 188 Q234 176 172 194Z" fill="${PAL.white}" class="ink thin"/>
    ${SH('M154 78 Q162 79 168 82 L168 194 Q162 190 154 188Z')}${SH('M172 82 Q178 79 184 78 L184 188 Q178 190 172 194Z')}
    <text x="104" y="102" text-anchor="middle" style="font:15px var(--sc);letter-spacing:1.6px;fill:${INK}">ORGANON</text>
    <text x="104" y="115" text-anchor="middle" style="font:italic 9px var(--fell);fill:${INK}">der rationellen Heilkunde</text>
    <path d="M84 123 H124 M98 126.5 H110" class="ink thin"/>
    <text x="104" y="138" text-anchor="middle" style="font:italic 7.5px var(--fell);fill:${INK}">von</text>
    <text x="104" y="149" text-anchor="middle" style="font:10px var(--sc);letter-spacing:.6px;fill:${INK}">Samuel Hahnemann</text>
    <g transform="translate(104 160)"><path d="M-10 0 C-5 -4 -2 4 0 0 C2 -4 5 4 10 0 M0 -3 V3" class="ink thin"/></g>
    <text x="104" y="176" text-anchor="middle" style="font:8px var(--fell);letter-spacing:.8px;fill:${INK}">DRESDEN · 1810</text>
    <text x="236" y="94" text-anchor="middle" style="font:10px var(--sc);fill:${INK}">§ 1.</text>
    ${textLines(190, 104, 94, 11, 41)}
    <path d="M262 68 L262 214 L267 207 L272 214 L272 70" fill="${P('red')}" class="ink thin"/>`, 139, 'Gravura do livro Organon aberto na folha de rosto, de Samuel Hahnemann, 1810');

  history.navio = () => {
    const sail = (x, y, wTop, wBot, h) => `<path d="M${x - wTop / 2} ${y} L${x + wTop / 2} ${y} Q${x + wBot / 2 + 3} ${y + h / 2} ${x + wBot / 2} ${y + h} L${x - wBot / 2} ${y + h} Q${x - wBot / 2 + 3} ${y + h / 2} ${x - wTop / 2} ${y}Z" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/>
      <path d="M${x + wBot / 2 - 4} ${y + 2} Q${x + wBot / 2 + 1} ${y + h / 2} ${x + wBot / 2 - 2} ${y + h - 1} L${x + wBot / 2 - 6} ${y + h - 1} Q${x + wBot / 2 - 4} ${y + h / 2} ${x + wBot / 2 - 7} ${y + 2}Z" fill="url(#p-shade)"/>
      <path d="M${x - wTop / 2 - 2} ${y} H${x + wTop / 2 + 2}" stroke="${INK}" stroke-width="1.1"/>`;
    let sea = ''; const r = rng(57);
    for (let i = 0; i < 6; i++) { const y = 176 + i * 4; let x = 14 + r() * 20; while (x < 320) { const w = 10 + r() * 34; sea += `M${x.toFixed(1)} ${y} h${Math.min(w, 326 - x).toFixed(1)} `; x += w + 4 + r() * 10 + i; } }
    let sky = ''; for (let i = 0; i < 4; i++) sky += `M${150 + i * 9} ${84 + i * 4} h${40 - i * 9} `;
    return hp(`
    <path d="${sky}" class="ink thin" opacity=".4"/>
    <path d="M160 70 q5 -4 10 0 q5 -4 10 0 M296 104 q4 -3 8 0 q4 -3 8 0" class="ink thin"/>
    <!-- Pão de Açúcar e Urca -->
    <path d="M200 172 C204 120 220 70 244 64 C268 60 280 110 288 172Z" fill="${P('leaf')}" class="ink"/>
    ${SH('M246 66 C266 64 278 110 288 172 L258 172 C258 130 256 90 246 66Z')}
    <path d="M222 120 q8 -6 12 4 M236 92 q6 -3 9 3 M228 150 q10 -8 16 2" class="ink thin" opacity=".6"/>
    <path d="M166 172 C172 152 190 138 210 140 C232 142 248 158 252 172Z" fill="${P('green')}" class="ink"/>
    ${SH('M214 141 C234 144 248 158 252 172 L226 172 C226 160 222 148 214 141Z')}
    <path d="M300 172 C304 160 314 154 326 154 L326 172Z" fill="${P('green')}" class="ink thin"/>
    <path d="M12 172 H328" class="ink thin"/>
    <path d="${sea}" stroke="${PAL.blue}" stroke-width=".8" opacity=".7" fill="none"/>
    <g class="anim"><g class="boat">
      <path d="M40 160 L156 160 Q152 176 136 182 L66 182 Q50 176 40 160Z" fill="${P('brown')}" stroke="${INK}"/>
      ${XH('M44 166 L152 166 Q148 176 136 182 L66 182 Q52 176 44 166Z')}
      <path d="M42 164 H154" stroke="${INK}" stroke-width=".6"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${60 + i * 15}" y="168" width="4" height="3" fill="${INK}"/>`).join('')}
      <path d="M156 160 L188 142" stroke="${INK}" stroke-width="1.4"/>
      <path d="M82 160 V66 M120 160 V74" stroke="${INK}" stroke-width="1.8"/>
      <path d="M82 66 L44 160 M82 66 L150 160 M120 74 L156 160 M120 74 L188 142 M82 92 L120 98" stroke="${INK}" stroke-width=".45" opacity=".7"/>
      ${sail(82, 76, 16, 22, 18)}${sail(82, 98, 26, 32, 24)}${sail(82, 126, 36, 40, 28)}
      ${sail(120, 84, 14, 20, 16)}${sail(120, 104, 24, 30, 22)}${sail(120, 130, 32, 36, 24)}
      <path d="M124 92 L182 144 L128 140Z" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/>
      <path d="M82 66 l14 3 l-14 4z" fill="${PAL.red}" stroke="${INK}" stroke-width=".5"/></g>
      <path class="waves" d="M-80 188 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="${PAL.blue}" stroke-width="1.1"/></g>
    ${lab(242, 66, 214, 54, 'Pão de Açúcar', 'end').replace('class="lbl"', 'class="lbl s"')}
    <text x="170" y="210" text-anchor="middle" class="lbl s">baía de Guanabara, Rio de Janeiro</text>`, 151, 'Gravura de um veleiro chegando à baía de Guanabara, com o Pão de Açúcar ao fundo');
  };

  history.colera = () => {
    const mc = 'hc' + (++gid); const r = rng(77); let bugs = '', dots = '';
    for (let i = 0; i < 11; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 42, x = 236 + Math.cos(a) * d, y = 110 + Math.sin(a) * d;
      bugs += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)})"><path d="M-9 3 C-8 -5 5 -7 9 -1 C5 -3.4 -4 -2 -6 4.4Z" fill="${P('red')}" class="ink thin" stroke-width=".6"/><path d="M9 -1 c4 3 7 -3 11 0 s5 2 7 0" class="ink thin" stroke-width=".5" fill="none"/></g>`; }
    for (let i = 0; i < 70; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 52; dots += `<circle cx="${(236 + Math.cos(a) * d).toFixed(1)}" cy="${(110 + Math.sin(a) * d).toFixed(1)}" r=".55" fill="${INK}" opacity=".45"/>`; }
    return hp(`<defs><clipPath id="${mc}"><circle cx="236" cy="110" r="56"/></clipPath></defs>
    <ellipse cx="92" cy="192" rx="44" ry="2.4" fill="url(#p-shade)"/>
    <!-- bomba de ferro fundido -->
    <path d="M66 182 h52 v8 h-52z" fill="${P('gray')}" class="ink"/>${SH('M104 182 h14 v8 h-14z')}
    <path d="M72 174 h40 v8 h-40z" fill="${P('gray')}" class="ink"/>
    <path d="M78 76 L106 76 L104 174 L80 174Z" fill="${P('gray')}" class="ink"/>
    ${XH('M96 76 L106 76 L104 174 L96 174Z')}
    <path d="M84 84 V168 M89 84 V168 M94 84 V168" class="ink thin" opacity=".5"/>
    <rect x="75" y="108" width="34" height="5" fill="${P('gray')}" class="ink thin"/><rect x="76" y="148" width="32" height="5" fill="${P('gray')}" class="ink thin"/>
    <path d="M74 76 h36 l-4 -8 h-28z" fill="${P('gray')}" class="ink"/>
    <path d="M80 68 C80 54 104 54 104 68Z" fill="${P('gray')}" class="ink"/>${SH('M94 56 C102 58 104 62 104 68 L94 68Z')}
    <path d="M92 56 V48" class="ink"/><circle cx="92" cy="46" r="3" fill="${P('gray')}" class="ink thin"/>
    <path d="M106 96 C120 92 136 82 150 70" class="ink" stroke-width="3.2"/><circle cx="151" cy="69" r="3.6" fill="${P('gray')}" class="ink thin"/>
    <circle cx="106" cy="96" r="3" fill="${P('gray')}" class="ink thin"/>
    <path d="M78 122 H62 C54 122 50 128 50 136 V146 H44 V134 C44 122 52 114 62 114 H78Z" fill="${P('gray')}" class="ink"/>
    <g class="anim"><path class="drip" d="M47 150 c-2 5 -4 8 -4 10 a4 4 0 0 0 8 0 c0 -2 -2 -5 -4 -10z" fill="${PAL.sky}" stroke="${INK}" stroke-width=".6"/></g>
    <!-- campo do microscópio -->
    <circle cx="236" cy="110" r="60" fill="none" class="ink" stroke-width="2.4"/>
    <circle cx="236" cy="110" r="56" fill="${PAL.white}" class="ink thin"/>
    <g clip-path="url(#${mc})">${dots}${bugs}</g>
    <path d="M196 150 A56 56 0 0 0 290 130" fill="none" stroke="${INK}" stroke-width="5" opacity=".1"/>
    <text x="92" y="206" text-anchor="middle" class="lbl s">bomba da Broad Street, 1854</text>
    <text x="236" y="188" text-anchor="middle" class="lbl">Vibrio cholerae</text>
    <text x="236" y="201" text-anchor="middle" class="lbl s">ao microscópio</text>`, 163, 'Gravura da bomba d’água da Broad Street, em Londres, e das bactérias do cólera ao microscópio');
  };

  history.penicilina = () => {
    const r = rng(19); let col = '', hy = '';
    for (let i = 0; i < 40; i++) {
      const a = r() * 6.283, d = .3 + r() * .62, x = 170 + Math.cos(a) * 112 * d, y = 122 + Math.sin(a) * 52 * d;
      const k = Math.hypot((x - 124) / 46, (y - 116) / 26); if (k < 1.05) continue;
      const s = k < 1.35 ? 1.6 + r() : 2.6 + r() * 2.6, o = k < 1.35 ? .45 : 1;
      col += `<g opacity="${o}"><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${s.toFixed(1)}" ry="${(s * .62).toFixed(1)}" fill="${P('ochre')}" class="ink thin" stroke-width=".6"/><ellipse cx="${(x - s * .3).toFixed(1)}" cy="${(y - s * .2).toFixed(1)}" rx="${(s * .3).toFixed(1)}" ry="${(s * .16).toFixed(1)}" fill="${PAL.white}" opacity=".8"/></g>`;
    }
    for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283 + r() * .1, r1 = 15 + r() * 2, r2 = 19 + r() * 4; hy += `M${(124 + Math.cos(a) * r1).toFixed(1)} ${(116 + Math.sin(a) * r1 * .6).toFixed(1)} L${(124 + Math.cos(a) * r2).toFixed(1)} ${(116 + Math.sin(a) * r2 * .6).toFixed(1)} `; }
    return hp(`
    <ellipse cx="170" cy="190" rx="124" ry="5" fill="url(#p-shade)"/>
    <path d="M46 122 V132 A124 58 0 0 0 294 132 V122" fill="${P('sky')}" class="ink" opacity=".9"/>
    ${SH('M46 122 V132 A124 58 0 0 0 294 132 V122 A124 58 0 0 1 46 122Z')}
    <ellipse cx="170" cy="122" rx="124" ry="58" fill="${PAL.white}" class="ink"/>
    <ellipse cx="170" cy="123" rx="117" ry="53" fill="${P('yellow')}" opacity=".55" class="ink thin"/>
    <ellipse cx="124" cy="116" rx="44" ry="25" fill="${PAL.white}" opacity=".85" stroke="${INK}" stroke-width=".6" stroke-dasharray="2.5 2.5"/>
    <path d="${hy}" class="ink thin" stroke-width=".5"/>
    <ellipse cx="124" cy="116" rx="16" ry="9.6" fill="${P('teal')}" class="ink thin"/>
    <ellipse cx="124" cy="116" rx="9" ry="5.4" fill="${P('green')}" class="ink thin"/>
    ${SH('M124 106.4 A16 9.6 0 0 1 124 125.6 A10 9.6 0 0 0 124 106.4Z')}
    ${col}
    <path d="M70 92 A112 50 0 0 1 150 72" fill="none" stroke="${PAL.white}" stroke-width="3" opacity=".9"/>
    ${lab(122, 112, 66, 56, 'fungo Penicillium', 'start')}
    ${lab(160, 112, 300, 56, 'zona sem bactérias', 'end')}
    ${lab(232, 146, 296, 204, 'colônias de bactérias', 'end').replace('class="lbl"', 'class="lbl s"')}`, 189, 'Gravura de uma placa de Petri com o fungo Penicillium e uma zona sem bactérias ao redor');
  };

  history.agua = () => {
    const pts = []; const r = rng(4);
    for (let i = 0; i < 14; i++) pts.push([48 + (i % 5) * 60 + r() * 12, 66 + Math.floor(i / 5) * 48 + r() * 10]);
    let bonds = '';
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 72) bonds += `<path class="hb" style="animation-delay:${((i * 7 + j) % 10) * .23}s" d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${PAL.blue}" stroke-width="1.1" stroke-dasharray="1.6 3" stroke-linecap="round"/>`; }));
    const mols = pts.map(([x, y], i) => `<g class="mol" style="animation-delay:${i * .2}s;transform-origin:${x}px ${y}px">
      <path d="M${x} ${y} L${x - 11} ${y + 8} M${x} ${y} L${x + 11} ${y + 8}" stroke="${INK}" stroke-width="2.4"/>
      ${sphere(x - 11, y + 8, 5.6, 'white')}${sphere(x + 11, y + 8, 5.6, 'white')}${sphere(x, y, 9.5, 'red')}</g>`).join('');
    return hp(`<g class="anim">${bonds}${mols}</g>
      <text x="170" y="206" text-anchor="middle" class="lbl s">pontes de hidrogênio (···) duram ~1 trilionésimo de segundo</text>`, 177, 'Gravura de moléculas de água ligadas por pontes de hidrogênio');
  };

  function waterNet(w, h) {
    const pts = []; const r = rng(4);
    for (let i = 0; i < 14; i++) pts.push([40 + (i % 5) * 62 + r() * 18, 70 + Math.floor(i / 5) * 56 + r() * 16]);
    let bonds = '';
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 78) bonds += `<path class="hb" style="animation-delay:${((i * 7 + j) % 10) * .23}s" d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${PAL.blue}" stroke-width="1.6" stroke-dasharray="2 4"/>`; }));
    const mols = pts.map(([x, y], i) => `<g class="mol" style="animation-delay:${i * .2}s;transform-origin:${x}px ${y}px"><circle cx="${x}" cy="${y}" r="11" fill="${P('red')}" stroke="${INK}"/><circle cx="${x - 11}" cy="${y + 8}" r="6.5" fill="${P('white')}" stroke="${INK}"/><circle cx="${x + 11}" cy="${y + 8}" r="6.5" fill="${P('white')}" stroke="${INK}"/></g>`).join('');
    return `<g class="anim">${bonds}${mols}</g><text x="${w / 2}" y="${h - 22}" text-anchor="middle" class="lbl">as pontes (- - -) se desfazem e refazem em ~1 trilionésimo de segundo</text>`;
  }

  /* ═══════════════ CIÊNCIA — pranchas em estilo gravura ═══════════════
     Sem o filtro de lápis: traço nítido, hachuras e mais detalhe.
     Animações mantidas (sacudir, pontes de hidrogênio, curva, moléculas). */
  const science = {};
  const SW = 520;

  /* ─── 2 · Sacudir faz diferença? ─── */
  science.sucussao = () => {
    const cb = uid(), cv = uid(), sk = uid(), sk2 = uid(), cl = uid(), ch = uid(), gl = uid(), lt = uid();
    // grade 1:99 em gotas
    let grid = '';
    for (let i = 0; i < 100; i++) { const x = 330 + (i % 10) * 16, y = 74 + Math.floor(i / 10) * 15, on = i === 44;
      grid += `<path d="M${x} ${y - 5.5} c-2.6 4 -4.2 6 -4.2 7.6 a4.2 4.2 0 0 0 8.4 0 c0 -1.6 -1.6 -3.6 -4.2 -7.6z" fill="${on ? '#8a5fb0' : '#bcd9ec'}" stroke="${INK}" stroke-width="${on ? .8 : .4}"/>`; }
    const mini = (x, y, a) => `<path d="M${x - 3} ${y - 22} h6 v8 c6 3 8 7 8 11 a11 11 0 0 1 -22 0 c0 -4 2 -8 8 -11z" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/><path d="M${x - 10} ${y - 1} a11 9 0 0 0 20 0z" fill="#8a5fb0" opacity="${a}"/>`;

    /* ── mão direita segurando o frasco, vista pelas costas dos dedos ── */
    const VX = 150; // eixo do frasco
    // dedos: [topo, altura, x da ponta, x do nó]
    const F = [[112, 17, 131, 196], [129, 17, 129, 199], [146, 16, 131, 198], [162, 14, 136, 193]];
    const finger = ([y, h, xt, xk], i) => {
      const yb = y + h, sag = 3;
      const d = `M${xk} ${y + 1} C${xk - 20} ${y + sag + 1} ${xt + 26} ${y + sag} ${xt + 8} ${y} C${xt + 1} ${y} ${xt - 3} ${y + h * .35} ${xt - 2} ${y + h * .55} C${xt - 1} ${yb - 2} ${xt + 3} ${yb + sag * .4} ${xt + 10} ${yb + sag * .6} C${xt + 30} ${yb + sag + 1} ${xk - 20} ${yb + sag + 1} ${xk} ${yb}Z`;
      return `<path d="${d}" fill="url(#${sk})" stroke="${INK}" stroke-width="1"/>
        <path d="M${xt + 12} ${yb + sag * .6 - 1.4} C${xt + 30} ${yb + sag} ${xk - 22} ${yb + sag} ${xk - 4} ${yb - 1.2}" stroke="#b8775a" stroke-width="2.2" fill="none" opacity=".45"/>
        <path d="M${xt + 6} ${y + 3} C${xt + 22} ${y + 5.2} ${xk - 30} ${y + 5.4} ${xk - 14} ${y + 3.4}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5"/>
        <path d="M${xt + 24 + i} ${y + 3} c-2 ${h * .3} -2 ${h * .6} 0 ${h - 2} M${xt + 27 + i} ${y + 4} c-1.4 ${h * .3} -1.4 ${h * .55} 0 ${h - 4}" stroke="${INK}" stroke-width=".55" fill="none" opacity=".7"/>
        <path d="M${xk - 22} ${y + 3} c-2 ${h * .3} -2 ${h * .6} 0 ${h - 2}" stroke="${INK}" stroke-width=".5" fill="none" opacity=".55"/>`;
    };
    const lace = [...Array(9)].map((_, i) => { const t = i / 8, x = 228 + t * 34, y = 66 + t * 26; return `M${x.toFixed(1)} ${y.toFixed(1)} a3 3 0 0 0 -4.4 4.6`; }).join(' ');
    const ruff = [...Array(8)].map((_, i) => { const t = i / 7, x = 224 + t * 36, y = 70 + t * 28; return `M${x.toFixed(1)} ${y.toFixed(1)} q-6 2 -9 8`; }).join(' ');

    return plate(SW, 340, `<defs>
      <clipPath id="${cb}"><path d="M30 246 L196 214 L262 236 L96 270Z"/></clipPath>
      <clipPath id="${cv}"><rect x="${VX - 16}" y="66" width="32" height="140" rx="9"/></clipPath>
      <linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d9bf"/><stop offset=".55" stop-color="#eebf9b"/><stop offset="1" stop-color="#d99a76"/></linearGradient>
      <linearGradient id="${sk2}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3cfb1"/><stop offset="1" stop-color="#d5946f"/></linearGradient>
      <linearGradient id="${gl}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#eef4f8" stop-opacity=".6"/><stop offset=".8" stop-color="#dfe9f0" stop-opacity=".5"/><stop offset="1" stop-color="#b9cbd8" stop-opacity=".8"/></linearGradient>
      <linearGradient id="${lt}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c6a6dc"/><stop offset=".6" stop-color="#9a72bf"/><stop offset="1" stop-color="#6f4a93"/></linearGradient>
      <clipPath id="${cl}"><path d="M232 60 L294 20 L320 50 L262 92Z"/></clipPath>
      <clipPath id="${ch}"><path d="M188 98 C206 94 218 110 218 132 C218 158 208 176 188 182Z"/></clipPath></defs>

    <!-- mesa -->
    <path d="M14 286 H300" class="ink thin"/>${[...Array(6)].map((_, i) => `<path d="M${18 + i * 46} ${292 + (i % 2) * 6} c12 -3 24 3 36 0" class="ink thin" opacity=".35"/>`).join('')}
    <ellipse cx="146" cy="286" rx="132" ry="5" fill="url(#p-shade)"/>
    <!-- livro encadernado em couro -->
    <path d="M96 270 L262 236 L262 252 L96 286Z" fill="#f1e6cb" stroke="${INK}" stroke-width="1"/>
    ${[...Array(7)].map((_, i) => `<path d="M98 ${272.4 + i * 2} L260 ${238.4 + i * 2}" stroke="${INK}" stroke-width=".3" opacity=".55"/>`).join('')}
    <path d="M96 270 L262 236" stroke="${PAL.gold}" stroke-width="1.2"/>
    <path d="M30 246 L96 270 L96 286 L30 262Z" fill="#7a2f22" stroke="${INK}" stroke-width="1"/>
    ${[0, 1, 2, 3].map(i => `<path d="M${38 + i * 15} ${249 + i * 5.4} v15" stroke="#5a2016" stroke-width="3.4"/><path d="M${38 + i * 15} ${249 + i * 5.4} v15" stroke="${PAL.gold}" stroke-width="1"/>`).join('')}
    <path d="M30 246 L196 214 L262 236 L96 270Z" fill="#8e3b2c" stroke="${INK}" stroke-width="1.1"/>
    ${hatchIn(cb, 146, 242, 262, 270, 2.2, -20, .22)}
    <path d="M44 246 L192 218 L246 236 L98 264Z" fill="none" stroke="${PAL.gold}" stroke-width="1.2"/>
    <path d="M54 246 L190 221 L236 236 L100 259Z" fill="none" stroke="${PAL.gold}" stroke-width=".5"/>
    <g transform="translate(146 241) scale(1 .42) rotate(-14)">${flower(0, 0, 11, 10, 'gold', 'gold')}</g>
    <path d="M30 246 l14 -3 l-4 10z M262 236 l-14 -1 l5 -9z M96 270 l-10 -6 l12 -2z" fill="${PAL.gold}" stroke="${INK}" stroke-width=".5"/>

    <g class="anim"><g class="shake" style="transform-origin:${VX}px 240px">
      <!-- antebraço -->
      <path d="M192 98 C204 84 220 70 236 58 L264 86 C248 102 232 118 216 132 C214 116 206 102 192 98Z" fill="url(#${sk2})" stroke="${INK}" stroke-width="1"/>
      <path d="M212 104 C224 94 236 84 248 74" stroke="${INK}" stroke-width=".5" opacity=".4" fill="none"/>
      <!-- costas da mão -->
      <path d="M188 98 C206 94 218 110 218 132 C218 158 208 176 188 182Z" fill="url(#${sk2})" stroke="${INK}" stroke-width="1"/>
      ${hatchIn(ch, 206, 120, 220, 182, 2.8, -60, .14)}
      <path d="M196 112 c6 6 8 14 8 24 M198 150 c4 6 4 12 2 18" stroke="#b8775a" stroke-width=".8" fill="none" opacity=".6"/>
      <!-- frasco -->
      <rect x="${VX - 16}" y="66" width="32" height="140" rx="9" fill="url(#${gl})" stroke="${INK}" stroke-width="1.2"/>
      <g clip-path="url(#${cv})"><rect x="${VX - 16}" y="150" width="32" height="60" fill="url(#${lt})" opacity=".85"/>
        <path d="M${VX - 16} 150 q8 -4 16 0 t16 0" fill="none" stroke="#fff" stroke-width="1" opacity=".9"/>
        ${[[VX - 6, 196], [VX + 5, 186], [VX - 2, 178], [VX + 8, 200]].map(([x, y], i) => `<circle class="bub" style="animation-delay:${i * .3}s" cx="${x}" cy="${y}" r="1.6" fill="#fff" fill-opacity=".7" stroke="${INK}" stroke-width=".25"/>`).join('')}</g>
      <path d="M${VX - 10} 74 V198" stroke="#fff" stroke-width="3" opacity=".85" stroke-linecap="round"/><path d="M${VX + 11} 80 V196" stroke="#8aa4b6" stroke-width="1" opacity=".7"/>
      <rect x="${VX - 13}" y="50" width="26" height="18" rx="2" fill="${P('brown')}" stroke="${INK}" stroke-width="1"/>
      ${[54, 58, 62].map(y => `<path d="M${VX - 13} ${y} h26" stroke="${INK}" stroke-width=".35"/>`).join('')}
      <path d="M${VX - 15} 68 h30" stroke="${INK}" stroke-width="1.4"/>
      <rect x="${VX - 13}" y="76" width="26" height="24" fill="${PAL.cream}" stroke="${INK}" stroke-width=".6"/>
      <path d="M${VX - 11} 79 h22 M${VX - 11} 97 h22" stroke="${PAL.red}" stroke-width=".5"/>
      <text x="${VX}" y="92" text-anchor="middle" style="font:italic 9px var(--fell);fill:${INK}">1C</text>
      <!-- dedos (do mínimo ao indicador) -->
      ${F.slice().reverse().map((f, k) => finger(f, 3 - k)).join('')}
      <!-- polegar por cima do indicador -->
      <path d="M194 104 C182 96 160 96 142 102 C135 104 133 112 139 115 C152 118 176 116 196 114Z" fill="url(#${sk})" stroke="${INK}" stroke-width="1"/>
      <path d="M140 104 C136 106 136 112 141 113 C146 113 149 109 147 105 C145 103 142 103 140 104Z" fill="#f6e3d3" stroke="${INK}" stroke-width=".6"/>
      <path d="M160 101 c-1 4 -1 8 0 12" stroke="${INK}" stroke-width=".55" fill="none" opacity=".7"/>
      <path d="M146 100 C160 97 176 97 188 101" stroke="#fff" stroke-width="1.4" opacity=".55" fill="none"/>
      <!-- nós dos dedos -->
      ${F.map(([y, h, , xk]) => `<path d="M${xk - 2} ${y + 2} c4 ${h * .25} 4 ${h * .7} 0 ${h - 1}" stroke="${INK}" stroke-width=".6" fill="none"/>`).join('')}
      <!-- manga com punho de renda (séc. XVIII) -->
      <path d="M232 60 L294 20 C304 26 314 38 320 50 L262 92Z" fill="${PAL.white}" stroke="${INK}" stroke-width="1.1"/>
      ${hatchIn(cl, 290, 50, 320, 92, 2.4, -45, .28)}
      <path d="M248 52 L300 26 M256 66 L308 36 M262 78 L314 44" stroke="${INK}" stroke-width=".45" opacity=".45"/>
      <path d="${ruff}" stroke="${INK}" stroke-width=".8" fill="${PAL.white}"/>
      <path d="${lace}" stroke="${INK}" stroke-width=".7" fill="${PAL.white}"/>
      <path d="M232 60 L262 92" stroke="${PAL.gold}" stroke-width="2"/>
    </g>
    <path class="motion" d="M118 212 q-14 8 -8 22 M184 212 q14 8 8 22 M108 200 q-18 12 -10 32" fill="none" stroke="${INK}" stroke-width="1"/>
    <g class="impact"><path d="M128 222 l-10 -4 M130 228 l-12 2 M172 222 l10 -4 M170 228 l12 2" stroke="${PAL.red}" stroke-width="1.2"/></g></g>
    <text x="150" y="318" text-anchor="middle" class="lbl s">Hahnemann batia o frasco num livro de couro</text>
    <!-- 1 em 100 -->
    <text x="402" y="54" text-anchor="middle" class="lbl">1 gota + 99 gotas de água/álcool</text>
    ${grid}
    <text x="402" y="236" text-anchor="middle" class="lbl em">= 1C (uma “centesimal”)</text>
    ${mini(346, 290, .55)}${mini(402, 290, .25)}${mini(458, 290, .08)}
    <path d="M362 280 h20 M418 280 h20" stroke="${INK}" stroke-width=".8" marker-end="url(#arr)"/>
    <text x="372" y="274" text-anchor="middle" class="lbl s" style="font-size:8px">×100</text><text x="428" y="274" text-anchor="middle" class="lbl s" style="font-size:8px">×100</text>
    ${['1C', '2C', '3C'].map((t, i) => `<text x="${346 + i * 56}" y="306" text-anchor="middle" class="lbl s">${t}</text>`).join('')}
    <text x="402" y="322" text-anchor="middle" class="lbl s">e sacode a cada etapa</text>`, 211, 'Gravura: mão com manga de renda do século XVIII segurando um frasco e batendo-o num livro encadernado em couro; ao lado, 1 gota roxa entre 99 azuis e a sequência de diluições 1C, 2C e 3C');
  };

  /* ─── 3 · A água tem memória? ─── */
  function waterField(cx, cy, R, seed, n = 22) {
    const r = rng(seed), mols = [];
    for (let k = 0; k < 400 && mols.length < n; k++) {
      const a = r() * 6.283, d = Math.sqrt(r()) * (R - 16), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      if (mols.every(m => Math.hypot(m.x - x, m.y - y) > 30)) mols.push({ x, y, t: r() * 6.283 });
    }
    const ang = 52.25 * Math.PI / 180, L = 11;
    mols.forEach(m => { m.h = [[m.x + Math.cos(m.t - ang) * L, m.y + Math.sin(m.t - ang) * L], [m.x + Math.cos(m.t + ang) * L, m.y + Math.sin(m.t + ang) * L]]; });
    let bonds = '', k = 0;
    mols.forEach((m, i) => m.h.forEach(([hx, hy]) => {
      let best = null, bd = 34; mols.forEach((o, j) => { if (j !== i) { const dd = Math.hypot(o.x - hx, o.y - hy); if (dd < bd) { bd = dd; best = o; } } });
      if (best) bonds += `<path class="hb" style="animation-delay:${((k++ * 7) % 11) * .21}s" d="M${hx.toFixed(1)} ${hy.toFixed(1)} L${best.x.toFixed(1)} ${best.y.toFixed(1)}" stroke="${PAL.blue}" stroke-width="1.2" stroke-dasharray="1.4 2.6" stroke-linecap="round"/>`;
    }));
    const atoms = mols.map((m, i) => `<g class="mol" style="animation-delay:${(i * .17).toFixed(2)}s;transform-origin:${m.x.toFixed(1)}px ${m.y.toFixed(1)}px">
      ${m.h.map(([hx, hy]) => `<path d="M${m.x.toFixed(1)} ${m.y.toFixed(1)} L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="${INK}" stroke-width="2.2"/>`).join('')}
      ${m.h.map(([hx, hy]) => sphere(+hx.toFixed(1), +hy.toFixed(1), 4.6, 'white')).join('')}${sphere(+m.x.toFixed(1), +m.y.toFixed(1), 8, 'red')}</g>`).join('');
    return { svg: bonds + atoms, mols };
  }
  science.agua = () => {
    const cz = uid(), cd = uid();
    const W = waterField(338, 160, 118, 4);
    const m0 = W.mols[0];
    return plate(SW, 330, `<defs><clipPath id="${cz}"><circle cx="338" cy="160" r="116"/></clipPath>${grad(cd, [[0, '#e6f2fa', 1], [1, '#93bfe0', 1]])}</defs>
    <!-- gota d'água -->
    <ellipse cx="88" cy="252" rx="44" ry="4" fill="url(#p-shade)"/>
    <path d="M88 110 C70 150 48 178 48 206 a40 40 0 0 0 80 0 C128 178 106 150 88 110Z" fill="url(#${cd})" stroke="${INK}" stroke-width="1.3"/>
    <path d="M66 196 C64 180 72 166 80 156" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M110 220 C112 210 112 200 108 192" stroke="#4f78b8" stroke-width="1.2" fill="none" opacity=".6"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${98 + i * 3} ${230 - i * 6} c4 -2 6 -6 6 -10" stroke="${INK}" stroke-width=".4" fill="none" opacity=".4"/>`).join('')}
    <circle cx="100" cy="200" r="7" fill="none" stroke="${INK}" stroke-width=".8"/>
    <path d="M104 194 L232 72 M104 206 L240 252" class="lead" stroke-dasharray="3 3"/>
    <text x="88" y="276" text-anchor="middle" class="lbl s">uma gota tem</text><text x="88" y="287" text-anchor="middle" class="lbl s">~1,7 sextilhão de moléculas</text>
    <!-- campo ampliado -->
    <circle cx="338" cy="160" r="122" fill="${PAL.white}" stroke="${INK}" stroke-width="2.4"/>
    <g clip-path="url(#${cz})"><circle cx="338" cy="160" r="118" fill="#eef6fb"/><g class="anim">${W.svg}</g></g>
    <circle cx="338" cy="160" r="118" fill="none" stroke="${PAL.gold}" stroke-width="3" opacity=".6"/>
    <path d="M260 254 A118 118 0 0 0 440 232" fill="none" stroke="${INK}" stroke-width="5" opacity=".08"/>
    <!-- legendas -->
    ${labc(m0.x, m0.y, 196, 64, ['molécula de água', 'H₂O · ângulo de 104,5°'], 'lbl s')}
    <text x="338" y="300" text-anchor="middle" class="lbl s">pontes de hidrogênio (· · ·): se desfazem e refazem</text>
    <text x="338" y="312" text-anchor="middle" class="lbl s">em cerca de 1 trilionésimo de segundo</text>`, 223, 'Gravura: gota de água e, ampliadas, moléculas de água ligadas por pontes de hidrogênio que piscam');
  };

  /* ─── 4 · A curva natural de um resfriado ─── */
  science.curva = () => {
    const d = 'M60 246 C90 238 112 128 152 104 C184 86 206 120 236 160 C276 212 340 236 480 240';
    const area = d + ' L480 252 L60 252Z';
    const ca = uid();
    let grid = ''; for (let i = 1; i <= 10; i++) grid += `M${60 + i * 42} 70 V252 `; for (let j = 0; j < 5; j++) grid += `M60 ${80 + j * 36} H486 `;
    return plate(SW, 320, `<defs><clipPath id="${ca}"><path d="${area}"/></clipPath></defs>
    <path d="${grid}" stroke="${PAL.sky}" stroke-width=".5" opacity=".7" fill="none"/>
    <path d="${area}" fill="#f6d9d3" opacity=".7"/>${hatchIn(ca, 270, 160, 480, 252, 3, -40, .25)}
    <path d="M60 60 V252 H494" class="ink" stroke-width="1.3" marker-end="url(#arr)"/>
    <path d="M60 60 l-4 8 h8z" fill="${INK}"/>
    ${[...Array(10)].map((_, i) => `<path d="M${60 + (i + 1) * 42} 252 v5" class="ink thin"/><text x="${60 + (i + 1) * 42}" y="268" text-anchor="middle" class="lbl s">${i + 1}</text>`).join('')}
    <path d="${d}" fill="none" stroke="${PAL.red}" stroke-width="3.2" stroke-linecap="round" class="drawline" pathLength="1"/>
    <g class="anim"><circle class="rider" r="5" fill="${PAL.white}" stroke="${PAL.red}" stroke-width="2" style="offset-path:path('${d}')"/></g>
    <!-- momento em que tomou algo -->
    <path d="M152 104 V74" class="lead" stroke-dasharray="3 3"/>
    <g transform="translate(152 66)"><rect x="-14" y="-7" width="28" height="14" rx="7" fill="${P('violet')}" stroke="${INK}" stroke-width=".8"/><path d="M0 -7 V7" stroke="${INK}" stroke-width=".6"/><path d="M-10 -3 a6 4 0 0 1 6 -3" stroke="#fff" fill="none"/></g>
    <text x="172" y="70" class="lbl">tomou algo aqui, no pior momento…</text>
    <text x="300" y="170" class="lbl">… e melhorou de qualquer jeito:</text><text x="300" y="183" class="lbl s">é o caminho natural do resfriado</text>
    <!-- termômetro no pico e sol no fim -->
    <g transform="translate(120 128)"><rect x="-3" y="-26" width="6" height="30" rx="3" fill="${PAL.white}" stroke="${INK}" stroke-width=".7"/><rect x="-1.4" y="-16" width="2.8" height="18" fill="${PAL.red}"/><circle cy="6" r="5" fill="${PAL.red}" stroke="${INK}" stroke-width=".7"/>${[-20, -14, -8].map(y => `<path d="M3 ${y} h3" stroke="${INK}" stroke-width=".5"/>`).join('')}</g>
    <g transform="translate(452 206)"><circle r="10" fill="${P('yellow')}" stroke="${INK}" stroke-width=".8"/>${[...Array(10)].map((_, i) => `<path d="M${(Math.cos(i * .628) * 13).toFixed(1)} ${(Math.sin(i * .628) * 13).toFixed(1)} L${(Math.cos(i * .628) * 18).toFixed(1)} ${(Math.sin(i * .628) * 18).toFixed(1)}" stroke="${PAL.orange}" stroke-width="1.4"/>`).join('')}</g>
    <text x="270" y="290" text-anchor="middle" class="lbl s">dias de resfriado</text>
    <text x="56" y="56" text-anchor="end" class="lbl s">sintomas</text>`, 251, 'Gravura: gráfico com a curva natural de um resfriado, que sobe, chega ao pico e desce sozinha; uma pílula marca o pior momento');
  };

  /* ─── 5 · Ensaio duplo-cego ─── */
  science.duplocego = () => {
    const person = (x, coat, band, mirror = 1) => `<g transform="translate(${x} 0) scale(${mirror} 1)">
      <path d="M-40 250 C-40 196 -26 182 0 178 C26 182 40 196 40 250Z" fill="${P(coat)}" class="ink"/>
      ${SH('M14 182 C30 188 40 204 40 250 L22 250 C24 214 20 194 14 182Z')}
      <path d="M-8 178 L0 196 L8 178" fill="${PAL.white}" stroke="${INK}" stroke-width=".8"/>
      <rect x="-7" y="162" width="14" height="18" fill="${P('skin')}" stroke="${INK}" stroke-width=".8"/>
      <ellipse cx="0" cy="142" rx="22" ry="26" fill="${P('skin')}" class="ink"/>
      <path d="M-22 134 C-20 112 20 110 22 132 C14 122 -12 120 -22 134Z" fill="${P('brown')}" stroke="${INK}" stroke-width=".8"/>
      <path d="M-24 136 C-10 132 10 132 24 136 L24 148 C10 144 -10 144 -24 148Z" fill="${band}" stroke="${INK}" stroke-width=".8"/>
      <g class="flutter" style="transform-origin:24px 142px"><path d="M24 140 C34 140 40 148 46 152 M24 144 C32 150 34 158 40 164" stroke="${band}" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
      <path d="M-4 158 q4 3 8 0" class="ink thin"/><path d="M-22 142 c-4 0 -6 6 -2 8" class="ink thin"/></g>`;
    const big = (x, l) => `<g transform="translate(${x} 0)">${vial(0, 214, '#e9eef2', '', 1.5)}<text y="190" text-anchor="middle" style="font:15px var(--sc);fill:${INK}">${l}</text>
      ${[...Array(4)].map((_, k) => `<circle cx="${-5 + (k % 2) * 10}" cy="${206 + Math.floor(k / 2) * 6}" r="2.6" fill="${PAL.white}" stroke="${INK}" stroke-width=".5"/>`).join('')}</g>`;
    const tiny = (x, y, c) => `<circle cx="${x}" cy="${y - 7}" r="3.4" fill="${P('skin')}" stroke="${INK}" stroke-width=".5"/><path d="M${x - 5} ${y + 6} C${x - 5} ${y - 3} ${x + 5} ${y - 3} ${x + 5} ${y + 6}Z" fill="${c}" stroke="${INK}" stroke-width=".5"/>`;
    return plate(SW, 340, `
    <!-- sorteio: cartola -->
    <ellipse cx="260" cy="110" rx="34" ry="7" fill="${P('gray')}" class="ink"/>
    <path d="M238 110 L242 70 C252 66 268 66 278 70 L282 110Z" fill="#3a3530" class="ink"/>${SH('M266 68 L278 70 L282 110 L270 110Z')}
    <path d="M241 98 L281 98 L282 106 L240 106Z" fill="${PAL.red}" stroke="${INK}" stroke-width=".6"/>
    <g class="anim">${[0, 1, 2, 3].map(i => `<g class="slip ${i % 2 ? 'r' : 'l'}" style="animation-delay:${i * .8}s"><rect x="254" y="58" width="12" height="8" fill="${PAL.white}" stroke="${INK}" stroke-width=".5" transform="rotate(${i % 2 ? 12 : -12} 260 62)"/></g>`).join('')}</g>
    <text x="260" y="128" text-anchor="middle" class="lbl s">sorteio</text>
    <path d="M226 84 C196 70 170 70 150 80" fill="none" stroke="${INK}" stroke-width=".8" marker-end="url(#arr)"/><path d="M294 84 C324 70 350 70 370 80" fill="none" stroke="${INK}" stroke-width=".8" marker-end="url(#arr)"/>
    ${[0, 1, 2, 3, 4].map(i => tiny(108 + i * 13, 92, '#b89ad0')).join('')}${[0, 1, 2, 3, 4].map(i => tiny(360 + i * 13, 92, '#a9cde6')).join('')}
    <text x="134" y="118" text-anchor="middle" class="lbl s">grupo 1</text><text x="386" y="118" text-anchor="middle" class="lbl s">grupo 2</text>
    <!-- frascos idênticos -->
    ${big(220, 'A')}${big(300, 'B')}
    <text x="260" y="246" text-anchor="middle" class="lbl s">idênticos por fora</text>
    <!-- envelope lacrado -->
    <path d="M222 262 h76 v46 h-76z" fill="${P('cream')}" class="ink"/><path d="M222 262 l38 26 l38 -26" fill="none" class="ink"/>
    <circle cx="260" cy="288" r="8" fill="${PAL.red}" stroke="${INK}" stroke-width=".8"/><path d="M256 288 h8 M260 284 v8" stroke="#7a1f16" stroke-width=".8"/>
    <g class="anim"><circle class="shine" cx="257" cy="285" r="2" fill="#fff"/></g>
    <text x="260" y="324" text-anchor="middle" class="lbl s">o código só é aberto no fim do estudo</text>
    <!-- pesquisador e paciente vendados -->
    ${person(64, 'white', PAL.purple)}${person(456, 'yellow', PAL.teal, -1)}
    <g transform="translate(86 214) rotate(8)"><rect x="-12" y="-16" width="24" height="32" fill="${P('ochre')}" stroke="${INK}" stroke-width=".7"/><rect x="-10" y="-12" width="20" height="26" fill="${PAL.white}" stroke="${INK}" stroke-width=".4"/>${[0, 1, 2, 3].map(i => `<path d="M-7 ${-7 + i * 5} h14" stroke="${INK}" stroke-width=".4"/>`).join('')}</g>
    <text x="64" y="268" text-anchor="middle" class="lbl s">pesquisador</text><text x="64" y="279" text-anchor="middle" class="lbl s">não sabe</text>
    <text x="456" y="268" text-anchor="middle" class="lbl s">paciente</text><text x="456" y="279" text-anchor="middle" class="lbl s">não sabe</text>
    <text x="260" y="44" text-anchor="middle" class="lbl">qual é o remédio e qual é o placebo?</text>`, 237, 'Gravura de um ensaio duplo-cego: sorteio numa cartola divide os pacientes em dois grupos; dois frascos idênticos A e B; envelope lacrado com o código; pesquisador e paciente com os olhos vendados');
  };

  /* Frasco da escada: pontos = moléculas esperadas */
  science.flask = (molsLog10) => {
    const r = rng(9), cf = uid(), gl = uid(); let dots = '';
    const n = molsLog10 >= 2 ? 60 : molsLog10 >= 1 ? 20 : molsLog10 >= 0 ? Math.max(1, Math.round(Math.pow(10, molsLog10))) : 0;
    for (let i = 0; i < n; i++) { const a = r() * 6.28, rr = Math.sqrt(r()) * 50; const x = 110 + Math.cos(a) * rr, y = 196 + Math.sin(a) * rr * .72;
      dots += `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#7d55a3" stroke="${INK}" stroke-width=".5"/><circle cx="${(x - 1.3).toFixed(1)}" cy="${(y - 1.4).toFixed(1)}" r="1.2" fill="#fff" opacity=".8"/></g>`; }
    let water = '';
    for (let i = 0; i < 70; i++) { const a = r() * 6.28, rr = Math.sqrt(r()) * 58, x = 110 + Math.cos(a) * rr, y = 198 + Math.sin(a) * rr * .72, t = r() * 6.28;
      water += `<g opacity=".55"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="#d45a4c"/><circle cx="${(x + Math.cos(t) * 2.4).toFixed(1)}" cy="${(y + Math.sin(t) * 2.4).toFixed(1)}" r="1.1" fill="#fff" stroke="#9fb4c4" stroke-width=".3"/></g>`; }
    const body = 'M90 30 h40 v50 c40 16 56 50 56 98 a76 76 0 0 1 -152 0 c0 -48 16 -82 56 -98z';
    return `<svg viewBox="0 0 220 270" class="art flask" role="img" aria-label="Frasco em corte com moléculas">
      <defs><clipPath id="${cf}"><path d="${body}"/></clipPath>${grad(gl, [[0, '#dcecf6', .9], [1, '#9cc6e2', .95]])}</defs>
      <ellipse cx="110" cy="262" rx="70" ry="4" fill="url(#p-shade)"/>
      <path d="${body}" fill="${PAL.white}" stroke="${INK}" stroke-width="1.6"/>
      <g clip-path="url(#${cf})"><path d="M20 160 C60 150 160 150 200 160 V270 H20Z" fill="url(#${gl})"/>
        <path d="M20 160 C60 150 160 150 200 160" fill="none" stroke="#5f8fb8" stroke-width="1"/>
        ${hatchIn(cf, 150, 160, 190, 260, 3, -40, .18)}</g>
      ${water}<g class="mols">${dots}</g>
      <path d="M86 84 C54 102 44 134 44 170" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M100 36 V78" stroke="#fff" stroke-width="3" opacity=".8"/>
      <path d="M93 30 h34" stroke="${INK}" stroke-width="1.2"/>
      <rect x="84" y="14" width="52" height="18" rx="3" fill="${P('brown')}" stroke="${INK}" stroke-width="1.1"/>
      <path d="M84 20 h52 M84 26 h52" stroke="${INK}" stroke-width=".4"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M${168 - i} ${130 + i * 22} h8" stroke="${INK}" stroke-width=".7"/>`).join('')}</svg>`;
  };

  /* ícones de comparação para a escada (gravura, sem filtro) */
  science.cmpIcon = (k) => {
    const g = uid();
    const I = {
      gota: `<path d="M60 18 c-14 26 -24 38 -24 52 a24 24 0 0 0 48 0 c0 -14 -10 -26 -24 -52z" fill="#b89ad0" class="ink"/><path d="M48 72 c0 -10 4 -18 8 -24" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>${SH('M70 56 c6 10 10 18 10 24 a20 20 0 0 1 -14 14 c8 -10 8 -24 4 -38z')}`,
      colher: `<path d="M64 58 L112 34" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M64 58 L112 34" stroke="#c9c4ba" stroke-width="5" stroke-linecap="round"/><ellipse cx="42" cy="64" rx="28" ry="19" fill="#c9c4ba" class="ink"/><ellipse cx="42" cy="62" rx="20" ry="12" fill="#bcd9ec" stroke="${INK}" stroke-width=".7"/><path d="M28 58 c4 -4 10 -5 14 -4" stroke="#fff" stroke-width="2" fill="none"/>${SH('M42 83 A28 19 0 0 0 70 64 A24 16 0 0 1 42 83Z')}`,
      garrafa: `<path d="M50 16 h20 v14 c14 8 16 18 16 30 v42 a8 8 0 0 1 -8 8 h-36 a8 8 0 0 1 -8 -8 v-42 c0 -12 2 -22 16 -30z" fill="#cfe5f2" class="ink"/><path d="M36 64 h48 v38 a8 8 0 0 1 -8 8 h-32 a8 8 0 0 1 -8 -8z" fill="#93bfe0" opacity=".7"/><rect x="49" y="8" width="22" height="9" rx="2" fill="${P('blue')}" class="ink"/><path d="M42 58 V100" stroke="#fff" stroke-width="3" opacity=".8"/>${[0, 1, 2].map(i => `<path d="M36 ${74 + i * 10} h48" stroke="${INK}" stroke-width=".4" opacity=".4"/>`).join('')}`,
      balde: `<path d="M28 0 M30 36 C32 4 88 4 90 36" stroke="${INK}" stroke-width="1.6" fill="none"/><path d="M24 36 h72 l-8 70 h-56z" fill="${P('teal')}" class="ink"/>${SH('M78 36 h18 l-8 70 h-14z')}${[50, 74].map(y => `<path d="M${24 + (y - 36) * .12} ${y} h${72 - (y - 36) * .24}" stroke="${INK}" stroke-width="1"/>`).join('')}<ellipse cx="60" cy="36" rx="36" ry="8" fill="#93bfe0" class="ink"/>`,
      caixa: `<path d="M18 40 h84 v58 h-84z" fill="#e8e3d6" class="ink"/>${SH('M84 40 h18 v58 h-18z')}<ellipse cx="60" cy="40" rx="42" ry="10" fill="#d6d0c2" class="ink"/><ellipse cx="60" cy="38" rx="14" ry="3.6" fill="#93bfe0" stroke="${INK}" stroke-width=".6"/>${[54, 70, 86].map(y => `<path d="M18 ${y} h84" stroke="${INK}" stroke-width=".6"/>`).join('')}<path d="M26 98 v16 M94 98 v16 M60 98 v16" stroke="${INK}" stroke-width="3"/>`,
      piscina: `<path d="M8 52 L92 40 L114 72 L30 86Z" fill="#93bfe0" class="ink"/>${[0, 1, 2, 3].map(i => `<path d="M${14 + i * 6} ${58 + i * 7} L${98 + i * 5} ${46 + i * 7}" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 3"/>`).join('')}<path d="M30 86 V96 L114 82 V72" fill="#e8e3d6" class="ink"/><path d="M8 52 V62 L30 96" fill="none" class="ink"/><path d="M92 40 v-14 M100 38 v-14 M92 30 h8" stroke="${INK}" stroke-width="1.2"/>`,
      lago: `<path d="M14 46 l12 -28 l12 28z M80 44 l14 -32 l14 32z M54 46 l9 -18 l9 18z" fill="${P('green')}" class="ink"/><path d="M8 72 C18 52 50 54 70 50 C102 46 114 66 106 82 C98 98 40 100 20 92 C6 86 4 78 8 72Z" fill="#4f78b8" class="ink"/>${[0, 1, 2].map(i => `<path d="M${28 + i * 14} ${68 + i * 8} h${30 - i * 4}" stroke="#fff" stroke-width="1" opacity=".8"/>`).join('')}`,
      oceano: `<path d="M0 58 q15 -10 30 0 t30 0 t30 0 t30 0 V112 H0z" fill="#3d62a8" class="ink"/>${[74, 90].map(y => `<path d="M0 ${y} q15 -8 30 0 t30 0 t30 0 t30 0" stroke="#fff" stroke-width="1" fill="none" opacity=".6"/>`).join('')}<path d="M76 40 h34 l-6 12 h-24z" fill="${P('brown')}" class="ink"/><path d="M92 40 V10 L108 34 H92" fill="${PAL.white}" class="ink"/>`,
      terra: `<defs><clipPath id="${g}"><circle cx="60" cy="60" r="44"/></clipPath></defs><circle cx="60" cy="60" r="44" fill="#4f78b8" class="ink"/><g clip-path="url(#${g})"><path d="M30 30 c10 -6 22 0 18 12 c-4 10 8 14 4 24 c-4 8 -16 4 -22 -4 c-6 -10 -8 -24 0 -32z M70 68 c8 -6 22 0 20 12 c-2 10 -16 14 -22 6z M74 22 c8 -2 16 4 12 10 c-4 4 -12 2 -12 -10z" fill="${P('green')}" stroke="${INK}" stroke-width=".7"/><path d="M60 16 A44 44 0 0 1 60 104 A40 44 0 0 0 60 16Z" fill="url(#p-cross)"/></g><path d="M34 36 a30 30 0 0 1 16 -12" stroke="#fff" stroke-width="2.4" fill="none" opacity=".7"/>`,
      sol: `${[...Array(16)].map((_, i) => { const a = i * .3927; return `<path d="M${(60 + Math.cos(a) * 38).toFixed(1)} ${(60 + Math.sin(a) * 38).toFixed(1)} L${(60 + Math.cos(a) * (i % 2 ? 48 : 56)).toFixed(1)} ${(60 + Math.sin(a) * (i % 2 ? 48 : 56)).toFixed(1)}" stroke="${PAL.orange}" stroke-width="${i % 2 ? 1.6 : 2.6}" stroke-linecap="round"/>`; }).join('')}<circle cx="60" cy="60" r="32" fill="${P('yellow')}" class="ink"/>${SH('M76 32 A32 32 0 0 1 60 92 A28 30 0 0 0 76 32Z')}`,
      sistema: `<circle cx="60" cy="60" r="8" fill="${P('yellow')}" class="ink"/>${[18, 28, 40, 54].map((r, i) => `<ellipse cx="60" cy="60" rx="${r}" ry="${r * .42}" stroke="${INK}" stroke-width=".6" fill="none"/><circle cx="${(60 + r * Math.cos(i * 1.7)).toFixed(1)}" cy="${(60 + r * .42 * Math.sin(i * 1.7)).toFixed(1)}" r="${3 + i * .8}" fill="${['#c4473a', '#4f78b8', '#e07b39', '#c98a35'][i]}" stroke="${INK}" stroke-width=".6"/>`).join('')}<ellipse cx="60" cy="60" rx="58" ry="26" stroke="${INK}" stroke-width=".4" fill="none" stroke-dasharray="2 3"/>`,
      estrelas: `<circle cx="60" cy="60" r="52" fill="#1f2a44" class="ink"/>${[...Array(22)].map((_, i) => { const r = rng(i + 40); const a = r() * 6.28, d = Math.sqrt(r()) * 46, x = 60 + Math.cos(a) * d, y = 60 + Math.sin(a) * d, s = 1.4 + r() * 4; return `<path d="M${x.toFixed(1)} ${(y - s).toFixed(1)} L${(x + s * .25).toFixed(1)} ${(y - s * .25).toFixed(1)} L${(x + s).toFixed(1)} ${y.toFixed(1)} L${(x + s * .25).toFixed(1)} ${(y + s * .25).toFixed(1)} L${x.toFixed(1)} ${(y + s).toFixed(1)} L${(x - s * .25).toFixed(1)} ${(y + s * .25).toFixed(1)} L${(x - s).toFixed(1)} ${y.toFixed(1)} L${(x - s * .25).toFixed(1)} ${(y - s * .25).toFixed(1)}Z" fill="${PAL.yellow}"/>`; }).join('')}<circle cx="60" cy="60" r="30" fill="none" stroke="#93bfe0" stroke-width="1.4" stroke-dasharray="3 3"/>`
    };
    return `<svg viewBox="0 0 120 120" class="art cmp">${I[k] || I.gota}</svg>`;
  };

  /* Planta para as bordas da linha do tempo (ramos, folhas, flores) */
  function vine(h, side, seed) {
    const r = rng(seed); const w = 70; let d = `M${side === 'l' ? 18 : w - 18} 0`; let y = 0; const pts = [];
    while (y < h) { const ny = Math.min(h, y + 120 + r() * 80); const x1 = 10 + r() * (w - 20), x2 = 10 + r() * (w - 20), x = 14 + r() * (w - 28); d += ` C${x1} ${y + 40} ${x2} ${ny - 40} ${x} ${ny}`; pts.push([x, ny]); y = ny; }
    return { d, w };
  }

  window.ART = { installDefs, complaint, principle, history, science, script, vine, leaf, flower, P, PAL };
})();
