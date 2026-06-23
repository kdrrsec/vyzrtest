/** Logo URL: `NEXT_PUBLIC_LOGO_SRC` or default `/public/logo.png`. */
export const LOGO_SRC =
  typeof process.env.NEXT_PUBLIC_LOGO_SRC === "string" &&
  process.env.NEXT_PUBLIC_LOGO_SRC.trim().length > 0
    ? process.env.NEXT_PUBLIC_LOGO_SRC.trim()
    : "/logo.png";
