# 📺 ZsirafVision - Online IPTV & Web Player (v4.3)

Korszerű, 100%-ban felhő alapú IPTV webes televízió és médialejátszó, amely **131 élő magyar televízióadást**, **6 nyelvű kezelőfelületet és teljes használati útmutatót (❓ Help)**, valós idejű **nemzetközi EPG műsorújságot (élő adás kiemeléssel)**, **Kedvencek rendszert**, **Elalvásidőzítőt**, **Azonnali MQTT + WebRTC Kétcsatornás Mobil Távirányítót (QR-kód)**, **fekvő PWA mobilalkalmazást**, okostévé (Samsung Tizen / LG webOS) támogatást és felhős diagnosztikai rendszert biztosít.

* **Élő Web App (GitHub Pages):** [https://zsirafmix.github.io/zsirafvision/](https://zsirafmix.github.io/zsirafvision/)
* **Mobil Távirányító App:** [https://zsirafmix.github.io/zsirafvision/remote.html](https://zsirafmix.github.io/zsirafvision/remote.html)
* **Felhős Proxy & API (Cloudflare Worker, v4.3-tól):** `cloudflare-worker/` – a cím a `public/js/app.js` `PROXY_BASE` konstansában állítható (a régi Vercel proxyt a Vercel 402 / DEPLOYMENT_DISABLED hibával letiltotta)
* **Aktuális verzió:** `v4.3`

---

## 🚀 Főbb funkciók és képességek

* **❓ Többnyelvű Használati Útmutató & Súgó Rendszer (v4.0 - v4.2):**
  * Egyetlen kattintással az alsó sávban lévő `❓ SÚGÓ` gombra vagy a billentyűzeten a `H` / `?` billentyűre kinyílik a teljes körű retro használati útmutató.
  * **6 Nyelven elérhető:** Magyar (`hu`), angol (`en`), német (`de`), francia (`fr`), spanyol (`es`) és orosz (`ru`) nyelven, valós idejű nyelvváltással.
  * **10 Részletes Témakör:** Élő adások, csatornalista és keresés, kedvencek, műsorújság (EPG), elalvásidőzítő & készenlét, mobil távirányító, telepíthető PWA zsebtévé, többnyelvű felület, billentyűzet és okostévé vezérlés, technikai statisztikák & hibajelentő (a titkos felnőtt mód szándékosan rejtve, diszkrét húsvéti tojásként marad).
  * **Azonnali Keresés és Kategóriaszűrők:** Valós idejű szűrés címre, összefoglalóra és billentyűkre.
  * **Automatikus és Moduláris Jövőbeli Bővíthetőség:** A súgó adatai az `i18n.js` `HELP_GUIDE` struktúrájából renderelődnek. Új funkciók beépítésekor elegendő egyetlen új bejegyzést felvenni a 6 nyelven, és a felület automatikusan, HTML szerkesztés nélkül leköveti és megjeleníti azt!

* **⭐ Kedvencek (Favorites) rendszer (v3.7):**
  * Egykattintásos csillagozás közvetlenül a képernyőn (OSD csillag gomb) vagy a csatornalistában minden adó mellett.
  * `⭐ Kedvencek` kategóriaszűrő fül a csatornaválasztó fiókban, amely azonnal listázza a megjelölt kedvenc adókat a darabszámukkal együtt.
  * Tartós elmentés a böngésző `localStorage` tárhelyében.
* **🌙 Elalvásidőzítő & Készenléti (Standby) Mód (v3.7):**
  * Beállítható időzítő: 15, 30, 45, 60, 90, 120 perc vagy kikapcsolva.
  * Valós idejű visszaszámlálás az alsó sáv gombján és az időzítő ablakban.
  * Lágy hangerő-lehalkítás (audio fade-out) a lejárás előtti utolsó 10 másodpercben.
  * Lejáratkor automatikus készenléti mód (Standby): a videó stream leáll, energiatakarékos retro sötétített képernyő jelenik meg világító piros LED-del és bekapcsoló gombbal.
* **📱 Mobil Távirányító QR-kóddal (WebRTC / PeerJS) (v3.7):**
  * **Zéró helyi szerver**: Nincs szükség semmilyen program vagy szerver futtatására a PC-n, a kapcsolatot a felhős PeerJS relay biztosítja közvetlen P2P WebRTC kapcsolaton keresztül.
  * A TV képernyőjén megjelenő QR-kódot a telefon kamerájával beolvasva azonnal megnyílik a mobilra optimalizált retro távirányító (`remote.html`).
  * Kétirányú valós idejű szinkronizáció: a telefon mini CRT kijelzőjén azonnal látszik a tévén épp futó csatorna neve, száma, műfaja, hangereje és készenléti állapota.
  * Teljes távirányító funkciók: CH+/CH-, VOL+/VOL-, Mute, 0-9 számbillentyűk, OK, Guide, EPG, Kedvenc, Teljes képernyő, Elalvásidőzítő és haptikus rezgés.
* **📲 Tévé formában telepíthető PWA Mobil App (v3.7):**
  * Progressive Web App (`manifest.json`, `sw.js`), amely telefonon és táblagépen a kezdőképernyőre helyezhető.
  * Böngésző keret nélkül, teljes képernyős **fekvő (landscape) tájolásban** indul el igazi zsebtévéként.
  * Dedikált 192x192 és 512x512 képpontos retro arany-fekete televízió ikonok.
  * Offline UI héj gyorsítótárazás Service Workerrel (a videóstreamek és felhős API-k közvetlen átengedésével).

* **Utolsóként nézett csatorna és ország megjegyzése (v3.6):**
  * A lejátszó a `localStorage` segítségével automatikusan megjegyzi az utolsóként nézett csatornát és a forrást (`HU`, `WORLD`, `XXX`).
  * Következő megnyitáskor azonnal az utoljára nézett adó indul el, és a forrásválasztó is automatikusan a megfelelő országra/listára áll át.
* **6 Nyelvű Kezelőfelület (i18n) (v3.6):**
  * Teljes felületi fordítás: 🇭🇺 Magyar (`hu`), 🇬🇧 Angol (`en`), 🇩🇪 Német (`de`), 🇫🇷 Francia (`fr`), 🇪🇸 Spanyol (`es`) és 🇷🇺 Orosz (`ru`).
  * Automatikus böngészőnyelv-felismerés és azonnali, mentett nyelvváltó az alsó vezérlősávban és a csatornalista fejlécében.
* **Minden Csatornára Kiterjesztett Műsorújság (EPG) (v3.6):**
  * Részletes XMLTV adatok a hazai adókhoz + intelligens, időpont- és műfajfüggő valós idejű műsorfolyam-generátor nemzetközi és egyéb csatornákhoz.
  * A műsorcímek és leírások a kiválasztott felületi nyelven jelennek meg, aktuális „ÉLŐBEN / LIVE” jelöléssel.
* **Mobilos Billentyűzet Felugrásának Megakadályozása (v3.6):**
  * A csatornalista és az alkalmazás megnyitásakor mobilon/tableten nem ugrik fel zavaróan a virtuális billentyűzet; csak akkor jelenik meg, ha a felhasználó közvetlenül a keresőmezőbe kattint.
* **131 Élő Magyar IPTV Csatorna (24/7):**
  * Országos, közszolgálati, film-, sorozat-, sport-, hír-, zenei, gyermek- és ismeretterjesztő csatornák kristálytiszta digitális minőségben.
* **Samsung Smart TV (Tizen OS) & Okostévé Teljes Kompatibilitás:**
  * Hardveres videósík rétegpromóció (`transform: translateZ(0)`), főszálon futó demuxolás (`enableWorker: false`), Smart TV watchdog és távirányító támogatás (Return: `10009`, Csatornaváltás: `427`/`428`).
* **Felhő alapú Vercel Proxy (`/api/proxy`):**
  * Teljes CORS és Mixed Content feloldás, M3U8 és TS URL-ek dinamikus átírása.
  * **HTTP 206 Partial Content & Range fejlécek támogatása:** azonnali lejátszásindítás.
  * Zéró helyi függőség: **nem kell futnia semmilyen szervernek a felhasználó számítógépén**.
* **Telemetria és Hibajelentő (`HIBAJELENTŐ` gomb):**
  * A tévékészülék káváján elhelyezett piros gomb megnyomásával az adáshibákról szóló diagnosztikai adatok felküldhetők a felhőbe (`/api/report`).
* **Valós idejű Technikai Statisztikák (⚙ Gomb):**
  * Élő ping mérés a Vercel szerverhez, stream felbontás, bitráta, puffer és eldobott képkockák kijelzése.
* **Nemzetközi Adások és Titkos Felnőtt Mód:**
  * Globális forrás választó: `iptv-org` nemzetközi csatornák elérhetősége.
  * A csatornakeresőbe az `xxx` szót beírva feloldódik 33 db ellenőrzött, működő felnőtt élő és VOD mozi adás.

---

## ☁️ Architektúra és Cloudflare Worker telepítése (v4.3)

```
Böngésző / TV / PWA  ──►  GitHub Pages (public/: HTML+CSS+JS, hls.js)
        │
        ├─► Cloudflare Worker  /api/proxy  ──► TV stream szerverek (M3U8 + TS)
        ├─► Cloudflare Worker  /api/report ──► Cloudflare KV (REPORTS)
        ├─► Cloudflare Worker  /api/stats
        └─► (tartalék) közvetlen HTTPS stream, ha a szerver engedi a CORS-t
Távirányító: PeerJS (WebRTC) + MQTT (HiveMQ / EMQX publikus broker)
```

### Telepítés lépésről lépésre
1. Ingyenes Cloudflare fiók: https://dash.cloudflare.com/sign-up
2. A repóban: `cd cloudflare-worker`
3. Bejelentkezés: `npx wrangler login` (böngészőben engedélyezd)
4. KV tároló a hibajelentéseknek: `npx wrangler kv namespace create REPORTS` – a kiírt `id`-t másold be a `wrangler.toml`-ba az `IDE_JON_A_KV_NAMESPACE_ID` helyére.
5. Élesítés: `npx wrangler deploy` – a végén kiírja a címet, pl. `https://zsirafvision-proxy.<fiókneved>.workers.dev`
6. Ezt a címet írd be a `public/js/app.js` elején a `PROXY_BASE` konstansba, majd commit + push. A GitHub Pages pár perc alatt frissül.
7. Ellenőrzés: `https://<worker-cím>/health` és `https://<worker-cím>/api/stats`

Helyi teszt: `npx wrangler dev` → `http://localhost:8787/api/stats`

### Hibajelentések kiolvasása
* Böngészőben: `https://<worker-cím>/api/report` (legújabb elöl, `?limit=200`-ig)
* Vagy: `npx wrangler kv key list --binding REPORTS --remote`
* Korlát: IP-nként 5 jelentés / 10 perc, max 16 KB, 90 napig tárolva.

### Ingyenes keret
Workers Free: 100 000 kérés / nap. Egy élő adás néhány kérést generál percenként (playlist + szegmensek), sávszélesség-díj nincs.

---

## 🛠️ Samsung Smart TV (Tizen OS) - Technikai hibajavítás (v3.5)

### A hiba oka
A Samsung Smart TV böngészője (Tizen OS) a hardveres videódekódolást egy különálló hardveres videósíkon („video hole”) végzi. Ha:
1. Egy szülő elemen CSS `filter` (pl. `filter: drop-shadow(...)`) található, a Tizen kompozitor nem tudja átütni a videósíkot a szűrőrétegen keresztül, így **a hang szól, de a kép teljesen fekete marad**.
2. A Hls.js lejátszó `enableWorker: true` beállítással fut, az alacsonyabb specifikációjú okostévés WebKit WebView-ban a Web Worker nem tudja megbízhatóan átadni a videóframe-eket a főszálnak, így a demuxer leállítja a videó renderelését.
3. A videókonténer `border-radius` lekerekítéssel bír, ami bizonyos Tizen verziókban hardveres vágási hibát okoz.

### A v3.5-ben bevezetett megoldások:
1. **CSS javítás**: A `.tv-cabinet` konténerről eltávolítottuk a `filter: drop-shadow(...)` szabályt, és szabványos `box-shadow`-ra cseréltük.
2. **GPU rétegpromóció**: A `<video>` elem megkapta a `transform: translateZ(0); -webkit-transform: translateZ(0); backface-visibility: hidden;` hardveres gyorsítást.
3. **Okostévé felismerés (`isSmartTV`)**: A `navigator.userAgent` alapján azonosítja a Samsung Tizen, LG webOS és SmartTV környezetet, és kikapcsolja a lekerekítéseket (`border-radius: 0`).
4. **Hls.js Worker kikapcsolás (`enableWorker: false`)**: A demuxolás a főszálon fut, megkerülve a Web Worker memóriaszál-hibát.
5. **Intelligens Videó Watchdog**: Ha a lejátszás elindult, de 4 másodperc elteltével a `videoWidth` még mindig 0 (csak hang hallható), a rendszer automatikusan átkapcsol a TV natív HLS motorjára (`video.src = streamUrl`).

---

## ⌨️ Irányítás & Távirányító billentyűk

| Billentyű / Távirányító gomb | Funkció |
| :--- | :--- |
| `Fel` / `Jobbra` / `Channel Up` | Következő csatorna |
| `Le` / `Balra` / `Channel Down` | Előző csatorna |
| `Enter` / `OK` | Némítás feloldása / Teljes képernyő |
| `Vissza` / `Return` (Tizen: `10009`) | Oldalsáv / műsorújság bezárása, kilépés teljes képernyőből |
| `Play` / `Pause` | Adás megállítása / folytatása |
| `+` / `-` | Hangerő szabályozás |
| `M` | Hang némítása / visszakapcsolása |
| `F` | Teljes képernyős mód (Full HD) |
| `C` | Csatornalista megnyitása |
| `P` | Műsorújság megnyitása |
| `H` / `?` / `F1` | Használati útmutató & Súgó megnyitása / bezárása |

---

## 📝 Verziótörténet (Changelog)

### [v4.3] - 2026-10-30
* **Fix**: **Átállás Vercelről Cloudflare Workerre** – a Vercel proxy `402 DEPLOYMENT_DISABLED` hibát adott (elfogyott az ingyenes keret), ezért nem indult egy csatorna sem és a hibajelentő sem működött.
* **Új**: `cloudflare-worker/worker.js` teljes backend: `/api/proxy` (M3U8 átírás, Range/206, CORS), `/api/report` (Cloudflare KV, IP-nkénti limit: 5 db / 10 perc, 90 napos megőrzés, GET-tel listázható), `/api/stats`, `/health`.
* **Biztonság**: a proxy csak ismert csatorna-hostokat enged teljesen; ismeretlen hostról csak média URL-t/tartalmat (m3u8, ts, mp4…), belső/privát IP-ket tilt.
* **Új**: `app.js` – egyetlen `PROXY_BASE` konstans; a régi Vercel linkeket a lejátszó automatikusan átírja. Tartalék: ha a Worker nem elérhető, HTTPS + CORS streameknél közvetlen lejátszás.
* **Update**: hls.js rögzítve `1.7.4`-re (`@latest` helyett); Service Worker cache `zsirafvision-v4.3`.

### [v4.2] - 2026-10-29
* **Új**: **Műsorújság (EPG) aktuálisan futó műsor valós idejű kiemelése**:
  * **Intelligens idősáv-felismerés:** A rendszer a helyi idő (óra és perc) alapján pontosan összeveti a műsor kezdési (`start`) és befejezési (`stop`) idejét.
  * **Éjféli átnyúlások kezelése:** Megbízhatóan kezeli a napváltást (pl. 23:30 - 01:00 közötti éjszakai adások).
  * **Látványos foszfor-zöld kiemelés:** Az éppen futó műsor tétel kiemelt zöld szegéllyel (`border-left: 4px solid var(--crt-phosphor)`), lágy fényárral, kiemelt fehér címmel és lüktető `🔴 ÉLŐBEN` (`pulseLiveBadge`) jelvénnyel jelenik meg.
  * **Automatikus odagörgetés (Auto-scroll):** A műsorújság kinyitásakor vagy csatornaváltáskor a lista automatikusan és finoman a pillanatnyilag nézhető műsorhoz görget, így a felhasználó azonnal látja az éppen menő adást még a 40+ tételes egész napos műsorstruktúrákban is.
* **Módosítás**: **Titkos felnőtt mód eltávolítása a Súgóból**:
  * A felhasználói kérésnek megfelelően a titkos felnőtt mód nem szerepel a nyilvános használati útmutatóban (❓ Súgó) egyik nyelven sem (`hu`, `en`, `de`, `fr`, `es`, `ru`), így megőrzi diszkrét, rejtett funkcióját.
* **Update**: PWA Service Worker gyorsítótár és kliens assetek egységes verziófrissítése (`v4.2`).

### [v4.1] - 2026-10-29
* **Fix**: **Súgó ablak megnyitásának javítása (DOM struktúra helyreállítása)**:
  * **Hiba oka:** A `public/index.html` sablonban a `#remote-modal` párosító ablak lezáró `</div>` címkéje hiányzott, emiatt a `#help-modal` a távirányító ablakának belsejébe ágyazódott be. Amikor a távirányító ablaka rejtve volt (`display: none`), a súgó ablak hiába kapta meg a `.open` osztályt, a rejtett szülőelem miatt fizikailag láthatatlan maradt.
  * **Megoldás:** A modálok DOM hierarchiájának szétválasztása, különálló háttérelemek biztosítása.
* **Fix**: **CSS Teljes képernyő szelektorok szétbontása**:
  * A `:fullscreen` és `:-webkit-full-screen` szelektorok önálló szabályokba rendezése, megakadályozva a böngészők (pl. Firefox) szelektor-érvénytelenítési figyelmeztetését.
* **Update**: Konzol logok és PWA Service Worker gyorsítótár egységes verziófrissítése (`v4.1`).

### [v4.0] - 2026-10-29
* **Új**: **❓ Többnyelvű Használati Útmutató és Súgó Rendszer**:
  * Új `❓ SÚGÓ` gomb az alsó vezérlősávban és azonnali gyorsbillentyűk (`H`, `?`, `F1`) a súgó megnyitásához.
  * **6 Nyelvű Fordítás:** Magyar (`hu`), angol (`en`), német (`de`), francia (`fr`), spanyol (`es`) és orosz (`ru`) nyelven elérhető teljes körű útmutató, beépített azonnali nyelvváltóval a fejlécben.
  * **11 Részletes Témakör:** Élő adások navigációja, csatornalista és keresés, kedvencek, műsorújság (EPG), elalvásidőzítő & készenlét, mobil távirányító, telepíthető PWA zsebtévé, többnyelvű felület, billentyűzet és okostévé vezérlés, technikai statisztikák & hibajelentő, titkos felnőtt mód.
  * **Interaktív Kereső és Kategóriaszűrők:** Valós idejű gépelési szűrőmező törlés gombbal, valamint kategória-chipek (Mind, Irányítás, Funkciók, Távirányító, Tippek & Trükkök).
  * **Jövőbiztos és Dinamikus Architektúra:** A súgó adatai az `i18n.js` `HELP_GUIDE` adatbázisából töltődnek be. Ha a jövőben új funkciókkal bővül az alkalmazás, csupán az `i18n.js`-ben kell új témakört felvenni mind a 6 nyelven, és a felület automatikusan, sablonmódosítás nélkül azonnal megjeleníti azt.
* **Update**: Service Worker gyorsítótár verzió léptetése (`zsirafvision-v4.0`) az azonnali és tiszta frissüléshez.

### [v3.9] - 2026-10-29
* **Fix**: **Mobil távirányító azonnali kapcsolódása (MQTT over WSS felhős híd)**:
  * **Hiba oka:** Mobilhálózatokon (Telekom, Yettel, Vodafone 4G/5G és mobilnet) a szolgáltatók Symmetric NAT-ot / CGNAT-ot alkalmaznak, amely nyilvános TURN szerver hiányában megakadályozza a közvetlen WebRTC P2P kapcsolódást, emiatt a távirányító folyamatosan a sárga/piros `Kapcsolódás: [KÓD]` állapotban maradt.
  * **Kétcsatornás megoldás (Dual-Channel):**
    * **1. Elsődleges, azonnali felhős csatorna:** Biztonságos WebSocket MQTT (`wss://broker.hivemq.com:8884/mqtt` és `wss://broker.emqx.io:8084/mqtt`). Ez a szabványos TLS 443/8884 porton keresztül **100%-ban átüti a mobilszolgáltatói Symmetric NAT-ot, CGNAT-ot és a legszigorúbb tűzfalakat is**, <200 ms válaszidővel.
    * **2. Másodlagos P2P csatorna:** A WebRTC / PeerJS csatorna párhuzamosan fut lokális hálózatokhoz.
  * **Helyi könyvtár integráció:** Hozzáadva a hivatalos Eclipse Paho MQTT kliens (`js/paho-mqtt.min.js`), így külső CDN kiesés nélkül, offline PWA környezetben is azonnal működik.
  * **UI & UX javítás:** A szobakód 4 betűs beviteli mezőre javítva (`PL. ETVM`), automatikus nagybetűs konverzióval és azonnali zöld visszajelzéssel (`TV Csatlakoztatva`).

### [v3.8] - 2026-10-29
* **Fix**: **Szobakód azonnali megjelenítése**: A TV párosító felugró ablakában a generált szobakód (pl. `B7K2`) mostantól azonnal, szinkron módon megjelenik a QR-kód alatt, nem vár a felhős PeerJS háttér-kapcsolat létrejöttére.
* **Fix**: **Mobil távirányító P2P kapcsolat javítása**:
  * Standardizált nagybetűs Peer ID azonosító (`zsiraf-tv-XXXX`) a TV és a mobil távirányító között az esetérzékenységi eltérések kizárására.
  * Google és Twilio publikus STUN szerverek beépítése a gyors és tűzfalakon átívelő WebRTC kapcsolódáshoz.
  * Kétirányú parancs-kompatibilitás (`cmd` és `action` mezők támogatása a távirányító eseménykezelőjében).
  * Hangerő kijelzés javítása a távirányító CRT képernyőjén (megelőzve a túlszorzást).

### [v3.7] - 2026-10-29
* **Új**: **⭐ Kedvencek (Favorites) rendszer**: Egykattintásos csillagozás a TV OSD kijelzőjén és a csatornalistában minden adó mellett. Dedikált `⭐ Kedvencek` kategória fül az elmentett adók azonnali szűréséhez és gyors eléréséhez, folyamatos számlálóval és `localStorage` mentéssel.
* **Új**: **🌙 Elalvásidőzítő (Sleep Timer) & Készenléti (Standby) mód**: Állítható időtartamok (15, 30, 45, 60, 90, 120 perc vagy kikapcsolva). Visszaszámláló kijelző a TV alsó vezérlősávjában és a modalban. Az utolsó 10 másodpercben lágy hangerő-lehalkítás (audio fade-out), majd a stream leállítása és készenléti mód aktiválása világító piros LED-del és bekapcsoló gombbal.
* **Új**: **📱 Mobil Távirányító QR-kóddal (WebRTC / PeerJS)**: A TV alsó sávjában lévő `📱 Távirányító` gombra kattintva generálódik egy egyedi szobakód és QR-kód. A telefon kamerájával beolvasva megnyílik a kifejezetten mobil képernyőkre tervezett retro távirányító app (`remote.html`). Teljes körű vezérlés (CH+/CH-, VOL+/VOL-, Mute, 0-9 gombok, D-pad, EPG, Guide, Kedvenc, Teljes képernyő, Sleep) és kétirányú állapot-visszajelzés a telefon mini CRT kijelzőjére. **100%-ban felhős P2P WebRTC, nulla helyi szerverrel!**
* **Új**: **📲 Tévé formájú telepíthető PWA mobilapp**: Progressive Web App konfiguráció (`manifest.json`, `sw.js`, 192x192 és 512x512 retro ikonok). Kezdőképernyőre helyezve böngészősávok nélkül, közvetlenül fekvő (landscape) teljes képernyős módban nyílik meg, igazi hordozható zsebtévé élményt adva.
* **Bővítés**: Mind a 6 nyelv (`hu`, `en`, `de`, `fr`, `es`, `ru`) bővítve az új funkciók (Kedvencek, Elalvásidőzítő, Készenlét, Távirányító) felirataival.

### [v3.6] - 2026-10-29
* **Új**: **Utolsóként nézett csatorna és ország megjegyzése**: A lejátszó `localStorage` segítségével elmenti az utoljára nézett adót és forrást (`HU`, `WORLD`, `XXX`), és a legközelebbi indításkor pontosan azzal indul el, automatikusan beállítva az országválasztót is.
* **Új**: **6 Nyelvű Kezelőfelület (i18n)**: Teljes felületi fordítás magyar (`hu`), angol (`en`), német (`de`), francia (`fr`), spanyol (`es`) és orosz (`ru`) nyelven. Két helyen elérhető gyorsváltóval (alsó vezérlősáv és csatornalista fejléc), valamint automatikus böngészőnyelv-felismeréssel.
* **Új**: **Bővített műsorújság (EPG)**: Minden csatornához – beleértve a külföldi és nemzetközi adókat is – elérhető a strukturált, több idősávos műsorújság. A magyar XMLTV adatbázis mellett intelligens, valós idejű műsorfolyam-generátor biztosítja a műsorokat a kiválasztott nyelven.
* **Fix**: **Mobilos billentyűzet felugrásának megakadályozása**: A csatornalista (`btnOpenGuide`) megnyitásakor eltávolításra került a `searchInput.focus()` hívás, így érintőképernyős eszközökön (mobil, tablet) nem ugrik fel zavaróan a virtuális billentyűzet.
* **Modul**: Önálló, tisztán strukturált `i18n.js` modul bevezetése a könnyű bővíthetőségért.

### [v3.5] - 2026-10-29
* **Fix**: Samsung Smart TV (Tizen OS) „nincs kép, csak hang” hiba teljeskörű elhárítása.
* **CSS**: `filter: drop-shadow` eltávolítása a TV káváról a hardveres videólyukasztás biztosításához; GPU layer promotion (`translateZ(0)`).
* **JS**: `enableWorker: false` beállítása a Hls.js motorban a Smart TV-k megbízható demuxolásához.
* **Watchdog**: Automatikus videófelügyelő, amely kép nélküli hang esetén natív TV HLS lejátszásra vált.
* **Remote**: Tizen távirányító gombkódok (`10009` Return, `427`/`428` Channel Up/Down) integrálása.
* **Doc**: Teljeskörű projekt- és hibajavítási dokumentáció a GitHubon.

### [v3.4] - 2026-10-29
* **Új**: 33 db ellenőrzött, valóban működő XXX (felnőtt) csatorna (Miami TV élő adások, Tiny4K 1080p mozi, Paradise Hill, Hentai).
* **Proxy**: HTTP 206 Partial Content és `Range` fejléc továbbítás a Vercel proxyban azonnali puffereléshez és tekeréshez.
* **Player**: Kettős lejátszási motor natív MP4 és HLS M3U8 formátumokhoz; kategóriaszűrés az XXX felületen.

### [v3.3] - 2026-10-29
* **Új**: Valós idejű EPG műsorújság a képernyő bal oldalán (64 csatornához pontos XMLTV adatok).
* **Új**: Piros `HIBAJELENTŐ` gomb a TV káváján diagnosztikai adatok felküldésével a Vercel `/api/report` végpontra.
* **Új**: Technikai adatok és szerverstátusz modal (`/api/stats`, ping, felbontás, bitráta).
* **Új**: `iptv-org` globális forrás integrációja.

### [v3.2] - 2026-10-29
* **Fix**: Külső logók CORS és `OpaqueResponseBlocking` hibáinak javítása (`referrerPolicy: no-referrer`).
* **Design**: Felesleges szövegek és feliratok eltávolítása a letisztult CRT televízió élményért.

### [v3.1] - 2026-10-29
* **Architektúra**: Áttérés a felhős Vercel Serverless proxyra a helyi gépen futó Python és alagút helyett.
* **Fix**: Autoplay blokkolás feloldása (némított indítás és CRT Play Overlay gomb).

### [v3.0] - 2026-10-28
* **Kezdeti release**: 131 élő magyar IPTV csatorna, retro televíziós káva és OSD kijelző.

---

Készült a Google DeepMind Antigravity segítségével.
