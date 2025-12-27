document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality with enhanced animation
  const themeToggle = document.getElementById("theme-toggle")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  // Removed unused formNotification variable

  // Check for saved theme preference or use the system preference
  const currentTheme = localStorage.getItem("theme") || (prefersDarkScheme.matches ? "dark" : "light")

  // Set the initial theme
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark")
  } else {
    document.documentElement.removeAttribute("data-theme")
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    let theme = "light"

    if (!document.documentElement.hasAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "dark")
      theme = "dark"
    } else {
      document.documentElement.removeAttribute("data-theme")
    }

    // Save the preference
    localStorage.setItem("theme", theme)
  })

  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")
  const navLinksItems = document.querySelectorAll(".nav-links li")

  if (hamburger) {
    const toggleMenu = () => {
      // Toggle navigation
      navLinks.classList.toggle("active")
      hamburger.classList.toggle("active")
      const expanded = hamburger.classList.contains("active")
      hamburger.setAttribute("aria-expanded", expanded ? "true" : "false")

      // Animate links
      navLinksItems.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = ""
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
        }
      })
    }
    hamburger.addEventListener("click", toggleMenu)
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        toggleMenu()
      }
    })
  }

  // Trigger hero animation on load
  document.querySelectorAll('.load-animate').forEach((el) => {
    // Add visible class with delay based on transition-delay set in CSS
    setTimeout(() => {
      el.classList.add('visible')
    }, 100)
  })

  // Enhanced Smooth scrolling for all navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      // Close mobile menu if open
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active")
        hamburger.classList.remove("active")
        hamburger.setAttribute("aria-expanded", "false")
      }

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        smoothScrollTo(targetElement.offsetTop - 70, 400) // Slightly longer for smoother feel
      }
    })
  })

  // Custom smooth scroll function for consistent behavior
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    let startTime = null

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const scrollY = easeInOutQuad(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, scrollY)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    // Easing function for smoother animation
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    requestAnimationFrame(animation)
  }

  // Active navigation link on scroll with improved performance
  const sections = document.querySelectorAll("section")
  const navItems = document.querySelectorAll(".nav-link")
  let isScrolling = false

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      isScrolling = true

      // Use requestAnimationFrame for better performance
      window.requestAnimationFrame(() => {
        let current = ""
        const scrollPosition = window.pageYOffset + 200

        sections.forEach((section) => {
          const sectionTop = section.offsetTop
          const sectionHeight = section.clientHeight

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute("id")
          }
        })

        navItems.forEach((item) => {
          item.classList.remove("active")
          item.removeAttribute("aria-current")
          if (item.getAttribute("href") === `#${current}`) {
            item.classList.add("active")
            item.setAttribute("aria-current", "page")
          }
        })

        isScrolling = false
      })
    }

    // Also check for animations while scrolling
    checkScroll()
  })

  // Enhanced Scroll animations with improved performance
  const animateElements = document.querySelectorAll(".animate")
  let ticking = false

  function checkScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        animateElements.forEach((element) => {
          const elementTop = element.getBoundingClientRect().top
          const windowHeight = window.innerHeight
          const triggerPoint = windowHeight * 0.85 // Trigger animations a bit earlier

          if (elementTop < triggerPoint) {
            element.classList.add("visible")
          } else if (elementTop > windowHeight) {
            // Reset animation when element is out of view (for scrolling back up)
            element.classList.remove("visible")
          }
        })
        ticking = false
      })
      ticking = true
    }
  }
})

// Skill bar animation on hover
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.skill-bar').forEach(bar => {
      const fill = bar.querySelector('.progress-bar-fill');
      const percent = bar.getAttribute('data-percent');
      fill.style.width = percent;
      if (fill) {
        fill.textContent = percent;
      }
    });
  });

// Extra visuals: scroll progress bar, parallax, and 3D tilt shine on cards
document.addEventListener("DOMContentLoaded", () => {
  // Scroll progress bar
  const progressEl = document.getElementById('scroll-progress')
  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const progress = docHeight ? (scrollTop / docHeight) * 100 : 0
    if (progressEl) progressEl.style.width = progress + '%'
  }
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })

  // Parallax on hero image and blob
  const hero = document.querySelector('.hero')
  const profileImg = document.querySelector('.profile-image')
  const heroBlob = document.querySelector('.hero-blob')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (hero && profileImg && !reduceMotion.matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const max = 10
      profileImg.style.transform = `translate3d(${x * max}px, ${y * max}px, 0)`
      if (heroBlob) {
        heroBlob.style.transform = `translate3d(${x * -20}px, ${y * -20}px, 0)`
      }
    })
    hero.addEventListener('mouseleave', () => {
      profileImg.style.transform = ''
      if (heroBlob) heroBlob.style.transform = ''
    })
  }

  // 3D tilt and shine on project cards
  const cards = document.querySelectorAll('.project-card')
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (!isTouch && !reduceMotion.matches) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const px = x / rect.width
        const py = y / rect.height
        const tilt = 10
        const rx = (py - 0.5) * -tilt
        const ry = (px - 0.5) * tilt
        card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`
        card.style.setProperty('--mx', `${px * 100}%`)
        card.style.setProperty('--my', `${py * 100}%`)
      })
      card.addEventListener('mouseleave', () => {
        card.style.transform = ''
        card.style.removeProperty('--mx')
        card.style.removeProperty('--my')
      })
    })
  }

  // Dynamic aurora parallax linked to mouse
  if (!reduceMotion.matches) {
    let raf = null
    let targetX = 0, targetY = 0
    const onMove = (e) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const x = (e.clientX / w - 0.5) * 30 // max 30px
      const y = (e.clientY / h - 0.5) * 30
      targetX = x
      targetY = y
      if (!raf) {
        raf = requestAnimationFrame(() => {
          document.body.style.setProperty('--auroraX', `${targetX}px`)
          document.body.style.setProperty('--auroraY', `${targetY}px`)
          raf = null
        })
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
  }

  // Magnetic buttons
  const buttons = document.querySelectorAll('.btn')
  if (!reduceMotion.matches) {
    buttons.forEach((btn) => {
      btn.style.transform = 'translate3d(0,0,0)'
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        const mag = 6
        btn.style.transform = `translate3d(${x * mag}px, ${y * mag}px, 0)`
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0,0,0)'
      })
    })
  }
})