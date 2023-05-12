import React, { useState } from 'react'

import { Button } from '@/components/Button'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount((count) => count + 1)} variant="ghost">
      Counter {count}
    </Button>
  )
}
