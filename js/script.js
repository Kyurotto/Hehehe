// =========================================
// DOM ELEMENTS
// =========================================
const introSection = document.getElementById('introSection');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const mainContent = document.getElementById('mainContent');
const heartsContainer = document.getElementById('heartsContainer');
const sparkleContainer = document.getElementById('sparkleContainer');
const heroParticles = document.getElementById('heroParticles');
const replayBtn = document.getElementById('replayBtn');
const musicToggle = document.getElementById('musicToggle');
const emojiRain = document.getElementById('emojiRain');
const nextPageBtn = document.getElementById('nextPageBtn');

// =========================================
// ANNIVERSARY DATE & COUNTER
// =========================================
const anniversaryDate = new Date(2026, 2, 26); // March 26, 2026

function updateCounters() {
    const now = new Date();
    const diff = now - anniversaryDate;

    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    // Average heartbeat ~72 bpm
    const totalHeartbeats = Math.floor(diff / 1000) * 72;

    animateCounter('counterDays', totalDays);
    animateCounter('counterHours', totalHours);
    animateCounter('counterHeartbeats', totalHeartbeats);
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;

    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startVal + (target - startVal) * eased);
        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// =========================================
// FLOATING BACKGROUND FLOWERS
// =========================================
const backgroundEmojis = ['🌸', '🌺', '🌷', '🌼', '🌻', '🌹', '💮', '💐', '✨', '💕', '💗'];

function createFloatingElement() {
    const element = document.createElement('div');
    element.className = 'floating-heart';
    element.textContent = backgroundEmojis[Math.floor(Math.random() * backgroundEmojis.length)];
    element.style.left = Math.random() * 100 + '%';
    element.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
    element.style.animationDuration = (Math.random() * 8 + 8) + 's';
    element.style.animationDelay = Math.random() * 2 + 's';
    heartsContainer.appendChild(element);

    setTimeout(() => element.remove(), 18000);
}

function startFloatingHearts() {
    // Create initial batch
    for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingElement, i * 600);
    }
    // Continue creating
    setInterval(createFloatingElement, 2500);
}

// =========================================
// SPARKLE CURSOR TRAIL
// =========================================
let lastSparkleTime = 0;
const sparkleEmojis = ['✨', '💫', '⭐', '🌟', '💖'];
window.isDraggingCarousel = false;

document.addEventListener('mousemove', (e) => {
    if (window.isDraggingCarousel) return;
    const now = Date.now();
    if (now - lastSparkleTime < 80) return;
    lastSparkleTime = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkleContainer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 800);
});

// =========================================
// HERO PARTICLES
// =========================================
function createHeroParticles() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.background = Math.random() > 0.5 ? '#f9a8c9' : '#c084fc';
        heroParticles.appendChild(particle);
    }
}

// =========================================
// ENVELOPE OPEN ANIMATION
// =========================================
envelopeWrapper.addEventListener('click', openEnvelope);

function openEnvelope() {
    envelopeWrapper.style.animation = 'none';
    envelopeWrapper.style.transition = 'all 0.8s ease';
    envelopeWrapper.style.transform = 'scale(1.3)';
    envelopeWrapper.style.opacity = '0';

    setTimeout(() => {
        introSection.classList.add('hidden');
        mainContent.classList.add('visible');
        document.body.style.overflow = 'hidden';

        // Setup multiple pages
        const sections = Array.from(document.querySelectorAll('.main-content > section'));
        sections.forEach(s => s.classList.remove('active-page'));
        if (sections.length > 0) sections[0].classList.add('active-page');
        window.currentSectionIndex = 0;
        if (nextPageBtn) nextPageBtn.classList.remove('hidden');

        // Start all animations
        startFloatingHearts();
        createHeroParticles();
        updateCounters();
        triggerEmojiRain();

        // Play music automatically
        if (bgMusic && musicToggle) {
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.classList.add('playing');
                musicToggle.textContent = '🎶';
            }).catch(e => console.log('Audio play failed:', e));
        }
    }, 600);
}

// =========================================
// NEXT PAGE BUTTON LOGIC
// =========================================
if (nextPageBtn) {
    const sections = Array.from(document.querySelectorAll('.main-content > section'));

    nextPageBtn.addEventListener('click', () => {
        if (window.currentSectionIndex < sections.length - 1) {
            // Hide current
            sections[window.currentSectionIndex].classList.remove('active-page');

            // Show next
            window.currentSectionIndex++;
            const nextSec = sections[window.currentSectionIndex];
            nextSec.classList.add('active-page');
            nextSec.scrollTop = 0; // reset scroll inside section

            // Manually trigger animations for items in this section so they don't break
            const elementsToAnimate = nextSec.querySelectorAll('[data-aos], .timeline-item, .counter-card, .promise-card, .gallery-item, .letter-wrapper');
            elementsToAnimate.forEach((el, idx) => {
                setTimeout(() => el.classList.add('visible'), idx * 100);
            });

            // Hide next button if on last section
            if (window.currentSectionIndex === sections.length - 1) {
                nextPageBtn.classList.add('hidden');
            }
        }
    });
}

// =========================================
// SCROLL-BASED REVEAL (AOS)
// =========================================
function handleScrollReveal() {
    const elements = document.querySelectorAll('[data-aos]');
    const triggerBottom = window.innerHeight * 0.85;

    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom) {
            el.classList.add('visible');
        }
    });
}

// Observe timeline items and letter
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// =========================================
// EMOJI RAIN
// =========================================
function triggerEmojiRain() {
    emojiRain.style.display = 'block';
    const emojis = ['💕', '💗', '💖', '🥰', '😘', '❤️', '🩷', '✨', '🌸', '💜', '🤍', '💓'];

    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.className = 'emoji-drop';
            drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            drop.style.left = Math.random() * 100 + '%';
            drop.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            drop.style.animationDuration = (Math.random() * 2 + 2) + 's';
            emojiRain.appendChild(drop);

            setTimeout(() => drop.remove(), 4000);
        }, i * 100);
    }

    setTimeout(() => {
        emojiRain.style.display = 'none';
    }, 6000);
}

// =========================================
// REPLAY BUTTON
// =========================================
replayBtn.addEventListener('click', () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Stop music automatically on replay
    if (typeof bgMusic !== 'undefined' && bgMusic && musicPlaying) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        musicPlaying = false;
        if (typeof musicToggle !== 'undefined' && musicToggle) {
            musicToggle.classList.remove('playing');
            musicToggle.textContent = '🎵';
        }
    }

    setTimeout(() => {
        mainContent.classList.remove('visible');
        introSection.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Reset envelope
        envelopeWrapper.style.transition = 'none';
        envelopeWrapper.style.transform = '';
        envelopeWrapper.style.opacity = '';
        setTimeout(() => {
            envelopeWrapper.style.animation = 'envelopeFloat 3s ease-in-out infinite';
        }, 100);

        // Remove all visible classes
        document.querySelectorAll('.visible').forEach(el => {
            if (el !== introSection) {
                el.classList.remove('visible');
            }
        });

        // Reset pages
        const sections = Array.from(document.querySelectorAll('.main-content > section'));
        sections.forEach(s => s.classList.remove('active-page'));
        window.currentSectionIndex = 0;
        if (nextPageBtn) nextPageBtn.classList.add('hidden');
    }, 500);
});

// =========================================
// LIGHTBOX GALLERY
// =========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

// Typewriter state
let typewriterTimer = null;

function openLightbox(imgSrc, caption) {
    lightboxImg.src = imgSrc;

    // Clear any previous typewriter animation
    if (typewriterTimer !== null) {
        clearTimeout(typewriterTimer);
        typewriterTimer = null;
    }

    // Reset caption and add cursor class
    lightboxCaption.textContent = '';
    lightboxCaption.classList.add('typewriter-active');

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Start typewriter effect after a brief delay for the lightbox to appear
    const chars = Array.from(caption);
    let charIndex = 0;
    const speed = 35; // milliseconds per character

    function typeNextChar() {
        if (charIndex < chars.length) {
            lightboxCaption.textContent += chars[charIndex];
            charIndex++;
            typewriterTimer = setTimeout(typeNextChar, speed);
        } else {
            // Typing done — remove cursor after a moment
            typewriterTimer = null;
            setTimeout(function () {
                lightboxCaption.classList.remove('typewriter-active');
            }, 1500);
        }
    }

    // Small initial delay so the lightbox animation plays first
    typewriterTimer = setTimeout(typeNextChar, 400);
}

function closeLightbox() {
    // Clear any running typewriter animation
    if (typewriterTimer !== null) {
        clearTimeout(typewriterTimer);
        typewriterTimer = null;
    }
    lightboxCaption.classList.remove('typewriter-active');

    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// =========================================
// BACKGROUND MUSIC TOGGLE
// =========================================
const bgMusic = document.getElementById('bgMusic');
let musicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (!bgMusic) return;

    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.textContent = '🎵';
    } else {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
        musicPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.textContent = '🎶';
    }
});
// =========================================
// REPLY MODAL LOGIC
// =========================================
const openReplyBtn = document.getElementById('openReplyBtn');
const replyModal = document.getElementById('replyModal');
const replyClose = document.getElementById('replyClose');
const replySendBtn = document.getElementById('replySendBtn');
const replyTextarea = document.getElementById('replyTextarea');

if (openReplyBtn && replyModal && replyClose && replySendBtn && replyTextarea) {
    openReplyBtn.addEventListener('click', () => {
        replyModal.classList.remove('hidden');
        replyTextarea.focus();
    });

    replyClose.addEventListener('click', () => {
        replyModal.classList.add('hidden');
    });

    // Close when clicking outside modal content
    replyModal.addEventListener('click', (e) => {
        if (e.target === replyModal) {
            replyModal.classList.add('hidden');
        }
    });

    replySendBtn.addEventListener('click', async () => {
        const text = replyTextarea.value.trim();
        if (text === '') {
            alert('Please write something sweet first! 💕');
            return;
        }

        const emailAddress = "johnlaurencenovicio@gmail.com";
        const originalText = replySendBtn.innerText;
        
        // Show loading state
        replySendBtn.innerText = 'Sending... ⏳';
        replySendBtn.style.pointerEvents = 'none';

        try {
            // Send the email automatically in the background
            await fetch(`https://formsubmit.co/ajax/${emailAddress}`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: "A Sweet Note For You 💖",
                    Message: text
                })
            });

            // Success state
            replySendBtn.innerText = 'Sent to My Heart! 💘';
            replyTextarea.value = '';

            setTimeout(() => {
                replyModal.classList.add('hidden');
                replySendBtn.innerText = originalText;
                replySendBtn.style.pointerEvents = 'auto';
            }, 2000);
            
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Oops! Something went wrong. Please try again.");
            replySendBtn.innerText = originalText;
            replySendBtn.style.pointerEvents = 'auto';
        }
    });
}

// =========================================
// GALLERY SUMMARY TYPEWRITER
// =========================================
function setupGallerySummaryTypewriter() {
    const summaryTexts = document.querySelectorAll('.gallery-summary-text');
    if (summaryTexts.length === 0) return;

    // Save original text and clear each element
    summaryTexts.forEach(function (el) {
        el.setAttribute('data-full-text', el.textContent.trim());
        el.textContent = '';
    });

    // Function to type out text on a single element
    function startElementTypewriter(el, onComplete) {
        var fullText = el.getAttribute('data-full-text');
        if (!fullText) return;

        var chars = Array.from(fullText);
        var charIndex = 0;
        var speed = 18;

        el.classList.add('typewriter-active');

        function typeNext() {
            if (charIndex < chars.length) {
                el.textContent += chars[charIndex];
                charIndex++;
                setTimeout(typeNext, speed);
            } else {
                setTimeout(function () {
                    el.classList.remove('typewriter-active');
                    if (typeof onComplete === 'function') onComplete();
                }, 800);
            }
        }

        setTimeout(typeNext, 300);
    }

    // Watch for 'visible' class being added via MutationObserver
    var typingQueue = [];
    var isTyping = false;

    function processQueue() {
        if (typingQueue.length === 0) {
            isTyping = false;
            return;
        }
        isTyping = true;
        var el = typingQueue.shift();
        startElementTypewriter(el, function () {
            processQueue();
        });
    }

    var classObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                var el = mutation.target;
                if (el.classList.contains('visible') &&
                    el.classList.contains('gallery-summary-text') &&
                    el.getAttribute('data-typing-started') !== 'true') {
                    el.setAttribute('data-typing-started', 'true');
                    typingQueue.push(el);
                    if (!isTyping) processQueue();
                }
            }
        });
    });

    summaryTexts.forEach(function (el) {
        classObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
}

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Prevent scroll until envelope is opened
    document.body.style.overflow = 'hidden';

    // Setup observers
    const timelineItems = document.querySelectorAll('.timeline-item');
    const counterCards = document.querySelectorAll('.counter-card');
    const promiseCards = document.querySelectorAll('.promise-card');
    const letterWrapper = document.querySelector('.letter-wrapper');
    const galleryItems = document.querySelectorAll('.gallery-item');

    timelineItems.forEach(item => observer.observe(item));
    counterCards.forEach(card => observer.observe(card));
    promiseCards.forEach(card => observer.observe(card));
    galleryItems.forEach(item => observer.observe(item));
    if (letterWrapper) observer.observe(letterWrapper);

    // Setup gallery summary typewriter effect
    setupGallerySummaryTypewriter();

    // Also observe gallery summary texts for visibility
    var summaryTexts = document.querySelectorAll('.gallery-summary-text');
    summaryTexts.forEach(function (el) { observer.observe(el); });

    // Gallery card click handlers
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-img');
            const caption = card.getAttribute('data-caption');
            openLightbox(imgSrc, caption);
        });
    });

    // Scroll listener
    window.addEventListener('scroll', handleScrollReveal);

    // Also animate staggered items
    window.addEventListener('scroll', () => {
        const cards = document.querySelectorAll('.counter-card, .promise-card');
        cards.forEach((card, index) => {
            card.style.transitionDelay = (index * 0.1) + 's';
        });
    }, { once: true });
});

// =========================================
// CAROUSEL DRAG LOGIC
// =========================================
const carouselContainer = document.querySelector('.carousel-container');
const carousel = document.querySelector('.carousel');

if (carouselContainer && carousel) {
    let isDragging = false;
    let startX;
    let currentAngle = 0;
    let dragAngle = 0;
    let rafId = null;

    carouselContainer.addEventListener('dragstart', (e) => e.preventDefault());

    function updateCarousel() {
        if (!isDragging) return;
        carousel.style.transform = `translateZ(-1000px) rotateY(${currentAngle + dragAngle}deg)`;
        rafId = requestAnimationFrame(updateCarousel);
    }

    function handleStart(e) {
        if (e.target.closest('.lightbox-close')) return;
        isDragging = true;
        window.isDraggingCarousel = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        carousel.style.transition = 'none';
        carouselContainer.style.cursor = 'grabbing';
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateCarousel);
    }

    function handleMove(e) {
        if (!isDragging) return;
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        dragAngle = (x - startX) * 0.5;
    }

    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        window.isDraggingCarousel = false;
        if (rafId) cancelAnimationFrame(rafId);
        currentAngle += dragAngle;
        dragAngle = 0;
        carousel.style.transition = 'transform 0.5s ease-out';
        carousel.style.transform = `translateZ(-1000px) rotateY(${currentAngle}deg)`;
        carouselContainer.style.cursor = 'grab';
    }

    carouselContainer.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    carouselContainer.addEventListener('touchstart', handleStart, {passive: true});
    window.addEventListener('touchmove', handleMove, {passive: true});
    window.addEventListener('touchend', handleEnd);
}
