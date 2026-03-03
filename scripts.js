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
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                parallaxElements.forEach(el => {
                    const speed = el.getAttribute('data-parallax');
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
            });
        });
    }
});
