// ====================================
// Menu burger pour mobile
// ====================================
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// Toggle du menu
burger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animation du burger
    const spans = burger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});


// ====================================
// animation des chiffres des stats
// ====================================

const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = +stat.getAttribute('data-target');
    let count = 0;
    const speed = 50; // vitesse de l'animation (ms)

    const updateCount = () => {
        const increment = Math.ceil(target / 50); // ajuster le smooth
        count += increment;
        if (count > target) count = target;
        stat.textContent = count;
        if (count < target) {
            setTimeout(updateCount, speed);
        }
    };

    updateCount();
});


// ====================================
// Smooth scroll pour les ancres
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// Navbar au scroll
// ====================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Cacher/montrer la navbar au scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    // Ajouter une ombre quand on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ====================================
// Animation au scroll (Intersection Observer)
// ====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les éléments
const elementsToAnimate = document.querySelectorAll(
    '.about-text, .info-card, .skill-category, .project-card, .contact-intro, .contact-form'
);

elementsToAnimate.forEach(el => {
    observer.observe(el);
});

// ====================================
// Gestion du formulaire de contact
// ====================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérer les valeurs
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validation simple
    if (name && email && message) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        // Préparer les données pour PHP
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);

        // Envoi réel vers contact.php
        fetch('php/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then(res => {
            if(res === 'success') {
                submitBtn.textContent = 'Message envoyé ! ✓';
                submitBtn.style.backgroundColor = '#4CAF50';

                // Réinitialiser le formulaire
                contactForm.reset();

                // Message de confirmation
                showNotification('Merci pour votre message ! Je vous répondrai dans les plus brefs délais. 😊');
            } else {
                submitBtn.textContent = 'Erreur, réessayez';
                submitBtn.style.backgroundColor = '#f44336';
                showNotification('Erreur lors de l’envoi du message. 😢');
            }
        })
        .catch(() => {
            submitBtn.textContent = 'Erreur réseau';
            submitBtn.style.backgroundColor = '#f44336';
            showNotification('Erreur réseau, réessayez plus tard. 😢');
        })
        .finally(() => {
            // Rétablir le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        });
    }
});

// Fonction pour afficher un message (à adapter selon ton style)
function showNotification(msg) {
    let notif = document.getElementById('formMessage');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'formMessage';
        contactForm.parentNode.appendChild(notif);
    }
    notif.textContent = msg;
    notif.style.marginTop = '10px';
    notif.style.fontWeight = 'bold';
}


// ====================================
// Fonction de notification
// ====================================
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #5B7C99, #7A9AB8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        max-width: 400px;
    `;
    notification.textContent = message;

    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Retirer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// ====================================
// Effet parallaxe sur le hero
// ====================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');

    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ====================================
// Compteur animé pour les info-cards
// ====================================
function animateNumbers() {
    const cards = document.querySelectorAll('.info-card');

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Lancer l'animation au chargement
window.addEventListener('load', () => {
    animateNumbers();
});

// ====================================
// Détection de la section active dans la nav
// ====================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.opacity = '1';
                navLink.style.fontWeight = '700';
            } else {
                navLink.style.opacity = '0.8';
                navLink.style.fontWeight = '500';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ====================================
// Préloader (optionnel)
// ====================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ====================================
// Gestion des touches clavier
// ====================================
document.addEventListener('keydown', (e) => {
    // Échap pour fermer le menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ====================================
// Effet de typing sur le titre (optionnel)
// ====================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// =============================
// MODAL PROJETS
// =============================
document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("projectModal");
    const closeBtn = modal.querySelector(".close-modal");
    const contactBtn = modal.querySelector(".btn-contact");

    const modalTitle = modal.querySelector("#modal-title");
    const modalDescription = modal.querySelector("#modal-description");
    const modalDetails = modal.querySelector("#modal-details");

    const modalContent = modal.querySelector(".modal-content");

    const modalImage = document.createElement("img");
    modalImage.className = "modal-image";

    const modalGithub = document.createElement("a");
    modalGithub.className = "btn-github";
    modalGithub.target = "_blank";
    modalGithub.textContent = "Voir le projet sur GitHub";

    const modalFigma = document.createElement("a");
    modalFigma.className = "btn-github";
    modalFigma.target = "_blank";
    modalFigma.textContent = "Voir le projet sur Figma";

    modalContent.insertBefore(modalImage, modalTitle);
    modalContent.insertBefore(modalGithub, contactBtn);
    modalContent.insertBefore(modalFigma, contactBtn);

    const projectsData = {
        webdoc: {
            title: "Webdocumentaire – Cathédrale de Meaux",
            description:
                "Projet de webdocumentaire réalisé en groupe autour de la cathédrale de Meaux.",
            image: "docs/webdoc.png",
            github: "https://github.com/JustMe0819/Webdocumentaire-.git",
            details: [
                "HTML / CSS / JavaScript",
                "Travail collaboratif",
                "Narration interactive",
                "Gestion des médias"
            ]
        },

        oxyair: {
            title: "Oxy'Air – Maquette Figma",
            description:
                "Maquette Figma d’une version écologique d’Airbnb.",
            image: "docs/oxy'air.png",
            figma: "https://www.figma.com/design/rjZjgJXUmHMx2jmzn7meXV/Oxy-Air?node-id=0-1&t=lbvNaHeUGp0EJq2f-1",
            details: [
                "UI / UX Design",
                "Prototype Figma",
                "Approche écoresponsable"
            ]
        },

        sushifast: {
            title: "SushiFast",
            description:
                "Site de commande de sushis développé en React, réalisé en duo.",
            image: "docs/sushi.png",
            github: "https://github.com/LeonardoHenriquesM/SushiFast.git",
            details: [
                "React + Vite",
                "React Router",
                "Données JSON",
                "Responsive design"
            ]
        },

        edudrive: {
            title: "Edudrive – Maquette Figma",
            description:
                "Maquette d’un site d’auto-école, développement non finalisé.",
            image: "docs/sae401.png",
            figma: "https://www.figma.com/design/66d6l1aBhjZZezY6YH2cCs/SAE-401?node-id=14-102&t=pfdxj2rSn9NtKQ9a-1",
            details: [
                "Maquette Figma",
                "Angular (début)",
                "PHP (base)"
            ]
        },

        pixeldev: {
            title: "PixelDev – En cours",
            description:
                "Plateforme de formation développée en React et Spring Boot.",
            image: "docs/sae501.png",
            github: "https://github.com/LeonardoHenriquesM/iut.meaux.pixeldev.git",
            details: [
                "React",
                "Spring Boot",
                "Projet de groupe"
            ]
        },

        blender: {
            title: "Salle de bain – Blender",
            description:
                "Modélisation 3D complète d’une salle de bain.",
            image: "docs/salledebain.png",
            github: "https://github.com/JustMe0819/Salle-de-bain-Blender.git",
            details: [
                "Blender",
                "Modélisation 3D",
                "Textures & éclairages"
            ]
        }
    };

    document.querySelectorAll(".btn-project-view").forEach(button => {
        button.addEventListener("click", () => {

            const key = button.dataset.projet;
            const project = projectsData[key];
            if (!project) return;

            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;

            modalImage.src = project.image;
            modalImage.alt = project.title;

            modalGithub.href = project.github;

            modalDetails.innerHTML = "";
            project.details.forEach(detail => {
                const li = document.createElement("li");
                li.textContent = detail;
                modalDetails.appendChild(li);
            });

            // On cache les deux par défaut
            modalGithub.style.display = "none";
            modalFigma.style.display = "none";

            // Si le projet a un GitHub
            if (project.github) {
                modalGithub.href = project.github;
                modalGithub.style.display = "inline-block";
            }

            // Si le projet a un Figma
            if (project.figma) {
                modalFigma.href = project.figma;
                modalFigma.style.display = "inline-block";
            }

            modal.classList.add("active");
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", e => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // =============================
    // CONTACT : fermer + scroll
    // =============================
    contactBtn.addEventListener("click", e => {
        e.preventDefault();

        modal.classList.remove("active");

        setTimeout(() => {
            const contactSection = document.querySelector("#contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        }, 200);
    });

});

const scrollTopBtn = document.getElementById("scrollTop");

// afficher / cacher le bouton
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

// scroll vers le haut
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});



// ====================================
// Console message pour les curieux 🕵️
// ====================================
console.log('%c👋 Bonjour curieux !', 'font-size: 20px; color: #5B7C99; font-weight: bold;');
console.log('%cVous inspectez le code ? C\'est une excellente habitude ! 💻', 'font-size: 14px; color: #666;');
console.log('%cSi vous avez des questions ou des opportunités, contactez-moi ! 😊', 'font-size: 14px; color: #666;');
console.log('%c- Thylia Brouillard', 'font-size: 12px; color: #999; font-style: italic;');