// GLOBAL VARIABLER
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
// Vi lägger till en URL för att hämta ALLA recept i kategorin "Dessert"
const DESSERT_LIST_URL = `${API_BASE_URL}filter.php?c=Dessert`;

const resultsElement = document.getElementById('recipe-results');
const searchInput = document.getElementById('recipe-search');
const searchButton = document.getElementById('search-button');

const modal = document.getElementById('recipe-modal');
const modalDetails = document.getElementById('modal-details');
const closeButton = document.querySelector('.close-button');

// Ny variabel: Lagrar den fullständiga listan av alla desserter (måste hämtas i två steg)
let allDessertRecipes = [];

// -----------------------------------------------------------
// HUVUDFUNKTION: fetchAllDessertsAndDetails (Hämtar data i två steg)
// -----------------------------------------------------------
async function fetchAllDessertsAndDetails() {
    resultsElement.innerHTML = '<h2>Laddar Sockerlandets fulla sortiment...</h2>';

    try {
        // STEG 1: Hämta listan med alla Dessert ID:n och namn
        const listResponse = await fetch(DESSERT_LIST_URL);
        if (!listResponse.ok) throw new Error('Kunde inte hämta dessertlistan.');
        const listData = await listResponse.json();

        const dessertList = listData.meals;

        if (!dessertList) {
            resultsElement.innerHTML = '<h2>Kunde inte hitta några recept i Dessertkategorin.</h2>';
            return;
        }

        // STEG 2: Hämta detaljer för varje recept ID (Detta ger oss all information vi behöver)
        const detailPromises = dessertList.map(meal => getRecipeDetails(meal.idMeal));

        // Väntar på att alla detaljer ska hämtas parallellt
        allDessertRecipes = await Promise.all(detailPromises);

        // Sätt upp event listeners efter att data har laddats
        setupEventListeners();

        // Visa alla recept som standard initialt
        filterAndDisplayRecipes(searchInput.value.trim());

    } catch (error) {
        console.error('Kunde inte ladda Sockerlandet:', error);
        resultsElement.innerHTML = `<h2>Åh nej, ett fel uppstod vid laddning av desserter.</h2>`;
    }
}

// -----------------------------------------------------------
// FUNKTION: getRecipeDetails (Hämtar enskilda detaljer)
// Denna funktion är identisk med den du hade, men används nu i bulk.
// -----------------------------------------------------------
async function getRecipeDetails(id) {
    const url = `${API_BASE_URL}lookup.php?i=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
}

// -----------------------------------------------------------
// NY FUNKTION: filterAndDisplayRecipes (VG-Krav: Sökning på lokal data)
// -----------------------------------------------------------
function filterAndDisplayRecipes(searchTerm) {
    const term = searchTerm.toLowerCase();

    // 1. Filtrera den lokalt lagrade datan baserat på sökterm
    const filteredMeals = allDessertRecipes.filter(meal => {
        if (!meal) return false; // Ignorera om detaljhämtning misslyckades

        // Matchar om receptnamnet innehåller söktermen
        const nameMatch = meal.strMeal.toLowerCase().includes(term);

        // Du kan lägga till fler matchningar här, t.ex. på ingredienser om du vill:
        // const ingredientMatch = meal.strIngredient1?.toLowerCase().includes(term);

        return nameMatch;
    });

    // 2. Visa den filtrerade listan
    displayRecipes(filteredMeals);
}


// -----------------------------------------------------------
// FUNKTION: displayRecipes (Dynamisk visning)
// -----------------------------------------------------------
function displayRecipes(meals) {
    resultsElement.innerHTML = '';

    if (!meals || meals.length === 0) {
        resultsElement.innerHTML = '<h2>Inga underbara bakverk matchade sökningen. Prova t.ex. "Cake" eller "Mousse"!</h2>';
        return;
    }

    meals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.id = meal.idMeal;

        card.addEventListener('click', () => {
            showModal(meal.idMeal);
        });

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
// FUNKTION: showModal (Visar detaljvy)
// -----------------------------------------------------------
async function showModal(id) {
    // Funktionen för modalen är oförändrad från ditt tidigare, eleganta utkast
    modalDetails.innerHTML = '<h3>Laddar receptets hemligheter...</h3>';
    modal.style.display = 'block';

    const details = await getRecipeDetails(id);

    if (details) {
        // Vi lägger till en snygg instruktionslista
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
// EVENT LISTENERS (VG-Krav)
// -----------------------------------------------------------
function setupEventListeners() {
    // VG-kravet hanteras nu av filterAndDisplayRecipes funktionen
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        filterAndDisplayRecipes(searchInput.value.trim());
    });

    searchInput.addEventListener('input', () => { // Använder 'input' för omedelbar filtrering
        filterAndDisplayRecipes(searchInput.value.trim());
    });

    // Modal-stängning
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// STARTA APPLIKATIONEN
fetchAllDessertsAndDetails();