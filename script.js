document.addEventListener('DOMContentLoaded', function() {
    // Riferimenti agli elementi
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-links a');
    const successModal = document.getElementById('successModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.querySelector('.close-modal');

    // Toggle menu mobile
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            console.log('Menu button clicked'); // Per debug
            navContainer.classList.toggle('mobile-menu-open');
        });
    }

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

    // Gestione form di contatto con Web3Forms
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Disabilita il pulsante durante l'invio
            const submitBtn = document.getElementById('submitBtn') || form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Invio in corso...';
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Invia Messaggio';
                }

                if (response.status == 200) {
                    // Reset del form
                    form.reset();

                    // Mostra il modal di successo se esiste
                    if (successModal && modalOverlay) {
                        successModal.classList.add('active');
                        modalOverlay.classList.add('active');
                    } else {
                        // Fallback se il modal non esiste
                        alert('Messaggio inviato con successo!');
                    }
                } else {
                    console.log(response);
                    alert("Errore: " + json.message);
                }
            })
            .catch(error => {
                console.log(error);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Invia Messaggio';
                }
                alert("Si è verificato un errore. Riprova più tardi.");
            });
        });
    }

    // Chiusura del modal di successo
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            successModal.classList.remove('active');
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            successModal.classList.remove('active');
            modalOverlay.classList.remove('active');
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

    // Gestione del carosello testimonianze
    function initTestimonialsCarousel() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return;

        const cards = carousel.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        const indicatorsContainer = document.querySelector('.carousel-indicators');

        let currentIndex = 0;
        let cardWidth = 0;
        let visibleCards = 1;

        // Crea gli indicatori
        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            const totalIndicators = Math.ceil(cards.length / visibleCards);

            for (let i = 0; i < totalIndicators; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (i === 0) indicator.classList.add('active');

                indicator.addEventListener('click', () => {
                    goToSlide(i);
                });

                indicatorsContainer.appendChild(indicator);
            }
        }

        // Calcola quante card sono visibili in base alla larghezza dello schermo
        function updateCarouselLayout() {
            cardWidth = cards[0].offsetWidth + 30; // Width + gap

            if (window.innerWidth >= 1024) {
                visibleCards = 3;
            } else if (window.innerWidth >= 768) {
                visibleCards = 2;
            } else {
                visibleCards = 1;
            }

            createIndicators();
            goToSlide(0);
        }

        // Va a uno slide specifico
        function goToSlide(index) {
            const maxIndex = Math.ceil(cards.length / visibleCards) - 1;
            currentIndex = Math.max(0, Math.min(index, maxIndex));

            const offset = -(currentIndex * visibleCards * cardWidth);
            carousel.style.transform = `translateX(${offset}px)`;

            // Aggiorna gli indicatori
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === currentIndex);
            });
        }

        // Inizializzazione
        window.addEventListener('resize', updateCarouselLayout);
        updateCarouselLayout();

        // Event listeners per i pulsanti
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }

        // Gestione swipe per mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                // Swipe left
                goToSlide(currentIndex + 1);
            } else if (touchEndX - touchStartX > threshold) {
                // Swipe right
                goToSlide(currentIndex - 1);
            }
        }
    }

    // Gestione del form di recensione
    function initReviewForm() {
        const reviewForm = document.getElementById('reviewForm');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(reviewForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Disabilita il pulsante durante l'invio
            const submitBtn = document.getElementById('reviewSubmitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Invio in corso...';
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Invia Recensione';
                }

                if (response.status == 200) {
                    // Reset del form
                    reviewForm.reset();

                    // Mostra un messaggio di successo
                    alert('Grazie per la tua recensione! Sarà pubblicata dopo essere stata approvata.');
                } else {
                    console.log(response);
                    alert("Errore: " + json.message);
                }
            })
            .catch(error => {
                console.log(error);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Invia Recensione';
                }
                alert("Si è verificato un errore. Riprova più tardi.");
            });
        });
    }

    // Inizializza il carosello testimonianze
    initTestimonialsCarousel();

    // Inizializza il form di recensione
    initReviewForm();

    // Inizializza l'animazione al caricamento della pagina
    animateOnScroll();
});
document.addEventListener('DOMContentLoaded', function() {
    // Seleziona gli elementi DOM
    const chatButton = document.getElementById('chat-button');
    const chatPopup = document.getElementById('chat-popup');
    const closeChat = document.getElementById('close-chat');
    const sendMessage = document.getElementById('send-message');
    const userMessage = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Risposte predefinite
    const responses = {
        "quali servizi offrite": "Offriamo una vasta gamma di servizi di sviluppo digitale tra cui:<br>- Sviluppo App iOS native<br>- Sviluppo App Android native<br>- Sviluppo Web responsive<br>- Progettazione UI/UX<br>- Integrazione API e servizi cloud<br><br>Vuoi saperne di più su uno specifico servizio?",

        "come funziona il processo di lavoro": "Il nostro processo di sviluppo si articola in queste fasi:<br>1. Analisi e Pianificazione<br>2. Design UI/UX<br>3. Sviluppo<br>4. Test e Ottimizzazione<br>5. Lancio e Supporto<br><br>Ogni progetto è seguito da un team dedicato di professionisti per garantire risultati eccellenti.",

        "quanto costa un progetto": "I costi variano in base alla complessità e alle esigenze specifiche del progetto.<br><br>- App Web: a partire da €1599<br>- App Nativa (iOS e Android): a partire da €2499<br>- Soluzione Completa: a partire da €4999<br><br>Per un preventivo personalizzato, contattaci tramite il form nella sezione contatti o chiamando il numero +39 331 2754741.",

        "vorrei essere ricontattato": "Grazie per il tuo interesse nei servizi di Pingo Development!<br><br>Per essere ricontattato, puoi:<br>- Chiamare il numero +39 331 2754741<br>- Compilare il form nella sezione contatti<br>- Inviarci un'email a j.pingo.development@gmail.com<br>- Contattarci su WhatsApp<br><br>Un nostro esperto ti ricontatterà al più presto per discutere del tuo progetto."
    };


    // Toggle chat popup
    chatButton.addEventListener('click', function() {
        chatPopup.style.display = chatPopup.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close chat
    closeChat.addEventListener('click', function() {
        chatPopup.style.display = 'none';
    });

    // Add message to chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user' : 'message assistant';

        if (!isUser) {
            // Aggiungi avatar solo ai messaggi dell'assistente
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'message-avatar';

            const avatarImg = document.createElement('img');
            avatarImg.src = 'images/pingo_robot.png';
            avatarImg.alt = 'Pingo Robot';

            avatarDiv.appendChild(avatarImg);
            messageDiv.appendChild(avatarDiv);
        }

        const messagePara = document.createElement('p');
        messagePara.innerHTML = text;

        messageDiv.appendChild(messagePara);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get response based on user message
    function getResponse(message) {
        const lowerMessage = message.toLowerCase();

        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return value;
            }
        }

        return "Grazie per la tua domanda! Per informazioni più dettagliate, ti consiglio di contattarci direttamente tramite il form nella sezione contatti o chiamando il numero +39 331 2754741.";
    }

    // Handle send message
    function handleSendMessage() {
        const message = userMessage.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, true);

        // Clear input
        userMessage.value = '';

        // Send response after a short delay
        setTimeout(function() {
            const response = getResponse(message);
            addMessage(response, false);
        }, 500);
    }

    // Send button click
    sendMessage.addEventListener('click', handleSendMessage);

    // Enter key press
    userMessage.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Quick questions
    quickQuestions.forEach(function(button) {
        button.addEventListener('click', function() {
            const question = this.textContent;

            // Add user question
            addMessage(question, true);

            // Send response after a short delay
            setTimeout(function() {
                const response = getResponse(question.toLowerCase());
                addMessage(response, false);
            }, 500);
        });
    });
});
