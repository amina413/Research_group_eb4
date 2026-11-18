import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// Mock services add small delays and user-event types character by character;
// the 1s default made findBy* flaky when the machine is busy.
configure({ asyncUtilTimeout: 3000 })

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})
