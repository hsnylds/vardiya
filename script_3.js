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
        cloneElement.style.borderRadius = '14px';
        cloneElement.style.border = '1.5px solid #0284c7';
        cloneElement.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.45), 0 0 28px rgba(56, 189, 248, 0.55)';
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

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-task-item:not(.dragging):not(.drag-placeholder)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
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
    gorevsirasi = [];
    koruyucudonanimlar = [];
    stopVoiceOver();
    stopTaskInteraction(true);

    // Yeni görsel butonlar, çalışma tezgahı, sağ görev menüsü ve öğretmen avatarı başlangıçta KESİNLİKLE gizlidir
    hideShiftActionButton(false);
    hidePlanShiftButton(false);
    hideConfirmPlanButton(false);
    hidePlanningStage(false);
    hideWorkbench(false);
    hideTaskMenu(false);
    hideTeacherAvatar(false);

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


  // Yeniden Başlat Butonu -> Animasyonu ve sesi baştan oynatır
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      unlockAudio();
      startSimulationSequence();
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

  // Planlama Ekranı Sürükle-Bırak ve Donanım Seçimlerini Başlat
  initSortableTaskList();
  initGearSelection();

  // İlk yüklemede yön durumunu denetle
  checkOrientation();
});
