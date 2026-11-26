"use strict";
// API Card
// API Name: TheMealDB
// Base URL: https://www.themealdb.com/api/json/v1/1
// Endpoint used: /search.php?s=pasta
// HTTP method: GET
// Status code seen: 200
// Fields used: idMeal, strMeal, strCategory, strArea, strMealThumb
// Relevance: Demonstrates structured JSON search, image rendering, and error/empty-state handling in our web portal.
// Step 5: Generic Fetch Helper with Error Handling & 5s Timeout
async function getJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return (await response.json());
    }
    finally {
        clearTimeout(timer);
    }
}
// DOM References
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const searchForm = document.getElementById("searchForm");
const queryInput = document.getElementById("queryInput");
const searchBtn = document.getElementById("searchBtn");
// Step 6: setStatus & Safe DOM Rendering (createElement + textContent only)
function setStatus(text) {
    statusEl.textContent = text;
}
function createCard(item) {
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
function render(items) {
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
function buildURL(query) {
    const BASE_URL = "https://www.themealdb.com/api/json/v1/1/search.php";
    return `${BASE_URL}?s=${encodeURIComponent(query)}`;
}
async function search() {
    const query = queryInput.value.trim();
    if (!query) {
        setStatus("Please enter a search term.");
        return;
    }
    searchBtn.disabled = true;
    setStatus("Loading...");
    resultsEl.innerHTML = "";
    try {
        const data = await getJSON(buildURL(query));
        const items = data.meals ?? [];
        render(items);
        localStorage.setItem("lastMealQuery", query);
    }
    catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
            setStatus("Load failed: Request timed out (5s).");
        }
        else {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setStatus(`Load failed: ${msg}`);
        }
    }
    finally {
        searchBtn.disabled = false;
    }
}
searchForm.addEventListener("submit", (e) => {
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
