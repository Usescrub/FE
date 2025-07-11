// Scrub.io JavaScript functionality
const { animate } = Motion

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Theme toggle functionality
  setupThemeToggle()

  // FAQ accordion functionality
  setupFaqAccordion()

  // Animation on scroll
  // setupScrollAnimations()

  setupAboutTabToggle()
})

// Theme toggle functionality
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle')

  // Check for saved theme preference or respect OS preference
  if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!localStorage.getItem('color-theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Toggle theme on button click
  themeToggleBtn.addEventListener('click', function () {
    // Toggle dark class on html element
    document.documentElement.classList.toggle('dark')

    // Update localStorage
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('color-theme', 'dark')
    } else {
      localStorage.setItem('color-theme', 'light')
    }
  })
}

// FAQ accordion functionality
function setupFaqAccordion() {
  const faqToggles = document.querySelectorAll('.faq-toggle')

  faqToggles.forEach((toggle) => {
    toggle.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target')
      const content = document.getElementById(targetId)
      console.log(toggle, targetId, content)
      const icon = this.querySelector('.faq-icon')

      // Toggle active class
      content.classList.toggle('hidden')
      content.style.maxHeight = content.scrollHeight + 'px'
      icon.classList.toggle('rotate-180')

      // Close other FAQs
      document.querySelectorAll('.faq-content').forEach((item) => {
        if (item.id !== targetId) {
          item.classList.add('hidden')
          item.style.maxHeight = '0'
        }
      })

      document.querySelectorAll('.faq-icon').forEach((item) => {
        if (item !== icon) {
          item.classList.remove('rotate-180')
        }
      })
    })
  })
}

// Animation on scroll
function setupScrollAnimations() {
  // Get all elements to animate
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll')

  // Create intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    }
  )

  // Observe each element
  elementsToAnimate.forEach((element) => {
    observer.observe(element)
  })
}

function setupAboutTabToggle() {
  const tabs = document.querySelectorAll('.tabs')
  const allTabContent = document.querySelectorAll('.tab-content > div')

  tabs.forEach((tab, ind) => {
    tab.addEventListener('click', function () {
      const tabContent = document.getElementById(`tab-${ind + 1}`)
      tabContent.classList.remove('hidden')
      if (!tab.classList.contains('active')) {
        translatePhysical(ind)
      }

      allTabContent.forEach((item) => {
        if (item.id !== tabContent.id) {
          item.classList.add('hidden')
        }
      })
    })
  })
}

function translatePhysical(index) {
  const appendedDiv = `<div class="active_cursor bg-black dark:bg-white top-0 left-0 w-full rounded-full absolute h-full translate-x-0"></div>`
  const markers = document.querySelectorAll('.tabs')
  const currentCursor = document.querySelector('.active_cursor')
  const selectedMarker = markers[index]
  const { left: currentLeft } = currentCursor.getBoundingClientRect()
  const { left: newLeft } = selectedMarker.getBoundingClientRect()

  markers.forEach((item) => {
    let newInnerHtml
    const a = item.innerHTML.split('</div>')

    if (a.length === 2) {
      newInnerHtml = a[1]
    } else {
      newInnerHtml = a[0]
    }
    item.id !== selectedMarker.id ? (item.innerHTML = newInnerHtml) : null
    item.id !== selectedMarker.id
      ? item.classList.remove('active')
      : item.classList.add('active')
  })

  const oldInnerHtml = selectedMarker.innerHTML
  selectedMarker.innerHTML = appendedDiv + oldInnerHtml
  animate(
    '.active_cursor',
    {
      x: [currentLeft - newLeft, 0],
    },
    { duration: 0.5 }
  )
}
