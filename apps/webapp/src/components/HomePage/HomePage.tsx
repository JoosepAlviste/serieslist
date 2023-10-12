import React from 'react'

import { Text } from '../Text'
import { Title } from '../Title'

import FunArrow from './FunArrow.svg?react'
import HomeCinema from './HomeCinema.svg?react'
import * as s from './HomePage.css'
import PartyHat from './PartyHat.svg?react'

export const HomePage = () => (
  <>
    <div className={s.background}>
      <FunArrow className={s.drawing1} />
      <PartyHat className={s.drawing2} />

      <Text size="s" variant="secondary" className={s.heartfulMessage}>
        Made with 💜 in Tallinn!
      </Text>
    </div>

    <div className={s.container}>
      <div className={s.titleSide}>
        <Title as="h1" size="l" className={s.title}>
          Watching many shows at a time?
        </Title>
        <Text size="l" variant="secondary" className={s.subtitle}>
          Always know which episode to watch next. Keep track of your series and
          seen episodes with{' '}
          <Text as="span" weight="medium">
            Serieslist
          </Text>
          !
        </Text>
      </div>

      <HomeCinema className={s.illustration} />
    </div>
  </>
)
