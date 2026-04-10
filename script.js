// Viewport Refresh Fix for Mac/Safari
// Register GSAP Plugins immediately
gsap.registerPlugin(ScrollTrigger);

function updateViewportUnits() {
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);
}
updateViewportUnits();
window.addEventListener('resize', updateViewportUnits);

const leftSection = document.getElementById('leftSection');
const mobileToggle = document.getElementById('mobileToggle');
const mobileDropdown = document.getElementById('mobileDropdown');
const mobileLinks = document.querySelectorAll('.mobile-link');
const rightSection = document.getElementById('rightSection');
const cursor = document.getElementById('cursor');
const splitLine = document.getElementById('splitLine');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const leftText = document.querySelector('.left-text');
const rightText = document.querySelector('.right-text');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const aboutImg = document.getElementById('aboutImg');

// Preload about images for smooth eye-tracking transition
if (aboutImg) {
    ['center', 'up', 'down', 'left', 'right', 'upleft', 'upright', 'downleft', 'downright'].forEach(dir => {
        new Image().src = `images/student-${dir}.png`;
    });
}

// Theme Toggle Logic
const handImage = document.querySelector('.hand-image');
const gsapLogo = document.getElementById('gsapLogo');

themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');

    if (body.classList.contains('dark-theme')) {
        img1.src = 'images/coder-dark.png';
        if (handImage) handImage.src = 'images/hand.png';
        if (gsapLogo) gsapLogo.src = 'images/GSAP-dark.png';
    } else {
        img1.src = 'images/coder-light.png';
        if (handImage) handImage.src = 'images/hand-dark.png';
        if (gsapLogo) gsapLogo.src = 'images/GSAP-light.png';
    }
});

// Mobile Menu Toggle Logic
if (mobileToggle && mobileDropdown) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileDropdown.classList.toggle('active');

        // Prevent scrolling when menu is open
        if (mobileDropdown.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileDropdown.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// Detect mobile breakpoint
const isMobile = () => window.innerWidth < 1000;

// Initial setup for animation
gsap.set('.navbar', { xPercent: 0, opacity: 0 });
gsap.set(['.nav-left', '.nav-center', '.nav-right'], { opacity: 0 });

if (isMobile()) {
    // Mobile: sections slide in vertically (top section from above, bottom from below)
    gsap.set(leftSection, { yPercent: -100, width: '100%', height: '50%' });
    gsap.set(rightSection, { yPercent: 100, width: '100%', height: '50%' });
} else {
    // Desktop: sections slide in horizontally
    gsap.set(leftSection, { xPercent: -100, width: '50%' });
    gsap.set(rightSection, { xPercent: 100, width: '50%' });
}
gsap.set([leftText, rightText], { opacity: 0 });

// Intro Animation
if (isMobile()) {
    // Mobile/Tablet: Show everything immediately, skip slide-in/fade animations
    gsap.set('.navbar', { opacity: 1 });
    gsap.set(['.nav-left', '.nav-center', '.nav-right'], { opacity: 1 });
    gsap.set([leftSection, rightSection], { xPercent: 0, yPercent: 0, opacity: 1 });
    gsap.set([leftText, rightText], { opacity: 1 });

    // Jump straight to interaction initialization
    initMouseInteractions();
} else {
    // Desktop: Keep the premium intro slide-in and text fade
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
        }, "-=0.6")
        .to([leftSection, rightSection], {
            xPercent: 0,
            yPercent: 0,
            duration: 1.5,
            ease: "power3.inOut"
        }, "-=0.5")
        .to([leftText, rightText], {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "+=0.5");
}

function initMouseInteractions() {
    if (isMobile()) {
        // ─── SCROLL-BASED INTERACTION (MOBILE & TABLET) ───
        // We pin the container and scrub the height transition
        ScrollTrigger.create({
            trigger: ".main-container",
            start: "top top",
            end: "+=100%", // Scroll depth for the transition
            pin: true,
            scrub: true,
            onUpdate: (self) => {
                const scrollProgress = self.progress * 100;
                const topHeight = scrollProgress;
                const bottomHeight = 100 - topHeight;
                const percentage = scrollProgress;

                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                const vwVal = windowWidth * 0.01;

                // Drive heights
                gsap.set(leftSection, { height: `${topHeight}%`, width: '100%', left: 0 });
                gsap.set(rightSection, { top: `${topHeight}%`, height: `${bottomHeight}%`, width: '100%', left: 0 });
                if (splitLine) gsap.set(splitLine, { top: `${topHeight}%`, left: 0, width: '100%' });

                const leftH1 = leftText.querySelector('h1');
                const rightH1 = rightText.querySelector('h1');
                const leftP = leftText.querySelector('p');
                const rightP = rightText.querySelector('p');

                if (windowWidth < 500) {
                    const topScale = gsap.utils.interpolate(10, 20, (topHeight - 20) / 100);
                    const bottomScale = gsap.utils.interpolate(10, 20, (bottomHeight - 20) / 100);
                    if (leftH1) gsap.set(leftH1, { fontSize: `${gsap.utils.clamp(10, 20, topScale) * vwVal}px` });
                    if (rightH1) gsap.set(rightH1, { fontSize: `${gsap.utils.clamp(10, 20, bottomScale) * vwVal}px` });

                    const pTopScale = gsap.utils.interpolate(2, 3, (topHeight - 20) / 100);
                    const pBottomScale = gsap.utils.interpolate(2, 3, (bottomHeight - 20) / 100);
                    if (leftP) gsap.set(leftP, { fontSize: `${gsap.utils.clamp(2, 3, pTopScale) * vwVal}px` });
                    if (rightP) gsap.set(rightP, { fontSize: `${gsap.utils.clamp(2, 3, pBottomScale) * vwVal}px` });

                    const img1Opacity = gsap.utils.clamp(0, 1, (topHeight - 20) / 30);
                    const img2Opacity = gsap.utils.clamp(0, 1, (bottomHeight - 20) / 30);
                    gsap.set(img1, { yPercent: -bottomHeight * 0.1, opacity: img1Opacity });
                    gsap.set(img2, { yPercent: -topHeight * 0.1, opacity: img2Opacity });

                    const textShiftY = (percentage - 50) * 3;
                    gsap.set(leftText, { y: -textShiftY - (windowHeight * 0.02), yPercent: -50, opacity: img1Opacity });
                    gsap.set(rightText, { y: textShiftY - (windowHeight * 0.02), yPercent: -50, opacity: img2Opacity });
                } else {
                    const topScale = gsap.utils.interpolate(5, 12, (topHeight - 20) / 100);
                    const bottomScale = gsap.utils.interpolate(5, 12, (bottomHeight - 20) / 100);
                    if (leftH1) gsap.set(leftH1, { fontSize: `${gsap.utils.clamp(5, 12, topScale) * vwVal}px` });
                    if (rightH1) gsap.set(rightH1, { fontSize: `${gsap.utils.clamp(5, 12, bottomScale) * vwVal}px` });

                    const pTopScale = gsap.utils.interpolate(1, 2, (topHeight - 20) / 100);
                    const pBottomScale = gsap.utils.interpolate(1, 2, (bottomHeight - 20) / 100);
                    if (leftP) gsap.set(leftP, { fontSize: `${gsap.utils.clamp(1, 2, pTopScale) * vwVal}px` });
                    if (rightP) gsap.set(rightP, { fontSize: `${gsap.utils.clamp(1, 2, pBottomScale) * vwVal}px` });

                    const img1Opacity = gsap.utils.clamp(0, 1, (topHeight - 20) / 30);
                    const img2Opacity = gsap.utils.clamp(0, 1, (bottomHeight - 20) / 30);
                    gsap.set(img1, { xPercent: (topHeight - 50) * 0.5, yPercent: -bottomHeight * 0.1, opacity: img1Opacity });
                    gsap.set(img2, { xPercent: (bottomHeight - 50) * 0.5, yPercent: -topHeight * 0.1, opacity: img2Opacity });

                    const textShiftY = (percentage - 50) * 3;
                    gsap.set(leftText, { x: -textShiftY, y: 0, yPercent: -50, opacity: img1Opacity });
                    gsap.set(rightText, { x: textShiftY, y: 0, yPercent: -50, opacity: img2Opacity });
                }
            }
        });

    } else {
        // ─── HORIZONTAL INTERACTION (DESKTOP) ───
        const handleMove = (clientX, clientY) => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const percentage = (clientX / windowWidth) * 100;
            const leftWidth = 100 - percentage;
            const rightWidth = 100 - leftWidth;

            gsap.to(leftSection, { width: `${leftWidth}%`, height: '100%', top: 0, duration: 0.1, ease: 'none' });
            gsap.to(rightSection, { width: `${rightWidth}%`, height: '100%', top: 0, duration: 0.1, ease: 'none' });

            const shiftX = (percentage - 50) * 0.4;
            gsap.to(img1, { x: -shiftX, y: 0, duration: 0.1, ease: 'none' });
            gsap.to(img2, { x: -shiftX, y: 0, duration: 0.1, ease: 'none' });

            const yPercentage = (clientY / windowHeight) * 100;
            const textShiftY = (yPercentage - 50) * 0.8;
            const textShiftX = (percentage - 50) * 0.8;

            gsap.to(leftText, { x: -textShiftX, y: -textShiftY, yPercent: -50, opacity: 1, duration: 0.1, ease: 'none' });
            gsap.to(rightText, { x: -textShiftX, y: -textShiftY, yPercent: -50, opacity: 1, duration: 0.1, ease: 'none' });

            gsap.to(cursor, { x: clientX, y: clientY, opacity: 1, duration: 0.1 });
        };

        window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
    }
}


// ===== ABOUT SECTION ANIMATION =====
(function () {
    // Register ScrollTrigger is moved to top

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

// --- Card Swap Animation Logic ---
(function () {
    const wrapper = document.querySelector('.card-swap-wrapper');
    const container = document.querySelector('.card-swap-container');
    if (!wrapper || !container) return;

    const cards = Array.from(document.querySelectorAll('.card'));
    if (cards.length === 0) return;

    const cardDistance = 40;
    const verticalDistance = 40;
    const skewAmount = 2;
    const delay = 1000;

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
    let textTl = null;
    let isHovering = false;
    let timeoutId = null;

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

    cards.forEach((card, i) => {
        placeNow(card, makeSlot(i));
    });

    const scheduleNextSwap = () => {
        clearTimeout(timeoutId);
        if (!isHovering) {
            timeoutId = setTimeout(swap, delay);
        }
    };

    const swap = () => {
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
        textTl = gsap.timeline();

        const currentTextIndex = frontIndex;
        const nextTextIndex = rest[0];

        const dropY = window.innerHeight;
        const dropDuration = 1;

        tl.to(elFront, {
            y: dropY,
            opacity: 1,
            duration: dropDuration,
            ease: "power1.inOut",
            overwrite: "auto"
        });

        textTl.to(projectDetails[currentTextIndex], {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        }, 0);

        tl.addLabel('promote', `-=${dropDuration * 0.85}`);

        rest.forEach((idx, i) => {
            const el = cards[idx];
            const slot = makeSlot(i);
            tl.set(el, { zIndex: slot.zIndex }, `promote+=${dropDuration * 0.5}`);
            tl.to(el, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                duration: config.durMove,
                ease: config.ease
            }, `promote+=${i * 0.1}`);
        });

        textTl.to(projectDetails[nextTextIndex], {
            opacity: 1,
            duration: 0.6,
            ease: "power2.in"
        }, 0.4);

        const backSlot = makeSlot(total - 1);
        tl.addLabel('returnStart', dropDuration);
        tl.set(elFront, { zIndex: backSlot.zIndex, rotationX: 0 }, 'returnStart');
        tl.fromTo(elFront,
            { x: backSlot.x, y: dropY, z: backSlot.z },
            {
                x: backSlot.x,
                y: backSlot.y,
                z: backSlot.z,
                duration: config.durReturn,
                ease: config.ease,
                immediateRender: false
            },
            'returnStart');

        tl.call(() => {
            order = [...rest, frontIndex];
        });
    };

    let hoverCount = 0;
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            hoverCount++;
            if (hoverCount === 1) {
                isHovering = true;
                clearTimeout(timeoutId);
                if (tl && tl.isActive()) tl.pause();
                if (textTl && textTl.isActive()) textTl.pause();
            }
        });
        card.addEventListener('mouseleave', () => {
            hoverCount--;
            if (hoverCount <= 0) {
                hoverCount = 0;
                isHovering = false;
                if (tl && tl.paused()) tl.resume();
                if (textTl && textTl.paused()) textTl.resume();
                if (!tl || !tl.isActive()) scheduleNextSwap();
            }
        });
    });

    scheduleNextSwap();

})();

setTimeout(() => {
    gsap.set('.card', { opacity: 1, visibility: 'visible' });
}, 500);

window.dispatchEvent(new Event('resize'));

// ===== ANIMATED PROJECTS TEXT WITH ROPES =====
(function () {
    gsap.registerPlugin(ScrollTrigger);
    const text = document.getElementById('projects-text');
    const leftRope = document.getElementById('left-rope');
    const rightRope = document.getElementById('right-rope');
    const projectsSection = document.querySelector('.projects-section');

    if (!text || !leftRope || !rightRope || !projectsSection) return;

    function updateRopePositions() {
        const sectionRect = projectsSection.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();
        const textCenterY = (textRect.top - sectionRect.top) + (textRect.height / 2);
        const letterWidth = textRect.width / text.textContent.length;
        const relativeLeft = textRect.left - sectionRect.left;
        const relativeRight = textRect.right - sectionRect.left;
        const leftX = relativeLeft + (letterWidth * 0.3);
        const rightX = relativeRight - (letterWidth * 0.3);
        const ropeLength = 3000;

        leftRope.setAttribute('x1', leftX);
        leftRope.setAttribute('y1', textCenterY - ropeLength);
        leftRope.setAttribute('x2', leftX);
        leftRope.setAttribute('y2', textCenterY);

        rightRope.setAttribute('x1', rightX);
        rightRope.setAttribute('y1', textCenterY - ropeLength);
        rightRope.setAttribute('x2', rightX);
        rightRope.setAttribute('y2', textCenterY);
    }

    updateRopePositions();

    const projectsTl = gsap.timeline({
        scrollTrigger: {
            trigger: projectsSection,
            start: "top 80%",
            end: "top 50%",
            scrub: 3,
        },
        onUpdate: updateRopePositions
    });

    projectsTl
        .to(text, { y: -50, rotation: 8, duration: 2, ease: "power2.in" })
        .to(text, { y: -100, rotation: -10, duration: 0.5, ease: "power2.out" })
        .to(text, { y: -40, rotation: 3, duration: 0.5, ease: "power1.inOut" })
        .to(text, { y: -50, rotation: 0, duration: 0.35, ease: "power2.out" });

    window.addEventListener('resize', updateRopePositions);
})();

// ===== SKILLS SECTION ANIMATION =====
(function () {
    gsap.registerPlugin(ScrollTrigger);
    const skillsSection = document.querySelector('.skills-section');
    const centerSkill = document.querySelector('.center-skill');
    const leftSkills = document.querySelectorAll('.left-skill-item');
    const rightSkills = document.querySelectorAll('.right-skill-item');
    if (!skillsSection || !centerSkill) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: skillsSection,
            start: "top top",
            end: "+=2000",
            pin: true,
            scrub: 1,
        }
    });

    tl.to(centerSkill, { opacity: 1, duration: 1, ease: "power1.inOut" });
    tl.from(leftSkills, { x: -300, y: (i) => (i % 2 === 0 ? -100 : 100), opacity: 0, rotation: -45, stagger: 0.2, duration: 1.5, ease: "power2.out" }, "-=0.2");
    tl.from(rightSkills, { x: 700, y: (i) => (i % 2 === 0 ? -100 : 100), opacity: 0, rotation: 45, stagger: 0.1, duration: 1.5, ease: "power2.out" }, "-=1.0");
    const skillNames = document.querySelectorAll('.skill-name');
    tl.to(skillNames, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.2");
})();

// ===== DECRYPTED TEXT (SCRAMBLE) EFFECT =====
(function () {
    let glitchChars = "JKLMNOPQRcefghijklopqrst35790!@#$%^&*-+?=/., ";
    glitchChars = glitchChars.split("").sort(() => 0.5 - Math.random()).join("");

    async function skillsGlitchEffect(index, node) {
        if (node.getAttribute("data-glitching") === "true" && index === 0) return;
        node.setAttribute("data-glitching", "true");
        const targetChar = node.getAttribute("data-char");
        if (targetChar === " ") {
            node.innerHTML = "&nbsp;";
            node.removeAttribute("data-glitching");
            return;
        }
        const isDone = node.innerText === targetChar && index > 5;
        if (isDone) {
            node.innerText = targetChar;
            node.classList.remove("block", "box");
            node.removeAttribute("data-glitching");
            return;
        }
        node.innerText = glitchChars[index % glitchChars.length];
        node.classList.remove("block", "box");
        const val = Math.trunc(Math.random() * 6);
        if (val === 0) node.classList.add("block");
        else if (val === 1) node.classList.add("box");
        await new Promise((r) => setTimeout(r, 40 + Math.trunc(Math.random() * 60)));
        skillsGlitchEffect((index + 1) % glitchChars.length, node);
    }

    function initSkillsGlitch() {
        const headings = document.querySelectorAll(".skill-heading");
        headings.forEach((heading) => {
            if (heading.getAttribute('data-glitch-init')) return;
            const text = heading.innerText.trim();
            heading.innerHTML = text.split("").map((char) => char === " " ? `<span class="skill-char" data-char=" ">&nbsp;</span>` : `<span class="skill-char" data-char="${char}">${char}</span>`).join("");
            heading.setAttribute('data-glitch-init', 'true');
        });
    }

    function startSkillsGlitch(target) {
        const chars = target ? target.querySelectorAll(".skill-char") : document.querySelectorAll(".skill-heading .skill-char");
        chars.forEach((span) => { if (span.getAttribute("data-char") !== " ") skillsGlitchEffect(0, span); });
    }

    initSkillsGlitch();
    const skillsTitle = document.querySelector(".skills-title.skill-heading");
    if (skillsTitle) {
        new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) startSkillsGlitch(entry.target); }); }, { threshold: 0.1 }).observe(skillsTitle);
    }
    document.querySelectorAll(".skill-item").forEach((item) => {
        item.addEventListener("mouseenter", () => {
            item.querySelectorAll(".skill-heading .skill-char").forEach((span) => { if (span.getAttribute("data-char") !== " ") skillsGlitchEffect(0, span); });
        });
    });
})();

// ===== CONTACT SECTION ANIMATION =====
(function () {
    const contactSection = document.querySelector('.contact-section');
    const handImage = document.querySelector('.hand-image');
    const contactHeading = document.querySelector('.contact-heading');
    const formItems = document.querySelectorAll('.nebula-input');
    const submitBtn = document.querySelector('.submit-btn');
    if (!contactSection || !handImage) return;

    gsap.set(handImage, { yPercent: -100 });
    gsap.set(contactHeading, { autoAlpha: 0, x: -30, filter: "blur(10px)" });
    gsap.set(formItems, { autoAlpha: 0, y: 20 });
    gsap.set(submitBtn, { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline({ scrollTrigger: { trigger: contactSection, start: "top 60%", end: "bottom bottom", toggleActions: "play none none none", once: true } });
    tl.to(handImage, { y: 50, duration: 1.5, ease: "power2.out" })
        .to(contactHeading, { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power2.inOut" }, "-=1.0")
        .to(formItems, { autoAlpha: 1, y: 0, stagger: 0.2, duration: 1, ease: "power2.out" }, "-=1")
        .to(submitBtn, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");
})();

// ─── ABOUT IMAGE EYE TRACKING LOGIC ───
(function initAboutTracking() {
    const aboutImgNode = document.getElementById('aboutImg');
    if (!aboutImgNode) return;

    function updateTracking(clientX, clientY) {
        const rect = aboutImgNode.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let direction = 'center';

        // Only change direction if mouse is far enough from center to avoid jitter
        if (distance > 50) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            if (angle >= -22.5 && angle < 22.5) direction = 'right';
            else if (angle >= 22.5 && angle < 67.5) direction = 'downright';
            else if (angle >= 67.5 && angle < 112.5) direction = 'down';
            else if (angle >= 112.5 && angle < 157.5) direction = 'downleft';
            else if (angle >= 157.5 || angle < -157.5) direction = 'left';
            else if (angle >= -157.5 && angle < -112.5) direction = 'upleft';
            else if (angle >= -112.5 && angle < -67.5) direction = 'up';
            else if (angle >= -67.5 && angle < -22.5) direction = 'upright';
        }

        const newSrc = `images/student-${direction}.png`;
        if (aboutImgNode.getAttribute('src') !== newSrc) {
            aboutImgNode.src = newSrc;
        }
    }

    const handleInput = (e) => {
        let x, y;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        updateTracking(x, y);
    };

    window.addEventListener('mousemove', handleInput);
    window.addEventListener('touchmove', handleInput, { passive: true });
    window.addEventListener('touchstart', handleInput, { passive: true });
})();
