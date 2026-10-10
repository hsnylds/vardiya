/**
 * ========================================================
 * LABORATUVAR GÜVENLİK SİMÜLASYONU - JAVASCRIPT KONTROLLERİ
 * - Yatay Ekran (Landscape) Zorunluluğu ve Dinleyicileri
 * - Yavaş ve Akıcı Slide-Up Animasyonu (3.6 Saniye)
 * - Tarayıcı Autoplay Uyumlu Ses Entegrasyonu (Sound/giris_ses.mp3)
 * - Ekranda Metin/Baloncuk Olmadan Saf Sesli Brifing
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elemanları
  const characterWrapper = document.getElementById('character-wrapper');
  const orientationOverlay = document.getElementById('orientation-overlay');
  const mainStage = document.getElementById('main-stage');
  const startOverlay = document.getElementById('start-overlay');
  const btnStartShift = document.getElementById('btn-start-shift');

  // YENİ GÖRSEL BUTON: Konuşma Tamamlandığında Beliren Bağımsız Buton (btn.png)
  const shiftActionContainer = document.getElementById('shift-action-container');
  const btnShiftAction = document.getElementById('btn-shift-action');

  // YENİ GÖRSEL BUTON 2: Tezgahta Beliren 'VARDİYAYI PLANLA' Butonu (#plan-shift-container & #btn-plan-shift)
  const planShiftContainer = document.getElementById('plan-shift-container');
  const btnPlanShift = document.getElementById('btn-plan-shift');
  let planShiftTimer = null;

  // YENİ GÖRSEL BUTON 3: Ortak Taşıyıcıda Beliren 'PLANIMI ONAYLA' Butonu (#confirm-plan-container & #btn-confirm-plan)
  const confirmPlanContainer = document.getElementById('confirm-plan-container');
  const btnConfirmPlan = document.getElementById('btn-confirm-plan');
  let confirmPlanTimer = null;
  let hazirlikStageTimer = null;
  // GLOBAL DURUM YÖNETİMİ (STATE MANAGEMENT - PLANLAMA VERİLERİ)
  let gorevsirasi = [];
  let koruyucudonanimlar = [];

  // PLANLAMA AŞAMASI DOM ELEMANLARI (#planning-stage-container)
  const planningStageContainer = document.getElementById('planning-stage-container');
  const sortableTaskList = document.getElementById('sortable-task-list');
  let planningStageTimer = null;

  // ÖĞRETMEN AVATARI (kadın_head.png): Tezgah açıldığında sol altta beliren avatar
  const teacherAvatarContainer = document.getElementById('teacher-avatar-container');
  let teacherAvatarTimer = null;

  // Sağ Görev Menüsü Paneli
  const taskMenuContainer = document.getElementById('task-menu-container') || document.getElementById('task-menu-panel');
  let taskMenuTimer = null;

  // Laboratuvar Arka Planı & Çalışma Tezgahı (Workbench)
  const labBgImg = document.getElementById('lab-bg-img');
  const workbenchContainer = document.getElementById('workbench-container');

  // Ana Kapsayıcı (Main Row Container - Tezgah ve Butonlar Çerçevelerini Barındıran Kapsayıcı)
  const mainRowContainer = document.getElementById('main-row-container');

  // Üst Başlık Metni
  const bannerMainTitle = document.getElementById('banner-main-title');
  const ORIGINAL_BANNER_TITLE = 'Risk Laboratuvarı – Güvenliği Sen Yönet';
  const UPDATED_BANNER_TITLE_HTML = 'Risk Laboratuvarı – <span class="banner-highlight-yellow">Vardiyayı Güvenle Tamamla</span>';

  // Ses Elemanları & Ekolayzer
  const shiftAudio = document.getElementById('shift-audio');
  const audioEqualizer = document.getElementById('audio-equalizer');
  const audioStatusLabel = document.getElementById('audio-status-label');

  // HUD Kontrol Butonları & Tam Ekran
  const btnReplay = document.getElementById('btn-replay');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const iconFsEnter = document.getElementById('icon-fs-enter');
  const iconFsExit = document.getElementById('icon-fs-exit');
  const btnOverlayFullscreen = document.getElementById('btn-overlay-fullscreen');
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');
  const btnForceLandscape = document.getElementById('btn-force-landscape');

  // Konuşma Balonu & Daktilo (Typewriter) Efekti
  const speechBubble = document.getElementById('speech-bubble');
  const speechText = document.getElementById('speech-text');
  const typewriterCursor = document.getElementById('typewriter-cursor');
  const SPEECH_FULL_TEXT = 'Bugün laboratuvarın güvenliğinden sen sorumlusun. Görevlerini planla, riskleri yönet ve vardiyayı güvenle tamamla.';
  let typewriterTimer = null;
  let typewriterIndex = 0;

  // ÖĞRETMEN AVATARI KONUŞMA BALONCUĞU & GÖREV SESLERİ ELEMANLARI
  const avatarSpeechBubble = document.getElementById('avatar-speech-bubble');
  const avatarSpeechText = document.getElementById('avatar-speech-text');
  const avatarTypewriterCursor = document.getElementById('avatar-typewriter-cursor');
  const taskAudio = document.getElementById('task-audio');
  let avatarTypewriterTimer = null;
  let avatarTypewriterIndex = 0;
  let activeTaskIndex = -1;

  // GÖREV VE PROTOKOL VERİLERİ (Metinler ve Ses Dosyaları)
  const TASK_DATA = [
    {
      id: 'task-btn-1',
      shortTitle: '1. Çözelti Hazırlama',
      text: 'Gerekli malzemeler seçilip çalışma alanı kontrol edildikten sonra, Madde A ile saf su karıştırılarak çözelti oluşturulur ve kaba uygun etiket yapıştırılır.',
      audioSrc: 'sound/cozeltiolusturma.mp3',
      audioFallback: 'sound/cozeltihazirlama.mp3'
    },
    {
      id: 'task-btn-2',
      shortTitle: '2. Numuneyi İncele',
      text: 'Ana çözeltiden ayrılan etiketli numune temiz bir kapla uygun analiz alanındaki cihaza yerleştirilerek görünümü ve gözle görülür parçacık içerip içermediği değerlendirilir.',
      audioSrc: 'sound/numuneyiincele.mp3'
    },
    {
      id: 'task-btn-3',
      shortTitle: '3. Yüzeyi Temizle',
      text: 'Çözelti ve numune şişeleri tezgahtan kaldırılıp uygun temizleyici seçildikten sonra, çalışma alanı bir temizlik beziyle silinerek sonraki görev için düzenli hâle getirilir.',
      audioSrc: 'sound/yuzeyitemizleme.mp3'
    },
    {
      id: 'task-btn-4',
      shortTitle: '4. Atıkları Ayır',
      text: 'İşlem sonrası arta kalan malzemeler ve sıvılar; sıvı kimyasal atık kabı, kirli sarf malzeme kabı, geri dönüşüm kabı veya yıkama tepsisi olmak üzere kurallara uygun dört farklı hedefe yerleştirilir.',
      audioSrc: 'sound/atıklarıayır.mp3',
      audioFallback: 'sound/atiklariayir.mp3'
    }
  ];

  // Durum Değişkenleri
  let isLandscape = false;
  let isMuted = false;
  let animationTimer = null;
  let audioUnlocked = false;
  let workbenchTimer = null;
  let bgBlurTimer = null;

  /**
   * 1. TARAYICI AUTOPLAY POLİTİKASINI AŞMA VE SESİ HAZIRLAMA
   * Mobil tarayıcılar (iOS Safari, Android Chrome) kullanıcının bir tıklaması/dokunması
   * olmadan ses çalınmasına izin vermez. "Vardiyaya Başla" butonuna ilk tıklandığında
   * ses kilidi açılır ve 3.6 saniye sonra animasyon bitince ses sorunsuz çalar.
   */
  function unlockAudio() {
    if (audioUnlocked) return;
    
    // Sesi ön yükle ve anlık oynatıp duraklatarak kilidi aç
    shiftAudio.load();
    const playPromise = shiftAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        shiftAudio.pause();
        shiftAudio.currentTime = 0;
        audioUnlocked = true;
      }).catch(() => {
        // İlk etkileşimde izin verilecektir
      });
    }

    if (taskAudio) {
      taskAudio.load();
    }
  }

  /**
   * 2. SES OYNATMA VE DURDURMA YÖNETİMİ
   */
  /**
   * SES İLE SENKRONİZE DAKTİLO (TYPEWRITER) EFEKTİ
   * Metin ('Bugün laboratuvarın güvenliğinden sen sorumlusun. Görevlerini planla, riskleri yönet ve vardiyayı güvenle tamamla.')
   * ekranda bir anda belirmez. Seslendirme ile tam uyumlu olacak şekilde harf harf daktilo efekti ile yazılır.
   * Yazının tamamlanma süresi, ses dosyasının uzunluğuna (~8.46s) tam olarak uyarlanır.
   */
  function startTypewriter() {
    stopTypewriter();

    if (!speechBubble || !speechText) return;

    // Balonu görünür yap ve başlangıç durumuna getir
    speechText.textContent = '';
    if (typewriterCursor) {
      typewriterCursor.classList.remove('finished');
    }
    speechBubble.classList.add('visible');

    // Ses dosyasının gerçek süresi (giris_ses.mp3: ~8.46s)
    let audioDurationMs = 8460;
    if (shiftAudio && shiftAudio.duration && !isNaN(shiftAudio.duration) && shiftAudio.duration > 2) {
      audioDurationMs = shiftAudio.duration * 1000;
    }

    const totalChars = SPEECH_FULL_TEXT.length;
    // Cümle sonu (.) ve virgül (,) duraklamaları hesaba katılarak karakter başı süre hesaplanır (~62ms)
    const baseDelay = Math.max(35, Math.floor((audioDurationMs - 1000) / totalChars));

    typewriterIndex = 0;

    function typeNextChar() {
      if (typewriterIndex < totalChars) {
        const char = SPEECH_FULL_TEXT.charAt(typewriterIndex);
        speechText.textContent += char;
        typewriterIndex++;

        // Doğal konuşma nefes payları ve duraklamalar
        let delay = baseDelay;
        if (char === '.') {
          delay = baseDelay + 240; // Cümle sonlarında doğal duraklama
        } else if (char === ',') {
          delay = baseDelay + 140; // Virgüllerde hafif duraklama
        }

        typewriterTimer = setTimeout(typeNextChar, delay);
      } else {
        // Yazma tamamlandı, imleç yumuşakça söner
        if (typewriterCursor) {
          typewriterCursor.classList.add('finished');
        }
      }
    }

    // Sesin ilk hecesiyle eşzamanlı başlaması için ufak başlangıç tamponu (160ms)
    typewriterTimer = setTimeout(typeNextChar, 160);
  }

  function stopTypewriter() {
    if (typewriterTimer) {
      clearTimeout(typewriterTimer);
      typewriterTimer = null;
    }
    typewriterIndex = 0;
    if (speechText) {
      speechText.textContent = '';
    }
    if (speechBubble) {
      speechBubble.classList.remove('visible');
    }
    if (typewriterCursor) {
      typewriterCursor.classList.remove('finished');
    }
  }

  /**
   * 2. SES OYNATMA VE DURDURMA YÖNETİMİ
   */
  function playVoiceOver() {
    if (!shiftAudio) return;

    shiftAudio.currentTime = 0;
    shiftAudio.muted = isMuted;

    const playPromise = shiftAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (audioEqualizer) {
          audioEqualizer.classList.add('playing');
        }
        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'BRİFİNG SESLENDİRİLİYOR';
        }
        // Ses çalmaya başlayınca daktilo efektini başlat
        startTypewriter();
      }).catch(err => {
        console.warn('Ses otomatik çalma engellendi veya dosya bulunamadı:', err);
        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'SES BAŞLATILAMADI';
        }
        // Ses çalmasa dahi metin daktilo efekti ile gösterilir
        startTypewriter();
      });
    } else {
      startTypewriter();
    }
  }

  function stopVoiceOver() {
    if (shiftAudio) {
      shiftAudio.pause();
      shiftAudio.currentTime = 0;
    }
    if (audioEqualizer) {
      audioEqualizer.classList.remove('playing');
    }
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'SES BEKLENİYOR';
    }
    stopTypewriter();
  }

  /**
   * ========================================================
   * YENİ GÖRSEL BUTON YÖNETİMİ ('VARDİYAYA BAŞLA' - btn.png)
   * İlk giriş butonundan tamamen bağımsızdır.
   * Öğretmenin konuşması tamamlandığında görünür, tıklandığında öğretmeni geri gönderir.
   * ========================================================
   */

  // 1. Konuşma Tamamlandığında (audio onended) Yeni Buton Yavaşça Belirsin (Fade-In)
  function showShiftActionButton() {
    if (!shiftActionContainer) return;
    shiftActionContainer.classList.remove('fade-out');
    shiftActionContainer.classList.add('visible');
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'BRİFİNG TAMAMLANDI - VARDİYAYA BAŞLAYINIZ';
    }
  }

  // Yeni Görsel Butonu Gizle (Başlangıçta ve Sıfırlamada)
  function hideShiftActionButton(animated = true) {
    if (!shiftActionContainer) return;
    shiftActionContainer.classList.remove('visible');
    if (animated) {
      shiftActionContainer.classList.add('fade-out');
    } else {
      shiftActionContainer.classList.remove('fade-out');
    }
  }

  // YENİ GÖRSEL BUTON 2: Tezgahta Beliren 'VARDİYAYI PLANLA' Butonunu Göster (Fade-In)
  function showPlanShiftButton() {
    if (!planShiftContainer) return;
    planShiftContainer.classList.remove('fade-out');
    planShiftContainer.classList.add('visible');
  }

  // 'VARDİYAYI PLANLA' Butonunu Gizle (Fade-Out veya Anında)
  function hidePlanShiftButton(animated = true) {
    if (planShiftTimer) {
      clearTimeout(planShiftTimer);
      planShiftTimer = null;
    }
    if (!planShiftContainer) return;
    planShiftContainer.classList.remove('visible');
    if (animated) {
      planShiftContainer.classList.add('fade-out');
    } else {
      planShiftContainer.classList.remove('fade-out');
    }
  }

  // YENİ GÖRSEL BUTON 3: Ortak Taşıyıcıda 'PLANIMI ONAYLA' Butonunu Göster (Fade-In)
  function showConfirmPlanButton() {
    if (!confirmPlanContainer) return;
    confirmPlanContainer.classList.remove('fade-out');
    confirmPlanContainer.classList.add('visible');
  }

  // 'PLANIMI ONAYLA' Butonunu Gizle (Fade-Out veya Anında)
  function hideConfirmPlanButton(animated = true) {
    if (confirmPlanTimer) {
      clearTimeout(confirmPlanTimer);
      confirmPlanTimer = null;
    }
    if (!confirmPlanContainer) return;
    confirmPlanContainer.classList.remove('visible');
    if (animated) {
      confirmPlanContainer.classList.add('fade-out');
    } else {
      confirmPlanContainer.classList.remove('fade-out');
    }
  }

  // PLANLAMA EKRANI GÖSTERİMİ (FADE-IN)
  function showPlanningStage() {
    if (!planningStageContainer) return;

    // 2. Otomatik Seçim Durumunun İptal Edilmesi:
    // Kullanıcı ekranı ilk açtığında hiçbir kart seçili olmamalıdır
    const gearCards = document.querySelectorAll('.gear-card-item');
    gearCards.forEach(card => {
      card.classList.remove('selected-gear', 'selected', 'active');
      card.setAttribute('aria-pressed', 'false');
    });

    planningStageContainer.style.display = 'flex';
    void planningStageContainer.offsetWidth; // DOM reflow
    planningStageContainer.classList.remove('fade-out');
    planningStageContainer.classList.add('visible');
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'GÖREV SIRASI VE DONANIMLARI BELİRLEYİNİZ';
    }
  }

  // PLANLAMA EKRANI GİZLEME (FADE-OUT VEYA ANINDA)
  function hidePlanningStage(animated = false) {
    if (planningStageTimer) {
      clearTimeout(planningStageTimer);
      planningStageTimer = null;
    }
    hideConfirmPlanButton(animated);
    if (!planningStageContainer) return;
    planningStageContainer.classList.remove('visible');
    if (animated) {
      planningStageContainer.classList.add('fade-out');
      setTimeout(() => {
        if (!planningStageContainer.classList.contains('visible')) {
          planningStageContainer.style.display = 'none';
        }
      }, 550);
    } else {
      planningStageContainer.classList.remove('fade-out');
      planningStageContainer.style.display = 'none';
    }
  }

  /**
   * ========================================================
   * SAĞ GÖREV MENÜSÜ YÖNETİMİ
   * - Sahne ilk yüklendiğinde görev menüsü görünmez (gizlidir)
   * - Yalnızca kullanıcı "Vardiyaya Başla" butonuna tıkladığında belirir
   * ========================================================
   */
  function showTaskMenu() {
    if (mainRowContainer) {
      mainRowContainer.classList.remove('fade-out', 'fade-out-slow');
      mainRowContainer.classList.add('visible');
    }
    if (!taskMenuContainer) return;
    taskMenuContainer.classList.remove('fade-out', 'fade-out-slow');
    taskMenuContainer.classList.add('visible');
  }

  function hideTaskMenu(animated = false) {
    if (taskMenuTimer) clearTimeout(taskMenuTimer);
    if (!taskMenuContainer) return;
    taskMenuContainer.classList.remove('visible', 'fade-out-slow');
    if (animated) {
      taskMenuContainer.classList.add('fade-out');
    } else {
      taskMenuContainer.classList.remove('fade-out');
    }
  }

  /**
   * ========================================================
   * LABORATUVAR ÇALIŞMA TEZGAHI (WORKBENCH) VE FLULAŞTIRMA
   * - Başlık sarıya döndükten hemen sonra yavaşça fade-in olur
   * - Tezgah yerleştiğinde laboratuvar arka planı hafif flu (blur) hale gelir
   * ========================================================
   */
  function showWorkbench() {
    if (mainRowContainer) {
      mainRowContainer.classList.remove('fade-out', 'fade-out-slow');
      mainRowContainer.classList.add('visible');
    }
    if (!workbenchContainer) return;
    workbenchContainer.classList.remove('fade-out', 'fade-out-slow');
    workbenchContainer.classList.add('visible');

    // Tezgahın ekrana gelme animasyonu (1.8s) bitip tamamen yerleştiğinde:
    // Laboratuvar arka plan görseline hafif bir bulanıklık (blur) efekti uygulayarak arka planı flu hale getir
    if (bgBlurTimer) clearTimeout(bgBlurTimer);
    bgBlurTimer = setTimeout(() => {
      if (labBgImg) {
        labBgImg.classList.add('bg-blurred');
      }
    }, 1800);
  }

  function hideWorkbench(animated = false) {
    if (workbenchTimer) clearTimeout(workbenchTimer);
    if (bgBlurTimer) clearTimeout(bgBlurTimer);

    if (labBgImg) {
      labBgImg.classList.remove('bg-blurred');
    }

    if (mainRowContainer) {
      mainRowContainer.classList.remove('visible', 'fade-out-slow');
      if (animated) {
        mainRowContainer.classList.add('fade-out');
      } else {
        mainRowContainer.classList.remove('fade-out');
      }
    }

    if (!workbenchContainer) return;
    workbenchContainer.classList.remove('visible', 'fade-out-slow');
    if (animated) {
      workbenchContainer.classList.add('fade-out');
    } else {
      workbenchContainer.classList.remove('fade-out');
    }
  }

  /**
   * ========================================================
   * ÖĞRETMEN AVATARI YÖNETİMİ (kadın_head.png)
   * - Varsayılan (default) durumda sahnede kesinlikle GİZLİ (hidden)
   * - "Vardiyaya Başla" butonuna tıklandığında ve tezgah ekranda
   *   tamamen görünür hale geldiği anda sol alt köşeden yukarıya doğru
   *   hafifçe kayarak (slide-up) ve saydamlıktan netliğe (fade-in)
   *   geçerek sahneye dahil olur.
   * - bottom: 0, left: 0 konumunda, ekran yüksekliğinin %15-20'si boyutunda
   *   tezgahı ve çalışma alanını izler.
   * ========================================================
   */
  function showTeacherAvatar() {
    if (!teacherAvatarContainer) return;
    teacherAvatarContainer.classList.remove('fade-out', 'fade-out-slow');
    teacherAvatarContainer.classList.add('visible');
    teacherAvatarContainer.setAttribute('aria-hidden', 'false');
  }

  function hideTeacherAvatar(animated = false) {
    if (teacherAvatarTimer) {
      clearTimeout(teacherAvatarTimer);
      teacherAvatarTimer = null;
    }
    if (!teacherAvatarContainer) return;
    teacherAvatarContainer.classList.remove('visible', 'fade-out-slow');
    teacherAvatarContainer.setAttribute('aria-hidden', 'true');
    if (animated) {
      teacherAvatarContainer.classList.add('fade-out');
    } else {
      teacherAvatarContainer.classList.remove('fade-out');
    }
  }

  // 2. Yeni Görsel Butona ('Vardiyaya Başla') Tıklandığında Tetiklenen Akış
  function handleShiftActionClick() {
    // A) Yeni görsel buton görevini tamamlayıp kaybolsun
    hideShiftActionButton(true);

    // B) Metin Kutusunun Gizlenmesi: 'Vardiyaya başla' tetikleyicisi çalıştığı anda
    // ekrandaki diyalog kutusu ve konuşma metni tamamen gizlenir (Visibility: Off / Hide Text)
    if (speechBubble) {
      speechBubble.classList.remove('visible');
      speechBubble.classList.add('fade-out');
    }
    stopTypewriter();
    if (shiftAudio && !shiftAudio.paused) {
      shiftAudio.pause();
    }
    if (audioEqualizer) {
      audioEqualizer.classList.remove('playing');
    }

    // C) En üstteki başlığı güncelle: "Risk Laboratuvarı – Vardiyayı Güvenle Tamamla" (Sarı Vurgulu)
    if (bannerMainTitle) {
      bannerMainTitle.style.opacity = '0';
      setTimeout(() => {
        bannerMainTitle.innerHTML = UPDATED_BANNER_TITLE_HTML;
        bannerMainTitle.style.opacity = '1';
      }, 300);
    }

    // D) Tam boy kadın karakter sahnede tezgahın önünü kapatmasın diye
    // akıcı bir şekilde aşağıya süzülerek çıkış yapar (yerini sol alttaki kafa avatarına bırakır)
    if (characterWrapper) {
      characterWrapper.classList.remove('animate-slow-slide', 'idle-breathing');
      characterWrapper.classList.add('animate-slow-slide-exit');
    }

    // E) Tezgah Çerçevesi (Sol Kutu) ve Butonlar Çerçevesi (Sağ Kutu)
    // Ana Kapsayıcı içinde eşzamanlı ve dengeli olarak sahneye yerleşir.
    if (workbenchTimer) clearTimeout(workbenchTimer);
    workbenchTimer = setTimeout(() => {
      showWorkbench();
      showTaskMenu();

      // F) KULLANICI ŞARTI: Sadece butona basılıp tezgah ekranda tamamen görünür hale geldiği anda,
      // kadın_head.png görseli ekranda belirmelidir.
      // Sol alt köşeden (bottom: 0, left: 0) hafifçe kayarak (slide-up) ve saydamlıktan netliğe (fade-in) geçer.
      if (teacherAvatarTimer) clearTimeout(teacherAvatarTimer);
      teacherAvatarTimer = setTimeout(() => {
        showTeacherAvatar();
      }, 650); // Tezgah sahneye yerleştiği anda öğretmen avatarı sol alttan zarifçe yükselir
    }, 400);

    // H) TEZGAH İÇERİSİNDE 'VARDİYAYI PLANLA' BUTONUNU GETİR
    // Tezgah ve menüler ekranda belirdikten (yaklaşık 1 veya 1.5 saniye) sonra
    // #plan-shift-container alanına .visible sınıfını ekleyerek 'VARDİYAYI PLANLA' butonunu yavaşça ekrana getir
    if (planShiftTimer) clearTimeout(planShiftTimer);
    planShiftTimer = setTimeout(() => {
      showPlanShiftButton();
    }, 1500);

    // G) HUD Durum Güncellemesi
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'VARDİYA BAŞLATILDI - GÖREV SEÇİNİZ';
    }
  }

  /**
   * ========================================================
   * YENİ GÖRSEL BUTON 3: 'VARDİYAYI PLANLA' TIKLAMA AKIŞI
   * Butona tıklandığında:
   * 1. 'VARDİYAYI PLANLA' butonunun kendisi gizlenir.
   * 2. Tezgah Alanı (#workbench-container), Görevler Alanı (#task-menu-container)
   *    ve ana kapsayıcıları olan #main-row-container, oluşturulan yavaş kaybolma sınıfını
   *    (.fade-out-slow) alarak yavaş yavaş, pürüzsüz bir şekilde ekrandan kaybolur.
   * 3. Tezgah ve menüler kaybolurken ÖĞRETMEN AVATARI (#teacher-avatar-container)
   *    bu işlemden KESİNLİKLE MUAF TUTULUR ve sahnede görünür kalmaya devam eder.
   *    Sadece varsa açık olan konuşma balonları kapatılır.
   * ========================================================
   */
  function handlePlanShiftClick() {
    // 1. 'VARDİYAYI PLANLA' butonunun kendisi gizlensin
    hidePlanShiftButton(true);

    // 2. Tezgah Alanı (#workbench-container), Görevler Alanı (#task-menu-container)
    // veya ana kapsayıcıları olan #main-row-container, yavaş kaybolma sınıfını (.fade-out-slow)
    // alarak yavaş yavaş, pürüzsüz bir şekilde ekrandan kaybolsun
    if (mainRowContainer) {
      mainRowContainer.classList.remove('visible');
      mainRowContainer.classList.add('fade-out-slow');
    }
    if (workbenchContainer) {
      workbenchContainer.classList.remove('visible');
      workbenchContainer.classList.add('fade-out-slow');
    }
    if (taskMenuContainer) {
      taskMenuContainer.classList.remove('visible');
      taskMenuContainer.classList.add('fade-out-slow');
    }

    // 3. Açık konuşma balonları veya ses etkileşimi varsa temizlensin.
    // ÖĞRETMEN AVATARI (#teacher-avatar-container) KESİNLİKLE MUAF TUTULUR;
    // tezgah ve menüler yok olsa bile sahnede olduğu gibi görünür kalmaya devam eder.
    if (teacherAvatarTimer) {
      clearTimeout(teacherAvatarTimer);
      teacherAvatarTimer = null;
    }
    stopTaskInteraction(true);
    // Öğretmen avatarının görünürlüğü tam olarak korunur
    if (teacherAvatarContainer) {
      teacherAvatarContainer.classList.remove('fade-out', 'fade-out-slow');
      teacherAvatarContainer.classList.add('visible');
      teacherAvatarContainer.setAttribute('aria-hidden', 'false');
    }
    if (avatarSpeechBubble) {
      avatarSpeechBubble.classList.remove('visible');
      avatarSpeechBubble.classList.add('fade-out-slow');
    }
    if (speechBubble) {
      speechBubble.classList.remove('visible');
      speechBubble.classList.add('fade-out-slow');
    }

    // Arka plan blurluluğunu kaldır
    if (bgBlurTimer) clearTimeout(bgBlurTimer);
    if (labBgImg) {
      labBgImg.classList.remove('bg-blurred');
    }

    // HUD Durum Güncellemesi
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'VARDİYA PLANI HAZIRLANIYOR...';
    }

    // 4. PLANLAMA EKRANINA VE ONAY BUTONUNA GEÇİŞ (1.5 - 2 Saniye Sonra):
    // Önceki alanlar (.fade-out-slow ile) kaybolduktan hemen sonra #planning-stage-container
    // ve aynı koordinattaki 'PLANIMI ONAYLA' butonu eşzamanlı olarak yavaşça belirir
    if (planningStageTimer) clearTimeout(planningStageTimer);
    planningStageTimer = setTimeout(() => {
      showPlanningStage();
      showConfirmPlanButton();
    }, 1800);
  }

  /**
   * ========================================================
   * PLANLAMA EKRANI: GÖREV SIRASI SÜRÜKLE-BIRAK (DRAG AND DROP)
   * - #sortable-task-list içindeki tüm sürüklenebilir öğelere dragstart ve dragend dinleyicileri
   * - dragstart anında .dragging sınıfı eklenir, dragend anında kaldırılır.
   * - dragover anında e.preventDefault() ile varsayılan engellenir, mouse Y koordinatı
   *   baz alınarak canlı ve anlık sıralama yapılır.
   * ========================================================
   */
  function initSortableTaskList() {
    const list = document.getElementById('sortable-task-list');
    if (!list) return;

    const draggables = list.querySelectorAll('.draggable-task-item');
    let activeDragClone = null;

    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', (e) => {
        // Varsa önceki sürüklemeden kalan klonu güvenle temizle
        if (activeDragClone && activeDragClone.parentNode) {
          activeDragClone.parentNode.removeChild(activeDragClone);
          activeDragClone = null;
        }

        const rect = draggable.getBoundingClientRect();
        const cloneElement = draggable.cloneNode(true);
        cloneElement.id = 'task-drag-custom-clone';
        cloneElement.classList.remove('dragging', 'drag-placeholder');

        const dragWidth = draggable.offsetWidth || rect.width;
        const dragHeight = draggable.offsetHeight || rect.height;

        // 1. DÜZELTME: Klonu ekrandan dışarı atmak yerine 'fixed' yapıp manuel kontrol ediyoruz
        cloneElement.style.position = 'fixed';
        cloneElement.style.width = `${dragWidth}px`;
        cloneElement.style.height = `${dragHeight}px`;
        cloneElement.style.opacity = '1'; 
        cloneElement.style.background = '#ffffff';
        cloneElement.style.borderRadius = '16px';
        cloneElement.style.border = '2px solid #0284c7';
        cloneElement.style.boxShadow = '0 22px 48px rgba(0, 0, 0, 0.45), 0 0 32px rgba(56, 189, 248, 0.6)';
        cloneElement.style.boxSizing = 'border-box';
        cloneElement.style.zIndex = '999999';
        cloneElement.style.pointerEvents = 'none'; // Farenin altındaki hedefleri engellememek için
        cloneElement.style.margin = '0';
        cloneElement.style.transform = 'none';

        document.body.appendChild(cloneElement);
        activeDragClone = cloneElement;

        // 2. Farenin tutma noktasını (offset) hesapla ve klonun ilk pozisyonunu ayarla
        const offsetX = Math.max(10, Math.min(dragWidth - 10, e.clientX - rect.left));
        const offsetY = Math.max(10, Math.min(dragHeight - 10, e.clientY - rect.top));
        
        activeDragClone.style.left = (e.clientX - offsetX) + 'px';
        activeDragClone.style.top = (e.clientY - offsetY) + 'px';
        
        // Offset'leri nesnede sakla (drag eventinde pozisyon hesaplamak için kullanacağız)
        activeDragClone.dataset.offsetX = offsetX;
        activeDragClone.dataset.offsetY = offsetY;

        // 3. Tarayıcının varsayılan YARI SAYDAM sürükleme hayaletini iptal et (Şeffaf bir görsel vererek)
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', draggable.dataset.taskId || '');
          
          const emptyImage = new Image();
          // Tamamen şeffaf boş bir görsel (1x1 piksel base64)
          emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          try {
            e.dataTransfer.setDragImage(emptyImage, 0, 0);
          } catch (err) {
            console.warn('Boş görsel uygulanamadı:', err);
          }
        }

        setTimeout(() => {
          draggable.classList.add('dragging', 'drag-placeholder');
        }, 0);
      });

      // YENİ EKLENEN KISIM: Klonu farenin hareketiyle %100 opak olarak manuel takip ettir
      draggable.addEventListener('drag', (e) => {
        if (activeDragClone && e.clientX > 0 && e.clientY > 0) {
          const offsetX = parseFloat(activeDragClone.dataset.offsetX);
          const offsetY = parseFloat(activeDragClone.dataset.offsetY);
          
          activeDragClone.style.left = (e.clientX - offsetX) + 'px';
          activeDragClone.style.top = (e.clientY - offsetY) + 'px';
        }
      });

      draggable.addEventListener('dragend', () => {
        // dragend eventinde sınıfları kaldır
        draggable.classList.remove('dragging', 'drag-placeholder');

        // Ekran dışındaki klon elementi DOM'dan tamamen temizle
        if (activeDragClone && activeDragClone.parentNode) {
          activeDragClone.parentNode.removeChild(activeDragClone);
          activeDragClone = null;
        }

        // Sürükleme bittiğinde tüm öğelerin inline transform ve transition stillerini temizle
        draggables.forEach(item => {
          item.style.transform = '';
          item.style.transition = '';
          if (item._animTimer) clearTimeout(item._animTimer);
        });
        updateTaskOrderBadges();
      });
    });

    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }

      // Klonu dragover esnasında da fare koordinatlarına tam bağlı tut
      if (activeDragClone && e.clientX > 0 && e.clientY > 0 && activeDragClone.dataset.offsetX) {
        const offsetX = parseFloat(activeDragClone.dataset.offsetX);
        const offsetY = parseFloat(activeDragClone.dataset.offsetY);
        activeDragClone.style.left = (e.clientX - offsetX) + 'px';
        activeDragClone.style.top = (e.clientY - offsetY) + 'px';
      }

      const afterElement = getDragAfterElement(list, e.clientY);
      const draggingItem = list.querySelector('.dragging') || list.querySelector('.drag-placeholder');
      if (!draggingItem) return;

      // Pozisyon gerçekten değişmediyse FLIP animasyonunu tetikleme
      const currentNext = draggingItem.nextElementSibling;
      if (currentNext === afterElement) return;

      // 1. FLIP (First): Listenin mevcut görsel koordinatlarını kaydet
      const items = [...list.querySelectorAll('.draggable-task-item')];
      const firstPositions = new Map();
      items.forEach(item => {
        firstPositions.set(item, item.getBoundingClientRect());
      });

      // 2. DOM düğümünü yeni yerine taşı
      if (afterElement == null) {
        list.appendChild(draggingItem);
      } else {
        list.insertBefore(draggingItem, afterElement);
      }

      // 3. FLIP (Last, Invert, Play): Yer değiştiren kardeş elemanları pürüzsüz kaydır (slide)
      // transition: transform 0.2s ease (yumuşak kayma)
      items.forEach(item => {
        if (item === draggingItem) return;
        const firstRect = firstPositions.get(item);
        const lastRect = item.getBoundingClientRect();
        const deltaY = firstRect.top - lastRect.top;

        if (deltaY !== 0) {
          // Invert: Eski konumuna anında geri al (zıplama hissini yok eder)
          item.style.transition = 'none';
          item.style.transform = `translateY(${deltaY}px)`;
          void item.offsetHeight; // Reflow tetikle

          // Play: Yeni konumuna yumuşakça (0.2s ease) kaydır
          item.style.transition = 'transform 0.2s ease';
          item.style.transform = 'translateY(0)';

          if (item._animTimer) clearTimeout(item._animTimer);
          item._animTimer = setTimeout(() => {
            if (!item.classList.contains('dragging') && !item.classList.contains('drag-placeholder')) {
              item.style.transform = '';
              item.style.transition = '';
            }
          }, 210);
        }
      });

      // Görev sırası adımlarını anlık güncelle
      updateTaskOrderBadges();
    });

    list.addEventListener('drop', (e) => {
      e.preventDefault();
      if (activeDragClone && activeDragClone.parentNode) {
        activeDragClone.parentNode.removeChild(activeDragClone);
        activeDragClone = null;
      }
      updateTaskOrderBadges();
    });
  }

    // Elementin transform animasyonundan arındırılmış gerçek resting DOM konumunu hesaplar
    function getElementRestingTop(el) {
      const rect = el.getBoundingClientRect();
      let transformY = 0;
      const style = window.getComputedStyle(el);
      if (style.transform && style.transform !== 'none') {
        try {
          const matrix = new DOMMatrixReadOnly(style.transform);
          transformY = matrix.m42 || 0;
        } catch (e) {
          // Fallback
        }
      }
      return rect.top - transformY;
    }

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.draggable-task-item:not(.dragging):not(.drag-placeholder)')];

      return draggableElements.reduce((closest, child) => {
        const restingTop = getElementRestingTop(child);
        const childHeight = child.offsetHeight || child.getBoundingClientRect().height;
        // Büyütülen yeni buton yüksekliğine tam uyarlanmış stabil orta nokta eşiği
        const offset = y - restingTop - childHeight / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

  function updateTaskOrderBadges() {
    const list = document.getElementById('sortable-task-list');
    if (!list) return;
    const items = list.querySelectorAll('.draggable-task-item');
    items.forEach((item, index) => {
      const badge = item.querySelector('.task-order-badge');
      if (badge) {
        badge.textContent = `${index + 1}. ADIM`;
      }
    });
  }

  /**
   * ========================================================
   * PLANLAMA EKRANI: KORUYUCU DONANIM SEÇİMİ (TOGGLE)
   * - 6 adet donanım kartına tıklandığında .selected-gear sınıfı toggle edilir.
   * ========================================================
   */
  function initGearSelection() {
    const gearCards = document.querySelectorAll('.gear-card-item');
    gearCards.forEach(card => {
      // 2. Otomatik Seçim Durumunun İptal Edilmesi:
      // Başlangıç durumunda tüm kartların seçimsiz (nötr) olmasını garanti et
      card.classList.remove('selected-gear', 'selected', 'active');
      card.setAttribute('aria-pressed', 'false');

      card.addEventListener('click', () => {
        card.classList.toggle('selected-gear');
        const isSelected = card.classList.contains('selected-gear');
        card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
    });
  }

  /**
   * ========================================================
   * PLANLAMA EKRANI: 'PLANIMI ONAYLA' BUTON ETKİLEŞİMİ, DURUM YÖNETİMİ VE YENİ SAHNE
   * ========================================================
   */
  function handleConfirmPlanClick() {
    // 1. Veri Kayıt İşlemleri (State Management):
    // 'Görev Sırası' alanında kullanıcının sıraladığı butonların güncel sırasını oku ve gorevsirasi dizisine kaydet
    gorevsirasi = [];
    const taskItems = document.querySelectorAll('#sortable-task-list .draggable-task-item');
    taskItems.forEach(item => {
      const taskId = item.getAttribute('data-task-id') || item.id || item.innerText.trim();
      gorevsirasi.push(taskId);
    });

    // 'Koruyucu Donanım' alanındaki seçilmiş/aktif olan öğeleri tespit et ve koruyucudonanimlar dizisine kaydet
    koruyucudonanimlar = [];
    const selectedGears = document.querySelectorAll('.gear-card-item.selected-gear, .gear-card-item.selected, .gear-card-item.active');
    selectedGears.forEach(card => {
      const gearId = card.getAttribute('data-gear-id') || card.id || card.innerText.trim();
      koruyucudonanimlar.push(gearId);
    });

    console.log('--- VARDİYA PLANI ONAYLANDI ---');
    console.log('1. Kaydedilen Görev Sırası (gorevsirasi):', gorevsirasi);
    console.log('2. Kaydedilen Koruyucu Donanımlar (koruyucudonanimlar):', koruyucudonanimlar);

    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'VARDİYA PLANI ONAYLANDI';
    }

    if (btnConfirmPlan) {
      btnConfirmPlan.classList.add('plan-confirmed-pulse');
      setTimeout(() => {
        btnConfirmPlan.classList.remove('plan-confirmed-pulse');
      }, 800);
    }

    // 2. Arayüz Temizliği (Fade-Out):
    // 'Görev Sırası' ve 'Koruyucu Donanım' kapsayıcılarını CSS transition ile yavaşça ekrandan kaybet
    hideConfirmPlanButton(true);
    hidePlanningStage(true);

    // ÇOK ÖNEMLİ KURAL: Bu yok olma işlemi sırasında sahnede bulunan öğretmen avatarı
    // KESİNLİKLE yerinde durmalı ve bu gizlenme işleminden hiçbir şekilde etkilenmemelidir.
    // Öğretmenin görünürlüğü (opacity: 1) korunmalıdır.
    if (teacherAvatarContainer) {
      teacherAvatarContainer.classList.remove('fade-out', 'fade-out-slow');
      teacherAvatarContainer.classList.add('visible');
      teacherAvatarContainer.style.opacity = '1';
      teacherAvatarContainer.style.visibility = 'visible';
      teacherAvatarContainer.style.pointerEvents = 'auto';
    }

    // 3. HAZIRLIK MASASI VE KONTROL LİSTESİ SAHNESİNİ AÇ:
    // Planlama ekranı kaybolduktan (yaklaşık 650ms) sonra etkileşimli hazırlık sahnesi belirir
    if (hazirlikStageTimer) clearTimeout(hazirlikStageTimer);
    hazirlikStageTimer = setTimeout(() => {
      showHazirlikScene();
    }, 650);
  }

  // Ses dosyası çalmayı bitirdiğinde: Yeni görsel butonu ekranda göster
  if (shiftAudio) {
    shiftAudio.addEventListener('ended', () => {
      if (audioEqualizer) {
        audioEqualizer.classList.remove('playing');
      }
      if (audioStatusLabel) {
        audioStatusLabel.textContent = 'BRİFİNG TAMAMLANDI';
      }
      if (speechText && speechText.textContent.length < SPEECH_FULL_TEXT.length) {
        speechText.textContent = SPEECH_FULL_TEXT;
      }
      if (typewriterCursor) {
        typewriterCursor.classList.add('finished');
      }

      // ÖĞRETMENİN KONUŞMASI TAMAMLANDIKTAN HEMEN SONRA:
      // Ekranda yeni görsel buton (btn.png) belirsin (fade-in)
      showShiftActionButton();
    });

    shiftAudio.addEventListener('error', (e) => {
      console.warn('Ses dosyası yüklenirken hata oluştu:', e);
      if (audioStatusLabel) {
        audioStatusLabel.textContent = 'SES HATASI';
      }
      // Olası bir ses hatasında akış kilitlenmesin diye butonu göster
      showShiftActionButton();
    });
  }


  /**
   * 3. İLK GİRİŞ BUTONU VE YAVAŞ SLIDE-UP ANİMASYON SIRALAMASI
   * - İlk "Vardiyayı Başlat" butonuna (btn-start-shift) tıklandığında;
   *   öğretmenin ekrana gelme, konuşma ve metni ekrana yazdırma işlemleri
   *   mevcut haliyle çalışmaya devam eder.
   */
  function startSimulationSequence() {
    // Önceki zamanlayıcıları ve animasyonları sıfırla
    if (animationTimer) clearTimeout(animationTimer);
    if (workbenchTimer) clearTimeout(workbenchTimer);
    if (teacherAvatarTimer) clearTimeout(teacherAvatarTimer);
    if (planShiftTimer) {
      clearTimeout(planShiftTimer);
      planShiftTimer = null;
    }
    if (confirmPlanTimer) {
      clearTimeout(confirmPlanTimer);
      confirmPlanTimer = null;
    }
    if (hazirlikStageTimer) {
      clearTimeout(hazirlikStageTimer);
      hazirlikStageTimer = null;
    }
    gorevsirasi = [];
    koruyucudonanimlar = [];
    stopVoiceOver();
    stopTaskInteraction(true);

    // Yeni görsel butonlar, çalışma tezgahı, sağ görev menüsü, öğretmen avatarı ve hazırlık masası başlangıçta KESİNLİKLE gizlidir
    hideShiftActionButton(false);
    hidePlanShiftButton(false);
    hideConfirmPlanButton(false);
    hidePlanningStage(false);
    hideWorkbench(false);
    hideTaskMenu(false);
    hideTeacherAvatar(false);
    resetHazirlikScene(true);

    // Konuşma balonunu başlangıç durumuna getir
    if (speechBubble) {
      speechBubble.classList.remove('visible', 'fade-out', 'fade-out-slow');
    }

    // Başlangıç etkileşim kartını gizle
    if (startOverlay) {
      startOverlay.classList.add('hidden');
    }

    // Karakter animasyon sınıflarını sıfırla
    characterWrapper.classList.remove('animate-slow-slide', 'animate-slow-slide-exit', 'idle-breathing');
    void characterWrapper.offsetWidth; // DOM reflow zorla

    // 1. Kadın Karakterin Yavaş Slide-Up Animasyonunu Başlat (3.6 Saniye Sürer)
    characterWrapper.classList.add('animate-slow-slide');
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'KARAKTER GİRİŞİ YAPILIYOR...';
    }

    // 2. Karakter yerine oturduğu anda (3600ms sonra):
    // Ekranda öncelikle "Vardiyaya Başla" butonu yer alır!
    // Sağdaki görev menüsü yalnızca bu butona basıldığında açılacaktır.
    animationTimer = setTimeout(() => {
      // Karakteri nefes alma canlılık moduna al
      characterWrapper.classList.add('idle-breathing');

      // "Vardiyaya Başla" butonu sahnede belirsin
      showShiftActionButton();

      // Sound klasöründeki ses dosyasını çal
      playVoiceOver();
    }, 3600);
  }

  // Simülasyonu Baştan Başlat
  function resetSimulation() {
    if (animationTimer) clearTimeout(animationTimer);
    if (workbenchTimer) clearTimeout(workbenchTimer);
    if (teacherAvatarTimer) clearTimeout(teacherAvatarTimer);
    if (planShiftTimer) {
      clearTimeout(planShiftTimer);
      planShiftTimer = null;
    }
    if (confirmPlanTimer) {
      clearTimeout(confirmPlanTimer);
      confirmPlanTimer = null;
    }
    if (planningStageTimer) {
      clearTimeout(planningStageTimer);
      planningStageTimer = null;
    }
    if (hazirlikStageTimer) {
      clearTimeout(hazirlikStageTimer);
      hazirlikStageTimer = null;
    }
    gorevsirasi = [];
    koruyucudonanimlar = [];
    stopVoiceOver();
    stopTypewriter();
    stopTaskInteraction(true);

    // Üst başlık metnini orijinal haline döndür
    if (bannerMainTitle) {
      bannerMainTitle.textContent = ORIGINAL_BANNER_TITLE;
    }

    hideShiftActionButton(false);
    hidePlanShiftButton(false);
    hideConfirmPlanButton(false);
    hidePlanningStage(false);
    hideWorkbench(false);
    hideTaskMenu(false);
    hideTeacherAvatar(false);
    resetHazirlikScene(true);
    const gearCards = document.querySelectorAll('.gear-card-item');
    gearCards.forEach(card => card.classList.remove('selected-gear'));
    if (mainRowContainer) {
      mainRowContainer.classList.remove('fade-out-slow');
    }
    if (workbenchContainer) {
      workbenchContainer.classList.remove('fade-out-slow');
    }
    if (taskMenuContainer) {
      taskMenuContainer.classList.remove('fade-out-slow');
    }
    if (teacherAvatarContainer) {
      teacherAvatarContainer.classList.remove('fade-out-slow');
    }
    if (avatarSpeechBubble) {
      avatarSpeechBubble.classList.remove('fade-out-slow');
    }
    if (speechBubble) {
      speechBubble.classList.remove('visible', 'fade-out', 'fade-out-slow');
    }
    characterWrapper.classList.remove('animate-slow-slide', 'animate-slow-slide-exit', 'idle-breathing');
    if (startOverlay) {
      startOverlay.classList.remove('hidden');
    }
  }


  /**
   * 4. EKRAN YÖNÜ (ORIENTATION) TAKİP SİSTEMİ
   * Telefon dikey (portrait) konuma getirilirse:
   * - Asıl sahne ve karakter gizlenir.
   * - Ses ve animasyonlar durdurulur.
   * - Tam ekran uyarı katmanı açılır ('Lütfen devam etmek için cihazınızı yatay konuma getirin.').
   * 
   * Telefon yatay (landscape) konuma getirildiğinde:
   * - Uyarı ekranı kaybolur.
   * - Asıl sahne ve 'Vardiyaya Başla' butonu etkileşime hazır hale gelir.
   */
  function isDeviceInLandscape() {
    // 1. Masaüstü test / geliştirici önizleme modu açık mı?
    if (document.body.classList.contains('force-landscape-preview')) {
      return true;
    }

    // 2. Modern Screen Orientation API kontrolü
    if (window.screen && window.screen.orientation && window.screen.orientation.type) {
      if (window.screen.orientation.type.startsWith('landscape')) {
        return true;
      }
      if (window.screen.orientation.type.startsWith('portrait')) {
        return false;
      }
    }

    // 3. Mobil Safari / iOS window.orientation açısı kontrolü
    if (typeof window.orientation === 'number') {
      if (Math.abs(window.orientation) === 90) {
        return true;
      }
      if (window.orientation === 0 || window.orientation === 180) {
        return false;
      }
    }

    // 4. CSS matchMedia ve En-Boy Oranı kontrolü
    const isLandscapeMedia = window.matchMedia('(orientation: landscape)').matches;
    const aspectLandscape = (window.innerWidth / window.innerHeight) > 1.05;

    return isLandscapeMedia || aspectLandscape;
  }

  function checkOrientation() {
    const currentlyLandscape = isDeviceInLandscape();

    if (currentlyLandscape !== isLandscape) {
      isLandscape = currentlyLandscape;

      if (isLandscape) {
        // Cihaz Yatay Konuma Getirildi: Uyarı katmanı kapanır, asıl sahne etkileşime hazır hale gelir
        if (orientationOverlay) {
          orientationOverlay.style.display = 'none';
        }
        if (mainStage) {
          mainStage.style.display = 'flex';
        }
        resetSimulation();
      } else {
        // Cihaz Dikey Konuma Getirildi: Asıl içerik gizlenir, ses durdurulur ve uyarı katmanı açılır
        stopVoiceOver();
        stopTaskInteraction(false);
        if (animationTimer) clearTimeout(animationTimer);
        characterWrapper.classList.remove('animate-slow-slide', 'idle-breathing');
        if (startOverlay) {
          startOverlay.classList.remove('hidden');
        }
        if (orientationOverlay) {
          orientationOverlay.style.display = 'flex';
        }
        if (mainStage) {
          mainStage.style.display = 'none';
        }
      }
    }
  }

  // Ekran yönü dinleyicileri
  window.addEventListener('resize', checkOrientation);

  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', checkOrientation);
  } else {
    window.addEventListener('orientationchange', checkOrientation);
  }

  const landscapeQuery = window.matchMedia('(orientation: landscape)');
  if (landscapeQuery.addEventListener) {
    landscapeQuery.addEventListener('change', checkOrientation);
  } else if (landscapeQuery.addListener) {
    landscapeQuery.addListener(checkOrientation);
  }


  /**
   * 5. KULLANICI ETKİLEŞİMİ VE BUTONLAR
   */

  // BUTON 1: Giriş ekranındaki ilk "Vardiyaya Başla" butonu (btnStartShift)
  // Tıklandığında overlay kapanır, öğretmen ekrana gelir, konuşma ve daktilo başlar.
  if (btnStartShift) {
    btnStartShift.addEventListener('click', () => {
      unlockAudio();
      startSimulationSequence();
    });
  }

  // BUTON 2: Öğretmenin konuşması bittiğinde beliren YENİ GÖRSEL BUTON (btnShiftAction)
  // İlk butondan tamamen bağımsızdır! Tıklandığında öğretmenin çıkış animasyonunu tetikler.
  if (btnShiftAction) {
    btnShiftAction.addEventListener('click', () => {
      handleShiftActionClick();
    });
  }

  // BUTON 3: Tezgah belirdikten sonra açılan 'VARDİYAYI PLANLA' Butonu (btnPlanShift)
  if (btnPlanShift) {
    btnPlanShift.addEventListener('click', () => {
      handlePlanShiftClick();
    });
  }

  // BUTON 4: Planlama ekranındaki 'Planımı Onayla' Butonu (btnConfirmPlan)
  if (btnConfirmPlan) {
    btnConfirmPlan.addEventListener('click', () => {
      handleConfirmPlanClick();
    });
  }


  // Yeniden Başlat Butonu -> Simülasyonu ve hazırlık masasını baştan başlatır
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      unlockAudio();
      if (typeof window.resetSimulation === 'function') {
        window.resetSimulation();
      } else {
        startSimulationSequence();
      }
    });
  }

  /**
   * ========================================================
   * ÖĞRETMEN AVATARI SESLİ ANLATIM VE DAKTİLO (TYPEWRITER) SİSTEMİ
   * "Görevler ve Protokoller" butonlarına tıklandığında:
   * 1. Önceki çalan tüm sesler durdurulur.
   * 2. Tıklanan göreve ait ses dosyası sound/ klasöründen yüklenir.
   * 3. Öğretmen avatarının başından çıkan konuşma baloncuğu açılır.
   * 4. Metin daktilo efektiyle sesle eşzamanlı harf harf yazılır.
   * ========================================================
   */

  function stopAvatarTypewriter() {
    if (avatarTypewriterTimer) {
      clearTimeout(avatarTypewriterTimer);
      avatarTypewriterTimer = null;
    }
    avatarTypewriterIndex = 0;
    if (avatarTypewriterCursor) {
      avatarTypewriterCursor.classList.remove('finished');
    }
  }

  function startAvatarTypewriter(fullText, audioEl) {
    stopAvatarTypewriter();

    if (!avatarSpeechBubble || !avatarSpeechText) return;

    avatarSpeechBubble.classList.remove('fade-out');
    avatarSpeechText.textContent = '';
    if (avatarTypewriterCursor) {
      avatarTypewriterCursor.classList.remove('finished');
    }
    avatarSpeechBubble.classList.add('visible');

    // Ses süresine tam uyumlu daktilo hızı hesaplaması
    let audioDurationMs = 10000;
    if (audioEl && audioEl.duration && !isNaN(audioEl.duration) && audioEl.duration > 2) {
      audioDurationMs = audioEl.duration * 1000;
    }

    const totalChars = fullText.length;
    const baseDelay = Math.max(26, Math.floor((audioDurationMs - 800) / totalChars));

    avatarTypewriterIndex = 0;

    function typeNextChar() {
      if (avatarTypewriterIndex < totalChars) {
        const char = fullText.charAt(avatarTypewriterIndex);
        avatarSpeechText.textContent += char;
        avatarTypewriterIndex++;

        // Doğal konuşma nefes payları ve duraklamalar
        let delay = baseDelay;
        if (char === '.') {
          delay = baseDelay + 220;
        } else if (char === ',' || char === ':') {
          delay = baseDelay + 130;
        }

        avatarTypewriterTimer = setTimeout(typeNextChar, delay);
      } else {
        if (avatarTypewriterCursor) {
          avatarTypewriterCursor.classList.add('finished');
        }
      }
    }

    avatarTypewriterTimer = setTimeout(typeNextChar, 140);
  }

  function hideAvatarSpeechBubble(animated = true) {
    stopAvatarTypewriter();
    if (!avatarSpeechBubble) return;
    avatarSpeechBubble.classList.remove('teacher-bubble-work-ready');
    avatarSpeechBubble.classList.remove('visible');
    if (animated) {
      avatarSpeechBubble.classList.add('fade-out');
    } else {
      avatarSpeechBubble.classList.remove('fade-out');
    }
    if (avatarSpeechText) {
      avatarSpeechText.textContent = '';
    }
  }

  function stopTaskInteraction(clearButtons = true) {
    if (taskAudio) {
      taskAudio.pause();
      taskAudio.currentTime = 0;
    }
    if (audioEqualizer) {
      audioEqualizer.classList.remove('playing');
    }
    hideAvatarSpeechBubble(false);
    activeTaskIndex = -1;
    if (clearButtons) {
      const allTaskBtns = document.querySelectorAll('.task-menu-btn');
      allTaskBtns.forEach(btn => btn.classList.remove('active-task-btn'));
    }
  }

  function playTaskInteraction(taskIndex) {
    const task = TASK_DATA[taskIndex];
    if (!task) return;

    activeTaskIndex = taskIndex;

    // 1. Önceki tüm sesleri anında durdur (brifing sesi veya önceki görev sesi)
    if (shiftAudio && !shiftAudio.paused) {
      shiftAudio.pause();
      shiftAudio.currentTime = 0;
    }
    if (taskAudio) {
      taskAudio.pause();
      taskAudio.currentTime = 0;
    }

    // 2. Butonların aktif görsel durumunu güncelle
    const allTaskBtns = document.querySelectorAll('.task-menu-btn');
    allTaskBtns.forEach((btn, idx) => {
      if (idx === taskIndex) {
        btn.classList.add('active-task-btn');
      } else {
        btn.classList.remove('active-task-btn');
      }
    });

    // 3. Öğretmen avatarının sahnede görünür olduğundan emin ol
    showTeacherAvatar();

    // 4. Göreve ait ses dosyasını yükle ve oynat
    if (taskAudio) {
      taskAudio.src = task.audioSrc;
      taskAudio.muted = isMuted;

      const playPromise = taskAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (audioEqualizer) {
            audioEqualizer.classList.add('playing');
          }
          if (audioStatusLabel) {
            audioStatusLabel.textContent = `${task.shortTitle.toUpperCase()} SESLENDİRİLİYOR`;
          }
          startAvatarTypewriter(task.text, taskAudio);
        }).catch(err => {
          console.warn('Görev sesi otomatik oynatılamadı, alternatif deneniyor:', err);
          if (task.audioFallback) {
            taskAudio.src = task.audioFallback;
            taskAudio.play().catch(() => {});
          }
          if (audioStatusLabel) {
            audioStatusLabel.textContent = `${task.shortTitle.toUpperCase()} AKTİF`;
          }
          startAvatarTypewriter(task.text, taskAudio);
        });
      } else {
        startAvatarTypewriter(task.text, taskAudio);
      }
    } else {
      startAvatarTypewriter(task.text, null);
    }
  }

  // Görev Sesi Olay Dinleyicileri
  if (taskAudio) {
    taskAudio.addEventListener('ended', () => {
      if (audioEqualizer) {
        audioEqualizer.classList.remove('playing');
      }
      if (activeTaskIndex >= 0 && TASK_DATA[activeTaskIndex]) {
        if (audioStatusLabel) {
          audioStatusLabel.textContent = `${TASK_DATA[activeTaskIndex].shortTitle.toUpperCase()} TAMAMLANDI`;
        }
        if (avatarSpeechText && avatarSpeechText.textContent.length < TASK_DATA[activeTaskIndex].text.length) {
          avatarSpeechText.textContent = TASK_DATA[activeTaskIndex].text;
        }
      }
      if (avatarTypewriterCursor) {
        avatarTypewriterCursor.classList.add('finished');
      }
    });

    taskAudio.addEventListener('error', (e) => {
      console.warn('Görev ses dosyası hatası:', e);
      if (activeTaskIndex >= 0 && TASK_DATA[activeTaskIndex]?.audioFallback) {
        const fallback = TASK_DATA[activeTaskIndex].audioFallback;
        if (taskAudio.src !== fallback) {
          taskAudio.src = fallback;
          taskAudio.play().catch(() => {});
        }
      }
    });
  }

  // Konuşma Balonuna Tıklandığında Kapatma
  if (avatarSpeechBubble) {
    avatarSpeechBubble.addEventListener('click', () => {
      hideAvatarSpeechBubble(true);
      if (taskAudio && !taskAudio.paused) {
        taskAudio.pause();
      }
      if (audioEqualizer) {
        audioEqualizer.classList.remove('playing');
      }
    });
  }

  // SAĞ GÖREV MENÜSÜ BUTONLARI ETKİLEŞİMİ (1: Çözelti Hazırla, 2: Numuneyi İncele, 3: Yüzeyi Temizle, 4: Atıkları Ayır)
  const taskButtons = document.querySelectorAll('.task-menu-btn');
  taskButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      unlockAudio();
      playTaskInteraction(idx);
    });
  });

  // Sesi Aç / Kapat (Mute/Unmute)
  btnAudioToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    if (shiftAudio) {
      shiftAudio.muted = isMuted;
    }
    if (taskAudio) {
      taskAudio.muted = isMuted;
    }

    if (isMuted) {
      iconSoundOn.classList.add('hidden');
      iconSoundOff.classList.remove('hidden');
    } else {
      iconSoundOn.classList.remove('hidden');
      iconSoundOff.classList.add('hidden');
    }
  });

  /**
   * TAM EKRAN (FULLSCREEN) YÖNETİM SİSTEMİ
   * - Mobil telefonlar (Android Chrome, iOS Safari), tablet ve masaüstü ile tam uyumlu
   * - Android Chrome ve modern mobil tarayıcılarda ekranı otomatik olarak yatay konuma kilitler (screen.orientation.lock)
   * - iOS Safari (iPhone) gibi HTML5 Fullscreen API desteklemeyen mobil cihazlarda akıllı Pseudo-Fullscreen moduna geçer
   * - Büyüt / Küçült ikonlarını ve durumları (ESC, swipe, buton) otomatik eşitler
   */
  function isNativeFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  function isFullscreenActive() {
    return isNativeFullscreen() || document.body.classList.contains('fullscreen-fallback-active');
  }

  function updateFullscreenUI() {
    const active = isFullscreenActive();

    if (active) {
      document.body.classList.add('fullscreen-active');
      if (iconFsEnter) iconFsEnter.classList.add('hidden');
      if (iconFsExit) iconFsExit.classList.remove('hidden');
      if (btnFullscreen) {
        btnFullscreen.title = 'Tam Ekrandan Çık';
        btnFullscreen.classList.add('active');
      }
    } else {
      document.body.classList.remove('fullscreen-active', 'fullscreen-fallback-active');
      if (iconFsEnter) iconFsEnter.classList.remove('hidden');
      if (iconFsExit) iconFsExit.classList.add('hidden');
      if (btnFullscreen) {
        btnFullscreen.title = 'Tam Ekran';
        btnFullscreen.classList.remove('active');
      }
    }
  }

  async function enterFullscreen() {
    // 1. Ekrana yatay kilitleme gönder (Mobil Android / Destekleyen tarayıcılar)
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function') {
      try {
        await window.screen.orientation.lock('landscape');
      } catch (e) {
        // İzin verilmezse sessizce devam et
      }
    }

    // 2. Yerel Fullscreen API dene (documentElement, body veya mainStage)
    const docEl = document.documentElement;
    const requestMethod = docEl.requestFullscreen ||
                          docEl.webkitRequestFullscreen ||
                          docEl.webkitRequestFullScreen ||
                          docEl.mozRequestFullScreen ||
                          docEl.msRequestFullscreen;

    let nativeSuccess = false;
    if (requestMethod) {
      try {
        const res = requestMethod.call(docEl);
        if (res && typeof res.then === 'function') {
          await res;
        }
        nativeSuccess = true;
      } catch (err) {
        console.warn('Yerel tam ekran açılamadı, mobil yedek mod uygulanıyor:', err);
        nativeSuccess = false;
      }
    }

    // 3. iOS Safari (iPhone) veya yerel API desteklemeyen / kısıtlı tarayıcılar için yedek mod
    if (!nativeSuccess) {
      document.body.classList.add('fullscreen-fallback-active');
      document.body.classList.add('force-landscape-preview');
      window.scrollTo(0, 1);
    }

    updateFullscreenUI();
  }

  async function exitFullscreen() {
    // 1. Ekran yönü kilidini serbest bırak
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.unlock === 'function') {
      try {
        window.screen.orientation.unlock();
      } catch (e) {}
    }

    // 2. Yerel tam ekrandan çık
    if (isNativeFullscreen()) {
      const exitMethod = document.exitFullscreen ||
                         document.webkitExitFullscreen ||
                         document.mozCancelFullScreen ||
                         document.msExitFullscreen;
      if (exitMethod) {
        try {
          const res = exitMethod.call(document);
          if (res && typeof res.then === 'function') {
            await res;
          }
        } catch (err) {
          console.warn('Tam ekrandan çıkış hatası:', err);
        }
      }
    }

    // 3. Yedek modu sonlandır
    document.body.classList.remove('fullscreen-fallback-active');
    updateFullscreenUI();
  }

  function toggleFullscreen() {
    if (isFullscreenActive()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
  }

  if (btnOverlayFullscreen) {
    btnOverlayFullscreen.addEventListener('click', () => {
      enterFullscreen();
      document.body.classList.add('force-landscape-preview');
      checkOrientation();
    });
  }

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evtName => {
    document.addEventListener(evtName, updateFullscreenUI);
  });

  // Masaüstünde dikey boyutta test edenler için Önizleme Modu Butonu
  btnForceLandscape.addEventListener('click', () => {
    document.body.classList.toggle('force-landscape-preview');
    checkOrientation();
  });

  /* =========================================================
   * 7. HAZIRLIK MASASI VE KONTROL LİSTESİ YÖNETİMİ
   * (hazirlik_masasi.html dosyasındaki etkileşimli sahne ve animasyonlar)
   * ========================================================= */
  const NS_SVG = 'http://www.w3.org/2000/svg';
  const hazirlikScene = document.getElementById('hazirlik-sahnesi');

  const hEl = {
    water: document.getElementById('bottleWater'),
    waterCap: document.getElementById('waterCap'),
    waterInner: document.getElementById('waterInner'),
    jar: document.getElementById('jarA'),
    jarCap: document.getElementById('jarCap'),
    pills: document.getElementById('pillsInner'),
    beakerFill: document.getElementById('beakerFill'),
    tint: document.getElementById('solutionTint'),
    sediment: document.getElementById('beakerSediment'),
    fall: document.getElementById('fallLayer'),
    stream: document.getElementById('pourStream'),
    streamFlow: document.getElementById('pourStreamFlow'),
    rod: document.getElementById('stirRod'),
    rodSlot: document.getElementById('rodSlot'),
    label: document.getElementById('beakerLabel'),
    labelShine: document.getElementById('labelShine'),
    labelDate: document.getElementById('labelDate'),
    volTag: document.getElementById('volTag'),
    volText: document.getElementById('volText'),
    scan: document.getElementById('scanBeam'),
    toast: document.getElementById('desk-toast'),
    toastText: document.getElementById('toast-text'),
    toastIcon: document.getElementById('toast-icon'),
    progressText: document.getElementById('progress-text'),
    progressFill: document.getElementById('progress-fill'),
    progressTrack: document.getElementById('progress-track'),
    ringFill: document.getElementById('ring-fill')
  };

  const hItems = {
    jar: document.getElementById('itemJar'),
    water: document.getElementById('itemWater'),
    beaker: document.getElementById('itemBeaker'),
    tray: document.getElementById('itemTray')
  };

  const hSteps = {
    materials: document.getElementById('step-materials'),
    workspace: document.getElementById('step-workspace'),
    label: document.getElementById('step-label'),
    prepare: document.getElementById('step-prepare')
  };

  const hRodHome = hEl.rod ? hEl.rod.parentNode : null;

  // 3. MALZEMELERİ SEÇ MODAL ELEMANLARI
  const materialsModal = document.getElementById('materials-modal');
  const materialsModalBackdrop = document.getElementById('materials-modal-backdrop');
  const btnCloseMaterialsModal = document.getElementById('btn-close-materials-modal');
  const btnConfirmMaterialsModal = document.getElementById('btn-confirm-materials-modal');
  const modalAlertBanner = document.getElementById('modal-alert-banner');
  const modalAlertText = document.getElementById('modal-alert-text');
  const modalCountBadge = document.getElementById('modal-count-badge');
  const modalFootHint = document.getElementById('modal-foot-hint');
  const mCards = {
    jar: document.getElementById('mcard-jar'),
    water: document.getElementById('mcard-water'),
    beaker: document.getElementById('mcard-beaker'),
    unlabeled: document.getElementById('mcard-unlabeled')
  };

  // 4. HAZIRLAMAYA BAŞLA BUTONU ELEMANLARI
  const startPrepContainer = document.getElementById('start-prep-container');
  const btnStartPrep = document.getElementById('btn-start-prep');

  // 2. DİNAMİK ETİKETLEME MODAL ELEMANLARI
  const labelModalBackdrop = document.getElementById('label-modal-backdrop');
  const labelModal = document.getElementById('label-modal');
  const btnCloseLabelModal = document.getElementById('btn-close-label-modal');
  const btnCancelLabel = document.getElementById('btn-cancel-label');
  const btnConfirmLabel = document.getElementById('btn-confirm-label');
  const inputLabelText = document.getElementById('input-label-text');
  const btnClearLabelInput = document.getElementById('btn-clear-label-input');
  const labelPreviewText = document.getElementById('label-preview-text');
  const beakerLabelCustomText = document.getElementById('beakerLabelCustomText');
  const quickTagButtons = document.querySelectorAll('.quick-tag-btn');

  // 3. ÇALIŞMA ALANI KONTROLÜ VE YABANCI NESNELER ELEMANLARI
  const workspaceModalBackdrop = document.getElementById('workspace-modal-backdrop');
  const btnCloseWorkspaceModal = document.getElementById('btn-close-workspace-modal');
  const btnConfirmWorkspace = document.getElementById('btn-confirm-workspace');
  const btnCleanAllWorkspace = document.getElementById('btn-clean-all-workspace');
  const btnCleanRack = document.getElementById('btn-clean-rack');
  const btnCleanPetri = document.getElementById('btn-clean-petri');
  const itemDirtyRackWrap = document.getElementById('itemDirtyRackWrap');
  const itemDirtyPetriWrap = document.getElementById('itemDirtyPetriWrap');
  const wsCardRack = document.getElementById('ws-card-rack');
  const wsCardPetri = document.getElementById('ws-card-petri');
  const badgeRack = document.getElementById('badge-rack');
  const badgePetri = document.getElementById('badge-petri');
  const workspaceStatusBanner = document.getElementById('workspace-status-banner');
  const workspaceStatusTitle = document.getElementById('workspace-status-title');
  const workspaceStatusDesc = document.getElementById('workspace-status-desc');

  // 4. MERKEZİ SAHNE GEÇİŞİ UYARI PENCERESİ ELEMANLARI
  const stageTransitionOverlay = document.getElementById('stage-transition-overlay');
  const transProgressFill = document.getElementById('trans-progress-fill');

  const H_ANIMATED = [
    hEl.water, hEl.waterCap, hEl.waterInner, hEl.jar, hEl.jarCap, hEl.pills, hEl.beakerFill,
    hEl.tint, hEl.sediment, hEl.stream, hEl.rod, hEl.label, hEl.labelShine
  ];

  let hState = {
    foreignItems: { rack: true, petri: true },
    materialsPlaced: { jar: false, water: false, beaker: false },
    materialsDone: false,
    workspaceDone: false,
    labeled: false,
    prepared: false,
    customLabelText: 'Madde A Çözeltisi',
    busy: false
  };

  function hasForeignItemsOnDesk() {
    return !!(hState.foreignItems && (hState.foreignItems.rack || hState.foreignItems.petri));
  }
  let modalAlertTimer = null;
  let hRunId = 0;
  const H_ABORT = Symbol('abort_hazirlik');
  const hRunning = new Set();

  // Çözelti rengi senkronizasyonu: Karıştırma sonucu oluşan renk tüm aktarımlarda dinamik korunur
  let currentSolutionColor = {
    fill: 'url(#gBeakerWater)',
    surface: '#bae6fd',
    stroke: '#7dd3fc',
    hex: '#0284c7',
    isStirred: false
  };

  function updateTargetSolutionColors(colorDef) {
    if (colorDef) {
      currentSolutionColor = Object.assign(currentSolutionColor, colorDef);
    }
    const medRect = document.getElementById('mediumBottleLiquidRect') || (document.getElementById('mediumBottleLiquid') ? document.getElementById('mediumBottleLiquid').querySelector('rect') : null);
    const medSurface = document.getElementById('mediumBottleLiquidSurface') || (document.getElementById('mediumBottleLiquid') ? document.getElementById('mediumBottleLiquid').querySelector('ellipse') : null);
    const sampleRect = document.getElementById('sampleBottleLiquidRect') || (document.getElementById('sampleBottleLiquid') ? document.getElementById('sampleBottleLiquid').querySelector('rect') : null);
    const sampleSurface = document.getElementById('sampleBottleLiquidSurface') || (document.getElementById('sampleBottleLiquid') ? document.getElementById('sampleBottleLiquid').querySelector('ellipse') : null);
    const traySampleRect = document.getElementById('traySampleBottle1LiquidRect') || (document.getElementById('traySampleBottle1Liquid') ? document.getElementById('traySampleBottle1Liquid').querySelector('rect') : null);
    const traySampleSurface = document.getElementById('traySampleBottle1LiquidSurface') || (document.getElementById('traySampleBottle1Liquid') ? document.getElementById('traySampleBottle1Liquid').querySelector('ellipse') : null);
    const stream = document.getElementById('stage3LiquidStream');

    if (medRect) medRect.setAttribute('fill', currentSolutionColor.fill);
    if (medSurface) medSurface.setAttribute('fill', currentSolutionColor.surface);
    if (sampleRect) sampleRect.setAttribute('fill', currentSolutionColor.fill);
    if (sampleSurface) sampleSurface.setAttribute('fill', currentSolutionColor.surface);
    if (traySampleRect) traySampleRect.setAttribute('fill', currentSolutionColor.fill);
    if (traySampleSurface) traySampleSurface.setAttribute('fill', currentSolutionColor.surface);
    if (stream) stream.style.stroke = currentSolutionColor.stroke;
  }

  function hSvgEl(tag, attrs, parent) {
    const n = document.createElementNS(NS_SVG, tag);
    Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
    if (parent) parent.appendChild(n);
    return n;
  }

  function hSeeded(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hTween(node, frames, duration, opts) {
    const id = hRunId;
    const a = node.animate(frames, Object.assign({ duration, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'forwards' }, opts || {}));
    hRunning.add(a);
    return a.finished.then(() => {
      hRunning.delete(a);
      if (id !== hRunId) throw H_ABORT;
      try { a.commitStyles(); } catch (e) { /* eleman görünmüyorsa yoksay */ }
      a.cancel();
    }, () => { hRunning.delete(a); throw H_ABORT; });
  }

  function hWait(ms) {
    const id = hRunId;
    return new Promise((res, rej) => setTimeout(() => (id === hRunId ? res() : rej(H_ABORT)), ms));
  }

  function hReplayClass(node, cls) {
    if (!node) return;
    node.classList.remove(cls);
    void node.getBoundingClientRect();
    node.classList.add(cls);
    node.addEventListener('animationend', () => node.classList.remove(cls), { once: true });
  }

  function hFlash(nodes, cls, ms) {
    nodes.forEach((n) => { if (n) n.classList.add(cls); });
    setTimeout(() => nodes.forEach((n) => { if (n) n.classList.remove(cls); }), ms || 1500);
  }

  let hToastTimer = null;
  function hToast(msg, type) {
    if (!hEl.toast || !hEl.toastText) return;
    const t = type || 'info';
    hEl.toastText.textContent = msg;
    hEl.toast.dataset.type = t;
    if (hEl.toastIcon) {
      hEl.toastIcon.textContent = t === 'success' ? '✓' : t === 'warn' ? '!' : 'i';
    }
    hEl.toast.classList.add('is-on');
    clearTimeout(hToastTimer);
    hToastTimer = setTimeout(() => {
      if (hEl.toast) hEl.toast.classList.remove('is-on');
    }, 3600);
  }

  function buildPeriodicTable() {
    const g = document.getElementById('periodicTable');
    if (!g || g.hasChildNodes()) return;
    const syms = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr ' +
      'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu ' +
      'Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg ' +
      'Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' ');
    const pos = (z) => {
      if (z === 1) return [1, 1];
      if (z === 2) return [18, 1];
      if (z <= 10) return z <= 4 ? [z - 2, 2] : [z + 8, 2];
      if (z <= 18) return z <= 12 ? [z - 10, 3] : [z, 3];
      if (z <= 36) return [z - 18, 4];
      if (z <= 54) return [z - 36, 5];
      if (z <= 56) return [z - 54, 6];
      if (z <= 71) return [z - 54, 9];
      if (z <= 86) return [z - 68, 6];
      if (z <= 88) return [z - 86, 7];
      if (z <= 103) return [z - 86, 10];
      return [z - 100, 7];
    };
    const color = (col, row) => {
      if (row >= 9) return 'rgba(244,114,182,0.2)';
      if (col === 18) return 'rgba(167,139,250,0.25)';
      if (col === 1 && row > 1) return 'rgba(248,113,113,0.24)';
      if (col === 2) return 'rgba(251,146,60,0.22)';
      if (col >= 3 && col <= 12) return 'rgba(56,189,248,0.18)';
      return 'rgba(52,211,153,0.2)';
    };
    const x0 = 548, y0 = 70, cell = 23;
    syms.forEach((s, i) => {
      const [c, r] = pos(i + 1);
      const x = x0 + (c - 1) * cell;
      const y = y0 + (r - 1) * cell + (r >= 9 ? 6 : 0);
      hSvgEl('rect', { x, y, width: 21, height: 21, rx: 2.5, fill: color(c, r), stroke: 'rgba(125,211,252,0.35)', 'stroke-width': 0.7 }, g);
      const t = hSvgEl('text', { x: x + 10.5, y: y + 14, 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 700,
        'font-family': 'Plus Jakarta Sans, sans-serif', fill: 'rgba(224,242,254,0.75)' }, g);
      t.textContent = s;
    });
  }

  function buildCabinetDoors() {
    const g = document.getElementById('cabinetDoors');
    if (!g || g.hasChildNodes()) return;
    for (let x = -700; x < 1600; x += 150) {
      hSvgEl('rect', { x: x + 8, y: 428, width: 134, height: 56, rx: 4, fill: 'none', stroke: 'rgba(148,163,184,0.2)', 'stroke-width': 1.2 }, g);
      hSvgEl('rect', { x: x + 60, y: 436, width: 30, height: 4, rx: 2, fill: 'rgba(203,213,225,0.35)' }, g);
    }
  }

  function buildPills() {
    if (!hEl.pills || hEl.pills.hasChildNodes()) return;
    const rand = hSeeded(7);
    let row = 0;
    for (let y = 347; y >= 240; y -= 6.2, row++) {
      const off = row % 2 ? 3.8 : 0;
      for (let x = 146 + off; x <= 235; x += 7.6) {
        hSvgEl('circle', {
          cx: (x + (rand() - 0.5) * 2).toFixed(1), cy: (y + (rand() - 0.5) * 1.6).toFixed(1),
          r: (3 + rand() * 0.9).toFixed(2), fill: 'url(#gPill)', stroke: 'rgba(148,163,184,0.55)', 'stroke-width': 0.5
        }, hEl.pills);
      }
    }
  }

  function buildSediment() {
    if (!hEl.sediment || hEl.sediment.hasChildNodes()) return;
    const rand = hSeeded(21);
    for (let i = 0; i < 56; i++) {
      hSvgEl('circle', {
        cx: (516 + rand() * 128).toFixed(1), cy: (341 + rand() * 7).toFixed(1),
        r: (2 + rand() * 1.3).toFixed(2), fill: 'url(#gPill)', stroke: 'rgba(148,163,184,0.5)', 'stroke-width': 0.4
      }, hEl.sediment);
    }
  }

  const H_STATUS = { done: 'Tamamlandı', active: 'Sıradaki adım', locked: 'Bekliyor', working: 'Uygulanıyor…' };

  function setStep(card, st, text) {
    if (!card) return;
    card.classList.remove('is-done', 'is-pending', 'is-active', 'is-locked', 'is-working');
    if (st === 'done') card.classList.add('is-done');
    else card.classList.add('is-pending', 'is-' + st);
    card.dataset.state = st;
    const statusSpan = card.querySelector('.step-status-text');
    if (statusSpan) statusSpan.textContent = text || H_STATUS[st];
    card.setAttribute('aria-disabled', st === 'locked' || st === 'working' ? 'true' : 'false');
  }

  function setWorkingText(card, text) {
    if (!card) return;
    const statusSpan = card.querySelector('.step-status-text');
    if (statusSpan) statusSpan.textContent = text;
  }

  function updateHazirlikProgress() {
    // 3 Adım: Malzemeleri Seç, Çalışma Alanını Kontrol Et, Kabı Etiketle
    const activeCards = [hSteps.materials, hSteps.workspace, hSteps.label].filter(Boolean);
    const total = activeCards.length || 3;
    const done = activeCards.filter((c) => c.dataset.state === 'done').length;
    if (hEl.progressText) hEl.progressText.textContent = done + ' / ' + total;
    if (hEl.progressFill) hEl.progressFill.style.width = (done / total) * 100 + '%';
    if (hEl.progressTrack) hEl.progressTrack.setAttribute('aria-valuenow', String(done));
    if (hEl.ringFill) hEl.ringFill.style.strokeDashoffset = String(100 - (done / total) * 100);
  }

  function busyHint() {
    hToast('Lütfen devam eden işlemin bitmesini bekle…', 'info');
  }

  async function runLabelAnimation() {
    await hTween(hEl.label, [
      { transform: 'translate(46px,-150px) rotate(-22deg) scale(1.2)', opacity: 0 },
      { transform: 'translate(10px,-30px) rotate(-6deg) scale(1.08)', opacity: 1, offset: 0.55 },
      { transform: 'translate(0px,2px) rotate(1.5deg) scale(0.97)', opacity: 1, offset: 0.8 },
      { transform: 'translate(0px,0px) rotate(0deg) scale(1)', opacity: 1 }
    ], 950, { easing: 'cubic-bezier(.22,.9,.3,1)' });
    await hTween(hEl.labelShine, [
      { transform: 'translateX(0px)' }, { transform: 'translateX(140px)' }
    ], 520, { easing: 'ease-in-out' });
    if (hEl.labelShine) hEl.labelShine.removeAttribute('style');
  }

  function countVolume(from, to, dur) {
    const id = hRunId;
    return new Promise((res, rej) => {
      const t0 = performance.now();
      const tick = (now) => {
        if (id !== hRunId) return rej(H_ABORT);
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 2);
        if (hEl.volText) hEl.volText.textContent = Math.round(from + (to - from) * e) + ' mL';
        if (p < 1) requestAnimationFrame(tick); else res();
      };
      requestAnimationFrame(tick);
    });
  }

  function pourParticles(duration, startX = 556, startY = 158, endX = 580, endY = 340) {
    const id = hRunId;
    const count = 38;
    const jobs = [];
    for (let i = 0; i < count; i++) {
      const delay = (i / count) * (duration - 760);
      const initX = (startX + (Math.random() - 0.5) * 6).toFixed(1);
      const initY = (startY + (Math.random() - 0.5) * 4).toFixed(1);
      const c = hSvgEl('circle', {
        cx: initX, cy: initY,
        r: (2.2 + Math.random() * 1.4).toFixed(2), fill: 'url(#gPill)', stroke: 'rgba(148,163,184,0.5)', 'stroke-width': 0.4
      }, hEl.fall);
      const dx = (endX + (Math.random() - 0.5) * 80) - initX;
      const dy = (endY + (Math.random() - 0.5) * 16) - initY;
      const a = c.animate([
        { transform: 'translate(0px,0px)', opacity: 0 },
        { transform: `translate(${dx * 0.12}px,${dy * 0.06}px)`, opacity: 1, offset: 0.12 },
        { transform: `translate(${dx}px,${dy}px)`, opacity: 1, offset: 0.92 },
        { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }
      ], { duration: 640 + Math.random() * 220, delay, easing: 'cubic-bezier(.55,0,.85,.45)', fill: 'both' });
      hRunning.add(a);
      const done = () => { hRunning.delete(a); c.remove(); };
      jobs.push(a.finished.then(done, done));
    }
    return Promise.all(jobs).then(() => { if (id !== hRunId) throw H_ABORT; });
  }

  // =====================================================================
  // DİNAMİK VE ESNEK ANİMASYON KOORDİNAT SİSTEMİ
  // getCenterCoords(): Hedef ve kaynak nesnelerin merkez, ağız ve taban
  // koordinatlarını getBoundingClientRect() ve SVG CTM ile dinamik hesaplar.
  // calculatePourTransforms(): Herhangi bir kaynak ve hedef çifti için
  // translate3d, rotate ve pourStream koordinatlarını hesaplar.
  // =====================================================================

  /**
   * Herhangi bir SVG veya DOM nesnesinin SVG sahnesindeki anlık ekran koordinatlarını
   * dinamik olarak hesaplar.
   *
   * @param {Element} el - Koordinatları hesaplanacak eleman
   * @param {SVGSVGElement} svgRoot - SVG sahne kökü (deskSvg)
   * @returns {{ cx: number, cy: number, topY: number, bottomY: number, width: number, height: number, leftX: number, rightX: number }}
   */
  function getCenterCoords(el, svgRoot = deskSvg) {
    if (!el || !svgRoot) {
      return { cx: 0, cy: 0, topY: 0, bottomY: 0, width: 0, height: 0, leftX: 0, rightX: 0 };
    }
    const r = el.getBoundingClientRect();
    const ctm = svgRoot.getScreenCTM();
    const sx = ctm ? ctm.a : 1;
    const sy = ctm ? ctm.d : 1;
    const svgBB = svgRoot.getBoundingClientRect();

    const leftX   = (r.left - svgBB.left) / sx;
    const rightX  = (r.right - svgBB.left) / sx;
    const cx      = leftX + (r.width / (2 * sx));
    const topY    = (r.top - svgBB.top) / sy;
    const bottomY = (r.bottom - svgBB.top) / sy;
    const cy      = (topY + bottomY) / 2;

    return {
      cx,
      cy,
      topY,
      bottomY,
      leftX,
      rightX,
      width: r.width / sx,
      height: r.height / sy
    };
  }

  /**
   * SVG viewport birim cinsinden iki DOM elemanı arasındaki merkez farkını döndürür.
   */
  function svgDelta(fromEl, toEl, svgRoot) {
    const from = getCenterCoords(fromEl, svgRoot);
    const to   = getCenterCoords(toEl, svgRoot);
    return {
      dx: to.cx - from.cx,
      dy: to.cy - from.cy
    };
  }

  function svgTopY(el, svgRoot) {
    return getCenterCoords(el, svgRoot).topY;
  }

  function screenToSvgCoords(clientX, clientY) {
    const svg = deskSvg || document.getElementById('deskSvg');
    if (!svg) return { x: clientX, y: clientY };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const svgP = pt.matrixTransform(ctm.inverse());
      return { x: svgP.x, y: svgP.y };
    }
    const rect = svg.getBoundingClientRect();
    const sx = 800 / (rect.width || 800);
    const sy = 480 / (rect.height || 480);
    return {
      x: (clientX - rect.left) * sx,
      y: (clientY - rect.top) * sy
    };
  }

  function getMarkerSvgPos(markerId, fallbackCoords) {
    const marker = document.getElementById(markerId);
    if (marker) {
      const rect = marker.getBoundingClientRect();
      if (rect.width >= 0 && rect.height >= 0 && (rect.left !== 0 || rect.top !== 0)) {
        return screenToSvgCoords(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
    return fallbackCoords || { x: 0, y: 0 };
  }

  function getPourStreamPath(sourceMarkerId, targetMarkerId, targetBottomY, defaultSpout, defaultTarget) {
    const spoutPos = getMarkerSvgPos(sourceMarkerId, defaultSpout);
    const targetPos = getMarkerSvgPos(targetMarkerId, defaultTarget);
    const sx = Math.round(spoutPos.x);
    const sy = Math.round(spoutPos.y);
    const ex = Math.round(targetPos.x);
    const ey = Math.round(targetBottomY || (targetPos.y + 70));
    const midX = Math.round((sx + ex) / 2);
    const midY = Math.round((sy + ey) / 2 - 8);
    return {
      startX: sx,
      startY: sy,
      endX: ex,
      endY: ey,
      pathD: `M ${sx} ${sy} Q ${midX} ${midY} ${ex} ${ey}`
    };
  }

  /**
   * Herhangi bir kaynak (sourceEl) ve hedef (targetEl) kap için
   * fiziksel gerçekliğe uygun translate3d, rotate koordinatlarını hesaplar.
   */
  function calculatePourTransforms(sourceEl, targetEl, options = {}) {
    const sourceType = options.sourceType || 'beaker';
    const angleDeg = options.angleDeg !== undefined ? options.angleDeg : (sourceType === 'mediumBottle' ? 68 : 58);
    const liftExtra = options.liftExtra !== undefined ? options.liftExtra : 35;

    let dx = 0, dy = 0, ldx = 0, ldy = 0, liftAngleDeg = 14;

    if (sourceType === 'beaker') {
      // Beher -> Madde A Çözeltisi Şişesi
      // Beher 650, 350 orijini etrafında 58deg döner;
      // Gagası (662, 177) şişe ağzının (680, 216) hemen üst soluna oturur
      dx = -55;
      dy = -85;
      ldx = -22;
      ldy = -125;
      liftAngleDeg = 16;
    } else if (sourceType === 'mediumBottle') {
      // Madde A Şişesi -> Numune Kabı
      // Şişe 715, 350 orijini etrafında 68deg döner;
      // Sağ dudak (704, 216) numune kabı ağzının (764, 266) hemen üst soluna oturur
      dx = -81;
      dy = -58;
      ldx = -32;
      ldy = -95;
      liftAngleDeg = 18;
    } else {
      const sourceCoords = getCenterCoords(sourceEl, deskSvg);
      const targetCoords = getCenterCoords(targetEl, deskSvg);
      const diffX = targetCoords.cx - sourceCoords.cx;
      dx = Math.round(diffX * 0.7);
      dy = Math.round(-liftExtra - 20);
      ldx = Math.round(dx * 0.4);
      ldy = Math.round(dy - 35);
      liftAngleDeg = Math.round(angleDeg * 0.28);
    }

    const pour = `translate3d(${dx}px, ${dy}px, 0px) rotate(${angleDeg}deg)`;
    const lift = `translate3d(${ldx}px, ${ldy}px, 0px) rotate(${liftAngleDeg}deg)`;
    const home = 'translate3d(0px, 0px, 0px) rotate(0deg)';

    return {
      home,
      lift,
      pour,
      angleDeg
    };
  }

  // Geriye dönük uyumluluk sarmalayıcısı
  function computePourTransforms({ ox, oy, mouthX, mouthY, targetX, targetTopY, targetBottomY, angleDeg = 52, liftExtra = 22 }) {
    const rad = angleDeg * Math.PI / 180;
    const relMX = mouthX - ox;
    const relMY = mouthY - oy;

    const rotOffsetX = relMX * Math.cos(rad) - relMY * Math.sin(rad);
    const rotOffsetY = relMX * Math.sin(rad) + relMY * Math.cos(rad);

    const wantMouthX = targetX;
    const wantMouthY = targetTopY - liftExtra;

    const dx = wantMouthX - (ox + rotOffsetX);
    const dy = wantMouthY - (oy + rotOffsetY);

    const liftAngleDeg = Math.round(angleDeg * 0.22);
    const liftRad = liftAngleDeg * Math.PI / 180;
    const liftRotOffsetX = relMX * Math.cos(liftRad) - relMY * Math.sin(liftRad);
    const liftRotOffsetY = relMX * Math.sin(liftRad) + relMY * Math.cos(liftRad);

    const halfX = mouthX + (targetX - mouthX) * 0.5;
    const halfY = Math.min(mouthY, targetTopY) - (liftExtra + 45);
    const ldx = halfX - (ox + liftRotOffsetX);
    const ldy = halfY - (oy + liftRotOffsetY);

    const r = (v) => Math.round(v);
    const pour = `translate3d(${r(dx)}px, ${r(dy)}px, 0px) rotate(${angleDeg}deg)`;
    const lift = `translate3d(${r(ldx)}px, ${r(ldy)}px, 0px) rotate(${liftAngleDeg}deg)`;
    const tap  = `translate3d(${r(dx)}px, ${r(dy + 3)}px, 0px) rotate(${angleDeg - 5}deg)`;

    const streamStartX = r(wantMouthX);
    const streamStartY = r(wantMouthY + 2);
    const endY = targetBottomY ? r(targetBottomY) : r(targetTopY + 70);
    const streamEndX = r(targetX);

    const midX = r((streamStartX + streamEndX) / 2);
    const midY = r((streamStartY + endY) / 2);
    const streamPath = `M ${streamStartX} ${streamStartY} Q ${midX} ${midY - 10} ${streamEndX} ${endY}`;

    return {
      pour,
      lift,
      tap,
      streamStartX,
      streamStartY,
      streamEndX,
      streamEndY: endY,
      streamPath
    };
  }

  // Sabit kalan (CSS'e bağlı olmayan) değerler
  const R_HOME  = 'translate3d(0px,0px,0px) rotate(0deg)';
  const R_UP    = 'translate3d(0px,-46px,0px) rotate(-8deg)';
  const R_ABOVE = 'translate3d(151px,-270px,0px) rotate(-80deg)';
  const R_IN    = 'translate3d(151px,-118px,0px) rotate(-80deg)';
  const R_L     = 'translate3d(125px,-116px,0px) rotate(-75deg)';
  const R_R     = 'translate3d(177px,-116px,0px) rotate(-85deg)';
  const CAP_ON  = { transform: 'translate3d(0px,0px,0px)', opacity: 1 };
  const CAP_OFF = { transform: 'translate3d(0px,-34px,0px)', opacity: 0 };

  // Masaüstü SVG kök elementi referansı (koordinat dönüşümleri için)
  const deskSvg = document.getElementById('desk-svg');

  async function runWaterAnimation(card) {
    setWorkingText(card, 'Saf su aktarılıyor…');
    hToast('Saf su behere aktarılıyor (150 mL)…', 'info');

    // --- Dinamik ve Fiziksel Koordinat Hesabı ---
    // Rotasyon merkezi: Sağ alt köşe (ox: 375, oy: 350)
    // Şişe ağzı: SVG x=340, y=168 (üst açıklık)
    // Dökme açısı: 54 derece (fiziksel gerçekçi 45-60 derece aralığı)
    const W_HOME = 'translate3d(0px, 0px, 0px) rotate(0deg)';
    let W_POUR, W_LIFT;
    let streamStartX = 558, streamStartY = 160, streamEndX = 580, streamEndY = 340;

    if (deskSvg && hItems.water && hItems.beaker) {
      const waterR  = hItems.water.getBoundingClientRect();
      const beakerR = hItems.beaker.getBoundingClientRect();
      const ctm = deskSvg.getScreenCTM();
      const sx = ctm ? ctm.a : 1;
      const sy = ctm ? ctm.d : 1;
      const svgBB = deskSvg.getBoundingClientRect();

      const MOUTH_SVG_X = 340;
      const MOUTH_SVG_Y = 168;
      const OX = 375; // Alt sağ köşe
      const OY = 350;

      const beakerTopSvgY = (beakerR.top - svgBB.top) / sy;
      const waterVisualCX  = waterR.left  + waterR.width  / 2;
      const beakerVisualCX = beakerR.left + beakerR.width / 2;
      const beakerSvgCX = MOUTH_SVG_X + (beakerVisualCX - waterVisualCX) / sx;

      const angleDeg = 78; // Dik açı (75 - 85 derece aralığı)
      const liftExtra = 85; // Havaya kalkma mesafesi artırıldı (beherin bariz üzerinde)

      const t = computePourTransforms({
        ox: OX, oy: OY,
        mouthX: MOUTH_SVG_X, mouthY: MOUTH_SVG_Y,
        targetX: beakerSvgCX,
        targetTopY: beakerTopSvgY,
        targetBottomY: beakerTopSvgY + 160,
        angleDeg,
        liftExtra
      });
      W_POUR = t.pour;
      W_LIFT = t.lift;
      streamStartX = t.streamStartX;
      streamStartY = t.streamStartY;
      streamEndX = t.streamEndX;
      streamEndY = t.streamEndY;
    } else {
      // Güvenli fallback (fiziksel yüksek kaldırma ve dik açı)
      W_POUR = 'translate3d(145px, -215px, 0px) rotate(78deg)';
      W_LIFT = 'translate3d(60px, -145px, 0px) rotate(24deg)';
    }

    // Sıvı akış çizgisini kaynak kabın eğilmiş ağzından beherin tabanına doğru hizala
    if (hEl.stream && hEl.streamFlow) {
      const streamD = `M ${streamStartX} ${streamStartY} C ${streamStartX + 4} ${streamStartY + 40}, ${streamEndX} ${streamEndY - 60}, ${streamEndX} ${streamEndY}`;
      hEl.stream.setAttribute('d', streamD);
      hEl.streamFlow.setAttribute('d', streamD);
    }

    await hTween(hEl.waterCap, [CAP_ON, CAP_OFF], 420);
    await Promise.all([
      hTween(hEl.water, [{ transform: W_HOME }, { transform: W_LIFT, offset: 0.45 }, { transform: W_POUR }], 1150),
      // Sıvının yerçekimi dengesi: Şişe eğilirken içindeki su yatay kalmak için zıt döner
      hTween(hEl.waterInner, [
        { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
        { transform: 'translate3d(10px, -15px, 0px) rotate(-78deg)' }
      ], 1150)
    ]);
    if (hEl.volTag) hEl.volTag.classList.add('is-on');
    await hTween(hEl.stream, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 260, { easing: 'ease-in' });
    if (hEl.beakerFill) {
      hEl.beakerFill.style.opacity = '1';
    }
    await Promise.all([
      hTween(hEl.beakerFill, [
        { transform: 'translate3d(0px, 98px, 0px)', opacity: 0.1 },
        { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 }
      ], 2300, { easing: 'cubic-bezier(.3,.1,.3,1)' }),
      hTween(hEl.waterInner, [
        { transform: 'translate3d(10px, -15px, 0px) rotate(-78deg)' },
        { transform: 'translate3d(10px, 60px, 0px) rotate(-78deg)' }
      ], 2300, { easing: 'linear' }),
      countVolume(0, 150, 2300)
    ]);
    if (hEl.streamFlow) hEl.streamFlow.classList.remove('is-flowing');
    await hTween(hEl.stream, [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }], 300, { easing: 'ease-in' });
    await Promise.all([
      hTween(hEl.water, [{ transform: W_POUR }, { transform: W_LIFT, offset: 0.55 }, { transform: W_HOME }], 1050),
      hTween(hEl.waterInner, [
        { transform: 'translate3d(10px, 60px, 0px) rotate(-78deg)' },
        { transform: 'translate3d(0px, 64px, 0px) rotate(0deg)' }
      ], 1050)
    ]);
    if (hEl.waterInner) {
      hEl.waterInner.style.transform = 'translate3d(0px, 64px, 0px) rotate(0deg)';
    }
    if (hItems.water) {
      hItems.water.style.transform = W_HOME;
    }
    await hTween(hEl.waterCap, [CAP_OFF, CAP_ON], 380);
  }

  async function runJarAnimation(card) {
    setWorkingText(card, 'Madde A ekleniyor…');
    hToast('Madde A behere ekleniyor; granüller dibe çöküyor…', 'info');

    // --- Dinamik ve Fiziksel Koordinat Hesabı ---
    // Rotasyon merkezi: Sağ alt köşe (ox: 235, oy: 350)
    // Şişe ağzı: SVG x=190, y=196 (üst açıklık)
    // Dökme açısı: 55 derece (fiziksel gerçekçi 45-60 derece aralığı)
    const J_HOME = 'translate3d(0px, 0px, 0px) rotate(0deg)';
    let J_POUR, J_LIFT, J_TAP;
    let particleStartX = 552, particleStartY = 162, particleEndX = 580, particleEndY = 340;

    if (deskSvg && hItems.jar && hItems.beaker) {
      const jarR    = hItems.jar.getBoundingClientRect();
      const beakerR = hItems.beaker.getBoundingClientRect();
      const ctm = deskSvg.getScreenCTM();
      const sx = ctm ? ctm.a : 1;
      const sy = ctm ? ctm.d : 1;
      const svgBB = deskSvg.getBoundingClientRect();

      const MOUTH_SVG_X = 190;
      const MOUTH_SVG_Y = 196;
      const OX = 235; // Alt sağ köşe
      const OY = 350;

      const beakerTopSvgY = (beakerR.top - svgBB.top) / sy;
      const jarVisualCX    = jarR.left    + jarR.width    / 2;
      const beakerVisualCX = beakerR.left + beakerR.width / 2;
      const beakerSvgCX = MOUTH_SVG_X + (beakerVisualCX - jarVisualCX) / sx;

      const angleDeg = 80; // Dik dökme açısı (75-85 derece aralığı)
      const liftExtra = 88; // Beher ağzının bariz şekilde yukarısında yüksek konumlanma

      const t = computePourTransforms({
        ox: OX, oy: OY,
        mouthX: MOUTH_SVG_X, mouthY: MOUTH_SVG_Y,
        targetX: beakerSvgCX,
        targetTopY: beakerTopSvgY,
        targetBottomY: beakerTopSvgY + 160,
        angleDeg,
        liftExtra
      });
      J_POUR = t.pour;
      J_LIFT = t.lift;
      J_TAP  = t.tap;
      particleStartX = t.streamStartX;
      particleStartY = t.streamStartY;
      particleEndX = t.streamEndX;
      particleEndY = t.streamEndY;
    } else {
      // Güvenli fallback (yüksek kaldırma ve dik açı)
      J_POUR = 'translate3d(325px, -225px, 0px) rotate(80deg)';
      J_LIFT = 'translate3d(125px, -155px, 0px) rotate(24deg)';
      J_TAP  = 'translate3d(325px, -221px, 0px) rotate(76deg)';
    }

    await hTween(hEl.jarCap, [CAP_ON, CAP_OFF], 420);
    await hTween(hEl.jar, [{ transform: J_HOME }, { transform: J_LIFT, offset: 0.45 }, { transform: J_POUR }], 1200);
    await Promise.all([
      pourParticles(1900, particleStartX, particleStartY, particleEndX, particleEndY),
      hTween(hEl.jar, [{ transform: J_POUR }, { transform: J_TAP }, { transform: J_POUR }, { transform: J_TAP }, { transform: J_POUR }], 1900, { easing: 'ease-in-out' }),
      hTween(hEl.pills, [{ transform: 'translate(0px,0px)' }, { transform: 'translate(0px,24px)' }], 1900, { easing: 'linear' }),
      hTween(hEl.sediment, [{ opacity: 0 }, { opacity: 1 }], 1500, { delay: 600 })
    ]);
    await hTween(hEl.jar, [{ transform: J_POUR }, { transform: J_LIFT, offset: 0.55 }, { transform: J_HOME }], 1100);
    if (hItems.jar) {
      hItems.jar.style.transform = J_HOME;
    }
    await hTween(hEl.jarCap, [CAP_OFF, CAP_ON], 380);
  }

  async function runStirAnimation(card) {
    setWorkingText(card, 'Karıştırılıyor…');
    hToast('Cam baget ile karıştırılıyor…', 'info');
    await hTween(hEl.rod, [{ transform: R_HOME }, { transform: R_UP }], 420);
    await hTween(hEl.rod, [{ transform: R_UP }, { transform: R_ABOVE }], 950);
    if (hEl.rodSlot && hEl.rod) hEl.rodSlot.appendChild(hEl.rod); // beherin içine taşı
    await hTween(hEl.rod, [{ transform: R_ABOVE }, { transform: R_IN }], 650, { easing: 'cubic-bezier(.3,.6,.4,1)' });
    if (hEl.beakerFill) hEl.beakerFill.classList.add('is-stirring');
    await Promise.all([
      hTween(hEl.rod, [
        { transform: R_IN }, { transform: R_L }, { transform: R_R }, { transform: R_L },
        { transform: R_R }, { transform: R_L }, { transform: R_R }, { transform: R_IN }
      ], 2500, { easing: 'ease-in-out' }),
      hTween(hEl.sediment, [{ opacity: 1 }, { opacity: 0 }], 2000, { delay: 300 }),
      hTween(hEl.tint, [{ opacity: 0 }, { opacity: 0.85 }], 2200, { delay: 200 })
    ]);
    if (hEl.beakerFill) hEl.beakerFill.classList.remove('is-stirring');
    currentSolutionColor = {
      fill: 'url(#gSolution)',
      surface: '#ddd6fe',
      stroke: '#a78bfa',
      hex: '#7c3aed',
      isStirred: true
    };
    updateTargetSolutionColors();
    await hTween(hEl.rod, [{ transform: R_IN }, { transform: R_ABOVE }], 620);
    if (hRodHome && hEl.rod) hRodHome.appendChild(hEl.rod);
    await hTween(hEl.rod, [{ transform: R_ABOVE }, { transform: R_UP }], 950);
    await hTween(hEl.rod, [{ transform: R_UP }, { transform: R_HOME }], 420);
  }

  async function runPrepareAnimation(card) {
    await runWaterAnimation(card);
    await runJarAnimation(card);
    await runStirAnimation(card);
  }

  function openMaterialsModal() {
    if (!materialsModalBackdrop) return;
    materialsModalBackdrop.classList.add('is-open');
    materialsModalBackdrop.removeAttribute('aria-hidden');
    updateModalCountUI();
    if (modalAlertBanner) modalAlertBanner.classList.remove('is-active');
  }

  function closeMaterialsModal() {
    if (!materialsModalBackdrop) return;
    materialsModalBackdrop.classList.remove('is-open');
    materialsModalBackdrop.setAttribute('aria-hidden', 'true');
    if (modalAlertBanner) modalAlertBanner.classList.remove('is-active');
  }

  function updateModalCountUI() {
    const placedCount = ['jar', 'water', 'beaker'].filter((k) => hState.materialsPlaced[k]).length;
    if (modalCountBadge) {
      modalCountBadge.textContent = placedCount + ' / 3 Malzeme Seçildi';
      if (placedCount === 3) {
        modalCountBadge.classList.add('is-complete');
      } else {
        modalCountBadge.classList.remove('is-complete');
      }
    }
    if (btnConfirmMaterialsModal) {
      if (placedCount === 3) {
        btnConfirmMaterialsModal.classList.add('is-ready');
      } else {
        btnConfirmMaterialsModal.classList.remove('is-ready');
      }
      const actionTextSpan = btnConfirmMaterialsModal.querySelector('span');
      if (actionTextSpan) {
        actionTextSpan.textContent = placedCount === 3 ? 'Seçimleri Onayla ve Tamamla ✓' : `Seçimleri Kapat (${placedCount}/3)`;
      }
    }
    if (modalFootHint) {
      if (placedCount === 3) {
        modalFootHint.textContent = '✓ 3 malzemenin tamamı masaya eklendi. Seçimleri onaylayıp devam edebilirsiniz.';
      } else if (placedCount > 0) {
        modalFootHint.textContent = `İpucu: Şu an ${placedCount} / 3 malzeme seçili. 1. adımın tamamlanması için 3 malzemenin hepsi gereklidir.`;
      } else {
        modalFootHint.textContent = 'İpucu: Masaya eklemek için gerekli 3 malzemeyi (Madde A, Saf Su, Beher) seçin.';
      }
    }
  }

  function triggerUnlabeledWarning(card) {
    if (card) hReplayClass(card, 'is-shake');
    if (modalAlertBanner) {
      modalAlertBanner.classList.remove('is-active');
      void modalAlertBanner.offsetWidth;
      modalAlertBanner.classList.add('is-active');
      clearTimeout(modalAlertTimer);
      modalAlertTimer = setTimeout(() => {
        if (modalAlertBanner) modalAlertBanner.classList.remove('is-active');
      }, 5000);
    }
    hToast('HATA: Üzerinde etiket bulunmayan kimyasallar iş güvenliği kuralları gereği kullanılamaz!', 'warn');
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'GÜVENLİK İHLALİ: ETİKETSİZ KİMYASAL SEÇİLEMEZ!';
    }
    if (avatarSpeechBubble && avatarSpeechText) {
      avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
      avatarSpeechText.textContent = 'Dikkat! Üzerinde etiket bulunmayan kimyasallar iş güvenliği kuralları gereği asla kullanılamaz!';
      avatarSpeechBubble.classList.add('visible');
    }
  }

  function handleMaterialCardClick(itemType, card) {
    if (hState.busy) return busyHint();

    // 4. KRİTİK KURAL: Etiketsiz şişe seçilirse işlemi iptal et ve hata uyarısı ver
    if (itemType === 'unlabeled') {
      triggerUnlabeledWarning(card);
      return;
    }

    const names = {
      jar: 'Madde A kavanozu',
      water: 'Saf su şişesi',
      beaker: '250 mL dereceli beher'
    };

    const actionBtn = card ? card.querySelector('.action-btn') : null;
    const deskTarget = hItems[itemType];

    // Toggle mantığı: Öğeler listeden kaybolmaz, sadece yeşil vurgu (.is-selected) alır/bırakır
    if (hState.materialsPlaced[itemType]) {
      // Masadan kaldır
      hState.materialsPlaced[itemType] = false;
      if (card) card.classList.remove('is-selected');
      if (actionBtn) actionBtn.textContent = 'Masaya Ekle +';
      if (deskTarget) {
        deskTarget.classList.remove('is-placed', 'is-glow');
      }
      if (itemType === 'beaker' && hEl.beakerFill) {
        hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px)';
        hEl.beakerFill.style.opacity = '0';
      }
      hToast((names[itemType] || 'Malzeme') + ' masadan kaldırıldı.', 'info');
    } else {
      // Masaya ekle
      hState.materialsPlaced[itemType] = true;
      if (card) card.classList.add('is-selected');
      if (actionBtn) actionBtn.textContent = '✓ Masaya Eklendi';
      if (deskTarget) {
        deskTarget.classList.add('is-placed');
        hFlash([deskTarget], 'is-glow', 1600);
      }
      // Beher ilk eklendiğinde tamamen boş ve temiz olmalıdır:
      if (itemType === 'beaker') {
        if (hEl.beakerFill) {
          hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px)';
          hEl.beakerFill.style.opacity = '0';
          hEl.beakerFill.classList.remove('is-stirring');
        }
        if (hEl.tint) {
          hEl.tint.style.opacity = '0';
        }
        if (hEl.sediment) {
          hEl.sediment.style.opacity = '0';
        }
      }
      hToast('✓ ' + (names[itemType] || 'Malzeme') + ' masaya yerleştirildi.', 'success');
    }

    updateModalCountUI();

    const placedCount = ['jar', 'water', 'beaker'].filter((k) => hState.materialsPlaced[k]).length;
    const deskMaterialsBadge = document.getElementById('materials-badge');
    if (deskMaterialsBadge) {
      deskMaterialsBadge.innerHTML = `<span class="dot" aria-hidden="true"></span>${placedCount} / 3 MALZEME`;
    }

    // 1. KURAL GÜNCELLEMESİ: Yalnızca 3 malzemenin tümü masaya eklenmişse Tamamlandı statüsüne geçer
    if (placedCount === 3) {
      hState.materialsDone = true;
      setStep(hSteps.materials, 'done', 'Tamamlandı');
      if (!hState.labeled) {
        setStep(hSteps.label, 'active', 'Sıradaki adım');
      }
    } else {
      hState.materialsDone = false;
      if (placedCount > 0) {
        setStep(hSteps.materials, 'working', `${placedCount} / 3 Eklendi`);
      } else {
        setStep(hSteps.materials, 'active', 'Sıradaki adım');
      }
      if (!hState.labeled) {
        setStep(hSteps.label, 'locked', 'Bekliyor');
      }
    }

    updateHazirlikProgress();
    checkAllStepsCompleted();
  }

  function confirmMaterialsSelection() {
    const placedCount = ['jar', 'water', 'beaker'].filter((k) => hState.materialsPlaced[k]).length;
    closeMaterialsModal();

    const deskMaterialsBadge = document.getElementById('materials-badge');
    if (deskMaterialsBadge) {
      deskMaterialsBadge.innerHTML = `<span class="dot" aria-hidden="true"></span>${placedCount} / 3 MALZEME`;
    }

    if (placedCount === 3) {
      hState.materialsDone = true;
      setStep(hSteps.materials, 'done', 'Tamamlandı');
      hReplayClass(hSteps.materials, 'is-pop');
      if (!hState.labeled) {
        setStep(hSteps.label, 'active', 'Sıradaki adım');
        hReplayClass(hSteps.label, 'is-pop');
      }
      hToast('✓ 3 malzemenin tamamı masaya eklendi. Malzeme seçimi tamamlandı!', 'success');
      if (avatarSpeechBubble && avatarSpeechText) {
        avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
        avatarSpeechText.textContent = 'Malzemeler eksiksiz hazırlandı. Şimdi 3. adıma geçip kabı etiketle.';
        avatarSpeechBubble.classList.add('visible');
      }
    } else {
      hState.materialsDone = false;
      if (placedCount > 0) {
        setStep(hSteps.materials, 'working', `${placedCount} / 3 Eklendi`);
      } else {
        setStep(hSteps.materials, 'active', 'Bekliyor');
      }
      if (!hState.labeled) {
        setStep(hSteps.label, 'locked', 'Bekliyor');
      }
      hToast(`Eksik malzeme var (${placedCount}/3). 1. adımın tamamlanması için 3 malzemenin tamamı masaya eklenmelidir.`, 'warn');
      if (avatarSpeechBubble && avatarSpeechText) {
        avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
        avatarSpeechText.textContent = `Eksik malzeme var (${placedCount}/3). Lütfen Madde A, Saf Su ve Beher'in tamamını masaya ekleyin.`;
        avatarSpeechBubble.classList.add('visible');
      }
    }

    updateHazirlikProgress();
    checkAllStepsCompleted();
  }

  // ========================================================
  // YENİ: ÇALIŞMA ALANI KONTROLÜ VE YABANCI NESNELERİ TEMİZLEME MODAL FONKSİYONLARI
  // ========================================================
  function updateWorkspaceModalUI() {
    const hasRack = !!(hState.foreignItems && hState.foreignItems.rack);
    const hasPetri = !!(hState.foreignItems && hState.foreignItems.petri);
    const anyDirty = hasRack || hasPetri;

    // Rack Kartı
    if (wsCardRack) {
      if (!hasRack) {
        wsCardRack.classList.add('is-cleaned');
        if (badgeRack) {
          badgeRack.className = 'ws-badge ws-badge-success';
          badgeRack.textContent = 'Temizlendi ✓';
        }
        if (btnCleanRack) {
          btnCleanRack.classList.add('is-done');
          btnCleanRack.innerHTML = '<span>✓ Masadan Kaldırıldı</span>';
        }
      } else {
        wsCardRack.classList.remove('is-cleaned');
        if (badgeRack) {
          badgeRack.className = 'ws-badge ws-badge-danger';
          badgeRack.textContent = 'Yabancı Malzeme / Atık';
        }
        if (btnCleanRack) {
          btnCleanRack.classList.remove('is-done');
          btnCleanRack.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg><span>Masadan Kaldır</span>';
        }
      }
    }

    // Petri Kartı
    if (wsCardPetri) {
      if (!hasPetri) {
        wsCardPetri.classList.add('is-cleaned');
        if (badgePetri) {
          badgePetri.className = 'ws-badge ws-badge-success';
          badgePetri.textContent = 'Temizlendi ✓';
        }
        if (btnCleanPetri) {
          btnCleanPetri.classList.add('is-done');
          btnCleanPetri.innerHTML = '<span>✓ Masadan Kaldırıldı</span>';
        }
      } else {
        wsCardPetri.classList.remove('is-cleaned');
        if (badgePetri) {
          badgePetri.className = 'ws-badge ws-badge-danger';
          badgePetri.textContent = 'Yabancı Malzeme / Kontamine';
        }
        if (btnCleanPetri) {
          btnCleanPetri.classList.remove('is-done');
          btnCleanPetri.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg><span>Masadan Kaldır</span>';
        }
      }
    }

    // Durum Başlığı Bannerı
    if (workspaceStatusBanner) {
      if (!anyDirty) {
        workspaceStatusBanner.classList.add('is-clean');
        if (workspaceStatusTitle) workspaceStatusTitle.textContent = '✓ Tezgâh Tamamen Temizlendi ve Hazır!';
        if (workspaceStatusDesc) workspaceStatusDesc.textContent = 'Tüm yabancı ve atık malzemeler kaldırıldı. Çalışma alanı deney protokolü için steril ve güvenli.';
      } else {
        workspaceStatusBanner.classList.remove('is-clean');
        if (workspaceStatusTitle) workspaceStatusTitle.textContent = 'Tezgâhta Protokol Dışı Malzemeler Var!';
        if (workspaceStatusDesc) workspaceStatusDesc.textContent = 'İş güvenliği kuralı: Malzemeleri masaya eklemeden önce yabancı nesneleri kaldırmalısınız.';
      }
    }

    // Tümünü Temizle Butonu
    if (btnCleanAllWorkspace) {
      if (!anyDirty) {
        btnCleanAllWorkspace.style.display = 'none';
      } else {
        btnCleanAllWorkspace.style.display = 'inline-flex';
      }
    }
  }

  function openWorkspaceModal() {
    if (!workspaceModalBackdrop) return;
    updateWorkspaceModalUI();
    workspaceModalBackdrop.classList.add('is-open');
    workspaceModalBackdrop.removeAttribute('aria-hidden');
  }

  function closeWorkspaceModal() {
    if (!workspaceModalBackdrop) return;
    workspaceModalBackdrop.classList.remove('is-open');
    workspaceModalBackdrop.setAttribute('aria-hidden', 'true');
  }

  function cleanForeignItem(type) {
    if (!hState.foreignItems) hState.foreignItems = {};
    if (type === 'rack') {
      hState.foreignItems.rack = false;
      if (itemDirtyRackWrap) itemDirtyRackWrap.classList.add('is-cleaned');
      hToast('Kullanılmış deney tüpü standı masadan kaldırıldı.', 'info');
    } else if (type === 'petri') {
      hState.foreignItems.petri = false;
      if (itemDirtyPetriWrap) itemDirtyPetriWrap.classList.add('is-cleaned');
      hToast('Kirli petri kabı masadan kaldırıldı.', 'info');
    }

    updateWorkspaceModalUI();
    checkWorkspaceCleaningComplete();
  }

  function cleanAllForeignItems() {
    if (!hState.foreignItems) hState.foreignItems = {};
    hState.foreignItems.rack = false;
    hState.foreignItems.petri = false;

    if (itemDirtyRackWrap) itemDirtyRackWrap.classList.add('is-cleaned');
    if (itemDirtyPetriWrap) itemDirtyPetriWrap.classList.add('is-cleaned');

    updateWorkspaceModalUI();
    hToast('✓ Masadaki tüm yabancı malzemeler temizlendi.', 'success');
    checkWorkspaceCleaningComplete();
  }

  function checkWorkspaceCleaningComplete() {
    if (!hasForeignItemsOnDesk()) {
      hState.workspaceDone = true;
      setStep(hSteps.workspace, 'done', 'Tamamlandı');
      hReplayClass(hSteps.workspace, 'is-pop');
      if (hEl.scan) hReplayClass(hEl.scan, 'is-scanning');

      // 4. Kural: Masa temizlendikten sonra "Malzemeleri Seç" aktifleşir
      if (!hState.materialsDone) {
        setStep(hSteps.materials, 'active', 'Sıradaki adım');
        hReplayClass(hSteps.materials, 'is-pop');
      }

      updateHazirlikProgress();
      checkAllStepsCompleted();

      if (avatarSpeechBubble && avatarSpeechText) {
        avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
        avatarSpeechText.textContent = 'Harika! Masa tamamen temizlendi. Artık 1. adıma geçip malzemeleri seçebilirsin.';
        avatarSpeechBubble.classList.add('visible');
      }
    }
  }

  function confirmWorkspaceCheck() {
    if (hasForeignItemsOnDesk()) {
      cleanAllForeignItems();
    }
    closeWorkspaceModal();
  }

  // 2. DİNAMİK ETİKETLEME MODAL FONKSİYONLARI
  function openLabelModal() {
    if (!labelModalBackdrop) return;
    if (inputLabelText) {
      inputLabelText.value = hState.customLabelText || 'Madde A Çözeltisi';
      if (labelPreviewText) {
        labelPreviewText.textContent = inputLabelText.value;
      }
    }
    labelModalBackdrop.classList.add('is-open');
    labelModalBackdrop.removeAttribute('aria-hidden');
    setTimeout(() => {
      if (inputLabelText) {
        inputLabelText.focus();
        inputLabelText.select();
      }
    }, 150);
  }

  function closeLabelModal() {
    if (!labelModalBackdrop) return;
    labelModalBackdrop.classList.remove('is-open');
    labelModalBackdrop.setAttribute('aria-hidden', 'true');
  }

  function confirmLabel() {
    const val = (inputLabelText ? inputLabelText.value.trim() : '') || 'Madde A Çözeltisi';
    hState.customLabelText = val;
    if (beakerLabelCustomText) {
      beakerLabelCustomText.textContent = val;
    }
    hState.labeled = true;
    closeLabelModal();
    setStep(hSteps.label, 'done', 'Tamamlandı');
    hReplayClass(hSteps.label, 'is-pop');

    // NOT: 4. Adım (Çözeltiyi Hazırla) kontrol listesinden kaldırıldığı için
    // doğrudan 3 görevin tamamlanma durumu kontrol edilir ve "Hazırlamaya Başla" butonu aktif edilir.
    /*
    if (!hState.prepared && hSteps.prepare) {
      setStep(hSteps.prepare, 'active', 'Sıradaki adım');
      hReplayClass(hSteps.prepare, 'is-pop');
    }
    */
    updateHazirlikProgress();
    checkAllStepsCompleted();
    hToast('✓ Beher etiketi kaydedildi: "' + val + '".', 'success');
    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'ETİKET KAYDEDİLDİ: ' + val;
    }
    if (avatarSpeechBubble && avatarSpeechText) {
      avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
      avatarSpeechText.textContent = 'Etiket "' + val + '" olarak kaydedildi! Kontrol listesindeki 3 adım tamamlandı. Artık "Hazırlamaya Başla" butonuna basabilirsin!';
      avatarSpeechBubble.classList.add('visible');
    }
  }

  // 4. TÜM ADIMLARIN TAMAMLANMA VE "HAZIRLAMAYA BAŞLA" KONTROLÜ (3 Görev Onayı)
  function checkAllStepsCompleted() {
    const isStep1Done = !!hState.materialsDone && ['jar', 'water', 'beaker'].every((k) => hState.materialsPlaced[k]);
    const isStep2Done = !!hState.workspaceDone;
    const isStep3Done = !!hState.labeled;
    const allDone = isStep1Done && isStep2Done && isStep3Done;

    if (!btnStartPrep) return;

    if (allDone) {
      btnStartPrep.removeAttribute('disabled');
      btnStartPrep.classList.remove('is-disabled');
      if (startPrepContainer) startPrepContainer.classList.add('is-ready');
    } else {
      btnStartPrep.setAttribute('disabled', 'true');
      btnStartPrep.classList.add('is-disabled');
      if (startPrepContainer) startPrepContainer.classList.remove('is-ready');
    }
  }

  function showHazirlikScene() {
    if (!hazirlikScene) return;
    if (hazirlikScene.classList.contains('is-shown')) return;

    hazirlikScene.classList.add('is-shown');
    hazirlikScene.removeAttribute('aria-hidden');
    void hazirlikScene.offsetWidth;
    requestAnimationFrame(() => hazirlikScene.classList.add('is-visible'));

    if (audioStatusLabel) {
      audioStatusLabel.textContent = 'HAZIRLIK MASASI VE KONTROL LİSTESİ';
    }

    checkAllStepsCompleted();

    // Öğretmen avatarı konuşma balonu ile önce çalışma alanını temizlemeye yönlendirir
    if (avatarSpeechBubble && avatarSpeechText) {
      avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
      avatarSpeechText.textContent = 'Vardiya planın onaylandı! Başlamak için önce "Çalışma Alanını Kontrol Et" adımını seçerek masayı temizle.';
      avatarSpeechBubble.classList.add('visible');
      setTimeout(() => {
        if (avatarSpeechBubble && !avatarSpeechBubble.classList.contains('teacher-bubble-work-ready')) {
          avatarSpeechBubble.classList.remove('visible');
          avatarSpeechBubble.classList.add('fade-out');
        }
      }, 5500);
    }
  }

  function resetHazirlikScene(hide) {
    if (typeof window.resetSimulation === 'function') {
      window.resetSimulation();
    }
    if (hide && hazirlikScene) {
      hazirlikScene.classList.remove('is-visible', 'is-shown');
      hazirlikScene.setAttribute('aria-hidden', 'true');
    }
  }

  function initHazirlikMasasi() {
    buildPeriodicTable();
    buildCabinetDoors();
    buildPills();
    buildSediment();
    if (hEl.labelDate) {
      hEl.labelDate.textContent = new Date().toLocaleDateString('tr-TR') + ' · Vardiya';
    }
    if (hEl.beakerFill) {
      hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px)';
      hEl.beakerFill.style.opacity = '0';
      hEl.beakerFill.classList.remove('is-stirring');
    }
    if (hEl.tint) {
      hEl.tint.style.opacity = '0';
    }
    if (hEl.sediment) {
      hEl.sediment.style.opacity = '0';
    }
    updateTargetSolutionColors();
    updateHazirlikProgress();
    checkAllStepsCompleted();

    // 1. Malzeme Seçim Modalı Dinleyicileri
    if (btnCloseMaterialsModal) {
      btnCloseMaterialsModal.addEventListener('click', closeMaterialsModal);
    }
    if (btnConfirmMaterialsModal) {
      btnConfirmMaterialsModal.addEventListener('click', confirmMaterialsSelection);
    }
    if (materialsModalBackdrop) {
      materialsModalBackdrop.addEventListener('click', (e) => {
        if (e.target === materialsModalBackdrop) closeMaterialsModal();
      });
    }

    // 1.5. Çalışma Alanı Kontrolü Modalı Dinleyicileri
    if (btnCloseWorkspaceModal) {
      btnCloseWorkspaceModal.addEventListener('click', closeWorkspaceModal);
    }
    if (btnConfirmWorkspace) {
      btnConfirmWorkspace.addEventListener('click', confirmWorkspaceCheck);
    }
    if (btnCleanAllWorkspace) {
      btnCleanAllWorkspace.addEventListener('click', cleanAllForeignItems);
    }
    if (btnCleanRack) {
      btnCleanRack.addEventListener('click', () => cleanForeignItem('rack'));
    }
    if (btnCleanPetri) {
      btnCleanPetri.addEventListener('click', () => cleanForeignItem('petri'));
    }
    if (workspaceModalBackdrop) {
      workspaceModalBackdrop.addEventListener('click', (e) => {
        if (e.target === workspaceModalBackdrop) closeWorkspaceModal();
      });
    }

    // Modal Kart Tıklama Olayları
    Object.keys(mCards).forEach((key) => {
      const card = mCards[key];
      if (card) {
        card.addEventListener('click', () => handleMaterialCardClick(key, card));
      }
    });

    // 2. Dinamik Etiketleme Modalı Dinleyicileri
    if (btnCloseLabelModal) {
      btnCloseLabelModal.addEventListener('click', closeLabelModal);
    }
    if (btnCancelLabel) {
      btnCancelLabel.addEventListener('click', closeLabelModal);
    }
    if (btnConfirmLabel) {
      btnConfirmLabel.addEventListener('click', confirmLabel);
    }
    if (labelModalBackdrop) {
      labelModalBackdrop.addEventListener('click', (e) => {
        if (e.target === labelModalBackdrop) closeLabelModal();
      });
    }
    if (inputLabelText) {
      inputLabelText.addEventListener('input', () => {
        if (labelPreviewText) {
          labelPreviewText.textContent = inputLabelText.value.trim() || 'Etiket Metni...';
        }
      });
      inputLabelText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirmLabel();
        }
      });
    }
    if (btnClearLabelInput) {
      btnClearLabelInput.addEventListener('click', () => {
        if (inputLabelText) {
          inputLabelText.value = '';
          inputLabelText.focus();
        }
        if (labelPreviewText) {
          labelPreviewText.textContent = 'Etiket Metni...';
        }
      });
    }
    if (quickTagButtons && quickTagButtons.length > 0) {
      quickTagButtons.forEach((tagBtn) => {
        tagBtn.addEventListener('click', () => {
          const val = tagBtn.dataset.value;
          if (val && inputLabelText) {
            inputLabelText.value = val;
            if (labelPreviewText) {
              labelPreviewText.textContent = val;
            }
            inputLabelText.focus();
          }
        });
      });
    }

    // Ortak ESC Tuşu ile Açık Modalları Kapatma
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (materialsModalBackdrop && materialsModalBackdrop.classList.contains('is-open')) {
          closeMaterialsModal();
        }
        if (workspaceModalBackdrop && workspaceModalBackdrop.classList.contains('is-open')) {
          closeWorkspaceModal();
        }
        if (labelModalBackdrop && labelModalBackdrop.classList.contains('is-open')) {
          closeLabelModal();
        }
        const taskPlanModalBackdrop = document.getElementById('task-plan-modal-backdrop');
        if (taskPlanModalBackdrop && taskPlanModalBackdrop.classList.contains('is-open')) {
          closeTaskPlanModal();
        }
        const solutionCompleteBackdrop = document.getElementById('solution-complete-modal-backdrop');
        if (solutionCompleteBackdrop && solutionCompleteBackdrop.classList.contains('is-open')) {
          closeSolutionCompleteModal();
        }
      }
    });

    // 01 - Malzemeleri Seç (Tekrar açılabilme ve değişiklik yapabilme garantisi)
    if (hSteps.materials) {
      hSteps.materials.addEventListener('click', () => {
        if (hState.busy) return busyHint();
        if (hasForeignItemsOnDesk()) {
          hReplayClass(hSteps.materials, 'is-shake');
          hToast('Çalışma alanında yabancı malzemeler var. Lütfen malzeme eklemeden önce masayı temizleyin.', 'warn');
          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = 'Çalışma alanında yabancı malzemeler var. Lütfen malzeme eklemeden önce masayı temizleyin.';
            avatarSpeechBubble.classList.add('visible');
          }
          if (hSteps.workspace) {
            hReplayClass(hSteps.workspace, 'is-pop');
          }
          return;
        }
        openMaterialsModal();
      });
    }

    // 02 - Çalışma Alanını Kontrol Et
    if (hSteps.workspace) {
      hSteps.workspace.addEventListener('click', () => {
        if (hState.busy) return busyHint();
        openWorkspaceModal();
      });
    }

    // 03 - Kabı Etiketle (Input Modalı Açar)
    if (hSteps.label) {
      hSteps.label.addEventListener('click', () => {
        if (hState.busy) return busyHint();
        if (!hState.workspaceDone) {
          hReplayClass(hSteps.label, 'is-shake');
          hToast('Önce "Çalışma Alanını Kontrol Et" adımını tamamlamalısın.', 'warn');
          return;
        }
        if (!hState.materialsDone || !['jar', 'water', 'beaker'].every((k) => hState.materialsPlaced[k])) {
          hReplayClass(hSteps.label, 'is-shake');
          hToast('Önce 3 malzemenin tamamını masaya eklemelisin.', 'warn');
          return;
        }
        openLabelModal();
      });
    }

    // 04 - Çözeltiyi Hazırla (İleride kullanılmak üzere kodları korundu - Checklist arayüzünden kaldırıldı)
    /*
    if (hSteps.prepare) {
      hSteps.prepare.addEventListener('click', async () => {
        if (hState.busy) return busyHint();
        if (!hState.labeled) {
          hReplayClass(hSteps.prepare, 'is-shake');
          hToast('Önce "Kabı Etiketle" adımını tamamlamalısın.', 'warn');
          return;
        }
        if (hState.prepared) {
          hReplayClass(hSteps.prepare, 'is-pop');
          hToast('Çözelti zaten hazırlandı.', 'info');
          return;
        }
        const id = hRunId;
        hState.busy = true;
        setStep(hSteps.prepare, 'working', 'Uygulanıyor…');
        try {
          await runPrepareAnimation(hSteps.prepare);
          setWorkingText(hSteps.prepare, 'Etiket yapıştırılıyor…');
          if (beakerLabelCustomText) {
            beakerLabelCustomText.textContent = hState.customLabelText || 'Madde A Çözeltisi';
          }
          await runLabelAnimation();
          hState.prepared = true;
          setStep(hSteps.prepare, 'done', 'Tamamlandı');
          hReplayClass(hSteps.prepare, 'is-pop');
          updateHazirlikProgress();
          checkAllStepsCompleted();
        } catch (e) {
          if (e !== H_ABORT) console.error(e);
        } finally {
          if (id === hRunId) hState.busy = false;
        }
      });
    }
    */

    // =========================================================
    // 2. & 3. SAHNE GEÇİŞİ VE ÇÖZELTİ HAZIRLAMA DURUM YÖNETİMİ
    // (Scene 1: Hazırlık Masası / Kontrol Listesi <--> Scene 2: Çözelti Masası / Çözelti Hazırlama)
    // =========================================================
    let currentPrepScene = 1;

    const solutionStepState = {
      jarAdded: false,
      waterAdded: false,
      stirred: false
    };

    // Geri Al (Undo) Takip Yığını (LIFO Mantığı)
    const solutionHistoryStack = [];

    const btnActionJar = document.getElementById('btn-action-jar');
    const btnActionWater = document.getElementById('btn-action-water');
    const btnActionStir = document.getElementById('btn-action-stir');
    const btnUndoSolution = document.getElementById('btn-undo-solution');
    const checkViewContainer = document.getElementById('check-view-container');
    const solutionViewContainer = document.getElementById('solution-view-container');
    const deskTitleText = document.getElementById('desk-title-text');
    const deskSub = document.getElementById('desk-sub');
    const checkTitleText = document.getElementById('check-title-text');
    const checkSub = document.getElementById('check-sub');
    const badgeCountLabel = document.getElementById('badge-count-label');
    const badgeCountNum = document.getElementById('badge-count-num');
    const btnStartPrepText = document.getElementById('btn-start-prep-text');
    const viewPlanBtnText = document.getElementById('view-plan-btn-text');
    const viewPlanIconWrap = document.getElementById('view-plan-icon-wrap');
    const btnViewTaskPlan = document.getElementById('btn-view-task-plan');
    const taskPlanModalBackdrop = document.getElementById('task-plan-modal-backdrop');
    const btnClosePlanModal = document.getElementById('btn-close-plan-modal');
    const btnDismissPlanModal = document.getElementById('btn-dismiss-plan-modal');

    const solutionCompleteBackdrop = document.getElementById('solution-complete-modal-backdrop');
    const btnCloseCompleteModal = document.getElementById('btn-close-complete-modal');
    const btnReviewDesk = document.getElementById('btn-review-desk');
    const btnProceedNextStage = document.getElementById('btn-proceed-next-stage');

    // 3. SAHNE: HAZIRLANAN ÇÖZELTİ (Referans Görsel: resim1.jpg) ELEMANLARI
    const stage3ViewContainer = document.getElementById('stage3-view-container');
    const panelCheck = document.getElementById('panel-check');
    const checkBadgeCircle = document.getElementById('check-badge-circle');
    const itemMediumBottle = document.getElementById('itemMediumBottle');
    const itemSampleBottle = document.getElementById('itemSampleBottle');
    const sampleCap = document.getElementById('sampleCap');
    const sampleBottleLabel = document.getElementById('sampleBottleLabel');
    const sampleBottleLiquid = document.getElementById('sampleBottleLiquid');
    const mediumBottleCap = document.getElementById('mediumBottleCap');
    const mediumBottleLabel = document.getElementById('mediumBottleLabel');
    const mediumBottleLiquid = document.getElementById('mediumBottleLiquid');
    const transferArrowGroup = document.getElementById('transferArrowGroup');
    const transferArrowBeakerToSample = document.getElementById('transferArrowBeakerToSample');
    const transferArrowBottleToSample = document.getElementById('transferArrowBottleToSample');
    const stage3LiquidStream = document.getElementById('stage3LiquidStream');
    const stage3LiquidStreamFlow = document.getElementById('stage3LiquidStreamFlow');
    const tableLabelMedium = document.getElementById('tableLabelMedium');
    const tableLabelSample = document.getElementById('tableLabelSample');

    const btnStage3Transfer = document.getElementById('btn-stage3-transfer');
    const btnStage3Sample = document.getElementById('btn-stage3-sample');
    const btnStage3Cleanup = document.getElementById('btn-stage3-cleanup');

    const stage4ViewContainer = document.getElementById('stage4-view-container');
    const btnStage4Step1 = document.getElementById('btn-stage4-step1');
    const btnStage4Step2 = document.getElementById('btn-stage4-step2');
    const btnStage4Step3 = document.getElementById('btn-stage4-step3');
    const cleanSampleTrayGroup = document.getElementById('cleanSampleTrayGroup');
    const cleanSampleTray = document.getElementById('cleanSampleTray');
    const traySampleBottle1 = document.getElementById('traySampleBottle1');
    const traySampleBottle2 = document.getElementById('traySampleBottle2');
    const stage4AlertBanner = document.getElementById('stage4-alert-banner');
    const stage4AlertText = document.getElementById('stage4-alert-text');
    const traySampleBottle1Liquid = document.getElementById('traySampleBottle1Liquid');
    const traySampleBottle1Cap = document.getElementById('traySampleBottle1Cap');
    const bottleSelectModalBackdrop = document.getElementById('bottle-select-modal-backdrop');
    const btnCloseBottleModal = document.getElementById('btn-close-bottle-modal');
    const bCardClean = document.getElementById('bcard-clean');
    const bCardDirty = document.getElementById('bcard-dirty');
    const areaSelectModalBackdrop = document.getElementById('area-select-modal-backdrop');
    const btnCloseAreaModal = document.getElementById('btn-close-area-modal');
    const hotspotCleanArea = document.getElementById('hotspot-clean-area');
    const hotspotMessyArea = document.getElementById('hotspot-messy-area');
    const itemAnalysisDevice = document.getElementById('itemAnalysisDevice');
    const inceleme2ViewContainer = document.getElementById('inceleme2-view-container');
    const sceneDissolveOverlay = document.getElementById('scene-dissolve-overlay');
    const chamberGlassOverlay = document.getElementById('chamberGlassOverlay');
    const itemCleaningCloth = document.getElementById('itemCleaningCloth');
    const itemSurfaceCleaner = document.getElementById('itemSurfaceCleaner');
    const cleanSurfaceViewContainer = document.getElementById('clean-surface-view-container');
    const btnCleanStep1 = document.getElementById('btn-clean-step1');
    const btnCleanStep2 = document.getElementById('btn-clean-step2');
    const btnCleanStep3 = document.getElementById('btn-clean-step3');

    const cleanSurfaceState = {
      step1: false,
      step2: false,
      step3: false
    };

    const stage3State = {
      transfer: false,
      sample: false,
      cleanup: false,
      animating: false
    };

    const stage4State = {
      bottleRevealed: false,
      selectedBottle: null,
      step1: false,
      step2: false,
      step3: false,
      animating: false
    };

    function checkStage3Completed() {
      const allDone = stage3State.transfer && stage3State.sample && stage3State.cleanup;
      if (currentPrepScene === 3 && btnStartPrep) {
        if (allDone) {
          btnStartPrep.removeAttribute('disabled');
          btnStartPrep.classList.remove('is-disabled');
          btnStartPrep.classList.add('is-ready');
          if (startPrepContainer) startPrepContainer.classList.add('is-ready');
        } else {
          btnStartPrep.setAttribute('disabled', 'true');
          btnStartPrep.classList.add('is-disabled');
          btnStartPrep.classList.remove('is-ready');
          if (startPrepContainer) startPrepContainer.classList.remove('is-ready');
        }
      }
    }

    function checkStage4Completed() {
      const allDone = stage4State.step1 && stage4State.step2 && stage4State.step3;
      if (currentPrepScene === 4 && btnStartPrep) {
        if (allDone) {
          btnStartPrep.removeAttribute('disabled');
          btnStartPrep.classList.remove('is-disabled');
          btnStartPrep.classList.add('is-ready');
          if (startPrepContainer) startPrepContainer.classList.add('is-ready');
        } else {
          btnStartPrep.setAttribute('disabled', 'true');
          btnStartPrep.classList.add('is-disabled');
          btnStartPrep.classList.remove('is-ready');
          if (startPrepContainer) startPrepContainer.classList.remove('is-ready');
        }
      }
    }

    function setDeviceScreenState(state) {
      const standby = document.getElementById('screenStateStandby');
      const starting = document.getElementById('screenStateStarting');
      const completed = document.getElementById('screenStateCompleted');
      if (standby) standby.style.display = (state === 'standby') ? 'inline' : 'none';
      if (starting) starting.style.display = (state === 'starting') ? 'inline' : 'none';
      if (completed) completed.style.display = (state === 'completed') ? 'inline' : 'none';
    }

    function resetStage4State() {
      stage4State.bottleRevealed = false;
      stage4State.selectedBottle = null;
      stage4State.step1 = false;
      stage4State.step2 = false;
      stage4State.step3 = false;
      stage4State.animating = false;
      setDeviceScreenState('standby');
      [btnStage4Step1, btnStage4Step2, btnStage4Step3].forEach((btn) => {
        if (btn) btn.classList.remove('is-done');
      });
      if (cleanSampleTrayGroup) {
        cleanSampleTrayGroup.style.display = 'none';
        cleanSampleTrayGroup.style.opacity = '1';
        cleanSampleTrayGroup.style.transition = '';
        cleanSampleTrayGroup.classList.remove('is-glow-blue');
      }
      if (traySampleBottle1) {
        traySampleBottle1.style.display = 'none';
        traySampleBottle1.style.opacity = '1';
        traySampleBottle1.style.transition = '';
        traySampleBottle1.classList.remove('is-selected');
        traySampleBottle1.style.transform = 'translate(-300px, 0px)';
      }
      if (cleanSampleTray) {
        cleanSampleTray.style.display = '';
        cleanSampleTray.style.opacity = '1';
      }
      if (itemMediumBottle) {
        itemMediumBottle.style.display = 'inline';
        itemMediumBottle.style.opacity = '1';
        itemMediumBottle.style.transition = '';
        itemMediumBottle.style.transform = 'translate(-500px, 0px)';
      }
      if (itemSampleBottle) {
        itemSampleBottle.style.display = 'inline';
        itemSampleBottle.style.opacity = '1';
        itemSampleBottle.style.transition = '';
        itemSampleBottle.style.transformOrigin = '764px 352px';
        itemSampleBottle.style.transform = 'translate(-480px, 0px)';
      }
      if (itemAnalysisDevice) {
        itemAnalysisDevice.style.display = 'none';
        itemAnalysisDevice.style.opacity = '1';
      }
      if (chamberGlassOverlay) {
        chamberGlassOverlay.style.display = 'none';
        chamberGlassOverlay.style.opacity = '0';
      }
      if (traySampleBottle1Liquid) {
        traySampleBottle1Liquid.style.opacity = '0';
        traySampleBottle1Liquid.style.transform = 'translate3d(0px, 56px, 0px)';
      }
      if (traySampleBottle1Cap) {
        traySampleBottle1Cap.style.opacity = '1';
        traySampleBottle1Cap.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
      }
      if (sampleCap) {
        if (sampleCap.parentNode !== itemSampleBottle && itemSampleBottle) {
          itemSampleBottle.appendChild(sampleCap);
        }
        sampleCap.classList.remove('is-closed');
        sampleCap.style.opacity = '1';
        sampleCap.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
      }
      if (sampleBottleLiquid && currentPrepScene === 4) {
        sampleBottleLiquid.style.opacity = '1';
        sampleBottleLiquid.style.transform = 'translate3d(0px, 0px, 0px) scaleY(1)';
      }
      if (traySampleBottle2) {
        traySampleBottle2.style.display = 'none';
        traySampleBottle2.classList.remove('is-selected', 'is-selected-dirty');
      }
      if (stage4AlertBanner) {
        stage4AlertBanner.classList.remove('is-active');
      }
      if (itemCleaningCloth) {
        itemCleaningCloth.style.display = 'none';
      }
      if (itemSurfaceCleaner) {
        itemSurfaceCleaner.style.display = 'none';
      }
      if (bottleSelectModalBackdrop) {
        bottleSelectModalBackdrop.classList.remove('is-open');
      }
      if (areaSelectModalBackdrop) {
        areaSelectModalBackdrop.classList.remove('is-open');
      }
    }

    function resetStage3State() {
      stage3State.transfer = false;
      stage3State.sample = false;
      stage3State.cleanup = false;
      stage3State.animating = false;
      [btnStage3Transfer, btnStage3Sample, btnStage3Cleanup].forEach((btn) => {
        if (btn) btn.classList.remove('is-done');
      });
      resetStage4State();

      // İki yeni şişe sadece Sahne 3'te görünür, sıfırlandığında gizlenir
      if (itemMediumBottle) {
        itemMediumBottle.style.display = 'none';
        itemMediumBottle.classList.remove('is-visible-stage3');
        itemMediumBottle.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
      }
      if (itemSampleBottle) {
        itemSampleBottle.style.display = 'none';
        itemSampleBottle.classList.remove('is-visible-stage3');
        itemSampleBottle.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
      }
      if (tableLabelMedium) tableLabelMedium.style.display = 'none';
      if (tableLabelSample) tableLabelSample.style.display = 'none';

      // Beher pozisyonu ve sıvısı Sahne 2 sonundaki durumuna döner
      if (hItems.beaker) {
        hItems.beaker.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
      }
      if (hEl.beakerFill) {
        if (solutionStepState && solutionStepState.waterAdded) {
          hEl.beakerFill.style.transform = 'translate3d(0px, 0px, 0px)';
          hEl.beakerFill.style.opacity = '1';
        } else {
          hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px)';
          hEl.beakerFill.style.opacity = '0';
        }
      }
      if (solutionStepState && solutionStepState.stirred) {
        currentSolutionColor = {
          fill: 'url(#gSolution)',
          surface: '#ddd6fe',
          stroke: '#a78bfa',
          hex: '#7c3aed',
          isStirred: true
        };
      } else {
        currentSolutionColor = {
          fill: 'url(#gBeakerWater)',
          surface: '#bae6fd',
          stroke: '#7dd3fc',
          hex: '#0284c7',
          isStirred: false
        };
      }
      updateTargetSolutionColors();

      // Numune kabı kapağı, etiketi ve sıvısı başlangıç durumuna döner
      if (sampleCap) {
        sampleCap.classList.remove('is-closed');
        sampleCap.style.opacity = '1';
        sampleCap.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      if (sampleBottleLabel) {
        sampleBottleLabel.classList.remove('is-stamped');
        sampleBottleLabel.style.opacity = '0';
        sampleBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      if (sampleBottleLiquid) {
        sampleBottleLiquid.style.transformOrigin = 'bottom center';
        sampleBottleLiquid.style.transformBox = 'fill-box';
        sampleBottleLiquid.style.transform = 'scaleY(0)';
        sampleBottleLiquid.style.opacity = '0';
      }
      if (mediumBottleCap) {
        mediumBottleCap.style.opacity = '1';
        mediumBottleCap.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      if (mediumBottleLabel) {
        mediumBottleLabel.classList.remove('is-stamped');
        mediumBottleLabel.style.opacity = '0';
        mediumBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      if (mediumBottleLiquid) {
        mediumBottleLiquid.style.transformOrigin = '';
        mediumBottleLiquid.style.transformBox = '';
        mediumBottleLiquid.style.transform = 'translate3d(0px, 90px, 0px) rotate(0deg)';
        mediumBottleLiquid.style.opacity = '0';
      }

      if (transferArrowGroup) transferArrowGroup.style.display = 'none';
      if (transferArrowBeakerToSample) transferArrowBeakerToSample.style.display = 'inline';
      if (transferArrowBottleToSample) transferArrowBottleToSample.style.display = 'none';
      if (stage3LiquidStream) stage3LiquidStream.style.display = 'none';
      if (stage3LiquidStreamFlow) stage3LiquidStreamFlow.style.display = 'none';

      checkStage3Completed();
    }

    function updateUndoButtonState() {
      if (!btnUndoSolution) return;
      if (solutionHistoryStack.length > 0 && (!window.solutionLabState || !window.solutionLabState.isPrepared)) {
        btnUndoSolution.removeAttribute('disabled');
      } else {
        btnUndoSolution.setAttribute('disabled', 'true');
      }
    }

    function checkSolutionStepsCompleted() {
      const allDone = solutionStepState.jarAdded && solutionStepState.waterAdded && solutionStepState.stirred;
      const doneCount = [solutionStepState.jarAdded, solutionStepState.waterAdded, solutionStepState.stirred].filter(Boolean).length;

      if (currentPrepScene === 2) {
        if (badgeCountNum) badgeCountNum.textContent = doneCount + ' / 3';
        if (badgeCountLabel) badgeCountLabel.textContent = 'İŞLEM';

        if (btnStartPrep) {
          // Sahne 2'de buton tıklanabilir kalır; eksik işlem varsa öğrenciye açıkça bildirilir
          btnStartPrep.removeAttribute('disabled');
          btnStartPrep.classList.remove('is-disabled');
          if (allDone) {
            btnStartPrep.classList.add('is-ready');
            if (startPrepContainer) startPrepContainer.classList.add('is-ready');
          } else {
            btnStartPrep.classList.remove('is-ready');
            if (startPrepContainer) startPrepContainer.classList.remove('is-ready');
          }
        }
      }
    }

    // Geri Al (Undo) İşlem Mantığı: Son yapılan işlemi masadan ve state'ten temizleyip butonu tekrar aktif eder
    function handleUndoSolution() {
      if (hState.busy) return busyHint();
      if (window.solutionLabState && window.solutionLabState.isPrepared) {
        hToast('Çözelti hazırlama protokolü tamamlandı. Değişiklik yapılamaz.', 'info');
        return;
      }
      if (solutionHistoryStack.length === 0) {
        hToast('Geri alınacak bir işlem bulunmuyor.', 'info');
        return;
      }

      const lastAction = solutionHistoryStack.pop();

      if (lastAction === 'stir') {
        solutionStepState.stirred = false;
        // Çözelti rengini eski haline getir
        if (hEl.tint) {
          hEl.tint.style.opacity = '0';
        }
        // Eğer Madde A eklenmişse tortuyu tekrar görünür yap
        if (solutionStepState.jarAdded && hEl.sediment) {
          hEl.sediment.style.opacity = '1';
        }
        // Çubuğu standına geri yerleştir
        if (hEl.rod && hRodHome && hEl.rod.parentNode !== hRodHome) {
          hRodHome.appendChild(hEl.rod);
        }
        if (hEl.rod) {
          hEl.rod.style.transform = R_HOME;
        }
        if (btnActionStir) {
          btnActionStir.classList.remove('is-done', 'is-working');
          btnActionStir.removeAttribute('disabled');
          btnActionStir.removeAttribute('aria-disabled');
          const desc = btnActionStir.querySelector('.sol-desc');
          if (desc) desc.textContent = 'Cam baget ile homojen karıştır';
        }
        hToast('↺ Karıştırma işlemi geri alındı.', 'info');
      } else if (lastAction === 'water') {
        solutionStepState.waterAdded = false;
        // Sıvıyı boşalt
        if (hEl.beakerFill) {
          hEl.beakerFill.style.transform = 'translate(0px, 98px)';
          hEl.beakerFill.classList.remove('is-stirring');
        }
        if (hEl.waterInner) {
          hEl.waterInner.style.transform = 'translate(0px, 0px)';
        }
        if (hEl.volTag) {
          hEl.volTag.classList.remove('is-on');
        }
        if (hEl.volText) {
          hEl.volText.textContent = '0 mL';
        }
        if (hEl.tint) {
          hEl.tint.style.opacity = '0';
        }
        if (btnActionWater) {
          btnActionWater.classList.remove('is-done', 'is-working');
          btnActionWater.removeAttribute('disabled');
          btnActionWater.removeAttribute('aria-disabled');
          const desc = btnActionWater.querySelector('.sol-desc');
          if (desc) desc.textContent = '150 mL distile su ilave et';
        }
        hToast('↺ Saf su ekleme işlemi geri alındı.', 'info');
      } else if (lastAction === 'jar') {
        solutionStepState.jarAdded = false;
        // Tortuyu kaldır
        if (hEl.sediment) {
          hEl.sediment.style.opacity = '0';
        }
        if (hEl.pills) {
          hEl.pills.style.transform = 'translate(0px, 0px)';
        }
        if (hEl.tint) {
          hEl.tint.style.opacity = '0';
        }
        if (btnActionJar) {
          btnActionJar.classList.remove('is-done', 'is-working');
          btnActionJar.removeAttribute('disabled');
          btnActionJar.removeAttribute('aria-disabled');
          const desc = btnActionJar.querySelector('.sol-desc');
          if (desc) desc.textContent = 'Saf katı reaktifi behere aktar';
        }
        hToast('↺ Madde A ekleme işlemi geri alındı.', 'info');
      }

      updateUndoButtonState();
      checkSolutionStepsCompleted();
    }

    // Devam eden tüm animasyonları iptal eder (bekleyen async işlemler H_ABORT ile sonlanır)
    function abortRunningAnimations() {
      hRunId++;
      hRunning.forEach((a) => { try { a.cancel(); } catch (e) { /* yoksay */ } });
      hRunning.clear();
      hState.busy = false;
      if (hEl.fall) hEl.fall.innerHTML = '';
    }

    // Çözelti aksiyon butonunu başlangıç (tıklanabilir) durumuna döndürür
    function resetSolutionActionButton(btn, descText) {
      if (!btn) return;
      btn.classList.remove('is-done', 'is-working', 'is-pop', 'is-shake');
      btn.removeAttribute('disabled');
      btn.removeAttribute('aria-disabled');
      const desc = btn.querySelector('.sol-desc');
      if (desc) desc.textContent = descText;
    }

    // 1. "ÖNCEKİ EKRAN" SIFIRLAMASI: Sahne 2'deki ekleme/karıştırma işlemlerini tamamen temizler.
    // Masaya Sahne 1'de yerleştirilen malzemeler ve onaylı kontrol listesi KORUNUR.
    function resetSolutionPrepState() {
      abortRunningAnimations();

      // SVG animasyonlu öğelerin inline stillerini temizle (başlangıç konum/opaklıklarına döner)
      if (hEl.rod && hRodHome && hEl.rod.parentNode !== hRodHome) {
        hRodHome.appendChild(hEl.rod);
      }
      H_ANIMATED.forEach((n) => { if (n) n.removeAttribute('style'); });

      if (hEl.beakerFill) {
        hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px)';
        hEl.beakerFill.style.opacity = '0';
        hEl.beakerFill.classList.remove('is-stirring');
      }
      if (hEl.tint) {
        hEl.tint.style.opacity = '0';
      }
      if (hEl.sediment) {
        hEl.sediment.style.opacity = '0';
      }
      currentSolutionColor = {
        fill: 'url(#gBeakerWater)',
        surface: '#bae6fd',
        stroke: '#7dd3fc',
        hex: '#0284c7',
        isStirred: false
      };
      updateTargetSolutionColors();

      if (hEl.streamFlow) hEl.streamFlow.classList.remove('is-flowing');
      if (hEl.volTag) hEl.volTag.classList.remove('is-on');
      if (hEl.volText) hEl.volText.textContent = '0 mL';
      if (hItems.beaker) hItems.beaker.classList.remove('is-glow-green');

      // State ve Geri Al yığını
      solutionStepState.jarAdded = false;
      solutionStepState.waterAdded = false;
      solutionStepState.stirred = false;
      solutionHistoryStack.length = 0;
      hState.prepared = false;

      // Tamamlanmış çözelti kaydı da geçersiz olur
      window.solutionLabState = null;
      try { localStorage.removeItem('vardiya_solution_lab_state'); } catch (e) { /* yoksay */ }
      closeSolutionCompleteModal();

      // Aksiyon butonları
      resetSolutionActionButton(btnActionJar, 'Saf katı reaktifi behere aktar');
      resetSolutionActionButton(btnActionWater, '150 mL distile su ilave et');
      resetSolutionActionButton(btnActionStir, 'Cam baget ile homojen karıştır');

      updateUndoButtonState();
    }

    // 2. "SİMÜLASYONU YENİDEN BAŞLAT" (HARD RESET): Sayfa yenilenmeden tüm simülasyonu varsayılana döndürür.
    function resetSimulation() {
      resetSolutionPrepState();
      resetStage3State();

      if (hEl.beakerFill) {
        hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px)';
        hEl.beakerFill.style.opacity = '0';
      }
      if (hEl.tint) hEl.tint.style.opacity = '0';
      if (hEl.sediment) hEl.sediment.style.opacity = '0';

      // Açık modalları kapat
      closeMaterialsModal();
      closeLabelModal();
      closeTaskPlanModal();
      closeWorkspaceModal();

      // Senaryo dışı yabancı malzemeleri tekrar masaya koy
      hState.foreignItems = { rack: true, petri: true };
      if (itemDirtyRackWrap) itemDirtyRackWrap.classList.remove('is-cleaned');
      if (itemDirtyPetriWrap) itemDirtyPetriWrap.classList.remove('is-cleaned');
      updateWorkspaceModalUI();

      // Masadaki malzemeleri gizle (sadece tepsi ve karıştırma çubuğu kalır)
      ['jar', 'water', 'beaker'].forEach((k) => {
        hState.materialsPlaced[k] = false;
        if (hItems[k]) hItems[k].classList.remove('is-placed', 'is-glow', 'is-glow-green');
      });

      // Malzeme seçim modalındaki yeşil vurguları kaldır
      Object.keys(mCards).forEach((k) => {
        const card = mCards[k];
        if (!card) return;
        card.classList.remove('is-selected', 'is-shake');
        const actionBtn = card.querySelector('.action-btn');
        if (actionBtn && k !== 'unlabeled') actionBtn.textContent = 'Masaya Ekle +';
      });
      if (modalAlertBanner) modalAlertBanner.classList.remove('is-active');
      clearTimeout(modalAlertTimer);
      updateModalCountUI();

      // Etiket belleğini temizle
      hState.customLabelText = '';
      if (inputLabelText) inputLabelText.value = '';
      if (labelPreviewText) labelPreviewText.textContent = 'Etiket Metni...';
      if (beakerLabelCustomText) beakerLabelCustomText.textContent = '';

      // Kontrol listesi state'i: Önce Çalışma Alanını Kontrol Et aktif
      hState.materialsDone = false;
      hState.workspaceDone = false;
      hState.labeled = false;
      hState.prepared = false;
      setStep(hSteps.workspace, 'active', 'Sıradaki adım');
      setStep(hSteps.materials, 'locked', 'Önce masayı temizle');
      setStep(hSteps.label, 'locked', 'Bekliyor');

      const deskMaterialsBadge = document.getElementById('materials-badge');
      if (deskMaterialsBadge) {
        deskMaterialsBadge.innerHTML = '<span class="dot" aria-hidden="true"></span>0 / 3 MALZEME';
      }

      // Sahne 1'e dön (Hazırlamaya Başla butonu checkAllStepsCompleted ile pasifleşir)
      setPrepScene(1, true);
      updateHazirlikProgress();
      checkAllStepsCompleted();

      hToast('Simülasyon yeniden başlatıldı. Önce çalışma alanını kontrol et.', 'info');
      if (avatarSpeechBubble && avatarSpeechText) {
        avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
        avatarSpeechText.textContent = 'Simülasyon baştan başladı. Önce "Çalışma Alanını Kontrol Et" adımını seçerek masayı temizle.';
        avatarSpeechBubble.classList.add('visible');
      }
    }
    window.resetSimulation = resetSimulation;
    window.resetSolutionPrepState = resetSolutionPrepState;

    function setPrepScene(mode, silent) {
      currentPrepScene = mode;

      // Senaryo dışı yabancı malzemelerin sadece Sahne 1'de görünmesi
      [itemDirtyRackWrap, itemDirtyPetriWrap].forEach(el => {
        if (el) el.style.display = (mode === 1 ? '' : 'none');
      });

      const labBgWrapper = document.getElementById('lab-bg-wrapper');
      const panelDesk = document.getElementById('panel-desk');
      const prepGrid = document.getElementById('prep-grid');

      if (mode !== 4 && mode !== 'inceleme2' && mode !== 'yuzeyi-temizle') {
        if (labBgWrapper) labBgWrapper.classList.remove('is-inspect-room', 'is-doorway-animating', 'is-scene-inceleme2');
        if (panelDesk) panelDesk.classList.remove('is-scene4', 'is-scene-inceleme2');
        if (prepGrid) prepGrid.classList.remove('is-side-room-entering');
        if (panelCheck) panelCheck.classList.remove('is-scene-inceleme2', 'is-scene-clean-surface');
        if (itemAnalysisDevice) itemAnalysisDevice.style.display = 'none';
        if (inceleme2ViewContainer) inceleme2ViewContainer.style.display = 'none';
        if (cleanSurfaceViewContainer) cleanSurfaceViewContainer.style.display = 'none';
        if (itemCleaningCloth) itemCleaningCloth.style.display = 'none';
        if (itemSurfaceCleaner) itemSurfaceCleaner.style.display = 'none';
      }

      if (mode !== 'yuzeyi-temizle') {
        if (panelCheck) panelCheck.classList.remove('is-scene-clean-surface');
        if (cleanSurfaceViewContainer) cleanSurfaceViewContainer.style.display = 'none';
        if (itemCleaningCloth) itemCleaningCloth.style.display = 'none';
        if (itemSurfaceCleaner) itemSurfaceCleaner.style.display = 'none';
        if (bannerMainTitle && bannerMainTitle.innerHTML.includes('Yüzeyi Temizle')) {
          bannerMainTitle.innerHTML = UPDATED_BANNER_TITLE_HTML;
        }
      }

      if (mode === 'inceleme2') {
        // ========================================================
        // SAHNE: İNCELEME2 (ANALİZ ALANI VE ANALİZ SONUCU PANELİ)
        // [Bölüm 2 & 3 & 4]
        // ========================================================
        if (labBgWrapper) {
          labBgWrapper.classList.remove('is-inspect-room', 'is-doorway-animating');
          labBgWrapper.classList.add('is-scene-inceleme2');
        }

        if (panelDesk) {
          panelDesk.classList.remove('is-scene4');
          panelDesk.classList.add('is-scene-inceleme2');
        }

        if (prepGrid) {
          prepGrid.classList.remove('is-side-room-entering');
        }

        if (deskTitleText) deskTitleText.textContent = 'ANALİZ ALANI';
        if (deskSub) {
          deskSub.textContent = 'Numune analiz cihazı ve sonuç raporu';
          deskSub.style.display = '';
        }

        if (checkTitleText) checkTitleText.textContent = 'Analiz Sonucu';
        if (checkSub) checkSub.style.display = 'none';
        if (checkBadgeCircle) checkBadgeCircle.style.display = 'none';
        if (panelCheck) {
          panelCheck.classList.remove('is-scene3', 'is-scene4');
          panelCheck.classList.add('is-scene-inceleme2');
        }

        if (checkViewContainer) checkViewContainer.style.display = 'none';
        if (solutionViewContainer) solutionViewContainer.style.display = 'none';
        if (stage3ViewContainer) stage3ViewContainer.style.display = 'none';
        if (stage4ViewContainer) stage4ViewContainer.style.display = 'none';
        if (inceleme2ViewContainer) inceleme2ViewContainer.style.display = 'flex';

        // 1. Çalışma Tezgahı (Nesne Yönetimi):
        // Beher, diğer şişeler, metal tepsi vb. eski materyallerin HİÇBİRİ görünmez.
        const itemBeakerWrap = document.getElementById('itemBeakerWrap');
        const itemWaterWrap = document.getElementById('itemWaterWrap');
        const itemTrayWrap = document.getElementById('itemTrayWrap');
        const itemJarWrap = document.getElementById('itemJarWrap');
        const itemWhitePadWrap = document.getElementById('itemWhitePadWrap');
        [
          itemBeakerWrap, itemWaterWrap, itemTrayWrap, itemJarWrap, itemWhitePadWrap,
          cleanSampleTrayGroup, itemMediumBottle, traySampleBottle1, traySampleBottle2,
          itemDirtyRackWrap, itemDirtyPetriWrap
        ].forEach((el) => {
          if (el) el.style.display = 'none';
        });

        // Masa altındaki eski etiketleri ve okları gizle
        const tableLabels = document.querySelectorAll('#table g[font-size] text');
        tableLabels.forEach((t) => {
          t.style.display = 'none';
        });
        if (tableLabelMedium) tableLabelMedium.style.display = 'none';
        if (tableLabelSample) tableLabelSample.style.display = 'none';
        if (transferArrowGroup) transferArrowGroup.style.display = 'none';
        if (stage3LiquidStream) stage3LiquidStream.style.display = 'none';
        if (stage3LiquidStreamFlow) stage3LiquidStreamFlow.style.display = 'none';

        // Tezgah üzerinde YALNIZCA etiketi güncellenmiş "Numune Madde A Çözeltisi" şişesi (Analiz cihazının odacığında) kalsın
        if (itemSampleBottle) {
          itemSampleBottle.style.display = 'inline';
          itemSampleBottle.style.opacity = '1';
          itemSampleBottle.style.transition = '';
          itemSampleBottle.classList.add('is-visible-stage3');
          itemSampleBottle.style.transformOrigin = '764px 352px';
          itemSampleBottle.style.transform = 'translate3d(-220px, -52px, 0px) scale(0.82)';
        }
        if (chamberGlassOverlay) {
          chamberGlassOverlay.style.display = 'inline';
          chamberGlassOverlay.style.opacity = '1';
        }
        if (sampleBottleLiquid) {
          sampleBottleLiquid.style.opacity = '1';
          sampleBottleLiquid.style.transform = 'translate3d(0px, 0px, 0px) scaleY(1)';
        }
        if (sampleCap) {
          if (sampleCap.parentNode !== itemSampleBottle && itemSampleBottle) {
            itemSampleBottle.appendChild(sampleCap);
          }
          sampleCap.classList.remove('is-open');
          sampleCap.classList.add('is-closed');
          sampleCap.style.opacity = '1';
          sampleCap.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (sampleBottleLabel) {
          sampleBottleLabel.style.opacity = '1';
          sampleBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
          const texts = sampleBottleLabel.querySelectorAll('text');
          if (texts.length >= 3) {
            texts[0].textContent = 'Numune';
            texts[1].textContent = 'Madde A';
            texts[2].textContent = 'Çözeltisi';
          }
        }

        // Sahnenin sağ tarafına yepyeni SVG Analiz Cihazı yerleşsin
        if (itemAnalysisDevice) {
          itemAnalysisDevice.style.display = 'inline';
          setDeviceScreenState('completed');
        }

        // Alt Orta Ana Buton: "Sonraki Göreve Geç" (standart beyaz oynat/ileri üçgen ikonuyla)
        if (btnStartPrepText) btnStartPrepText.innerHTML = '▶ Sonraki Göreve Geç';
        if (btnStartPrep) {
          btnStartPrep.removeAttribute('disabled');
          btnStartPrep.classList.remove('is-disabled');
          btnStartPrep.classList.add('is-ready');
          btnStartPrep.setAttribute('aria-label', 'Sonraki Göreve Geç');
        }
        if (startPrepContainer) startPrepContainer.classList.add('is-ready');

        // Navigasyon butonu
        if (viewPlanBtnText) viewPlanBtnText.textContent = 'Görev Planını Gör';
        if (btnViewTaskPlan) {
          btnViewTaskPlan.setAttribute('aria-label', 'Görev Planını Gör');
          btnViewTaskPlan.classList.add('is-stage3');
        }

        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'ANALİZ TAMAMLANDI';
        }

        if (silent) return;

        hToast('✓ Analiz tamamlandı! Sonuçlar sağ panele aktarıldı.', 'success');
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Numunenin analizi tamamlandı! Analiz sonucunu inceleyip Sonraki Göreve Geç butonuna tıklayabilirsin.';
          avatarSpeechBubble.classList.add('visible');
        }
      } else if (mode === 'yuzeyi-temizle' || mode === 5) {
        // ========================================================
        // SAHNE: YÜZEYİ TEMİZLE
        // [Bölüm 1: Sahne Geçişi ve Üst Bilgi]
        // [Bölüm 2: Çalışma Tezgahı ve SVG Nesne Üretimi]
        // [Bölüm 3: Sağ Menü Paneli (UI) Tasarımı]
        // [Bölüm 4: Alt Butonlar]
        // ========================================================
        if (labBgWrapper) {
          labBgWrapper.classList.remove('is-inspect-room', 'is-doorway-animating', 'is-scene-inceleme2');
        }

        if (panelDesk) {
          panelDesk.classList.remove('is-scene4', 'is-scene-inceleme2');
        }

        if (prepGrid) {
          prepGrid.classList.remove('is-side-room-entering');
        }

        if (deskTitleText) deskTitleText.textContent = 'ÇALIŞMA TEZGAHI';
        if (deskSub) {
          deskSub.textContent = 'Çalışma alanını düzenle ve yüzeyi temizle';
          deskSub.style.display = '';
        }

        // Üst Bar Güncellemesi: "Risk Laboratuvarı – Yüzeyi Temizle"
        if (bannerMainTitle) {
          bannerMainTitle.innerHTML = 'Risk Laboratuvarı – <span class="banner-highlight-yellow">Yüzeyi Temizle</span>';
        }

        // Sağ Menü Paneli (UI) Tasarımı:
        // Ana Başlık: "Çalışma Yüzeyini Temizle"
        // Alt Açıklama: "Numune hazırlandı. Çalışma alanını düzenle ve temizle."
        if (checkTitleText) checkTitleText.textContent = 'Çalışma Yüzeyini Temizle';
        if (checkSub) {
          checkSub.textContent = 'Numune hazırlandı. Çalışma alanını düzenle ve temizle.';
          checkSub.style.display = 'block';
        }
        if (checkBadgeCircle) checkBadgeCircle.style.display = 'none';
        if (panelCheck) {
          panelCheck.classList.remove('is-scene3', 'is-scene4', 'is-scene-inceleme2');
          panelCheck.classList.add('is-scene-clean-surface');
        }

        if (checkViewContainer) checkViewContainer.style.display = 'none';
        if (solutionViewContainer) solutionViewContainer.style.display = 'none';
        if (stage3ViewContainer) stage3ViewContainer.style.display = 'none';
        if (stage4ViewContainer) stage4ViewContainer.style.display = 'none';
        if (inceleme2ViewContainer) inceleme2ViewContainer.style.display = 'none';
        if (cleanSurfaceViewContainer) cleanSurfaceViewContainer.style.display = 'flex';

        // 1. Genel Temizlik: Analiz cihazı vb. materyaller sahnede yer almasın
        const itemBeakerWrap = document.getElementById('itemBeakerWrap');
        const itemWaterWrap = document.getElementById('itemWaterWrap');
        const itemTrayWrap = document.getElementById('itemTrayWrap');
        const itemJarWrap = document.getElementById('itemJarWrap');
        const itemWhitePadWrap = document.getElementById('itemWhitePadWrap');
        [
          itemBeakerWrap, itemWaterWrap, itemTrayWrap, itemJarWrap, itemWhitePadWrap,
          cleanSampleTrayGroup, traySampleBottle1, traySampleBottle2,
          itemDirtyRackWrap, itemDirtyPetriWrap, itemAnalysisDevice, chamberGlassOverlay
        ].forEach((el) => {
          if (el) el.style.display = 'none';
        });

        // Masa altındaki eski etiketleri ve okları gizle
        const tableLabels = document.querySelectorAll('#table g[font-size] text');
        tableLabels.forEach((t) => {
          t.style.display = 'none';
        });
        if (tableLabelMedium) tableLabelMedium.style.display = 'none';
        if (tableLabelSample) tableLabelSample.style.display = 'none';
        if (transferArrowGroup) transferArrowGroup.style.display = 'none';
        if (stage3LiquidStream) stage3LiquidStream.style.display = 'none';
        if (stage3LiquidStreamFlow) stage3LiquidStreamFlow.style.display = 'none';

        // 2. Sola Hizalı Öğeler (Mevcut Nesneler):
        // Sol tarafta sadece büyük boy şeffaf "Madde A Çözeltisi" şişesi (mavi kapaklı)
        // ve hemen yanında küçük boy şeffaf "Numune" şişesi (mavi kapaklı)
        if (itemMediumBottle) {
          itemMediumBottle.style.display = 'inline';
          itemMediumBottle.style.opacity = '1';
          itemMediumBottle.style.transition = '';
          itemMediumBottle.style.transform = 'translate(-580px, 0px)';
        }
        if (mediumBottleLiquid) {
          mediumBottleLiquid.style.opacity = '1';
          mediumBottleLiquid.style.transform = 'translateY(0px)';
        }
        if (mediumBottleLabel) {
          mediumBottleLabel.style.opacity = '1';
          mediumBottleLabel.style.transform = 'scale(1) translateY(0px)';
        }
        if (mediumBottleCap) {
          mediumBottleCap.style.transform = 'translate3d(0px, 0px, 0px)';
        }

        if (itemSampleBottle) {
          itemSampleBottle.style.display = 'inline';
          itemSampleBottle.style.opacity = '1';
          itemSampleBottle.style.transition = '';
          itemSampleBottle.classList.add('is-visible-stage3');
          itemSampleBottle.style.transformOrigin = '764px 352px';
          itemSampleBottle.style.transform = 'translate(-564px, 0px)';
        }
        if (sampleBottleLiquid) {
          sampleBottleLiquid.style.opacity = '1';
          sampleBottleLiquid.style.transform = 'translate3d(0px, 0px, 0px) scaleY(1)';
        }
        if (sampleCap) {
          if (sampleCap.parentNode !== itemSampleBottle && itemSampleBottle) {
            itemSampleBottle.appendChild(sampleCap);
          }
          sampleCap.classList.remove('is-open');
          sampleCap.classList.add('is-closed');
          sampleCap.style.opacity = '1';
          sampleCap.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (sampleBottleLabel) {
          sampleBottleLabel.style.opacity = '1';
          sampleBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
        }

        // 3. Merkez ve Sağ Alan (Yeni SVG Nesneler):
        // Temizlik Bezi (SVG)
        if (itemCleaningCloth) {
          itemCleaningCloth.style.display = 'inline';
          itemCleaningCloth.style.opacity = '1';
        }
        // Yüzey Temizleyici Şişesi (SVG)
        if (itemSurfaceCleaner) {
          itemSurfaceCleaner.style.display = 'inline';
          itemSurfaceCleaner.style.opacity = '1';
        }

        // 4. Alt Butonlar:
        // Alt orta büyük mavi buton: "Temizliğe Başla"
        if (btnStartPrepText) btnStartPrepText.innerHTML = '▶ Temizliğe Başla';
        if (btnStartPrep) {
          btnStartPrep.removeAttribute('disabled');
          btnStartPrep.classList.remove('is-disabled');
          btnStartPrep.classList.add('is-ready');
          btnStartPrep.setAttribute('aria-label', 'Temizliğe Başla');
        }
        if (startPrepContainer) startPrepContainer.classList.add('is-ready');

        // Sağ alttaki buton: "Görev Planını Gör"
        if (viewPlanBtnText) viewPlanBtnText.textContent = 'Görev Planını Gör';
        if (btnViewTaskPlan) {
          btnViewTaskPlan.setAttribute('aria-label', 'Görev Planını Gör');
          btnViewTaskPlan.classList.add('is-stage3');
        }

        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'YÜZEYİ TEMİZLE';
        }

        if (silent) return;

        hToast('✓ "Yüzeyi Temizle" sahnesine geçildi.', 'info');
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Numune hazırlandı. Çalışma alanını düzenle ve yüzeyi temizle.';
          avatarSpeechBubble.classList.add('visible');
        }
      } else if (mode === 4) {
        // ========================================================
        // SAHNE 4: NUMUNEYİ İNCELE
        // [Bölüm 1: Arka Plan Sabitleme (Geçiş İptali)]
        // Butona basıldığında mevcut arka plan sabit kalacaktır.
        // Sahne değişmeyecek, yalnızca tezgah üzerindeki materyallerin dizilimi
        // ve sağ menü arayüzü yeni kurallara göre güncellenecektir.
        // ========================================================
        if (labBgWrapper) {
          labBgWrapper.classList.remove('is-inspect-room', 'is-doorway-animating', 'is-scene-inceleme2');
        }

        if (panelDesk) {
          panelDesk.classList.remove('is-scene-inceleme2');
          panelDesk.classList.add('is-scene4');
        }

        if (prepGrid) {
          prepGrid.classList.remove('is-side-room-entering');
        }

        if (deskTitleText) deskTitleText.textContent = 'NUMUNEYİ İNCELE';
        if (deskSub) {
          deskSub.textContent = 'Numune hazırlığı ve analiz alanı';
          deskSub.style.display = '';
        }

        if (checkTitleText) checkTitleText.textContent = 'Numuneyi İncele';
        if (checkSub) checkSub.style.display = 'none';
        if (checkBadgeCircle) checkBadgeCircle.style.display = 'none';
        if (panelCheck) {
          panelCheck.classList.remove('is-scene3', 'is-scene-inceleme2');
          panelCheck.classList.add('is-scene4');
        }

        if (checkViewContainer) checkViewContainer.style.display = 'none';
        if (solutionViewContainer) solutionViewContainer.style.display = 'none';
        if (stage3ViewContainer) stage3ViewContainer.style.display = 'none';
        if (stage4ViewContainer) stage4ViewContainer.style.display = 'flex';
        if (inceleme2ViewContainer) inceleme2ViewContainer.style.display = 'none';
        if (itemAnalysisDevice) itemAnalysisDevice.style.display = 'none';
        setDeviceScreenState('standby');

        // 1. Çalışma Tezgahı (Nesne Yerleşimleri ve SVG Üretimi):
        // Beher, saf su, baget, eski tepsi, madde A katı şişesi tamamen gizlenir
        const itemBeakerWrap = document.getElementById('itemBeakerWrap');
        const itemWaterWrap = document.getElementById('itemWaterWrap');
        const itemTrayWrap = document.getElementById('itemTrayWrap');
        const itemJarWrap = document.getElementById('itemJarWrap');
        const itemWhitePadWrap = document.getElementById('itemWhitePadWrap');
        [itemBeakerWrap, itemWaterWrap, itemTrayWrap, itemJarWrap, itemWhitePadWrap].forEach((el) => {
          if (el) el.style.display = 'none';
        });

        // Masa altındaki eski etiketleri gizle
        const tableLabels = document.querySelectorAll('#table g[font-size] text');
        tableLabels.forEach((t) => {
          if (t.id !== 'tableLabelMedium' && t.id !== 'tableLabelSample') {
            t.style.display = 'none';
          }
        });

        // Sola Hizalı Öğeler: Tezgahın sol tarafına büyük "Madde A Çözeltisi" cam şişesi yerleştirilsin
        if (itemMediumBottle) {
          itemMediumBottle.style.display = 'inline';
          itemMediumBottle.style.opacity = '1';
          itemMediumBottle.style.transition = '';
          itemMediumBottle.classList.add('is-visible-stage3');
          itemMediumBottle.style.transform = 'translate(-500px, 0px)';
        }
        if (mediumBottleLiquid) {
          mediumBottleLiquid.style.opacity = '1';
          mediumBottleLiquid.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        if (mediumBottleCap) {
          mediumBottleCap.style.opacity = '1';
          mediumBottleCap.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        if (mediumBottleLabel) {
          mediumBottleLabel.style.opacity = '1';
          mediumBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
        }

        // Bu şişenin hemen sağına ise küçük boyutlu "Numune: Madde A Çözeltisi" kabı eklensin
        if (itemSampleBottle) {
          itemSampleBottle.style.display = 'inline';
          itemSampleBottle.style.opacity = '1';
          itemSampleBottle.style.transition = '';
          itemSampleBottle.style.transformOrigin = '764px 352px';
          itemSampleBottle.classList.add('is-visible-stage3');
          itemSampleBottle.style.transform = 'translate(-480px, 0px)';
        }
        if (sampleBottleLiquid) {
          sampleBottleLiquid.style.opacity = '1';
          sampleBottleLiquid.style.transform = 'scaleY(1)';
        }
        if (sampleCap) {
          if (sampleCap.parentNode !== itemSampleBottle && itemSampleBottle) {
            itemSampleBottle.appendChild(sampleCap);
          }
          sampleCap.classList.remove('is-closed');
          sampleCap.style.opacity = '1';
          sampleCap.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (sampleBottleLabel) {
          sampleBottleLabel.style.opacity = '1';
          sampleBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
          const texts = sampleBottleLabel.querySelectorAll('text');
          if (texts.length >= 3) {
            texts[0].textContent = 'Numune';
            texts[1].textContent = 'Madde A';
            texts[2].textContent = 'Çözeltisi';
          }
        }

        // Merkezdeki SVG Öğeler: Bu iki şişenin sağ tarafında hizalanmış temiz metalik tepsi
        if (cleanSampleTrayGroup) {
          cleanSampleTrayGroup.style.display = 'inline';
          cleanSampleTrayGroup.style.opacity = '1';
          cleanSampleTrayGroup.style.transition = '';
          cleanSampleTrayGroup.classList.remove('is-glow-blue');
        }
        // Başlangıç Durumu (Initial State): Tepsi içindeki bu iki boş şişe (temiz ve pis olan) gizli (hidden) durumda olsun
        if (traySampleBottle1) {
          traySampleBottle1.style.display = 'none';
          traySampleBottle1.style.opacity = '1';
          traySampleBottle1.style.transition = '';
          traySampleBottle1.classList.remove('is-selected');
          traySampleBottle1.style.transform = 'translate(-300px, 0px)';
        }
        if (cleanSampleTray) {
          cleanSampleTray.style.display = '';
          cleanSampleTray.style.opacity = '1';
        }
        if (itemAnalysisDevice) {
          itemAnalysisDevice.style.display = 'none';
          itemAnalysisDevice.style.opacity = '1';
        }
        if (chamberGlassOverlay) {
          chamberGlassOverlay.style.display = 'none';
          chamberGlassOverlay.style.opacity = '0';
        }
        if (traySampleBottle1Liquid) {
          traySampleBottle1Liquid.style.opacity = '0';
          traySampleBottle1Liquid.style.transform = 'translate3d(0px, 56px, 0px)';
        }
        if (traySampleBottle1Cap) {
          traySampleBottle1Cap.style.opacity = '1';
          traySampleBottle1Cap.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (traySampleBottle2) {
          traySampleBottle2.style.display = 'none';
          traySampleBottle2.classList.remove('is-selected', 'is-selected-dirty');
        }
        if (stage4AlertBanner) {
          stage4AlertBanner.classList.remove('is-active');
        }
        if (bottleSelectModalBackdrop) {
          bottleSelectModalBackdrop.classList.remove('is-open');
        }

        if (tableLabelMedium) tableLabelMedium.style.display = 'none';
        if (tableLabelSample) tableLabelSample.style.display = 'none';
        if (transferArrowGroup) transferArrowGroup.style.display = 'none';
        if (stage3LiquidStream) stage3LiquidStream.style.display = 'none';
        if (stage3LiquidStreamFlow) stage3LiquidStreamFlow.style.display = 'none';

        // Orta buton: "▶ İncelemeye Başla"
        if (btnStartPrepText) btnStartPrepText.innerHTML = '▶ İncelemeye Başla';
        if (btnStartPrep) btnStartPrep.setAttribute('aria-label', 'İncelemeye Başla');

        // Navigasyon / Alt Butonlar: "Görev Planını Gör"
        if (viewPlanBtnText) viewPlanBtnText.textContent = 'Görev Planını Gör';
        if (btnViewTaskPlan) {
          btnViewTaskPlan.setAttribute('aria-label', 'Görev Planını Gör');
          btnViewTaskPlan.classList.add('is-stage3');
        }
        if (viewPlanIconWrap) {
          viewPlanIconWrap.innerHTML = `
            <svg viewBox="0 0 24 24" class="view-plan-icon" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          `;
        }

        checkStage4Completed();

        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'NUMUNEYİ İNCELE AŞAMASI';
        }
        if (silent) return;

        hToast('✓ Görev tamamlandı! Numuneyi İncele aşamasına geçildi.', 'success');
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Çözelti hazırlandı ve numune ayrıldı. Şimdi sağ menüdeki adımları tamamlayarak numuneyi incelemeye başla.';
          avatarSpeechBubble.classList.add('visible');
        }
      } else if (mode === 3) {
        // ========================================================
        // SAHNE 3: HAZIRLANAN ÇÖZELTİ (Referans Görsel: resim1.jpg)
        // ========================================================
        if (deskTitleText) deskTitleText.textContent = 'ÇÖZELTİ MASASI';
        if (deskSub) {
          deskSub.textContent = 'Çözelti aktarımı ve numune hazırlığı';
          deskSub.style.display = '';
        }

        if (checkTitleText) checkTitleText.textContent = 'Hazırlanan Çözelti';
        if (checkSub) checkSub.style.display = 'none';
        if (checkBadgeCircle) checkBadgeCircle.style.display = 'none';
        if (panelCheck) {
          panelCheck.classList.add('is-scene3');
          panelCheck.classList.remove('is-scene4');
        }

        if (checkViewContainer) checkViewContainer.style.display = 'none';
        if (solutionViewContainer) solutionViewContainer.style.display = 'none';
        if (stage3ViewContainer) stage3ViewContainer.style.display = 'flex';
        if (stage4ViewContainer) stage4ViewContainer.style.display = 'none';
        if (cleanSampleTrayGroup) cleanSampleTrayGroup.style.display = 'none';

        // Temizleme yapılmadıysa 5 malzeme görünür kalır
        const itemBeakerWrap = document.getElementById('itemBeakerWrap');
        const itemWaterWrap = document.getElementById('itemWaterWrap');
        const itemTrayWrap = document.getElementById('itemTrayWrap');
        const itemJarWrap = document.getElementById('itemJarWrap');
        const itemWhitePadWrap = document.getElementById('itemWhitePadWrap');
        if (!stage3State.cleanup) {
          [itemBeakerWrap, itemWaterWrap, itemTrayWrap, itemJarWrap, itemWhitePadWrap].forEach((el) => {
            if (el) {
              el.style.display = '';
              el.style.opacity = '';
              el.style.transform = '';
            }
          });
        } else {
          [itemBeakerWrap, itemWaterWrap, itemTrayWrap, itemJarWrap, itemWhitePadWrap].forEach((el) => {
            if (el) el.style.display = 'none';
          });
        }

        // Sol panel masası: Madde A Çözeltisi ve Numune kabı görünür
        if (itemMediumBottle) {
          itemMediumBottle.style.display = 'inline';
          itemMediumBottle.classList.add('is-visible-stage3');
          itemMediumBottle.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (itemSampleBottle) {
          itemSampleBottle.style.display = 'inline';
          itemSampleBottle.classList.add('is-visible-stage3');
          itemSampleBottle.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (tableLabelMedium) tableLabelMedium.style.display = 'inline';
        if (tableLabelSample) tableLabelSample.style.display = 'inline';
        if (hEl.volTag) hEl.volTag.classList.remove('is-on');

        // Sahne 3 başlangıç pozisyonları: Kapaklar kapalı, etiketler gizli, sıvılar tabanda scaleY(0)
        if (hItems.beaker) {
          hItems.beaker.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (mediumBottleCap) {
          mediumBottleCap.style.opacity = '1';
          mediumBottleCap.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        if (sampleCap) {
          sampleCap.style.opacity = '1';
          sampleCap.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        if (mediumBottleLabel && !stage3State.transfer) {
          mediumBottleLabel.classList.remove('is-stamped');
          mediumBottleLabel.style.opacity = '0';
          mediumBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        if (sampleBottleLabel && !stage3State.sample) {
          sampleBottleLabel.classList.remove('is-stamped');
          sampleBottleLabel.style.opacity = '0';
          sampleBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        if (mediumBottleLiquid && !stage3State.transfer) {
          mediumBottleLiquid.style.transformOrigin = '';
          mediumBottleLiquid.style.transformBox = '';
          mediumBottleLiquid.style.transform = 'translate3d(0px, 90px, 0px) rotate(0deg)';
          mediumBottleLiquid.style.opacity = '0';
        }
        if (sampleBottleLiquid && !stage3State.sample) {
          sampleBottleLiquid.style.transformOrigin = 'bottom center';
          sampleBottleLiquid.style.transformBox = 'fill-box';
          sampleBottleLiquid.style.transform = 'scaleY(0)';
          sampleBottleLiquid.style.opacity = '0';
        }
        if (stage3LiquidStream) {
          stage3LiquidStream.style.display = 'none';
          stage3LiquidStream.style.opacity = '0';
        }
        if (stage3LiquidStreamFlow) {
          stage3LiquidStreamFlow.style.display = 'none';
          stage3LiquidStreamFlow.style.opacity = '0';
          stage3LiquidStreamFlow.classList.remove('is-flowing');
        }

        // Orta buton: "▶ Görevi Tamamla"
        if (btnStartPrepText) btnStartPrepText.innerHTML = '▶ Görevi Tamamla';
        if (btnStartPrep) btnStartPrep.setAttribute('aria-label', 'Görevi Tamamla');

        // Sağ alt buton: "Önceki İşleme Dön"
        if (viewPlanBtnText) viewPlanBtnText.textContent = 'Önceki İşleme Dön';
        if (btnViewTaskPlan) {
          btnViewTaskPlan.setAttribute('aria-label', 'Önceki İşleme Dön');
          btnViewTaskPlan.classList.add('is-stage3');
        }
        if (viewPlanIconWrap) {
          viewPlanIconWrap.innerHTML = `
            <svg viewBox="0 0 24 24" class="view-plan-icon" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></line>
              <polyline points="12 19 5 12 12 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></polyline>
            </svg>
          `;
        }

        checkStage3Completed();

        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'HAZIRLANAN ÇÖZELTİ VE AKTARIM';
        }
        if (silent) return;

        hToast('3. Aşama: Hazırlanan Çözelti protokolüne geçildi.', 'info');
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Çözelti hazırlandı! Sağ paneldeki 3 işlemi tamamlayarak "Görevi Tamamla" butonuna bas.';
          avatarSpeechBubble.classList.add('visible');
        }
      } else if (mode === 2) {
        // SAHNE 2: ÇÖZELTİ MASASI / ÇÖZELTİ HAZIRLAMA
        if (deskTitleText) deskTitleText.textContent = 'ÇÖZELTİ MASASI';
        if (deskSub) {
          deskSub.textContent = 'Reaktif ve çözücü aktarım alanı';
          deskSub.style.display = '';
        }

        if (checkTitleText) checkTitleText.textContent = 'ÇÖZELTİ HAZIRLAMA';
        if (checkSub) {
          checkSub.textContent = 'Çözelti hazırlamak için aşağıdaki adımları sırayla uygula.';
          checkSub.style.display = '';
        }
        if (checkBadgeCircle) checkBadgeCircle.style.display = '';
        if (panelCheck) panelCheck.classList.remove('is-scene3', 'is-scene4');
        if (badgeCountLabel) badgeCountLabel.textContent = 'İŞLEM';

        if (checkViewContainer) checkViewContainer.style.display = 'none';
        if (solutionViewContainer) solutionViewContainer.style.display = 'flex';
        if (stage3ViewContainer) stage3ViewContainer.style.display = 'none';
        if (stage4ViewContainer) stage4ViewContainer.style.display = 'none';
        if (cleanSampleTrayGroup) cleanSampleTrayGroup.style.display = 'none';

        // 5 Malzemeyi masada tekrar görünür yap
        const itemBeakerWrap = document.getElementById('itemBeakerWrap');
        const itemWaterWrap = document.getElementById('itemWaterWrap');
        const itemTrayWrap = document.getElementById('itemTrayWrap');
        const itemJarWrap = document.getElementById('itemJarWrap');
        const itemWhitePadWrap = document.getElementById('itemWhitePadWrap');
        [itemBeakerWrap, itemWaterWrap, itemTrayWrap, itemJarWrap, itemWhitePadWrap].forEach((el) => {
          if (el) {
            el.style.display = '';
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
          }
        });
        const tableLabels = document.querySelectorAll('#table g[font-size] text');
        tableLabels.forEach((t) => {
          if (t.id !== 'tableLabelMedium' && t.id !== 'tableLabelSample') {
            t.style.display = '';
          }
        });

        if (itemMediumBottle) {
          itemMediumBottle.style.display = 'none';
          itemMediumBottle.classList.remove('is-visible-stage3');
        }
        if (itemSampleBottle) {
          itemSampleBottle.style.display = 'none';
          itemSampleBottle.classList.remove('is-visible-stage3');
        }
        if (tableLabelMedium) tableLabelMedium.style.display = 'none';
        if (tableLabelSample) tableLabelSample.style.display = 'none';
        if (transferArrowGroup) transferArrowGroup.style.display = 'none';

        if (btnStartPrepText) btnStartPrepText.textContent = 'HAZIRLAMAYI TAMAMLA';
        if (btnStartPrep) btnStartPrep.setAttribute('aria-label', 'Hazırlamayı Tamamla');

        if (viewPlanBtnText) viewPlanBtnText.textContent = 'Önceki Ekran';
        if (btnViewTaskPlan) {
          btnViewTaskPlan.setAttribute('aria-label', 'Önceki Ekrana Dön');
          btnViewTaskPlan.classList.remove('is-stage3');
        }
        if (viewPlanIconWrap) {
          viewPlanIconWrap.innerHTML = `
            <svg viewBox="0 0 24 24" class="view-plan-icon" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></line>
              <polyline points="12 19 5 12 12 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></polyline>
            </svg>
          `;
        }

        updateUndoButtonState();
        checkSolutionStepsCompleted();

        hToast('Çözelti Masası açıldı. Reaktifleri kaba ekleyip karıştırın.', 'info');
        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'ÇÖZELTİ HAZIRLAMA AŞAMASI';
        }
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Çözelti hazırlama aşamasına geçtin! Sağ paneldeki işlemleri uygulayarak çözeltini hazırla.';
          avatarSpeechBubble.classList.add('visible');
        }
      } else {
        // SAHNE 1: HAZIRLIK MASASI / KONTROL LİSTESİ
        if (deskTitleText) deskTitleText.textContent = 'HAZIRLIK MASASI';
        if (deskSub) deskSub.textContent = 'Vardiya için gerekli malzemeler masaya yerleştirildi.';

        if (checkTitleText) checkTitleText.textContent = 'KONTROL LİSTESİ';
        if (checkSub) {
          checkSub.textContent = 'İşe başlamadan önce aşağıdaki adımları onayla.';
          checkSub.style.display = '';
        }
        if (checkBadgeCircle) checkBadgeCircle.style.display = '';
        if (panelCheck) panelCheck.classList.remove('is-scene3', 'is-scene4');
        if (badgeCountLabel) badgeCountLabel.textContent = 'ADIM';

        if (checkViewContainer) checkViewContainer.style.display = 'flex';
        if (solutionViewContainer) solutionViewContainer.style.display = 'none';
        if (stage3ViewContainer) stage3ViewContainer.style.display = 'none';
        if (stage4ViewContainer) stage4ViewContainer.style.display = 'none';
        if (cleanSampleTrayGroup) cleanSampleTrayGroup.style.display = 'none';

        // 5 Malzemeyi masada tekrar görünür yap
        const itemBeakerWrap = document.getElementById('itemBeakerWrap');
        const itemWaterWrap = document.getElementById('itemWaterWrap');
        const itemTrayWrap = document.getElementById('itemTrayWrap');
        const itemJarWrap = document.getElementById('itemJarWrap');
        const itemWhitePadWrap = document.getElementById('itemWhitePadWrap');
        [itemBeakerWrap, itemWaterWrap, itemTrayWrap, itemJarWrap, itemWhitePadWrap].forEach((el) => {
          if (el) {
            el.style.display = '';
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
          }
        });
        const tableLabels = document.querySelectorAll('#table g[font-size] text');
        tableLabels.forEach((t) => {
          if (t.id !== 'tableLabelMedium' && t.id !== 'tableLabelSample') {
            t.style.display = '';
          }
        });

        if (itemMediumBottle) {
          itemMediumBottle.style.display = 'none';
          itemMediumBottle.classList.remove('is-visible-stage3');
        }
        if (itemSampleBottle) {
          itemSampleBottle.style.display = 'none';
          itemSampleBottle.classList.remove('is-visible-stage3');
        }
        if (tableLabelMedium) tableLabelMedium.style.display = 'none';
        if (tableLabelSample) tableLabelSample.style.display = 'none';
        if (transferArrowGroup) transferArrowGroup.style.display = 'none';

        if (btnStartPrepText) btnStartPrepText.textContent = 'HAZIRLAMAYA BAŞLA';
        if (btnStartPrep) btnStartPrep.setAttribute('aria-label', 'Hazırlamaya Başla');

        if (viewPlanBtnText) viewPlanBtnText.textContent = 'Görev Planını Gör';
        if (btnViewTaskPlan) {
          btnViewTaskPlan.setAttribute('aria-label', 'Görev Planını Gör');
          btnViewTaskPlan.classList.remove('is-stage3');
        }
        if (viewPlanIconWrap) {
          viewPlanIconWrap.innerHTML = `
            <svg viewBox="0 0 24 24" class="view-plan-icon" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          `;
        }

        if (btnStartPrep) btnStartPrep.classList.remove('is-ready');
        if (badgeCountNum) badgeCountNum.textContent = '3';
        checkAllStepsCompleted();

        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'HAZIRLIK MASASI VE KONTROL LİSTESİ';
        }
        if (silent) return;

        hToast('Hazırlık Masasına dönüldü. Çözelti hazırlama adımları sıfırlandı.', 'info');
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Hazırlık Masasına geri döndün. Çözelti adımları sıfırlandı; dilediğin zaman "Hazırlamaya Başla" ile tekrar başlayabilirsin.';
          avatarSpeechBubble.classList.add('visible');
        }
      }
    }

    // 1. Çözelti Butonu: "Madde A'yı Ekle"
    if (btnActionJar) {
      btnActionJar.addEventListener('click', async () => {
        if (hState.busy) return busyHint();
        if (solutionStepState.jarAdded) {
          return; // Zaten eklenmişse tekrar eklenmez
        }
        const id = hRunId;
        hState.busy = true;
        btnActionJar.classList.add('is-working');
        try {
          await runJarAnimation(btnActionJar);
          solutionStepState.jarAdded = true;
          solutionHistoryStack.push('jar');
          btnActionJar.classList.remove('is-working');
          btnActionJar.classList.add('is-done');
          btnActionJar.setAttribute('disabled', 'true');
          btnActionJar.setAttribute('aria-disabled', 'true');
          const desc = btnActionJar.querySelector('.sol-desc');
          if (desc) desc.textContent = 'Eklendi ✓';
          hReplayClass(btnActionJar, 'is-pop');
          hToast('✓ Madde A başarıyla behere eklendi.', 'success');
          updateUndoButtonState();
          checkSolutionStepsCompleted();
        } catch (e) {
          if (e !== H_ABORT) console.error(e);
        } finally {
          if (id === hRunId) hState.busy = false;
        }
      });
    }

    // 2. Çözelti Butonu: "Saf Suyu Ekle"
    if (btnActionWater) {
      btnActionWater.addEventListener('click', async () => {
        if (hState.busy) return busyHint();
        if (solutionStepState.waterAdded) {
          return; // Zaten eklenmişse tekrar eklenmez
        }
        const id = hRunId;
        hState.busy = true;
        btnActionWater.classList.add('is-working');
        try {
          await runWaterAnimation(btnActionWater);
          solutionStepState.waterAdded = true;
          solutionHistoryStack.push('water');
          btnActionWater.classList.remove('is-working');
          btnActionWater.classList.add('is-done');
          btnActionWater.setAttribute('disabled', 'true');
          btnActionWater.setAttribute('aria-disabled', 'true');
          const desc = btnActionWater.querySelector('.sol-desc');
          if (desc) desc.textContent = 'Eklendi ✓';
          hReplayClass(btnActionWater, 'is-pop');
          hToast('✓ 150 mL Saf su behere eklendi.', 'success');
          updateUndoButtonState();
          checkSolutionStepsCompleted();
        } catch (e) {
          if (e !== H_ABORT) console.error(e);
        } finally {
          if (id === hRunId) hState.busy = false;
        }
      });
    }

    // 3. Çözelti Butonu: "Karıştır"
    if (btnActionStir) {
      btnActionStir.addEventListener('click', async () => {
        if (hState.busy) return busyHint();
        if (solutionStepState.stirred) {
          return; // Zaten karıştırıldıysa tekrar işlem yapılmaz
        }
        // KRİTİK KURAL 1:
        // Eğer her iki malzeme de kaba eklenmeden (butonlara basılmadan) "Karıştır" butonuna basılırsa,
        // karıştırma animasyonu kesinlikle başlamamalıdır. Ekranda şu mesaj gösterilmelidir:
        // "Karıştırmadan önce gerekli malzemeleri kaba ekle."
        if (!solutionStepState.jarAdded || !solutionStepState.waterAdded) {
          hReplayClass(btnActionStir, 'is-shake');
          hToast('Karıştırmadan önce gerekli malzemeleri kaba ekle.', 'warn');
          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = 'Karıştırmadan önce gerekli malzemeleri kaba ekle.';
            avatarSpeechBubble.classList.add('visible');
          }
          return;
        }

        const id = hRunId;
        hState.busy = true;
        btnActionStir.classList.add('is-working');
        try {
          await runStirAnimation(btnActionStir);
          solutionStepState.stirred = true;
          solutionHistoryStack.push('stir');
          btnActionStir.classList.remove('is-working');
          btnActionStir.classList.add('is-done');
          btnActionStir.setAttribute('disabled', 'true');
          btnActionStir.setAttribute('aria-disabled', 'true');
          const desc = btnActionStir.querySelector('.sol-desc');
          if (desc) desc.textContent = 'Karıştırıldı ✓';
          hReplayClass(btnActionStir, 'is-pop');
          hToast('✓ Çözelti homojen karıştırıldı!', 'success');
          updateUndoButtonState();
          checkSolutionStepsCompleted();

          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = 'Harika! Çözelti başarıyla karıştırıldı. Şimdi "Hazırlamayı Tamamla" butonuna basabilirsin!';
            avatarSpeechBubble.classList.add('visible');
          }
        } catch (e) {
          if (e !== H_ABORT) console.error(e);
        } finally {
          if (id === hRunId) hState.busy = false;
        }
      });
    }

    // Geri Al Butonu Olay Dinleyicisi
    if (btnUndoSolution) {
      btnUndoSolution.addEventListener('click', handleUndoSolution);
    }

    // 4. "Hazırlamaya Başla" / "Hazırlamayı Tamamla" Butonu Dinleyicisi
    if (btnStartPrep) {
      btnStartPrep.addEventListener('click', async () => {
        if (currentPrepScene === 1) {
          // Sahne 1'de: Kontrol listesi tamamlandıysa Sahne 2'ye (Çözelti Masası) geçiş
          const isStep1Done = !!hState.materialsDone;
          const isStep2Done = !!hState.workspaceDone;
          const isStep3Done = !!hState.labeled;

          if (!isStep1Done || !isStep2Done || !isStep3Done) {
            hToast('Lütfen önce kontrol listesindeki 3 görevin tamamını bitirin.', 'warn');
            return;
          }

          // 5. Kural: Merkezi Geçiş Uyarı Penceresi (Çözelti Masasına Yönlendiriliyorsunuz...)
          if (hState.busy) return;
          hState.busy = true;

          const transitionOverlay = document.getElementById('stage-transition-overlay');
          const transFill = document.getElementById('trans-progress-fill');
          if (transitionOverlay) {
            transitionOverlay.classList.add('is-active');
            transitionOverlay.removeAttribute('aria-hidden');
            if (transFill) {
              transFill.style.width = '0%';
              void transFill.offsetWidth;
              transFill.style.width = '100%';
            }
          }

          if (audioStatusLabel) {
            audioStatusLabel.textContent = 'ÇÖZELTİ MASASINA YÖNLENDİRİLİYORSUNUZ...';
          }
          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = 'Kontrol listesi doğrulandı. Çözelti masasına yönlendiriliyorsunuz...';
            avatarSpeechBubble.classList.add('visible');
          }

          setTimeout(() => {
            if (transitionOverlay) {
              transitionOverlay.classList.remove('is-active');
              transitionOverlay.setAttribute('aria-hidden', 'true');
            }
            hState.busy = false;
            setPrepScene(2);
            hToast('Çözelti masasına geçildi. Adımları sırayla uygulayın.', 'info');
          }, 1800);
        } else if (currentPrepScene === 2) {
          // Sahne 2'de: "Hazırlamayı Tamamla" butonu
          if (window.solutionLabState && window.solutionLabState.isPrepared) {
            openSolutionCompleteModal(window.solutionLabState);
            return;
          }

          // 1. İki malzemenin eklenip karıştırıldığını (3 işlemin de bittiğini) kontrol et
          const missingSteps = [];
          if (!solutionStepState.jarAdded) missingSteps.push("Madde A'yı Ekle");
          if (!solutionStepState.waterAdded) missingSteps.push("Saf Suyu Ekle");
          if (!solutionStepState.stirred) missingSteps.push("Karıştır");

          // İşlem eksikse: Öğrenci aynı ekranda kalmalı ve eksik kalan adım (veya adımlar) ekranda bir mesajla belirtilmelidir.
          if (missingSteps.length > 0) {
            const missingText = missingSteps.join(', ');
            hReplayClass(btnStartPrep, 'is-shake');
            hToast('Eksik işlem: ' + missingText + ' adımını tamamlamalısın.', 'warn');
            if (avatarSpeechBubble && avatarSpeechText) {
              avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
              avatarSpeechText.textContent = 'Çözelti hazırlama henüz tamamlanmadı! Eksik adımlar: ' + missingText + '.';
              avatarSpeechBubble.classList.add('visible');
            }
            return;
          }

          // İşlem tamamsa:
          if (hState.busy) return busyHint();
          const id = hRunId;
          hState.busy = true;
          try {
            // Bir önceki sahnede hazırlanan ve bellekte tutulan "Madde A çözeltisi" etiketi SVG beherin üzerine yapıştırılmalıdır.
            const customLabel = hState.customLabelText || 'Madde A Çözeltisi';
            if (beakerLabelCustomText) {
              beakerLabelCustomText.textContent = customLabel;
            }
            await runLabelAnimation();
            if (hEl.label) {
              hEl.label.style.opacity = '1';
              hEl.label.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
            }

            hFlash([hItems.beaker], 'is-glow-green', 2500);

            // Sonuç mesajı: "Çözelti hazırlandı. Kabın etiketi tamamlandı."
            const completeMsg = 'Çözelti hazırlandı. Kabın etiketi tamamlandı.';
            hToast('✓ ' + completeMsg, 'success');

            if (audioStatusLabel) {
              audioStatusLabel.textContent = 'ÇÖZELTİ HAZIRLANDI. KABIN ETİKETİ TAMAMLANDI.';
            }
            if (avatarSpeechBubble && avatarSpeechText) {
              avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
              avatarSpeechText.textContent = completeMsg + ' Sıradaki aşama olan "Numuneyi İncele" görevine geçebilirsin.';
              avatarSpeechBubble.classList.add('visible');
            }

            // State kalıcı olarak saklanır ve korunur
            const labState = {
              isPrepared: true,
              labelText: customLabel,
              substanceAdded: true,
              waterAdded: true,
              stirred: true,
              stage: 'sample_inspection_ready',
              containerType: 'beaker_with_label',
              completedAt: new Date().toISOString()
            };
            window.solutionLabState = labState;
            try {
              localStorage.setItem('vardiya_solution_lab_state', JSON.stringify(labState));
            } catch (err) {
              console.warn('Storage saving error:', err);
            }

            updateUndoButtonState();
            openSolutionCompleteModal(labState);
          } catch (e) {
            if (e !== H_ABORT) console.error(e);
          } finally {
            if (id === hRunId) hState.busy = false;
          }
        } else if (currentPrepScene === 3) {
          // SAHNE 3: "Görevi Tamamla" Butonu
          const allDone = stage3State.transfer && stage3State.sample && stage3State.cleanup;
          if (!allDone) {
            hReplayClass(btnStartPrep, 'is-shake');
            hToast('Lütfen sağ paneldeki 3 görevi tamamlayın.', 'warn');
            if (avatarSpeechBubble && avatarSpeechText) {
              avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
              avatarSpeechText.textContent = 'Görevi tamamlamadan önce sağ paneldeki tüm adımları yapmalısın.';
              avatarSpeechBubble.classList.add('visible');
            }
            return;
          }
          // [Etkileşim 2: Sahne Geçişi]
          // Tetikleyici: Ekrandaki "Görevi tamamla" butonuna tıklanması.
          // Eylem: Aktif sahne kapatılarak "Numuneyi İncele" adlı yeni laboratuvar sahnesine geçiş yapılsın.
          setPrepScene(4);
        } else if (currentPrepScene === 4) {
          // SAHNE 4: "İncelemeye Başla" Butonu
          const allDone = stage4State.step1 && stage4State.step2 && stage4State.step3;
          if (!allDone) {
            hReplayClass(btnStartPrep, 'is-shake');
            hToast('Lütfen sağ paneldeki 3 adımı tamamlayın.', 'warn');
            if (avatarSpeechBubble && avatarSpeechText) {
              avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
              avatarSpeechText.textContent = 'İncelemeye başlamadan önce sağ paneldeki seçimleri tamamlamalısın.';
              avatarSpeechBubble.classList.add('visible');
            }
            return;
          }

          // =========================================================================
          // [BÖLÜM 2: "İncelemeye Başla" Etkileşimi ve Zaman Ayarlı Sahne Geçişi]
          // =========================================================================
          // Eylem 1 (Ekran Güncellemesi): Butona basıldığı an, analiz cihazının üzerindeki dijital ekranda "İncelemeye Başlıyor..." metni belirtsin.
          setDeviceScreenState('starting');
          if (audioStatusLabel) {
            audioStatusLabel.textContent = 'İNCELENİYOR: ANALİZ BAŞLIYOR...';
          }
          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = 'Analiz cihazı çalıştırıldı, numune inceleniyor...';
            avatarSpeechBubble.classList.add('visible');
          }

          // Eylem 2 (Gecikme/Delay): Ekranda bu yazı belirdikten sonra sisteme kısa bir bekleme süresi (1.8 saniye) eklensin.
          await hWait(1800);

          // Eylem 3 (Sahne Geçişi): Bekleme süresi sona erdiğinde, mevcut sahne kapatılarak "inceleme2" (Analiz 2) adlı yeni sahneye geçiş yapılsın.
          const overlay = document.getElementById('scene-dissolve-overlay');
          if (overlay) {
            overlay.classList.add('is-active');
            await hWait(550);
          }
          // Sahne Tanımı: "inceleme2" & Arka Plan: analizalani.png
          setPrepScene('inceleme2');
          if (overlay) {
            await hWait(150);
            overlay.classList.remove('is-active');
          }
        } else if (currentPrepScene === 'inceleme2') {
          // SAHNE İNCELEME2: "Sonraki Göreve Geç" Butonu
          // [Bölüm 1: Sahne Geçişi ve Üst Bilgi]
          // Tetikleyici: inceleme2 sahnesinde yer alan "Sonraki Göreve Geç" butonuna tıklanması.
          // Eylem: Mevcut sahne kapatılarak "Yüzeyi Temizle" adlı yeni bir sahneye geçiş yapılsın.
          const overlay = document.getElementById('scene-dissolve-overlay');
          if (overlay) {
            overlay.classList.add('is-active');
            await hWait(550);
          }
          setPrepScene('yuzeyi-temizle');
          if (overlay) {
            await hWait(150);
            overlay.classList.remove('is-active');
          }
        } else if (currentPrepScene === 'yuzeyi-temizle') {
          // SAHNE: YÜZEYİ TEMİZLE: "Temizliğe Başla" Butonu
          hToast('✓ Temizlik protokolü başlatıldı. Yüzey temizleme adımlarını uygulayın.', 'info');
          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = 'Harika! Malzemeleri kaldırıp onaylı temizleyici ile yüzeyi temizleyebilirsin.';
            avatarSpeechBubble.classList.add('visible');
          }
        }
      });
    }

    // YÜZEYİ TEMİZLE SAHNESİ: 3 Buton Dinleyicileri
    if (btnCleanStep1) {
      btnCleanStep1.addEventListener('click', () => {
        cleanSurfaceState.step1 = !cleanSurfaceState.step1;
        btnCleanStep1.classList.toggle('is-done', cleanSurfaceState.step1);
        if (cleanSurfaceState.step1) {
          hToast('✓ 1. Adım: Malzemeler güvenli saklama alanına kaldırılıyor.', 'success');
        } else {
          hToast('↺ 1. Adım seçimi geri alındı.', 'info');
        }
      });
    }

    if (btnCleanStep2) {
      btnCleanStep2.addEventListener('click', () => {
        cleanSurfaceState.step2 = !cleanSurfaceState.step2;
        btnCleanStep2.classList.toggle('is-done', cleanSurfaceState.step2);
        if (cleanSurfaceState.step2) {
          hToast('✓ 2. Adım: Onaylı yüzey temizleyici seçildi.', 'success');
        } else {
          hToast('↺ 2. Adım seçimi geri alındı.', 'info');
        }
      });
    }

    if (btnCleanStep3) {
      btnCleanStep3.addEventListener('click', () => {
        cleanSurfaceState.step3 = !cleanSurfaceState.step3;
        btnCleanStep3.classList.toggle('is-done', cleanSurfaceState.step3);
        if (cleanSurfaceState.step3) {
          hToast('✓ 3. Adım: Mikrofiber temizlik bezi ile yüzey temizleniyor.', 'success');
        } else {
          hToast('↺ 3. Adım seçimi geri alındı.', 'info');
        }
      });
    }

    if (startPrepContainer) {
      startPrepContainer.addEventListener('click', () => {
        if (btnStartPrep && (btnStartPrep.hasAttribute('disabled') || btnStartPrep.classList.contains('is-disabled'))) {
          if (currentPrepScene === 1) {
            hToast('Lütfen önce kontrol listesindeki 3 görevin tamamını bitirin.', 'warn');
          } else if (currentPrepScene === 3) {
            hToast('Lütfen sağ paneldeki 3 görevi tamamlayın.', 'warn');
          } else if (currentPrepScene === 4) {
            hToast('Lütfen sağ paneldeki 3 yeni adımı tamamlayın.', 'warn');
          }
        }
      });
    }

    // 5. "Görev Planını Gör" / "Önceki Ekran" / "Önceki İşleme Dön" Butonu Dinleyicileri
    if (btnViewTaskPlan) {
      btnViewTaskPlan.addEventListener('click', () => {
        if (currentPrepScene === 4 || currentPrepScene === 'inceleme2') {
          // 4. Sahnede veya inceleme2'de "Görev Planını Gör"
          openTaskPlanModal();
        } else if (currentPrepScene === 3) {
          // 3. Sahneden 2. Sahneye (Önceki İşleme Dön) Geri Dön
          resetStage3State();
          setPrepScene(2);
          hToast('Önceki işleme dönüldü. Çözelti Hazırlama masasındasınız.', 'info');
        } else if (currentPrepScene === 2) {
          // 2. Sahneden 1. Sahneye (Önceki Ekran) Geri Dön
          resetSolutionPrepState();
          setPrepScene(1);
        } else {
          // 1. Sahnede Plan Modalını Aç
          openTaskPlanModal();
        }
      });
    }

    // 6. SAHNE 3 ANİMASYON VE BUTON DİNLEYİCİLERİ

    function showStage3Stream(streamPathD, strokeColor) {
      if (stage3LiquidStream && stage3LiquidStreamFlow) {
        stage3LiquidStream.setAttribute('d', streamPathD);
        stage3LiquidStreamFlow.setAttribute('d', streamPathD);
        const color = strokeColor || (currentSolutionColor ? currentSolutionColor.stroke : '#7dd3fc');
        stage3LiquidStream.style.stroke = color;
        stage3LiquidStream.style.display = 'inline';
        stage3LiquidStreamFlow.style.display = 'inline';
        stage3LiquidStream.style.opacity = '1';
        stage3LiquidStreamFlow.style.opacity = '1';
        stage3LiquidStreamFlow.classList.add('is-flowing');
      }
    }

    function hideStage3Stream() {
      if (stage3LiquidStream && stage3LiquidStreamFlow) {
        stage3LiquidStreamFlow.classList.remove('is-flowing');
        stage3LiquidStream.style.display = 'none';
        stage3LiquidStream.style.opacity = '0';
        stage3LiquidStreamFlow.style.display = 'none';
        stage3LiquidStreamFlow.style.opacity = '0';
      }
    }

    // =========================================================================
    // 1. BEHERDEN MADDE A ÇÖZELTİSİ ŞİŞESİNE AKTARIM VE ETİKETLEME SEKANSI
    // =========================================================================
    async function runStage3TransferAnimation() {
      if (stage3State.animating) return;
      stage3State.animating = true;
      hToast('Beherden Madde A Çözeltisi şişesine aktarılıyor…', 'info');

      try {
        // --- Adım 1: Madde A Çözeltisi şişesinin kapağı yukarı doğru açılarak kalkar ---
        if (mediumBottleCap) {
          await hTween(mediumBottleCap, [
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 },
            { transform: 'translate3d(0px, -34px, 0px)', opacity: 0 }
          ], 400, { easing: 'cubic-bezier(.42,0,.28,1)' });
        }

        // --- Adım 2: Dinamik koordinat ve hassas rota hesabı (Hedef: Madde A Çözeltisi şişesinin ağzı) ---
        const pourData = calculatePourTransforms(hItems.beaker, itemMediumBottle, {
          angleDeg: 58,
          liftExtra: 35,
          sourceType: 'beaker'
        });

        // --- Adım 3: Beher başlangıç noktasından havaya kalkar ve Madde A şişesinin ağzına doğru eğilir ---
        // (Sıvı Yerçekimi Simülasyonu: Beher +58deg eğilirken, içindeki sıvı zıt yönde -58deg dönerek yatay kalır)
        const tiltBeaker = [
          hTween(hItems.beaker, [
            { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
            { transform: pourData.lift, offset: 0.45 },
            { transform: pourData.pour }
          ], 1100, { easing: 'cubic-bezier(.42,0,.28,1)' })
        ];

        if (hEl.beakerFill) {
          tiltBeaker.push(hTween(hEl.beakerFill, [
            { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
            { transform: 'translate3d(14px, -18px, 0px) rotate(-58deg)' }
          ], 1100, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        await Promise.all(tiltBeaker);

        // Dökme anında eğilmiş beherin ağzının (spout) ve hedef şişenin gerçek ekran/SVG koordinatlarını dinamik ölç:
        const beakerStream = getPourStreamPath('beakerSpoutMarker', 'mediumBottleMouthMarker', 345, { x: 668, y: 186 }, { x: 680, y: 216 });

        // --- Adım 4: Dinamik sıvı akış (stream) çizgisi beherin ağzından hedef şişeye doğru uzar ---
        showStage3Stream(beakerStream.pathD, currentSolutionColor.stroke);
        await hTween(stage3LiquidStream, [{ strokeDashoffset: 1, opacity: 0.8 }, { strokeDashoffset: 0, opacity: 1 }], 240, { easing: 'ease-in' });

        // --- Adım 5: Akış çizgisi hedefe ulaştıktan hemen sonra sıvı seviyeleri eş zamanlı değişir ---
        // Renk senkronizasyonu: Numune kabı ve şişe beherin çözelti rengini alır
        updateTargetSolutionColors();
        const transferLiquids = [];

        if (hEl.beakerFill) {
          transferLiquids.push(hTween(hEl.beakerFill, [
            { transform: 'translate3d(14px, -18px, 0px) rotate(-58deg)', opacity: 1 },
            { transform: 'translate3d(14px, 110px, 0px) rotate(-58deg)', opacity: 0 }
          ], 1300, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        if (mediumBottleLiquid) {
          mediumBottleLiquid.style.opacity = '1';
          transferLiquids.push(hTween(mediumBottleLiquid, [
            { transform: 'translate3d(0px, 90px, 0px) rotate(0deg)', opacity: 0.2 },
            { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)', opacity: 1 }
          ], 1300, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        await Promise.all(transferLiquids);

        // Sıvı son durumlarını kesinleştir
        if (hEl.beakerFill) {
          hEl.beakerFill.style.transform = 'translate3d(14px, 110px, 0px) rotate(-58deg)';
          hEl.beakerFill.style.opacity = '0';
        }
        if (mediumBottleLiquid) {
          mediumBottleLiquid.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
          mediumBottleLiquid.style.opacity = '1';
        }

        // --- Adım 6: Sıvı akış çizgisi anında geri çekilerek sonlanır ---
        await hTween(stage3LiquidStream, [{ strokeDashoffset: 0, opacity: 1 }, { strokeDashoffset: -1, opacity: 0 }], 180, { easing: 'ease-out' });
        hideStage3Stream();

        // --- Adım 7: Geri Dönüş - Beher doğrulur ve kendi orijinal konumuna pürüzsüzce geri döner ---
        // (Sıvı Yerçekimi Simülasyonu: Beher doğrulurken sıvı alanı da 0deg yatay konuma geri döner)
        const returnBeaker = [
          hTween(hItems.beaker, [
            { transform: pourData.pour },
            { transform: pourData.lift, offset: 0.45 },
            { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' }
          ], 1000, { easing: 'cubic-bezier(.42,0,.28,1)' })
        ];

        if (hEl.beakerFill) {
          returnBeaker.push(hTween(hEl.beakerFill, [
            { transform: 'translate3d(14px, 110px, 0px) rotate(-58deg)' },
            { transform: 'translate3d(0px, 98px, 0px) rotate(0deg)' }
          ], 1000, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        await Promise.all(returnBeaker);

        if (hItems.beaker) {
          hItems.beaker.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (hEl.beakerFill) {
          hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px) rotate(0deg)';
          hEl.beakerFill.style.opacity = '0';
        }

        // --- Adım 8: Madde A Çözeltisi şişesinin kapağı aşağı inerek sıkıca kapanır ---
        if (mediumBottleCap) {
          await hTween(mediumBottleCap, [
            { transform: 'translate3d(0px, -34px, 0px)', opacity: 0 },
            { transform: 'translate3d(0px, -6px, 0px)', opacity: 1, offset: 0.7 },
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 }
          ], 450, { easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' });
          mediumBottleCap.style.transform = 'translate3d(0px, 0px, 0px)';
          mediumBottleCap.style.opacity = '1';
        }

        // --- Adım 9: Etiketleme Şartı (Kapak kapandıktan hemen sonra etiket yapışır) ---
        await hWait(180);
        if (mediumBottleLabel) {
          mediumBottleLabel.style.opacity = '1';
          mediumBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
          mediumBottleLabel.classList.add('is-stamped');
          hReplayClass(mediumBottleLabel, 'is-pop');
        }

        hToast('✓ Çözelti şişeye aktarıldı, kapak kapatıldı ve etiket yapıştırıldı.', 'success');
      } catch (err) {
        console.warn('Transfer animasyonu hatası:', err);
      } finally {
        hideStage3Stream();
        if (hItems.beaker) {
          hItems.beaker.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (hEl.beakerFill && hEl.beakerFill.style.opacity === '0') {
          hEl.beakerFill.style.transform = 'translate3d(0px, 98px, 0px) rotate(0deg)';
        }
        stage3State.animating = false;
      }
    }

    // =========================================================================
    // 2. MADDE A'DAN NUMUNE KABINA BOŞALTMA VE ETİKETLEME SEKANSI
    // =========================================================================
    async function runStage3SampleAnimation() {
      if (stage3State.animating) return;
      stage3State.animating = true;
      hToast('Madde A Çözeltisi şişesinden Numune Kabına aktarılıyor…', 'info');

      try {
        // --- Adım 1: Her iki şişenin kapağı da yukarı doğru açılarak kalkar ---
        const openCaps = [];
        if (mediumBottleCap) {
          openCaps.push(hTween(mediumBottleCap, [
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 },
            { transform: 'translate3d(0px, -34px, 0px)', opacity: 0 }
          ], 380, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }
        if (sampleCap) {
          sampleCap.style.opacity = '1';
          openCaps.push(hTween(sampleCap, [
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 },
            { transform: 'translate3d(0px, -30px, 0px)', opacity: 0 }
          ], 380, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }
        await Promise.all(openCaps);

        // --- Adım 2: Dinamik koordinat ve hassas dökme rotası hesabı ---
        // Şişe sağdaki numune kabına doğru 68deg açı ile eğilir
        const samplePourData = calculatePourTransforms(itemMediumBottle, itemSampleBottle, {
          angleDeg: 68,
          liftExtra: 35,
          sourceType: 'mediumBottle'
        });

        // --- Adım 3: Madde A şişesi havaya kalkar ve ağzı numune kabının tam üzerine eğilir ---
        // (Sıvı Yerçekimi Simülasyonu: Şişe +68deg eğilirken, içindeki sıvı zıt yönde -68deg dönerek yatay kalır)
        const tiltMediumBottle = [
          hTween(itemMediumBottle, [
            { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
            { transform: samplePourData.lift, offset: 0.45 },
            { transform: samplePourData.pour }
          ], 1050, { easing: 'cubic-bezier(.42,0,.28,1)' })
        ];

        if (mediumBottleLiquid) {
          tiltMediumBottle.push(hTween(mediumBottleLiquid, [
            { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
            { transform: 'translate3d(12px, -15px, 0px) rotate(-68deg)' }
          ], 1050, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        await Promise.all(tiltMediumBottle);

        // Dökme pozisyonundayken şişenin sağ dudağının ve hedef numune kabının gerçek koordinatlarını dinamik ölç:
        const sampleStream = getPourStreamPath('mediumBottleLipRight', 'sampleBottleMouthMarker', 342, { x: 752, y: 236 }, { x: 764, y: 266 });

        // --- Adım 4: Sıvı akış çizgisi (pourStream) görünür olur (opacity: 1) ve hedef kaba doğru uzar ---
        showStage3Stream(sampleStream.pathD, currentSolutionColor.stroke);
        await hTween(stage3LiquidStream, [{ strokeDashoffset: 1, opacity: 0.8 }, { strokeDashoffset: 0, opacity: 1 }], 240, { easing: 'ease-in' });

        // --- Adım 5: Akış çizgisi hedefe ulaştıktan hemen sonra sıvı hacimleri eş zamanlı ve orantılı değişir ---
        updateTargetSolutionColors();
        const exchangeLiquids = [];

        if (mediumBottleLiquid) {
          exchangeLiquids.push(hTween(mediumBottleLiquid, [
            { transform: 'translate3d(12px, -15px, 0px) rotate(-68deg)' },
            { transform: 'translate3d(12px, 12px, 0px) rotate(-68deg)' }
          ], 1200, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        if (sampleBottleLiquid) {
          sampleBottleLiquid.style.transformOrigin = 'bottom center';
          sampleBottleLiquid.style.transformBox = 'fill-box';
          sampleBottleLiquid.style.opacity = '1';
          exchangeLiquids.push(hTween(sampleBottleLiquid, [
            { transform: 'scaleY(0)', opacity: 0.4 },
            { transform: 'scaleY(1)', opacity: 1 }
          ], 1200, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        await Promise.all(exchangeLiquids);

        if (mediumBottleLiquid) {
          mediumBottleLiquid.style.transform = 'translate3d(12px, 12px, 0px) rotate(-68deg)';
        }
        if (sampleBottleLiquid) {
          sampleBottleLiquid.style.transform = 'scaleY(1)';
          sampleBottleLiquid.style.opacity = '1';
        }

        // --- Adım 6: Dökme bittiğinde akış çizgisi anında kaybolur ---
        await hTween(stage3LiquidStream, [{ strokeDashoffset: 0, opacity: 1 }, { strokeDashoffset: -1, opacity: 0 }], 180, { easing: 'ease-out' });
        hideStage3Stream();

        // --- Adım 7: Geri Dönüş - Madde A şişesi doğrulur ve eski orijinal yerine geri döner ---
        // (Sıvı Yerçekimi Simülasyonu: Şişe doğrulurken sıvı da -68deg'den 0deg yatay duruma geri döner)
        const returnMediumBottle = [
          hTween(itemMediumBottle, [
            { transform: samplePourData.pour },
            { transform: samplePourData.lift, offset: 0.45 },
            { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' }
          ], 950, { easing: 'cubic-bezier(.42,0,.28,1)' })
        ];

        if (mediumBottleLiquid) {
          returnMediumBottle.push(hTween(mediumBottleLiquid, [
            { transform: 'translate3d(12px, 12px, 0px) rotate(-68deg)' },
            { transform: 'translate3d(0px, 14px, 0px) rotate(0deg)' }
          ], 950, { easing: 'cubic-bezier(.42,0,.28,1)' }));
        }

        await Promise.all(returnMediumBottle);

        if (itemMediumBottle) {
          itemMediumBottle.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
        }
        if (mediumBottleLiquid) {
          mediumBottleLiquid.style.transform = 'translate3d(0px, 14px, 0px) rotate(0deg)';
        }

        // --- Adım 8: Kapak Kapatma Animasyonu - Her iki şişenin kapağı da aşağı inerek yerine oturur ---
        const closeCaps = [];
        if (mediumBottleCap) {
          closeCaps.push(hTween(mediumBottleCap, [
            { transform: 'translate3d(0px, -34px, 0px)', opacity: 0 },
            { transform: 'translate3d(0px, -6px, 0px)', opacity: 1, offset: 0.7 },
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 }
          ], 450, { easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' }));
        }

        if (sampleCap) {
          sampleCap.style.opacity = '1';
          sampleCap.classList.add('is-closed');
          closeCaps.push(hTween(sampleCap, [
            { transform: 'translate3d(0px, -30px, 0px)', opacity: 0 },
            { transform: 'translate3d(0px, -6px, 0px)', opacity: 1, offset: 0.7 },
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 }
          ], 450, { easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' }));
        }

        await Promise.all(closeCaps);
        if (mediumBottleCap) {
          mediumBottleCap.style.transform = 'translate3d(0px, 0px, 0px)';
          mediumBottleCap.style.opacity = '1';
        }
        if (sampleCap) {
          sampleCap.style.transform = 'translate3d(0px, 0px, 0px)';
          sampleCap.style.opacity = '1';
        }

        // --- Adım 9: Numune kabı etiketi belirir ve yapışır ---
        await hWait(150);
        if (sampleBottleLabel) {
          sampleBottleLabel.style.opacity = '1';
          sampleBottleLabel.style.transform = 'translate3d(0px, 0px, 0px)';
          sampleBottleLabel.classList.add('is-stamped');
          const texts = sampleBottleLabel.querySelectorAll('text');
          if (texts.length >= 3) {
            texts[0].textContent = 'Numune';
            texts[1].textContent = 'Madde A';
            texts[2].textContent = 'Çözeltisi';
          }
          hReplayClass(sampleBottleLabel, 'is-pop');
        }

        hToast('✓ Numune kabına çözelti aktarıldı, kapaklar kapatıldı ve etiketlendi.', 'success');
      } catch (err) {
        console.warn('Numune ayırma animasyon hatası:', err);
      } finally {
        hideStage3Stream();
        stage3State.animating = false;
      }
    }

    if (btnStage3Transfer) {
      btnStage3Transfer.addEventListener('click', async () => {
        if (stage3State.transfer || stage3State.animating) return;
        btnStage3Transfer.classList.add('is-done');
        hReplayClass(btnStage3Transfer, 'is-pop');
        await runStage3TransferAnimation();
        stage3State.transfer = true;
        checkStage3Completed();
      });
    }

    if (btnStage3Sample) {
      btnStage3Sample.addEventListener('click', async () => {
        if (stage3State.sample || stage3State.animating) return;

        // [Bölüm 1: Çözeltiyi Hazırla Ekranı - Hata Düzeltme]
        // Kısıtlama: Beherden şişeye sıvı aktarımı tamamlanmadan numune ayrılamaz
        if (!stage3State.transfer) {
          hReplayClass(btnStage3Sample, 'is-shake');
          hToast('Önce "Çözeltiyi Aktar ve Etiketle" adımını tamamlamalısın! Çözelti şişeye aktarılmadan numune ayrılamaz.', 'warn');
          if (audioStatusLabel) {
            audioStatusLabel.textContent = 'UYARI: ÖNCE ÇÖZELTİ AKTARIMINI TAMAMLAYIN!';
          }
          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = 'Önce çözeltiyi reaktif şişesine aktarmalı ve etiketlemelisin. Sıvı aktarılmadan numune kabına ayrılamaz!';
            avatarSpeechBubble.classList.add('visible');
          }
          return;
        }

        btnStage3Sample.classList.add('is-done');
        hReplayClass(btnStage3Sample, 'is-pop');
        await runStage3SampleAnimation();
        stage3State.sample = true;
        checkStage3Completed();
      });
    }

    if (btnStage3Cleanup) {
      btnStage3Cleanup.addEventListener('click', () => {
        if (stage3State.cleanup || stage3State.animating) return;
        stage3State.cleanup = true;
        btnStage3Cleanup.classList.add('is-done');
        hReplayClass(btnStage3Cleanup, 'is-pop');
        if (transferArrowGroup) transferArrowGroup.style.display = 'none';

        // [Etkileşim 1: Malzemeleri Temizleme]
        // Tetikleyici: Sağ menüdeki "Malzemeleri kaldır" butonuna tıklanması.
        // Eylem: Çalışma tezgahı üzerindeki beher, saf su şişesi, karıştırma çubuğu, mevcut tepsi ve "Madde A" (katı) şişesi sahneden tamamen kaldırılsın/gizlensin.
        const toHide = [
          document.getElementById('itemBeakerWrap'),
          document.getElementById('itemWaterWrap'),
          document.getElementById('itemTrayWrap'),
          document.getElementById('itemJarWrap'),
          document.getElementById('itemWhitePadWrap')
        ];
        toHide.forEach((el) => {
          if (el) {
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            setTimeout(() => {
              el.style.display = 'none';
            }, 400);
          }
        });
        const tableLabels = document.querySelectorAll('#table g[font-size] text');
        tableLabels.forEach((t) => {
          if (t.id !== 'tableLabelMedium' && t.id !== 'tableLabelSample') {
            t.style.display = 'none';
          }
        });

        hToast('✓ Çalışma tezgahı üzerindeki beher, saf su şişesi, karıştırma çubuğu, tepsi ve Madde A şişesi kaldırıldı.', 'success');
        checkStage3Completed();
      });
    }

    // =========================================================================
    // 7. SAHNE 4: "NUMUNEYİ İNCELE" BUTON VE ETKİLEŞİM DİNLEYİCİLERİ
    // =========================================================================

    // --- BÖLÜM 3: "Numune Kabını Seç" Etkileşimi, Yeni Ekran ve Koşullar ---
    // Eylem 1 (Yeni Seçim Ekranı): Butona tıklandığında şişeler doğrudan tepside belirmek yerine,
    // ana sahnenin üzerinde ayrı bir seçim ekranı (pop-up/modal pencere) açılsın.
    function openBottleSelectModal() {
      if (bottleSelectModalBackdrop) {
        bottleSelectModalBackdrop.classList.add('is-open');
        bottleSelectModalBackdrop.removeAttribute('aria-hidden');
      }
    }

    function closeBottleSelectModal() {
      if (bottleSelectModalBackdrop) {
        bottleSelectModalBackdrop.classList.remove('is-open');
        bottleSelectModalBackdrop.setAttribute('aria-hidden', 'true');
      }
    }

    // Tetikleyici: Sağ menüdeki "Numune Kabını Seç" butonuna tıklanması
    if (btnStage4Step1) {
      btnStage4Step1.addEventListener('click', () => {
        openBottleSelectModal();
      });
    }

    if (btnCloseBottleModal) {
      btnCloseBottleModal.addEventListener('click', closeBottleSelectModal);
    }

    if (bottleSelectModalBackdrop) {
      bottleSelectModalBackdrop.addEventListener('click', (e) => {
        if (e.target === bottleSelectModalBackdrop) {
          closeBottleSelectModal();
        }
      });
    }

    // Koşul A (Su Lekeli/Pis Şişe Seçimi): Kullanıcı açılan ekrandan su lekeli şişeyi seçerse
    function handleDirtyBottleSelect() {
      closeBottleSelectModal();

      // Seçilen su lekeli şişe tepside görünür olsun
      if (traySampleBottle2) {
        traySampleBottle2.style.display = 'inline';
        traySampleBottle2.classList.add('is-selected-dirty');
        hReplayClass(traySampleBottle2, 'is-shake');
      }
      if (traySampleBottle1) {
        traySampleBottle1.style.display = 'none';
        traySampleBottle1.classList.remove('is-selected');
      }

      // Sistem, "Malzeme seç" adımındaki "Etiketsiz Reaktif Şişesi" için kullanılan kırmızı renkli uyarı arayüzünü (UI)
      // ve animasyonunu birebir aynı şekilde tetiklesin.
      if (stage4AlertText) {
        stage4AlertText.textContent = 'Bu kaptaki kalıntı numuneyi etkileyebilir. İnceleme için temiz kap seç';
      }
      if (stage4AlertBanner) {
        stage4AlertBanner.classList.remove('is-active');
        void stage4AlertBanner.offsetWidth;
        stage4AlertBanner.classList.add('is-active');
      }

      // Ekranda şu uyarı metni çıksın: "Bu kaptaki kalıntı numuneyi etkileyebilir. İnceleme için temiz kap seç"
      // Uyarıya rağmen kullanıcının bu seçimi sisteme işlensin/kabul edilsin
      stage4State.selectedBottle = 'dirty';

      // Kritik Kural: Yapılan seçim kusurlu olduğu için, sağ menüdeki "Numune Kabını Seç" butonunun rengi yeşil YAPILMASIN (varsayılan renginde/durumunda kalsın).
      stage4State.step1 = false;
      if (btnStage4Step1) {
        btnStage4Step1.classList.remove('is-done');
        hReplayClass(btnStage4Step1, 'is-shake');
      }

      hToast('HATA: Bu kaptaki kalıntı numuneyi etkileyebilir. İnceleme için temiz kap seç', 'warn');
      if (audioStatusLabel) {
        audioStatusLabel.textContent = 'KONTAMİNASYON RİSKİ: SU LEKELİ KAP SEÇİLDİ!';
      }
      if (avatarSpeechBubble && avatarSpeechText) {
        avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
        avatarSpeechText.textContent = 'Bu kaptaki kalıntı numuneyi etkileyebilir. İnceleme için temiz kap seç';
        avatarSpeechBubble.classList.add('visible');
      }
      checkStage4Completed();
    }

    // Koşul B (Temiz Şişe Seçimi): Kullanıcı açılan ekrandan temiz şişeyi seçerse
    function handleCleanBottleSelect() {
      closeBottleSelectModal();

      // Temiz şişe tepside görünür olsun
      if (traySampleBottle1) {
        traySampleBottle1.style.display = 'inline';
        traySampleBottle1.classList.add('is-selected');
        hReplayClass(traySampleBottle1, 'is-pop');
      }
      if (traySampleBottle2) {
        traySampleBottle2.style.display = 'none';
        traySampleBottle2.classList.remove('is-selected-dirty');
      }

      // Kırmızı uyarı kutusunu gizle
      if (stage4AlertBanner) {
        stage4AlertBanner.classList.remove('is-active');
      }

      // Seçim başarılı ve hatasız olarak sisteme uygulansın, sağ menüdeki "Numune Kabını Seç" butonu yeşil renge dönsün
      stage4State.selectedBottle = 'clean';
      stage4State.step1 = true;
      if (btnStage4Step1) {
        btnStage4Step1.classList.add('is-done');
        hReplayClass(btnStage4Step1, 'is-pop');
      }

      hToast('✓ Temiz ve steril numune kabı başarıyla seçildi.', 'success');
      if (avatarSpeechBubble && avatarSpeechText) {
        avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
        avatarSpeechText.textContent = 'Tebrikler! Temiz numune kabını seçtin. Şimdi 2. adımda analiz alanını belirleyelim.';
        avatarSpeechBubble.classList.add('visible');
      }
      checkStage4Completed();
    }

    if (bCardClean) {
      bCardClean.addEventListener('click', handleCleanBottleSelect);
    }

    if (bCardDirty) {
      bCardDirty.addEventListener('click', handleDirtyBottleSelect);
    }

    // Tepsi üzerindeki şişelere tıklandığında da modal açılsın
    if (traySampleBottle1) {
      traySampleBottle1.addEventListener('click', () => {
        if (currentPrepScene === 4) openBottleSelectModal();
      });
    }

    if (traySampleBottle2) {
      traySampleBottle2.addEventListener('click', () => {
        if (currentPrepScene === 4) openBottleSelectModal();
      });
    }

    // --- BÖLÜM 4: "Analiz Alanını Seç" Etkileşimi ve Hotspot (Tıklanabilir Alan) Kurgusu ---
    // Tetikleyici: Sağ menüdeki "Analiz Alanını Seç" butonuna tıklanması.
    // Eylem 1: Ekranın ortasında alansecimi.jpg görselini içeren bir pop-up (Modal) açılsın.
    function openAreaSelectModal() {
      if (areaSelectModalBackdrop) {
        areaSelectModalBackdrop.classList.add('is-open');
        areaSelectModalBackdrop.removeAttribute('aria-hidden');
      }
    }

    function closeAreaSelectModal() {
      if (areaSelectModalBackdrop) {
        areaSelectModalBackdrop.classList.remove('is-open');
        areaSelectModalBackdrop.setAttribute('aria-hidden', 'true');
      }
    }

    if (btnStage4Step2) {
      btnStage4Step2.addEventListener('click', () => {
        openAreaSelectModal();
      });
    }

    if (btnCloseAreaModal) {
      btnCloseAreaModal.addEventListener('click', closeAreaSelectModal);
    }

    if (areaSelectModalBackdrop) {
      areaSelectModalBackdrop.addEventListener('click', (e) => {
        if (e.target === areaSelectModalBackdrop) {
          closeAreaSelectModal();
        }
      });
    }

    // Koşul A: Doğru Alan - Analiz Alanı Seçimi (Sol Taraf)
    if (hotspotCleanArea) {
      hotspotCleanArea.addEventListener('click', () => {
        closeAreaSelectModal();
        stage4State.step2 = true;
        if (btnStage4Step2) {
          btnStage4Step2.classList.add('is-done');
          hReplayClass(btnStage4Step2, 'is-pop');
        }
        if (cleanSampleTrayGroup) {
          cleanSampleTrayGroup.classList.add('is-glow-blue');
        }
        hToast('✓ 2. Adım: Analiz Alanı seçildi (Temiz çalışma alanı).', 'success');
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Harika! Temiz ve güvenli analiz alanını seçtin. Şimdi numuneyi yerleştirebilirsin.';
          avatarSpeechBubble.classList.add('visible');
        }
        checkStage4Completed();
      });
    }

    // Koşul B: Yanlış Alan - Dağınık Alan Seçimi (Sağ Taraf)
    if (hotspotMessyArea) {
      hotspotMessyArea.addEventListener('click', () => {
        closeAreaSelectModal();
        stage4State.step2 = false;
        if (btnStage4Step2) {
          btnStage4Step2.classList.remove('is-done');
          hReplayClass(btnStage4Step2, 'is-shake');
        }
        if (cleanSampleTrayGroup) {
          cleanSampleTrayGroup.classList.remove('is-glow-blue');
        }
        hToast('HATA: Dağınık alan analiz için uygun değildir. Analiz için temiz ve düzenli bir alan seçilmelidir!', 'warn');
        if (audioStatusLabel) {
          audioStatusLabel.textContent = 'ALAN SEÇİMİ HATASI: DAĞINIK ALAN UYGUN DEĞİL!';
        }
        if (avatarSpeechBubble && avatarSpeechText) {
          avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
          avatarSpeechText.textContent = 'Dağınık çalışma alanı analiz güvenliği için risklidir. Lütfen temiz ve düzenli olan Analiz Alanını seçin.';
          avatarSpeechBubble.classList.add('visible');
        }
        checkStage4Completed();
      });
    }

    // Masa üzerindeki tepsiye tıklandığında da modal açılsın
    if (cleanSampleTray) {
      cleanSampleTray.addEventListener('click', () => {
        if (currentPrepScene === 4) openAreaSelectModal();
      });
    }

    // =========================================================================
    // SAHNE 4: "NUMUNEYİ YERLEŞTİR" ETKİLEŞİMİ VE EYLEM DİZİLİMİ
    // [Bölüm 1: Sıvı aktarma animasyonu KESİNLİKLE kaldırılmıştır]
    // [Bölüm 2: 5 Eş Zamanlı Eylem (Gizleme, Sola Kayma, Yerleştirme, Temizlik, Analiz Cihazı)]
    // [Bölüm 3: 2 Saniyelik Bekleme (Delay Event) ve Odacığa Yerleşme Animasyonu]
    // =========================================================================
    if (btnStage4Step3) {
      btnStage4Step3.addEventListener('click', async () => {
        if (stage4State.animating) return;

        // Koşul B (Pis/Su Lekeli Şişe Seçilmişse - Engelleme ve Hata):
        if (stage4State.selectedBottle === 'dirty') {
          const errorMsg = 'Kirlilik riski! Sıvı aktarımı yapılamaz. Lütfen işlemi gerçekleştirmek için önce temiz bir numune kabı seçin.';
          if (stage4AlertText) {
            stage4AlertText.textContent = errorMsg;
          }
          if (stage4AlertBanner) {
            stage4AlertBanner.classList.remove('is-active');
            void stage4AlertBanner.offsetWidth;
            stage4AlertBanner.classList.add('is-active');
          }
          hReplayClass(btnStage4Step3, 'is-shake');
          if (traySampleBottle2) {
            hReplayClass(traySampleBottle2, 'is-shake');
          }
          hToast(errorMsg, 'warn');
          if (avatarSpeechBubble && avatarSpeechText) {
            avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
            avatarSpeechText.textContent = errorMsg;
            avatarSpeechBubble.classList.add('visible');
          }
          if (audioStatusLabel) {
            audioStatusLabel.textContent = 'KİRLİLİK RİSKİ: SEÇİM UYGUN DEĞİL!';
          }
          stage4State.step3 = false;
          btnStage4Step3.classList.remove('is-done');
          checkStage4Completed();
          return;
        }

        // Henüz hiçbir kap seçilmemişse
        if (!stage4State.selectedBottle) {
          hToast('Lütfen önce 1. adımdan Numune Kabını Seçin.', 'warn');
          hReplayClass(btnStage4Step3, 'is-shake');
          return;
        }

        // Koşul A (Temiz Şişe Seçilmişse - Başarılı İşlem):
        if (stage4State.selectedBottle === 'clean') {
          if (stage4State.step3) {
            hToast('✓ Numune zaten analiz cihazına yerleştirildi.', 'info');
            return;
          }

          stage4State.animating = true;

          // Kırmızı uyarı kutusunu gizle
          if (stage4AlertBanner) {
            stage4AlertBanner.classList.remove('is-active');
          }

          try {
            // =========================================================================
            // [BÖLÜM 2: EŞ ZAMANLI EYLEMLER - Butona basıldığı an gerçekleşecekler]
            // =========================================================================

            // 1. Gizleme: Çalışma tezgahı üzerinde duran büyük "Madde A Çözeltisi" şişesi sahneden kaldırılsın/gizlensin
            if (itemMediumBottle) {
              itemMediumBottle.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              itemMediumBottle.style.opacity = '0';
              itemMediumBottle.style.transform = 'translate(-540px, 15px)';
              setTimeout(() => {
                itemMediumBottle.style.display = 'none';
              }, 350);
            }
            if (tableLabelMedium) {
              tableLabelMedium.style.display = 'none';
            }

            // 2. Hareket (Sola Kayma): İçi dolu olan küçük "Numune A Çözeltisi" kabı tezgah üzerinde sol tarafa doğru kaysın/hizalansın
            if (itemSampleBottle) {
              itemSampleBottle.style.display = 'inline';
              itemSampleBottle.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.25, 1)';
              itemSampleBottle.style.transformOrigin = '764px 352px';
              itemSampleBottle.style.transform = 'translate(-550px, 0px)';
            }

            // 3. Yerleştirme: Kullanıcının bir önceki adımda seçtiği "Temiz boş numune şişesi", sola kayan "Numune A Çözeltisi" kabının hemen yanına (sağına) gelsin
            if (traySampleBottle1) {
              traySampleBottle1.style.display = 'inline';
              traySampleBottle1.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.4s ease';
              traySampleBottle1.style.opacity = '1';
              traySampleBottle1.style.transform = 'translate(-480px, 0px)';
            }

            // 4. Temizlik/Gizleme: Ortadaki SVG tepsi ve içinde yer alan "su lekeli/pis numune şişesi" sahneden tamamen kaldırılsın/gizlensin
            if (cleanSampleTrayGroup) {
              cleanSampleTrayGroup.style.transition = 'opacity 0.35s ease';
              cleanSampleTrayGroup.style.opacity = '0';
              setTimeout(() => {
                cleanSampleTrayGroup.style.display = 'none';
              }, 350);
            }
            if (cleanSampleTray) {
              cleanSampleTray.style.display = 'none';
            }
            if (traySampleBottle2) {
              traySampleBottle2.style.display = 'none';
            }

            // 5. Yeni Nesne Ekleme: Tepsinin kaldırılarak boşaltıldığı sağ taraftaki alana @img/analizcihazi.png görseli (Analiz Cihazı) uygun boyutlandırmayla (scale) sahneye dâhil edilsin
            if (itemAnalysisDevice) {
              setDeviceScreenState('standby');
              itemAnalysisDevice.style.display = 'inline';
              itemAnalysisDevice.style.opacity = '0';
              itemAnalysisDevice.style.transition = 'opacity 0.5s ease';
              void itemAnalysisDevice.offsetWidth;
              itemAnalysisDevice.style.opacity = '1';
              hReplayClass(itemAnalysisDevice, 'is-pop');
            }

            // =========================================================================
            // [BÖLÜM 3: GECİKMELİ ANİMASYON (DELAY EVENT)]
            // =========================================================================
            // Zamanlayıcı (Timer/Delay): Bölüm 2'deki tüm 5 işlem tamamlandıktan hemen sonra sisteme tam 2 saniyelik bir bekleme (delay) süresi eklensin.
            await hWait(2000);

            // Gecikmeli Eylem (2 saniye sonra): 2 saniyelik sürenin bitiminde, içi dolu olan "Numune A Çözeltisi" kabı (şişesi) havalanarak/hareket ederek
            // doğrudan tezgaha yeni eklenen analiz cihazının (@img/analizcihazi.png) şeffaf odacığının içerisine yerleşsin.
            // Bu yerleşme işlemi bir hareket (translate) animasyonu ile gösterilsin.
            if (itemSampleBottle) {
              // 1. Havalanma: Tezgahtan hafifçe yukarı kalkarak sağa doğru süzülüş
              itemSampleBottle.style.transition = 'transform 0.45s ease-out';
              itemSampleBottle.style.transformOrigin = '764px 352px';
              itemSampleBottle.style.transform = 'translate3d(-400px, -65px, 0px) scale(0.92)';
              await hWait(460);

              // 2. Analiz cihazının şeffaf test odacığının içerisine doğrudan yerleşme (X ekseni hareketi sağa artırıldı: -220px)
              itemSampleBottle.style.transition = 'transform 0.75s cubic-bezier(0.2, 0.8, 0.25, 1)';
              itemSampleBottle.style.transform = 'translate3d(-220px, -52px, 0px) scale(0.82)';
              await hWait(760);
            }

            // Şeffaf odacık ön cam yansıması görünür hale gelir (şişe cihazın odacığında görünür)
            if (chamberGlassOverlay) {
              chamberGlassOverlay.style.display = 'inline';
              chamberGlassOverlay.style.opacity = '0';
              chamberGlassOverlay.style.transition = 'opacity 0.35s ease';
              void chamberGlassOverlay.offsetWidth;
              chamberGlassOverlay.style.opacity = '1';
            }

            // 3. Adım Başarıyla Tamamlandı:
            stage4State.step3 = true;
            btnStage4Step3.classList.add('is-done');
            hReplayClass(btnStage4Step3, 'is-pop');
            hToast('✓ 3. Adım: Numune başarıyla analiz cihazına yerleştirildi.', 'success');
            if (avatarSpeechBubble && avatarSpeechText) {
              avatarSpeechBubble.classList.remove('fade-out', 'fade-out-slow');
              avatarSpeechText.textContent = 'Harika! Numune analiz cihazının test odacığına yerleştirildi. Şimdi "İncelemeye Başla" butonuyla analizi başlatabilirsin!';
              avatarSpeechBubble.classList.add('visible');
            }
            checkStage4Completed();

          } catch (err) {
            console.warn('Numuneyi yerleştirme hatası:', err);
          } finally {
            stage4State.animating = false;
          }
        }
      });
    }

    if (btnClosePlanModal) {
      btnClosePlanModal.addEventListener('click', closeTaskPlanModal);
    }
    if (btnDismissPlanModal) {
      btnDismissPlanModal.addEventListener('click', closeTaskPlanModal);
    }
    if (taskPlanModalBackdrop) {
      taskPlanModalBackdrop.addEventListener('click', (e) => {
        if (e.target === taskPlanModalBackdrop) {
          closeTaskPlanModal();
        }
      });
    }

    // 6. Çözelti Tamamlandı Modalı ve Sonraki Sahne Yönlendirme Dinleyicileri
    if (btnCloseCompleteModal) {
      btnCloseCompleteModal.addEventListener('click', closeSolutionCompleteModal);
    }
    if (btnReviewDesk) {
      btnReviewDesk.addEventListener('click', closeSolutionCompleteModal);
    }
    if (btnProceedNextStage) {
      btnProceedNextStage.addEventListener('click', () => {
        closeSolutionCompleteModal();
        setPrepScene(3);
      });
    }
    if (solutionCompleteBackdrop) {
      solutionCompleteBackdrop.addEventListener('click', (e) => {
        if (e.target === solutionCompleteBackdrop) {
          closeSolutionCompleteModal();
        }
      });
    }

    // =========================================================
    // ÇÖZELTİ TAMAMLANDI VE SONRAKİ SAHNEYE GEÇİŞ FONKSİYONLARI
    // =========================================================
    function openSolutionCompleteModal(state) {
      const modalBackdrop = document.getElementById('solution-complete-modal-backdrop');
      const labelVal = document.getElementById('complete-label-val');
      if (labelVal && state && state.labelText) {
        labelVal.textContent = state.labelText;
      }
      if (modalBackdrop) {
        modalBackdrop.classList.add('is-open');
        modalBackdrop.removeAttribute('aria-hidden');
      }
    }

    function closeSolutionCompleteModal() {
      const modalBackdrop = document.getElementById('solution-complete-modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.classList.remove('is-open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
      }
    }

    // Başarı modalındaki "Tamam" butonuna basıldığında 3. Sahneye geçiş
    window.proceedToNextStage = function(callback) {
      closeSolutionCompleteModal();
      setPrepScene(3);
      if (typeof callback === 'function') {
        callback(window.solutionLabState);
      }
    };

  }

  // =========================================================
  // GÖREV PLANI VE KORUYUCU DONANIM MODAL BİLGİ HARİTALARI
  // =========================================================
  const TASK_INFO_MAP = {
    'task-cozelti': { name: 'Çözelti Hazırla', img: 'img/task_cozelti.png', desc: 'Reaktif ve çözücüleri protokole göre hazırla' },
    'task-numune':  { name: 'Numuneyi İncele', img: 'img/task_numune.png', desc: 'Hazırlanan numunenin homojenliğini doğrula' },
    'task-yuzey':   { name: 'Yüzeyi Temizle',  img: 'img/task_yuzey.png',  desc: 'Tezgah ve çalışma alanını dezenfekte et' },
    'task-atik':    { name: 'Atıkları Ayır',    img: 'img/task_atik.png',   desc: 'Kimyasal ve katı atıkları uygun kaplara aktar' }
  };

  const GEAR_INFO_MAP = {
    'koruyucu-gozluk': { name: 'Koruyucu Gözlük',     img: 'img/koruyucu_gozluk.png', desc: 'Zorunlu göz ve yüz koruması' },
    'onluk':           { name: 'Laboratuvar Önlüğü',  img: 'img/onluk.png',           desc: 'Kimyasal sıçramalara karşı önlük' },
    'uygun-eldiven':   { name: 'Uygun Eldiven',       img: 'img/eldiven.png',         desc: 'Nitril kimyasal dayanımlı eldiven' },
    'gunluk-gozluk':   { name: 'Günlük Gözlük',       img: 'img/gozluk.png',          desc: 'Standart optik gözlük' },
    'bez-eldiven':     { name: 'Bez Eldiven',         img: 'img/temizlik_eldiven.png',desc: 'Toz ve temizlik eldiveni' },
    'maske':           { name: 'Maske',               img: 'img/maske.png',           desc: 'Solunum koruyucu maske' }
  };

  function renderTaskPlanModal() {
    const tasksList = document.getElementById('plan-modal-tasks-list');
    const gearsList = document.getElementById('plan-modal-gears-list');
    const gearsBadge = document.getElementById('plan-modal-gears-badge');

    // 1. Görev Sırası Render
    if (tasksList) {
      tasksList.innerHTML = '';
      const order = (gorevsirasi && gorevsirasi.length > 0)
        ? gorevsirasi
        : ['task-cozelti', 'task-numune', 'task-yuzey', 'task-atik'];

      order.forEach((taskId, idx) => {
        const info = TASK_INFO_MAP[taskId] || { name: taskId, img: 'img/task_cozelti.png', desc: 'Protokol adımı' };
        const row = document.createElement('div');
        row.className = 'plan-task-item';
        row.innerHTML = `
          <div class="plan-task-step-num">${idx + 1}</div>
          <div class="plan-task-thumb-box">
            <img src="${info.img}" alt="${info.name}" class="plan-task-thumb-img" draggable="false" />
          </div>
          <div class="plan-task-info">
            <strong class="plan-task-name">${info.name}</strong>
            <span class="plan-task-desc">${info.desc}</span>
          </div>
          <span class="plan-task-check" title="Onaylandı">✓</span>
        `;
        tasksList.appendChild(row);
      });
    }

    // 2. Koruyucu Donanım Render (Dinamik ve düzenli liste)
    if (gearsList) {
      gearsList.innerHTML = '';
      const selected = (koruyucudonanimlar && koruyucudonanimlar.length > 0)
        ? koruyucudonanimlar
        : ['koruyucu-gozluk', 'onluk', 'uygun-eldiven'];

      if (gearsBadge) {
        gearsBadge.textContent = selected.length + ' Ekipman';
      }

      selected.forEach((gearId) => {
        const info = GEAR_INFO_MAP[gearId] || { name: gearId, img: 'img/koruyucu_gozluk.png', desc: 'Koruyucu donanım ekipmanı' };
        const row = document.createElement('div');
        row.className = 'plan-gear-item';
        row.innerHTML = `
          <div class="plan-gear-thumb-box">
            <img src="${info.img}" alt="${info.name}" class="plan-gear-thumb-img" draggable="false" />
          </div>
          <div class="plan-gear-info">
            <strong class="plan-gear-title">${info.name}</strong>
            <span class="plan-gear-sub">${info.desc}</span>
          </div>
          <span class="plan-task-check" title="Seçildi">✓</span>
        `;
        gearsList.appendChild(row);
      });
    }
  }

  function openTaskPlanModal() {
    renderTaskPlanModal();
    const modalBackdrop = document.getElementById('task-plan-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.add('is-open');
      modalBackdrop.removeAttribute('aria-hidden');
    }
  }

  function closeTaskPlanModal() {
    const modalBackdrop = document.getElementById('task-plan-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-open');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }
  }

  // Planlama Ekranı Sürükle-Bırak ve Donanım Seçimlerini Başlat
  initSortableTaskList();
  initGearSelection();
  initHazirlikMasasi();

  // İlk yüklemede yön durumunu denetle
  checkOrientation();
});
