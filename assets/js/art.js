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
