document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll);
    });
    handleScroll(); // init

    // 2. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle hamburger icon lines animation if needed
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });

    // 3. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('animated'));
    }

    // 4. Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, counterObserverOptions);

    if (!prefersReducedMotion) {
        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        // Immediate set for reduced motion
        counters.forEach(counter => {
            counter.innerText = Number(counter.getAttribute('data-target')).toLocaleString();
        });
    }

    function startCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = 16;   // ~60fps
        const steps = duration / stepTime;
        const increment = target / steps;

        let current = 0;
        const updateCounter = setInterval(() => {
            current += increment;
            if (current >= target) {
                counterElement.innerText = target.toLocaleString();
                clearInterval(updateCounter);
            } else {
                counterElement.innerText = Math.ceil(current).toLocaleString();
            }
        }, stepTime);
    }

    // 5. Parallax Effect
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!prefersReducedMotion && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const speed = el.getAttribute('data-parallax');
                    const yPos = -(scrolled * speed);
                    // Use only translateY to avoid conflicts with existing transforms if any
                    el.style.transform = `translateY(${yPos}px)`;
                });
            });
        });
    }

    // 6. App Preview Thumbnail Click Logic
    const mainMockupImg = document.querySelector('.mockup-img');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const thumbImg = thumb.querySelector('.thumb-img');
            if (thumbImg && mainMockupImg) {
                mainMockupImg.src = thumbImg.src;
                mainMockupImg.alt = thumbImg.alt;
                
                // Active state for thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            }
        });
    });

    // 7. Fullscreen Image Viewer (Lightbox)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const zoomableImages = document.querySelectorAll('.mockup-img, .view-img');

    zoomableImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
