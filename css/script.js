// GLOBAL VARIABLER: Jag använder konstanter för API-basen och de DOM-element jag behöver manipulera.
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
// Jag använder slutpunkten för att filtrera efter kategori (c=Dessert) för att garantera att endast bakverk visas, istället för den oprecisa sökfunktionen.
const DESSERT_LIST_URL = `${API_BASE_URL}filter.php?c=Dessert`;

const resultsElement = document.getElementById('recipe-results');
const searchInput = document.getElementById('recipe-search');
const searchButton = document.getElementById('search-button');
const modal = document.getElementById('recipe-modal');
const modalDetails = document.getElementById('modal-details');
const closeButton = document.querySelector('.close-button');

// allDessertRecipes: Denna array lagrar alla hämtade receptdetaljer. Genom att lagra datan lokalt minskar jag antalet API-anrop vid sökning.
let allDessertRecipes = [];

// -----------------------------------------------------------
// HUVUDFUNKTION: fetchAllDessertsAndDetails
// Denna asynkrona funktion hanterar API-anropet i två steg.
// -----------------------------------------------------------
async function fetchAllDessertsAndDetails() {
    resultsElement.innerHTML = '<h2>Laddar Sockerlandets fulla sortiment...</h2>';

    try {
        // STEG 1: fetch för att hämta listan med ID:n för alla desserter (Krav: Använd fetch, Read data GET).
        const listResponse = await fetch(DESSERT_LIST_URL);

        // FELHANTERING (Valfritt krav): Kontrollerar status på svaret.
        if (!listResponse.ok) throw new Error('Kunde inte hämta dessertlistan.');
        const listData = await listResponse.json();

        const dessertList = listData.meals;

        // STEG 2: Använder Promise.all för att skicka en array av promises, vilket hämtar detaljer för alla recept parallellt för prestanda.
        const detailPromises = dessertList.map(meal => getRecipeDetails(meal.idMeal));
        allDessertRecipes = await Promise.all(detailPromises);

        // Sätt upp event listeners och visa initial data
        setupEventListeners();
        filterAndDisplayRecipes(searchInput.value.trim());

    } catch (error) {
        // Om fel: Visar ett felmeddelande på sidan (Krav: Handle error states).
        console.error('Kunde inte ladda Sockerlandet:', error);
        resultsElement.innerHTML = `<h2>Åh nej, ett fel uppstod vid laddning av desserter.</h2>`;
    }
}

// -----------------------------------------------------------
// FUNKTION: getRecipeDetails
// Funktion för att hämta detaljer för ett specifikt ID.
// -----------------------------------------------------------
async function getRecipeDetails(id) {
    const url = `${API_BASE_URL}lookup.php?i=${id}`;
    // Använder fetch igen för att slå upp detaljer.
    const response = await fetch(url);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
}

// -----------------------------------------------------------
// NYCKELFUNKTION: filterAndDisplayRecipes (VG-Krav: Interaktiv Kontroll)
// -----------------------------------------------------------
function filterAndDisplayRecipes(searchTerm) {
    const term = searchTerm.toLowerCase();

    // Jag använder Array.filter() på den lokalt lagrade datan för att matcha VG-kravet effektivt.
    const filteredMeals = allDessertRecipes.filter(meal => {
        if (!meal) return false;
        // Filtrerar endast baserat på receptets namn (strMeal)
        const nameMatch = meal.strMeal.toLowerCase().includes(term);
        return nameMatch;
    });

    // Skickar den filtrerade arrayen till visningsfunktionen.
    displayRecipes(filteredMeals);
}


// -----------------------------------------------------------
// FUNKTION: displayRecipes (Dynamisk Visning)
// -----------------------------------------------------------
function displayRecipes(meals) {
    resultsElement.innerHTML = '';

    if (!meals || meals.length === 0) {
        resultsElement.innerHTML = '<h2>Inga underbara bakverk matchade sökningen.</h2>';
        return;
    }

    meals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.id = meal.idMeal;

        // Klickhändelsen utlöser hämtning av detaljer och visning av modalen.
        card.addEventListener('click', () => {
            showModal(meal.idMeal);
        });

        // Här skapas den dynamiska HTML-strukturen för korten.
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="recipe-info">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strArea || 'Sockerlandet'} Kök</p>
            </div>
        `;

        resultsElement.appendChild(card);
    });
}

// -----------------------------------------------------------
// EVENT LISTENERS (Ansluter VG-kravet till UI)
// -----------------------------------------------------------
function setupEventListeners() {
    // Jag använder 'input' istället för 'keypress' för att få omedelbar uppdatering under tiden användaren skriver (bästa praxis för VG-krav).
    searchInput.addEventListener('input', () => {
        filterAndDisplayRecipes(searchInput.value.trim());
    });

    // Knappen gör samma sak som input-fältet.
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        filterAndDisplayRecipes(searchInput.value.trim());
    });

    // Stängningslogik för modalen
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// STARTAR APPLIKATIONEN genom att hämta all data.
fetchAllDessertsAndDetails();