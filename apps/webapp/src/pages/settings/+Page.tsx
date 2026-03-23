import { Title } from '@serieslist/core-ui'
import React from 'react'

import { IntegrationTokenForm } from '#/features/jellyfinIntegration'

import * as s from './SettingsPage.css'

export const Page = () => {
  return (
    <div className={s.page}>
      <Title as="h1" className={s.title}>
        Settings
      </Title>

      <IntegrationTokenForm />
    </div>
  )
}
