const leftSection = document.getElementById('leftSection');
const rightSection = document.getElementById('rightSection');
const cursor = document.getElementById('cursor');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const leftText = document.querySelector('.left-text');
const rightText = document.querySelector('.right-text');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Theme Toggle Logic
const handImage = document.querySelector('.hand-image');
const gsapLogo = document.getElementById('gsapLogo');

themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');

    if (body.classList.contains('dark-theme')) {
        img1.src = 'coder-dark.png';
        if (handImage) handImage.src = 'hand.png';
        if (gsapLogo) gsapLogo.src = 'GSAP-dark.png';
    } else {
        img1.src = 'coder-light.png';
        if (handImage) handImage.src = 'hand-dark.png';
        if (gsapLogo) gsapLogo.src = 'GSAP-light.png';
    }
});

// Mobile nav: hamburger toggle
(function () {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (!navbar || !navToggle || !navMenu) return;

    function closeNav() {
        navbar.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Close dropdown when any link or button inside is clicked */
    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeNav();
    });
})();

// Initial setup for animation
const isDesktopHero = () => window.innerWidth > 768;
gsap.set('.navbar', { xPercent: 0, opacity: 0 });
gsap.set(['.nav-left', '.nav-center', '.nav-right'], { opacity: 0 });
if (isDesktopHero()) {
    gsap.set(leftSection, { xPercent: -100, width: '50%' });
    gsap.set(rightSection, { xPercent: 100, width: '50%' });
}
gsap.set([leftText, rightText], { opacity: 0 });

// Intro Animation
const tl = gsap.timeline({
    onComplete: () => {
        initMouseInteractions();
    }
});

tl.to('.navbar', {
    opacity: 1,
    duration: 1.2,
    ease: "power2.out"
})
    .to(['.nav-left', '.nav-center', '.nav-right'], {
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6");
if (isDesktopHero()) {
    tl.to([leftSection, rightSection], {
        xPercent: 0,
        duration: 1.5,
        ease: "power3.inOut"
    }, "-=0.5")
    .to([leftText, rightText], {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "+=0.5");
} else {
    tl.to([leftSection, rightSection], { opacity: 1, duration: 0.5 }, "-=0.3");
}

function initMouseInteractions() {
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const isSmallScreen = windowWidth <= 768;

        // Update cursor position (hidden on small screens via CSS)
        if (!isSmallScreen) {
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0.1
            });
        }

        // Skip hero split/parallax on small screens
        if (isSmallScreen) return;

        // Calculate percentage (0 to 100)
        const percentage = (mouseX / windowWidth) * 100;

        // Update widths for both sections to meet perfectly
        // Moving mouse left (percentage decreases) should increase leftWidth
        const leftWidth = 100 - percentage;
        const rightWidth = 100 - leftWidth; // or just percentage

        gsap.to(leftSection, {
            width: `${leftWidth}%`,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.to(rightSection, {
            width: `${rightWidth}%`,
            duration: 0.8,
            ease: "power2.out"
        });

        // Parallax Animation
        const parallaxRange = 40;
        const shiftX = (percentage - 50) * (parallaxRange / 100);

        gsap.to(img1, {
            x: -shiftX,
            duration: 1.2,
            ease: "power2.out"
        });

        gsap.to(img2, {
            x: -shiftX,
            duration: 1.2,
            ease: "power2.out"
        });

        // Multi-Directional Image Switch Logic for About Section
        const aboutImg = document.getElementById('aboutImg');
        const windowHeight = window.innerHeight;
        const col = Math.floor((mouseX / windowWidth) * 3); // 0, 1, 2
        const row = Math.floor((mouseY / windowHeight) * 3); // 0, 1, 2

        let newImage = 'student.png';

        if (row === 0) { // Top
            if (col === 0) newImage = 'student-upleft.png';
            else if (col === 1) newImage = 'student-up.png';
            else if (col === 2) newImage = 'student-upright.png';
        } else if (row === 1) { // Center row
            if (col === 0) newImage = 'student-left.png';
            else if (col === 1) newImage = 'student-center.png';
            else if (col === 2) newImage = 'student-right.png';
        } else if (row === 2) { // Bottom row
            if (col === 0) newImage = 'student-downleft.png';
            else if (col === 1) newImage = 'student-down.png';
            else if (col === 2) newImage = 'student-downright.png';
        }

        if (aboutImg && !aboutImg.src.includes(newImage)) {
            aboutImg.src = newImage;
        }

        // Fading Logic (Opacity changes with width)
        const leftOpacity = gsap.utils.clamp(0, 1, (leftWidth - 20) / 30);
        const rightOpacity = gsap.utils.clamp(0, 1, (rightWidth - 20) / 30);

        gsap.to(leftText, {
            opacity: leftOpacity,
            duration: 0.5,
            ease: "power1.out"
        });

        gsap.to(rightText, {
            opacity: rightOpacity,
            duration: 0.5,
            ease: "power1.out"
        });
    });
}



// ===== ABOUT SECTION ANIMATION =====
(function () {
    // Register ScrollTrigger if not already done globally
    gsap.registerPlugin(ScrollTrigger);

    const aboutSection = document.querySelector('.about-section');
    const stars = document.querySelectorAll('.about-stars .star');
    const header = document.querySelector('.about-header-main h2');
    const aboutCols = document.querySelectorAll('.about-grid-new .about-col');

    if (!aboutSection) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: aboutSection,
            start: "top 80%", // Start animation when top of section hits 80% viewport height
            end: "bottom center",
            toggleActions: "play none none reverse" // Re-play on enter/leave
        }
    });

    // 1. Stars pop in and rotate
    if (stars.length > 0) {
        tl.from(stars, {
            scale: 0,
            rotation: -180,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.2
        });
    }

    // 2. Header fades up
    if (header) {
        tl.from(header, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4");
    }

    // 3. Columns stagger in
    if (aboutCols.length > 0) {
        tl.from(aboutCols, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4");
    }

})();

// --- Card Swap Animation Logic (Ported from React) ---

// --- Card Swap Animation Logic ---

(function () {
    const wrapper = document.querySelector('.card-swap-wrapper');
    const container = document.querySelector('.card-swap-container');
    if (!wrapper || !container) return;

    const cards = Array.from(document.querySelectorAll('.card'));
    if (cards.length === 0) return;

    const isSmallScreen = () => window.innerWidth <= 768;

    // Configuration
    const cardDistance = 40; // Horizontal offset per card (px)
    const verticalDistance = 40; // Vertical offset per card (px)
    const skewAmount = 2; // Subtle skew
    const delay = 1000; // 1s wait

    const config = {
        ease: 'elastic.out(0.6, 0.8)',
        durDrop: 1.5,
        durMove: 1.5,
        durReturn: 1.5,
        promoteOverlap: 0.8,
        returnDelay: 0.05,
    };

    const total = cards.length;
    let order = cards.map((_, i) => i);
    let tl = null;
    let textTl = null; // Separate timeline for text fading
    let isHovering = false;
    let timeoutId = null;

    // Get project detail elements
    const projectDetails = [
        document.querySelector('.project-detail-1'),
        document.querySelector('.project-detail-2'),
        document.querySelector('.project-detail-3')
    ];

    const makeSlot = (i) => ({
        x: i * cardDistance,
        y: -i * verticalDistance,
        z: -i * cardDistance * 2,
        zIndex: total - i
    });

    const placeNow = (el, slot) => {
        gsap.set(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            zIndex: slot.zIndex,
            xPercent: -60,
            yPercent: 0,
            skewY: skewAmount,
            transformOrigin: 'center center',
            force3D: true,
            opacity: 1
        });
    };

    // Initial Set - Ensures they start exactly where they should be (desktop only)
    if (!isSmallScreen()) {
        cards.forEach((card, i) => {
            placeNow(card, makeSlot(i));
        });
    }

    const scheduleNextSwap = () => {
        if (isSmallScreen()) return;
        clearTimeout(timeoutId);
        if (!isHovering) {
            timeoutId = setTimeout(swap, delay);
        }
    };

    const swap = () => {
        if (isSmallScreen()) return;
        if (order.length < 2) return;
        if (isHovering && (!tl || !tl.isActive())) return;

        const frontIndex = order[0];
        const rest = order.slice(1);
        const elFront = cards[frontIndex];

        if (tl && tl.isActive()) tl.kill();
        if (textTl && textTl.isActive()) textTl.kill();

        tl = gsap.timeline({
            onComplete: scheduleNextSwap
        });

        // Create separate timeline for text fading
        textTl = gsap.timeline();

        // Determine which text to show based on the front card
        const currentTextIndex = frontIndex;
        const nextTextIndex = rest[0]; // The card that will come to front

        // 1. Drop Front Card Smoothly (1 second)
        // User requested exactly 100px drop
        const dropY = window.innerHeight;
        const dropDuration = 1;

        tl.to(elFront, {
            y: dropY,

            opacity: 1,
            duration: dropDuration,
            ease: "power1.inOut",
            overwrite: "auto"
        });

        // TEXT ANIMATION: Fade out current text as card drops
        textTl.to(projectDetails[currentTextIndex], {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        }, 0); // Start immediately

        tl.addLabel('promote', `-=${dropDuration * 0.85}`);

        // 2. Move others forward
        rest.forEach((idx, i) => {
            const el = cards[idx];
            const slot = makeSlot(i);

            // Delay z-index update to allow front card to clear and prevent premature layering jumps
            // We set it halfway through the move
            tl.set(el, { zIndex: slot.zIndex }, `promote+=${dropDuration * 0.5}`);

            tl.to(el, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                duration: config.durMove,
                ease: config.ease
            }, `promote+=${i * 0.1}`);
        });

        // TEXT ANIMATION: Fade in next text as new card comes forward
        textTl.to(projectDetails[nextTextIndex], {
            opacity: 1,
            duration: 0.6,
            ease: "power2.in"
        }, 0.4); // Start slightly after fade out begins

        // 3. Return Front to Back
        const backSlot = makeSlot(total - 1);

        // Synch return exactly when drop finishes
        tl.addLabel('returnStart', dropDuration);

        // Switch Z-Index instantly when drop is done
        tl.set(elFront, {
            zIndex: backSlot.zIndex,
            rotationX: 0
        }, 'returnStart');

        // Animate from dropY (bottom) to back slot position
        tl.fromTo(elFront,
            {
                x: backSlot.x,
                y: dropY,
                z: backSlot.z
            },
            {
                x: backSlot.x,
                y: backSlot.y,
                z: backSlot.z,
                duration: config.durReturn,
                ease: config.ease,
                immediateRender: false
            },
            'returnStart');

        // Update order state
        tl.call(() => {
            order = [...rest, frontIndex];
        });
    };

    // Hover Interaction - Only pause when hovering a card specifically
    let hoverCount = 0;

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            hoverCount++;
            if (hoverCount === 1) { // First card entered
                isHovering = true;
                clearTimeout(timeoutId);
                if (tl && tl.isActive()) tl.pause();
                if (textTl && textTl.isActive()) textTl.pause();
            }
        });

        card.addEventListener('mouseleave', () => {
            hoverCount--;
            if (hoverCount <= 0) { // Last card left
                hoverCount = 0;
                isHovering = false;
                if (tl && tl.paused()) {
                    tl.resume();
                }
                if (textTl && textTl.paused()) {
                    textTl.resume();
                }
                if (!tl || !tl.isActive()) {
                    scheduleNextSwap();
                }
            }
        });
    });

    // Start Loop (desktop only)
    if (!isSmallScreen()) {
        scheduleNextSwap();
    }
    window.addEventListener('resize', () => {
        if (isSmallScreen()) {
            clearTimeout(timeoutId);
            gsap.set(cards, { clearProps: 'all' });
        }
    });
})();

// Force initial visibility check
setTimeout(() => {
    gsap.set('.card', {
        opacity: 1,
        visibility: 'visible'
    });
}, 500);

// Force refresh scroll trigger or layout if needed
window.dispatchEvent(new Event('resize'));

// ===== ANIMATED PROJECTS TEXT WITH ROPES =====

(function () {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Get elements
    const text = document.getElementById('projects-text');
    const leftRope = document.getElementById('left-rope');
    const rightRope = document.getElementById('right-rope');
    const projectsSection = document.querySelector('.projects-section');

    if (!text || !leftRope || !rightRope || !projectsSection) return;

    // Function to update rope positions
    function updateRopePositions() {
        // Get section position to calculate relative coordinates
        // SVG is absolute to the section, so (0,0) in SVG is top-left of section.
        const sectionRect = projectsSection.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();

        // Calculate Y relative to the section
        // We want y2 (bottom of rope) to be at the text center
        const textCenterY = (textRect.top - sectionRect.top) + (textRect.height / 2);

        // Calculate letter width approximately
        const letterWidth = textRect.width / text.textContent.length;

        // Position ropes to overlap with first and last letters relative to section left
        // textRect.left is viewport x. sectionRect.left is viewport x.
        // relativeX = textRect.left - sectionRect.left
        const relativeLeft = textRect.left - sectionRect.left;
        const relativeRight = textRect.right - sectionRect.left;

        // Left rope overlaps with 'P' (positioned more towards center of first letter)
        const leftX = relativeLeft + (letterWidth * 0.3);

        // Right rope overlaps with 'S' (positioned more towards center of last letter)
        const rightX = relativeRight - (letterWidth * 0.3);

        // Rope Length extending upwards (visually "infinite")
        const ropeLength = 3000;

        // Set rope positions
        // y1 is far up (textCenterY - length), y2 is at text
        leftRope.setAttribute('x1', leftX);
        leftRope.setAttribute('y1', textCenterY - ropeLength);
        leftRope.setAttribute('x2', leftX);
        leftRope.setAttribute('y2', textCenterY);

        rightRope.setAttribute('x1', rightX);
        rightRope.setAttribute('y1', textCenterY - ropeLength);
        rightRope.setAttribute('x2', rightX);
        rightRope.setAttribute('y2', textCenterY);
    }

    // Initial rope position setup
    updateRopePositions();

    // Create GSAP timeline with ScrollTrigger
    const projectsTl = gsap.timeline({
        scrollTrigger: {
            trigger: projectsSection,
            start: "top 80%",
            end: "top 50%",

            scrub: 3,


        },
        onUpdate: updateRopePositions // Update ropes during animation
    });

    // Animation sequence - Smooth bounce effect with reduced durations
    projectsTl
        // 1. Drop the text from top with tilt (ropes stretch as it drops)
        .to(text, {
            y: -50,
            rotation: 8, // Keep the tilt while dropping
            duration: 2,
            ease: "power2.in",
            onUpdate: updateRopePositions
        })

        // 2. Move up slightly with smooth ease (bounce up) - REDUCED DURATION
        .to(text, {
            y: -100,
            rotation: -10, // Swing to opposite side
            duration: 0.5,
            ease: "power2.out",
            onUpdate: updateRopePositions
        })

        // 3. Come back down smoothly - REDUCED DURATION
        .to(text, {
            y: -40,
            rotation: 3, // Further reduce tilt
            duration: 0.5,
            ease: "power1.inOut",
            onUpdate: updateRopePositions
        })

        // 4. Straighten the alignment and settle to final position - REDUCED DURATION
        .to(text, {
            y: -50,
            rotation: 0, // Straighten completely
            duration: 0.35,
            ease: "power2.out",
            onUpdate: updateRopePositions
        });

    // Update rope positions on window resize
    window.addEventListener('resize', updateRopePositions);
})();

// ===== SKILLS SECTION ANIMATION =====
(function () {
    gsap.registerPlugin(ScrollTrigger);

    const skillsSection = document.querySelector('.skills-section');
    const container = document.querySelector('.skills-container');
    const centerSkill = document.querySelector('.center-skill');
    const leftSkills = document.querySelectorAll('.left-skill-item');
    const rightSkills = document.querySelectorAll('.right-skill-item');
    const title = document.querySelector('.skills-title');

    if (!skillsSection || !centerSkill) return;

    const isSmallScreen = () => window.innerWidth <= 768;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: skillsSection,
            start: isSmallScreen() ? "top 85%" : "top top",
            end: isSmallScreen() ? "top 50%" : "+=2000",
            pin: !isSmallScreen(),
            scrub: isSmallScreen() ? false : 1,
        }
    });

    // 1. Center element fades in bit by bit
    tl.to(centerSkill, {
        opacity: 1,
        duration: isSmallScreen() ? 0.5 : 1,
        ease: "power1.inOut"
    });

    if (!isSmallScreen()) {
        // 2. Left side elements slide in first (desktop only)
        tl.from(leftSkills, {
            x: -300,
            y: (i) => (i % 2 === 0 ? -100 : 100),
            opacity: 0,
            rotation: -45,
            stagger: 0.2,
            duration: 1.5,
            ease: "power2.out"
        }, "-=0.2");

        // 3. Right side elements slide in (desktop only)
        tl.from(rightSkills, {
            x: 700,
            y: (i) => (i % 2 === 0 ? -100 : 100),
            opacity: 0,
            rotation: 45,
            stagger: 0.1,
            duration: 1.5,
            ease: "power2.out"
        }, "-=1.0");
    } else {
        // Mobile/tablet: simple fade-in for skills (transform/opacity only)
        tl.from([...leftSkills, ...rightSkills], {
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out"
        }, "-=0.3");
    }

    // 4. Fade in all skill names after visuals settle
    const skillNames = document.querySelectorAll('.skill-name');
    tl.to(skillNames, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.2");



    // Optional: Add a subtle float animation to all skills after they appear
    // We need a separate timeline that runs continuously, not scrubbed
    // But since the section is pinned, we can't easily have infinite animation independent of scroll if the loop is simpler.
    // Let's just stick to the requested scroll timeline for now.

})();

// ===== DECRYPTED TEXT (SCRAMBLE) EFFECT =====
(function () {
    function initDecryptedText(element, options = {}) {
        if (!element) return;

        const originalText = element.textContent.trim();
        const speed = options.speed || 50;
        const maxIterations = options.maxIterations || 10;
        const characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
        const sequential = options.sequential || false;
        const revealDirection = options.revealDirection || 'start';
        const animateOn = options.animateOn || 'hover'; // 'hover', 'view', 'both'

        let isScrambling = false;
        let interval;
        let revealedIndices = new Set();
        let hasAnimatedOnView = false;
        let isHovering = false;

        const getNextIndex = (revealedSet) => {
            const textLength = originalText.length;
            switch (revealDirection) {
                case 'start': return revealedSet.size;
                case 'end': return textLength - 1 - revealedSet.size;
                case 'center':
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(revealedSet.size / 2);
                    const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) return nextIndex;
                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i;
                    }
                    return 0;
                default: return revealedSet.size;
            }
        };

        const generateScrambledHTML = (currentRevealed) => {
            return originalText.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (currentRevealed.has(i) || (!isScrambling && !isHovering)) {
                    return `<span>${originalText[i]}</span>`;
                }
                const randomChar = characters[Math.floor(Math.random() * characters.length)];
                return `<span class="scrambled">${randomChar}</span>`;
            }).join('');
        };

        const startScrambling = () => {
            if (isScrambling) return;
            isScrambling = true;
            revealedIndices.clear();
            let iteration = 0;

            interval = setInterval(() => {
                if (sequential) {
                    if (revealedIndices.size < originalText.length) {
                        const nextIndex = getNextIndex(revealedIndices);
                        revealedIndices.add(nextIndex);
                        element.innerHTML = generateScrambledHTML(revealedIndices);
                    } else {
                        stopScrambling();
                    }
                } else {
                    element.innerHTML = generateScrambledHTML(revealedIndices);
                    iteration++;
                    if (iteration >= maxIterations) {
                        stopScrambling();
                    }
                }
            }, speed);
        };

        const stopScrambling = () => {
            clearInterval(interval);
            isScrambling = false;
            element.innerText = originalText;
        };

        if (animateOn === 'hover' || animateOn === 'both') {
            element.addEventListener('mouseenter', () => {
                isHovering = true;
                startScrambling();
            });
            element.addEventListener('mouseleave', () => {
                isHovering = false;
                stopScrambling();
            });
        }

        if (animateOn === 'view' || animateOn === 'both') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimatedOnView) {
                        startScrambling();
                        hasAnimatedOnView = true;
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(element);
        }
    }

    // Initialize for Skills Title
    const skillsTitle = document.querySelector('.skills-title');
    if (skillsTitle) {
        initDecryptedText(skillsTitle, {
            speed: 60,
            maxIterations: 12,
            sequential: true,
            revealDirection: 'center',
            animateOn: 'both'
        });
    }
})();
// ===== CONTACT SECTION ANIMATION =====
(function () {
    const contactSection = document.querySelector('.contact-section');
    const handImage = document.querySelector('.hand-image');
    const contactHeading = document.querySelector('.contact-heading');
    // Select the wrapper .nebula-input so we animate the whole block
    const formItems = document.querySelectorAll('.nebula-input');
    const submitBtn = document.querySelector('.submit-btn');

    if (!contactSection || !handImage) return;

    // Initial States
    gsap.set(handImage, { yPercent: -100 });
    gsap.set(contactHeading, { autoAlpha: 0, x: -30, filter: "blur(10px)" }); // Reduced x offset, added blur
    gsap.set(formItems, { autoAlpha: 0, y: 20 });
    gsap.set(submitBtn, { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: contactSection,
            start: "top 60%", // Start when contact section is 60% in view
            end: "bottom bottom",
            toggleActions: "play none none none", // Play once
            once: true // Ensure it only triggers once
        }
    });

    // 1. Hand enters slowly from top
    tl.to(handImage, {
        y: 50, // Move fully into view (leaving small overlap to avoid gap)
        duration: 1.5,
        ease: "power2.out"
    });

    // 2. "just send it." text fades in smoothly with blur
    tl.to(contactHeading, {
        autoAlpha: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.inOut"
    }, "-=1.0"); // Start 1.5s into the timeline (delay)

    // 3. Inputs fade/slide in subtly
    tl.to(formItems, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
    }, "-=1");

    // 4. Submit button fades in
    tl.to(submitBtn, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");

})();

