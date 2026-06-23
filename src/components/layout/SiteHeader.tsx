"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { getCartItemCount } from "@/app/actions/cart";
import { Link, usePathname } from "@/i18n/navigation";
import { separateCustomFromShop } from "@/lib/catalogSplit";
import { LOGO_SRC } from "@/lib/logo";
import { PATHS } from "@/lib/routes";
import { useSiteChromeStore } from "@/store/useSiteChromeStore";
import { AnnouncementRotator } from "./AnnouncementRotator";
import { CartDrawer } from "./CartDrawer";
import { HeaderSearchPanel } from "./HeaderSearchPanel";

const currencyLabel =
  typeof process.env.NEXT_PUBLIC_STORE_CURRENCY_LABEL === "string"
    ? process.env.NEXT_PUBLIC_STORE_CURRENCY_LABEL
    : "EUR";

export function SiteHeader() {
  const tNav = useTranslations("Nav");
  const tAnnounce = useTranslations("Announce");
  const envLine1 =
    typeof process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINE1 === "string"
      ? process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINE1
      : "";
  const envLine2 =
    typeof process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINE2 === "string"
      ? process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINE2
      : "";
  const line1 = envLine1 || tAnnounce("line1");
  const line2 = envLine2 || tAnnounce("line2");
  const promoLine = tAnnounce("promoFreeShipping");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useSiteChromeStore((s) => s.cartCount);
  const setCartCount = useSiteChromeStore((s) => s.setCartCount);
  const cartIdHint = useSiteChromeStore((s) => s.cartIdHint);
  const cartDrawerOpen = useSiteChromeStore((s) => s.cartDrawerOpen);
  const setSearchOpen = useSiteChromeStore((s) => s.setSearchOpen);
  const setCartDrawerOpen = useSiteChromeStore((s) => s.setCartDrawerOpen);

  const splitCustom = separateCustomFromShop();

  const NAV = [
    { href: PATHS.home, label: tNav("home") },
    { href: PATHS.shopVisors, label: splitCustom ? tNav("shopDesigns") : tNav("shop") },
    ...(splitCustom
      ? [{ href: PATHS.customVisor, label: tNav("customVisor") } as const]
      : [{ href: PATHS.howItWorks, label: tNav("howItWorks") } as const]),
    { href: PATHS.faq, label: tNav("faq") },
    { href: PATHS.contact, label: tNav("contact") },
    { href: PATHS.comingSoon, label: tNav("comingSoon") },
  ] as const;

  const drawerWasOpen = useRef(false);

  useEffect(() => {
    getCartItemCount(cartIdHint ?? undefined).then(setCartCount);
  }, [pathname, setCartCount, cartIdHint]);

  useEffect(() => {
    if (cartDrawerOpen) {
      drawerWasOpen.current = true;
      return;
    }
    if (drawerWasOpen.current) {
      drawerWasOpen.current = false;
      window.setTimeout(() => {
        getCartItemCount(useSiteChromeStore.getState().cartIdHint ?? undefined).then(
          setCartCount
        );
      }, 50);
    }
  }, [cartDrawerOpen, setCartCount]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="site-announce-bar">
        <div className="mx-auto max-w-7xl px-4 py-1.5">
          <AnnouncementRotator slideA={line1} slideB={line2.trim() || promoLine} />
        </div>
      </div>

      <header className="sticky top-0 z-50 overflow-visible border-b border-white/20 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-[50px] max-h-[50px] min-h-[50px] max-w-7xl items-center justify-between gap-3 overflow-visible px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3 lg:gap-8">
            <button
              type="button"
              className="rounded-lg p-2 text-white lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={tNav("openMenu")}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseMenuIcon /> : <MenuIcon />}
            </button>

            <Link
              href={PATHS.home}
              className="relative z-10 flex h-[50px] shrink-0 -translate-x-[calc((100vw-min(100vw,80rem))/2+0.25rem-6.875rem+0.5rem)] translate-y-1 items-center overflow-visible"
              aria-label={tNav("home")}
            >
              <HeaderLogo src={LOGO_SRC} />
            </Link>

            <nav
              className="hidden items-center gap-7 overflow-visible lg:flex"
              aria-label="Primary"
            >
              {NAV.map((item) => (
                <NavTab
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isNavActive(pathname, item.href)}
                />
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <span className="hidden px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted lg:inline">
              {currencyLabel}
            </span>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2.5 text-white transition hover:bg-white/5 hover:text-accent"
              aria-label={tNav("search")}
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-full py-2.5 pl-2 pr-2.5 text-white transition hover:bg-white/5 hover:text-accent"
              aria-label={`${tNav("cart")}, ${cartCount}`}
            >
              <BagIcon className="h-5 w-5 shrink-0" />
              <span
                className={`font-mono text-[11px] font-semibold tabular-nums leading-none tracking-tight ${
                  cartCount > 0 ? "text-white" : "text-white/45"
                }`}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div id="mobile-nav" className="border-t border-white/20 bg-black lg:hidden">
            <nav className="flex flex-col px-4 py-4" aria-label="Mobile primary">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b border-white/12 py-3 text-sm font-medium uppercase tracking-widest transition hover:text-accent ${
                    isNavActive(pathname, item.href)
                      ? "text-accent"
                      : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={PATHS.shopVisors}
                className="btn-accent mt-4 inline-flex items-center justify-center px-8 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em]"
              >
                {tNav("buyNow")}
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <CartDrawer />
      <HeaderSearchPanel />
    </>
  );
}

function HeaderLogo({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <span className="font-mono text-2xl font-semibold tracking-[0.22em] text-white md:text-3xl">
        VYZR
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- /public asset; svg/png from designer
    <img
      src={src}
      alt="VYZR"
      className="h-[128px] w-auto max-w-[min(100vw-5rem,720px)] shrink-0 object-contain object-left md:h-[140px]"
      onError={() => setBroken(true)}
    />
  );
}

function isNavActive(pathname: string, href: string) {
  if (href === PATHS.comingSoon) {
    return pathname === PATHS.comingSoon;
  }
  if (href === PATHS.home) {
    return pathname === PATHS.home;
  }
  const base = href.split("#")[0];
  if (!base || base === PATHS.home) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}

function NavTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`site-nav-link ${active ? "is-active" : "is-inactive"}`}
    >
      {label}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-5.2-5.2M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
      />
    </svg>
  );
}
