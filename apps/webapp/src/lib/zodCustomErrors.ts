import { z } from 'zod'

z.config({
  customError: (iss) => {
    if (iss.code === 'too_small') {
      return `Please enter at least ${iss.minimum} characters`
    }

    if (iss.code === 'invalid_format' && iss.format === 'email') {
      return 'Please enter a valid email address'
    }
  },
})
