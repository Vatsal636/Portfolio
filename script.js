/**
 * Portfolio V3 - Premium Interactions
 * Advanced animations, custom cursor, and smooth effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initPreloader();
  initCustomCursor();
  initNavigation();
  initScrollProgress();
  // initScrollAnimations is now called after preloader finishes
  initSmoothScroll();
  initParallax();
  initExpandableCards();
  initScrollIndicator();
  initDeveloperConsole();

  // Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/**
 * Preloader - Hides after page load with smooth transition
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');

  // If no preloader exists (e.g., projects page), init animations immediately
  if (!preloader) {
    initScrollAnimations();
    return;
  }

  const onPreloaderComplete = () => {
    preloader.classList.add('loaded');
    // Initialize scroll animations after preloader finishes
    setTimeout(() => {
      initScrollAnimations();
    }, 100);
  };

  window.addEventListener('load', () => {
    setTimeout(onPreloaderComplete, 2000); // Show preloader for at least 2s
  });

  // Fallback in case load event already fired
  if (document.readyState === 'complete') {
    setTimeout(onPreloaderComplete, 2000);
  }
}

/**
 * Custom Cursor - Follows mouse with smooth effect
 */
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (!cursor || !cursorDot || window.matchMedia('(max-width: 768px)').matches) {
    return;
  }

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation
  function animateCursor() {
    // Outer cursor - slower, elastic follow
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Dot - faster, direct follow
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .nav-link, .btn');

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });
}

/**
 * Navigation - Scroll effects and mobile toggle
 */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect - add background on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Initial call
}

/**
 * Scroll Progress Ring - Shows scroll position
 */
function initScrollProgress() {
  const progressRing = document.querySelector('.scroll-progress-ring');
  const progressBar = document.querySelector('.progress-bar');
  const percentage = document.querySelector('.percentage');

  if (!progressRing || !progressBar) return;

  const circumference = 2 * Math.PI * 25; // r = 25

  function updateProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const offset = circumference - (scrollPercent / 100) * circumference;

    progressBar.style.strokeDashoffset = offset;

    if (percentage) {
      percentage.textContent = Math.round(scrollPercent) + '%';
    }

    // Show/hide based on scroll position
    if (scrollTop > 200) {
      progressRing.classList.add('visible');
    } else {
      progressRing.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress(); // Initial call
}

/**
 * Scroll Animations - Reveal elements on scroll (repeats on every scroll)
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        // Remove class when element leaves viewport for repeat animation
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll - Enhanced smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed nav

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu?.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle?.classList.remove('active');
        }
      }
    });
  });
}

/**
 * Parallax Effects - Subtle movement on scroll
 */
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  const heroImage = document.querySelector('.hero-image-container');
  const heroContent = document.querySelector('.hero-content');

  // Mouse Move Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
  });

  function updateMouseParallax() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    if (heroImage) {
      heroImage.style.transform = `translate(${targetX * -0.02}px, ${targetY * -0.02}px)`;
    }

    if (heroContent) {
      heroContent.style.transform = `translate(${targetX * 0.01}px, ${targetY * 0.01}px)`;
    }

    orbs.forEach((orb, i) => {
      const speed = 0.03 * (i + 1);
      // Combine with existing scroll transform if needed, or just use separate animation layers
      // For simplicity here, we'll just apply mouse parallax to orbs as they are fixed
      orb.style.transform = `translate(${targetX * speed}px, ${targetY * speed}px)`;
    });

    requestAnimationFrame(updateMouseParallax);
  }

  updateMouseParallax();

  // Scroll Parallax
  let ticking = false;

  function updateScrollParallax() {
    const scrollY = window.pageYOffset;

    orbs.forEach((orb, i) => {
      const speed = 0.05 * (i + 1);
      // This might conflict with mouse transform above. 
      // Better to use margin-top or separate transform property if supported, 
      // but let's keep it simple for now and prioritize mouse feel in hero
    });

    // Only apply scroll parallax to other elements if needed
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollParallax);
      ticking = true;
    }
  });
}

/**
 * Typing Effect - For hero subtitle (optional enhancement)
 */
function initTypingEffect(element, text, speed = 50) {
  if (!element) return;

  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

/**
 * Magnetic Button Effect - Elements follow cursor slightly
 */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/**
 * Project Parallax Effect - 3D tilt on hover (Homepage only)
 */
function initProjectParallax() {
  const cards = document.querySelectorAll('#projects .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}



/**
 * Counter Animation - Animate numbers on scroll
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.textContent);
        animateCounter(target, endValue);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, endValue) {
  const duration = 2000;
  const startTime = performance.now();
  const suffix = element.textContent.replace(/[0-9]/g, ''); // Get '+' or other suffix

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function - ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(eased * endValue);

    element.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Initialize additional effects after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    initMagneticButtons();
    initProjectParallax();
    initCounterAnimation();
  }, 2500); // After preloader
});

// Disable cursor effects on touch devices
if ('ontouchstart' in window) {
  document.body.style.cursor = 'auto';
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  if (cursor) cursor.style.display = 'none';
  if (cursorDot) cursorDot.style.display = 'none';
}

/**
 * Expandable Project Cards - Click to expand/collapse details
 */
function initExpandableCards() {
  const projectCards = document.querySelectorAll('.project-card');

  if (!projectCards.length) return;

  projectCards.forEach(card => {
    const expandToggle = card.querySelector('.expand-toggle');

    if (expandToggle) {
      expandToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        // Close other expanded cards (accordion behavior)
        projectCards.forEach(otherCard => {
          if (otherCard !== card && otherCard.classList.contains('expanded')) {
            otherCard.classList.remove('expanded');
          }
        });

        // Toggle current card
        card.classList.toggle('expanded');

        // Scroll card into view if expanded
        if (card.classList.contains('expanded')) {
          setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      });
    }
  });
}

/**
 * Scroll Indicator - Show filter bar on scroll, hide scroll indicator
 */
function initScrollIndicator() {
  const scrollIndicator = document.getElementById('scrollIndicator');
  const projectsFilter = document.querySelector('.projects-filter');

  if (!scrollIndicator || !projectsFilter) return;

  const scrollThreshold = 300; // Pixels to scroll before toggling

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      scrollIndicator.classList.add('hidden');
      projectsFilter.classList.add('visible');
    } else {
      scrollIndicator.classList.remove('hidden');
      projectsFilter.classList.remove('visible');
    }
  };

  // Initial check
  handleScroll();

  // Listen for scroll
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Developer Console Typewriter & Interactive Mode
 */
function initDeveloperConsole() {
  const terminalBody = document.getElementById('terminal-body');
  const typeWriter = document.getElementById('terminal-typewriter');
  const inputWrapper = document.getElementById('terminal-input-wrapper');
  const inputField = document.getElementById('terminal-input');
  const interactiveCursor = document.getElementById('interactive-cursor');
  const terminalOutput = document.getElementById('terminal-output');
  const copyBtn = document.querySelector('.terminal-copy');

  if (!typeWriter || !inputField) return;

  // Available commands for interactive mode
  const commands = {
    help: 'Available commands: about, skills, projects, contact, clear, whoami',
    about: 'I am Vatsal Gokani, a Full Stack Developer passionate about building high-quality web applications.',
    skills: 'Languages: JS, TS, Python, Java, C++, SQL. Frameworks: React, Next.js, Node.js, Express.',
    projects: 'DayFlow HRMS, SmartVenue, VoteWise AI. Type "view projects" for more.',
    contact: 'Email: vatsalgokani2@gmail.com | LinkedIn: vatsal-gokani-7759a0247',
    whoami: 'A modern web architect in the making.',
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  const codeTokens = [
    { text: "const ", class: "syn-keyword" },
    { text: "developer ", class: "syn-property" },
    { text: "= ", class: "syn-punctuation" },
    { text: "{", class: "syn-punctuation" },
    { text: "\n  ", class: "" },

    { text: "name", class: "syn-property" },
    { text: ": ", class: "syn-punctuation" },
    { text: '"Vatsal Gokani"', class: "syn-string" },
    { text: ",", class: "syn-punctuation" },
    { text: "\n  ", class: "" },

    { text: "role", class: "syn-property" },
    { text: ": ", class: "syn-punctuation" },
    { text: '"Full Stack Developer"', class: "syn-string" },
    { text: ",", class: "syn-punctuation" },
    { text: "\n  ", class: "" },

    { text: "skills", class: "syn-property" },
    { text: ": ", class: "syn-punctuation" },
    { text: "[", class: "syn-punctuation" },
    { text: '"React"', class: "syn-string" },
    { text: ", ", class: "syn-punctuation" },
    { text: '"Next.js"', class: "syn-string" },
    { text: ", ", class: "syn-punctuation" },
    { text: '"Node"', class: "syn-string" },
    { text: "]", class: "syn-punctuation" },
    { text: ",", class: "syn-punctuation" },
    { text: "\n  ", class: "" },

    { text: "passion", class: "syn-property" },
    { text: ": ", class: "syn-punctuation" },
    { text: '"Building impactful products"', class: "syn-string" },
    { text: ",", class: "syn-punctuation" },
    { text: "\n  ", class: "" },

    { text: "createSolution", class: "syn-property" },
    { text: ": ", class: "syn-punctuation" },
    { text: "() ", class: "syn-punctuation" },
    { text: "=> ", class: "syn-keyword" },
    { text: "{", class: "syn-punctuation" },
    { text: "\n    ", class: "" },

    { text: "return ", class: "syn-keyword" },
    { text: '"Clean & Scalable Code"', class: "syn-string" },
    { text: ";", class: "syn-punctuation" },
    { text: "\n  ", class: "" },

    { text: "}", class: "syn-punctuation" },
    { text: ",", class: "syn-punctuation" },
    { text: "\n", class: "" },

    { text: "};", class: "syn-punctuation" },
    { text: "\n\n", class: "" },

    { text: "// Ready to build something amazing?", class: "syn-comment" }
  ];

  let currentTokenIndex = 0;
  let currentCharIndex = 0;
  let isTyping = false;

  // Add cursor for typewriter
  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';

  // Setup observer to start typing when element is in view
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isTyping) {
      isTyping = true;
      typeWriter.innerHTML = '';
      typeWriter.appendChild(cursor);
      typeNextChar();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(typeWriter);

  let currentSpan = null;

  function typeNextChar() {
    if (currentTokenIndex >= codeTokens.length) {
      // Typing finished, remove typewriter cursor and show interactive input
      cursor.remove();
      inputWrapper.style.display = 'flex';
      inputField.focus();
      return;
    }

    const token = codeTokens[currentTokenIndex];

    if (currentCharIndex === 0) {
      currentSpan = document.createElement('span');
      if (token.class) currentSpan.className = token.class;
      typeWriter.insertBefore(currentSpan, cursor);
    }

    currentSpan.textContent += token.text[currentCharIndex];
    currentCharIndex++;

    if (currentCharIndex >= token.text.length) {
      currentTokenIndex++;
      currentCharIndex = 0;
    }

    // Randomize typing speed slightly for realism, faster overall
    const speed = Math.random() * 15 + 15;
    setTimeout(typeNextChar, speed);
  }

  // Move interactive cursor based on input text width
  function updateInteractiveCursor() {
    const textCtx = document.createElement("canvas").getContext("2d");
    const font = window.getComputedStyle(inputField).font;
    textCtx.font = font;

    // Measure text before cursor
    const textBeforeCursor = inputField.value.substring(0, inputField.selectionStart);
    const width = textCtx.measureText(textBeforeCursor).width;

    // Base offset + calculated width
    interactiveCursor.style.left = `calc(24px + ${width}px)`;
  }

  inputField.addEventListener('input', updateInteractiveCursor);
  inputField.addEventListener('keyup', updateInteractiveCursor);
  inputField.addEventListener('click', updateInteractiveCursor);

  // Focus input when clicking anywhere in terminal body
  terminalBody.addEventListener('click', () => {
    if (inputWrapper.style.display !== 'none') {
      inputField.focus();
      updateInteractiveCursor();
    }
  });

  // Handle interactive commands
  inputField.addEventListener('keydown', (e) => {
    updateInteractiveCursor();

    if (e.key === 'Enter') {
      const input = inputField.value.trim().toLowerCase();
      inputField.value = '';
      updateInteractiveCursor();

      if (input) {
        processCommand(input);
      } else {
        // Empty enter print empty prompt line
        const emptyLine = document.createElement('div');
        emptyLine.className = 'terminal-prompt-line';
        emptyLine.innerHTML = `<span class="prompt-arrow">&gt;</span><span class="prompt-cmd"></span>`;
        terminalOutput.appendChild(emptyLine);
        scrollToBottom();
      }
    }
  });

  function processCommand(input) {
    // Echo command
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-prompt-line';
    commandLine.innerHTML = `<span class="prompt-arrow">&gt;</span><span class="prompt-cmd">${input}</span>`;
    terminalOutput.appendChild(commandLine);

    let response = '';
    if (commands[input]) {
      if (typeof commands[input] === 'function') {
        response = commands[input]();
      } else {
        response = commands[input];
      }
    } else if (input.startsWith('view projects')) {
      window.location.href = '#projects';
      response = 'Scrolling to projects...';
    } else if (input === 'portfolio --whoami') {
      response = "See my developer object above!";
    } else {
      response = `Command not found: ${input}. Type 'help' for available commands.`;
    }

    if (response) {
      const responseLine = document.createElement('div');
      responseLine.className = 'terminal-code syn-comment';
      responseLine.textContent = response;
      terminalOutput.appendChild(responseLine);
    }

    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(() => {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }, 50);
  }

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const rawText = codeTokens.map(t => t.text).join('');
      navigator.clipboard.writeText(rawText).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy"></i>';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }
}

console.log('🚀 Portfolio V3 Loaded - Made with ❤️ by Vatsal Gokani    ');