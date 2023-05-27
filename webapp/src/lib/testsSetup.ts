import { type UntypedLibrary } from '@/types/utils'
import '@testing-library/jest-dom/extend-expect'

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.mock('vite-plugin-ssr/client/router', () => ({
  navigate: vi.fn(),
}))

// Mock PointerEvent that JSDom does not mock by default so that Radix
// Select can be tested.
// https://github.com/radix-ui/primitives/issues/1822
class MockPointerEvent extends Event {
  button: number
  ctrlKey: boolean
  pointerType: string

  constructor(type: string, props: PointerEventInit) {
    super(type, props)
    this.button = props.button ?? 0
    this.ctrlKey = props.ctrlKey ?? false
    this.pointerType = props.pointerType ?? 'mouse'
  }
}

window.PointerEvent = MockPointerEvent as UntypedLibrary as typeof PointerEvent
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.releasePointerCapture = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn()
