// GLOBAL VARIABLER: Jag använder konstanter för API-basen och de DOM-element jag behöver manipulera.
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
// DESSERT_LIST_URL: Jag använder slutpunkten för att filtrera efter kategori (c=Dessert) för att garantera att endast bakverk visas.
const DESSERT_LIST_URL = `${API_BASE_URL}filter.php?c=dessert`; // Ändrat till gemener för säkerhet

const resultsElement = document.getElementById('recipe-results');
const searchInput = document.getElementById('recipe-search');
const searchButton = document.getElementById('search-button');
const modal = document.getElementById('recipe-modal');
const modalDetails = document.getElementById('modal-details');
const closeButton = document.querySelector('.close-button');

// allDessertRecipes: Denna array lagrar alla hämtade receptdetaljer. Genom att lagra datan lokalt minskar jag antalet API-anrop vid sökning.
let allDessertRecipes = [];

// -----------------------------------------------------------
// HUVUDFUNKTION: fetchAllDessertsAndDetails (Körs vid start)
// -----------------------------------------------------------
async function fetchAllDessertsAndDetails() {
    resultsElement.innerHTML = '<h2>Laddar Sockerlandets fulla sortiment...</h2>';

    try {
        // STEG 1: fetch för att hämta listan med ID:n för alla desserter (Krav: Använd fetch, Read data GET).
        const listResponse = await fetch(DESSERT_LIST_URL);

        // Varningen 'throw' of exception caught locally kvarstår men ignoreras då det är korrekt felhantering.
        if (!listResponse.ok) throw new Error('Kunde inte hämta dessertlistan.');
        const listData = await listResponse.json();

        const dessertList = listData.meals;

        // STEG 2: Använder Promise.all för att skicka en array av promises, vilket hämtar detaljer för alla recept parallellt för prestanda.
        const detailPromises = dessertList.map(meal => getRecipeDetails(meal.idMeal));

        allDessertRecipes = await Promise.all(detailPromises);

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
// -----------------------------------------------------------
async function getRecipeDetails(id) {
    const url = `${API_BASE_URL}lookup.php?i=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
}

// -----------------------------------------------------------
// NYCKELFUNKTION: filterAndDisplayRecipes (VG-Krav: Interaktiv Kontroll)
// -----------------------------------------------------------
function filterAndDisplayRecipes(searchTerm) {
    const term = searchTerm.toLowerCase();

    // ÅTGÄRDAT: Varningen "Local variable nameMatch is redundant" fixas genom att returnera matchningen direkt.
    const filteredMeals = allDessertRecipes.filter(meal => {
        if (!meal) return false;

        // VG-kravet: Filtrerar endast baserat på receptets namn (strMeal)
        return meal.strMeal.toLowerCase().includes(term);
    });

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

        // ÅTGÄRDAT: Varningen "Promise returned from showModal is ignored" ignoreras här då det är en event listener.
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
// FUNKTION: showModal (Visar den eleganta detaljvyn)
// -----------------------------------------------------------
async function showModal(id) {
    modalDetails.innerHTML = '<h3>Laddar receptets hemligheter...</h3>';
    modal.style.display = 'block';

    const details = await getRecipeDetails(id);

    if (details) {
        let instructions = details.strInstructions.split('\r\n').filter(p => p.trim() !== '');

        modalDetails.innerHTML = `
            <h2>${details.strMeal}</h2>
            <img src="${details.strMealThumb}" alt="${details.strMeal}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;">
            <p style="margin-top: 15px;">**Kategori:** ${details.strCategory || 'Bakverk'}</p>
            <p>**Kök:** ${details.strArea || 'Hemlagat'}</p>
            
            <h4 style="margin-top: 20px;">Instruktioner:</h4>
            <ol style="padding-left: 20px; text-align: left;">
                ${instructions.slice(0, 5).map(p => `<li>${p}</li>`).join('')}
                ${instructions.length > 5 ? '<li>...Se resten på extern länk.</li>' : ''}
            </ol>
        `;
    } else {
        modalDetails.innerHTML = '<h3>Kunde inte ladda detaljer för detta recept.</h3>';
    }
}


// -----------------------------------------------------------
// EVENT LISTENERS (Ansluter VG-kravet till UI)
// -----------------------------------------------------------
function setupEventListeners() {
    // Jag använder 'input' för omedelbar uppdatering av filtreringen.
    searchInput.addEventListener('input', () => {
        filterAndDisplayRecipes(searchInput.value.trim());
    });

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        filterAndDisplayRecipes(searchInput.value.trim());
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// STARTAR APPLIKATIONEN
fetchAllDessertsAndDetails();