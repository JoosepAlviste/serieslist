import React from 'react'

import { Link } from '@/components'

import { RegisterForm } from '../components/RegisterForm'

export const Page = () => (
  <>
    <h1>Register</h1>

    <RegisterForm />

    <div>
      Already have an account? <Link href="/login">Log in here</Link>
    </div>
  </>
)
