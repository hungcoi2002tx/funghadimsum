/* ================================================
   FUNGHA DIMSUM - Landing Page Scripts
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // App initialized
    console.log('Fungha Dimsum - Landing Page loaded.');

    // --- Mobile menu toggle ---
    const hamburger = document.querySelector('#hamburger');
    const navbar = document.querySelector('#navbar');
    const navLinks = document.querySelectorAll('#navbar .nav-links a');
    const backdrop = document.querySelector('#nav-backdrop');

    function toggleMenu(open) {
        hamburger.classList.toggle('open', open);
        navbar.classList.toggle('nav-open', open);
        hamburger.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';

        // Show/hide backdrop
        if (backdrop) {
            if (open) {
                backdrop.style.display = 'block';
                // Trigger transition after display:block
                requestAnimationFrame(() => backdrop.classList.add('active'));
            } else {
                backdrop.classList.remove('active');
                // Hide after transition
                backdrop.addEventListener('transitionend', () => {
                    backdrop.style.display = 'none';
                }, { once: true });
            }
        }
    }

    hamburger.addEventListener('click', () => {
        const isOpen = navbar.classList.contains('nav-open');
        toggleMenu(!isOpen);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu when backdrop is clicked
    if (backdrop) {
        backdrop.addEventListener('click', () => toggleMenu(false));
    }

    // --- Active nav link theo section đang hiển thị ---
    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -55% 0px', // trigger khi section chiếm vùng giữa viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- Sticky header on scroll ---
    const header = document.querySelector('#header');

    function updateHeaderSync() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Fix for horizontal scrolling on fixed header (desktop only)
        if (window.innerWidth > 1024) {
            header.style.left = `-${window.scrollX}px`;
            header.style.width = `${document.documentElement.scrollWidth}px`;
        } else {
            header.style.left = '';
            header.style.width = '';
        }
    }

    window.addEventListener('scroll', updateHeaderSync);
    window.addEventListener('resize', updateHeaderSync);

    // Initial sync
    setTimeout(updateHeaderSync, 100);

    // --- Floating Bánh Bao Button ---
    const baoBaoBtn = document.querySelector('#baoBaoBtn');
    if (baoBaoBtn) {
        baoBaoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Close mobile nav if open
            if (navbar.classList.contains('nav-open')) {
                toggleMenu(false);
            }
            // Smooth scroll to contact section
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#contact') {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- Hero Slider ---
    const heroSection = document.querySelector('#hero');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (heroSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const updateSlider = (index) => {
            heroSlides[currentSlide].classList.remove('active');
            if (dots.length > 0) dots[currentSlide].classList.remove('active');

            currentSlide = index;

            heroSlides[currentSlide].classList.add('active');
            if (dots.length > 0) dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            const nextIndex = (currentSlide + 1) % heroSlides.length;
            updateSlider(nextIndex);
        };

        const prevSlide = () => {
            const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
            updateSlider(prevIndex);
        };

        const startSlider = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        };

        // Click events
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startSlider(); // reset interval
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startSlider();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlider(index);
                startSlider();
            });
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        if (heroSection) {
            heroSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, { passive: true });
        }

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Only trigger if horizontal swipe is clearly intended (diffX > diffY)
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > swipeThreshold) {
                    // Swipe left -> next slide
                    nextSlide();
                    startSlider();
                } else if (diffX < -swipeThreshold) {
                    // Swipe right -> prev slide
                    prevSlide();
                    startSlider();
                }
            }
        };

        // Initialize auto play
        startSlider();

        // --- Hero Art Direction: Responsive Image Swap ---
        const MOBILE_BREAKPOINT = 768;
        let lastWasMobile = null;

        function updateHeroImages() {
            const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

            // Only swap if the breakpoint actually changed
            if (isMobile === lastWasMobile) return;
            lastWasMobile = isMobile;

            heroSlides.forEach(slide => {
                const src = isMobile
                    ? slide.getAttribute('data-mobile')
                    : slide.getAttribute('data-desktop');
                if (src) {
                    slide.style.backgroundImage = `url('${src}')`;
                }
            });
        }

        // Run on load
        updateHeroImages();

        // Run on resize (debounced)
        let heroResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(heroResizeTimer);
            heroResizeTimer = setTimeout(updateHeroImages, 150);
        });
    }

    // --- Contact Section: Branch Map Switching ---
    const branchCards = document.querySelectorAll('.branch-card');
    const contactMap = document.getElementById('contact-map');
    const mapLabel = document.getElementById('map-branch-label');

    if (branchCards.length > 0 && contactMap) {
        branchCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active from all cards
                branchCards.forEach(c => c.classList.remove('active'));
                // Add active to clicked card
                card.classList.add('active');

                // Update map iframe
                const mapUrl = card.getAttribute('data-map');
                if (mapUrl) {
                    contactMap.src = mapUrl;
                }

                // Update label
                const branchName = card.querySelector('.branch-name');
                const labelText = mapLabel ? mapLabel.querySelector('.map-label-text') : null;
                const labelLink = mapLabel ? mapLabel.querySelector('.map-label-link') : null;
                if (branchName && labelText) {
                    labelText.textContent = branchName.textContent;
                }
                // Update Google Maps link
                const lat = card.getAttribute('data-lat');
                const lng = card.getAttribute('data-lng');
                if (labelLink && lat && lng) {
                    labelLink.href = `https://maps.google.com/?q=${lat},${lng}`;
                }
            });
        });
    }

    // --- Contact Section: Scroll Fade-in Animation ---
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
        const contactElements = contactSection.querySelectorAll(
            '.contact-title-block, .contact-hotline, .branch-card, .contact-map-container'
        );

        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = entry.target.classList.contains('branch-card')
                        ? 'translateX(0)' : 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        contactElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            if (el.classList.contains('branch-card')) {
                el.style.transform = 'translateX(-20px)';
            } else {
                el.style.transform = 'translateY(20px)';
            }
            contactObserver.observe(el);
        });
    }

    // --- Promotions Carousel ---
    const promoTrack = document.getElementById('promoTrack');
    const promoCards = document.querySelectorAll('.promo-card');
    const promoDots = document.querySelectorAll('.promo-dot');
    const promoPrev = document.querySelector('.promo-prev');
    const promoNext = document.querySelector('.promo-next');

    if (promoTrack && promoCards.length > 0) {
        let promoCurrentIndex = 0;
        let promoInterval;
        const totalPromos = promoCards.length;

        // Detect mobile
        const isMobile = () => window.innerWidth <= 768;
        const getCardsPerView = () => isMobile() ? 1 : 3;

        // Update card classes for center emphasis
        function updateCardClasses() {
            promoCards.forEach((card, i) => {
                card.classList.remove('is-center', 'is-side');
            });

            if (!isMobile()) {
                // Center card of the visible 3
                const centerIndex = promoCurrentIndex + 1;
                promoCards.forEach((card, i) => {
                    if (i === centerIndex && i < totalPromos) {
                        card.classList.add('is-center');
                    } else if ((i === promoCurrentIndex || i === promoCurrentIndex + 2) && i < totalPromos) {
                        card.classList.add('is-side');
                    }
                });
            } else {
                // On mobile, the current card is always "center"
                if (promoCards[promoCurrentIndex]) {
                    promoCards[promoCurrentIndex].classList.add('is-center');
                }
            }
        }

        // Update active dot
        function updatePromoDots() {
            promoDots.forEach(dot => dot.classList.remove('active'));
            // On desktop, highlight the center card dot
            const activeDotIndex = isMobile() ? promoCurrentIndex : promoCurrentIndex + 1;
            if (promoDots[activeDotIndex]) {
                promoDots[activeDotIndex].classList.add('active');
            }
        }

        // Move carousel
        function movePromoCarousel(index) {
            const cardsPerView = getCardsPerView();
            const maxIndex = totalPromos - cardsPerView;
            // Clamp index
            if (index < 0) index = maxIndex;
            if (index > maxIndex) index = 0;

            promoCurrentIndex = index;

            const cardWidthPercent = 100 / cardsPerView;
            const translateX = -(promoCurrentIndex * cardWidthPercent);
            promoTrack.style.transform = `translateX(${translateX}%)`;

            updateCardClasses();
            updatePromoDots();
        }

        // Next / Prev
        function promoNextSlide() {
            movePromoCarousel(promoCurrentIndex + 1);
        }

        function promoPrevSlide() {
            movePromoCarousel(promoCurrentIndex - 1);
        }

        // Auto-play
        function startPromoAutoPlay() {
            clearInterval(promoInterval);
            promoInterval = setInterval(promoNextSlide, 4000);
        }

        function resetPromoAutoPlay() {
            startPromoAutoPlay();
        }

        // Event listeners
        if (promoNext) {
            promoNext.addEventListener('click', () => {
                promoNextSlide();
                resetPromoAutoPlay();
            });
        }

        if (promoPrev) {
            promoPrev.addEventListener('click', () => {
                promoPrevSlide();
                resetPromoAutoPlay();
            });
        }

        // Dot click
        promoDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                if (isMobile()) {
                    movePromoCarousel(i);
                } else {
                    // Dot index = center card, so start = index - 1
                    movePromoCarousel(Math.max(0, i - 1));
                }
                resetPromoAutoPlay();
            });
        });

        // Touch/Swipe support
        let promoTouchStartX = 0;
        let promoTouchStartY = 0;

        promoTrack.addEventListener('touchstart', (e) => {
            promoTouchStartX = e.changedTouches[0].screenX;
            promoTouchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        promoTrack.addEventListener('touchend', (e) => {
            const diffX = promoTouchStartX - e.changedTouches[0].screenX;
            const diffY = promoTouchStartY - e.changedTouches[0].screenY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    promoNextSlide();
                } else {
                    promoPrevSlide();
                }
                resetPromoAutoPlay();
            }
        }, { passive: true });

        // Handle resize
        let promoResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(promoResizeTimeout);
            promoResizeTimeout = setTimeout(() => {
                movePromoCarousel(0);
            }, 200);
        });

        // Initialize
        movePromoCarousel(0);
        startPromoAutoPlay();
    }

    // --- Promotions Section: Scroll Fade-in Animation ---
    const promoSection = document.querySelector('.promo-section');
    if (promoSection) {
        const promoAnimElements = promoSection.querySelectorAll(
            '.promo-title-block, .promo-carousel-wrapper, .promo-dots'
        );

        const promoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        promoAnimElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.15}s`;
            promoObserver.observe(el);
        });
    }

    // --- Menu Tabs ---
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuPanes = document.querySelectorAll('.menu-pane');

    if (menuTabs.length > 0) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Hủy active cũ
                menuTabs.forEach(t => t.classList.remove('active'));
                menuPanes.forEach(p => p.classList.remove('active'));

                // Active tab mới
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const targetPane = document.getElementById(targetId);

                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }
});
