import * as React from 'react'
import type { SVGProps } from 'react'
const SeriesIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19 12C13.4772 12 9 16.4771 9 22V54.9002C9 60.4231 13.4772 64.9002 19 64.9002H78C83.5229 64.9002 88 60.4231 88 54.9002V22C88 16.4772 83.5229 12 78 12H19ZM45.2747 25.4884C43.4482 24.2137 41 25.5825 41 27.8784V48.1216C41 50.4175 43.4482 51.7863 45.2747 50.5116L59.7775 40.3899C61.4075 39.2523 61.4075 36.7477 59.7775 35.6101L45.2747 25.4884Z"
      fill="var(--icon-color)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26 78C26 75.2386 28.0736 73 30.6316 73H65.3684C67.9264 73 70 75.2386 70 78C70 80.7614 67.9264 83 65.3684 83H30.6316C28.0736 83 26 80.7614 26 78Z"
      fill="var(--icon-color)"
    />
  </svg>
)
export default SeriesIcon
