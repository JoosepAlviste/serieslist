import React from 'react'

import { Link } from '@/components'

import { LoginForm } from '../components/LoginForm'

export const Page = () => (
  <>
    <h1>Login</h1>

    <LoginForm />

    <div>
      Don&apos;t have an account? <Link href="/register">Register here</Link>
    </div>
  </>
)
