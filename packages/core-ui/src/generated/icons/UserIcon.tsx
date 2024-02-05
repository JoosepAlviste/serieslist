import * as React from 'react'
import type { SVGProps } from 'react'
const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={48} cy={28} r={16} fill="var(--icon-color)" />
    <path
      d="M12 72V80C12 82.2091 13.7909 84 16 84H80C82.2091 84 84 82.2091 84 80V72C84 66.4 63.5 56 53 56H42C28.4 56 12 67.5 12 72Z"
      fill="var(--icon-color)"
    />
  </svg>
)
export default UserIcon
