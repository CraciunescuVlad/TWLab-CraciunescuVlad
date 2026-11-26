// URL-ul corect conform API-ului HipoLabs pentru România
const API_URL = "http://universities.hipolabs.com/search?country=Romania";

// Referințe DOM
const statusEl = document.getElementById("status");
const tbody = document.getElementById("tbody");
const qInput = document.getElementById("q");
const btnExport = document.getElementById("btnExport");

let all = [];
let currentData = [];

// Funcție ajutătoare pentru actualizarea mesajului de status
function setStatus(text) {
    statusEl.textContent = text;
}

// Funcție pentru randarea datelor în tabel
function render(data) {
    currentData = data;
    tbody.innerHTML = data.map(u => {
        const site = u.web_pages?.[0]
            ? `<a href="${u.web_pages[0]}" target="_blank" rel="noopener noreferrer">${u.web_pages[0]}</a>`
            : "-";

        return `
      <tr>
        <td>${u.name || ""}</td>
        <td>${u.country || ""}</td>
        <td>${site}</td>
      </tr>
    `;
    }).join("");
}

// Pasul 3: Preluarea asincronă a universităților prin HTTP API
async function loadUniversities() {
    setStatus("Se încarcă...");
    tbody.innerHTML = "";
    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        all = data;
        render(all);
        setStatus(`Încărcat (${all.length} rezultate).`);
    } catch (err) {
        setStatus("Eroare la încărcare. Încearcă din nou.");
        console.error(err);
    }
}

// Filtrare în timp real la introducerea textului
qInput.addEventListener("input", () => {
    const q = qInput.value.trim().toLowerCase();
    const filtered = q
        ? all.filter(u => (u.name || "").toLowerCase().includes(q))
        : all;

    render(filtered);
    setStatus(`Filtrate: ${filtered.length} din ${all.length}.`);
});

// Pasul 5: Funcționalitatea de Export către CSV
function exportCSV(data) {
    if (!data.length) {
        return alert("Nu există date de exportat.");
    }

    const header = ["Nume", "Tara", "Site"];
    const rows = data.map(u => [
        u.name || "",
        u.country || "",
        (u.web_pages && u.web_pages[0]) || ""
    ]);

    // Formatare corectă conform standardului CSV (escapare ghilimele duble)
    const csvContent = [header, ...rows]
        .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "universitati_romania.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Evenimentul pentru butonul de export (exportă datele filtrate curent afișate)
btnExport.addEventListener("click", () => {
    exportCSV(currentData);
});

// Inițializare: apelăm funcția la încărcarea paginii
loadUniversities();