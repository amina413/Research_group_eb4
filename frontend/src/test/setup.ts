import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// Mock services add small delays and user-event types character by character;
// the 1s default made findBy* flaky when the machine is busy.
configure({ asyncUtilTimeout: 3000 })

// jsdom lacks these browser APIs, which Radix uses (Select, Checkbox, RadioGroup).
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {}
// Radix Checkbox/RadioGroup measure themselves with ResizeObserver.
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})
