# Recipe Finder frontend project
# 🍰 Sockerlandet – Receptsökare (Frontend End Project)

## ✨ Projektbeskrivning

**Sockerlandet** är en elegant Single-Page Application (SPA) byggd för att söka och filtrera bakverksrecept och desserter. Projektet uppfyller alla krav för slutprojektet i Frontend-utveckling.

Applikationen använder ett somrigt, pastellfärgat tema (ljusrosa, ljusgult och vitt) och har en realistisk UI med dynamiska kort och en detaljvy (Modal) vid klick.

---

## ⚙️ Teknik och Funktioner

### Kärnfunktionalitet

| Krav | Implementerat i | Beskrivning |
| :--- | :--- | :--- |
| **API-Källa** | `script.js` | Använder **TheMealDB API**. |
| **Fetch & GET** | `script.js` | Använder **`fetch()`** för att hämta listor och enskilda receptdetaljer. |
| **(VG) Interaktiv Kontroll** | `script.js` | **Realtidsfiltrering:** Filtrerar den lokalt lagrade dessertlistan baserat på sökfältets input (`filterAndDisplayRecipes`). |
| **Dynamisk Visning** | `script.js` | Recepten visas som dynamiska kort i en responsiv grid. Klick på kortet visar en **Modal (detaljvy)**. |
| **Datafiltrering** | `script.js` | Hämtar endast recept från kategorin **"Dessert"** för att säkerställa att inga måltider visas. |
| **Felhantering** | `script.js` | Inkluderar `try...catch` och `response.ok` kontroller i alla API-anrop. |

### Front-End Krav

* **Semantic HTML:** Använder korrekt struktur med `<header>`, `<main>` och `<section>`.
* **Responsiv/Clear UI:** CSS använder **CSS Grid** (för korten) och **Flexbox** (för sökfältet) för att skapa en anpassningsbar layout.

---

## 🚀 Hur man Startar

Följ dessa steg för att köra projektet lokalt:

1.  **Klona (Clone) Repot:** Ladda ner projektfilerna till din dator via kommandotolken eller genom att ladda ner som ZIP.
2.  **Öppna Filen:** Öppna **`index.html`** direkt i valfri webbläsare (t.ex. Safari eller Chrome).
3.  **Filtrera:** Appen laddar initialt alla desserter. Använd sökfältet för att filtrera listan i realtid.
4.  **Detaljer:** Klicka på ett receptkort för att öppna den dynamiska detaljvyn (Modal).

---

## 📧 Kontakt & Inlämning

* **Inlämningsdatum:** 11/12 (Vecka 50)
* **Student:** [Shams Ali Ramadan]
