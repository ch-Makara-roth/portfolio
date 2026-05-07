import type { SVGProps } from 'react'

type BrandIconProps = Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> & {
  size?: number | string
}

const BrandSvg = ({
  size = 24,
  children,
  ...props
}: BrandIconProps & { children: React.ReactNode }) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    focusable="false"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
)

export const Github = (props: BrandIconProps) => (
  <BrandSvg {...props}>
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.3 9.6 7.9 11.1.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.8 1.2 1.8 1.2 1 .1.7 2.1 2.9 1.5.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6a11.8 11.8 0 0 0 7.8-11.1A11.5 11.5 0 0 0 12 .5Z" />
  </BrandSvg>
)

export const Linkedin = (props: BrandIconProps) => (
  <BrandSvg {...props}>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S.02 4.88.02 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v14H.4V8Zm7.1 0h4v1.9h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.7V22h-4.2v-6.8c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V22H7.5V8Z" />
  </BrandSvg>
)

export const Facebook = (props: BrandIconProps) => (
  <BrandSvg {...props}>
    <path d="M24 12.1C24 5.5 18.6.1 12 .1S0 5.5 0 12.1c0 6 4.4 11 10.1 11.9v-8.4h-3v-3.5h3V9.5c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.9V24c5.8-.9 10.2-5.9 10.2-11.9Z" />
  </BrandSvg>
)

export const Twitter = (props: BrandIconProps) => (
  <BrandSvg {...props}>
    <path d="M23.4 4.8c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1A4.5 4.5 0 0 0 12.1 8c0 .4 0 .7.1 1A12.9 12.9 0 0 1 2.9 4.3a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1c0 2.2 1.6 4.1 3.6 4.5-.4.1-.8.2-1.2.2-.3 0-.6 0-.8-.1a4.5 4.5 0 0 0 4.2 3.1A9.1 9.1 0 0 1 2.5 19c-.4 0-.7 0-1.1-.1a12.8 12.8 0 0 0 7 2.1c8.4 0 13-7 13-13v-.6a9.3 9.3 0 0 0 2.3-2.4l-.3-.2Z" />
  </BrandSvg>
)
