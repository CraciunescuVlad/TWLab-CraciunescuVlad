"use strict";
// Creeaza un element div care va fi cursorul personalizat
const cursor = document.createElement("div");
// Seteaza un ID pentru acest element ca sa putem aplica stiluri CSS usor
cursor.id = "cursor";
// Adauga elementul creat in corpul documentului, astfel incat sa fie vizibil pe pagina
document.body.appendChild(cursor);
// Initializam variabila pentru nuanta culorii la 0
let hue = 0;
// Asculta evenimentul de miscare a mouse-ului pe intreaga pagina
document.addEventListener("mousemove", (e) => {
    // Actualizeaza pozitia elementului cursor in functie de coordonatele mouse-ului
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});
// Functie care schimba culoarea cursorului ciclic pentru efect curcubeu
function animateColor() {
    // Crestem nuanta cu 1 si o mentinem intre 0 si 359
    hue = (hue + 1) % 360;
    // Seteaza culoarea de fundal a cursorului folosind HSL
    cursor.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    // Adauga un efect de glow (umbra) la cursor cu aceeasi culoare
    cursor.style.boxShadow = `0 0 15px hsl(${hue}, 100%, 50%)`;
    // Reapeleaza functia la urmatorul frame pentru animatie continua
    requestAnimationFrame(animateColor);
}
// Porneste animatia de schimbare a culorii
animateColor();
