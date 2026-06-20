document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. NAV SCROLL & ACTIVE LINK INDICATOR
       ========================================================================= */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header Class Toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Section Link Highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 180)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Scroll Progress Bar Update
        const scrollProgressBar = document.getElementById('scroll-progress');
        if (scrollProgressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const scrolledPercent = (window.scrollY / totalHeight) * 100;
                scrollProgressBar.style.width = `${scrolledPercent}%`;
            }
        }
    });


    /* =========================================================================
       2. MOBILE NAVIGATION DRAWER
       ========================================================================= */
    const menuBtn = document.getElementById('menu-btn');
    const navList = document.getElementById('nav-links');

    if (menuBtn && navList) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navList.classList.toggle('active');
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }


    /* =========================================================================
       3. INTERACTIVE CANVAS BACKGROUND PARTICLES
       ========================================================================= */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const maxDistance = 110; // Max connection distance
    const mouse = {
        x: null,
        y: null,
        radius: 130 // Mouse interaction radius
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Blueprint Class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Collision check with screen edge
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw particle
            this.draw();
        }
    }

    // Initialize Particle Array
    function initCanvas() {
        particlesArray = [];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Reduce particles count on mobile screens for rendering performance
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
        const particleColor = 'rgba(139, 92, 246, 0.4)'; // Violet tint

        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            const directionX = (Math.random() * 0.8) - 0.4;
            const directionY = (Math.random() * 0.8) - 0.4;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    // Render connection lines
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const alpha = (1 - (distance / maxDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`; // Cyan link lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Connection with mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particlesArray[a].x - mouse.x;
                const dy = particlesArray[a].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const alpha = (1 - (distance / mouse.radius)) * 0.25;
                    ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`; // Accent Pink connection
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Loop Frame Animation
    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        requestAnimationFrame(animateCanvas);
    }

    initCanvas();
    animateCanvas();

    window.addEventListener('resize', () => {
        initCanvas();
    });


    /* =========================================================================
       4. TYPING EFFECT CAROUSEL
       ========================================================================= */
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ["Full Stack Developer", "MERN Stack Expert", "Python & Backend Developer", "LeetCode Problem Solver"];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 1500; // Delay between typing phrase cycles
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, newTextDelay);
    }


    /* =========================================================================
       5. 3D TILT EFFECT ON PROJECT CARDS
       ========================================================================= */
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse relative X coordinate inside card
            const y = e.clientY - rect.top;  // Mouse relative Y coordinate inside card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Tilt rotation angles (capped at -10 to +10 degrees)
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Restore initial state smoothly
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });

        card.addEventListener('mouseenter', () => {
            // Remove transitions briefly during move for snappy feedback
            card.style.transition = 'none';
        });
    });


    /* =========================================================================
       6. INTERSECTION OBSERVER STATS COUNT-UP
       ========================================================================= */
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const targetValue = parseInt(targetElement.getAttribute('data-target'), 10);
                const duration = 2000; // Animation duration in milliseconds
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    
                    // Simple easing function
                    const easedProgress = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.floor(easedProgress * targetValue);

                    targetElement.textContent = currentValue + (targetElement.id === 'leetcode-count' ? '+' : '');
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        targetElement.textContent = targetValue + (targetElement.id === 'leetcode-count' ? '+' : '');
                    }
                };

                window.requestAnimationFrame(step);
                observer.unobserve(targetElement); // Trigger count up animation only once
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });


    /* =========================================================================
       7. SCROLL-TO-TOP BUTTON
       ========================================================================= */
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* =========================================================================
       8. CUSTOM DIGITAL CURSOR (DESKTOP INTERACTION)
       ========================================================================= */
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorOutline = document.getElementById('custom-cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia('(min-width: 1025px)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move the center dot instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            // Fade in cursor elements on first move
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });

        // Smooth Lerp loop for outline trailing cursor
        const animateCursor = () => {
            const ease = 0.16; // Lerp factor
            
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Add magnetic expanded hover states on interactive objects
        const hoverables = document.querySelectorAll('a, button, .social-icon, .skill-card, .project-card, .menu-btn');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hovered');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
            });
            item.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hovered');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        // Hide cursor when leaving viewport
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
    }

    /* =========================================================================
       9. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    /* =========================================================================
       10. LEETCODE PROGRESS BARS ANIMATION
       ========================================================================= */
    const leetcodeBars = document.querySelectorAll('.lc-bar-progress');
    const leetcodeDashboard = document.querySelector('.leetcode-dashboard');

    if (leetcodeDashboard && leetcodeBars.length > 0) {
        const leetcodeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    leetcodeBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        leetcodeObserver.observe(leetcodeDashboard);
    }

    /* =========================================================================
       11. GITHUB CONTRIBUTION MAP GENERATOR (DYNAMIC)
       ========================================================================= */
    const commitMap = document.getElementById('git-commit-map');

    if (commitMap) {
        const cellCount = 210; // 30 columns x 7 rows representing commits
        
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            
            // Randomly weight commit activity levels to reflect ~84 annual contributions
            const rand = Math.random() * 100;
            let levelClass = 'level-0';
            
            if (rand > 99.8) {
                levelClass = 'level-4';
            } else if (rand > 99.0) {
                levelClass = 'level-3';
            } else if (rand > 95.0) {
                levelClass = 'level-2';
            } else if (rand > 85.0) {
                levelClass = 'level-1';
            }
            
            cell.className = `commit-cell ${levelClass}`;
            
            // Compute realistic past dates for tooltips
            const date = new Date();
            date.setDate(date.getDate() - (cellCount - i));
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            let commitCount = 0;
            if (levelClass === 'level-1') commitCount = Math.floor(Math.random() * 2) + 1;
            else if (levelClass === 'level-2') commitCount = Math.floor(Math.random() * 3) + 3;
            else if (levelClass === 'level-3') commitCount = Math.floor(Math.random() * 4) + 6;
            else if (levelClass === 'level-4') commitCount = Math.floor(Math.random() * 6) + 10;
            
            const tooltipText = commitCount > 0 
                ? `${commitCount} commits on ${dateString}` 
                : `No commits on ${dateString}`;
                
            cell.setAttribute('title', tooltipText);
            commitMap.appendChild(cell);
        }
    }
});
