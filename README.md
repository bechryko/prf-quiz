# prf-quiz

Kötelező program az SZTE Programtervező Informatikus MSc szak Programrendszerek fejlesztése tárgyához.

## Projekt elindítása

1. A projekt mappájában add ki az `npm run install` parancsot, ami telepíti a frontend és backend dependency-ket!
2. A projekt mappájában add ki az `npm run start-frontend` parancsot!
3. Hogyha nem létezik a Docker container, akkor a backend mappájában (`server`) add ki az `npm run docker` parancsot!
4. A projekt mappájában add ki az `npm run start-backend` parancsot, vagy a backend mappájában az `npm run start` parancsot!

## Feladatkiírás

Szerepkörök: admin és játékos.

Az admin kvízeket hozhat létre kérdésekkel és válaszokkal. A kvízek játékokhoz vannak rendelve, és a játékosok jelentkezhetnek a játékokra. A helyes válaszok száma alapján a játékosok pontokat szerezhetnek, és felkerülhetnek a ranglistára. Csak a játékosok regisztrálhatnak az alkalmazásba. A játékosok listázhatják az elérhető játékokat és elindíthatják a kvízeket a játékokba való belépéssel. Az admin előre regisztrálva van.

## Részletes követelmények

A szervernek REST API-kat kell biztosítania, amelyek felelősek az alapvető CRUD (Create-Read-Update-Delete) műveletekért. Kommunikálnia kell egy MongoDB példánnyal, feldolgoznia a klienstől érkező kéréseket és lekérdezéseket kell indítania az adatbázis felé. A projektnek a CRUD műveleteknél a hitelesítést (csak autentikált felhasználó hajthatja végre) és session-kezelést támogatnia kell. Új felhasználók kezelése érdekében a regisztráció megvalósítása is szükséges.

A web-alkalmazást az Angular 2+ keretrendszer használatával kell implementálni. Egy egyszerű web-alkalmazásnak kell lennie, amely HTTP kéréseket tud indítani REST-en a szerver felé. A web-alkalmazásnak végre kell hajtania az alapvető CRUD műveleteket. A végrehajtott műveletek alapján a szerver visszaválaszol a kliensnek, ami megjeleníti az eredményeket a böngészőben.

Az adatbázisnak egy MongoDB példánynak kell lennie, amely adatokat tud szolgáltatni a szerveren keresztül a kliensnek. A MongoDB lehet helyben host-olt, konténerizál, de akár MongoDB Atlas használata is megengedett. Az adatmodellnek tartalmaznia kell legalább 4 kollekciót és azok megfelelő kapcsolatkezelését. Az adatbázisnak alapértelmezetten tartalmaznia kell néhány demó adatot, amely megjeleníthető a web-alkalmazásban.
