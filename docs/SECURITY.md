# Biztonság (v4.5)

## Proxy (Worker + Render)
- **Allowlist**: csak `public/allowed_hosts.json` hostjai, vagy a proxy által kiadott HMAC-aláírt URL (6 óra lejárat).
- **SSRF védelem**: privát / nem publikus IP-k tiltása (DNS feloldás után, minden átirányításnál és a Renderen a ténylegesen kapcsolódott IP-re is), decimális / egyéb IP-trükkök kiszűrése.
- **Tartalom**: csak média típusok (m3u8, ts, m4s, aac, kulcs); playlistnek `#EXTM3U`-val kell kezdődnie.
- **Limitek**: playlist 2 MB, szegmens 40 MB, 15 mp időkorlát, 900 kérés / perc / IP.
- **TLS**: a Render ellenőrzi a tanúsítványt; kivétel hostonként `TLS_INSECURE_HOSTS` (alapból `.lexanetwork.com`, hibás tanúsítvány miatt).
- **CORS**: csak `https://zsirafmix.github.io` és localhost (a Render a 302 utáni `Origin: null`-t is elfogadja).
- **Fejlécek**: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` stb.

## Hibajelentés
- POST: Origin és Content-Type ellenőrzés, 16 KB, HTML-szűrés, mélység / kulcs / elem korlátok, 5 db / 10 perc / IP.
- GET (listázás): csak `Authorization: Bearer <REPORT_TOKEN>`.

## Front-end
- Content-Security-Policy meta, SRI (`sha384`) a jsDelivr szkriptekre, `crossorigin="anonymous"`.
- Külső adatok (EPG) escape-elve, `innerHTML` helyett ahol lehet `textContent`.
- Szobakód: 26 karakter, `crypto.getRandomValues`, ~130 bit; a telefon ellenőrzi a formátumot.
- Távirányító parancsok whitelistje, számjegy-validálás.

## Titkok
Csak nevek – értékek sosem kerülnek a repóba:

| Név | Hol | Mire |
|---|---|---|
| `REPORT_TOKEN` | Worker secret | hibajelentések listázása |
| `RENDER_SIGN_KEY` | Worker secret + Render env | URL-aláírás (azonos érték) |

Csere: új érték generálása (`python3 -c "import secrets;print(secrets.token_urlsafe(48))"`), `npx wrangler secret put …`, Renderen env frissítés + redeploy.

## Hibabejelentés
Biztonsági hibát kérjük ne nyilvános issue-ban, hanem privát üzenetben (GitHub: @zsirafmix) jelezz.
