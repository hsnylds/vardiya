/**
 * ========================================================
 * KİMYA / FEN DENEYİ SİMÜLASYONU (script_3_3.js)
 * 3D Asenkron Animasyon Kontrolcüsü (async/await & Promise delay)
 * 
 * 3D Senaryo Sırası:
 * 1. Saf su kapağı açılır (translateY(-40px), opacity: 0).
 * 2. Saf su şişesi havalanır, beherin üzerine gelir; translateZ(60px),
 *    rotateX(45deg) ve rotateZ(-36deg) ile kameraya doğru 3D eğilir.
 * 3. Şişeden beherin içine 3D akış başlar, beherin içindeki eliptik
 *    menisküslü sıvı (.liquid-fill / .beaker-liquid-surface) %0'dan %55'e yükselir.
 * 4. Akış biter, şişe dikleşip başlangıç konumuna 3D olarak geri iner.
 * 5. Madde A için aynı 3D adımlar tekrarlanır (kapak açılır, şişe 3D eğilir,
 *    dökülürken partiküller düşer, sıvı bulanıklaşır %65 olur, şişe yerine döner).
 * 6. Beher ön cam katmanı (#beaker-front-glass-overlay) aktifleşir.
 *    Karıştırma çubuğu havalanarak beherin içine girer; arka camın önünde,
 *    ön camın arkasında kalacak şekilde derinlik katmanına yerleşir.
 *    CSS keyframe (@keyframes stir-action-3d) ile 3-4 saniye boyunca
 *    rotateX, rotateY ve rotateZ kombinasyonuyla dairesel precessing karıştırma yapar.
 * 7. Karıştırma bitince çubuk yukarı çekilip tepsideki ilk konumuna geri döner.
 * ========================================================
 */

// Bekleme süresi için yardımcı fonksiyon
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Element merkez koordinatlarını ekran boyutundan bağımsız,
 * getBoundingClientRect() ile dinamik hesaplayan yardımcı fonksiyon
 */
/**
 * Element merkez ve ağız koordinatlarını ekran boyutundan bağımsız,
 * getBoundingClientRect() ile dinamik hesaplayan yardımcı fonksiyon
 */
function getCenterCoords(element) {
    if (!element) return { x: 0, y: 0, left: 0, top: 0, width: 0, height: 0, mouthX: 0, mouthY: 0 };
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2),
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        mouthX: rect.left + (rect.width / 2),
        mouthY: rect.top + (rect.height * 0.12)
    };
}

/**
 * Çevrimdışı/Yerel Protokol Uyumlu SVG Şablon Sağlayıcı
 */
function getBottleSvgMarkup(matId) {
    const id = (matId || '').toLowerCase();
    if (id === 'safsu') {
      return `<svg viewBox="0 0 110 180" width="100%" height="100%" class="svg-bottle svg-safsu" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="waterCapBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e40af"/><stop offset="25%" stop-color="#3b82f6"/><stop offset="50%" stop-color="#60a5fa"/><stop offset="75%" stop-color="#2563eb"/><stop offset="100%" stop-color="#172554"/>
    </linearGradient>
    <linearGradient id="pureWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8"/><stop offset="35%" stop-color="#f0f9ff" stop-opacity="0.5"/><stop offset="70%" stop-color="#bae6fd" stop-opacity="0.6"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="waterBottleGlass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65"/><stop offset="15%" stop-color="#e2e8f0" stop-opacity="0.15"/><stop offset="85%" stop-color="#ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.45"/>
    </linearGradient>
    <filter id="waterBottleShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#waterBottleShadow)">
    <path d="M 20 68 C 35 65, 75 65, 90 68 L 93 158 C 93 167, 85 170, 55 170 C 25 170, 17 167, 17 158 Z" fill="url(#pureWaterGrad)"/>
    <ellipse cx="55" cy="68" rx="35" ry="5" fill="none" stroke="#bae6fd" stroke-width="1.8"/>
    <path d="M 36 38 L 74 38 C 80 44, 94 56, 94 72 L 94 158 C 94 168, 86 172, 55 172 C 24 172, 16 168, 16 158 L 16 72 C 16 56, 30 44, 36 38 Z" fill="url(#waterBottleGlass)" stroke="#cbd5e1" stroke-width="1.8"/>
    <rect x="17" y="84" width="76" height="46" rx="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <text x="55" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Saf Su</text>
    <path d="M 22 72 L 22 160" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M 88 72 L 88 160" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
    <g class="svg-bottle-cap-group" id="cap">
      <rect x="27" y="32" width="56" height="6" rx="2" fill="#1e40af"/>
      <rect x="29" y="8" width="52" height="26" rx="4" fill="url(#waterCapBlueGrad)" stroke="#1d4ed8" stroke-width="1"/>
      <line x1="33" y1="10" x2="33" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="38" y1="10" x2="38" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="43" y1="10" x2="43" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="48" y1="10" x2="48" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="53" y1="10" x2="53" y2="32" stroke="#93c5fd" stroke-width="1.5" opacity="0.9"/><line x1="58" y1="10" x2="58" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="63" y1="10" x2="63" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="68" y1="10" x2="68" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="73" y1="10" x2="73" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="77" y1="10" x2="77" y2="32" stroke="#1e3a8a" stroke-width="1.5" opacity="0.7"/>
    </g>
  </g>
</svg>`;
    } else if (id === 'maddea') {
      return `<svg viewBox="0 0 110 180" width="100%" height="100%" class="svg-bottle svg-maddea" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="capBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e40af"/><stop offset="25%" stop-color="#3b82f6"/><stop offset="50%" stop-color="#60a5fa"/><stop offset="75%" stop-color="#2563eb"/><stop offset="100%" stop-color="#172554"/>
    </linearGradient>
    <radialGradient id="pelletBallGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="60%" stop-color="#f1f5f9"/><stop offset="90%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#94a3b8"/>
    </radialGradient>
    <linearGradient id="bottleGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/><stop offset="15%" stop-color="#e2e8f0" stop-opacity="0.15"/><stop offset="85%" stop-color="#ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="#94a3b8" stop-opacity="0.45"/>
    </linearGradient>
    <filter id="bottleShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#bottleShadow)">
    <path d="M 36 38 L 74 38 C 80 44, 94 56, 94 72 L 94 158 C 94 168, 86 172, 55 172 C 24 172, 16 168, 16 158 L 16 72 C 16 56, 30 44, 36 38 Z" fill="url(#bottleGlassGrad)" stroke="#cbd5e1" stroke-width="1.8"/>
    <g>
      <circle cx="28" cy="158" r="5.5" fill="url(#pelletBallGrad)"/><circle cx="39" cy="160" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="50" cy="161" r="5.6" fill="url(#pelletBallGrad)"/><circle cx="61" cy="160" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="72" cy="159" r="5.5" fill="url(#pelletBallGrad)"/><circle cx="82" cy="158" r="5.2" fill="url(#pelletBallGrad)"/><circle cx="24" cy="148" r="5.5" fill="url(#pelletBallGrad)"/><circle cx="34" cy="150" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="45" cy="151" r="6" fill="url(#pelletBallGrad)"/><circle cx="56" cy="150" r="6" fill="url(#pelletBallGrad)"/><circle cx="67" cy="149" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="78" cy="148" r="5.5" fill="url(#pelletBallGrad)"/><circle cx="86" cy="147" r="5.2" fill="url(#pelletBallGrad)"/><circle cx="28" cy="138" r="5.6" fill="url(#pelletBallGrad)"/><circle cx="39" cy="139" r="6" fill="url(#pelletBallGrad)"/><circle cx="50" cy="140" r="6.2" fill="url(#pelletBallGrad)"/><circle cx="61" cy="139" r="6" fill="url(#pelletBallGrad)"/><circle cx="72" cy="138" r="5.7" fill="url(#pelletBallGrad)"/><circle cx="82" cy="137" r="5.4" fill="url(#pelletBallGrad)"/><circle cx="26" cy="80" r="5.5" fill="url(#pelletBallGrad)"/><circle cx="36" cy="78" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="47" cy="77" r="6" fill="url(#pelletBallGrad)"/><circle cx="58" cy="76" r="6" fill="url(#pelletBallGrad)"/><circle cx="69" cy="77" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="80" cy="79" r="5.5" fill="url(#pelletBallGrad)"/><circle cx="32" cy="70" r="5.5" fill="url(#pelletBallGrad)"/><circle cx="43" cy="69" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="54" cy="68" r="6" fill="url(#pelletBallGrad)"/><circle cx="65" cy="69" r="5.8" fill="url(#pelletBallGrad)"/><circle cx="76" cy="71" r="5.4" fill="url(#pelletBallGrad)"/>
    </g>
    <rect x="17" y="84" width="76" height="46" rx="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <text x="55" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">Madde A</text>
    <path d="M 22 74 L 22 160" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
    <path d="M 88 74 L 88 160" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
    <g class="svg-bottle-cap-group" id="cap">
      <rect x="27" y="32" width="56" height="6" rx="2" fill="#1e40af"/>
      <rect x="29" y="8" width="52" height="26" rx="4" fill="url(#capBlueGrad)" stroke="#1d4ed8" stroke-width="1"/>
      <line x1="33" y1="10" x2="33" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="38" y1="10" x2="38" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="43" y1="10" x2="43" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="48" y1="10" x2="48" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="53" y1="10" x2="53" y2="32" stroke="#93c5fd" stroke-width="1.5" opacity="0.9"/><line x1="58" y1="10" x2="58" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="63" y1="10" x2="63" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="68" y1="10" x2="68" y2="32" stroke="#60a5fa" stroke-width="1.5" opacity="0.8"/><line x1="73" y1="10" x2="73" y2="32" stroke="#1d4ed8" stroke-width="1.5" opacity="0.6"/><line x1="77" y1="10" x2="77" y2="32" stroke="#1e3a8a" stroke-width="1.5" opacity="0.7"/>
    </g>
  </g>
</svg>`;
    }
    return '';
}

/**
 * Malzeme Kapsayıcısındaki <img> Etiketini Satıriçi (Inline) SVG'ye Dönüştürür
 */
async function convertImgToInlineSvg(container) {
    if (!container) return null;
    let existingSvg = container.querySelector('svg');
    if (existingSvg) return existingSvg;

    const img = container.querySelector('img.prep-material-img');
    if (!img) return null;

    let svgElement = null;
    try {
        const resp = await fetch(img.src);
        if (resp.ok) {
            const text = await resp.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'image/svg+xml');
            const parsed = xmlDoc.querySelector('svg');
            if (parsed) svgElement = parsed;
        }
    } catch (e) {
        console.warn('SVG fetch inline hatası:', e);
    }

    if (!svgElement) {
        const matId = container.dataset.id || (container.classList.contains('water-bottle') ? 'safSu' : 'maddeA');
        const fallbackMarkup = getBottleSvgMarkup(matId);
        if (fallbackMarkup) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(fallbackMarkup, 'image/svg+xml');
            svgElement = xmlDoc.querySelector('svg');
        }
    }

    if (svgElement) {
        svgElement.setAttribute('class', (img.getAttribute('class') || 'prep-material-img') + ' inline-svg-active');
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.style.maxWidth = '100%';
        svgElement.style.maxHeight = '100%';
        svgElement.style.display = 'block';
        img.replaceWith(svgElement);
        return svgElement;
    }
    return null;
}

/**
 * Ana sahne / kapsayıcı (.prep-scale-wrapper) ölçekleme oranını dinamik olarak hesaplar.
 * CSS transform: scale(...) nedeniyle getBoundingClientRect() ile okunan ekran pikselleri
 * yerel (local) CSS koordinat alanına dönüştürülürken bu orana bölünmelidir.
 */
function getSceneScale() {
    const scaleWrapper = document.querySelector('.prep-scale-wrapper') || 
                         document.getElementById('prep-scale-wrapper') ||
                         document.querySelector('.prep-table-scene') || 
                         document.querySelector('.scale-wrapper');
    if (scaleWrapper) {
        if (scaleWrapper.offsetWidth > 0) {
            const rect = scaleWrapper.getBoundingClientRect();
            const ratio = rect.width / scaleWrapper.offsetWidth;
            if (ratio > 0 && !isNaN(ratio)) {
                return ratio;
            }
        }
        const style = window.getComputedStyle(scaleWrapper);
        const transform = style.transform || style.webkitTransform;
        if (transform && transform !== 'none') {
            try {
                const matrix = new DOMMatrixReadOnly(transform);
                if (matrix.a > 0) return matrix.a;
            } catch (e) {
                const match = transform.match(/matrix.*\((.+)\)/);
                if (match && match[1]) {
                    const values = match[1].split(',').map(v => parseFloat(v.trim()));
                    if (values[0] > 0) return values[0];
                }
            }
        }
    }
    return 1;
}

/**
 * Sıvı seviyesini SVG ve HTML yapılarına tam uyumlu olarak (transform: translateY ve setAttribute) günceller.
 * style.height kullanımından kaynaklanan SVG render ve menisküs hatalarını önler.
 */
function setLiquidLevel(liquidEl, percent, duration = 2000, options = {}) {
    if (!liquidEl) return;
    const p = Math.max(0, Math.min(100, percent));
    const isBeakerFill = liquidEl.id === 'beakerFill' || liquidEl.closest('#beakerFill');
    const targetEl = isBeakerFill ? (document.getElementById('beakerFill') || liquidEl) : liquidEl;

    targetEl.style.transformBox = 'fill-box';
    targetEl.style.transformOrigin = 'bottom center';

    if (duration > 0) {
        targetEl.style.transition = `transform ${duration}ms cubic-bezier(0.34, 0.1, 0.25, 1), opacity ${Math.min(duration, 600)}ms ease, background-color ${duration}ms ease`;
    } else {
        targetEl.style.transition = 'none';
    }

    if (p <= 0) {
        if (isBeakerFill) {
            targetEl.style.transform = 'translate3d(0px, 98px, 0px)';
        } else {
            targetEl.style.transform = 'translateY(100%)';
        }
        targetEl.style.opacity = '0';
        if (targetEl.tagName && targetEl.tagName.toLowerCase() === 'rect') {
            targetEl.setAttribute('height', '0');
        }
    } else {
        if (isBeakerFill) {
            // #beakerFill 98px (boş) ile 0px (dolu) aralığında çalışır
            const yOffset = Math.round(98 * (1 - (p / 100)));
            targetEl.style.transform = `translate3d(0px, ${yOffset}px, 0px)`;
        } else {
            // Standart SVG / DOM elemanları için translateY((100 - p)%)
            targetEl.style.transform = `translateY(${100 - p}%)`;
        }
        targetEl.style.opacity = '1';

        // SVG <rect> öznitelik desteği
        if (targetEl.tagName && targetEl.tagName.toLowerCase() === 'rect') {
            const baseHeight = options.maxHeight || 180;
            const newHeight = Math.round(baseHeight * (p / 100));
            targetEl.setAttribute('height', `${newHeight}`);
        }
    }

    if (options.color) {
        targetEl.style.backgroundColor = options.color;
    }
}

/**
 * Akış çizgisini (pourStream / pourStreamFlow) SVG ve HTML elemanlarına uygun olarak kontrol eder.
 * SVG <path> için strokeDashoffset ve opacity; HTML overlay için ölçeklendirilmiş koordinat ve scaleY uygular.
 */
function setStreamFlow(streamEl, flowEl, active, beakerEl = null, scale = 1) {
    if (!streamEl) return;
    const isSvgPath = streamEl instanceof SVGPathElement || (streamEl.tagName && streamEl.tagName.toLowerCase() === 'path');

    if (active) {
        if (isSvgPath) {
            streamEl.style.transition = 'stroke-dashoffset 0.3s ease, opacity 0.25s ease';
            streamEl.style.strokeDashoffset = '0';
            streamEl.style.opacity = '1';
            if (flowEl) {
                flowEl.style.transition = 'opacity 0.25s ease';
                flowEl.style.opacity = '0.85';
                flowEl.classList.add('is-flowing');
            }
        } else {
            if (beakerEl) {
                const bRect = beakerEl.getBoundingClientRect();
                const wrapper = document.querySelector('.prep-scale-wrapper') || document.body;
                const wRect = wrapper.getBoundingClientRect();
                const left = ((bRect.left - wRect.left) + (bRect.width * 0.44)) / scale;
                const top = ((bRect.top - wRect.top) + (bRect.height * 0.08)) / scale;
                const h = (bRect.height * 0.50) / scale;
                streamEl.style.left = `${left}px`;
                streamEl.style.top = `${top}px`;
                streamEl.style.height = `${h}px`;
            }
            streamEl.style.transformOrigin = 'top center';
            streamEl.style.transform = 'scaleY(1)';
            streamEl.style.opacity = '1';
        }
    } else {
        if (isSvgPath) {
            streamEl.style.transition = 'stroke-dashoffset 0.25s ease, opacity 0.25s ease';
            streamEl.style.strokeDashoffset = '1';
            streamEl.style.opacity = '0';
            if (flowEl) {
                flowEl.style.opacity = '0';
                flowEl.classList.remove('is-flowing');
            }
        } else {
            streamEl.style.opacity = '0';
            streamEl.style.transform = 'scaleY(0)';
        }
    }
}

async function runDeskExperimentAnimation() {
    // 1. Sahne Ölçekleme (Scale) Oranını Al (.prep-scale-wrapper transform: scale(...))
    const sceneScale = getSceneScale();

    // 2. Nesneleri Seçme (Tüm olası ID, class ve selector formatları)
    const waterBottle = document.querySelector('.water-bottle') || 
                        document.querySelector('[data-material-id="safSu"]') || 
                        document.getElementById('itemWater') || 
                        document.getElementById('bottleWater');

    const maddeABottle = document.querySelector('.madde-a-bottle') || 
                         document.querySelector('[data-material-id="maddeA"]') || 
                         document.getElementById('itemJar') || 
                         document.getElementById('jarA');

    const beaker = document.querySelector('.beaker') || 
                   document.querySelector('[data-material-id="kap"]') || 
                   document.getElementById('itemBeaker');

    const liquid = document.getElementById('beakerFill') || 
                   document.querySelector('.liquid-fill') || 
                   document.querySelector('.beaker-liquid');

    const stick = document.getElementById('stirRod') || 
                  document.querySelector('.stir-stick') || 
                  document.querySelector('.prep-stick-image') || 
                  document.getElementById('itemTray');

    const pourStream = document.getElementById('pourStream') || 
                       document.querySelector('.pour-stream') || 
                       document.getElementById('pour-stream');

    const pourStreamFlow = document.getElementById('pourStreamFlow') || 
                           document.querySelector('.pour-stream-flow');

    const solutionTint = document.getElementById('solutionTint');
    const frontGlassOverlay = document.getElementById('beaker-front-glass-overlay');
    const volText = document.getElementById('volText');

    if (!waterBottle || !maddeABottle || !beaker) {
        console.warn('Gerekli deney nesneleri sayfada bulunamadı.');
        return;
    }

    // Şişeleri inline SVG'ye dönüştürerek SVG içindeki kapaklara (#cap) erişim sağla
    await Promise.all([
        convertImgToInlineSvg(waterBottle),
        convertImgToInlineSvg(maddeABottle)
    ]);

    const waterCap = waterBottle.querySelector('#cap, .svg-bottle-cap-group, .bottle-cap-group, .water-bottle-cap') || 
                     document.getElementById('waterCap');
    const maddeACap = maddeABottle.querySelector('#cap, .svg-bottle-cap-group, .bottle-cap-group, .madde-a-cap') || 
                      document.getElementById('jarCap');

    // Başlangıç durumunu sıfırla
    if (liquid) {
        setLiquidLevel(liquid, 0, 0);
        liquid.style.backgroundColor = 'rgba(173, 216, 230, 0.6)';
        liquid.classList.remove('solution-formed');
        if (liquid.id === 'beakerFill') {
            liquid.classList.remove('is-stirring');
        }
    }
    if (solutionTint) {
        solutionTint.style.transition = 'none';
        solutionTint.style.opacity = '0';
    }
    if (pourStream) {
        setStreamFlow(pourStream, pourStreamFlow, false);
    }
    if (volText) {
        volText.textContent = '0 mL';
    }
    if (waterCap) {
        waterCap.style.transition = 'none';
        waterCap.style.transformBox = 'fill-box';
        waterCap.style.transformOrigin = 'center top';
        waterCap.style.transform = 'translateY(0) rotate(0deg)';
        waterCap.style.opacity = '1';
        void waterCap.getBoundingClientRect();
    }
    if (maddeACap) {
        maddeACap.style.transition = 'none';
        maddeACap.style.transformBox = 'fill-box';
        maddeACap.style.transformOrigin = 'center top';
        maddeACap.style.transform = 'translateY(0) rotate(0deg)';
        maddeACap.style.opacity = '1';
        void maddeACap.getBoundingClientRect();
    }
    if (frontGlassOverlay) {
        frontGlassOverlay.classList.remove('active');
    }

    // Beherin ve şişelerin ağız kısımlarını referans alma
    const beakerCoords = getCenterCoords(beaker);
    const pourTargetX = beakerCoords.left + (beakerCoords.width * 0.36);
    const pourTargetY = beakerCoords.top - (beakerCoords.height * 0.38);

    // --- 1. SAF SU İŞLEMİ ---
    
    // 1. Kapak dönerek açılır (translateY & rotate ile havaya kalkar ve kaybolur)
    if (waterCap) {
        waterCap.style.transformBox = 'fill-box';
        waterCap.style.transformOrigin = 'center top';
        waterCap.style.transition = 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.65s ease';
        waterCap.style.transform = `translateY(${-40 / sceneScale}px) rotate(-45deg)`;
        waterCap.style.opacity = '0';
    }
    await delay(750);

    // 2. Saf su şişesi havalanıp beherin üzerine gelir; scale oranına bölünerek normalize edilir!
    const waterBottleCoords = getCenterCoords(waterBottle);
    const waterDeltaX = (pourTargetX - waterBottleCoords.x) / sceneScale;
    const waterDeltaY = (pourTargetY - waterBottleCoords.y) / sceneScale;

    waterBottle.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    waterBottle.style.transform = `translate3d(${waterDeltaX}px, ${waterDeltaY}px, 60px) rotateX(42deg) rotateY(-12deg) rotateZ(-38deg)`;
    await delay(1200);

    // 3. Su boşalır ve seviye artar (akış efekti görünür olur, sıvı translateY ile %0'dan %55'e çıkar)
    setStreamFlow(pourStream, pourStreamFlow, true, beaker, sceneScale);

    if (liquid) {
        setLiquidLevel(liquid, 55, 2000, { color: 'rgba(173, 216, 230, 0.75)' });
    }
    if (volText) {
        volText.textContent = '150 mL';
    }
    await delay(2000); // Suyun dolma süresi

    // 4. Sıvı akış efekti kaybolur, şişe düzelir ve ilk baştaki konumuna geri döner
    setStreamFlow(pourStream, pourStreamFlow, false);

    waterBottle.style.transition = 'transform 0.4s ease';
    waterBottle.style.transform = `translate3d(${waterDeltaX}px, ${waterDeltaY}px, 20px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    await delay(400);

    waterBottle.style.transition = 'transform 1.1s ease-in-out';
    waterBottle.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    await delay(1100);

    await delay(350);

    // --- 2. MADDE A İŞLEMİ ---
    
    // 1. Kapak dönerek açılır
    if (maddeACap) {
        maddeACap.style.transformBox = 'fill-box';
        maddeACap.style.transformOrigin = 'center top';
        maddeACap.style.transition = 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.65s ease';
        maddeACap.style.transform = `translateY(${-40 / sceneScale}px) rotate(-45deg)`;
        maddeACap.style.opacity = '0';
    }
    await delay(750);

    // 2. Madde A şişesi kalkar ve beherin üzerine gelir; scale oranına bölünerek normalize edilir!
    const maddeACoords = getCenterCoords(maddeABottle);
    const maddeADeltaX = (pourTargetX - maddeACoords.x) / sceneScale;
    const maddeADeltaY = (pourTargetY - maddeACoords.y) / sceneScale;

    maddeABottle.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    maddeABottle.style.transform = `translate3d(${maddeADeltaX}px, ${maddeADeltaY}px, 60px) rotateX(42deg) rotateY(-12deg) rotateZ(-38deg)`;
    await delay(1200);

    // 3. Madde A dökülürken akış başlar, sıvı bulanıklaşır ve seviyesi %65'e yükselir
    setStreamFlow(pourStream, pourStreamFlow, true, beaker, sceneScale);

    if (solutionTint) {
        solutionTint.style.transition = 'opacity 1.5s ease-in-out';
        solutionTint.style.opacity = '0.65';
    }
    if (liquid) {
        setLiquidLevel(liquid, 65, 2000, { color: 'rgba(150, 180, 200, 0.85)' });
    }
    await delay(2000);

    // Akış biter
    setStreamFlow(pourStream, pourStreamFlow, false);

    // 4. Şişe düzelir ve ilk baştaki konumuna geri döner
    maddeABottle.style.transition = 'transform 0.4s ease';
    maddeABottle.style.transform = `translate3d(${maddeADeltaX}px, ${maddeADeltaY}px, 20px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    await delay(400);

    maddeABottle.style.transition = 'transform 1.1s ease-in-out';
    maddeABottle.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    await delay(1100);

    await delay(350);

    // --- 3. KARIŞTIRMA İŞLEMİ ---
    // Karıştırma çubuğu (.stir-stick) beherin tam içine girecek şekilde doğru X ve Y koordinatlarına gelir
    if (stick) {
        // Çubuğun beherin tam içine gireceği hedef X ve Y koordinatları (scale normalize edilmiş)
        const stickCoords = getCenterCoords(stick);
        const targetStickX = beakerCoords.x;
        const targetStickY = beakerCoords.top + (beakerCoords.height * 0.42);
        const stickDeltaX = (targetStickX - stickCoords.x) / sceneScale;
        const stickDeltaY = (targetStickY - stickCoords.y) / sceneScale;

        // Ön cam derinlik katmanını beherin üzerine hizala ve aktif et (çubuğun önünde kalır)
        if (frontGlassOverlay && beaker) {
            const bRect = beaker.getBoundingClientRect();
            const scene = document.querySelector('.prep-table-scene') || beaker.parentElement;
            const sceneRect = scene.getBoundingClientRect();
            frontGlassOverlay.style.left = `${(bRect.left - sceneRect.left) / sceneScale}px`;
            frontGlassOverlay.style.top = `${(bRect.top - sceneRect.top) / sceneScale}px`;
            frontGlassOverlay.style.width = `${bRect.width / sceneScale}px`;
            frontGlassOverlay.style.height = `${bRect.height / sceneScale}px`;
            frontGlassOverlay.classList.add('active');
        }

        // Çubuk havalanıp beherin tam içine girer
        stick.style.setProperty('--target-x', `${stickDeltaX}px`);
        stick.style.setProperty('--target-y', `${stickDeltaY}px`);
        stick.style.transition = 'transform 1.2s ease-in-out';
        stick.style.transform = `translate3d(${stickDeltaX}px, ${stickDeltaY}px, 16px) rotateX(45deg) rotateY(-10deg) rotateZ(-70deg)`;
        await delay(1200);

        // Karıştırma animasyonunu başlat
        stick.classList.add('stirring');
        if (liquid && liquid.id === 'beakerFill') {
            liquid.classList.add('is-stirring');
        }

        // Çözünme hissi: Sıvı homojen, parlak ve çözünmüş hale gelir
        setTimeout(() => {
            if (liquid) {
                liquid.style.transition = 'background-color 2s ease-in-out, box-shadow 1.5s ease';
                liquid.style.backgroundColor = 'rgba(56, 189, 248, 0.75)';
                liquid.classList.add('solution-formed');
            }
            if (solutionTint) {
                solutionTint.style.transition = 'opacity 2s ease-in-out';
                solutionTint.style.opacity = '0.9';
            }
        }, 800);

        await delay(3500); // 3.5 saniye boyunca karıştırır

        // Karıştırmayı bitir ve yerine dön
        stick.classList.remove('stirring');
        if (liquid && liquid.id === 'beakerFill') {
            liquid.classList.remove('is-stirring');
        }
        if (frontGlassOverlay) {
            frontGlassOverlay.classList.remove('active');
        }

        // Çubuk yukarı kalkar
        const stickLiftY = stickDeltaY - (80 / sceneScale);
        stick.style.transition = 'transform 0.6s ease-in-out';
        stick.style.transform = `translate3d(${stickDeltaX}px, ${stickLiftY}px, 30px) rotateX(20deg) rotateY(0deg) rotateZ(-70deg)`;
        await delay(650);

        // Tepsideki başlangıç konumuna döner
        stick.style.transition = 'transform 1.2s ease-in-out';
        stick.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
        await delay(1200);

        stick.style.transform = '';
        stick.style.transition = '';
    }

    // Çözelti oluşumu tamamlandı
    if (typeof setSolutionCreated === 'function') {
        setSolutionCreated(true);
    }
}

// Global dışa aktarım
window.getSceneScale = getSceneScale;
window.setLiquidLevel = setLiquidLevel;
window.setStreamFlow = setStreamFlow;
window.runDeskExperimentAnimation = runDeskExperimentAnimation;
window.startPreparationAnimation = runDeskExperimentAnimation;
window.runPrepareSolutionAnimation = window.runPrepareSolutionAnimation || runDeskExperimentAnimation;
window.runStirSolutionAnimation = window.runStirSolutionAnimation || runDeskExperimentAnimation;
