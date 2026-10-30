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

  /* ═══════════════ QUEIXAS ═══════════════ */
  const complaint = {};

  complaint.hematoma = () => plate(460, 330, `
    <g filter="url(#pencil)">
      <!-- arnica -->
      <path d="M58 150 C62 120 60 100 62 78" class="ink"/>${leaf(60, 128, 26, -150)}${leaf(61, 112, 22, -25)}
      ${flower(62, 72, 24, 13, 'yellow', 'orange', 8)}
      <!-- perna -->
      <path d="M78 96 C108 128 140 158 150 196 C158 226 146 262 140 306 L104 306 C112 266 116 238 110 214 C102 186 74 160 52 126 Z" fill="${P('skin')}" class="ink"/>
      <path d="M118 210 C126 200 140 198 150 204" class="ink thin"/>
      <path d="M140 300 C150 304 176 304 184 312 L104 314 L104 300Z" fill="${P('red')}" class="ink"/>
      <path d="M106 252 C112 246 122 246 130 252 M110 276 c8 -4 16 -4 24 0" class="ink thin" opacity=".5"/>
      <path d="M120 150 C110 170 116 186 130 192" fill="url(#p-shade)" stroke="none"/>
      <ellipse cx="146" cy="200" rx="13" ry="10" fill="${P('purple')}" opacity=".85" class="bruise"/>
      <circle cx="146" cy="200" r="20" fill="none" class="ink" stroke-width="2"/>
      <path d="M164 192 L230 150" class="ink thin" stroke-dasharray="3 3"/>
      <!-- bloco de tecido -->
      <path d="M232 104 L262 82 L432 82 L402 104 Z" fill="${P('skin')}" class="ink"/>
      <path d="M402 104 L432 82 L432 252 L402 274 Z" fill="url(#p-shade)" class="ink"/>
      <rect x="232" y="104" width="170" height="13" fill="${P('ochre')}" class="ink"/>
      <rect x="232" y="117" width="170" height="52" fill="${P('pink')}" class="ink"/>
      <path d="M238 130 c10 -6 18 6 28 0 s18 6 28 0 s18 6 28 0 s18 6 28 0 s18 6 28 0 M238 150 c10 -6 18 6 28 0 s18 6 28 0 s18 6 28 0 s18 6 28 0 s18 6 28 0" class="ink thin" opacity=".5"/>
      <rect x="232" y="169" width="170" height="56" fill="${P('cream')}" class="ink"/>
      ${[...Array(14)].map((_, i) => `<circle cx="${244 + (i % 7) * 23 + (i > 6 ? 11 : 0)}" cy="${183 + (i > 6 ? 24 : 0)}" r="10" fill="${P('yellow')}" class="ink thin"/>`).join('')}
      <rect x="232" y="225" width="170" height="49" fill="${P('red')}" class="ink"/>
      ${[...Array(9)].map((_, i) => `<path d="M${240 + i * 19} 229 v41" class="ink thin" opacity=".5"/>`).join('')}
      <!-- capilar rompido -->
      <path d="M232 142 C260 136 280 146 304 142" fill="none" stroke="${PAL.red}" stroke-width="7" stroke-linecap="round"/>
      <path d="M326 140 C350 136 376 146 402 140" fill="none" stroke="${PAL.red}" stroke-width="7" stroke-linecap="round"/>
      <path d="M232 138.5 C260 132.5 280 142.5 304 138.5 M232 145.5 C260 139.5 280 149.5 304 145.5 M326 136.5 C350 132.5 376 142.5 402 136.5 M326 143.5 C350 139.5 376 149.5 402 143.5" class="ink thin"/>
    </g>
    <g class="anim">
      <ellipse cx="315" cy="146" rx="26" ry="14" fill="${PAL.purple}" opacity=".35" class="stain"/>
      ${[...Array(9)].map((_, i) => `<ellipse cx="315" cy="142" rx="3.2" ry="2.2" fill="${PAL.red}" stroke="${INK}" stroke-width=".5" class="cell" style="--dx:${Math.cos(i * .7) * 30}px;--dy:${Math.sin(i * 1.3) * 16 + 8}px;animation-delay:${i * .38}s"/>`).join('')}
    </g>
    ${lab(232, 110, 214, 92, 'epiderme', 'end')}${lab(232, 128, 214, 122, 'derme', 'end')}
    ${lab(232, 196, 214, 196, 'gordura', 'end')}${lab(232, 252, 214, 252, 'músculo', 'end')}
    ${lab(315, 140, 330, 66, 'capilar rompido')}
    ${dim(392, 117, 392, 169, '~2 mm', 'l')}
    ${lab(62, 72, 22, 52, 'Arnica', 'start')}
    <g class="stages">
      ${[['purple', 'dia 1'], ['green', 'dia 5'], ['yellow', 'dia 8'], ['skin', 'dia 14']].map(([c, t], i) =>
        `<g transform="translate(${252 + i * 48} 300)"><circle r="11" fill="${P(c)}" class="ink"/><circle r="15" class="ring" style="animation-delay:${i * 1.2}s"/><text y="27" text-anchor="middle" class="lbl s">${t}</text></g>`).join('')}
      <path d="M268 300 h16 M316 300 h16 M364 300 h16" class="ink thin" marker-end="url(#arr)"/>
    </g>`, 11, 'Corte da pele mostrando um capilar rompido e as cores do hematoma');

  complaint.coriza = () => plate(460, 330, `
    <g filter="url(#pencil)">
      <!-- cebola cortada: metade de baixo com a face do corte -->
      <path d="M36 216 C30 268 70 302 120 304 C170 302 210 268 204 216" fill="${P('purple')}" class="ink"/>
      <path d="M50 230 C56 270 86 292 120 294 M190 230 C184 270 154 292 120 294 M80 222 C84 262 100 284 120 290" class="ink thin" opacity=".55"/>
      ${[...Array(9)].map((_, i) => `<path d="M${108 + i * 3} 302 q${-8 + i * 2} 12 ${-12 + i * 3} 20" class="ink thin"/>`).join('')}
      ${[84, 72, 60, 48, 37, 26, 15, 6].map((r, i) => `<ellipse cx="120" cy="216" rx="${r}" ry="${r * .3}" fill="${i % 2 ? P('white') : P('violet')}" class="ink thin"/>`).join('')}
      <!-- metade de cima tombada, com casca seca -->
      <g transform="rotate(-24 300 250)">
        <path d="M240 262 C236 220 264 196 300 196 C336 196 364 220 360 262" fill="${P('ochre')}" class="ink"/>
        <path d="M300 196 C298 178 306 168 314 160" class="ink"/><path d="M262 222 C276 206 290 200 300 198 M338 222 C324 206 310 200 300 198" class="ink thin" opacity=".5"/>
        <ellipse cx="300" cy="262" rx="60" ry="17" fill="${P('violet')}" class="ink thin"/><ellipse cx="300" cy="262" rx="40" ry="11" fill="${P('white')}" class="ink thin"/><ellipse cx="300" cy="262" rx="20" ry="6" fill="${P('violet')}" class="ink thin"/>
      </g>
      <!-- olho -->
      <path d="M290 108 C320 82 372 82 402 108 C372 132 320 132 290 108 Z" fill="${P('white')}" class="ink"/>
      <circle cx="346" cy="107" r="17" fill="${P('blue')}" class="ink"/><circle cx="346" cy="107" r="7" fill="${INK}"/>
      <circle cx="341" cy="102" r="2.5" fill="#fff"/>
      <path d="M288 104 C320 66 374 66 404 104" class="ink"/>
      <path d="M296 96 l-6 -7 M306 88 l-4 -8 M318 82 l-2 -8 M332 79 l-1 -8 M346 78 v-8 M360 79 l1 -8 M374 82 l2 -8 M386 88 l4 -8" class="ink thin"/>
      <ellipse cx="392" cy="86" rx="14" ry="7" fill="${P('pink')}" class="ink thin" transform="rotate(-20 392 86)"/>
      <path d="M402 108 C412 128 414 160 404 196 C400 214 412 222 420 228" class="ink" opacity=".7"/>
    </g>
    <g class="anim">
      ${[...Array(7)].map((_, i) => `<g class="vapor" style="animation-delay:${i * .55}s"><path d="M${100 + i * 8} 200 c-6 -8 6 -14 0 -22 s6 -14 0 -22" fill="none" stroke="${PAL.violet}" stroke-width="2" stroke-linecap="round"/><circle cx="${100 + i * 8}" cy="152" r="2.5" fill="${PAL.mud}"/></g>`).join('')}
      ${[0, 1, 2].map(i => `<path class="tear" style="animation-delay:${i * .9}s" d="M300 116 c-3 6 -5 9 -5 12 a5 5 0 0 0 10 0 c0 -3 -2 -6 -5 -12z" fill="${P('sky')}" stroke="${INK}" stroke-width=".7"/>`).join('')}
      <path class="drip" d="M418 232 c-2 5 -4 8 -4 10 a4 4 0 0 0 8 0 c0 -2 -2 -5 -4 -10z" fill="${PAL.sky}" stroke="${INK}" stroke-width=".7"/>
    </g>
    ${lab(392, 86, 414, 58, 'glândula lacrimal', 'end')}
    ${lab(116, 166, 170, 140, 'gás irritante (com enxofre)')}
    ${lab(60, 214, 28, 120, 'cada anel é uma folha', 'start')}
    ${dim(36, 314, 100, 314, '≈ 8 cm')}`, 23, 'Cebola cortada liberando gás que faz o olho lacrimejar');

  complaint.insonia = () => plate(460, 330, `
    <g filter="url(#pencil)">
      <!-- lua e estrelas -->
      <path d="M70 58 a24 24 0 1 0 26 34 a19 19 0 1 1 -26 -34z" fill="${P('yellow')}" class="ink"/>
      <!-- cabeça em corte -->
      <path d="M120 300 C118 270 100 262 96 240 C90 228 78 226 82 212 C86 204 92 200 90 190 C86 150 104 104 160 94 C220 84 262 124 262 176 C262 214 240 236 236 270 L236 300" fill="${P('skin')}" class="ink"/>
      <path d="M118 182 C112 132 150 106 190 108 C232 112 250 146 244 180 C240 204 220 214 196 212 C170 220 130 214 118 182Z" fill="${P('rose')}" class="ink"/>
      <path d="M130 170 c10 -14 22 4 30 -10 s22 4 30 -10 s22 4 30 -8 M134 194 c12 -10 22 4 34 -6 s22 6 34 -4 s20 4 30 -4 M150 132 c10 -6 20 4 30 -4 s20 6 30 -2" class="ink thin" opacity=".55"/>
      <circle cx="104" cy="170" r="4" fill="${INK}"/>
      <!-- cereja de café cortada -->
      <ellipse cx="370" cy="230" rx="52" ry="40" fill="${P('red')}" class="ink"/>
      <ellipse cx="370" cy="230" rx="40" ry="30" fill="${P('cream')}" class="ink thin"/>
      <path d="M332 230 C332 206 368 204 368 230 C368 256 332 254 332 230Z M372 230 C372 204 408 206 408 230 C408 254 372 256 372 230Z" fill="${P('leaf')}" class="ink"/>
      <path d="M350 214 C344 226 356 236 350 248 M390 214 C384 226 396 236 390 248" class="ink thin"/>
      <path d="M370 190 C374 176 384 168 398 166" class="ink"/>${leaf(398, 166, 30, -18, 'green')}
    </g>
    <g class="anim">
      <g class="gear g1" style="transform-origin:170px 150px"><circle cx="170" cy="150" r="16" fill="${P('gold')}" stroke="${INK}"/>${[...Array(10)].map((_, i) => `<rect x="167" y="129" width="6" height="7" fill="${PAL.gold}" stroke="${INK}" stroke-width=".7" transform="rotate(${i * 36} 170 150)"/>`).join('')}<circle cx="170" cy="150" r="4" fill="${INK}"/></g>
      <g class="gear g2" style="transform-origin:202px 168px"><circle cx="202" cy="168" r="11" fill="${P('orange')}" stroke="${INK}"/>${[...Array(8)].map((_, i) => `<rect x="199.5" y="153" width="5" height="6" fill="${PAL.orange}" stroke="${INK}" stroke-width=".7" transform="rotate(${i * 45} 202 168)"/>`).join('')}<circle cx="202" cy="168" r="3" fill="${INK}"/></g>
      <g class="gear g1" style="transform-origin:222px 140px"><circle cx="222" cy="140" r="9" fill="${P('teal')}" stroke="${INK}"/>${[...Array(7)].map((_, i) => `<rect x="219.5" y="127" width="5" height="5" fill="${PAL.teal}" stroke="${INK}" stroke-width=".7" transform="rotate(${i * 51.4} 222 140)"/>`).join('')}</g>
      ${[[130, 50], [160, 34], [200, 56], [250, 40], [300, 64], [36, 120]].map(([x, y], i) => `<path class="twinkle" style="animation-delay:${i * .4}s;transform-origin:${x}px ${y}px" d="M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2}Z" fill="${PAL.yellow}" stroke="${INK}" stroke-width=".6"/>`).join('')}
    </g>
    <!-- fechaduras: adenosina x cafeína -->
    <g transform="translate(300 70)">
      <circle cx="60" cy="48" r="50" fill="${PAL.white}" class="ink" stroke-width="1.6"/>
      <path d="M22 70 v-22 h12 v14 h14 v-14 h12 v22" fill="${P('sky')}" class="ink"/>
      <circle cx="41" cy="54" r="6" fill="${P('purple')}" class="ink"/>
      <path d="M68 70 v-22 h12 v14 h14 v-14 h12 v22" fill="${P('sky')}" class="ink" transform="translate(-6 0)"/>
      <path d="M81 49 l6 -4 l6 4 v7 l-6 4 l-6 -4z" fill="${P('ochre')}" class="ink"/>
      <text x="38" y="88" text-anchor="middle" class="lbl s">adenosina</text><text x="86" y="88" text-anchor="middle" class="lbl s">cafeína</text>
      <text x="60" y="22" text-anchor="middle" class="lbl s">receptores</text>
    </g>
    <path d="M244 150 C270 130 286 120 302 116" class="lead" stroke-dasharray="3 3"/>
    ${lab(170, 150, 120, 270, 'mente acelerada', 'end')}
    ${lab(352, 230, 330, 304, 'dois grãos dentro da cereja', 'end')}`, 31, 'Cabeça em corte com engrenagens; cafeína ocupando o receptor da adenosina');

  complaint.digestao = () => plate(460, 330, `
    <g filter="url(#pencil)">
      <!-- esôfago e estômago em corte -->
      <path d="M118 52 L118 104 C118 118 112 126 104 140 C82 180 92 250 150 270 C210 290 280 270 316 240 L350 248 L352 226 L320 222 C300 200 300 160 260 140 C220 120 170 130 150 108 L150 52 Z" fill="${P('rose')}" class="ink" stroke-width="2"/>
      <path d="M126 52 L126 104 C126 120 120 130 114 142 C96 178 104 240 154 258 C206 276 270 258 304 232 L344 238 L344 232 L310 228 C290 206 290 170 254 152 C216 134 172 140 144 116 L142 52Z" fill="${P('pink')}" class="ink thin"/>
      <path d="M118 170 c8 6 4 14 12 20 s4 14 12 20 M150 236 c8 -4 14 6 22 2 s14 6 22 2 s14 6 22 2 M200 160 c6 8 -2 14 4 22 M250 170 c8 4 4 14 12 18 M270 206 c6 -6 14 2 20 -4" class="ink thin" opacity=".6"/>
      <!-- suco gástrico -->
      <path d="M118 214 C150 222 190 210 230 222 C260 230 290 220 300 226 C280 250 220 268 160 252 C138 244 124 232 118 214Z" fill="${P('leaf')}" opacity=".9"/>
      <!-- comida -->
      <rect x="168" y="196" width="18" height="12" rx="3" fill="${P('ochre')}" class="ink thin" transform="rotate(18 177 202)"/>
      <circle cx="214" cy="204" r="8" fill="${P('red')}" class="ink thin"/>
      <path d="M232 190 l16 4 l-4 12 l-14 -4z" fill="${P('yellow')}" class="ink thin"/>
      <ellipse cx="150" cy="194" rx="10" ry="6" fill="${P('green')}" class="ink thin"/>
      <!-- noz-vômica -->
      <g transform="translate(370 92)">
        <ellipse rx="40" ry="38" fill="${P('gray')}" class="ink"/><ellipse rx="34" ry="32" fill="${P('cream')}" class="ink thin"/>
        ${[...Array(18)].map((_, i) => `<path d="M0 0 L${Math.cos(i * .35) * 32} ${Math.sin(i * .35) * 30}" class="ink thin" opacity=".35"/>`).join('')}
        <circle r="4" fill="${P('brown')}" class="ink thin"/>
      </g>
    </g>
    <g class="anim">
      <g class="peri" style="transform-origin:200px 200px">
        ${[...Array(8)].map((_, i) => `<circle class="bub" style="animation-delay:${i * .45}s" cx="${140 + i * 18}" cy="236" r="${3 + (i % 3) * 1.5}" fill="none" stroke="${PAL.green}" stroke-width="1.4"/>`).join('')}
      </g>
      <circle class="gas" cx="136" cy="128" r="10" fill="${PAL.white}" stroke="${INK}" stroke-width=".8" opacity=".9"/>
    </g>
    ${lab(134, 70, 176, 70, 'esôfago')}
    ${lab(342, 236, 420, 270, 'piloro', 'end')}
    ${lab(200, 240, 238, 300, 'suco gástrico (pH ≈ 2)')}
    ${lab(260, 162, 300, 150, 'pregas gástricas')}
    ${lab(136, 128, 64, 116, 'gás → arroto', 'start')}
    ${dim(330, 144, 410, 144, '≈ 2,5 cm')}
    ${lab(370, 92, 410, 40, 'semente de noz-vômica', 'end')}`, 41, 'Estômago em corte com comida, suco gástrico e bolhas de gás');

  complaint.picada = () => plate(460, 330, `
    <g filter="url(#pencil)">
      <!-- bloco de pele -->
      <path d="M150 196 L186 170 L436 170 L400 196 Z" fill="${P('skin')}" class="ink"/>
      <path d="M400 196 L436 170 L436 290 L400 316 Z" fill="url(#p-shade)" class="ink"/>
      <rect x="150" y="196" width="250" height="14" fill="${P('ochre')}" class="ink"/>
      <rect x="150" y="210" width="250" height="60" fill="${P('pink')}" class="ink"/>
      <rect x="150" y="270" width="250" height="46" fill="${P('cream')}" class="ink"/>
      ${[...Array(10)].map((_, i) => `<circle cx="${162 + i * 24}" cy="292" r="10" fill="${P('yellow')}" class="ink thin"/>`).join('')}
      <!-- mastócito -->
      <circle cx="210" cy="246" r="14" fill="${P('violet')}" class="ink"/>${[...Array(9)].map((_, i) => `<circle cx="${210 + Math.cos(i * .7) * 8}" cy="${246 + Math.sin(i * .7) * 8}" r="1.8" fill="${PAL.purple}"/>`).join('')}
      <!-- ferrão -->
      <path d="M296 150 L300 238 L304 150" fill="${P('brown')}" class="ink"/>
      ${[...Array(6)].map((_, i) => `<path d="M${297 + i * .5} ${168 + i * 11} l-5 -5 M${303 - i * .5} ${168 + i * 11} l5 -5" class="ink thin"/>`).join('')}
      <!-- abelha -->
      <g transform="translate(110 90) rotate(-14)">
        <ellipse cx="0" cy="0" rx="46" ry="30" fill="${P('yellow')}" class="ink"/>
        <path d="M-20 -27 C-26 0 -26 10 -20 27 M2 -30 C-4 0 -4 10 2 30 M24 -24 C18 0 18 10 24 24" stroke="${INK}" stroke-width="9" fill="none" opacity=".85"/>
        <circle cx="-58" cy="-6" r="20" fill="${P('brown')}" class="ink"/>
        <ellipse cx="-68" cy="-10" rx="6" ry="9" fill="${INK}"/>
        <path d="M-66 -24 C-76 -44 -86 -46 -92 -40 M-58 -26 C-62 -48 -70 -52 -78 -50" class="ink"/>
        <path d="M44 4 L58 10 L44 14" fill="${INK}"/>
        ${[-28, -8, 12].map(x => `<path d="M${x} 28 C${x - 4} 42 ${x - 10} 46 ${x - 14} 52" class="ink"/>`).join('')}
      </g>
    </g>
    <g class="anim">
      <g class="wing" style="transform-origin:96px 66px"><path d="M96 66 C80 20 40 10 34 30 C30 46 66 60 96 66Z" fill="${PAL.sky}" fill-opacity=".45" stroke="${INK}" stroke-width=".9"/></g>
      <g class="wing w2" style="transform-origin:110px 64px"><path d="M110 64 C112 18 150 4 160 20 C168 36 136 56 110 64Z" fill="${PAL.sky}" fill-opacity=".35" stroke="${INK}" stroke-width=".9"/></g>
      <g class="sac" style="transform-origin:300px 146px"><ellipse cx="300" cy="140" rx="14" ry="12" fill="${P('yellow')}" stroke="${INK}"/><path d="M290 140 c4 -6 16 -6 20 0" fill="none" stroke="${INK}" stroke-width=".6"/></g>
      <ellipse class="swell" cx="300" cy="190" rx="54" ry="14" fill="${PAL.red}" opacity=".3"/>
      ${[...Array(10)].map((_, i) => `<circle class="venom" style="animation-delay:${i * .3}s;--dx:${(i % 2 ? 1 : -1) * (12 + i * 5)}px;--dy:${(i % 3) * 8 - 6}px" cx="300" cy="236" r="2.5" fill="${PAL.mud}"/>`).join('')}
      ${[...Array(6)].map((_, i) => `<circle class="hist" style="animation-delay:${i * .5}s;--dx:${Math.cos(i) * 26}px;--dy:${Math.sin(i) * 20 - 10}px" cx="210" cy="246" r="1.8" fill="${PAL.purple}"/>`).join('')}
    </g>
    ${lab(304, 200, 444, 150, 'ferrão com farpas', 'end')}
    ${lab(312, 140, 444, 96, 'bolsa de veneno (segue bombeando)', 'end')}
    ${lab(196, 240, 140, 226, 'mastócito solta histamina', 'end')}
    ${dim(284, 150, 284, 238, '~2 mm', 'l')}`, 53, 'Abelha e corte da pele com ferrão, veneno e histamina');

  complaint.enjoo = () => plate(460, 330, `
    <g filter="url(#pencil)">
      <!-- ouvido interno -->
      <g transform="translate(320 150)">
        <path d="M-30 30 C-70 30 -80 -10 -50 -20 C-30 -26 -18 -10 -30 0 C-40 8 -52 0 -44 -8" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round" opacity=".9"/>
        <path d="M-30 30 C-70 30 -80 -10 -50 -20 C-30 -26 -18 -10 -30 0 C-40 8 -52 0 -44 -8" fill="none" stroke="${PAL.pink}" stroke-width="9" stroke-linecap="round"/>
        <path d="M-30 30 C-4 34 10 20 14 8" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
        <path d="M-30 30 C-4 34 10 20 14 8" fill="none" stroke="${PAL.cream}" stroke-width="13" stroke-linecap="round"/>
        <ellipse cx="34" cy="-36" rx="34" ry="44" fill="none" stroke="${INK}" stroke-width="11"/><ellipse cx="34" cy="-36" rx="34" ry="44" fill="none" stroke="${PAL.sky}" stroke-width="8"/>
        <ellipse cx="62" cy="10" rx="44" ry="26" fill="none" stroke="${INK}" stroke-width="11" transform="rotate(-15 62 10)"/><ellipse cx="62" cy="10" rx="44" ry="26" fill="none" stroke="${PAL.sky}" stroke-width="8" transform="rotate(-15 62 10)"/>
        <ellipse cx="2" cy="-24" rx="18" ry="40" fill="none" stroke="${INK}" stroke-width="11" transform="rotate(40 2 -24)"/><ellipse cx="2" cy="-24" rx="18" ry="40" fill="none" stroke="${PAL.sky}" stroke-width="8" transform="rotate(40 2 -24)"/>
        <path d="M14 8 C30 40 60 56 96 70" stroke="${PAL.yellow}" stroke-width="5" fill="none"/><path d="M14 8 C30 40 60 56 96 70" class="ink thin"/>
      </g>
      <!-- olho -->
      <g transform="translate(98 252)"><path d="M-36 0 C-14 -20 14 -20 36 0 C14 20 -14 20 -36 0Z" fill="${P('white')}" class="ink"/><circle r="12" fill="${P('green')}" class="ink"/><circle r="5" fill="${INK}"/></g>
    </g>
    <g class="anim">
      <g class="boat"><path d="M30 120 L160 120 L140 146 L50 146Z" fill="${P('brown')}" stroke="${INK}"/><path d="M94 120 V54" stroke="${INK}" stroke-width="2"/><path d="M96 56 L148 112 L96 112Z" fill="${P('white')}" stroke="${INK}"/><path d="M92 60 L46 112 L92 112Z" fill="${P('rose')}" stroke="${INK}"/><rect x="60" y="126" width="10" height="8" fill="${PAL.sky}" stroke="${INK}" stroke-width=".6"/><rect x="118" y="126" width="10" height="8" fill="${PAL.sky}" stroke="${INK}" stroke-width=".6"/></g>
      <path class="waves" d="M-40 152 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="${PAL.blue}" stroke-width="3"/>
      <path class="waves w2" d="M-60 164 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="${PAL.teal}" stroke-width="2.5"/>
      ${[[354, 114], [396, 156], [318, 128]].map(([x, y], i) => `<circle class="slosh" style="animation-delay:${i * .35}s" cx="${x}" cy="${y}" r="3.5" fill="${PAL.blue}"/>`).join('')}
    </g>
    <g class="said">
      <path d="M138 252 h22" class="lead"/><text x="164" y="248" class="lbl">olho: “estamos</text><text x="164" y="262" class="lbl">parados”</text>
      <text x="330" y="266" text-anchor="middle" class="lbl">ouvido: “estamos balançando!”</text>
      <text x="240" y="306" text-anchor="middle" class="lbl em">cérebro: “?!”  →  enjoo</text></g>
    ${lab(354, 110, 400, 60, 'canais semicirculares', 'end')}
    ${lab(276, 176, 236, 210, 'cóclea (audição)', 'end')}
    ${lab(410, 220, 444, 240, 'nervo', 'end')}`, 67, 'Barco balançando, ouvido interno com canais semicirculares e olho');

  /* ═══════════════ PRINCÍPIOS (ícones) ═══════════════ */
  const principle = {};
  const ico = (b, lbl) => `<svg viewBox="0 0 180 130" class="art icon" role="img" aria-label="${lbl}"><g filter="url(#pencil)">${b}</g></svg>`;
  principle.similia = () => ico(`
    <path d="M18 70 C18 104 44 116 56 116 C68 116 94 104 94 70" fill="${P('purple')}" class="ink"/>
    ${[38, 28, 18, 8].map((r, i) => `<ellipse cx="56" cy="70" rx="${r}" ry="${r * .32}" fill="${i % 2 ? P('white') : P('violet')}" class="ink thin"/>`).join('')}
    <path d="M100 58 h14 M100 66 h14" class="ink" stroke-width="2"/><path d="M98 54 q9 -10 18 0" class="ink thin"/>
    <path d="M124 60 C134 48 160 48 170 60 C160 72 134 72 124 60Z" fill="${P('white')}" class="ink"/><circle cx="147" cy="60" r="8" fill="${P('blue')}" class="ink"/><circle cx="147" cy="60" r="3" fill="${INK}"/>
    <path d="M130 70 c-2 6 -4 9 -4 11 a4 4 0 0 0 8 0 c0 -2 -2 -5 -4 -11z" fill="${P('sky')}" class="ink thin"/>`, 'Cebola e olho lacrimejando');
  principle.experimentacao = () => ico(`
    <path d="M20 40 L88 32 L88 112 L20 118Z" fill="${P('cream')}" class="ink"/><path d="M88 32 L156 40 L156 118 L88 112Z" fill="${P('white')}" class="ink"/>
    ${[0, 1, 2, 3, 4, 5].map(i => script(28, 54 + i * 10, 54, 90 + i, .55)).join('')}
    ${[0, 1, 2, 3, 4].map(i => script(96, 56 + i * 10, 52, 120 + i, .55)).join('')}
    <path d="M150 10 L120 80" stroke="${PAL.brown}" stroke-width="3"/><path d="M150 10 C170 20 168 36 140 50" fill="${P('white')}" class="ink thin"/>
    <rect x="162" y="78" width="12" height="34" rx="3" fill="${P('sky')}" class="ink"/><rect x="163" y="72" width="10" height="7" fill="${P('brown')}" class="ink thin"/>`, 'Diário de experimentação');
  principle.dose = () => ico(`
    ${[0, 1, 2, 3].map(i => `<g transform="translate(${24 + i * 40} ${92 - i * 20})"><path d="M-10 -24 h20 v8 c12 6 14 18 14 26 a24 24 0 0 1 -48 0 c0 -8 2 -20 14 -26z" fill="${P('white')}" class="ink"/><path d="M-22 6 a22 18 0 0 0 44 0z" fill="${PAL.purple}" opacity="${.85 - i * .25}"/></g>`).join('')}
    ${[0, 1, 2].map(i => `<path d="M${40 + i * 40} ${80 - i * 20} q8 -16 18 -10" class="ink thin" marker-end="url(#arr)"/>`).join('')}
    <rect x="128" y="104" width="44" height="12" rx="3" fill="${P('brown')}" class="ink"/>`, 'Escada de diluição');
  principle.unico = () => ico(`
    <path d="M60 116 h60 l-8 -14 h-44z" fill="${P('ochre')}" class="ink"/><path d="M70 102 h40 v-8 h-40z" fill="${P('gold')}" class="ink"/>
    <rect x="78" y="36" width="24" height="58" rx="6" fill="${P('sky')}" class="ink"/><rect x="81" y="26" width="18" height="12" fill="${P('brown')}" class="ink"/>
    <path d="M78 60 h24" class="ink thin"/>${script(80, 74, 20, 5, .4)}
    <path d="M40 40 q-20 20 0 40 M140 40 q20 20 0 40 M30 30 q-30 30 0 60 M150 30 q30 30 0 60" class="ink thin" opacity=".6"/>`, 'Um só frasco num pedestal');
  principle.individualizacao = () => ico(`
    ${[['rose', 30, 0], ['teal', 90, 1], ['yellow', 150, 2]].map(([c, x, k]) => `<g transform="translate(${x} 0)">
      ${k === 0 ? `<ellipse cx="0" cy="56" rx="22" ry="28" fill="${P(c)}" class="ink"/>` : k === 1 ? `<path d="M-18 84 L0 24 L18 84Z" fill="${P(c)}" class="ink"/>` : `<rect x="-20" y="34" width="40" height="50" rx="12" fill="${P(c)}" class="ink"/>`}
      <circle cx="-6" cy="50" r="3" fill="${INK}"/><circle cx="6" cy="50" r="3" fill="${INK}"/>
      <path d="M-8 84 l-2 30 h-8 M8 84 l2 30 h8" class="ink"/></g>`).join('')}
    ${[30, 90, 150].map((x, i) => `<path d="M${x - 4} ${18 - i * 2} h8" class="ink" stroke-width="${2 + i}"/>`).join('')}`, 'Três criaturas diferentes');
  principle.vital = () => ico(`
    <path d="M90 14 a12 12 0 1 1 -0.1 0 M90 38 C70 40 62 60 64 80 L72 80 L74 118 L86 118 L88 90 L92 90 L94 118 L106 118 L108 80 L116 80 C118 60 110 40 90 38" fill="${P('cream')}" class="ink"/>
    <path d="M90 62 m0 0 a3 3 0 0 1 6 0 a6 6 0 0 1 -12 0 a9 9 0 0 1 18 0 a12 12 0 0 1 -24 0 a15 15 0 0 1 30 0" fill="none" stroke="${PAL.orange}" stroke-width="2"/>
    ${[...Array(10)].map((_, i) => `<path d="M${90 + Math.cos(i * .63) * 40} ${66 + Math.sin(i * .63) * 40} l${Math.cos(i * .63) * 10} ${Math.sin(i * .63) * 10}" stroke="${PAL.yellow}" stroke-width="2"/>`).join('')}`, 'Figura com espiral de energia');
  principle.hering = () => ico(`
    <path d="M90 14 a12 12 0 1 1 -0.1 0 M90 38 C70 40 62 60 64 80 L72 80 L74 118 L86 118 L88 90 L92 90 L94 118 L106 118 L108 80 L116 80 C118 60 110 40 90 38" fill="${P('skin')}" class="ink"/>
    <circle cx="90" cy="62" r="7" fill="${P('red')}" class="ink thin"/>
    <path d="M98 62 H140 M82 62 H40 M90 74 V118" class="ink" marker-end="url(#arr)"/>
    <text x="150" y="60" class="lbl s">fora</text><text x="10" y="60" class="lbl s">fora</text><text x="100" y="124" class="lbl s">baixo</text>`, 'Setas de dentro para fora');

  /* ═══════════════ HISTÓRIA ═══════════════ */
  const history = {};
  const hp = (b, seed, lbl) => plate(340, 230, b, seed, lbl);
  history.hipocrates = () => hp(`<g filter="url(#pencil)">
    <path d="M170 62 V198" class="ink" stroke-width="3"/><path d="M150 200 h40 l-6 -12 h-28z" fill="${P('ochre')}" class="ink"/>
    <path d="M70 80 L270 80" class="ink" stroke-width="3"/><circle cx="170" cy="74" r="7" fill="${P('gold')}" class="ink"/>
    <path d="M80 80 L60 140 M80 80 L100 140 M260 80 L240 140 M260 80 L280 140" class="ink thin"/>
    <path d="M50 140 h60 a30 12 0 0 1 -60 0" fill="${P('gold')}" class="ink"/><path d="M230 140 h60 a30 12 0 0 1 -60 0" fill="${P('gold')}" class="ink"/>
    <path d="M66 136 c-6 -14 4 -20 6 -32 c8 10 12 18 8 32z" fill="${P('orange')}" class="ink"/>
    <g transform="translate(94 120)">${[0, 60, 120].map(a => `<path d="M0 -12 V12 M-4 -9 L0 -5 L4 -9 M-4 9 L0 5 L4 9" transform="rotate(${a})" stroke="${PAL.blue}" stroke-width="1.6" fill="none"/>`).join('')}</g>
    <path d="M244 136 c-6 -14 4 -20 6 -32 c8 10 12 18 8 32z M268 136 c-6 -14 4 -20 6 -32 c8 10 12 18 8 32z" fill="${P('orange')}" class="ink"/></g>
    <text x="80" y="176" text-anchor="middle" class="lbl">contrários</text><text x="260" y="176" text-anchor="middle" class="lbl">semelhantes</text>`, 101, 'Balança: contrários e semelhantes');
  history.paracelso = () => hp(`<g filter="url(#pencil)">
    <ellipse cx="100" cy="125" rx="58" ry="50" fill="${P('ochre')}" class="ink"/>
    <path d="M100 78 V172" class="ink"/><path d="M60 110 c10 -14 26 0 34 -14 M58 136 c14 -10 24 6 36 -4 M106 98 c10 10 24 -4 36 8 M106 126 c12 -10 24 6 36 -2 M70 156 c10 -6 18 6 26 0 M106 152 c10 6 22 -6 32 2" class="ink thin"/>
    <path d="M190 120 C186 76 230 64 260 70 C296 76 312 106 302 136 C296 160 270 172 240 168 C206 166 194 150 190 120Z" fill="${P('rose')}" class="ink"/>
    <path d="M246 70 V168 M202 110 c10 -14 26 0 34 -14 M200 140 c14 -10 24 6 36 -4 M254 96 c10 10 24 -4 36 8 M254 128 c12 -10 24 6 36 -2" class="ink thin"/>
    <path d="M150 125 h26" class="ink" marker-start="url(#arr)" marker-end="url(#arr)"/></g>
    <text x="100" y="200" text-anchor="middle" class="lbl">noz em corte</text><text x="246" y="200" text-anchor="middle" class="lbl">cérebro (vista de cima)</text>`, 113, 'Noz em corte ao lado de um cérebro');
  history.quina = () => hp(`<g filter="url(#pencil)">
    <path d="M40 200 C70 150 100 110 150 70" class="ink" stroke-width="3"/>
    ${leaf(78, 150, 46, -150, 'green')}${leaf(96, 124, 50, -20, 'leaf')}${leaf(120, 100, 44, -160, 'green')}${leaf(140, 82, 40, 10, 'leaf')}
    ${[[150, 62], [162, 70], [156, 52], [168, 58]].map(([x, y]) => flower(x, y, 9, 5, 'pink', 'rose')).join('')}
    <!-- rolo de casca em corte -->
    <g transform="translate(210 150)"><path d="M0 -20 L80 -30 A12 22 0 0 1 80 14 L0 24" fill="${P('brown')}" class="ink"/><ellipse cx="0" cy="2" rx="12" ry="22" fill="${P('orange')}" class="ink"/><path d="M0 2 m-6 0 a6 12 0 1 1 6 12 a3 6 0 1 1 -3 -6" class="ink thin"/></g>
    <!-- hemácia com parasita -->
    <g transform="translate(262 72)"><circle r="30" fill="${PAL.white}" class="ink" stroke-width="1.6"/><circle r="20" fill="${P('red')}" class="ink"/><circle cx="4" cy="-2" r="6" fill="none" stroke="${PAL.purple}" stroke-width="2.4"/><circle cx="9" cy="-4" r="2" fill="${PAL.purple}"/></g></g>
    ${lab(250, 170, 290, 208, 'casca (quinina)', 'end')}${lab(266, 70, 300, 116, 'plasmódio na hemácia', 'end')}${lab(154, 60, 120, 40, 'flor da quina', 'end')}`, 127, 'Ramo de quina, casca enrolada e parasita da malária');
  history.organon = () => hp(`<g filter="url(#pencil)">
    <path d="M40 80 Q110 64 168 86 L168 196 Q110 176 40 192Z" fill="${P('white')}" class="ink"/>
    <path d="M168 86 Q226 64 300 80 L300 192 Q226 176 168 196Z" fill="${P('cream')}" class="ink"/>
    <path d="M36 84 L36 198 Q110 182 168 202 Q226 182 304 198 L304 84" fill="none" stroke="${PAL.brown}" stroke-width="4"/>
    <path d="M232 70 L232 214 L238 206 L244 214 L244 70" fill="${P('red')}" class="ink thin"/>
    ${[...Array(7)].map((_, i) => script(52, 104 + i * 11, 100, 200 + i, .6)).join('')}
    ${[...Array(4)].map((_, i) => script(182, 110 + i * 11, 40, 230 + i, .6)).join('')}
    <g transform="translate(212 166)">${flower(0, 0, 14, 8, 'violet', 'gold')}</g></g>
    <text x="104" y="92" text-anchor="middle" class="lbl em">Organon</text>`, 139, 'Livro aberto do Organon');
  history.navio = () => hp(`<g filter="url(#pencil)">
    <path d="M180 170 C190 120 210 70 236 64 C262 60 270 110 278 170Z" fill="${P('green')}" class="ink"/>
    <path d="M250 170 C256 150 274 136 292 140 C312 144 318 160 320 170Z" fill="${P('leaf')}" class="ink"/>
    <path d="M24 170 H320" class="ink thin"/>
    ${[[300, 120], [40, 60]].map(([x, y]) => `<path d="M${x} ${y} q8 -8 16 0 q8 -8 16 0" class="ink thin"/>`).join('')}</g>
    <g class="anim"><g class="boat">
      <path d="M50 168 L150 168 L136 190 L62 190Z" fill="${P('brown')}" stroke="${INK}"/>
      <path d="M86 168 V84 M118 168 V96" stroke="${INK}" stroke-width="2"/>
      <path d="M88 88 C108 100 108 140 88 150Z M120 100 C138 110 138 140 120 150Z" fill="${P('white')}" stroke="${INK}"/>
      <path d="M86 84 l14 5 l-14 5z" fill="${PAL.red}"/></g>
      <path class="waves" d="M-40 194 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="${PAL.blue}" stroke-width="3"/></g>
    ${lab(236, 70, 290, 52, 'Pão de Açúcar', 'start')}`, 151, 'Navio chegando ao Rio de Janeiro');
  history.colera = () => hp(`<g filter="url(#pencil)">
    <rect x="70" y="60" width="34" height="130" rx="6" fill="${P('teal')}" class="ink"/>
    <path d="M66 60 h42 l-6 -14 h-30z" fill="${P('teal')}" class="ink"/><circle cx="87" cy="40" r="8" fill="${P('gold')}" class="ink"/>
    <path d="M104 90 L150 70" class="ink" stroke-width="4"/><path d="M70 120 C44 120 40 130 42 142 L52 142 C52 134 56 132 70 132" fill="${P('teal')}" class="ink"/>
    <path d="M56 194 h62 v10 h-62z" fill="${P('gray')}" class="ink"/>
    <circle cx="228" cy="110" r="62" fill="${PAL.white}" class="ink" stroke-width="3"/><path d="M272 154 L310 196" class="ink" stroke-width="8"/>
    ${[...Array(9)].map((_, i) => `<path transform="translate(${196 + (i % 3) * 30 + (i > 5 ? 8 : 0)} ${84 + Math.floor(i / 3) * 26}) rotate(${i * 40})" d="M-8 2 C-6 -6 6 -6 8 0 M8 0 C12 4 16 2 18 6" fill="none" stroke="${PAL.red}" stroke-width="3.2" stroke-linecap="round"/>`).join('')}</g>
    <g class="anim"><path class="drip" d="M47 150 c-2 5 -4 8 -4 10 a4 4 0 0 0 8 0 c0 -2 -2 -5 -4 -10z" fill="${PAL.sky}" stroke="${INK}" stroke-width=".6"/></g>
    ${lab(87, 40, 130, 30, 'bomba da Broad Street')}${lab(250, 132, 300, 220 - 4, 'Vibrio cholerae', 'end')}`, 163, 'Bomba d’água de Londres e bactérias do cólera ao microscópio');
  history.penicilina = () => hp(`<g filter="url(#pencil)">
    <ellipse cx="170" cy="134" rx="120" ry="64" fill="${P('cream')}" class="ink" stroke-width="1.8"/>
    <ellipse cx="170" cy="130" rx="112" ry="58" fill="${P('yellow')}" opacity=".5"/>
    <ellipse cx="128" cy="124" rx="40" ry="24" fill="${P('white')}" class="ink thin" stroke-dasharray="3 3"/>
    <ellipse cx="128" cy="124" rx="18" ry="11" fill="${P('teal')}" class="ink"/>
    ${[...Array(14)].map((_, i) => { const a = i * .45; return `<circle cx="${128 + Math.cos(a) * 14}" cy="${124 + Math.sin(a) * 8}" r="3" fill="${P('green')}" class="ink thin"/>`; }).join('')}
    ${[...Array(22)].map((_, i) => { const r = rng(i + 3); const a = r() * 6.28, d = .55 + r() * .4; const x = 170 + Math.cos(a) * 104 * d, y = 130 + Math.sin(a) * 52 * d; return Math.hypot((x - 128) / 44, (y - 124) / 27) > 1 ? `<circle cx="${x}" cy="${y}" r="${3 + r() * 3}" fill="${P('ochre')}" class="ink thin"/>` : ''; }).join('')}
    </g>${lab(128, 124, 70, 50, 'fungo Penicillium', 'start')}${lab(160, 124, 318, 50, 'halo sem bactérias', 'end')}${lab(240, 150, 300, 196, 'colônias de bactérias', 'end')}`, 189, 'Placa de Petri com fungo e halo sem bactérias');
  history.agua = () => hp(waterNet(340, 230), 177, 'Rede de moléculas de água e ligações de hidrogênio');

  function waterNet(w, h) {
    const pts = []; const r = rng(4);
    for (let i = 0; i < 14; i++) pts.push([40 + (i % 5) * 62 + r() * 18, 70 + Math.floor(i / 5) * 56 + r() * 16]);
    let bonds = '';
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 78) bonds += `<path class="hb" style="animation-delay:${((i * 7 + j) % 10) * .23}s" d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${PAL.blue}" stroke-width="1.6" stroke-dasharray="2 4"/>`; }));
    const mols = pts.map(([x, y], i) => `<g class="mol" style="animation-delay:${i * .2}s;transform-origin:${x}px ${y}px"><circle cx="${x}" cy="${y}" r="11" fill="${P('red')}" stroke="${INK}"/><circle cx="${x - 11}" cy="${y + 8}" r="6.5" fill="${P('white')}" stroke="${INK}"/><circle cx="${x + 11}" cy="${y + 8}" r="6.5" fill="${P('white')}" stroke="${INK}"/></g>`).join('');
    return `<g class="anim">${bonds}${mols}</g><text x="${w / 2}" y="${h - 22}" text-anchor="middle" class="lbl">as pontes (- - -) se desfazem e refazem em ~1 trilionésimo de segundo</text>`;
  }

  /* ═══════════════ CIÊNCIA ═══════════════ */
  const science = {};
  science.sucussao = () => plate(480, 300, `
    <g filter="url(#pencil)">
      <path d="M40 220 L200 196 L240 214 L80 244Z" fill="${P('brown')}" class="ink"/><path d="M80 244 L240 214 L240 228 L80 258Z" fill="${P('ochre')}" class="ink"/>
      <path d="M40 220 L80 244 L80 258 L40 234Z" fill="${P('red')}" class="ink"/>
      ${[0, 1, 2].map(i => `<path d="M${90 + i * 4} ${249 - i * 2} L${236} ${220 - i * 2}" class="ink thin" opacity=".4"/>`).join('')}
      <!-- grade 1:99 -->
      <g transform="translate(290 70)">${[...Array(100)].map((_, i) => `<circle cx="${(i % 10) * 16}" cy="${Math.floor(i / 10) * 16}" r="5.5" fill="${i === 44 ? P('purple') : P('sky')}" class="ink thin"/>`).join('')}</g>
    </g>
    <g class="anim"><g class="shake" style="transform-origin:140px 200px">
      <rect x="126" y="96" width="28" height="96" rx="7" fill="${P('white')}" stroke="${INK}"/><rect x="129" y="140" width="22" height="49" rx="4" fill="${PAL.violet}" opacity=".6"/>
      <rect x="128" y="84" width="24" height="14" fill="${P('brown')}" stroke="${INK}"/>
      <path d="M118 120 C96 116 92 150 112 158 L156 158 C176 150 172 116 152 120 C150 106 120 106 118 120Z" fill="${P('skin')}" stroke="${INK}"/>
      <path d="M152 120 c6 4 8 14 0 18 M150 134 c6 4 6 12 0 16" fill="none" stroke="${INK}" stroke-width=".8"/>
    </g><path class="motion" d="M100 180 q-10 10 -4 22 M180 180 q10 10 4 22 M92 168 q-14 14 -6 30" fill="none" stroke="${INK}" stroke-width="1"/></g>
    ${lab(60, 230, 30, 280, 'livro de couro', 'start')}
    <text x="362" y="252" text-anchor="middle" class="lbl">1 gota da substância + 99 de água/álcool</text>
    <text x="362" y="268" text-anchor="middle" class="lbl em">= 1C (uma “centesimal”)</text>`, 211, 'Mão sacudindo um frasco contra um livro e grade de 1 em 100');

  science.agua = () => plate(480, 280, waterNet(480, 280), 223, 'Moléculas de água ligadas por pontes de hidrogênio');

  science.duplocego = () => plate(480, 300, `
    <g filter="url(#pencil)">
      <!-- dois frascos idênticos -->
      ${[160, 320].map((x, i) => `<g transform="translate(${x} 0)"><rect x="-16" y="80" width="32" height="76" rx="8" fill="${P('white')}" class="ink"/><rect x="-14" y="68" width="28" height="14" fill="${P('brown')}" class="ink"/>
        <rect x="-12" y="104" width="24" height="24" fill="${P('cream')}" class="ink thin"/><text y="122" text-anchor="middle" class="lbl em">${i ? 'B' : 'A'}</text>
        ${[...Array(5)].map((_, k) => `<circle cx="${-8 + (k % 3) * 8}" cy="${140 + Math.floor(k / 3) * 7}" r="3" fill="${P('white')}" class="ink thin"/>`).join('')}</g>`).join('')}
      <!-- envelope lacrado -->
      <path d="M200 190 h80 v52 h-80z M200 190 l40 30 l40 -30" fill="${P('cream')}" class="ink"/><circle cx="240" cy="220" r="8" fill="${P('red')}" class="ink"/>
      <!-- pesquisador vendado e paciente vendado -->
      ${[60, 420].map((x, i) => `<g transform="translate(${x} 0)"><circle cy="110" r="22" fill="${P('skin')}" class="ink"/><path d="M-24 104 h48 v10 h-48z" fill="${P(i ? 'teal' : 'purple')}" class="ink"/>
        <path d="M-28 196 C-28 136 28 136 28 196Z" fill="${P(i ? 'yellow' : 'white')}" class="ink"/></g>`).join('')}
    </g>
    <text x="240" y="60" text-anchor="middle" class="lbl">qual é o remédio e qual é o placebo?</text>
    <text x="240" y="262" text-anchor="middle" class="lbl">o segredo só é aberto no fim do estudo</text>
    <text x="60" y="214" text-anchor="middle" class="lbl s">médico</text><text x="420" y="214" text-anchor="middle" class="lbl s">paciente</text>`, 237, 'Ensaio duplo-cego: frascos A e B e pessoas vendadas');

  science.curva = () => {
    const d = 'M50 230 C80 222 100 120 140 96 C170 80 190 110 220 150 C260 200 320 222 440 228';
    return plate(480, 290, `
    <g filter="url(#pencil)">
      <path d="M50 60 V240 H450" class="ink" marker-end="url(#arr)"/>
      ${[...Array(10)].map((_, i) => `<path d="M${50 + (i + 1) * 40} 240 v5" class="ink thin"/><text x="${50 + (i + 1) * 40}" y="256" text-anchor="middle" class="lbl s">${i + 1}</text>`).join('')}
    </g>
    <path d="${d}" fill="none" stroke="${PAL.red}" stroke-width="3.5" stroke-linecap="round" class="drawline" pathLength="1"/>
    <g class="pill-mark"><path d="M140 96 V40" class="lead" stroke-dasharray="3 3"/><rect x="128" y="24" width="24" height="12" rx="6" fill="${P('violet')}" stroke="${INK}"/></g>
    <text x="158" y="34" class="lbl">tomou algo aqui, no pior momento</text>
    <text x="300" y="160" class="lbl">… e melhorou de qualquer jeito</text>
    <text x="250" y="276" text-anchor="middle" class="lbl s">dias de resfriado</text>
    <text x="40" y="54" class="lbl s">sintomas</text>`, 251, 'Curva natural de um resfriado');
  };

  /* Frasco da escada: pontos = moléculas esperadas */
  science.flask = (molsLog10) => {
    const r = rng(9); let dots = '';
    const n = molsLog10 >= 2 ? 60 : molsLog10 >= 1 ? 20 : molsLog10 >= 0 ? Math.max(1, Math.round(Math.pow(10, molsLog10))) : 0;
    for (let i = 0; i < n; i++) { const a = r() * 6.28, rr = Math.sqrt(r()) * 52; dots += `<circle cx="${110 + Math.cos(a) * rr}" cy="${188 + Math.sin(a) * rr * .8}" r="4" fill="${PAL.purple}" stroke="${INK}" stroke-width=".6"/>`; }
    let water = '';
    for (let i = 0; i < 46; i++) { const a = r() * 6.28, rr = Math.sqrt(r()) * 56; water += `<circle cx="${110 + Math.cos(a) * rr}" cy="${188 + Math.sin(a) * rr * .8}" r="2.2" fill="${PAL.sky}" opacity=".7"/>`; }
    return `<svg viewBox="0 0 220 270" class="art flask" role="img" aria-label="Frasco em corte com moléculas"><g filter="url(#pencil)">
      <path d="M90 30 h40 v50 c40 16 56 50 56 98 a76 76 0 0 1 -152 0 c0 -48 16 -82 56 -98z" fill="${P('white')}" class="ink" stroke-width="1.6"/>
      <path d="M38 160 C60 150 160 150 182 160 C186 220 150 250 110 250 C70 250 34 220 38 160Z" fill="${P('sky')}" opacity=".6"/>
      <rect x="86" y="16" width="48" height="16" rx="3" fill="${P('brown')}" class="ink"/></g>
      ${water}<g class="mols">${dots}</g></svg>`;
  };
  /* ícones de comparação para a escada */
  science.cmpIcon = (k) => {
    const I = {
      gota: `<path d="M60 20 c-14 26 -24 38 -24 50 a24 24 0 0 0 48 0 c0 -12 -10 -24 -24 -50z" fill="${P('violet')}" class="ink"/>`,
      colher: `<ellipse cx="44" cy="62" rx="26" ry="18" fill="${P('gray')}" class="ink"/><ellipse cx="44" cy="60" rx="18" ry="11" fill="${P('sky')}" class="ink thin"/><path d="M68 56 L112 36" class="ink" stroke-width="6"/>`,
      garrafa: `<path d="M50 14 h20 v14 c14 8 16 18 16 30 v40 a8 8 0 0 1 -8 8 h-36 a8 8 0 0 1 -8 -8 v-40 c0 -12 2 -22 16 -30z" fill="${P('sky')}" class="ink"/><rect x="50" y="8" width="20" height="8" fill="${P('blue')}" class="ink"/>`,
      balde: `<path d="M26 34 h68 l-8 70 h-52z" fill="${P('teal')}" class="ink"/><ellipse cx="60" cy="34" rx="34" ry="8" fill="${P('sky')}" class="ink"/><path d="M28 34 C30 0 90 0 92 34" class="ink"/>`,
      caixa: `<path d="M20 40 h80 v56 h-80z" fill="${P('blue')}" class="ink"/><ellipse cx="60" cy="40" rx="40" ry="10" fill="${P('sky')}" class="ink"/><path d="M30 96 v16 M90 96 v16" class="ink" stroke-width="3"/>`,
      piscina: `<path d="M10 50 L90 40 L112 70 L32 82Z" fill="${P('sky')}" class="ink"/>${[0, 1, 2, 3].map(i => `<path d="M${16 + i * 6} ${58 + i * 6} L${96 + i * 6} ${48 + i * 6}" class="ink thin" stroke-dasharray="3 2"/>`).join('')}<path d="M32 82 v10 L112 80 v-10" fill="${P('white')}" class="ink"/>`,
      lago: `<path d="M10 70 C20 50 50 54 70 50 C100 46 112 66 104 80 C96 96 40 98 20 90 C8 84 6 76 10 70Z" fill="${P('blue')}" class="ink"/><path d="M14 50 l10 -24 l10 24 M84 44 l12 -30 l12 30" fill="${P('green')}" class="ink"/>`,
      oceano: `<path d="M0 60 q15 -12 30 0 t30 0 t30 0 t30 0 V110 H0z" fill="${P('blue')}" class="ink"/><path d="M0 80 q15 -10 30 0 t30 0 t30 0 t30 0" class="ink thin"/><path d="M80 30 h30 l-6 14 h-24z M92 30 V8 l12 16 h-12" fill="${P('white')}" class="ink thin"/>`,
      terra: `<circle cx="60" cy="60" r="44" fill="${P('blue')}" class="ink"/><path d="M34 34 c10 -6 22 0 18 12 c-4 10 8 14 4 24 c-4 8 -16 4 -22 -4 c-6 -10 -8 -24 0 -32z M72 70 c8 -6 20 0 18 10 c-2 10 -14 14 -20 6 z" fill="${P('green')}" class="ink thin"/>`,
      sol: `<circle cx="60" cy="60" r="34" fill="${P('yellow')}" class="ink"/>${[...Array(12)].map((_, i) => `<path d="M${60 + Math.cos(i * .52) * 40} ${60 + Math.sin(i * .52) * 40} L${60 + Math.cos(i * .52) * 54} ${60 + Math.sin(i * .52) * 54}" stroke="${PAL.orange}" stroke-width="3"/>`).join('')}`,
      sistema: `<circle cx="60" cy="60" r="8" fill="${P('yellow')}" class="ink"/>${[18, 28, 40, 54].map((r, i) => `<ellipse cx="60" cy="60" rx="${r}" ry="${r * .45}" class="ink thin" fill="none"/><circle cx="${60 + r}" cy="60" r="${3 + i}" fill="${P(['red', 'blue', 'orange', 'ochre'][i])}" class="ink thin"/>`).join('')}`,
      estrelas: `${[...Array(16)].map((_, i) => { const r = rng(i + 40); const x = 10 + r() * 100, y = 10 + r() * 100, s = 2 + r() * 5; return `<path d="M${x} ${y - s} L${x + s * .3} ${y - s * .3} L${x + s} ${y} L${x + s * .3} ${y + s * .3} L${x} ${y + s} L${x - s * .3} ${y + s * .3} L${x - s} ${y} L${x - s * .3} ${y - s * .3}Z" fill="${PAL.yellow}" stroke="${INK}" stroke-width=".5"/>`; }).join('')}<circle cx="60" cy="60" r="40" fill="none" stroke="${PAL.sky}" stroke-width="2" stroke-dasharray="4 4"/>`
    };
    return `<svg viewBox="0 0 120 120" class="art cmp"><g filter="url(#pencil)">${I[k] || I.gota}</g></svg>`;
  };

  /* Planta para as bordas da linha do tempo (ramos, folhas, flores) */
  function vine(h, side, seed) {
    const r = rng(seed); const w = 70; let d = `M${side === 'l' ? 18 : w - 18} 0`; let y = 0; const pts = [];
    while (y < h) { const ny = Math.min(h, y + 120 + r() * 80); const x1 = 10 + r() * (w - 20), x2 = 10 + r() * (w - 20), x = 14 + r() * (w - 28); d += ` C${x1} ${y + 40} ${x2} ${ny - 40} ${x} ${ny}`; pts.push([x, ny]); y = ny; }
    return { d, w };
  }

  window.ART = { installDefs, complaint, principle, history, science, script, vine, leaf, flower, P, PAL };
})();
