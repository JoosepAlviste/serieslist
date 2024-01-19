import { Link } from '@serieslist/ui'
import React from 'react'

import { AuthLayout } from '../components'
import { RegisterForm } from '../components/RegisterForm'

export const Page = () => (
  <AuthLayout
    otherAction={
      <>
        Already have an account? <Link href="/login">Log in here</Link>
      </>
    }
  >
    <RegisterForm />
  </AuthLayout>
)
