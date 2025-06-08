document.addEventListener('DOMContentLoaded', function() {
    // Riferimenti agli elementi
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Toggle menu mobile
    mobileMenuBtn.addEventListener('click', function() {
        navContainer.classList.toggle('mobile-menu-open');
    });

    // Chiudi il menu quando si fa clic su un link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Controlla se siamo in modalità mobile (finestra piccola)
            if (window.innerWidth <= 768) {
                navContainer.classList.remove('mobile-menu-open');
            }
        });
    });

    // Chiudi il menu anche quando si ridimensiona la finestra oltre 768px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navContainer.classList.remove('mobile-menu-open');
        }
    });
});


    // Portfolio filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Animazione per gli elementi quando entrano nel viewport
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .process-step, .pricing-card, .testimonial-card');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };

    // Pulsante "Torna su"
    const backToTopButton = document.createElement('div');
    backToTopButton.classList.add('back-to-top');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }

        animateOnScroll();
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Gestione form di contatto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Qui puoi aggiungere il codice per inviare il form
            // Per ora mostriamo solo un alert
            alert('Il messaggio è stato inviato con successo!');
            contactForm.reset();
        });
    }

    // Gestione form newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Qui puoi aggiungere il codice per gestire l'iscrizione alla newsletter
            // Per ora mostriamo solo un alert
            alert('Grazie per esserti iscritto alla nostra newsletter!');
            newsletterForm.reset();
        });
    }

    // Inizializza l'animazione al caricamento della pagina
    animateOnScroll();
});
