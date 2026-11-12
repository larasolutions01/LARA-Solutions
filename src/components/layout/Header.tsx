"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/content/navigation";
import { services, servicePath } from "@/content/services";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Interactive";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAt = useRef(0);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMenuOpen(false);
    setDropdown(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdown(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdown(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!dropdown) hoverOpenedAt.current = Date.now();
    setDropdown(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setDropdown(false), 160);
  };

  return (
    <header
      className={cn(
        "theme-dark fixed inset-x-0 top-0 z-50 text-fg transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || menuOpen ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "border-b border-transparent bg-gradient-to-b from-ink/50 to-transparent",
      )}
    >
      <div className={cn("container-x flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-out-expo)]", scrolled || menuOpen ? "h-18" : "h-24")}>
        <Logo priority className={cn("transition-[height] duration-500 ease-[var(--ease-out-expo)]", scrolled || menuOpen ? "h-12 sm:h-14" : "h-16 sm:h-[5.25rem]")} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              if (item.children) {
                return (
                  <li key={item.href} ref={dropdownRef} className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={cn("relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors", active ? "text-fg" : "text-body hover:text-fg")}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                        {active && <ActiveDot />}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={dropdown}
                        aria-controls="solutions-menu"
                        aria-label="Show solutions menu"
                        onClick={() => {
                          // A mouse hover may have just opened the menu — keep it open rather than toggling it shut.
                          if (Date.now() - hoverOpenedAt.current < 400) return;
                          setDropdown((v) => !v);
                        }}
                        className="-ml-2 rounded-full p-1.5 text-body hover:text-fg"
                      >
                        <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300", dropdown && "rotate-180")} />
                      </button>
                    </div>
                    <AnimatePresence>
                      {dropdown && (
                        <motion.div
                          id="solutions-menu"
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-1/2 top-full mt-3 w-[min(92vw,720px)] -translate-x-1/2"
                        >
                          <div
                            className="ring-gradient overflow-hidden rounded-2xl border border-line p-3 shadow-2xl shadow-black/60 backdrop-blur-xl"
                            style={{ background: "rgb(8 20 39 / 0.97)" }}
                          >
                            <ul className="grid grid-cols-2 gap-1">
                              {services.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    href={servicePath(s.slug)}
                                    className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-card-hover focus-visible:bg-card-hover"
                                  >
                                    <ServiceIcon name={s.icon} className="size-9 shrink-0" />
                                    <span>
                                      <span className="flex items-center gap-1 font-display text-sm font-medium text-fg">
                                        {s.shortName}
                                        <ArrowUpRight aria-hidden className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                      </span>
                                      <span className="mt-0.5 block text-xs leading-snug text-muted">{s.headline}</span>
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 flex items-center justify-between rounded-xl bg-card px-4 py-3 text-sm">
                              <span className="text-muted">Not sure where to start?</span>
                              <Link href="/opportunity-finder" className="font-medium text-muted hover:text-fg">
                                Discover your AI advantage →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative block whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors xl:px-3.5", active ? "text-fg" : "text-body hover:text-fg")}
                  >
                    {item.label}
                    {active && <ActiveDot />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Magnetic>
            <ButtonLink href="/contact" size="sm" arrow>
              Let&apos;s Talk Growth
            </ButtonLink>
          </Magnetic>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-fg lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>{menuOpen && <MobileMenu pathname={pathname} />}</AnimatePresence>
    </header>
  );
}

function ActiveDot() {
  return (
    <motion.span
      layoutId="nav-active"
      aria-hidden
      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-electric via-aqua to-fresh"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    />
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [solutionsOpen, setSolutionsOpen] = useState(pathname.startsWith("/solutions"));
  return (
    <motion.nav
      id="mobile-menu"
      data-lenis-prevent
      aria-label="Mobile"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "calc(100dvh - 4.5rem)" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-y-auto border-t border-line bg-section lg:hidden"
    >
      <ul className="container-x flex flex-col py-6">
        {mainNav.map((item, i) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.04 }}
            className="border-b border-line"
          >
            {item.children ? (
              <>
                <div className="flex items-center justify-between">
                  <Link href={item.href} className={cn("block py-4 font-display text-2xl", isActive(pathname, item.href) ? "text-gradient" : "text-fg")}>
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    className="rounded-full p-2 text-body"
                    aria-expanded={solutionsOpen}
                    aria-label="Toggle solutions list"
                    onClick={() => setSolutionsOpen((v) => !v)}
                  >
                    <ChevronDown aria-hidden className={cn("size-5 transition-transform", solutionsOpen && "rotate-180")} />
                  </button>
                </div>
                {solutionsOpen && (
                  <ul className="pb-4 pl-1">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className={cn("block py-2 text-base", pathname === c.href ? "text-muted" : "text-body")}>
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn("block py-4 font-display text-2xl", isActive(pathname, item.href) ? "text-gradient" : "text-fg")}
              >
                {item.label}
              </Link>
            )}
          </motion.li>
        ))}
      </ul>
      <div className="container-x pb-10">
        <ButtonLink href="/contact" size="lg" arrow className="w-full">
          Let&apos;s Talk Growth
        </ButtonLink>
      </div>
    </motion.nav>
  );
}
