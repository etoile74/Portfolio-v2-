//#################### Swiper ######################################################################
let mySwiper;
let currentSlide = 0;
const slides = document.querySelectorAll(".swiper-slide");

// Fonction pour initialiser selon l'écran
function initializeMySwiper() {
  if (window.innerWidth > 1024) {
    // Version desktop avec Swiper
    if (!mySwiper) {
      mySwiper = new Swiper(".swiper", {
        effect: "slide",
        allowTouchMove: false,
        grabCursor: false,
/*        effect: "cube",
        cubeEffect: {
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        },                               */
        mousewheel: true,
        speed: 700, // durée de la transition en ms (500–800 = léger mais fluide)
      });

      // Liens aside pour desktop
      setupAsideNavigation();

      mySwiper.on("slideChange", () => {
        updateActiveLink(mySwiper.activeIndex);
      });
    }
  } else {
    // Version mobile sans swiper
    if (mySwiper) {
      mySwiper.destroy(true, true); // désactive swiper
      mySwiper = null;
    }
    showSlide(currentSlide);
  }
}

function Navigate(index) {
  if (mySwiper) {
    // Desktop
    mySwiper.slideTo(index, 1000);
  } else {
    // Mobile
    currentSlide = index;
    showSlide(currentSlide);
  }
}

// Fonction pour afficher une slide manuellement (mobile)
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? "block" : "none";
  });
  updateNavButtons();
  updateActiveLink(index); // important pour que le menu suive aussi en mode mobile
}

// Mise à jour des boutons ◀ ▶
const prevBtn = document.getElementById("prev-slide");
const nextBtn = document.getElementById("next-slide");

function updateNavButtons() {
  if (!prevBtn || !nextBtn) return;

  if (currentSlide === 0) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = "0.5";
    prevBtn.style.cursor = "not-allowed";
  } else {
    prevBtn.disabled = false;
    prevBtn.style.opacity = "1";
    prevBtn.style.cursor = "pointer";
  }

  if (currentSlide === slides.length - 1) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";
  } else {
    nextBtn.disabled = false;
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
  }
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });
}

// Navigation aside pour desktop
function setupAsideNavigation() {
  // IMPORTANT : on cible la nouvelle structure BEM
  const links = document.querySelectorAll(".sidebar__links li");

  links.forEach((link, index) => {
    link.addEventListener("click", () => {
      if (mySwiper) {
        mySwiper.slideTo(index, 1000);
      } else {
        currentSlide = index;
        showSlide(currentSlide);
      }
    });
  });
}

// Mise à jour du lien actif dans le menu
function updateActiveLink(index) {
  const links = document.querySelectorAll(".sidebar__links li");
  links.forEach((link, i) => {
    // On garde activeLink pour compatibilité avec ton CSS existant
    link.classList.toggle("activeLink", i === index);
    // Et on ajoute aussi la version BEM
    link.classList.toggle("sidebar__item--active", i === index);
  });
}

// Initialisation
initializeMySwiper();
// Si tu veux retrouver le comportement dynamique, remplace le console.log par initializeMySwiper
window.addEventListener("resize", initializeMySwiper);
//##################################################################################################

//################## loader animation ##################################
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.remove(), 500);
    }, 2000);
  }
});
//######################################################################

//############### Webhook Discord ##################################################################
document.getElementById("contactForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Veuillez remplir tous les champs avant d'envoyer.");
    return;
  }

  const webhookURL = "https://discord.com/api/webhooks/1505854533215977555/S0SfowWigKtm81Q18cUMCsJkuCPWtlOYfeWUWmkbSl6QJnom_Wrr6faZMKDl-SybtO6M";

  const payload = {
    embeds: [
      {
        title: "Nouveau message reçu",
        color: 0x5865F2,
        fields: [
          {
            name: "Nom",
            value: name || "Non renseigné",
            inline: true,
          },
          {
            name: "Email",
            value: email || "Non renseigné",
            inline: true,
          },
          {
            name: "Message",
            value: message.length > 1024 ? message.slice(0, 1021) + "..." : message,
            inline: false,
          },
        ],
        footer: {
          text: "Message envoyé le " + new Date().toLocaleString(),
        },
      },
    ],
  };

  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Message envoyé avec succès !");
      document.getElementById("contactForm").reset();
    } else {
      alert("Erreur lors de l'envoi du message.");
    }
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue.");
  }
});
//###############################################################################################

//####################### Modal gallery section ##################################################
const galleryProjects = document.querySelectorAll(
  ".swiper-slide.gallery:not(.swiper-slide-duplicate) .gallery__project"
);

// Fonction pour ouvrir la modale gallery
function openGalleryModal(title, description, zipUrl = null, images = []) {
  document.getElementById("gallery-title").innerText = title;
  document.getElementById("gallery-description").innerText = description || "Aucune description";

  // Bouton de téléchargement ZIP
  let downloadDiv = document.getElementById("gallery-download");
  if (!downloadDiv) {
    downloadDiv = document.createElement("div");
    downloadDiv.id = "gallery-download";
    document.querySelector("#gallery-modal .modal__content").appendChild(downloadDiv);
  }
  if (zipUrl) {
    downloadDiv.innerHTML = `<a href="${zipUrl}" download>Télécharger le dossier (.zip)</a>`;
  } else {
    downloadDiv.innerHTML = "";
  }

  // Images annexes
  let imagesDiv = document.getElementById("gallery-images");
  if (!imagesDiv) {
    imagesDiv = document.createElement("div");
    imagesDiv.id = "gallery-images";
    document.querySelector("#gallery-modal .modal__content").appendChild(imagesDiv);
  }
  if (images.length > 0) {
    imagesDiv.innerHTML = images
      .map((url) => `<img src="${url}" alt="Image annexe" style="max-width: 100%; margin: 10px 0;" />`)
      .join("");
  } else {
    imagesDiv.innerHTML = "";
  }

  document.getElementById("gallery-modal").classList.add("show");
}

// Fermer la modale gallery
function closeGalleryModal() {
  document.getElementById("gallery-modal").classList.remove("show");
}

// Attache les events sur chaque projet galerie
galleryProjects.forEach((item) => {
  const img = item.querySelector("img");
  const titleElement = item.querySelector("h2");
  const description = item.getAttribute("data-description");
  const title = titleElement ? titleElement.innerText : "";

  if (title === "Mes Projects" || title === "My Projects") {
    const zipUrl = "sae 105.zip"; // adapte l’URL si besoin
    if (img) img.addEventListener("click", () => openGalleryModal(title, description, zipUrl));
    if (titleElement) titleElement.addEventListener("click", () => openGalleryModal(title, description, zipUrl));
  } else if (title === "Mes Loisirs" || title === "My Hobbies") {
    const imageArray = [
      "img/loisir1.jpg",
      "img/loisir2.jpg",
      // ajoute d'autres liens image si besoin
    ];
    if (img) img.addEventListener("click", () => openGalleryModal(title, description, null, imageArray));
    if (titleElement) titleElement.addEventListener("click", () => openGalleryModal(title, description, null, imageArray));
  } else {
    if (img) img.addEventListener("click", () => openGalleryModal(title, description));
    if (titleElement) titleElement.addEventListener("click", () => openGalleryModal(title, description));
  }
});

// Clic sur la croix ferme le modal
document.getElementById("close-gallery-modal").addEventListener("click", closeGalleryModal);

// Fermer en cliquant en dehors du contenu
window.addEventListener("mousedown", (e) => {
  const modal = document.getElementById("gallery-modal");
  if (e.target === modal) {
    closeGalleryModal();
  }
});
//###############################################################################################

//############## Modale Compétences ##############################################################
const skillItems = document.querySelectorAll(".skill-item");

skillItems.forEach((item) => {
  item.addEventListener("click", () => {
    const title = item.querySelector("p").innerText;
    const description = item.getAttribute("data-description");

    document.getElementById("skill-title").innerText = title;
    document.getElementById("skill-description").innerText = description;

    document.getElementById("skill-modal").classList.add("show");
  });
});

function closeSkillModal() {
  document.getElementById("skill-modal").classList.remove("show");
}

// Fermer si clic en dehors de la modale
window.addEventListener("click", (e) => {
  const modal = document.getElementById("skill-modal");
  if (e.target === modal) {
    closeSkillModal();
  }
});
//###############################################################################################

// ################## Dark/Light Mode #######################################
const btn = document.createElement("div");
btn.classList.add("theme-toggle");

// Charger le thème sauvegardé
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

// Fonction toggle
function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");

  btn.setAttribute("title", isLight ? "Dark mode" : "Light mode");
}
btn.addEventListener("click", toggleTheme);

// Fonction pour placer le bouton au bon endroit
function placeThemeButton() {
  const pcContainer = document.getElementById("theme-toggle-container-pc");
  const mobileContainer = document.getElementById("theme-toggle-container-mobile");

  if (!pcContainer || !mobileContainer) return;

  if (window.innerWidth > 1024) {
    // Mode PC → dans aside
    if (!pcContainer.contains(btn)) {
      mobileContainer.innerHTML = "";
      pcContainer.appendChild(btn);
    }
  } else {
    // Mode mobile/tablette → dans accueil
    if (!mobileContainer.contains(btn)) {
      pcContainer.innerHTML = "";
      mobileContainer.appendChild(btn);
    }
  }
}

// Initial placement
placeThemeButton();

// Replacer à chaque resize
window.addEventListener("resize", placeThemeButton);

btn.setAttribute("title", "Dark mode");
//###############################################################################################