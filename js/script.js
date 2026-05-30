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

document.addEventListener('mousemove', (e) => {
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

function openLightbox(imgSrc, caption) {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
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

    replySendBtn.addEventListener('click', () => {
        const text = replyTextarea.value.trim();
        if (text === '') {
            alert('Please write something sweet first! 💕');
            return;
        }

        // Change button text to show loading state
        replySendBtn.innerText = 'Sending to My Heart... ⏳';

        // Automatically send the email using FormSubmit AJAX
        fetch("https://formsubmit.co/ajax/johnlaurencenovicio@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: "A Sweet Note From My Love 💕",
                message: text,
                _template: "box",
                _captcha: "false"
            })
        })
        .then(response => response.json())
        .then(data => {
            replySendBtn.innerText = 'Sent to My Heart! 💘';
            setTimeout(() => {
                replyTextarea.value = '';
                replyModal.classList.add('hidden');
                replySendBtn.innerText = 'Send to My Heart 💖';
            }, 2500);
        })
        .catch(error => {
            console.error("Error sending email:", error);
            alert('Oops! Could not send the message. Please try again.');
            replySendBtn.innerText = 'Send to My Heart 💖';
        });
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
