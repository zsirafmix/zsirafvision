/**
 * ZsirafVision - Internationalization (i18n) & Dynamic EPG Engine
 * Version: 4.6.1
 * Supported Languages: Hungarian (hu), English (en), German (de), French (fr), Spanish (es), Russian (ru)
 */

window.ZsirafI18N = (function () {
  'use strict';

  const DICTIONARY = {
    hu: {
      favCategory: '⭐ Kedvencek',
      favEmpty: 'Még nincsenek kedvenc csatornáid. Kattints a csillag (⭐) ikonra a hozzáadáshoz!',
      btnSleep: '🌙 IDŐZÍTŐ',
      sleepModalTitle: '🌙 ELALVÁSIDŐZÍTŐ',
      sleepOff: 'Kikapcsolva',
      sleep15: '15 perc',
      sleep30: '30 perc',
      sleep45: '45 perc',
      sleep60: '60 perc',
      sleep90: '90 perc',
      sleep120: '120 perc',
      btnRemote: '📱 TÁVIRÁNYÍTÓ',
      remoteModalTitle: '📱 MOBIL TÁVIRÁNYÍTÓ',
      remoteScanDesc: 'Olvasd be a QR-kódot a telefonoddal a távirányító megnyitásához:',
      remoteWaiting: 'Várakozás a telefon csatlakozására...',
      remoteConnected: '🟢 Telefon csatlakoztatva! A távirányító aktív.',
      standbyTitle: 'KÉSZENLÉTI ÁLLAPOT',
      standbySubtitle: 'Az elalvásidőzítő leállította az adást. Kattints a bekapcsoláshoz!',
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
      sourceHu: "🇭🇺 Magyar Adások (122 csatorna)",
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
      footerCredit: '<strong>ZsirafVision</strong> &bull; Kristálytiszta HD Képminőség &bull; Valós Online Működés',
      btnHelp: "❓ SÚGÓ",
      helpModalTitle: "❓ HASZNÁLATI ÚTMUTATÓ & SÚGÓ",
      helpSearchPlaceholder: "🔍 Keresés az útmutatóban (pl. távirányító, kedvencek, gombok)...",
      helpFilterAll: "Mind",
      helpFilterNav: "Irányítás",
      helpFilterFeatures: "Funkciók",
      helpFilterRemote: "Távirányító",
      helpFilterTips: "Tippek & Trükkök",
      helpCloseBtn: "Bezárás",
      helpFooterNote: "💡 Tipp: A súgó bármikor megnyitható a billentyűzet H vagy ? gombjával is.",
    },
    en: {
      favCategory: '⭐ Favorites',
      favEmpty: 'No favorite channels yet. Click the star (⭐) icon on any channel to add it!',
      btnSleep: '🌙 SLEEP TIMER',
      sleepModalTitle: '🌙 SET SLEEP TIMER',
      sleepOff: 'Turn Off',
      sleep15: '15 min',
      sleep30: '30 min',
      sleep45: '45 min',
      sleep60: '60 min',
      sleep90: '90 min',
      sleep120: '120 min',
      btnRemote: '📱 REMOTE',
      remoteModalTitle: '📱 MOBILE REMOTE CONTROL',
      remoteScanDesc: 'Scan this QR code with your phone camera to open the remote:',
      remoteWaiting: 'Waiting for phone to connect...',
      remoteConnected: '🟢 Phone connected! Remote control is active.',
      standbyTitle: 'STANDBY MODE',
      standbySubtitle: 'Sleep timer paused the stream. Click to power on!',
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
      sourceHu: "🇭🇺 Hungarian TV (122 channels)",
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
      footerCredit: '<strong>ZsirafVision</strong> &bull; Crystal Clear HD Quality &bull; Live Online Streaming',
      btnHelp: "❓ HELP",
      helpModalTitle: "❓ USER MANUAL & HELP",
      helpSearchPlaceholder: "🔍 Search user guide (e.g. remote, favorites, keys)...",
      helpFilterAll: "All",
      helpFilterNav: "Navigation",
      helpFilterFeatures: "Features",
      helpFilterRemote: "Remote",
      helpFilterTips: "Tips & Tricks",
      helpCloseBtn: "Close",
      helpFooterNote: "💡 Tip: You can open this guide anytime by pressing H or ? on your keyboard.",
    },
    de: {
      favCategory: '⭐ Favoriten',
      favEmpty: 'Noch keine Favoriten vorhanden. Klicken Sie auf den Stern (⭐), um Kanäle hinzuzufügen!',
      btnSleep: '🌙 SLEEP-TIMER',
      sleepModalTitle: '🌙 SLEEP-TIMER EINSTELLEN',
      sleepOff: 'Ausschalten',
      sleep15: '15 Min.',
      sleep30: '30 Min.',
      sleep45: '45 Min.',
      sleep60: '60 Min.',
      sleep90: '90 Min.',
      sleep120: '120 Min.',
      btnRemote: '📱 FERNBEDIENUNG',
      remoteModalTitle: '📱 MOBILE FERNBEDIENUNG',
      remoteScanDesc: 'Scannen Sie diesen QR-Code mit dem Smartphone für die Fernbedienung:',
      remoteWaiting: 'Warten auf Smartphone-Verbindung...',
      remoteConnected: '🟢 Smartphone verbunden! Fernbedienung aktiv.',
      standbyTitle: 'STANDBY-MODUS',
      standbySubtitle: 'Sleep-Timer hat die Wiedergabe beendet. Zum Einschalten klicken!',
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
      sourceHu: "🇭🇺 Ungarisches Fernsehen (122 Kanäle)",
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
      footerCredit: '<strong>ZsirafVision</strong> &bull; Kristallklare HD-Qualität &bull; Live Online Streaming',
      btnHelp: "❓ HILFE",
      helpModalTitle: "❓ BEDIENUNGSANLEITUNG & HILFE",
      helpSearchPlaceholder: "🔍 Anleitung durchsuchen (z.B. Fernbedienung, Favoriten)...",
      helpFilterAll: "Alle",
      helpFilterNav: "Steuerung",
      helpFilterFeatures: "Funktionen",
      helpFilterRemote: "Fernbedienung",
      helpFilterTips: "Tipps & Tricks",
      helpCloseBtn: "Schließen",
      helpFooterNote: "💡 Tipp: Drücken Sie H oder ?, um die Hilfe jederzeit zu öffnen.",
    },
    fr: {
      favCategory: '⭐ Favoris',
      favEmpty: "Aucune chaîne favorite pour le moment. Cliquez sur l'étoile (⭐) pour en ajouter !",
      btnSleep: '🌙 MINUTERIE',
      sleepModalTitle: '🌙 MINUTERIE DE SOMMEIL',
      sleepOff: 'Désactivé',
      sleep15: '15 min',
      sleep30: '30 min',
      sleep45: '45 min',
      sleep60: '60 min',
      sleep90: '90 min',
      sleep120: '120 min',
      btnRemote: '📱 TÉLÉCOMMANDE',
      remoteModalTitle: '📱 TÉLÉCOMMANDE MOBILE',
      remoteScanDesc: 'Scannez ce code QR avec votre téléphone pour ouvrir la télécommande :',
      remoteWaiting: 'En attente de connexion du téléphone...',
      remoteConnected: '🟢 Téléphone connecté ! Télécommande active.',
      standbyTitle: 'MODE VEILLE',
      standbySubtitle: 'La minuterie a arrêté le flux. Cliquez pour rallumer !',
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
      sourceHu: "🇭🇺 Télévision hongroise (122 chaînes)",
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
      footerCredit: '<strong>ZsirafVision</strong> &bull; Qualité HD cristalline &bull; Streaming direct en ligne',
      btnHelp: "❓ AIDE",
      helpModalTitle: "❓ GUIDE D'UTILISATION & AIDE",
      helpSearchPlaceholder: "🔍 Rechercher dans le guide (ex: télécommande, favoris)...",
      helpFilterAll: "Tout",
      helpFilterNav: "Navigation",
      helpFilterFeatures: "Fonctions",
      helpFilterRemote: "Télécommande",
      helpFilterTips: "Trucs & Astuces",
      helpCloseBtn: "Fermer",
      helpFooterNote: "💡 Conseil : Vous pouvez ouvrir ce guide à tout moment en appuyant sur H ou ?.",
    },
    es: {
      favCategory: '⭐ Favoritos',
      favEmpty: 'Aún no tienes canales favoritos. ¡Haz clic en la estrella (⭐) para agregar!',
      btnSleep: '🌙 TEMPORIZADOR',
      sleepModalTitle: '🌙 TEMPORIZADOR DE APAGADO',
      sleepOff: 'Desactivado',
      sleep15: '15 min',
      sleep30: '30 min',
      sleep45: '45 min',
      sleep60: '60 min',
      sleep90: '90 min',
      sleep120: '120 min',
      btnRemote: '📱 CONTROL REMOTO',
      remoteModalTitle: '📱 CONTROL REMOTO MÓVIL',
      remoteScanDesc: 'Escanea este código QR con la cámara de tu teléfono:',
      remoteWaiting: 'Esperando conexión del teléfono...',
      remoteConnected: '🟢 ¡Teléfono conectado! El control remoto está activo.',
      standbyTitle: 'MODO DE ESPERA',
      standbySubtitle: 'El temporizador detuvo la emisión. ¡Haz clic para encender!',
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
      sourceHu: "🇭🇺 Televisión húngara (122 canales)",
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
      footerCredit: '<strong>ZsirafVision</strong> &bull; Calidad HD cristalina &bull; Transmisión en vivo',
      btnHelp: "❓ AYUDA",
      helpModalTitle: "❓ GUÍA DE USO Y AYUDA",
      helpSearchPlaceholder: "🔍 Buscar en la guía (ej. control remoto, favoritos)...",
      helpFilterAll: "Todo",
      helpFilterNav: "Control",
      helpFilterFeatures: "Funciones",
      helpFilterRemote: "Control Remoto",
      helpFilterTips: "Consejos y Trucos",
      helpCloseBtn: "Cerrar",
      helpFooterNote: "💡 Consejo: Puedes abrir esta guía en cualquier momento pulsando H o ? en el teclado.",
    },
    ru: {
      favCategory: '⭐ Избранное',
      favEmpty: 'В избранном пока пусто. Нажмите на звездочку (⭐), чтобы добавить канал!',
      btnSleep: '🌙 ТАЙМЕР СНА',
      sleepModalTitle: '🌙 НАСТРОЙКА ТАЙМЕРА СНА',
      sleepOff: 'Выключено',
      sleep15: '15 мин',
      sleep30: '30 мин',
      sleep45: '45 мин',
      sleep60: '60 мин',
      sleep90: '90 мин',
      sleep120: '120 мин',
      btnRemote: '📱 ПУЛЬТ',
      remoteModalTitle: '📱 МОБИЛЬНЫЙ ПУЛЬТ',
      remoteScanDesc: 'Отсканируйте этот QR-код камерой телефона для запуска пульта:',
      remoteWaiting: 'Ожидание подключения телефона...',
      remoteConnected: '🟢 Телефон подключен! Пульт управления активен.',
      standbyTitle: 'РЕЖИМ ОЖИДАНИЯ',
      standbySubtitle: 'Таймер сна завершил трансляцию. Нажмите для включения!',
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
      sourceHu: "🇭🇺 Венгерские каналы (122 канал)",
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
      footerCredit: '<strong>ZsirafVision</strong> &bull; Кристально чистое HD качество &bull; Онлайн трансляция',
      btnHelp: "❓ СПРАВКА",
      helpModalTitle: "❓ РУКОВОДСТВО ПОЛЬЗОВАТЕЛЯ И СПРАВКА",
      helpSearchPlaceholder: "🔍 Поиск по руководству (напр.: пульт, избранное)...",
      helpFilterAll: "Все",
      helpFilterNav: "Управление",
      helpFilterFeatures: "Функции",
      helpFilterRemote: "Пульт",
      helpFilterTips: "Советы и хитрости",
      helpCloseBtn: "Закрыть",
      helpFooterNote: "💡 Совет: Вы можете открыть эту справку клавишей H или ? в любой момент.",
    }
  };


  const HELP_GUIDE = {
  "hu": [
    {
      "id": "live_tv",
      "category": "nav",
      "icon": "📺",
      "title": "Élő Adások & Csatornaváltás",
      "summary": "122 élő magyar televízióadó és nemzetközi műsorok közötti villámgyors navigáció.",
      "details": [
        "**Csatornaváltás:** Használd a képernyő alatti ◀ ELŐZŐ és KÖVETKEZŐ ▶ gombokat, vagy a billentyűzeten a Fel/Le és Balra/Jobbra nyilakat.",
        "**Közvetlen számválasztás:** Üsd be a kívánt csatornaszámot a billentyűzeten (pl. 1, 5, 12) az azonnali odaugráshoz.",
        "**OSD információs sáv:** Csatornaváltáskor a képernyő tetején megjelenik a csatorna száma, neve, felbontása és műfaja.",
        "**Hangerő és némítás:** Szabályozd a hangot a + / - gombokkal, vagy némítsd el az M billentyűvel."
      ]
    },
    {
      "id": "guide_search",
      "category": "nav",
      "icon": "📋",
      "title": "Csatornalista & Keresés",
      "summary": "Minden adó egyetlen áttekinthető oldalsávban, azonnali kereséssel és kategóriaszűréssel.",
      "details": [
        "**Megnyitás:** Kattints a 📋 CSATORNALISTA gombra vagy nyomd meg a C billentyűt a billentyűzeten.",
        "**Keresőmező:** Írj be bármilyen kifejezést (pl. RTL, Sport, Zene, Film) az azonnali szűréshez. Érintőképernyőn a billentyűzet csak rákattintáskor ugrik fel.",
        "**Kategóriaszűrők:** Szűrj egyetlen kattintással: Közszolgálati, Kereskedelmi, Filmek, Hírek, Sport, Zene, Gyermek vagy ⭐ Kedvencek.",
        "**Nemzetközi adások:** A lista tetején lévő forrásválasztóval átkapcsolhatsz a világcsatornákra (iptv-org)."
      ]
    },
    {
      "id": "favorites",
      "category": "features",
      "icon": "⭐",
      "title": "Kedvencek Rendszer",
      "summary": "Jelöld meg kedvenc adóidat a villámgyors eléréshez.",
      "details": [
        "**Csillagozás a képernyőn:** Kattints a felső OSD sáv jobb oldalán lévő csillag (⭐) ikonra a nézett csatorna elmentéséhez.",
        "**Csillagozás a listában:** A csatornalistában minden adó jobb szélén található csillag ikonra kattintva is hozzáadhatod vagy törölheted.",
        "**⭐ Kedvencek kategória:** A csatornalista fejlécében megjelenő Kedvencek fülre kattintva csak a kiválasztott adók jelennek meg számlálóval.",
        "**Tartós megjegyzés:** A kedvencek listáját a böngésző megbízhatóan elmenti a gép tárhelyére (localStorage)."
      ]
    },
    {
      "id": "epg",
      "category": "features",
      "icon": "📅",
      "title": "Műsorújság (EPG)",
      "summary": "Részletes, több idősávos műsorfolyam minden adóhoz a kiválasztott nyelven.",
      "details": [
        "**Megnyitás:** Kattints a 📅 MŰSORÚJSÁG gombra vagy nyomd meg a P billentyűt a bal oldali sáv kinyitásához.",
        "**Élő és következő adások:** Valós idejű idősávok, a jelenleg futó adás mellett világító 'ÉLŐBEN' jelvénnyel.",
        "**Részletes leírások:** A műsorok címe mellett összefoglaló szöveg olvasható az epizódokról, témákról és szereplőkről.",
        "**Többnyelvű lefedettség:** A magyar adók hivatalos XMLTV adatai mellett a nemzetközi adásokhoz intelligens műsorgenerátor társul az aktív nyelven."
      ]
    },
    {
      "id": "sleep_timer",
      "category": "features",
      "icon": "🌙",
      "title": "Elalvásidőzítő & Készenléti Mód",
      "summary": "Automatikus elalvásidőzítő lágy hangerő-lehalkítással és energiatakarékos Standby képernyővel.",
      "details": [
        "**Időzítő beállítása:** Kattints a 🌙 IDŐZÍTŐ gombra, és válaszd ki a kívánt időtartamot: 15, 30, 45, 60, 90 vagy 120 perc.",
        "**Visszaszámlálás:** A vezérlősáv gombján folyamatosan látható a hátralévő percek és másodpercek száma.",
        "**Lágy lehalkítás (Fade-out):** A lejárás előtti utolsó 10 másodpercben a hangerő finoman elhalkul, megelőzve a hirtelen csendet.",
        "**Készenléti (Standby) állapot:** Lejáratkor a videó stream leáll, sötét retro képernyő jelenik meg világító piros LED-del. Kattintással azonnal visszakapcsolható a TV."
      ]
    },
    {
      "id": "remote",
      "category": "remote",
      "icon": "📱",
      "title": "Mobil Távirányító (QR-kód & MQTT)",
      "summary": "Irányítsd a számítógépen vagy okostévén futó adást a telefonoddal, zéró telepítéssel!",
      "details": [
        "**Párosítás indítása:** Kattints a TV vezérlősávjában a 📱 TÁVIRÁNYÍTÓ gombra a párosító QR-kód és a 4 betűs szobakód megjelenítéséhez.",
        "**Beolvasás telefonnal:** Nyisd meg a telefon kameráját és olvasd be a QR-kódot (vagy látogass el a remote.html oldalra a megadott kóddal).",
        "**Azonnali felhős MQTT kapcsolat:** A legújabb v3.9-es architektúra a mobilnetes Symmetric NAT és tűzfalak korlátait áttörve <200 ms alatt zöldre vált (🟢 TV Csatlakoztatva).",
        "**Teljes vezérlés:** CH+/CH-, VOL+/VOL-, Mute, 0-9 számbillentyűk, OK, Guide, EPG, Kedvenc, Teljes képernyő, Sleep gombok és haptikus rezgés.",
        "**Kétirányú mini CRT kijelző:** A távirányító képernyőjén valós időben látható az éppen játszott adó neve, száma, műfaja és a pontos hangerő."
      ]
    },
    {
      "id": "pwa",
      "category": "features",
      "icon": "📲",
      "title": "Telepíthető PWA Zsebtévé",
      "summary": "Tedd ki a kezdőképernyőre és élvezd a fekvő tájolású, teljes képernyős hordozható televíziót.",
      "details": [
        "**Hozzáadás kezdőképernyőhöz:** Mobilon vagy tableten a böngésző menüjében válaszd a 'Hozzáadás a kezdőképernyőhöz' vagy 'Alkalmazás telepítése' opciót.",
        "**Valódi televízió élmény:** Az app megnyitásakor nincsenek zavaró böngészősávok, automatikusan fekvő (landscape) teljes képernyőn indul el.",
        "**Dedikált retro ikonok:** Külön 192x192 és 512x512 képpontos arany kávás retro TV ikon jelenik meg a telefonod asztalán.",
        "**Gyorsítótárazás:** A Service Worker villámgyors betöltést biztosít a felületi elemek számára."
      ]
    },
    {
      "id": "language",
      "category": "features",
      "icon": "🌐",
      "title": "Többnyelvű Kezelőfelület (6 Nyelv)",
      "summary": "Válts nyelvet bármikor a vezérlősávban vagy a csatornalistában.",
      "details": [
        "**Elérhető nyelvek:** 🇭🇺 Magyar, 🇬🇧 Angol, 🇩🇪 Német, 🇫🇷 Francia, 🇪🇸 Spanyol és 🇷🇺 Orosz.",
        "**Gyorsváltók:** A televízió alsó sávjában lévő lenyíló menüből vagy a csatornalista fejlécéből egyetlen kattintással válthatsz.",
        "**Automatikus felismerés:** Az első megnyitáskor az oldal megpróbálja felismerni a böngésződ alapértelmezett nyelvét.",
        "**Megjegyzés:** A választott nyelvet a rendszer elmenti a gép tárhelyére a következő használatra."
      ]
    },
    {
      "id": "controls",
      "category": "nav",
      "icon": "⌨️",
      "title": "Billentyűzet & Okostévé Vezérlés",
      "summary": "Irányítsd az adást kényelmesen billentyűzettel vagy Samsung Tizen / LG webOS távirányítóval.",
      "details": [
        "**Csatornaváltás:** <kbd>Fel</kbd> / <kbd>Le</kbd> vagy <kbd>Jobbra</kbd> / <kbd>Balra</kbd> nyilak; Okostévén: <kbd>Channel Up / Down</kbd>.",
        "**Hangerő:** <kbd>+</kbd> és <kbd>-</kbd> billentyűk a hangerő finombeállításához; <kbd>M</kbd> a hang azonnali némításához.",
        "**Teljes képernyő:** <kbd>F</kbd> billentyű vagy dupla kattintás a videóra a moziélményhez.",
        "**Panelek megnyitása:** <kbd>C</kbd> a csatornalistához, <kbd>P</kbd> a műsorújsághoz, <kbd>H</kbd> vagy <kbd>?</kbd> a használati útmutatóhoz.",
        "**Bezárás / Kilépés:** <kbd>Escape</kbd> vagy Okostévé távirányítón a <kbd>Return / Vissza (10009)</kbd> gomb azonnal bezárja az ablakokat.",
        "**Számbillentyűk:** <kbd>0</kbd>–<kbd>9</kbd> billentyűk a csatornaszám közvetlen beütéséhez."
      ]
    },
    {
      "id": "stats_report",
      "category": "tips",
      "icon": "⚙️",
      "title": "Technikai Adatok & Hibajelentő",
      "summary": "Valós idejű stream diagnosztika és azonnali adáshiba bejelentés a TV káváján.",
      "details": [
        "**Technikai adatok (⚙):** Kattints az alsó sávban lévő TECHNIKAI ADATOK gombra az élő hálózati ping, felbontás, bitráta, puffer és eldobott képkockák megtekintéséhez.",
        "**Piros Hibajelentő gomb:** A TV káváján jobb oldalon található világító piros gombra kattintva bármikor beküldhetsz egy automatikus diagnosztikai jelentést a felhős szerverre.",
        "**Megjegyzés fűzése:** A hibajelentésnél opcionálisan megadhatsz részleteket (pl. 'nincs hang', 'szaggat a videó').",
        "**100% Felhő alapú:** Minden adat a Cloudflare Worker proxy végponton keresztül kerül feldolgozásra."
      ]
    }
  ],
  "en": [
    {
      "id": "live_tv",
      "category": "nav",
      "icon": "📺",
      "title": "Live TV & Channel Navigation",
      "summary": "Blazing fast navigation across 122 live Hungarian channels and international streams.",
      "details": [
        "**Channel Surfing:** Use the ◀ PREV and NEXT ▶ buttons below the TV, or the Arrow keys (Up/Down/Left/Right) on your keyboard.",
        "**Direct Number Tuning:** Type any channel number on your numeric keypad (e.g. 1, 5, 12) to switch instantly.",
        "**OSD Banner:** When switching channels, the on-screen display shows the channel number, title, resolution and genre.",
        "**Volume & Mute:** Adjust volume using + / - keys, or toggle mute with the M key."
      ]
    },
    {
      "id": "guide_search",
      "category": "nav",
      "icon": "📋",
      "title": "Channel Guide & Instant Search",
      "summary": "Browse all channels in a drawer with real-time fuzzy search and category filters.",
      "details": [
        "**Open Guide:** Click the 📋 CHANNEL GUIDE button or press the C key on your keyboard.",
        "**Instant Search:** Type any channel title or genre (e.g. News, Sport, Music, Movie). On mobile, the virtual keyboard stays hidden until tapped.",
        "**Category Chips:** Filter by National, Commercial, Movies, News, Sports, Music, Kids or ⭐ Favorites.",
        "**World Channels:** Switch the source dropdown at the top of the drawer to explore international channels (iptv-org)."
      ]
    },
    {
      "id": "favorites",
      "category": "features",
      "icon": "⭐",
      "title": "Favorites System",
      "summary": "Bookmark your preferred channels for instant, one-click access.",
      "details": [
        "**Star on Screen:** Click the star (⭐) icon on the right side of the on-screen OSD banner to favorite the current channel.",
        "**Star in Channel List:** Click the star next to any channel item in the drawer to toggle favorite status.",
        "**⭐ Favorites Tab:** Click the Favorites category chip in the channel guide to view only your saved channels with an active count badge.",
        "**Persistent Storage:** Your favorite channels are securely stored in your browser's local storage."
      ]
    },
    {
      "id": "epg",
      "category": "features",
      "icon": "📅",
      "title": "Electronic Programme Guide (EPG)",
      "summary": "Multi-slot programming guide for all channels in your selected interface language.",
      "details": [
        "**Open Guide:** Click the 📅 TV GUIDE button or press the P key to toggle the left-hand EPG panel.",
        "**Now Playing & Upcoming:** Real-time time slots with an active glowing 'LIVE' badge on current programs.",
        "**Program Details:** Read detailed summaries, plot synopses, episode numbers and presenter info.",
        "**Global Language Support:** Official XMLTV guides for Hungarian broadcasts and real-time multilingual guides for international channels."
      ]
    },
    {
      "id": "sleep_timer",
      "category": "features",
      "icon": "🌙",
      "title": "Sleep Timer & Standby Mode",
      "summary": "Automatic bedtime shutdown with smooth audio fade-out and energy-saving Standby screen.",
      "details": [
        "**Set Timer:** Click the 🌙 SLEEP TIMER button and pick a duration: 15, 30, 45, 60, 90 or 120 minutes.",
        "**Live Countdown:** The button displays remaining minutes and seconds in real time.",
        "**Smooth Audio Fade-out:** During the final 10 seconds before expiration, volume gently fades to zero.",
        "**Standby Screen:** Upon timer expiration, the video stream stops and a retro standby screen appears with a glowing red LED. Click the power button to turn it back on."
      ]
    },
    {
      "id": "remote",
      "category": "remote",
      "icon": "📱",
      "title": "Mobile Remote Control (QR & MQTT)",
      "summary": "Control your TV playback from your smartphone with zero installation or local server required.",
      "details": [
        "**Start Pairing:** Click the 📱 REMOTE button on the TV controls bar to reveal your pairing QR code and 4-letter room code.",
        "**Scan with Phone:** Open your smartphone camera and scan the QR code (or visit remote.html and enter the code).",
        "**Instant Cloud MQTT Bridge:** Powered by v3.9 MQTT over WSS, it bypasses mobile CGNAT/Symmetric NAT in under 200ms with a solid green connection dot (🟢 TV Connected).",
        "**Complete Controls:** CH+/CH-, VOL+/VOL-, Mute, 0-9 numpad, OK, Guide, EPG, Favorite toggle, Fullscreen, Sleep timer and haptic vibration.",
        "**Bidirectional Mini CRT Display:** Your phone displays live feedback of the current channel name, number, genre and volume level."
      ]
    },
    {
      "id": "pwa",
      "category": "features",
      "icon": "📲",
      "title": "Installable PWA Pocket TV",
      "summary": "Pin to your home screen for a fullscreen, landscape-oriented retro portable television experience.",
      "details": [
        "**Add to Home Screen:** In your mobile browser menu, tap 'Add to Home Screen' or 'Install App'.",
        "**Fullscreen Immersion:** Launches without browser address bars, locking directly into widescreen landscape orientation.",
        "**Custom Retro Icons:** Features tailored 192x192 and 512x512 gold-trimmed CRT icons on your device launcher.",
        "**Cached UI Shell:** Powered by Service Worker for rapid startup of all interface components."
      ]
    },
    {
      "id": "language",
      "category": "features",
      "icon": "🌐",
      "title": "Multilingual Interface (6 Languages)",
      "summary": "Switch between 6 world languages anytime from the controls bar or channel drawer.",
      "details": [
        "**Supported Languages:** 🇭🇺 Hungarian, 🇬🇧 English, 🇩🇪 German, 🇫🇷 French, 🇪🇸 Spanish and 🇷🇺 Russian.",
        "**Quick Switchers:** Change language anytime via the dropdown in the bottom control bar or the drawer header.",
        "**Auto-detection:** Automatically detects your device or browser locale on first visit.",
        "**Preference Memory:** Your selected language is securely remembered across visits."
      ]
    },
    {
      "id": "controls",
      "category": "nav",
      "icon": "⌨️",
      "title": "Keyboard & Smart TV Controls",
      "summary": "Effortlessly control your viewing with keyboard shortcuts or Samsung Tizen / LG webOS remotes.",
      "details": [
        "**Channel Switch:** <kbd>Up</kbd> / <kbd>Down</kbd> or <kbd>Left</kbd> / <kbd>Right</kbd> arrows; On Smart TV: <kbd>Channel Up / Down</kbd> buttons.",
        "**Volume:** <kbd>+</kbd> and <kbd>-</kbd> keys for precise audio steps; <kbd>M</kbd> to toggle mute.",
        "**Fullscreen:** <kbd>F</kbd> key or double-click the video screen for cinema view.",
        "**Panels:** <kbd>C</kbd> opens Channel Guide, <kbd>P</kbd> opens EPG, <kbd>H</kbd> or <kbd>?</kbd> opens this User Manual.",
        "**Close / Back:** <kbd>Escape</kbd> or Smart TV <kbd>Return / Back (10009)</kbd> closes any open drawer or modal.",
        "**Direct Numbers:** <kbd>0</kbd>–<kbd>9</kbd> keys tune directly to channel numbers."
      ]
    },
    {
      "id": "stats_report",
      "category": "tips",
      "icon": "⚙️",
      "title": "Stream Diagnostics & Error Reporter",
      "summary": "Real-time technical stats and one-click broadcast error reporting right from the cabinet.",
      "details": [
        "**Technical Stats (⚙):** Click the TECHNICAL STATS button in the bottom bar to view live server ping, stream resolution, bitrate, buffer health and dropped frames.",
        "**Red Report Button:** Click the glowing red button on the TV bezel to submit an automated diagnostic crash report directly to the cloud.",
        "**Optional Note:** You can describe the issue (e.g. 'no sound', 'stuttering video') before sending.",
        "**100% Cloud Powered:** Processed seamlessly via our Cloudflare Worker proxy backend."
      ]
    }
  ],
  "de": [
    {
      "id": "live_tv",
      "category": "nav",
      "icon": "📺",
      "title": "Live-TV & Kanalwechsel",
      "summary": "Blitzschnelle Navigation zwischen 122 ungarischen Live-Sendern und internationalen Streams.",
      "details": [
        "**Kanalwechsel:** Nutzen Sie die Tasten ◀ VORHERIGER und NÄCHSTER ▶ unter dem Fernseher oder die Pfeiltasten (Auf/Ab/Links/Rechts).",
        "**Direkte Nummernwahl:** Geben Sie die Kanalnummer über die Zifferntasten ein (z.B. 1, 5, 12), um direkt umzuschalten.",
        "**OSD-Statusleiste:** Beim Umschalten erscheinen Kanalnummer, Name, Auflösung und Genre oben auf dem Bildschirm.",
        "**Lautstärke & Stummschaltung:** Regeln Sie den Ton mit + / - oder schalten Sie mit M stumm."
      ]
    },
    {
      "id": "guide_search",
      "category": "nav",
      "icon": "📋",
      "title": "Kanalliste & Schnellsuche",
      "summary": "Alle Sender in einer übersichtlichen Seitenleiste mit Echtzeitsuche und Kategoriefiltern.",
      "details": [
        "**Öffnen:** Klicken Sie auf 📋 KANALLISTE oder drücken Sie die Taste C auf der Tastatur.",
        "**Suchleiste:** Geben Sie einen Namen oder ein Genre ein (z.B. Sport, Musik, Film). Auf Mobilgeräten öffnet sich die Tastatur erst beim Antippen.",
        "**Kategorien:** Filtern Sie mit einem Klick nach Öffentlich, Film, Nachrichten, Sport, Musik, Kinder oder ⭐ Favoriten.",
        "**Weltweite Sender:** Wechseln Sie im oberen Auswahlmenü zu internationalen Sendern (iptv-org)."
      ]
    },
    {
      "id": "favorites",
      "category": "features",
      "icon": "⭐",
      "title": "Favoritensystem",
      "summary": "Markieren Sie Ihre Lieblingssender für blitzschnellen Zugriff.",
      "details": [
        "**Stern auf dem Bildschirm:** Klicken Sie auf den Stern (⭐) im oberen OSD-Banner, um den aktuellen Sender zu speichern.",
        "**Stern in der Kanalliste:** Klicken Sie auf den Stern neben einem beliebigen Sender in der Liste.",
        "**⭐ Favoriten-Reiter:** Klicken Sie auf die Kategorie Favoriten, um nur Ihre gespeicherten Kanäle anzuzeigen.",
        "**Dauerhaft gespeichert:** Ihre Favoriten bleiben im lokalen Speicher Ihres Browsers erhalten."
      ]
    },
    {
      "id": "epg",
      "category": "features",
      "icon": "📅",
      "title": "Elektronischer Programmführer (EPG)",
      "summary": "Detailliertes Programm für jeden Kanal in Ihrer ausgewählten Sprache.",
      "details": [
        "**Öffnen:** Klicken Sie auf 📅 PROGRAMM oder drücken Sie P, um das linke EPG-Fenster zu öffnen.",
        "**Jetzt & Danach:** Genaue Sendezeiten mit leuchtendem 'LIVE'-Abzeichen für die aktuelle Sendung.",
        "**Sendungsdetails:** Lesen Sie Inhaltsangaben, Themen und Episodenbeschreibungen.",
        "**Mehrsprachige Abdeckung:** Offizielle XMLTV-Daten für ungarische Sender und dynamische Programmübersichten für internationale Kanäle."
      ]
    },
    {
      "id": "sleep_timer",
      "category": "features",
      "icon": "🌙",
      "title": "Schlaf-Timer & Standby-Modus",
      "summary": "Automatisches Abschalten mit sanftem Audio-Fade-out und stromsparendem Standby-Bildschirm.",
      "details": [
        "**Timer stellen:** Klicken Sie auf 🌙 TIMER und wählen Sie 15, 30, 45, 60, 90 oder 120 Minuten.",
        "**Live-Countdown:** Auf der Schaltfläche wird die verbleibende Zeit sekundengenau angezeigt.",
        "**Sanftes Ausblenden:** In den letzten 10 Sekunden wird die Lautstärke stufenlos gedämpft.",
        "**Standby-Zustand:** Nach Ablauf stoppt der Stream und ein dunkler Bildschirm mit roter LED erscheint. Ein Klick schaltet den Fernseher wieder ein."
      ]
    },
    {
      "id": "remote",
      "category": "remote",
      "icon": "📱",
      "title": "Smartphone-Fernbedienung (QR & MQTT)",
      "summary": "Steuern Sie Ihren Fernseher bequem per Smartphone ohne Installation oder lokalen Server.",
      "details": [
        "**Kopplung starten:** Klicken Sie auf 📱 FERNBEDIENUNG, um den QR-Code und den 4-stelligen Raumcode anzuzeigen.",
        "**Mit dem Telefon scannen:** Scannen Sie den QR-Code mit der Handykamera (oder öffnen Sie remote.html mit dem Code).",
        "**Sofortige MQTT-Cloud-Verbindung:** Überwindet dank v3.9 WSS alle Mobilfunk-NAT-Grenzen in unter 200 ms (🟢 Fernseher verbunden).",
        "**Volle Kontrolle:** CH+/CH-, VOL+/VOL-, Stumm, 0-9 Ziffernblock, OK, Guide, EPG, Favoriten, Vollbild, Sleep und haptisches Feedback.",
        "**Zwei-Wege-Mini-CRT-Display:** Das Smartphone zeigt Kanalname, Nummer, Genre und die aktuelle Lautstärke in Echtzeit an."
      ]
    },
    {
      "id": "pwa",
      "category": "features",
      "icon": "📲",
      "title": "Installierbare PWA Taschenfernseher-App",
      "summary": "Auf dem Startbildschirm ablegen und das tragbare Vollbild-Fernseherlebnis im Querformat genießen.",
      "details": [
        "**Zum Startbildschirm hinzufügen:** Wählen Sie im Browsermenü 'Zum Startbildschirm hinzufügen' oder 'App installieren'.",
        "**Echtes TV-Gefühl:** Startet ohne Browserleisten direkt im Vollbild-Querformat.",
        "**Retro-Symbole:** Spezielle 192x192 und 512x512 CRT-Fernseher-Symbole auf Ihrem Bildschirm.",
        "**Schneller Start:** Der Service Worker sorgt für blitzschnelles Laden der Bedienoberfläche."
      ]
    },
    {
      "id": "language",
      "category": "features",
      "icon": "🌐",
      "title": "Mehrsprachige Benutzeroberfläche (6 Sprachen)",
      "summary": "Wechseln Sie jederzeit zwischen 6 Sprachen in der Steuerleiste oder der Kanalliste.",
      "details": [
        "**Verfügbare Sprachen:** 🇭🇺 Ungarisch, 🇬🇧 Englisch, 🇩🇪 Deutsch, 🇫🇷 Französisch, 🇪🇸 Spanisch und 🇷🇺 Russisch.",
        "**Schnellwechsel:** Über das Menü in der unteren Leiste oder im Kopf der Kanalliste umschalten.",
        "**Automatische Erkennung:** Erkennt beim ersten Start automatisch Ihre Browsersprache.",
        "**Gespeicherte Einstellung:** Ihre Sprachwahl bleibt bei zukünftigen Besuchen gespeichert."
      ]
    },
    {
      "id": "controls",
      "category": "nav",
      "icon": "⌨️",
      "title": "Tastatur- & Smart-TV-Steuerung",
      "summary": "Bequeme Steuerung mit Tastenkürzeln oder der Samsung Tizen / LG webOS Fernbedienung.",
      "details": [
        "**Kanalwechsel:** Pfeile <kbd>Auf</kbd> / <kbd>Ab</kbd> oder <kbd>Rechts</kbd> / <kbd>Links</kbd>; auf Smart-TVs: <kbd>Kanal +/-</kbd>.",
        "**Lautstärke:** Tasten <kbd>+</kbd> und <kbd>-</kbd>; <kbd>M</kbd> für sofortige Stummschaltung.",
        "**Vollbild:** Taste <kbd>F</kbd> oder Doppelklick auf das Bild.",
        "**Fenster:** <kbd>C</kbd> für Kanalliste, <kbd>P</kbd> für Programm, <kbd>H</kbd> oder <kbd>?</kbd> für diese Anleitung.",
        "**Zurück:** <kbd>Escape</kbd> oder Smart-TV <kbd>Return (10009)</kbd> schließt geöffnete Dialoge.",
        "**Ziffern:** <kbd>0</kbd>–<kbd>9</kbd> für direkte Kanalanwahl."
      ]
    },
    {
      "id": "stats_report",
      "category": "tips",
      "icon": "⚙️",
      "title": "Stream-Diagnose & Fehlerbericht",
      "summary": "Echtzeit-Statistiken und Ein-Klick-Störungsmeldung direkt am Fernsehgehäuse.",
      "details": [
        "**Technische Daten (⚙):** Klicken Sie auf TECHNISCHE DATEN in der Leiste für Ping, Auflösung, Bitrate und Pufferstatus.",
        "**Rote Meldetaste:** Ein Klick auf die rote Taste am Fernsehrahmen sendet Diagnosedaten direkt an den Cloud-Server.",
        "**Notiz hinzufügen:** Sie können optional Details angeben (z.B. 'Kein Ton', 'Bild ruckelt').",
        "**100% Cloud-basiert:** Schnelle Übertragung über den Vercel Serverless Proxy."
      ]
    }
  ],
  "fr": [
    {
      "id": "live_tv",
      "category": "nav",
      "icon": "📺",
      "title": "TV en direct & Changement de chaîne",
      "summary": "Navigation ultra-rapide parmi 122 chaînes hongroises en direct et flux internationaux.",
      "details": [
        "**Zapping :** Utilisez les boutons ◀ PRÉCÉDENT et SUIVANT ▶ sous le téléviseur ou les touches fléchées (Haut/Bas/Gauche/Droite).",
        "**Sélection directe par numéro :** Tapez le numéro de chaîne sur votre clavier (ex: 1, 5, 12) pour zapper instantanément.",
        "**Bandeau OSD :** Lors du changement, le numéro de chaîne, le nom, la résolution et le genre s'affichent à l'écran.",
        "**Volume et sourdine :** Réglez le son avec les touches + / - ou coupez le son avec la touche M."
      ]
    },
    {
      "id": "guide_search",
      "category": "nav",
      "icon": "📋",
      "title": "Liste des Chaînes & Recherche",
      "summary": "Toutes les chaînes dans un panneau latéral avec recherche en direct et filtres par catégorie.",
      "details": [
        "**Ouvrir la liste :** Cliquez sur 📋 LISTE DES CHAÎNES ou appuyez sur la touche C.",
        "**Recherche instantanée :** Tapez le nom ou le genre (ex: Sport, Musique, Film). Sur mobile, le clavier n'apparaît qu'au toucher.",
        "**Filtres de catégories :** Filtrez facilement : Généraliste, Films, Infos, Sports, Musique, Jeunesse ou ⭐ Favoris.",
        "**Chaînes mondiales :** Changez la source en haut du panneau pour accéder aux chaînes internationales (iptv-org)."
      ]
    },
    {
      "id": "favorites",
      "category": "features",
      "icon": "⭐",
      "title": "Système de Favoris",
      "summary": "Marquez vos chaînes préférées pour un accès instantané en un clic.",
      "details": [
        "**Étoile à l'écran :** Cliquez sur l'étoile (⭐) à droite du bandeau OSD pour ajouter la chaîne actuelle aux favoris.",
        "**Étoile dans la liste :** Cliquez sur l'étoile à côté de chaque chaîne dans le panneau latéral.",
        "**Onglet ⭐ Favoris :** Cliquez sur la catégorie Favoris pour afficher uniquement vos chaînes sauvegardées.",
        "**Sauvegarde persistante :** Vos favoris sont conservés dans le stockage local de votre navigateur."
      ]
    },
    {
      "id": "epg",
      "category": "features",
      "icon": "📅",
      "title": "Guide Électronique des Programmes (EPG)",
      "summary": "Grille des programmes détaillée pour toutes les chaînes dans la langue choisie.",
      "details": [
        "**Ouvrir le guide :** Cliquez sur 📅 GUIDE TV ou appuyez sur P pour ouvrir le volet EPG à gauche.",
        "**En ce moment & À suivre :** Créneaux horaires en direct avec badge 'EN DIRECT' lumineux sur l'émission en cours.",
        "**Détails des émissions :** Résumés d'épisodes, thèmes et informations sur les programmes.",
        "**Couverture multilingue :** Données XMLTV officielles pour les chaînes hongroises et générateur dynamique pour les chaînes mondiales."
      ]
    },
    {
      "id": "sleep_timer",
      "category": "features",
      "icon": "🌙",
      "title": "Minuteur de Sommeil & Veille",
      "summary": "Extinction automatique avec fondu sonore progressif et écran de veille rétro.",
      "details": [
        "**Régler le minuteur :** Cliquez sur 🌙 MINUTEUR et choisissez 15, 30, 45, 60, 90 ou 120 minutes.",
        "**Compte à rebours en direct :** Le bouton affiche le temps restant en minutes et secondes.",
        "**Fondu audio en douceur :** Durant les 10 dernières secondes, le volume diminue progressivement jusqu'au silence.",
        "**Mode Veille (Standby) :** À expiration, le flux vidéo s'arrête et un écran de veille sombre avec LED rouge s'active. Cliquez pour rallumer le téléviseur."
      ]
    },
    {
      "id": "remote",
      "category": "remote",
      "icon": "📱",
      "title": "Télécommande Smartphone (QR & MQTT)",
      "summary": "Contrôlez votre téléviseur depuis votre smartphone sans aucune installation ni serveur local.",
      "details": [
        "**Lancer l'appairage :** Cliquez sur 📱 TÉLÉCOMMANDE pour afficher le QR code et le code de salon à 4 lettres.",
        "**Scanner avec votre téléphone :** Scannez le QR code avec l'appareil photo de votre smartphone (ou ouvrez remote.html).",
        "**Connexion Cloud MQTT instantanée :** Grâce au relais WSS v3.9, la connexion s'établit en moins de 200 ms sur tous les réseaux mobiles (🟢 TV Connectée).",
        "**Contrôles complets :** CH+/CH-, VOL+/VOL-, Sourdine, Pavé 0-9, OK, Guide, EPG, Favori, Plein écran, Veille et retour haptique.",
        "**Mini écran CRT bidirectionnel :** Votre téléphone affiche en direct le nom de la chaîne, le numéro, la catégorie et le volume."
      ]
    },
    {
      "id": "pwa",
      "category": "features",
      "icon": "📲",
      "title": "Application PWA Téléviseur de Poche",
      "summary": "Installez l'application sur votre écran d'accueil pour une expérience TV nomade plein écran en mode paysage.",
      "details": [
        "**Ajouter à l'écran d'accueil :** Dans le menu de votre navigateur mobile, choisissez 'Ajouter à l'écran d'accueil' ou 'Installer l'application'.",
        "**Immersion totale :** Démarre sans barre d'adresse ni boutons de navigateur, directement en mode paysage plein écran.",
        "**Icônes rétro dédiées :** Icônes TV rétro dorées en haute résolution (192x192 et 512x512) sur votre lanceur d'applications.",
        "**Lancement instantané :** Le Service Worker garantit un chargement ultra-rapide de l'interface."
      ]
    },
    {
      "id": "language",
      "category": "features",
      "icon": "🌐",
      "title": "Interface Multilingue (6 Langues)",
      "summary": "Changez de langue à tout moment dans la barre de commandes ou la liste des chaînes.",
      "details": [
        "**Langues disponibles :** 🇭🇺 Hongrois, 🇬🇧 Anglais, 🇩🇪 Allemand, 🇫🇷 Français, 🇪🇸 Espagnol et 🇷🇺 Russe.",
        "**Sélecteurs rapides :** Changez instantanément via le menu déroulant en bas ou l'en-tête du volet.",
        "**Détection automatique :** Détecte la langue de votre système lors de la première visite.",
        "**Mémorisation :** Votre préférence linguistique est enregistrée pour vos prochaines sessions."
      ]
    },
    {
      "id": "controls",
      "category": "nav",
      "icon": "⌨️",
      "title": "Contrôles Clavier & Smart TV",
      "summary": "Pilotez facilement la lecture au clavier ou avec la télécommande de votre Smart TV Samsung / LG.",
      "details": [
        "**Changer de chaîne :** Flèches <kbd>Haut</kbd> / <kbd>Bas</kbd> ou <kbd>Gauche</kbd> / <kbd>Droite</kbd> ; sur Smart TV : boutons <kbd>Chaîne +/-</kbd>.",
        "**Volume :** Touches <kbd>+</kbd> et <kbd>-</kbd> ; touche <kbd>M</kbd> pour couper le son.",
        "**Plein écran :** Touche <kbd>F</kbd> ou double-clic sur la vidéo.",
        "**Panneaux :** <kbd>C</kbd> pour la liste des chaînes, <kbd>P</kbd> pour l'EPG, <kbd>H</kbd> ou <kbd>?</kbd> pour l'aide.",
        "**Fermer / Retour :** Touche <kbd>Échap</kbd> ou bouton <kbd>Retour (10009)</kbd> sur Smart TV pour fermer les fenêtres.",
        "**Numéros directs :** Touches <kbd>0</kbd> à <kbd>9</kbd> pour composer le numéro de chaîne."
      ]
    },
    {
      "id": "stats_report",
      "category": "tips",
      "icon": "⚙️",
      "title": "Diagnostics & Signalement d'Erreur",
      "summary": "Statistiques en temps réel et signalement de panne en un clic sur le châssis du téléviseur.",
      "details": [
        "**Statistiques techniques (⚙) :** Cliquez sur DONNÉES TECHNIQUES pour voir le ping, la résolution, le débit et la mémoire tampon.",
        "**Bouton Rouge de Signalement :** Cliquez sur le bouton rouge sur le meuble TV pour transmettre un rapport technique au serveur.",
        "**Note facultative :** Précisez le problème rencontré (ex: 'pas de son', 'image saccadée').",
        "**100% Cloud :** Traitement transparent via le proxy Cloudflare Worker."
      ]
    }
  ],
  "es": [
    {
      "id": "live_tv",
      "category": "nav",
      "icon": "📺",
      "title": "TV en Vivo y Cambio de Canales",
      "summary": "Navegación ultrarrápida entre 122 canales húngaros en vivo y transmisiones internacionales.",
      "details": [
        "**Cambio de canales:** Usa los botones ◀ ANTERIOR y SIGUIENTE ▶ debajo del televisor o las teclas de flecha (Arriba/Abajo/Izq/Der).",
        "**Sintonización directa:** Escribe cualquier número de canal en tu teclado (ej. 1, 5, 12) para cambiar al instante.",
        "**Barra OSD:** Al cambiar de canal, se muestra el número, nombre, resolución y género en la parte superior.",
        "**Volumen y silencio:** Ajusta el volumen con las teclas + / - o silencia con la tecla M."
      ]
    },
    {
      "id": "guide_search",
      "category": "nav",
      "icon": "📋",
      "title": "Lista de Canales y Búsqueda",
      "summary": "Todos los canales en un panel lateral con búsqueda en tiempo real y filtros por categoría.",
      "details": [
        "**Abrir lista:** Haz clic en 📋 GUÍA DE CANALES o presiona la tecla C en el teclado.",
        "**Búsqueda instantánea:** Escribe un nombre o género (ej. Deportes, Música, Cine). En móvil, el teclado solo se abre al tocarlo.",
        "**Filtros por categoría:** Filtra por General, Cine, Noticias, Deportes, Música, Infantil o ⭐ Favoritos.",
        "**Canales internacionales:** Cambia la fuente en la parte superior para explorar canales del mundo (iptv-org)."
      ]
    },
    {
      "id": "favorites",
      "category": "features",
      "icon": "⭐",
      "title": "Sistema de Favoritos",
      "summary": "Marca tus canales favoritos para acceder a ellos con un solo clic.",
      "details": [
        "**Estrella en pantalla:** Haz clic en la estrella (⭐) a la derecha de la barra OSD para guardar el canal actual.",
        "**Estrella en la lista:** Haz clic en la estrella junto a cualquier canal en la guía lateral.",
        "**Pestaña ⭐ Favoritos:** Haz clic en la categoría Favoritos para ver solo tus canales guardados.",
        "**Almacenamiento permanente:** Tus canales favoritos se guardan de forma segura en tu navegador."
      ]
    },
    {
      "id": "epg",
      "category": "features",
      "icon": "📅",
      "title": "Guía Electrónica de Programas (EPG)",
      "summary": "Programación completa para todos los canales en tu idioma seleccionado.",
      "details": [
        "**Abrir guía:** Haz clic en 📅 GUÍA TV o presiona la tecla P para abrir el panel EPG lateral.",
        "**En emisión y Próximamente:** Horarios en tiempo real con insignia brillante 'EN DIRECTO' en el programa actual.",
        "**Sinopsis detallada:** Lee resúmenes de episodios, temáticas y datos sobre los programas.",
        "**Soporte multilingüe:** Datos oficiales XMLTV para canales de Hungría y generador dinámico para canales internacionales."
      ]
    },
    {
      "id": "sleep_timer",
      "category": "features",
      "icon": "🌙",
      "title": "Temporizador de Apagado y Standby",
      "summary": "Apagado automático con desvanecimiento de sonido y pantalla de espera de bajo consumo.",
      "details": [
        "**Configurar temporizador:** Haz clic en 🌙 TEMPORIZADOR y elige 15, 30, 45, 60, 90 o 120 minutos.",
        "**Cuenta regresiva en vivo:** El botón muestra los minutos y segundos restantes en tiempo real.",
        "**Atenuación suave de audio:** En los últimos 10 segundos, el volumen disminuye suavemente para no despertar.",
        "**Modo Standby:** Al finalizar, el video se detiene y aparece una pantalla retro con LED rojo encendido. Haz clic para encenderlo nuevamente."
      ]
    },
    {
      "id": "remote",
      "category": "remote",
      "icon": "📱",
      "title": "Control Remoto Móvil (QR y MQTT)",
      "summary": "Controla tu televisor desde tu teléfono sin necesidad de instalar nada ni usar servidores locales.",
      "details": [
        "**Iniciar emparejamiento:** Haz clic en 📱 CONTROL REMOTO para ver el código QR y el código de sala de 4 letras.",
        "**Escanear con el móvil:** Escanea el código QR con tu cámara (o abre remote.html e introduce el código).",
        "**Puente en la nube MQTT instantáneo:** Gracias a v3.9 WSS, se conecta en menos de 200 ms superando cualquier firewall móvil (🟢 TV Conectada).",
        "**Control total:** CH+/CH-, VOL+/VOL-, Silencio, teclado 0-9, OK, Guía, EPG, Favorito, Pantalla completa, Apagado y vibración háptica.",
        "**Pantalla CRT bidireccional:** Tu teléfono muestra en vivo el nombre del canal, número, categoría y nivel de volumen."
      ]
    },
    {
      "id": "pwa",
      "category": "features",
      "icon": "📲",
      "title": "Aplicación PWA Televisor de Bolsillo",
      "summary": "Añade la app a tu pantalla de inicio y disfruta de una televisión portátil a pantalla completa en modo horizontal.",
      "details": [
        "**Añadir a la pantalla de inicio:** En el menú de tu navegador móvil, pulsa 'Añadir a la pantalla de inicio' o 'Instalar aplicación'.",
        "**Experiencia inmersiva:** Se abre sin barras de navegación, directamente en orientación horizontal a pantalla completa.",
        "**Iconos retro dedicados:** Iconos de televisor vintage dorado en 192x192 y 512x512 en tu pantalla de aplicaciones.",
        "**Carga rápida:** El Service Worker almacena en caché la interfaz para un arranque inmediato."
      ]
    },
    {
      "id": "language",
      "category": "features",
      "icon": "🌐",
      "title": "Interfaz Multilingüe (6 Idiomas)",
      "summary": "Cambia de idioma en cualquier momento desde la barra de controles o la lista de canales.",
      "details": [
        "**Idiomas disponibles:** 🇭🇺 Húngaro, 🇬🇧 Inglés, 🇩🇪 Alemán, 🇫🇷 Francés, 🇪🇸 Español y 🇷🇺 Ruso.",
        "**Selectores rápidos:** Cambia al instante mediante el menú desplegable inferior o el encabezado de la guía.",
        "**Detección automática:** Detecta el idioma de tu navegador en tu primera visita.",
        "**Preferencia guardada:** El idioma elegido se conserva automáticamente para el futuro."
      ]
    },
    {
      "id": "controls",
      "category": "nav",
      "icon": "⌨️",
      "title": "Controles de Teclado y Smart TV",
      "summary": "Controla cómodamente la reproducción con atajos de teclado o el mando de tu Smart TV Samsung / LG.",
      "details": [
        "**Cambiar de canal:** Flechas <kbd>Arriba</kbd> / <kbd>Abajo</kbd> o <kbd>Izq</kbd> / <kbd>Der</kbd>; en Smart TV: botones <kbd>Canal +/-</kbd>.",
        "**Volumen:** Teclas <kbd>+</kbd> y <kbd>-</kbd>; tecla <kbd>M</kbd> para silenciar.",
        "**Pantalla completa:** Tecla <kbd>F</kbd> o doble clic sobre el video.",
        "**Paneles:** <kbd>C</kbd> abre la lista de canales, <kbd>P</kbd> abre la guía EPG, <kbd>H</kbd> o <kbd>?</kbd> abre esta ayuda.",
        "**Cerrar / Volver:** Tecla <kbd>Escape</kbd> o botón <kbd>Return (10009)</kbd> en Smart TV para cerrar paneles.",
        "**Números directos:** Teclas del <kbd>0</kbd> al <kbd>9</kbd> para sintonizar directamente el canal."
      ]
    },
    {
      "id": "stats_report",
      "category": "tips",
      "icon": "⚙️",
      "title": "Diagnóstico y Reporte de Fallos",
      "summary": "Estadísticas en tiempo real y reporte de errores con un clic desde el marco del televisor.",
      "details": [
        "**Datos técnicos (⚙):** Haz clic en DATOS TÉCNICOS para inspeccionar ping, resolución, tasa de bits y búfer.",
        "**Botón Rojo de Reporte:** Pulsa el botón rojo en el chasis del televisor para enviar un reporte automático a la nube.",
        "**Nota opcional:** Puedes describir el fallo (ej. 'sin audio', 'imagen congelada').",
        "**100% en la Nube:** Conexión directa mediante el backend Vercel Serverless."
      ]
    }
  ],
  "ru": [
    {
      "id": "live_tv",
      "category": "nav",
      "icon": "📺",
      "title": "Прямой эфир и Переключение каналов",
      "summary": "Молниеносная навигация среди 122 венгерского телеканала и международных трансляций.",
      "details": [
        "**Переключение каналов:** Используйте кнопки ◀ ПРЕД и СЛЕД ▶ под телевизором или стрелки (Вверх/Вниз/Влево/Вправо) на клавиатуре.",
        "**Прямой ввод номера:** Наберите номер канала на клавиатуре (напр.: 1, 5, 12) для мгновенного перехода.",
        "**Информационная строка OSD:** При переключении отображаются номер, название, разрешение и жанр канала.",
        "**Громкость и звук:** Регулируйте громкость клавишами + / - или выключайте звук клавишей M."
      ]
    },
    {
      "id": "guide_search",
      "category": "nav",
      "icon": "📋",
      "title": "Список каналов и Поиск",
      "summary": "Все каналы в удобной боковой панели с мгновенным поиском и фильтрами по категориям.",
      "details": [
        "**Открыть список:** Нажмите 📋 СПИСОК КАНАЛОВ или клавишу C на клавиатуре.",
        "**Быстрый поиск:** Введите название или жанр (напр.: Кино, Спорт, Музыка). На мобильных клавиатура не мешает просмотру.",
        "**Фильтры категорий:** Фильтруйте по жанрам: Общественные, Кино, Новости, Спорт, Музыка, Детские или ⭐ Избранное.",
        "**Мировые каналы:** Переключите источник вверху списка для просмотра международных каналов (iptv-org)."
      ]
    },
    {
      "id": "favorites",
      "category": "features",
      "icon": "⭐",
      "title": "Система Избранного",
      "summary": "Добавляйте любимые каналы в избранное для мгновенного доступа.",
      "details": [
        "**Звезда на экране:** Нажмите на звездочку (⭐) справа на верхней панели OSD, чтобы сохранить текущий канал.",
        "**Звезда в списке:** Нажимайте звездочку рядом с любым каналом в списке каналов.",
        "**Вкладка ⭐ Избранное:** Выберите категорию Избранное, чтобы отобразить только сохраненные каналы со счетчиком.",
        "**Постоянное хранение:** Ваши избранные каналы надежно сохраняются в памяти вашего браузера."
      ]
    },
    {
      "id": "epg",
      "category": "features",
      "icon": "📅",
      "title": "Телепрограмма (EPG)",
      "summary": "Подробная сетка вещания для всех каналов на выбранном языке интерфейса.",
      "details": [
        "**Открыть телепрограмму:** Нажмите 📅 ТЕЛЕПРОГРАММА или клавишу P, чтобы открыть левую панель EPG.",
        "**В эфире и Далее:** Точные временные слоты с ярким значком 'В ЭФИРЕ' для текущей передачи.",
        "**Описание передач:** Читайте подробные синопсисы, темы выпусков и информацию о передачах.",
        "**Поддержка языков:** Официальный XMLTV для венгерских каналов и динамическая сетка на вашем языке для зарубежных каналов."
      ]
    },
    {
      "id": "sleep_timer",
      "category": "features",
      "icon": "🌙",
      "title": "Таймер сна и Режим ожидания",
      "summary": "Автоматическое выключение с плавным затуханием звука и ретро-экраном ожидания.",
      "details": [
        "**Настройка таймера:** Нажмите 🌙 ТАЙМЕР и выберите интервал: 15, 30, 45, 60, 90 или 120 минут.",
        "**Обратный отсчет:** На кнопке в реальном времени отображаются оставшиеся минуты и секунды.",
        "**Плавное затухание звука:** В последние 10 секунд громкость плавно снижается до нуля.",
        "**Режим Standby:** По истечении времени видео отключается и включается темный экран с горящим красным светодиодом. Нажмите кнопку включения для возобновления."
      ]
    },
    {
      "id": "remote",
      "category": "remote",
      "icon": "📱",
      "title": "Мобильный Пульт (QR и MQTT)",
      "summary": "Управляйте воспроизведением со смартфона без установки приложений и без локального сервера.",
      "details": [
        "**Начать сопряжение:** Нажмите кнопку 📱 ПУЛЬТ на панели TV, чтобы открыть QR-код и 4-значный код комнаты.",
        "**Сканируйте телефоном:** Наведите камеру телефона на QR-код (или откройте remote.html и введите код).",
        "**Мгновенный MQTT-мост:** Благодаря протоколу WSS v3.9 подключение происходит менее чем за 200 мс на любых мобильных сетях (🟢 TV подключен).",
        "**Полное управление:** CH+/CH-, VOL+/VOL-, Mute, блок 0-9, OK, Список, EPG, Избранное, Полный экран, Таймер и виброотклик.",
        "**Двусторонний мини-CRT дисплей:** На экране телефона отображается текущий канал, номер, жанр и громкость телевизора."
      ]
    },
    {
      "id": "pwa",
      "category": "features",
      "icon": "📲",
      "title": "Устанавливаемое PWA приложение Карманный TV",
      "summary": "Добавьте на главный экран для полноэкранного просмотра в горизонтальном режиме как на настоящем портативном ТВ.",
      "details": [
        "**Добавить на главный экран:** В меню браузера на телефоне выберите 'Добавить на главный экран' или 'Установить приложение'.",
        "**Без рамок браузера:** Запускается без адресной строки, сразу в горизонтальном полноэкранном режиме (landscape).",
        "**Ретро-иконки:** Специальные значки 192x192 и 512x512 золотого телевизора на вашем рабочем столе.",
        "**Мгновенный запуск:** Service Worker ускоряет открытие и обеспечивает плавную работу интерфейса."
      ]
    },
    {
      "id": "language",
      "category": "features",
      "icon": "🌐",
      "title": "Многоязычный Интерфейс (6 Языков)",
      "summary": "Переключайте язык в любое время на панели управления или в списке каналов.",
      "details": [
        "**Поддерживаемые языки:** 🇭🇺 Венгерский, 🇬🇧 Английский, 🇩🇪 Немецкий, 🇫🇷 Французский, 🇪🇸 Испанский и 🇷🇺 Русский.",
        "**Быстрое переключение:** Выбирайте язык в выпадающем списке внизу или в заголовке боковой панели.",
        "**Автоопределение:** При первом входе система автоматически распознает язык вашего браузера.",
        "**Сохранение выбора:** Выбранный язык надежно сохраняется в настройках."
      ]
    },
    {
      "id": "controls",
      "category": "nav",
      "icon": "⌨️",
      "title": "Клавиатура и Управление Smart TV",
      "summary": "Управляйте просмотром с помощью горячих клавиш или пульта Smart TV Samsung Tizen / LG webOS.",
      "details": [
        "**Смена канала:** Стрелки <kbd>Вверх</kbd> / <kbd>Вниз</kbd> или <kbd>Влево</kbd> / <kbd>Вправо</kbd>; на Smart TV: кнопки <kbd>Канал +/-</kbd>.",
        "**Громкость:** Клавиши <kbd>+</kbd> и <kbd>-</kbd>; <kbd>M</kbd> для мгновенного отключения звука.",
        "**Полный экран:** Клавиша <kbd>F</kbd> или двойной щелчок по экрану для кинотеатрального режима.",
        "**Панели:** <kbd>C</kbd> — список каналов, <kbd>P</kbd> — программа EPG, <kbd>H</kbd> или <kbd>?</kbd> — руководство пользователя.",
        "**Закрыть:** Клавиша <kbd>Escape</kbd> или кнопка <kbd>Return (10009)</kbd> на пульте Smart TV закрывает активные окна.",
        "**Цифры:** Клавиши <kbd>0</kbd>–<kbd>9</kbd> для прямого ввода номера канала."
      ]
    },
    {
      "id": "stats_report",
      "category": "tips",
      "icon": "⚙️",
      "title": "Диагностика и Сообщение об Ошибках",
      "summary": "Техническая статистика в реальном времени и быстрая отправка отчетов об ошибках прямо с корпуса ТВ.",
      "details": [
        "**Технические данные (⚙):** Нажмите ТЕХНИЧЕСКИЕ ДАННЫЕ для просмотра задержки (ping), разрешения, битрейта и буфера.",
        "**Красная кнопка на корпусе:** Нажмите светящуюся красную кнопку на рамке ТВ для автоматической отправки диагностики на сервер.",
        "**Комментарий:** Вы можете кратко описать проблему (напр.: 'нет звука', 'зависает картинка').",
        "**100% Облачная работа:** Обработка данных через бессерверный прокси Vercel."
      ]
    }
  ]
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
      favCategory: '⭐ Favoritos',
      favEmpty: 'Aún no tienes canales favoritos. ¡Haz clic en la estrella (⭐) para agregar!',
      btnSleep: '🌙 TEMPORIZADOR',
      sleepModalTitle: '🌙 TEMPORIZADOR DE APAGADO',
      sleepOff: 'Desactivado',
      sleep15: '15 min',
      sleep30: '30 min',
      sleep45: '45 min',
      sleep60: '60 min',
      sleep90: '90 min',
      sleep120: '120 min',
      btnRemote: '📱 CONTROL REMOTO',
      remoteModalTitle: '📱 CONTROL REMOTO MÓVIL',
      remoteScanDesc: 'Escanea este código QR con la cámara de tu teléfono:',
      remoteWaiting: 'Esperando conexión del teléfono...',
      remoteConnected: '🟢 ¡Teléfono conectado! El control remoto está activo.',
      standbyTitle: 'MODO DE ESPERA',
      standbySubtitle: 'El temporizador detuvo la emisión. ¡Haz clic para encender!',
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


  function getHelpGuide(lang) {
    if (!HELP_GUIDE[lang]) lang = 'hu';
    return HELP_GUIDE[lang] || HELP_GUIDE.hu;
  }

  function t(key, lang) {
    const l = lang || document.documentElement.lang || 'hu';
    const dict = DICTIONARY[l] || DICTIONARY.hu;
    return dict[key] || DICTIONARY.hu[key] || key;
  }

  return {
    DICTIONARY,
    HELP_GUIDE,
    getHelpGuide,
    t,
    generateSchedule
  };
})();
