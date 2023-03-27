import React, { type ButtonHTMLAttributes } from 'react'

import { button } from './Button.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => {
  return <button className={button} type="button" {...props} />
}
