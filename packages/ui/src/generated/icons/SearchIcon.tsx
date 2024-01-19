import * as React from 'react'
import type { SVGProps } from 'react'
const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M45.16 63.6162C54.9023 63.6162 62.8 55.7495 62.8 46.0455C62.8 36.3414 54.9023 28.4747 45.16 28.4747C35.4177 28.4747 27.52 36.3414 27.52 46.0455C27.52 55.7495 35.4177 63.6162 45.16 63.6162ZM45.16 75.0909C61.2646 75.0909 74.32 62.0868 74.32 46.0455C74.32 30.0041 61.2646 17 45.16 17C29.0554 17 16 30.0041 16 46.0455C16 62.0868 29.0554 75.0909 45.16 75.0909Z"
      fill="var(--icon-color)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M78.1671 86.3196L55.8471 64.0872L63.9929 55.9734L86.3129 78.2057C88.5624 80.4463 88.5624 84.079 86.3129 86.3196C84.0635 88.5602 80.4165 88.5602 78.1671 86.3196Z"
      fill="var(--icon-color)"
    />
  </svg>
)
export default SearchIcon
