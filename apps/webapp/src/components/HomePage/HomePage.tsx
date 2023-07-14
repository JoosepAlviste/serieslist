import React from 'react'

import { ReactComponent as FunArrow } from './FunArrow.svg'
import { ReactComponent as HomeCinema } from './HomeCinema.svg'
import * as s from './HomePage.css'
import { ReactComponent as PartyHat } from './PartyHat.svg'

export const HomePage = () => (
  <>
    <div className={s.background}>
      <FunArrow className={s.drawing1} />
      <PartyHat className={s.drawing2} />

      <div className={s.heartfulMessage}>Made with 💜 in Tallinn!</div>
    </div>

    <div className={s.container}>
      <div className={s.titleSide}>
        <div className={s.title}>Watching many shows at a time?</div>
        <h1 className={s.subtitle}>
          Always know which episode to watch next. Keep track of your series and
          seen episodes with{' '}
          <span className={s.titleHighlight}>Serieslist</span>!
        </h1>
      </div>

      <HomeCinema className={s.illustration} />
    </div>
  </>
)
