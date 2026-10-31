# ZsirafVision – Változásnapló

Minden jelentős változás ebben a fájlban szerepel.
Formátum: [Keep a Changelog](https://keepachangelog.com/hu/1.1.0/), verziózás: [Verziózási szabály](README.md#-verziózás).
Dátumok: Europe/Budapest időzóna.

> A git-történet a v4.2-vel indul (`d43c4cc` – ez a kezdő commit tartalmazza a v3.0–v4.1 teljes kódját).
> A v3.0–v4.1 bejegyzések a korábbi fejlesztési napló alapján készültek; ezekhez nincs külön commit/tag.


## [4.7.0] – 2026-10-31
### Új
- **Tartalék proxyk + automatikus átváltás** a Workerben: `PROXY_BACKENDS` lista (név, url, prioritás), 10 percenkénti egészség-ellenőrzés, halott backend (5xx/402/429/időtúllépés/„suspended” oldal) kihagyása, visszatérés után újra használat, azonos prioritáson körbeforgatás.
- `/health` most JSON: verzió + backendek állapota; `/api/stats` → `proxyBackends`.
- `server.py` hordozható: `PROXY_ONLY=1` env bármely platformon (nem csak Renderen), `Dockerfile`, `Procfile`, `.dockerignore`.
- `docs/PROXY_BACKENDS.md`: szolgáltatók rangsora (2026), regisztrációs és telepítési lépések.
### Megjegyzés
- Render ingyenes forgalma 2026.04.23 óta 5 GB/hó – ezért kellenek a tartalékok.
- Átváltás tesztelve: halott backend (0. prioritás) mellett a Worker a Renderre irányított.

## v4.6.1 – 2026-10-30 – PWA / kezdőképernyő-ikon javítás

**Hiba:** a kezdőképernyőre tett ikonról az alkalmazás nem indult el (iPhone Safari és Android Chrome).

**Okok:**
- A Service Worker navigációs kéréseknél hiba esetén `undefined`-ot adhatott vissza (üres cache-találat), illetve átirányított (`redirected`) választ szolgált ki – Safari standalone módban ez indítási hibát / fehér képernyőt okoz.
- A SW minden kérést elkapott, a külső CDN-szkripteket (hls.js, PeerJS, SRI-vel) is.
- A `manifest.json`-ban nem volt `id`, a `start_url`/`scope` relatív volt, `display: fullscreen` + fix `landscape` tájolás (iOS nem támogatja, Androidon álló telefonon gondot okozhat), `any maskable` kombinált ikon.
- Nem volt `apple-touch-icon` (404), a gyökér oldalon (`/zsirafvision/`) nem volt manifest, így onnan hozzáadva rossz parancsikon keletkezett.
- A SW előgyorsítótár `remote.js?v=3.9`-et kért, a HTML viszont más verziót.

**Javítás:**
- Új SW fetch-kezelő: csak azonos eredetű GET kérések; navigáció mindig hálózat-első, offline esetén a cache-elt `index.html`; átirányított válaszok „megtisztítása”; soha nem ad vissza üres választ. Cache: `zsirafvision-v4.6.1` (a régi törlődik, `skipWaiting` + `clients.claim`).
- Manifest: abszolút `id`, `start_url` (`/zsirafvision/public/?source=pwa`), `scope`, `display: standalone` + `display_override: fullscreen`, külön `any` és `maskable` ikon, tájolás-zár eltávolítva.
- `apple-touch-icon.png` (180×180), `theme-color`, gyökér `index.html`-be is manifest + ikon.

**Teendő a felhasználónak:** töröld a régi ikont a kezdőképernyőről, nyisd meg böngészőben a https://zsirafmix.github.io/zsirafvision/public/ oldalt, frissíts egyszer, majd add hozzá újra (iPhone: Megosztás → Főképernyőhöz adás; Android: ⋮ → Alkalmazás telepítése).

## [v4.6.0] - 2026-10-30

### Hozzáadva
- **Élő nézőszámláló** a TV mellett (retro Videoton-stílusú LED kijelző: „👁 003 néző most”, alatta az aktuális csatorna nézői).
- Worker: `POST /api/heartbeat` `{sid, ch, stop?}` és `GET /api/viewers` → `{total, perChannel, windowSec}`.
- Cloudflare **Durable Object** `ViewerCounter` (SQLite-osztály, ingyenes csomag), az állapot csak memóriában: nincs KV-írás.
- Front end: véletlen, anonim munkamenet-azonosító (`sessionStorage`, 128 bit), lejátszás közben ~60 mp-enként jelzés; szünet/háttérbe kerülés/oldalbezárás esetén `stop` jelzés (sendBeacon); egyébként 45 mp-enként lekérdezés.

### Biztonság
- Heartbeat: csak POST, Origin-ellenőrzés (github.io + localhost), max. 512 bájt törzs, `sid` regex (`[A-Za-z0-9_-]{16,64}`), csatornanév tisztítva és 60 karakterre vágva, IP-nkénti 30 kérés/perc (isolate-onként), max. 20 000 egyidejű munkamenet.
- Nem tárolunk IP-címet, sütit vagy személyes adatot.

### Változott
- Verzió 4.6.0 mindenhol (UI, Service Worker cache, `?v=` tagek, Worker).

## [v4.5.1] - 2026-10-30

### Törölve
- 9 tartósan nem működő csatorna (131 → 122):
  - AXN Spin (Hungary) – 429 forrás korlátozás
  - BTV (Hungary) – időtúllépés
  - Berente TV – 403 (streaming4u.hu)
  - Globo TV (Hungary) – 403 földrajzi tiltás (streaming4u.hu)
  - Komlós TV – 403 (streaming4u.hu)
  - PilisTV – 403 földrajzi tiltás (streaming4u.hu)
  - RégióPlusz TV – 403 földrajzi tiltás (streaming4u.hu)
  - Trimedio TV – 403 földrajzi tiltás (streaming4u.hu)
  - Vásárhelyi Televízió – 413 / 404
- Az „AXN Spin (Hungary)” EPG bejegyzés; a már nem használt hostok (`stream.streaming4u.hu`, `cronos.mangora1.cfd`, `stream.vasarhelyitelevizio.hu`) az allowlist csatorna-részéből.

### Változott
- Csatornaszámok folyamatosan újraszámozva (01–122); a kedvencek és az utolsó csatorna név alapján tárolódik, így megmaradnak.
- Csatornaszám a felületen és mind a 6 nyelven 122-re frissítve; allowlist újragenerálva (iptv-org lista frissült).
- Verzió 4.5.1 mindenhol (UI, Service Worker cache `zsirafvision-v4.5.1`, `?v=` tagek, Worker, `server.py`).

## [v4.5] - 2026-10-30

### Biztonság
- Szigorú host allowlist (`public/allowed_hosts.json`: a `channels.json` hostjai + iptv-org lista; újragenerálás: `tools/gen_allowed_hosts.py`). Más host csak a proxy által kiadott, HMAC-aláírt, 6 órás lejáratú URL-en érhető el.
- Worker: csak média tartalomtípus (m3u8 / ts / m4s / aac / kulcs), méretkorlát (playlist 2 MB, szegmens 40 MB), 15 mp időkorlát, IP-nkénti limit (900 kérés/perc), CORS csak `zsirafmix.github.io` és localhost, biztonsági fejlécek.
- Hibajelentés: 16 KB méretkorlát, HTML-szűrés, Origin-ellenőrzés, IP-nként 5 db / 10 perc; a `GET /api/report` listázás csak `Authorization: Bearer <REPORT_TOKEN>` fejléccel.
- Render proxy (`server.py`): TLS-ellenőrzés újra bekapcsolva (kivétel: `TLS_INSECURE_HOSTS`), privát IP tiltás minden átirányítás után és a ténylegesen kapcsolódott IP-re is, aláírt URL-ek (`RENDER_SIGN_KEY`), méret- és időkorlátok, IP-nkénti limit.
- Front-end: Content-Security-Policy, SRI hash a CDN szkriptekre, EPG adatok escape-elése, 130 bites (26 karakteres, `crypto.getRandomValues`) szobakód, távirányító parancsok whitelistje és ellenőrzése.

### Javítva
- `server.py`: a `/health` végpont tévedésből a HEAD kezelőbe került, ezért a Render a régi HTML-t adta – most közös útválasztó kezeli.
- `server.py`: a lexanetwork.com relay-ek (:1344 – pl. Bajai, Gyöngyösi, Kapos, Karcag TV) tanúsítványa miatt a bekapcsolt TLS-ellenőrzés 502-t adott; `.lexanetwork.com` alapértelmezett TLS-kivétel (utótag-egyezés), a hibaüzenet tartalmazza az okot.
- `server.py`: `Origin: null` elfogadása (a böngésző a Worker 302-es átirányítása után ezt küldi).

### Hozzáadva
- `tools/channel_test.py` – csatornateszt szkript; `docs/` mappa (ARCHITECTURE, SECURITY, DEPLOY).

### Változott
- A két TV-keret PNG tömörítve (~660 KB → ~50 / ~108 KB).
- Verzió 4.5 mindenhol (UI, Service Worker cache `zsirafvision-v4.5`, `?v=` tagek, `remote.js?v=4.5`).

### Törölve
- A nem használt `public/online_channels.json`.

Commitok: [906e292](https://github.com/zsirafmix/zsirafvision/commit/906e292) · [3af7054](https://github.com/zsirafmix/zsirafvision/commit/3af7054) · [e943a91](https://github.com/zsirafmix/zsirafvision/commit/e943a91) · [8b2ca22](https://github.com/zsirafmix/zsirafvision/commit/8b2ca22) · [1666666](https://github.com/zsirafmix/zsirafvision/commit/1666666) · [dd51f6b](https://github.com/zsirafmix/zsirafvision/commit/dd51f6b)

## [v4.4] - 2026-10-30

### Hozzáadva
- Két proxys architektúra: a Cloudflare Worker nem ér el IP-címes hostot (CF 1003) és nem szabványos portot (1344, 2443, 8890…), ezért ezeket 302-vel a Renderen futó második proxyhoz (`https://zsirafvision-proxy2.onrender.com`, `server.py`) küldi. Visszajött az RTL, TV2, M1–M5, Duna, Viasat stb.
- Worker cron (10 percenként) – ébren tartja a Render proxyt (nincs ~60 mp-es hidegindítás).
- `server.py`: `/health` végpont.

### Javítva
- `server.py`: az M3U8 átírás abszolút URL-eket ad (Host / X-Forwarded-Proto alapján).

### Biztonság
- `server.py`: belső/privát IP-k tiltása (SSRF védelem).

### Változott
- Verzió 4.4 (UI, Service Worker cache, `?v=` tagek).

Commitok: [95fdf47](https://github.com/zsirafmix/zsirafvision/commit/95fdf47) · [1326b03](https://github.com/zsirafmix/zsirafvision/commit/1326b03) · [47504b5](https://github.com/zsirafmix/zsirafvision/commit/47504b5)

## [v4.3] - 2026-10-30

### Javítva
- Átállás Vercelről Cloudflare Workerre – a Vercel proxy `402 DEPLOYMENT_DISABLED` hibát adott, ezért nem indult egy csatorna sem és a hibajelentő sem működött.

### Hozzáadva
- `cloudflare-worker/worker.js` teljes backend: `/api/proxy` (M3U8 átírás, Range/206, CORS), `/api/report` (Cloudflare KV, 90 napos megőrzés), `/api/stats`, `/health`.
- `app.js`: egyetlen `PROXY_BASE` konstans; régi Vercel linkek automatikus átírása; tartalék közvetlen lejátszás HTTPS + CORS streameknél.

### Biztonság
- A proxy csak ismert csatorna-hostokat enged teljesen, ismeretlen hostról csak média tartalmat; belső IP-k tiltva. Hibajelentés: IP-nként 5 db / 10 perc.

### Változott
- hls.js rögzítve `1.7.4`-re (`@latest` helyett); Service Worker cache `zsirafvision-v4.3`.

Commitok: [ba1e046](https://github.com/zsirafmix/zsirafvision/commit/ba1e046) · [6c93036](https://github.com/zsirafmix/zsirafvision/commit/6c93036)

## [v4.2] - 2026-10-29

### Hozzáadva
- EPG: az éppen futó műsor valós idejű kiemelése (helyi idő alapján, éjféli átnyúlás kezelése), foszfor-zöld kiemelés, lüktető `🔴 ÉLŐBEN` jelvény, automatikus odagörgetés.

### Változott
- A titkos felnőtt mód nem szerepel a Súgóban egyik nyelven sem.
- Service Worker cache és assetek verziója `v4.2`.

Commitok: [d43c4cc](https://github.com/zsirafmix/zsirafvision/commit/d43c4cc) (kezdő commit – a v3.0–v4.1 kódját is tartalmazza)

## [v4.1] - 2026-10-29

### Javítva
- Súgó ablak nem nyílt meg: a `#remote-modal` lezáró `</div>`-je hiányzott, így a `#help-modal` a rejtett távirányító ablakba ágyazódott.
- `:fullscreen` / `:-webkit-full-screen` szelektorok külön szabályokba bontva (Firefox figyelmeztetés).

### Változott
- Konzol logok és Service Worker cache verziója `v4.1`.

## [v4.0] - 2026-10-29

### Hozzáadva
- ❓ Többnyelvű Súgó (hu, en, de, fr, es, ru): `SÚGÓ` gomb, `H` / `?` / `F1` gyorsbillentyű, 11 témakör, kereső és kategória-chipek; adatok az `i18n.js` `HELP_GUIDE` objektumából.

### Változott
- Service Worker cache `zsirafvision-v4.0`.

## [v3.9] - 2026-10-29

### Javítva
- Mobil távirányító mobilneten (CGNAT / Symmetric NAT) nem kapcsolódott: elsődleges csatorna MQTT over WSS (`broker.hivemq.com:8884`, `broker.emqx.io:8084`), másodlagos WebRTC / PeerJS.

### Hozzáadva
- Helyi Eclipse Paho MQTT kliens (`js/paho-mqtt.min.js`).

### Változott
- 4 karakteres szobakód mező automatikus nagybetűsítéssel, zöld visszajelzés.

## [v3.8] - 2026-10-29

### Javítva
- A szobakód azonnal megjelenik a QR-kód alatt.
- Távirányító P2P: egységes nagybetűs Peer ID (`zsiraf-tv-XXXX`), Google és Twilio STUN szerverek, `cmd` és `action` mezők támogatása, hangerő-kijelzés javítása.

## [v3.7] - 2026-10-29

### Hozzáadva
- ⭐ Kedvencek (OSD és csatornalista, külön kategória, `localStorage`).
- 🌙 Elalvásidőzítő (15–120 perc) hangerő-lehalkítással és készenléti móddal.
- 📱 Mobil távirányító QR-kóddal (`remote.html`, PeerJS), kétirányú állapot-visszajelzés.
- 📲 Telepíthető PWA (`manifest.json`, `sw.js`, ikonok), fekvő teljes képernyő.
- Új feliratok mind a 6 nyelven.

## [v3.6] - 2026-10-29

### Hozzáadva
- Utoljára nézett csatorna és forrás (HU / WORLD / XXX) megjegyzése.
- 6 nyelvű felület (`i18n.js` modul), böngészőnyelv-felismerés.
- Bővített EPG minden csatornához (XMLTV + generált műsorfolyam).

### Javítva
- Mobilon nem ugrik fel a billentyűzet a csatornalista megnyitásakor.

## [v3.5] - 2026-10-29

### Javítva
- Samsung Smart TV (Tizen) „nincs kép, csak hang”: `drop-shadow` eltávolítása, GPU layer (`translateZ(0)`), hls.js `enableWorker: false`, watchdog natív HLS-re váltással.

### Hozzáadva
- Tizen távirányító gombkódok (`10009`, `427`/`428`); projekt- és hibajavítási dokumentáció.

## [v3.4] - 2026-10-29

### Hozzáadva
- 33 ellenőrzött felnőtt csatorna, kategóriaszűrés; kettős lejátszómotor (MP4 + HLS).
- Proxy: HTTP 206 / `Range` továbbítás.

## [v3.3] - 2026-10-29

### Hozzáadva
- Valós idejű EPG (64 csatorna XMLTV), `HIBAJELENTŐ` gomb (`/api/report`), technikai adatok modal (`/api/stats`), iptv-org globális forrás.

## [v3.2] - 2026-10-29

### Javítva
- Külső logók CORS / `OpaqueResponseBlocking` hibái (`referrerPolicy: no-referrer`).

### Változott
- Letisztultabb CRT felület, felesleges feliratok nélkül.

## [v3.1] - 2026-10-29

### Változott
- Helyi Python szerver + alagút helyett Vercel Serverless proxy.

### Javítva
- Autoplay blokkolás (némított indítás, Play overlay).

## [v3.0] - 2026-10-28

### Hozzáadva
- Első kiadás: 131 élő magyar IPTV csatorna, retro TV káva és OSD.

[v4.5.1]: https://github.com/zsirafmix/zsirafvision/releases/tag/v4.5.1
[v4.5]: https://github.com/zsirafmix/zsirafvision/releases/tag/v4.5
[v4.4]: https://github.com/zsirafmix/zsirafvision/releases/tag/v4.4
[v4.3]: https://github.com/zsirafmix/zsirafvision/releases/tag/v4.3
[v4.2]: https://github.com/zsirafmix/zsirafvision/releases/tag/v4.2
