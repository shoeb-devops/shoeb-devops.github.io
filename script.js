// ===== Matrix Rain Background =====
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const charArray = chars.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * canvas.height / fontSize;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(13, 13, 26, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00d4ff';
    ctx.font = fontSize + 'px Share Tech Mono';
    
    for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== Particles.js Configuration =====
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#00d4ff', '#bf00ff', '#00d4ff']
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00d4ff',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 200,
                line_linked: {
                    opacity: 0.6
                }
            },
            push: {
                particles_nb: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    retina_detect: true
});

// ===== Mouse Glow Effect =====
const mouseGlow = document.querySelector('.mouse-glow');
let lastX = 0, lastY = 0;
let mouseSpeed = 0;

document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    lastX = e.clientX;
    lastY = e.clientY;
    
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
    
    if (mouseSpeed > 30) {
        mouseGlow.classList.add('active');
    } else {
        mouseGlow.classList.remove('active');
    }
});

// ===== Custom Cursor =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    followerX += (cursorX - followerX) * 0.1;
    followerY += (cursorY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const interactiveElements = document.querySelectorAll('a, button, .btn, .social-icon, .nav-link, .skill-category, .timeline-content, .education-card, .contact-card, .info-card, .tech-item, .project-card, .proj-link-icon');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
    });
});

// ===== Navigation =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== Typing Effect =====
const typingText = document.getElementById('typing-text');
const texts = [
    'Database Developer & System Engineer',
    'Oracle APEX Developer',
    'PL/SQL Programming Expert',
    'DevOps Enthusiast',
    'Building Enterprise Solutions'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// ===== Counter Animation =====
const counters = document.querySelectorAll('.count');
let countersAnimated = false;

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when hero section is in view
const heroSection = document.getElementById('home');
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
    }
}, { threshold: 0.5 });

heroObserver.observe(heroSection);

// ===== Skill Progress Animation =====
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = progress + '%';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ===== Scroll Animations =====
const animateElements = document.querySelectorAll('.skill-category, .timeline-item, .education-card, .contact-card, .info-card, .tech-item, .cert-item, .project-card');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    scrollObserver.observe(el);
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>SENDING...</span>';
    btn.disabled = true;
    
    const formData = new FormData(contactForm);
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            btn.innerHTML = '<i class="fas fa-check"></i> <span>MESSAGE SENT!</span>';
            btn.style.background = '#27c93f';
            contactForm.reset();
        } else {
            btn.innerHTML = '<i class="fas fa-times"></i> <span>SEND ERROR</span>';
            btn.style.background = '#ff3b30';
            console.error('Web3Forms Error:', data);
        }
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    })
    .catch(error => {
        btn.innerHTML = '<i class="fas fa-times"></i> <span>NETWORK ERROR</span>';
        btn.style.background = '#ff3b30';
        console.error('Submission Error:', error);
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
});

// ===== Parallax Effect =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.profile-card, .cyber-name-box');
    const x = (e.clientX - window.innerWidth / 2) / 50;
    const y = (e.clientY - window.innerHeight / 2) / 50;
    
    cards.forEach(card => {
        card.style.transform = `perspective(1000px) rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg)`;
    });
});

// ===== Console Easter Egg =====
console.log(`
%c╔══════════════════════════════════════════════╗
%c║  ███████╗██╗  ██╗ ██████╗ ███████╗██████╗   ║
%c║  ██╔════╝██║  ██║██╔═══██╗██╔════╝██╔══██╗  ║
%c║  ███████╗███████║██║   ██║█████╗  ██████╔╝  ║
%c║  ╚════██║██╔══██║██║   ██║██╔══╝  ██╔══██╗  ║
%c║  ███████║██║  ██║╚██████╔╝███████╗██████╔╝  ║
%c║  ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═════╝   ║
%c╠══════════════════════════════════════════════╣
%c║     Welcome to my Portfolio! 🚀              ║
%c║     Thanks for checking out my code!         ║
%c╚══════════════════════════════════════════════╝
`, 
'color: #00ff88; font-weight: bold;',
'color: #00ff88; font-weight: bold;',
'color: #00ff88; font-weight: bold;',
'color: #00ff88; font-weight: bold;',
'color: #00ff88; font-weight: bold;',
'color: #00ff88; font-weight: bold;',
'color: #00ff88; font-weight: bold;',
'color: #00ff88; font-weight: bold;',
'color: #00ffff; font-weight: bold;',
'color: #00ffff; font-weight: bold;',
'color: #00ff88; font-weight: bold;'
);

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
