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
        // Ici tu peux ajouter l'envoi vers un service comme Formspree, EmailJS, etc.
        // Pour l'instant, on simule l'envoi
        
        // Animation du bouton
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simuler l'envoi
        setTimeout(() => {
            submitBtn.textContent = 'Message envoyé ! ✓';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Afficher un message de confirmation
            showNotification('Merci pour votre message ! Je vous répondrai dans les plus brefs délais. 😊');
            
            // Rétablir le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    }
});

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

// Décommenter pour activer l'effet typing sur le hero
// window.addEventListener('load', () => {
//     const heroTitle = document.querySelector('.hero h1');
//     if (heroTitle) {
//         const text = heroTitle.textContent;
//         typeWriter(heroTitle, text, 50);
//     }
// });

// ====================================
// Console message pour les curieux 🕵️
// ====================================
console.log('%c👋 Bonjour curieux !', 'font-size: 20px; color: #5B7C99; font-weight: bold;');
console.log('%cVous inspectez le code ? C\'est une excellente habitude ! 💻', 'font-size: 14px; color: #666;');
console.log('%cSi vous avez des questions ou des opportunités, contactez-moi ! 😊', 'font-size: 14px; color: #666;');
console.log('%c- Thylia Brouillard', 'font-size: 12px; color: #999; font-style: italic;');