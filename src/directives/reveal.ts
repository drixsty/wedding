import type { ObjectDirective } from 'vue'

interface RevealOptions {
  delay?: number
  distance?: number
  duration?: number
}

const observerRegistry = new WeakMap<HTMLElement, IntersectionObserver>()

function parseBinding(value: unknown): RevealOptions {
  if (!value || typeof value !== 'object') {
    return {}
  }

  return value as RevealOptions
}

function getRevealConfig(el: HTMLElement, options: RevealOptions) {
  const delay = typeof options.delay === 'number' ? options.delay : 0
  const distance = typeof options.distance === 'number' ? options.distance : 24
  const duration = typeof options.duration === 'number' ? options.duration : 700

  el.style.opacity = '0'
  el.style.transform = `translateY(${distance}px)`
  el.style.transitionProperty = 'opacity, transform'
  el.style.transitionDuration = `${duration}ms`
  el.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)'
  el.style.transitionDelay = `${delay}ms`
}

const revealDirective: ObjectDirective<HTMLElement, RevealOptions> = {
  mounted(el, binding) {
    if (typeof window === 'undefined') {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }

    const options = parseBinding(binding.value)
    getRevealConfig(el, options)

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
      }
    )

    observer.observe(el)
    observerRegistry.set(el, observer)
  },
  unmounted(el) {
    const observer = observerRegistry.get(el)
    if (observer) {
      observer.unobserve(el)
      observer.disconnect()
      observerRegistry.delete(el)
    }
  }
}

export default revealDirective
