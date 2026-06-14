;(function (win) {
  'use strict'

  function getSavedTheme(fallback) {
    var theme = localStorage.getItem('scrub-theme')
    if (theme !== 'dark' && theme !== 'light') {
      var legacy = localStorage.getItem('color-theme')
      if (legacy === 'dark' || legacy === 'light') theme = legacy
    }
    if (theme !== 'dark' && theme !== 'light') {
      theme =
        fallback ||
        document.documentElement.getAttribute('data-theme') ||
        'dark'
    }
    return theme
  }

  function updateBrandLogos(theme) {
    document.querySelectorAll('img.brand-logo').forEach((img) => {
      img.src =
        theme === 'dark' ? 'images/scrubLogo.svg' : 'images/scrubLogo-light.svg'
    })
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('scrub-theme', theme)
    updateBrandLogos(theme)
    return theme
  }

  win.ScrubTheme = { getSavedTheme: getSavedTheme, applyTheme: applyTheme }
  applyTheme(getSavedTheme())
  document.addEventListener('DOMContentLoaded', function () {
    updateBrandLogos(getSavedTheme())
  })
})(window)
