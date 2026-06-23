import type { ReactNode } from "react";

/** Root passes through; real `<html>` / providers live in `app/[locale]/layout.tsx`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
