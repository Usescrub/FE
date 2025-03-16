// Scrub.io JavaScript functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Theme toggle functionality
  setupThemeToggle()

  // FAQ accordion functionality
  setupFaqAccordion()

  // Animation on scroll
  // setupScrollAnimations()

  // Initialize modal functionality
  setupWaitlistModal()
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
      const icon = this.querySelector('.faq-icon')

      // Toggle active class
      content.classList.toggle('hidden')
      icon.classList.toggle('rotate-180')

      // Close other FAQs
      document.querySelectorAll('.faq-content').forEach((item) => {
        if (item.id !== targetId) {
          item.classList.add('hidden')
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

function setupWaitlistModal() {
  const waitlistButtons = document.querySelectorAll('.waitlist')
  const formContainer = document.querySelector('.form-cont')
  const form = document.getElementById('waitlist-form')
  const modal = document.getElementById('waitlist-modal')
  const successMessage = document.getElementById('success-message')
  const submitBtn = document.getElementById('submit-button')
  const btnSpinner = document.getElementById('spinner')
  const btnText = submitBtn.querySelector('span')

  // Show modal on button click
  waitlistButtons.forEach((item) => {
    item.addEventListener('click', function () {
      modal.classList.remove('hidden')
    })
  })

  // Close modal functionality
  document.getElementById('close-modal').addEventListener('click', function () {
    modal.classList.add('hidden')
  })

  document
    .getElementById('close-success-modal')
    .addEventListener('click', function () {
      modal.classList.add('hidden')
    })

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    submitBtn.disabled = true
    btnText.classList.add('hidden')
    btnSpinner.classList.remove('hidden')

    const data = {
      firstName: form.elements['firstName'].value,
      lastName: form.elements['lastName'].value,
      email: form.elements['email'].value,
    }

    // Send data to Google Sheets
    fetch(
      'https://script.google.com/macros/s/AKfycbx01GgEq_fJjyACtdw4CXKkvttrSwoPv5alLAiUZmnaEvFYeUhrC3yGqNeazVn4Blj-/exec',
      {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => {
        // Show success message
        formContainer.classList.add('hidden')
        successMessage.classList.remove('hidden')
        btnText.classList.remove('hidden')
        btnSpinner.classList.add('hidden')
        form.reset()
      })
      .catch((error) => {
        alert('There was an error submitting your request. Please try again.')
      })
  })
}
