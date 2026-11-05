// Array cu imaginile din folderul images
const images: string[] = [
    "../images/images.jpeg",
    "../images/image_2.jpeg",
    "../images/image_3.jpeg"
];

// Obtinem elementul principal din DOM
const mainImage = document.getElementById("carousel-image") as HTMLImageElement;

// Verificam daca elementul exista
if (!mainImage) {
    throw new Error("Elementul 'carousel-image' nu a fost gasit!");
}

let currentIndex = 0;

// Functie care schimba imaginea mare (cu animatie Step 12)
function showNextImage(): void {
    // Animatie de tranzitie (fade-out + shrink)
    mainImage.style.opacity = "0";
    mainImage.style.transform = "scale(0.95)";

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % images.length;
        mainImage.src = images[currentIndex]!;

        // Tranzitie inapoi (fade-in + restore scale)
        mainImage.style.opacity = "1";
        mainImage.style.transform = "scale(1)";
    }, 400);
}

// Slider automat la 3 secunde (3000 ms)
setInterval(showNextImage, 3000);