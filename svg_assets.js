/**
 * ========================================================
 * LABORATUVAR DENEYİ SAF SVG VARLIKLARI (svg_assets.js)
 * Temiz, ölçeklenebilir, CSS ile kontrol edilebilir vektörel çizimler
 * 
 * Varlıklar:
 * - tepsi: Paslanmaz çelik deney tepsisi (.svg-tray)
 * - cubuk: Metalik spatulalı karıştırma çubuğu (.svg-stick / .svg-spatula)
 * - elbezi: Mavi katlanmış laboratuvar havlusu (.svg-towel / .svg-elbezi)
 * - kap: 250ml dereceli cam beher (.svg-beaker / .svg-kap)
 * - maddea: Mavi kapaklı, pelet tanecikli Madde A şişesi (.svg-bottle / .svg-maddea)
 * - mavitup: Mavi reaktifli, dereceli Erlenmeyer balonu (.svg-erlenmeyer / .svg-mavitup)
 * - safsu: Mavi kapaklı, berrak distile saf su şişesi (.svg-bottle / .svg-safsu)
 * - Kontrol listesi ve ek modal simgeleri (malzemesec, calismaalani, etiket, tupler, etiketsiz)
 * ========================================================
 */

const svgAssets = {
  // 1. PASLANMAZ ÇELİK DENEY TEPSİSİ VE CAM BAGET
  tepsi: `<svg viewBox="0 0 320 140" width="100%" height="100%" class="svg-tray" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="trayRimSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="25%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="75%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="trayFloorSteel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="20%" stop-color="#475569"/>
      <stop offset="60%" stop-color="#64748b"/>
      <stop offset="90%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="brushedHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="65%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="glassRodBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="30%" stop-color="#e0f2fe" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#bae6fd" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.75"/>
    </linearGradient>
    <filter id="trayShadow" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#trayShadow)">
    <rect x="8" y="12" width="304" height="116" rx="22" fill="url(#trayRimSteel)"/>
    <rect x="10" y="14" width="300" height="112" rx="20" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-opacity="0.85"/>
    <rect x="22" y="24" width="276" height="92" rx="14" fill="url(#trayFloorSteel)" stroke="#334155" stroke-width="1.2"/>
    <rect x="22" y="24" width="276" height="92" rx="14" fill="url(#brushedHighlight)"/>
    <ellipse cx="160" cy="54" rx="115" ry="16" fill="#ffffff" fill-opacity="0.18"/>
    <!-- Sabit Cam Baget -->
    <g id="glass-stirring-rod" aria-label="Cam Baget">
      <rect x="42" y="44" width="236" height="8" rx="4" fill="#0f172a" opacity="0.35"/>
      <rect x="40" y="42" width="240" height="8" rx="4" fill="url(#glassRodBody)" stroke="rgba(255, 255, 255, 0.7)" stroke-width="0.9"/>
      <line x1="45" y1="44" x2="275" y2="44" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.95"/>
      <circle cx="43" cy="46" r="3.6" fill="#ffffff" opacity="0.85"/>
      <circle cx="277" cy="46" r="3.6" fill="#ffffff" opacity="0.85"/>
    </g>
  </g>
</svg>`,

  // 2. METAL SPATÜL / KAŞIK (PASLANMAZ ÇELİK)
  cubuk: `<svg viewBox="0 0 380 44" width="100%" height="100%" class="svg-stick svg-spatula svg-spoon" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="spoonSteelShaft" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="25%" stop-color="#ffffff"/>
      <stop offset="55%" stop-color="#cbd5e1"/>
      <stop offset="85%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="spatulaBladeSteel" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="40%" stop-color="#f8fafc"/>
      <stop offset="70%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <radialGradient id="spoonBowlSteel" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#f1f5f9"/>
      <stop offset="70%" stop-color="#cbd5e1"/>
      <stop offset="95%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </radialGradient>
    <filter id="spoonShadow" x="-5%" y="-20%" width="110%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0f172a" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#spoonShadow)">
    <path d="M 12 15 C 7 15, 5 18, 5 22 C 5 26, 7 29, 12 29 L 88 28 C 94 28, 100 25, 104 24 L 104 20 C 100 19, 94 16, 88 16 Z" fill="url(#spatulaBladeSteel)" stroke="#475569" stroke-width="0.9"/>
    <path d="M 12 17 L 86 18 C 90 18, 95 19.5, 98 21 L 14 20 C 9 20, 7 18.5, 12 17 Z" fill="#ffffff" fill-opacity="0.8"/>
    <rect x="100" y="19" width="234" height="6" rx="3" fill="url(#spoonSteelShaft)"/>
    <line x1="102" y1="20.5" x2="332" y2="20.5" stroke="#ffffff" stroke-width="1.4" stroke-opacity="0.9" stroke-linecap="round"/>
    <line x1="180" y1="19.5" x2="180" y2="24.5" stroke="#475569" stroke-width="1.2" opacity="0.6"/>
    <line x1="186" y1="19.5" x2="186" y2="24.5" stroke="#475569" stroke-width="1.2" opacity="0.6"/>
    <line x1="192" y1="19.5" x2="192" y2="24.5" stroke="#475569" stroke-width="1.2" opacity="0.6"/>
    <ellipse cx="352" cy="22" rx="22" ry="12" fill="url(#spoonBowlSteel)" stroke="#475569" stroke-width="1.1"/>
    <ellipse cx="350" cy="21" rx="17" ry="8" fill="none" stroke="#ffffff" stroke-width="1.3" opacity="0.85"/>
    <ellipse cx="347" cy="20" rx="6" ry="3" fill="#ffffff" opacity="0.6"/>
  </g>
</svg>`,

  // 3. MAVİ LABORATUVAR HAVLU / BEZİ
  elbezi: `<svg viewBox="0 0 160 120" width="100%" height="100%" class="svg-towel svg-elbezi" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="towelBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="towelTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="45%" stop-color="#2563eb"/>
      <stop offset="85%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
    <filter id="towelShadow" x="-8%" y="-8%" width="120%" height="125%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#towelShadow)">
    <path d="M 20 62 C 16 62, 14 66, 14 74 L 14 86 C 14 96, 20 98, 28 98 L 132 98 C 140 98, 144 94, 144 86 L 144 74 C 144 66, 140 62, 132 62 Z" fill="url(#towelBaseGrad)"/>
    <path d="M 14 80 C 24 81, 134 81, 144 80" stroke="#1e3a8a" stroke-width="2.5" fill="none" opacity="0.6"/>
    <path d="M 22 34 C 18 34, 16 38, 16 46 L 16 64 C 16 72, 20 74, 28 74 L 132 74 C 140 74, 142 70, 142 62 L 140 44 C 140 36, 136 34, 126 34 C 95 38, 60 38, 22 34 Z" fill="url(#towelTopGrad)"/>
    <path d="M 24 40 C 60 43, 98 43, 134 39" stroke="#60a5fa" stroke-width="1.5" fill="none" opacity="0.75" stroke-dasharray="3,2"/>
    <path d="M 22 48 C 60 51, 98 51, 136 47" stroke="#60a5fa" stroke-width="1" fill="none" opacity="0.5" stroke-dasharray="4,2"/>
    <path d="M 20 56 C 60 59, 98 59, 138 55" stroke="#60a5fa" stroke-width="1" fill="none" opacity="0.4" stroke-dasharray="4,2"/>
    <path d="M 16 68 C 45 70, 95 70, 140 68" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.4"/>
    <ellipse cx="78" cy="42" rx="45" ry="6" fill="#ffffff" fill-opacity="0.18"/>
  </g>
</svg>`,

  // 4. 250ML DERECELİ BOŞ BEHER (GAGA VE BORO 3.3 MARKING SPOTLU)
  kap: `<svg viewBox="0 0 190 250" width="100%" height="100%" class="svg-beaker svg-kap" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="beakerGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="8%" stop-color="#e0f2fe" stop-opacity="0.1"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="92%" stop-color="#e0f2fe" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.48"/>
    </linearGradient>
    <linearGradient id="beakerBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="60%" stop-color="#bae6fd" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.6"/>
    </linearGradient>
    <filter id="beakerShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.32"/>
    </filter>
  </defs>
  <g filter="url(#beakerShadow)">
    <path d="M 28 20 L 168 20 L 168 228 C 168 240, 154 246, 98 246 C 42 246, 28 240, 28 228 Z" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(203, 213, 225, 0.35)" stroke-width="1.5"/>
    <path d="M 32 232 C 38 243, 56 245, 98 245 C 140 245, 158 243, 164 232 C 160 240, 138 243, 98 243 C 58 243, 36 240, 32 232 Z" fill="url(#beakerBaseGrad)"/>
    <rect x="74" y="55" width="48" height="28" rx="2" fill="rgba(255, 255, 255, 0.28)" stroke="rgba(255, 255, 255, 0.45)" stroke-width="0.9"/>
    <text x="98" y="68" font-family="'Outfit', 'Segoe UI', Roboto, sans-serif" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">BORO 3.3</text>
    <text x="98" y="78" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">250 ml</text>
    <line x1="30" y1="50" x2="64" y2="50" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    <text x="70" y="54" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800" fill="#ffffff">250</text>
    <line x1="30" y1="70" x2="48" y2="70" stroke="#ffffff" stroke-width="1.3" opacity="0.8" stroke-linecap="round"/>
    <line x1="30" y1="90" x2="64" y2="90" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    <text x="70" y="94" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800" fill="#ffffff">200</text>
    <line x1="30" y1="110" x2="48" y2="110" stroke="#ffffff" stroke-width="1.3" opacity="0.8" stroke-linecap="round"/>
    <line x1="30" y1="130" x2="68" y2="130" stroke="#38bdf8" stroke-width="2.6" stroke-linecap="round"/>
    <text x="74" y="134" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" fill="#38bdf8">150 ml</text>
    <line x1="30" y1="150" x2="48" y2="150" stroke="#ffffff" stroke-width="1.3" opacity="0.8" stroke-linecap="round"/>
    <line x1="30" y1="170" x2="64" y2="170" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    <text x="70" y="174" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800" fill="#ffffff">100</text>
    <line x1="30" y1="190" x2="48" y2="190" stroke="#ffffff" stroke-width="1.3" opacity="0.8" stroke-linecap="round"/>
    <line x1="30" y1="210" x2="64" y2="210" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    <text x="70" y="214" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800" fill="#ffffff">50</text>
    <path d="M 16 16 C 22 16, 26 18, 28 20 L 28 228 C 28 242, 44 248, 98 248 C 152 248, 168 242, 168 228 L 168 20 C 168 18, 172 16, 176 16" fill="url(#beakerGlassGrad)" stroke="#e2e8f0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 16 16 Q 22 20 28 22" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="98" cy="20" rx="70" ry="4" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.5"/>
    <path d="M 32 28 L 32 230" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.75"/>
    <path d="M 37 36 L 37 224" stroke="#e0f2fe" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
    <path d="M 164 28 L 164 230" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/>
  </g>
</svg>`,

  // 5. MADDE A KİMYASAL ŞİŞESİ (BEYAZ KRİSTAL GRANÜL TOZU)
  maddea: `<svg viewBox="0 0 110 200" width="100%" height="100%" class="svg-bottle svg-maddea" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="maddeACapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#172554"/>
      <stop offset="18%" stop-color="#1e3a8a"/>
      <stop offset="40%" stop-color="#2563eb"/>
      <stop offset="60%" stop-color="#60a5fa"/>
      <stop offset="80%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
    <linearGradient id="maddeAGlassBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="12%" stop-color="#f1f5f9" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="85%" stop-color="#f8fafc" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="maddeAGranuleFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="45%" stop-color="#f8fafc"/>
      <stop offset="80%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <radialGradient id="crystalFacetGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="90%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </radialGradient>
    <filter id="bottleShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.32"/>
    </filter>
  </defs>
  <g filter="url(#bottleShadow)">
    <path d="M 36 44 L 74 44 C 80 50, 94 62, 94 78 L 94 175 C 94 186, 86 190, 55 190 C 24 190, 16 186, 16 175 L 16 78 C 16 62, 30 50, 36 44 Z" fill="url(#maddeAGlassBody)" stroke="#94a3b8" stroke-width="1.8"/>
    <path id="maddeA-content" d="M 18 106 C 36 103, 74 103, 92 106 L 92 174 C 92 184, 84 188, 55 188 C 26 188, 18 184, 18 174 Z" fill="url(#maddeAGranuleFill)"/>
    <g id="maddeA-granules" opacity="0.9">
      <circle cx="28" cy="172" r="3.2" fill="url(#crystalFacetGrad)"/>
      <circle cx="38" cy="174" r="3.5" fill="url(#crystalFacetGrad)"/>
      <circle cx="49" cy="175" r="3.2" fill="url(#crystalFacetGrad)"/>
      <circle cx="60" cy="174" r="3.4" fill="url(#crystalFacetGrad)"/>
      <circle cx="71" cy="173" r="3.2" fill="url(#crystalFacetGrad)"/>
      <circle cx="82" cy="171" r="3.0" fill="url(#crystalFacetGrad)"/>
      <circle cx="24" cy="162" r="3.4" fill="url(#crystalFacetGrad)"/>
      <circle cx="35" cy="164" r="3.6" fill="url(#crystalFacetGrad)"/>
      <circle cx="46" cy="165" r="3.8" fill="url(#crystalFacetGrad)"/>
      <circle cx="58" cy="164" r="3.8" fill="url(#crystalFacetGrad)"/>
      <circle cx="70" cy="163" r="3.5" fill="url(#crystalFacetGrad)"/>
      <circle cx="82" cy="162" r="3.2" fill="url(#crystalFacetGrad)"/>
      <circle cx="26" cy="150" r="3.5" fill="url(#crystalFacetGrad)"/>
      <circle cx="38" cy="151" r="3.8" fill="url(#crystalFacetGrad)"/>
      <circle cx="50" cy="152" r="4.0" fill="url(#crystalFacetGrad)"/>
      <circle cx="62" cy="151" r="3.8" fill="url(#crystalFacetGrad)"/>
      <circle cx="74" cy="150" r="3.5" fill="url(#crystalFacetGrad)"/>
      <circle cx="84" cy="149" r="3.2" fill="url(#crystalFacetGrad)"/>
      <circle cx="26" cy="115" r="3.2" fill="url(#crystalFacetGrad)"/>
      <circle cx="36" cy="112" r="3.5" fill="url(#crystalFacetGrad)"/>
      <circle cx="47" cy="111" r="3.8" fill="url(#crystalFacetGrad)"/>
      <circle cx="58" cy="110" r="3.8" fill="url(#crystalFacetGrad)"/>
      <circle cx="69" cy="111" r="3.6" fill="url(#crystalFacetGrad)"/>
      <circle cx="80" cy="113" r="3.4" fill="url(#crystalFacetGrad)"/>
      <rect x="33" y="108" width="2" height="2" transform="rotate(45 34 109)" fill="#ffffff"/>
      <rect x="52" y="106" width="2.5" height="2.5" transform="rotate(45 53 107)" fill="#ffffff"/>
      <rect x="67" y="108" width="2" height="2" transform="rotate(45 68 109)" fill="#ffffff"/>
    </g>
    <rect x="19" y="122" width="72" height="44" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    <rect x="22" y="125" width="66" height="6" fill="#ef4444" rx="1.5"/>
    <text x="55" y="146" font-family="'Outfit', 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle">Madde A</text>
    <text x="55" y="158" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600" fill="#64748b" text-anchor="middle">50.0 g Granül</text>
    <path d="M 22 75 L 22 178" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.85"/>
    <path d="M 88 75 L 88 178" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.45"/>
    <path d="M 30 50 C 24 58, 20 68, 20 78" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.75" fill="none"/>
    <g id="cap" class="svg-bottle-cap-group bottle-cap" style="transform-origin: 55px 25px;">
      <rect x="27" y="38" width="56" height="7" rx="2" fill="#172554"/>
      <rect x="29" y="12" width="52" height="28" rx="4" fill="url(#maddeACapGrad)" stroke="#1d4ed8" stroke-width="1.2"/>
      <line x1="34" y1="14" x2="34" y2="38" stroke="#60a5fa" stroke-width="1.5" opacity="0.7"/>
      <line x1="40" y1="14" x2="40" y2="38" stroke="#60a5fa" stroke-width="1.5" opacity="0.7"/>
      <line x1="46" y1="14" x2="46" y2="38" stroke="#60a5fa" stroke-width="1.5" opacity="0.7"/>
      <line x1="52" y1="14" x2="52" y2="38" stroke="#93c5fd" stroke-width="1.8" opacity="0.95"/>
      <line x1="58" y1="14" x2="58" y2="38" stroke="#60a5fa" stroke-width="1.5" opacity="0.7"/>
      <line x1="64" y1="14" x2="64" y2="38" stroke="#60a5fa" stroke-width="1.5" opacity="0.7"/>
      <line x1="70" y1="14" x2="70" y2="38" stroke="#60a5fa" stroke-width="1.5" opacity="0.7"/>
      <line x1="76" y1="14" x2="76" y2="38" stroke="#172554" stroke-width="1.5" opacity="0.8"/>
    </g>
  </g>
</svg>`,

  // 6. MAVİ REAKTİF DOLU ERLENMEYER (MAVİTÜP)
  mavitup: `<svg viewBox="0 0 130 180" width="100%" height="100%" class="svg-erlenmeyer svg-mavitup" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="erlenLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="30%" stop-color="#0369a1"/>
      <stop offset="70%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <radialGradient id="erlenMeniscusGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#7dd3fc"/>
      <stop offset="60%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </radialGradient>
    <linearGradient id="erlenGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="18%" stop-color="#e0f2fe" stop-opacity="0.1"/>
      <stop offset="82%" stop-color="#e0f2fe" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.35"/>
    </linearGradient>
    <filter id="erlenShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#erlenShadow)">
    <path d="M 52 18 L 78 18 C 80 20, 80 24, 76 26 L 76 60 L 114 154 C 118 164, 108 170, 96 170 L 34 170 C 22 170, 12 164, 16 154 L 54 60 L 54 26 C 50 24, 50 20, 52 18 Z" fill="url(#erlenGlassGrad)" stroke="#bae6fd" stroke-width="2"/>
    <path d="M 39 96 C 45 93, 85 93, 91 96 L 112 153 C 115 162, 106 168, 95 168 L 35 168 C 24 168, 15 162, 18 153 Z" fill="url(#erlenLiquidGrad)"/>
    <ellipse cx="65" cy="96" rx="26" ry="5.5" fill="url(#erlenMeniscusGrad)" stroke="#bae6fd" stroke-width="1.2"/>
    <line x1="60" y1="78" x2="74" y2="78" stroke="#ffffff" stroke-width="1.8"/>
    <text x="78" y="81" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="bold" fill="#ffffff">250</text>
    <line x1="55" y1="98" x2="74" y2="98" stroke="#ffffff" stroke-width="2"/>
    <text x="78" y="101" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">200</text>
    <line x1="49" y1="120" x2="74" y2="120" stroke="#ffffff" stroke-width="2"/>
    <text x="78" y="123" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">150</text>
    <line x1="43" y1="142" x2="74" y2="142" stroke="#ffffff" stroke-width="2"/>
    <text x="78" y="145" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">100</text>
    <ellipse cx="65" cy="20" rx="15" ry="4" fill="none" stroke="#ffffff" stroke-width="2"/>
    <path d="M 57 26 L 57 58 L 26 150" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
    <path d="M 73 26 L 73 58 L 104 150" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
  </g>
</svg>`,

  // 7. SAF SU ŞİŞESİ (DİSTİLE SU - MENİSKÜSLÜ BERRAK DOLUM)
  safsu: `<svg viewBox="0 0 110 200" width="100%" height="100%" class="svg-bottle svg-safsu" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="waterCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0369a1"/>
      <stop offset="25%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="75%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <linearGradient id="pureWaterInner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.85"/>
      <stop offset="35%" stop-color="#f0f9ff" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#bae6fd" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="safSuGlassBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75"/>
      <stop offset="14%" stop-color="#e0f2fe" stop-opacity="0.18"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="86%" stop-color="#bae6fd" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.5"/>
    </linearGradient>
    <filter id="safSuShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#safSuShadow)">
    <path d="M 36 44 L 74 44 C 80 50, 94 62, 94 78 L 94 175 C 94 186, 86 190, 55 190 C 24 190, 16 186, 16 175 L 16 78 C 16 62, 30 50, 36 44 Z" fill="url(#safSuGlassBody)" stroke="#94a3b8" stroke-width="1.8"/>
    <path id="safSu-content" d="M 18 78 C 35 75, 75 75, 92 78 L 92 175 C 92 184, 84 188, 55 188 C 26 188, 18 184, 18 175 Z" fill="url(#pureWaterInner)"/>
    <ellipse id="safSu-meniscus" cx="55" cy="78" rx="37" ry="5.5" fill="none" stroke="#7dd3fc" stroke-width="1.8"/>
    <ellipse cx="55" cy="78" rx="34" ry="4" fill="#ffffff" fill-opacity="0.25"/>
    <rect x="19" y="118" width="72" height="44" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    <rect x="22" y="121" width="66" height="6" fill="#0284c7" rx="1.5"/>
    <text x="55" y="142" font-family="'Outfit', 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#0f172a" text-anchor="middle">Saf Su</text>
    <text x="55" y="154" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#0284c7" text-anchor="middle">Distile H₂O (250 ml)</text>
    <path d="M 22 75 L 22 178" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.88"/>
    <path d="M 88 75 L 88 178" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
    <path d="M 30 50 C 24 58, 20 68, 20 78" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8" fill="none"/>
    <g id="cap" class="svg-bottle-cap-group bottle-cap" style="transform-origin: 55px 25px;">
      <rect x="27" y="38" width="56" height="7" rx="2" fill="#0369a1"/>
      <rect x="29" y="12" width="52" height="28" rx="4" fill="url(#waterCapGrad)" stroke="#0284c7" stroke-width="1.2"/>
      <line x1="35" y1="14" x2="35" y2="38" stroke="#7dd3fc" stroke-width="1.5" opacity="0.8"/>
      <line x1="42" y1="14" x2="42" y2="38" stroke="#7dd3fc" stroke-width="1.5" opacity="0.8"/>
      <line x1="49" y1="14" x2="49" y2="38" stroke="#bae6fd" stroke-width="1.8" opacity="0.95"/>
      <line x1="56" y1="14" x2="56" y2="38" stroke="#7dd3fc" stroke-width="1.5" opacity="0.8"/>
      <line x1="63" y1="14" x2="63" y2="38" stroke="#7dd3fc" stroke-width="1.5" opacity="0.8"/>
      <line x1="70" y1="14" x2="70" y2="38" stroke="#0369a1" stroke-width="1.5" opacity="0.8"/>
    </g>
  </g>
</svg>`,

  // 8. KONTROL LİSTESİ SİMGESİ: MALZEMELERİ SEÇ
  malzemesec: `<svg viewBox="0 0 64 64" width="100%" height="100%" class="svg-icon-select" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconSelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="52" height="52" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>
  <!-- Beher -->
  <path d="M 16 22 L 32 22 L 32 46 C 32 49, 30 50, 24 50 C 18 50, 16 49, 16 46 Z" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linejoin="round"/>
  <line x1="15" y1="22" x2="33" y2="22" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 18 36 C 22 35, 26 35, 30 36 L 30 46 C 30 48, 28 48, 24 48 C 20 48, 18 48, 18 46 Z" fill="#38bdf8" fill-opacity="0.45"/>
  <!-- Erlenmeyer -->
  <path d="M 40 22 L 46 22 L 46 30 L 52 46 C 53 49, 51 50, 43 50 C 35 50, 33 49, 34 46 L 40 30 Z" fill="none" stroke="#0369a1" stroke-width="2.5" stroke-linejoin="round"/>
  <line x1="39" y1="22" x2="47" y2="22" stroke="#0369a1" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 37 40 L 49 40 L 51 46 C 51 48, 48 48, 43 48 C 38 48, 35 48, 35 46 Z" fill="#0284c7" fill-opacity="0.4"/>
</svg>`,

  // 9. KONTROL LİSTESİ SİMGESİ: ÇALIŞMA ALANINI KONTROL ET
  calismaalani: `<svg viewBox="0 0 64 64" width="100%" height="100%" class="svg-icon-workspace" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="6" width="52" height="52" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <!-- Pano / Checklist Formu -->
  <rect x="18" y="16" width="28" height="36" rx="4" fill="#ffffff" stroke="#16a34a" stroke-width="2.5"/>
  <rect x="25" y="12" width="14" height="7" rx="2" fill="#22c55e"/>
  <!-- Satırlar ve Onay İşareti -->
  <path d="M 23 28 L 27 32 L 35 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="24" y1="38" x2="40" y2="38" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="24" y1="44" x2="36" y2="44" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,

  // 10. KONTROL LİSTESİ SİMGESİ: KABI ETİKETLE
  etiket: `<svg viewBox="0 0 64 64" width="100%" height="100%" class="svg-icon-label" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="6" width="52" height="52" rx="14" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>
  <!-- Etiket Flama Formu -->
  <path d="M 18 20 L 38 20 L 48 30 L 38 44 L 18 44 Z" fill="#ea580c" stroke="#c2410c" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="26" cy="32" r="3" fill="#ffffff"/>
  <line x1="32" y1="28" x2="42" y2="28" stroke="#fed7aa" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="34" x2="38" y2="34" stroke="#fed7aa" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  // 11. DİĞER MODAL SİMGELERİ (Test tüpleri & Etiketsiz şişe)
  tupler: `<svg viewBox="0 0 110 160" width="100%" height="100%" class="svg-tubes" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="130" width="80" height="18" rx="4" fill="#475569"/>
  <rect x="25" y="30" width="16" height="100" rx="8" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.8"/>
  <rect x="47" y="30" width="16" height="100" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="1.8"/>
  <rect x="69" y="30" width="16" height="100" rx="8" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.8"/>
  <path d="M 27 75 L 39 75 L 39 122 C 39 126, 27 126, 27 122 Z" fill="#0284c7" opacity="0.75"/>
  <path d="M 49 85 L 61 85 L 61 122 C 61 126, 49 126, 49 122 Z" fill="#eab308" opacity="0.75"/>
  <path d="M 71 65 L 83 65 L 83 122 C 83 126, 71 126, 71 122 Z" fill="#22c55e" opacity="0.75"/>
</svg>`,

  etiketsiz: `<svg viewBox="0 0 110 180" width="100%" height="100%" class="svg-bottle svg-etiketsiz" xmlns="http://www.w3.org/2000/svg">
  <rect x="29" y="8" width="52" height="26" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
  <path d="M 36 38 L 74 38 C 80 44, 94 56, 94 72 L 94 158 C 94 168, 86 172, 55 172 C 24 172, 16 168, 16 158 L 16 72 C 16 56, 30 44, 36 38 Z" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
  <!-- Boş/Tehlike İşareti Etiket -->
  <rect x="17" y="84" width="76" height="46" rx="2" fill="#ffffff" stroke="#fca5a5" stroke-width="1"/>
  <text x="55" y="114" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold" fill="#dc2626" text-anchor="middle">?</text>
  <path d="M 55 92 L 55 104" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
};

// Aliases (Büyük/küçük harf ve dosya adı uyumluluğu için takma adlar)
svgAssets.maddeA = svgAssets.maddea;
svgAssets.safSu = svgAssets.safsu;
svgAssets['Maddea.png'] = svgAssets.maddea;
svgAssets['safsu.png'] = svgAssets.safsu;
svgAssets['kap.png'] = svgAssets.kap;
svgAssets['mavitup.png'] = svgAssets.mavitup;
svgAssets['elbezi.png'] = svgAssets.elbezi;
svgAssets['cubuk.png'] = svgAssets.cubuk;
svgAssets['tepsi.png'] = svgAssets.tepsi;
svgAssets['tupler.png'] = svgAssets.tupler;
svgAssets['etiketsiz.png'] = svgAssets.etiketsiz;

// Global Window Desteği
if (typeof window !== 'undefined') {
  window.svgAssets = svgAssets;
}
