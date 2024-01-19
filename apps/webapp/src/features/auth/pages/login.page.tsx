import { Link } from '@serieslist/ui'
import React from 'react'

import { AuthLayout } from '../components'
import { LoginForm } from '../components/LoginForm'

export const Page = () => (
  <AuthLayout
    otherAction={
      <>
        Don&apos;t have an account? <Link href="/register">Register here</Link>
      </>
    }
  >
    <LoginForm />
  </AuthLayout>
)
