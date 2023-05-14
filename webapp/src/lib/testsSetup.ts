import '@testing-library/jest-dom'

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.mock('vite-plugin-ssr/client/router', () => ({
  navigate: vi.fn(),
}))
