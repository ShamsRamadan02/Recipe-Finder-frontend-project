# Sockerlandet – Receptsökare (Frontend Slutprojekt)
Projektöversikt
Detta projekt är en Single-Page Application (SPA) utvecklad för att söka och filtrera
bakverksrecept från TheMealDB API. Applikationen uppfyller samtliga krav för 
Frontend-slutprojektet, inklusive VG-kravet för interaktiv kontroll. Designen är 
elegant och inbjudande, med en pastellfärgad palett (rosa, lila, blå, gul) och mjuka
skuggor för att skapa en realistisk och användarvänlig UI. Sidan demonstrerar effektiv
användning av moderna frontend-tekniker.

# Teknisk Implementation
Datahantering och Logik

Projektet använder en specifik datastrategi för att hantera TheMealDB API. 
För att garantera att endast bakverk visas görs ett initialt fetch-anrop till slutpunkten
filter.php?c=Dessert. Därefter görs ytterligare fetch-anrop parallellt med hjälp av 
Promise.all för att hämta de fullständiga detaljerna för varje recept. 
Den fullständiga datan lagras sedan lokalt i en JavaScript-array för snabb filtrering,
vilket minimerar onödiga API-anrop under sökning. Felhantering, 
inklusive try...catch block och response.ok kontroller är implementerad i alla 
asynkrona anrop.

Interaktiv Kontroll (VG-Krav)

VG-kravet för interaktiv kontroll uppfylls genom en realtidsfiltreringsfunktion. 
Funktionen filterAndDisplayRecipes() är kopplad till sökfältets input-händelse. 
Den filtrerar den lokalt lagrade dataarrayen mot användarens sökterm, vilket 
resulterar i en omedelbar och effektiv användarupplevelse.

Frontend Struktur och Design

Sidan är byggd med semantisk HTML-struktur. Den responsiva layouten uppnås genom 
användning av CSS Grid för att hantera receptkortens dynamiska placering och Flexbox
för att organisera sökkontrollerna. Detta säkerställer en robust och mobilanpassad 
design. Dynamisk visning uppnås genom att korten renderas via displayRecipes() och 
detaljer visas i en Modal via showModal() vid användarklick.

Startinstruktioner
Projektfilerna kan laddas ner via repot. För att köra applikationen lokalt, 
öppna filen index.html direkt i valfri webbläsare. Appen laddar initialt alla desserter. 
Använd sökfältet för att filtrera listan i realtid, och klicka på ett kort för att 
visa den fullständiga detaljvyn.

Kontakt & Inlämning
Inlämning av: Shams Ali Ramadan | Datum: 11/12 (Vecka 50) 