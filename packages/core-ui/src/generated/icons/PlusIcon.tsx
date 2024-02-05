import * as React from 'react'
import type { SVGProps } from 'react'
const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50.0104 15.9124C53.3241 15.9124 56.0104 18.5987 56.0104 21.9124L56.0104 77.0668C56.0104 80.3805 53.3241 83.0668 50.0104 83.0668C46.6967 83.0668 44.0104 80.3805 44.0104 77.0668L44.0104 21.9124C44.0104 18.5987 46.6967 15.9124 50.0104 15.9124Z"
      fill="var(--icon-color)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.4124 49.5104C16.4124 52.8241 19.0987 55.5104 22.4124 55.5104L77.5667 55.5104C80.8805 55.5104 83.5667 52.8241 83.5667 49.5104C83.5667 46.1967 80.8805 43.5104 77.5667 43.5104L22.4124 43.5104C19.0987 43.5104 16.4124 46.1967 16.4124 49.5104Z"
      fill="var(--icon-color)"
    />
  </svg>
)
export default PlusIcon
