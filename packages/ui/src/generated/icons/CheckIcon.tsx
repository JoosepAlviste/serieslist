import * as React from 'react'
import type { SVGProps } from 'react'
const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.5 46.5L38.5 67.5L79 27"
      stroke="var(--icon-color)"
      strokeWidth={12}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default CheckIcon
