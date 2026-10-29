/**
 * ZsirafVision - Internationalization (i18n) & Dynamic EPG Engine
 * Version: 3.6
 * Supported Languages: Hungarian (hu), English (en), German (de), French (fr), Spanish (es), Russian (ru)
 */

window.ZsirafI18N = (function () {
  'use strict';

  const DICTIONARY = {
    hu: {
      epgTitle: "MŰSORÚJSÁG",
      epgClose: "Bezárás",
      epgChannelLoading: "Csatorna betöltése...",
      epgNowNext: "ÉPPEN MEGY & KÖVETKEZŐK",
      epgLoading: "Műsorinformációk betöltése...",
      epgLive: "ÉLŐBEN",
      epgNoInfo: "Ehhez a csatornához folyamatos élő adás áll rendelkezésre.",
      epgContinuous: "(Folyamatos adás)",
      osdLive: "ÉLŐ ADÁS",
      volume: "HANGERŐ",
      mute: "NÉMÍTÁS",
      muteOn: "BE",
      muteOff: "KI",
      tuning: "ADÁS BETÖLTÉSE...",
      clickToStart: "KATTINTS AZ INDÍTÁSHOZ",
      redReportBtn: "HIBAJELENTŐ",
      redReportTitle: "Adáshiba bejelentése és adatok elküldése",
      btnEpg: "📅 MŰSORÚJSÁG",
      btnPrev: "◀ ELŐZŐ",
      btnGuide: "📋 CSATORNALISTA",
      btnNext: "KÖVETKEZŐ ▶",
      btnStats: "⚙ TECHNIKAI ADATOK",
      guideTitle: "CSATORNALISTA",
      sourceLabel: "Forrás / Ország:",
      sourceHu: "🇭🇺 Magyar Adások (131 csatorna)",
      sourceWorld: "🌍 iptv-org Világ (index.country.m3u)",
      searchPlaceholder: "🔍 Keresés (pl. RTL, Sport, Zene, Film)...",
      catAll: "Mind",
      statsTitle: "⚙ PILLANATNYI TECHNIKAI ADATOK",
      statServerStatus: "Szerver Státusz",
      statServerRegion: "Szerver Régió",
      statChName: "Aktuális Csatorna",
      statVideoRes: "Videó Felbontás",
      statVideoBitrate: "Stream Bitráta",
      statVideoBuffer: "Pufferelt Idő",
      statDroppedFrames: "Eldobott Képkockák",
      statPing: "Hálózati Késleltetés",
      btnRefresh: "🔄 Frissítés",
      reportTitle: "🚨 ADÁSHIBA BEJELENTÉSE",
      reportIntro: "Az alábbi adatok összegyűjtésre kerülnek és elküldjük a felhős szerverre az adás minőségének javítása érdekében:",
      reportNoteLabel: "Hiba rövid leírása (opcionális):",
      reportNotePlaceholder: "Pl.: Akadozik a kép, nincs hang, fekete képernyő...",
      btnCancel: "Mégse",
      btnSendReport: "📤 ADATOK KÜLDÉSE",
      reportSuccess: "✅ Hibajelentés sikeresen elküldve! Köszönjük.",
      reportError: "❌ Hiba a küldés során. Kérjük próbáld újra később.",
      reportSending: "Adatok küldése a szerverre...",
      streamUnavailable: "AZ ADÁS JELENLEG NEM ELÉRHETŐ",
      loadingWorld: "VILÁG CSATORNÁK BETÖLTÉSE...",
      errorLoadingWorld: "HIBA A VILÁG CSATORNÁK BETÖLTÉSEKOR",
      shortcutsLegend: '<span>Irányítás:</span> <kbd>Nyilak Fel/Le/Balra/Jobbra</kbd> Csatornaváltás &bull; <kbd>+/-</kbd> Hangerő &bull; <kbd>M</kbd> Némítás &bull; <kbd>F</kbd> Teljes képernyő &bull; <kbd>C</kbd> Csatornalista &bull; <kbd>P</kbd> Műsorújság &bull; <kbd>Számok (0-9)</kbd> Közvetlen választás',
      footerCredit: '<strong>ZsirafVision</strong> &bull; Kristálytiszta HD Képminőség &bull; Valós Online Működés'
    },
    en: {
      epgTitle: "TV GUIDE",
      epgClose: "Close",
      epgChannelLoading: "Loading channel...",
      epgNowNext: "NOW PLAYING & UPCOMING",
      epgLoading: "Loading program guide...",
      epgLive: "LIVE",
      epgNoInfo: "Continuous live stream is available for this channel.",
      epgContinuous: "(Continuous broadcast)",
      osdLive: "LIVE BROADCAST",
      volume: "VOLUME",
      mute: "MUTE",
      muteOn: "ON",
      muteOff: "OFF",
      tuning: "TUNING STREAM...",
      clickToStart: "CLICK TO START",
      redReportBtn: "REPORT ISSUE",
      redReportTitle: "Report stream issue & submit diagnostics",
      btnEpg: "📅 TV GUIDE",
      btnPrev: "◀ PREV",
      btnGuide: "📋 CHANNELS",
      btnNext: "NEXT ▶",
      btnStats: "⚙ TECH STATS",
      guideTitle: "CHANNEL LIST",
      sourceLabel: "Source / Country:",
      sourceHu: "🇭🇺 Hungarian TV (131 channels)",
      sourceWorld: "🌍 iptv-org World (index.country.m3u)",
      searchPlaceholder: "🔍 Search (e.g. CNN, Sport, Music, Film)...",
      catAll: "All",
      statsTitle: "⚙ REAL-TIME TECHNICAL STATS",
      statServerStatus: "Server Status",
      statServerRegion: "Server Region",
      statChName: "Current Channel",
      statVideoRes: "Video Resolution",
      statVideoBitrate: "Stream Bitrate",
      statVideoBuffer: "Buffer Time",
      statDroppedFrames: "Dropped Frames",
      statPing: "Network Latency",
      btnRefresh: "🔄 Refresh",
      reportTitle: "🚨 REPORT STREAM ISSUE",
      reportIntro: "The following diagnostic data will be collected and sent to the cloud server to help improve stream quality:",
      reportNoteLabel: "Brief issue description (optional):",
      reportNotePlaceholder: "E.g.: Freezing video, no audio, black screen...",
      btnCancel: "Cancel",
      btnSendReport: "📤 SEND REPORT",
      reportSuccess: "✅ Issue report successfully submitted! Thank you.",
      reportError: "❌ Failed to submit report. Please try again later.",
      reportSending: "Sending diagnostic data to server...",
      streamUnavailable: "STREAM CURRENTLY UNAVAILABLE",
      loadingWorld: "LOADING WORLD CHANNELS...",
      errorLoadingWorld: "FAILED TO LOAD WORLD CHANNELS",
      shortcutsLegend: '<span>Controls:</span> <kbd>Arrows Up/Down/Left/Right</kbd> Switch Channel &bull; <kbd>+/-</kbd> Volume &bull; <kbd>M</kbd> Mute &bull; <kbd>F</kbd> Fullscreen &bull; <kbd>C</kbd> Channels &bull; <kbd>P</kbd> TV Guide &bull; <kbd>Digits (0-9)</kbd> Direct Select',
      footerCredit: '<strong>ZsirafVision</strong> &bull; Crystal Clear HD Quality &bull; Live Online Streaming'
    },
    de: {
      epgTitle: "PROGRAMM",
      epgClose: "Schließen",
      epgChannelLoading: "Kanal wird geladen...",
      epgNowNext: "JETZT & DANACH",
      epgLoading: "Programminformationen laden...",
      epgLive: "LIVE",
      epgNoInfo: "Für diesen Kanal steht ein kontinuierlicher Live-Stream bereit.",
      epgContinuous: "(Durchgehende Sendung)",
      osdLive: "LIVE SENDUNG",
      volume: "LAUTSTÄRKE",
      mute: "STUMMSCHALTUNG",
      muteOn: "EIN",
      muteOff: "AUS",
      tuning: "STREAM WIRD GELADEN...",
      clickToStart: "KLICKEN ZUM STARTEN",
      redReportBtn: "FEHLER MELDEN",
      redReportTitle: "Stream-Fehler melden & Diagnosedaten senden",
      btnEpg: "📅 PROGRAMM",
      btnPrev: "◀ ZURÜCK",
      btnGuide: "📋 KANALLISTE",
      btnNext: "WEITER ▶",
      btnStats: "⚙ TECHNIK",
      guideTitle: "KANALLISTE",
      sourceLabel: "Quelle / Land:",
      sourceHu: "🇭🇺 Ungarisches Fernsehen (131 Kanäle)",
      sourceWorld: "🌍 iptv-org Welt (index.country.m3u)",
      searchPlaceholder: "🔍 Suche (z.B. RTL, Sport, Musik, Film)...",
      catAll: "Alle",
      statsTitle: "⚙ ECHTZEIT TECHNISCHE DATEN",
      statServerStatus: "Serverstatus",
      statServerRegion: "Serverregion",
      statChName: "Aktueller Kanal",
      statVideoRes: "Videoauflösung",
      statVideoBitrate: "Stream-Bitrate",
      statVideoBuffer: "Pufferzeit",
      statDroppedFrames: "Verlorene Frames",
      statPing: "Netzwerklatenz",
      btnRefresh: "🔄 Aktualisieren",
      reportTitle: "🚨 STREAM-FEHLER MELDEN",
      reportIntro: "Die folgenden Diagnosedaten werden gesammelt und an den Server gesendet, um die Qualität zu verbessern:",
      reportNoteLabel: "Kurze Fehlerbeschreibung (optional):",
      reportNotePlaceholder: "Z.B.: Video stottert, kein Ton, schwarzer Bildschirm...",
      btnCancel: "Abbrechen",
      btnSendReport: "📤 BERICHT SENDEN",
      reportSuccess: "✅ Fehlerbericht erfolgreich gesendet! Danke.",
      reportError: "❌ Fehler beim Senden. Bitte versuchen Sie es später erneut.",
      reportSending: "Daten werden an den Server übertragen...",
      streamUnavailable: "STREAM DERZEIT NICHT VERFÜGBAR",
      loadingWorld: "LADE WELTKANÄLE...",
      errorLoadingWorld: "FEHLER BEIM LADEN DER WELTKANÄLE",
      shortcutsLegend: '<span>Steuerung:</span> <kbd>Pfeile Auf/Ab/Links/Rechts</kbd> Kanalwechsel &bull; <kbd>+/-</kbd> Lautstärke &bull; <kbd>M</kbd> Stumm &bull; <kbd>F</kbd> Vollbild &bull; <kbd>C</kbd> Kanalliste &bull; <kbd>P</kbd> Programm &bull; <kbd>Ziffern (0-9)</kbd> Direktauswahl',
      footerCredit: '<strong>ZsirafVision</strong> &bull; Kristallklare HD-Qualität &bull; Live Online Streaming'
    },
    fr: {
      epgTitle: "GUIDE TV",
      epgClose: "Fermer",
      epgChannelLoading: "Chargement de la chaîne...",
      epgNowNext: "EN DIRECT & À SUIVRE",
      epgLoading: "Chargement du programme...",
      epgLive: "EN DIRECT",
      epgNoInfo: "Diffusion en direct continue pour cette chaîne.",
      epgContinuous: "(Diffusion continue)",
      osdLive: "EN DIRECT",
      volume: "VOLUME",
      mute: "SOURDINE",
      muteOn: "ACTIVÉE",
      muteOff: "DÉSACTIVÉE",
      tuning: "CHARGEMENT DU FLUX...",
      clickToStart: "CLIQUER POUR DÉMARRER",
      redReportBtn: "SIGNALER",
      redReportTitle: "Signaler un problème de diffusion et envoyer un diagnostic",
      btnEpg: "📅 GUIDE TV",
      btnPrev: "◀ PRÉC",
      btnGuide: "📋 CHAÎNES",
      btnNext: "SUIVANT ▶",
      btnStats: "⚙ INFOS TECH",
      guideTitle: "LISTE DES CHAÎNES",
      sourceLabel: "Source / Pays :",
      sourceHu: "🇭🇺 Télévision hongroise (131 chaînes)",
      sourceWorld: "🌍 iptv-org Monde (index.country.m3u)",
      searchPlaceholder: "🔍 Rechercher (ex: RTL, Sport, Musique, Film)...",
      catAll: "Tous",
      statsTitle: "⚙ STATISTIQUES TECHNIQUES EN DIRECT",
      statServerStatus: "État du serveur",
      statServerRegion: "Région du serveur",
      statChName: "Chaîne actuelle",
      statVideoRes: "Résolution vidéo",
      statVideoBitrate: "Débit du flux",
      statVideoBuffer: "Tampon vidéo",
      statDroppedFrames: "Images perdues",
      statPing: "Latence réseau",
      btnRefresh: "🔄 Actualiser",
      reportTitle: "🚨 SIGNALER UN PROBLÈME DE DIFFUSION",
      reportIntro: "Les données de diagnostic suivantes seront collectées et envoyées au serveur afin d'améliorer la qualité :",
      reportNoteLabel: "Brève description du problème (facultatif) :",
      reportNotePlaceholder: "Ex: Image saccadée, pas de son, écran noir...",
      btnCancel: "Annuler",
      btnSendReport: "📤 ENVOYER LE RAPPORT",
      reportSuccess: "✅ Signalement envoyé avec succès ! Merci.",
      reportError: "❌ Erreur lors de l'envoi. Veuillez réessayer plus tard.",
      reportSending: "Envoi des données de diagnostic...",
      streamUnavailable: "FLUX ACTUELLEMENT INDISPONIBLE",
      loadingWorld: "CHARGEMENT DES CHAÎNES DU MONDE...",
      errorLoadingWorld: "ERREUR DE CHARGEMENT DU MONDE",
      shortcutsLegend: '<span>Contrôles :</span> <kbd>Flèches Haut/Bas/Gauche/Droite</kbd> Changer de chaîne &bull; <kbd>+/-</kbd> Volume &bull; <kbd>M</kbd> Sourdine &bull; <kbd>F</kbd> Plein écran &bull; <kbd>C</kbd> Chaînes &bull; <kbd>P</kbd> Guide TV &bull; <kbd>Chiffres (0-9)</kbd> Sélection directe',
      footerCredit: '<strong>ZsirafVision</strong> &bull; Qualité HD cristalline &bull; Streaming direct en ligne'
    },
    es: {
      epgTitle: "GUÍA TV",
      epgClose: "Cerrar",
      epgChannelLoading: "Cargando canal...",
      epgNowNext: "EN EMISIÓN Y PRÓXIMO",
      epgLoading: "Cargando guía de programación...",
      epgLive: "EN VIVO",
      epgNoInfo: "Emisión continua en vivo disponible para este canal.",
      epgContinuous: "(Emisión continua)",
      osdLive: "EN DIRECTO",
      volume: "VOLUMEN",
      mute: "SILENCIO",
      muteOn: "ACTIVADO",
      muteOff: "DESACTIVADO",
      tuning: "SINTONIZANDO EMISIÓN...",
      clickToStart: "HAZ CLIC PARA INICIAR",
      redReportBtn: "REPORTAR",
      redReportTitle: "Reportar problema de emisión y enviar diagnóstico",
      btnEpg: "📅 GUÍA TV",
      btnPrev: "◀ ANT",
      btnGuide: "📋 CANALES",
      btnNext: "SIGUIENTE ▶",
      btnStats: "⚙ DATOS TÉCNICOS",
      guideTitle: "LISTA DE CANALES",
      sourceLabel: "Fuente / País:",
      sourceHu: "🇭🇺 Televisión húngara (131 canales)",
      sourceWorld: "🌍 iptv-org Mundo (index.country.m3u)",
      searchPlaceholder: "🔍 Buscar (ej: Noticias, Deportes, Música, Cine)...",
      catAll: "Todos",
      statsTitle: "⚙ DATOS TÉCNICOS EN TIEMPO REAL",
      statServerStatus: "Estado del servidor",
      statServerRegion: "Región del servidor",
      statChName: "Canal actual",
      statVideoRes: "Resolución de video",
      statVideoBitrate: "Tasa de bits",
      statVideoBuffer: "Búfer de video",
      statDroppedFrames: "Cuadros perdidos",
      statPing: "Latencia de red",
      btnRefresh: "🔄 Actualizar",
      reportTitle: "🚨 REPORTAR PROBLEMA DE EMISIÓN",
      reportIntro: "Los siguientes datos de diagnóstico se enviarán al servidor para mejorar la calidad de emisión:",
      reportNoteLabel: "Breve descripción del problema (opcional):",
      reportNotePlaceholder: "Ej: Video entrecortado, sin audio, pantalla negra...",
      btnCancel: "Cancelar",
      btnSendReport: "📤 ENVIAR REPORTE",
      reportSuccess: "✅ ¡Reporte enviado con éxito! Gracias.",
      reportError: "❌ Error al enviar el reporte. Inténtelo más tarde.",
      reportSending: "Enviando datos al servidor...",
      streamUnavailable: "EMISIÓN NO DISPONIBLE ACTUALMENTE",
      loadingWorld: "CARGANDO CANALES DEL MUNDO...",
      errorLoadingWorld: "ERROR AL CARGAR CANALES DEL MUNDO",
      shortcutsLegend: '<span>Controles:</span> <kbd>Flechas Arriba/Abajo/Izq/Der</kbd> Cambiar canal &bull; <kbd>+/-</kbd> Volumen &bull; <kbd>M</kbd> Silencio &bull; <kbd>F</kbd> Pantalla completa &bull; <kbd>C</kbd> Canales &bull; <kbd>P</kbd> Guía TV &bull; <kbd>Números (0-9)</kbd> Selección directa',
      footerCredit: '<strong>ZsirafVision</strong> &bull; Calidad HD cristalina &bull; Transmisión en vivo'
    },
    ru: {
      epgTitle: "ТЕЛЕПРОГРАММА",
      epgClose: "Закрыть",
      epgChannelLoading: "Загрузка канала...",
      epgNowNext: "СЕЙЧАС И ДАЛЕЕ",
      epgLoading: "Загрузка программы передач...",
      epgLive: "В ЭФИРЕ",
      epgNoInfo: "Для этого канала ведется непрерывный прямой эфир.",
      epgContinuous: "(Непрерывное вещание)",
      osdLive: "ПРЯМОЙ ЭФИР",
      volume: "ГРОМКОСТЬ",
      mute: "БЕЗ ЗВУКА",
      muteOn: "ВКЛ",
      muteOff: "ВЫКЛ",
      tuning: "НАСТРОЙКА КАНАЛА...",
      clickToStart: "НАЖМИТЕ ДЛЯ СТАРТА",
      redReportBtn: "СООБЩИТЬ",
      redReportTitle: "Сообщить о сбое трансляции и отправить диагностику",
      btnEpg: "📅 ТЕЛЕПРОГРАММА",
      btnPrev: "◀ ПРЕД",
      btnGuide: "📋 КАНАЛЫ",
      btnNext: "СЛЕДУЮЩИЙ ▶",
      btnStats: "⚙ ТЕХ ДАННЫЕ",
      guideTitle: "СПИСОК КАНАЛОВ",
      sourceLabel: "Источник / Страна:",
      sourceHu: "🇭🇺 Венгерские каналы (131 канал)",
      sourceWorld: "🌍 iptv-org Мир (index.country.m3u)",
      searchPlaceholder: "🔍 Поиск (напр. Новости, Спорт, Музыка, Кино)...",
      catAll: "Все",
      statsTitle: "⚙ ТЕКУЩИЕ ТЕХНИЧЕСКИЕ ДАННЫЕ",
      statServerStatus: "Статус сервера",
      statServerRegion: "Регион сервера",
      statChName: "Текущий канал",
      statVideoRes: "Разрешение видео",
      statVideoBitrate: "Битрейт потока",
      statVideoBuffer: "Буферизация",
      statDroppedFrames: "Потерянные кадры",
      statPing: "Сетевая задержка",
      btnRefresh: "🔄 Обновить",
      reportTitle: "🚨 СООБЩИТЬ О СБОЕ ТРАНСЛЯЦИИ",
      reportIntro: "Следующие диагностические данные будут отправлены на сервер для улучшения качества трансляции:",
      reportNoteLabel: "Краткое описание проблемы (необязательно):",
      reportNotePlaceholder: "Напр.: Зависает видео, нет звука, черный экран...",
      btnCancel: "Отмена",
      btnSendReport: "📤 ОТПРАВИТЬ ОТЧЕТ",
      reportSuccess: "✅ Отчет об ошибке успешно отправлен! Спасибо.",
      reportError: "❌ Ошибка при отправке. Пожалуйста, повторите позже.",
      reportSending: "Отправка диагностических данных...",
      streamUnavailable: "ТРАНСЛЯЦИЯ ВРЕМЕННО НЕДОСТУПНА",
      loadingWorld: "ЗАГРУЗКА МИРОВЫХ КАНАЛОВ...",
      errorLoadingWorld: "ОШИБКА ЗАГРУЗКИ МИРОВЫХ КАНАЛОВ",
      shortcutsLegend: '<span>Управление:</span> <kbd>Стрелки Вверх/Вниз/Влево/Вправо</kbd> Переключение &bull; <kbd>+/-</kbd> Громкость &bull; <kbd>M</kbd> Без звука &bull; <kbd>F</kbd> Полный экран &bull; <kbd>C</kbd> Каналы &bull; <kbd>P</kbd> Телепрограмма &bull; <kbd>Цифры (0-9)</kbd> Выбор канала',
      footerCredit: '<strong>ZsirafVision</strong> &bull; Кристально чистое HD качество &bull; Онлайн трансляция'
    }
  };

  const SCHEDULE_TEMPLATES = {
    news: {
      hu: [
        { title: "Élő Hírháttér & Nemzetközi Fókusz", desc: "A nap legfontosabb világhírei, helyszíni tudósítások és szakértői elemzések." },
        { title: "Gazdasági és Tőzsdei Körkép", desc: "Pénzügyi piacok, devizaárfolyamok és vállalati hírek élőben." },
        { title: "Globális Híradó & Riportok", desc: "Átfogó nemzetközi hírfolyam a legfrissebb diplomáciai és gazdasági eseményekről." },
        { title: "Dokumentum Spotlight", desc: "Mélyreható oknyomozó riportok és exkluzív háttérbeszélgetések." },
        { title: "Esti Krónika & Világösszefoglaló", desc: "A nap összefoglalása élő kapcsolásokkal a világ fővárosaiból." },
        { title: "Éjszakai Hírmagazin", desc: "Éjszakai hírek, holnapi előrejelzés és nemzetközi lapszemle." }
      ],
      en: [
        { title: "Live World News & Global Focus", desc: "Breaking international headlines, live on-the-scene reporting and expert insights." },
        { title: "Global Business & Financial Markets", desc: "Real-time market updates, currencies, commodity trends and corporate news." },
        { title: "World News Bulletin", desc: "Comprehensive continuous world news coverage with in-depth analysis." },
        { title: "Documentary Spotlight", desc: "Investigative special reports, exclusive interviews and world perspectives." },
        { title: "Evening News Hour", desc: "Daily recap of pivotal global events with correspondents worldwide." },
        { title: "Late Night World Report", desc: "Overnight world news, regional updates and international press review." }
      ],
      de: [
        { title: "Live-Nachrichten & Weltfokus", desc: "Aktuelle internationale Schlagzeilen, Live-Berichte und Expertenanalysen." },
        { title: "Wirtschaft & Finanzmärkte", desc: "Echtzeit-Finanzmeldungen, globale Börsentrends und Unternehmensanalysen." },
        { title: "Globale Nachrichtenübersicht", desc: "Umfassende Zusammenfassung der wichtigsten Ereignisse aus aller Welt." },
        { title: "Dokumentation & Hintergrund", desc: "Investigative Reportagen und exklusive Hintergrundinterviews." },
        { title: "Abendjournal & Weltgeschehen", desc: "Tageszusammenfassung mit Korrespondentenberichten weltweit." },
        { title: "Spätnachrichten & Presseschau", desc: "Nachrichten der Nacht, Ausblick und internationale Pressestimmen." }
      ],
      fr: [
        { title: "Journal en direct & Actualités mondiales", desc: "Les grands titres internationaux en continu, reportages et analyses d'experts." },
        { title: "Économie & Marchés financiers", desc: "Point complet sur les marchés financiers mondiaux et tendances économiques." },
        { title: "Le Grand Journal International", desc: "Couverture exhaustive de l'actualité diplomatique et politique mondiale." },
        { title: "Grand Angle & Enquêtes", desc: "Reportages d'investigation et dossiers exclusifs sur le terrain." },
        { title: "Édition du soir & Bilan du jour", desc: "Synthèse complète de la journée avec nos correspondants à travers le monde." },
        { title: "Nuit d'Info & Revue de presse", desc: "Fil continu de l'actualité nocturne et revue de la presse internationale." }
      ],
      es: [
        { title: "Noticias en directo y Foco mundial", desc: "Titulares internacionales minuto a minuto, reportajes y análisis de expertos." },
        { title: "Economía y Mercados globales", desc: "Información financiera en tiempo real, índices bursátiles y análisis macroeconómico." },
        { title: "Panorama Informativo Mundial", desc: "Cobertura rigurosa y continua de los acontecimientos más destacados del planeta." },
        { title: "Reportajes en profundidad", desc: "Periodismo de investigación, entrevistas exclusivas e historias de impacto." },
        { title: "Informativo central de la noche", desc: "Resumen de las noticias clave de la jornada con enviados especiales." },
        { title: "Edición nocturna y Revista de prensa", desc: "Actualización informativa de madrugada y lectura de portadas mundiales." }
      ],
      ru: [
        { title: "Прямой эфир: Главные мировые новости", desc: "Срочные сообщения, прямые включения с мест событий и мнения экспертов." },
        { title: "Деловой вестник и мировые рынки", desc: "Экономическая аналитика, котировки валют и ключевые финансовые события." },
        { title: "Международный выпуск новостей", desc: "Полный обзор глобальных политических и дипломатических процессов." },
        { title: "Специальный репортаж и расследования", desc: "Эксклюзивные репортажи журналистов и интервью с участниками событий." },
        { title: "Вечерние итоги дня", desc: "Главные события уходящего дня с комментариями международных обозревателей." },
        { title: "Ночной информационный канал", desc: "Картина событий ночи, обзор зарубежной прессы и прогноз на завтра." }
      ]
    },
    sports: {
      hu: [
        { title: "Élő Sportközvetítés & Elemzések", desc: "Bajnoki mérkőzések, helyszíni stúdióbeszélgetések és taktikai elemzések." },
        { title: "Gólok, Bajnokok & Összefoglalók", desc: "A hétvégi fordulók legszebb jelenetei, interjúk a főszereplőkkel." },
        { title: "Nemzetközi Bajnokságok & Rangadók", desc: "Európai csúcsfoci, exkluzív felvételek és tabellaértékelés." },
        { title: "Motorsport & Extrém Aréna", desc: "Gyorsaság, adrenalin és technikai elemzések a leggyorsabb géposztályokból." },
        { title: "Esti Rangadó Élőben", desc: "A nap legjobban várt összecsapása a győzelemért." },
        { title: "Sporthíradó & Éjszakai Hosszabbítás", desc: "Minden eredmény, statisztikák és a holnapi program előzetese." }
      ],
      en: [
        { title: "Live Matchday & Championship Action", desc: "Premier games, pitchside expert commentary and tactical breakdowns." },
        { title: "Sports Highlights & World Roundup", desc: "Best plays, goals of the week and exclusive player post-match interviews." },
        { title: "International Football & Cup Clashes", desc: "Top league clashes, decisive points and comprehensive league standings." },
        { title: "Motorsport & High Adrenaline", desc: "Speed, precision engineering and trackside excitement from top series." },
        { title: "Prime Time Live Showdown", desc: "The marquee matchup of the evening featuring world-class athletes." },
        { title: "Late Night Sports Desk", desc: "Final scores, statistics, player ratings and tomorrow's match preview." }
      ],
      de: [
        { title: "Live Sport & Matchday Arena", desc: "Top-Spiele der Liga, Studioanalysen und exklusive Stimmen vom Spielfeldrand." },
        { title: "Tore, Highlights & Spieltagsshow", desc: "Die besten Spielzüge der Woche, Traumtore und Interviews der Stars." },
        { title: "Internationaler Spitzenfußball", desc: "Spannung pur aus den europäischen Top-Ligen und Pokalwettbewerben." },
        { title: "Motorsport Magazin", desc: "Rennsport pur, Boxenfunk und Technikdetails der schnellsten Piloten." },
        { title: "Prime Time Live Duell", desc: "Das Top-Spiel des Abends mit hochklassiger sportlicher Dramatik." },
        { title: "Sport Aktuell & Nachtausgabe", desc: "Alle Ergebnisse, Tabellen und die Vorschau auf den kommenden Spieltag." }
      ],
      fr: [
        { title: "Direct Sport & Grand Match", desc: "Rencontres en direct, analyses tactiques en plateau et réactions d'après-match." },
        { title: "Temps Forts & Buts du Monde", desc: "Le meilleur de l'action sportive, gestes d'anthologie et résumés complets." },
        { title: "Football International & Coupes", desc: "Les plus grands clubs européens au coude à coude pour la victoire." },
        { title: "Moteurs & Sports Extrêmes", desc: "Sensations fortes, vitesse et immersion au cœur des paddocks." },
        { title: "Le Choc de la Soirée en Direct", desc: "La grande affiche de la journée commentée par nos experts." },
        { title: "L'Équipe du Soir & Résultats", desc: "Tous les scores, classements et le programme des rendez-vous à venir." }
      ],
      es: [
        { title: "En Directo: Partidazo de la Jornada", desc: "Emisión de los mejores encuentros, análisis táctico y entrevistas en el campo." },
        { title: "Goles, Resúmenes y Polémicas", desc: "Lo más vibrante de la semana deportiva con las jugadas decisivas." },
        { title: "Fútbol Internacional de Élite", desc: "Duelos electrizantes en las ligas más competitivas del planeta." },
        { title: "Velocidad y Motor al Límite", desc: "La adrenalina de los circuitos, estrategia de boxes y máxima potencia." },
        { title: "El Gran Clásico de la Noche", desc: "El enfrentamiento cumbre entre los mejores atletas por el trofeo." },
        { title: "Estudio Estadio Nocturno", desc: "Resultados finales, análisis de la jornada y previa de los próximos choques." }
      ],
      ru: [
        { title: "Прямой эфир: Матч дня и арена", desc: "Главные матчи тура, студийная аналитика и эксклюзивные комментарии тренеров." },
        { title: "Все голы и лучшие моменты", desc: "Яркие эпизоды недели, рекорды и интервью с главными героями спорта." },
        { title: "Мировой футбол и еврокубки", desc: "Борьба сильнейших клубов континента за чемпионский титул." },
        { title: "Мир автоспорта и экстрима", desc: "Высокие скорости, рев моторов и борьба за поул-позицию." },
        { title: "Вечерний прайм-тайм: Главная битва", desc: "Кульминационный матч вечера с накалом спортивных страстей." },
        { title: "Спортивный дневник и итоги", desc: "Сводка результатов всех турниров, статистика и анонс завтрашних событий." }
      ]
    },
    music: {
      hu: [
        { title: "Top Hits & Reggeli Slágerek", desc: "A legfrissebb hazai és nemzetközi slágerek pörgős válogatása." },
        { title: "Non-Stop Pop & Dance Party", desc: "Folyamatos zenei ritmusok, a legnépszerűbb videóklipek megállás nélkül." },
        { title: "Világsztárok Élőben & Aréna Koncertek", desc: "Felejthetetlen színpadi fellépések és exkluzív akusztikus felvételek." },
        { title: "Retro Legendák & Örökzöldek", desc: "A 80-as, 90-es és 2000-es évek legnagyobb generációs dalai." },
        { title: "Esti Club Beats & DJ Mix", desc: "A világ legmenőbb klubzenéi és elektronikus partihangulat." },
        { title: "Late Night Chillout Sessions", desc: "Pihentető dallamok, lo-fi és akusztikus harmóniák az éjszakában." }
      ],
      en: [
        { title: "Top 40 Countdown & Energy Hits", desc: "The hottest global chart-toppers and high-energy music videos." },
        { title: "Non-Stop Pop & Dance Anthems", desc: "Back-to-back mega hits, trending sounds and visual video clips." },
        { title: "Live in Concert: World Tour Sessions", desc: "Epic stadium performances, festival highlights and acoustic specials." },
        { title: "Golden Classics & Retro Vault", desc: "The greatest iconic rock, pop and R&B hits of past decades." },
        { title: "Clubland Prime Beats & DJ Sets", desc: "Electronic dance beats, deep house and club anthems for the evening." },
        { title: "Late Night Chillout Lounge", desc: "Relaxing ambient tracks, smooth soul and late-night acoustic vibes." }
      ],
      de: [
        { title: "Top 40 Charts & Morgenhits", desc: "Die beliebtesten internationalen Chartstürmer und Videoclips." },
        { title: "Non-Stop Pop & Party Mix", desc: "Die besten Beats ohne Pause für beste Stimmung den ganzen Tag." },
        { title: "Live & Akustisch: Die Stars", desc: "Bühnenshows der Extraklasse und exklusive Konzertmitschnitte." },
        { title: "Kult-Klassiker der Musikgeschichte", desc: "Unvergessene Hits der 80er, 90er und 2000er Jahre." },
        { title: "Club Sounds & Electronic Night", desc: "Elektronische Beats, House und Club-Atmosphäre vom Feinsten." },
        { title: "Chillout Lounge zur Nacht", desc: "Sanfte Klänge, entspannter Soul und melodische Nachtbegleitung." }
      ],
      fr: [
        { title: "Le Top des Hits & Réveil Musical", desc: "Les plus grands morceaux du moment et les clips les plus populaires." },
        { title: "Non-Stop Dance & Pop Party", desc: "Une sélection rythmée des meilleurs titres dance et pop mondiaux." },
        { title: "Concert Événement & Live Sessions", desc: "Les plus grands artistes en scène lors de tournées internationales." },
        { title: "Légendes & Tubes Rétro", desc: "Les trésors musicaux inoubliables des décennies passées." },
        { title: "Clubbing & Électro Mix", desc: "Les meilleurs sons de clubs et sessions DJ pour faire vibrer la soirée." },
        { title: "Nocturne Acoustique & Détente", desc: "Musiques douces, mélodies planantes et ambiance tamisée pour la nuit." }
      ],
      es: [
        { title: "Los Éxitos del Momento & Top Pop", desc: "Lo más escuchado en las listas mundiales y los videoclips de moda." },
        { title: "Fiesta Non-Stop & Ritmo Latino", desc: "Música continua para bailar con los temas más vibrantes del pop y dance." },
        { title: "Grandes Conciertos en Vivo", desc: "Actuaciones históricas en estadios multitudinarios y directos acústicos." },
        { title: "Clásicos Inolvidables & Generación Pop", desc: "Los temas que marcaron época en los 80, 90 y principios de los 2000." },
        { title: "Noche de Fiesta & Sesión DJ", desc: "La mejor música electrónica, mezclas de baile y ritmo para la noche." },
        { title: "Chillout de Madrugada & Baladas", desc: "Melodías relajantes, jazz suave y canciones acústicas para descansar." }
      ],
      ru: [
        { title: "Горячие хиты и чарт лучших треков", desc: "Самые популярные композиции недели и стильные музыкальные клипы." },
        { title: "Нон-стоп поп и танцевальный драйв", desc: "Энергичная музыка без перерывов для отличного настроения." },
        { title: "Живой концерт мировых звезд", desc: "Масштабные шоу со стадионов мира и живое акустическое звучание." },
        { title: "Золотые хиты и легендарный рок", desc: "Культовые мелодии прошлых десятилетий, любимые поколениями." },
        { title: "Клубный драйв и электронный бит", desc: "Современные диджейские сеты, хаус и танцевальная атмосфера вечера." },
        { title: "Ночной релакс и чиллаут", desc: "Спокойная мелодичная музыка, лаунж и уютные акустические треки." }
      ]
    },
    movies: {
      hu: [
        { title: "Délelőtti Matiné & Családi Vígjáték", desc: "Könnyed szórakozás, humor és felemelő történetek az egész családnak." },
        { title: "Kalandfilm & Akció Mozi", desc: "Látványos kalandok, hősök harca és pörgős akciójelenetek." },
        { title: "Délutáni Romantikus Dráma", desc: "Érzelmes történetek, emlékezetes találkozások és emberi sorsok." },
        { title: "Kulisszák Mögött: Mozi Magazin", desc: "Interjúk a színészekkel, premierhírek és a forgatások titkai." },
        { title: "Esti Sikerfilm: Főszerepben a Legendák", desc: "Díjnyertes hollywoodi és európai mesterművek főműsoridőben." },
        { title: "Éjszakai Thriller & Misztikus Kaland", desc: "Feszültség, rejtélyek és váratlan fordulatok a sötétben." }
      ],
      en: [
        { title: "Morning Comedy & Family Matinee", desc: "Heartwarming comedy and delightful storytelling for all ages." },
        { title: "Action Cinema & Blockbuster Adventure", desc: "High-octane excitement, thrilling chases and heroic spectacles." },
        { title: "Afternoon Romance & Drama", desc: "Compelling human drama, romance and critically acclaimed performances." },
        { title: "Behind the Lens: Hollywood Insider", desc: "Celebrity interviews, sneak peeks and upcoming box office releases." },
        { title: "Prime Time Feature Movie", desc: "Award-winning premiere film presentation in crystal-clear definition." },
        { title: "Late Night Psychological Thriller", desc: "Edge-of-your-seat suspense, mysteries and unpredictable twists." }
      ],
      de: [
        { title: "Familienkino & Gute-Laune-Film", desc: "Erfrischende Komödien und herzerwärmende Geschichten für jedermann." },
        { title: "Action-Abenteuer zur Mittagszeit", desc: "Spektakuläre Stunts, fesselnde Jagden und mitreißende Heldenreisen." },
        { title: "Großes Gefühlskino & Drama", desc: "Einfühlsame Geschichten, große Liebe und dramatische Wendepunkte." },
        { title: "Kino Aktuell: Stars & Premieren", desc: "Hinter den Kulissen der Traumfabrik mit den bekanntesten Stars." },
        { title: "Der Primetime Blockbuster", desc: "Großes Hollywood-Kino und preisgekrönte Filmhighlights zur besten Sendezeit." },
        { title: "Spätkino: Nervenkitzel & Thriller", desc: "Dunkle Geheimnisse, pure Hochspannung und packende Auflösungen." }
      ],
      fr: [
        { title: "Matinée Comédie & En Famille", desc: "Rires garantis et aventures chaleureuses à partager ensemble." },
        { title: "Cinéma Action & Frissons", desc: "Plein d'adrénaline avec des cascades grandioses et des combats épiques." },
        { title: "Drame Romantique & Passions", desc: "Récits intenses, destins croisés et chefs-d'œuvre du 7e art." },
        { title: "Côté Cinéma: Coulisses & Interviews", desc: "Dans les secrets de tournage avec les acteurs et réalisateurs renommés." },
        { title: "Le Grand Film du Soir", desc: "Le chef-d'œuvre incontournable de la soirée en version intégrale." },
        { title: "Frisson de Minuit & Thriller", desc: "Suspense haletant, atmosphère angoissante et énigmes complexes." }
      ],
      es: [
        { title: "Matinal Familiar y Comedia Divertida", desc: "Sonrisas y aventuras ligeras para disfrutar en compañía de toda la familia." },
        { title: "Cine de Acción y Grandes Hazañas", desc: "Emoción pura, persecuciones trepidantes y efectos visuales impactantes." },
        { title: "Drama y Romance de Tarde", desc: "Historias apasionantes, actuaciones premiadas y emociones a flor de piel." },
        { title: "Estrenos de Cartelera & Estrellas", desc: "Novedades cinematográficas, entrevistas exclusivas y secretos del rodaje." },
        { title: "La Gran Película de la Noche", desc: "Superproducción estelar con los actores más consagrados de la industria." },
        { title: "Cine de Suspense y Misterio Nocturno", desc: "Tensión constante, intrigas oscuras y desenlaces totalmente inesperados." }
      ],
      ru: [
        { title: "Утренний сеанс: Семейная комедия", desc: "Доброе кино, искрометный юмор и уютные истории для всей семьи." },
        { title: "Остросюжетный боевик и приключения", desc: "Динамичные погони, героические подвиги и захватывающие спецэффекты." },
        { title: "Дневная драма и романтическое кино", desc: "Глубокие чувства, сложные судьбы и великолепная игра актеров." },
        { title: "Мир кино: Премьеры и закулисье", desc: "Эксклюзивные репортажи со съемочных площадок и интервью со звездами." },
        { title: "Главный фильм вечера: Золотая коллекция", desc: "Шедевры мирового кинематографа и кассовые хиты в высоком качестве." },
        { title: "Ночной сеанс: Мистический детектив", desc: "Психологическое напряжение, запутанные тайны и неожиданная развязка." }
      ]
    },
    general: {
      hu: [
        { title: "Élőadás & Napi Mozaik", desc: "Aktuális beszélgetések, érdekes témák és szórakoztató műsorfolyam." },
        { title: "Életmód és Gasztro Magazin", desc: "Praktikus tippek, finom receptek és inspiráló utazási történetek." },
        { title: "Délutáni Szórakoztató Show", desc: "Játékok, vendégek a stúdióban és vidám pillanatok délutánra." },
        { title: "Kulturális Körkép & Trendek", desc: "A művészetek, színházak és kortárs trendek izgalmas világa." },
        { title: "Esti Magazin & Főműsor", desc: "A nap témái, sztárvendégek és exkluzív beszélgetések." },
        { title: "Éjszakai Társalgó", desc: "Kellemes hangulatú éjszakai beszélgetések és portréműsorok." }
      ],
      en: [
        { title: "Live Daily Magazine & Talk", desc: "Engaging conversations, trending topics and lifestyle showcases." },
        { title: "Lifestyle, Food & Travel", desc: "Culinary journeys, practical home ideas and inspiring destinations." },
        { title: "Afternoon Entertainment Special", desc: "Studio games, celebrity guests and uplifting stories." },
        { title: "Arts, Culture & Innovations", desc: "Exploration of modern cultural trends, theatre and creative minds." },
        { title: "Prime Time Variety Hour", desc: "Feature stories, prominent guests and lively evening entertainment." },
        { title: "Late Night Conversations", desc: "Relaxed in-depth interviews, inspiring personalities and thoughtful dialogue." }
      ],
      de: [
        { title: "Live-Magazin am Vormittag", desc: "Spannende Themen, aktuelle Tipps und lebendige Studiointerviews." },
        { title: "Genuss, Kochen & Lebensart", desc: "Kreative Rezeptideen, Reiseberichte und Lifestyle-Trends." },
        { title: "Unterhaltung am Nachmittag", desc: "Spiele, Gäste und humorvolle Momente für den Nachmittag." },
        { title: "Kultur, Kunst & Trends", desc: "Einblicke in die Welt der Künste, Kulturfestivals und neuer Ideen." },
        { title: "Große Abendshow zur Primetime", desc: "Die Hauptsendung des Abends mit prominenten Gästen und Musik." },
        { title: "Nachtcafé & Talkrunde", desc: "Persönliche Lebensgeschichten, nachdenkliche Gespräche zur späten Stunde." }
      ],
      fr: [
        { title: "Le Magazine en Direct", desc: "Échanges passionnants, sujets de société et ambiance conviviale." },
        { title: "Art de Vivre & Gastronomie", desc: "Découvertes culinaires, astuces bien-être et escapades magnifiques." },
        { title: "Divertissement de l'Après-midi", desc: "Jeux télévisés, sourires et anecdotes insolites d'invités sur le plateau." },
        { title: "Culture & Nouveaux Regards", desc: "Focus sur la création artistique, le patrimoine et l'actualité culturelle." },
        { title: "Le Grand Rendez-vous du Soir", desc: "L'émission phare de la soirée avec des personnalités marquantes." },
        { title: "Rencontres Nocturnes", desc: "Conversations intimistes et portraits émouvants pour clore la journée." }
      ],
      es: [
        { title: "Magazine en Directo y Actualidad", desc: "Temas de interés, entrevistas amenas y entretenimiento variado." },
        { title: "Gastronomía y Estilo de Vida", desc: "Rutas culinarias, consejos prácticos y destinos fascinantes." },
        { title: "Tarde de Entretenimiento", desc: "Concursos divertidos, famosos invitados y momentos inolvidables." },
        { title: "Cultura, Tendencias y Arte", desc: "Lo más llamativo de la escena cultural, exposiciones y vanguardia." },
        { title: "Gran Gala de la Noche", desc: "El programa estelar de la velada con espectáculo y figuras populares." },
        { title: "Tertulia de Madrugada", desc: "Diálogos pausados, historias de vida y reflexiones en tono nocturno." }
      ],
      ru: [
        { title: "Утренний интерактивный журнал", desc: "Интересные темы дня, полезные советы и живое общение с гостями." },
        { title: "Стиль жизни и кулинарные секреты", desc: "Вкусные рецепты, путешествия по удивительным местам и лайфхаки." },
        { title: "Дневное развлекательное шоу", desc: "Увлекательные конкурсы, звездные гости и отличное настроение." },
        { title: "Культура и искусство", desc: "Знакомство с театральными премьерами, выставками и новыми проектами." },
        { title: "Главный вечерний эфир", desc: "Центральное ток-шоу с известными личностями и яркими дискуссиями." },
        { title: "Ночные беседы при свечах", desc: "Искренние интервью, воспоминания и душевный разговор в студии." }
      ]
    }
  };

  function getGenre(channel) {
    const nameLower = (channel.name || '').toLowerCase();
    const groupLower = (channel.group || '').toLowerCase();

    if (channel.is_adult || nameLower.includes('xxx') || nameLower.includes('adult') || groupLower.includes('xxx')) {
      return 'adult';
    }
    if (nameLower.includes('sport') || nameLower.includes('foci') || nameLower.includes('arena') || nameLower.includes('match') ||
        nameLower.includes('eurosport') || nameLower.includes('espn') || nameLower.includes('racing') || nameLower.includes('m4') ||
        groupLower.includes('sport')) {
      return 'sports';
    }
    if (nameLower.includes('music') || nameLower.includes('zene') || nameLower.includes('mtv') || nameLower.includes('hit') ||
        nameLower.includes('rock') || nameLower.includes('pop') || nameLower.includes('dance') || nameLower.includes('jazz') ||
        nameLower.includes('vh1') || groupLower.includes('music') || groupLower.includes('zene')) {
      return 'music';
    }
    if (nameLower.includes('film') || nameLower.includes('movie') || nameLower.includes('cinema') || nameLower.includes('action') ||
        nameLower.includes('comedy') || nameLower.includes('hbo') || nameLower.includes('sorozat') || nameLower.includes('mozi') ||
        groupLower.includes('film') || groupLower.includes('movie')) {
      return 'movies';
    }
    if (nameLower.includes('news') || nameLower.includes('hír') || nameLower.includes('info') || nameLower.includes('24') ||
        nameLower.includes('cnn') || nameLower.includes('bbc') || nameLower.includes('dw') || nameLower.includes('euronews') ||
        nameLower.includes('bloomberg') || /\brt\b/.test(nameLower) || nameLower.includes('france 24') || nameLower.includes('al jazeera') ||
        groupLower.includes('news') || groupLower.includes('hír')) {
      return 'news';
    }
    if (nameLower.includes('geo') || nameLower.includes('nat') || nameLower.includes('discovery') || nameLower.includes('history') ||
        nameLower.includes('planet') || nameLower.includes('wild') || nameLower.includes('science') || nameLower.includes('spektrum') ||
        groupLower.includes('doc')) {
      return 'news'; // documentaries match news/informative structure
    }
    return 'general';
  }

  function generateSchedule(channel, lang) {
    if (!DICTIONARY[lang]) lang = 'hu';
    const genre = getGenre(channel);

    let slots = null;
    if (genre === 'adult') {
      slots = [
        { title: "Exkluzív Éjszakai Műsor", desc: "Felnőtt tartalom és érzéki filmek folyamatos vetítése." },
        { title: "Late Night Romance", desc: "Prémium felnőtt szórakoztatás." },
        { title: "Midnight Passion", desc: "Éjszakai erotikus válogatás." }
      ];
    } else {
      const templateGenre = SCHEDULE_TEMPLATES[genre] || SCHEDULE_TEMPLATES.general;
      slots = templateGenre[lang] || templateGenre.hu || SCHEDULE_TEMPLATES.general.hu;
    }

    const now = new Date();
    let startHour = now.getHours();
    let startMin = now.getMinutes() < 30 ? 0 : 30;

    const schedule = [];
    for (let i = 0; i < slots.length; i++) {
      const durationMin = (i % 2 === 0) ? 60 : 90;
      const sh = String(startHour % 24).padStart(2, '0');
      const sm = String(startMin).padStart(2, '0');

      const endTotalMin = startHour * 60 + startMin + durationMin;
      const eh = String(Math.floor(endTotalMin / 60) % 24).padStart(2, '0');
      const em = String(endTotalMin % 60).padStart(2, '0');

      schedule.push({
        start: `${sh}:${sm}`,
        stop: `${eh}:${em}`,
        title: slots[i].title,
        desc: slots[i].desc
      });

      startHour = Math.floor(endTotalMin / 60) % 24;
      startMin = endTotalMin % 60;
    }

    return schedule;
  }

  function t(key, lang) {
    const l = lang || document.documentElement.lang || 'hu';
    const dict = DICTIONARY[l] || DICTIONARY.hu;
    return dict[key] || DICTIONARY.hu[key] || key;
  }

  return {
    DICTIONARY,
    t,
    generateSchedule
  };
})();
