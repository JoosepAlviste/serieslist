import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/test/testsSetup.ts'],
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/test/testsSetup.ts',
        'src/**/__tests__',
        'src/**/*.factory.ts',
      ],
    },
  },
})
