# 📺 ZsirafVision - Online IPTV & Web Player (v3.6)

Korszerű, 100%-ban felhő alapú IPTV webes televízió és médialejátszó, amely **131 élő magyar televízióadást**, **6 nyelvű kezelőfelületet**, valós idejű **nemzetközi EPG műsorújságot**, okostévé (Samsung Tizen / LG webOS) támogatást és felhős diagnosztikai rendszert biztosít.

* **Élő Web App (GitHub Pages):** [https://zsirafmix.github.io/zsirafvision/](https://zsirafmix.github.io/zsirafvision/)
* **Felhős Proxy & API (Vercel Serverless):** `https://zsirafvision-vercel.vercel.app`
* **Aktuális verzió:** `v3.6`

---

## 🚀 Főbb funkciók és képességek

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

---

## 📝 Verziótörténet (Changelog)

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
