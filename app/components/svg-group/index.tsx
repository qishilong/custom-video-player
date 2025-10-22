import type { ComponentProps } from "react"

export function CustomVideoPlayIcon({ ...props }: ComponentProps<'svg'>) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <path d="M22.0654 11.3785C24.0199 12.5428 24.0199 15.4537 22.0654 16.618L8.87313 24.4774C6.91871 25.6417 4.4757 24.1863 4.4757 21.8576L4.4757 6.13894C4.4757 3.81025 6.91872 2.35482 8.87313 3.51917L22.0654 11.3785Z" fill="currentColor" />
  </svg>
}

export function CustomVideoPauseIcon({ ...props }: ComponentProps<'svg'>) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    {...props}
  >
    <rect x="2.85156" y="1.69727" width="2.23288" height="10.606" rx="1.11644" fill="currentColor" />
    <rect x="8.91406" y="1.69727" width="2.23288" height="10.606" rx="1.11644" fill="currentColor" />
  </svg>
}

export function CustomVideoMaximizeIcon({ ...props }: ComponentProps<'svg'>) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    {...props}
  >
    <path d="M5.13372 1.3999H2.64484C1.95755 1.3999 1.40039 1.95706 1.40039 2.64435V5.13324M5.13372 12.5999H2.64484C1.95755 12.5999 1.40039 12.0427 1.40039 11.3555V8.86657M8.86706 1.3999H11.3559C12.0432 1.3999 12.6004 1.95706 12.6004 2.64435V5.13324M12.6004 8.86657V11.3555C12.6004 12.0427 12.0432 12.5999 11.3559 12.5999H8.86706" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
}

export function CustomVideoMinimizeIcon({ ...props }: ComponentProps<'svg'>) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path d="M3 8H3.2C4.88016 8 5.72024 8 6.36197 7.67302C6.92646 7.3854 7.3854 6.92646 7.67302 6.36197C8 5.72024 8 4.88016 8 3.2V3M3 16H3.2C4.88016 16 5.72024 16 6.36197 16.327C6.92646 16.6146 7.3854 17.0735 7.67302 17.638C8 18.2798 8 19.1198 8 20.8V21M16 3V3.2C16 4.88016 16 5.72024 16.327 6.36197C16.6146 6.92646 17.0735 7.3854 17.638 7.67302C18.2798 8 19.1198 8 20.8 8H21M16 21V20.8C16 19.1198 16 18.2798 16.327 17.638C16.6146 17.0735 17.0735 16.6146 17.638 16.327C18.2798 16 19.1198 16 20.8 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}