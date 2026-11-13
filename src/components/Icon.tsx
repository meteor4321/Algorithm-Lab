import type { SVGProps } from 'react'

const paths = {
  arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  back: <><path d="M20 12H5" /><path d="m11 18-6-6 6-6" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  sort: <><path d="M4 19h16M6 15v-3m4 3V9m4 6V6m4 9V3" /></>,
  search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5" /></>,
  code: <><path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16" /></>,
  play: <path d="m8 5 12 7-12 7Z" />,
  pause: <><path d="M9 5v14m6-14v14" /></>,
  replay: <><path d="M3 11a9 9 0 1 1 2 7m-2-7V5m0 6h6" /></>,
  first: <><path d="M5 5v14m13-14-9 7 9 7Z" /></>,
  previous: <path d="m15 5-9 7 9 7Z" />,
  next: <path d="m9 5 9 7-9 7Z" />,
  last: <><path d="M19 5v14M6 5l9 7-9 7Z" /></>,
  pencil: <><path d="m4 16 11-11 4 4L8 20H4Zm9-9 4 4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
} as const

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths })
{
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  )
}
