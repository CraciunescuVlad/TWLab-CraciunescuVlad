// API Card
// API Name: TheMealDB
// Base URL: https://www.themealdb.com/api/json/v1/1
// Endpoint used: /search.php?s=pasta
// HTTP method: GET
// Status code seen: 200
// Fields used: idMeal, strMeal, strCategory, strArea, strMealThumb
// Relevance: Demonstrates structured JSON search, image rendering, and error/empty-state handling in our web portal.

// Step 2: TypeScript Interfaces
interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
}

interface MealResponse {
    meals: Meal[] | null;
}

// Step 5: Generic Fetch Helper with Error Handling & 5s Timeout
async function getJSON<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return (await response.json()) as T;
    } finally {
        clearTimeout(timer);
    }
}

// DOM References
const statusEl = document.getElementById("status") as HTMLParagraphElement;
const resultsEl = document.getElementById("results") as HTMLDivElement;
const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const queryInput = document.getElementById("queryInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;

// Step 6: setStatus & Safe DOM Rendering (createElement + textContent only)
function setStatus(text: string): void {
    statusEl.textContent = text;
}

function createCard(item: Meal): HTMLElement {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.strMealThumb;
    img.alt = item.strMeal;
    img.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = item.strMeal;

    const detail = document.createElement("p");
    detail.textContent = `${item.strCategory} • ${item.strArea}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(detail);

    return card;
}

function render(items: Meal[]): void {
    resultsEl.innerHTML = "";
    if (items.length === 0) {
        setStatus("No results found.");
        return;
    }

    items.forEach((item) => {
        resultsEl.appendChild(createCard(item));
    });
    setStatus(`Loaded ${items.length} result(s).`);
}

// Step 7: Interaction Handler
function buildURL(query: string): string {
    const BASE_URL = "https://www.themealdb.com/api/json/v1/1/search.php";
    return `${BASE_URL}?s=${encodeURIComponent(query)}`;
}

async function search(): Promise<void> {
    const query = queryInput.value.trim();
    if (!query) {
        setStatus("Please enter a search term.");
        return;
    }

    searchBtn.disabled = true;
    setStatus("Loading...");
    resultsEl.innerHTML = "";

    try {
        const data = await getJSON<MealResponse>(buildURL(query));
        const items: Meal[] = data.meals ?? [];
        render(items);
        localStorage.setItem("lastMealQuery", query);
    } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
            setStatus("Load failed: Request timed out (5s).");
        } else {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setStatus(`Load failed: ${msg}`);
        }
    } finally {
        searchBtn.disabled = false;
    }
}

searchForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    search();
});

// Step 8: Persistence with localStorage
window.addEventListener("DOMContentLoaded", () => {
    const lastQuery = localStorage.getItem("lastMealQuery");
    if (lastQuery) {
        queryInput.value = lastQuery;
        search();
    }
});