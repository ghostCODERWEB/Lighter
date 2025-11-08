import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/account-check", label: "Account Check", disabled: true },
  { to: "/stats", label: "Lighter Stats", disabled: true },
  { to: "/announcements", label: "Announcements", disabled: true },
  { to: "/points", label: "Points Calculator" },
  { to: "/funding", label: "Funding" },
];

const baseLinkCls =
  "relative px-3 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

function SoonBadge() {
  return (
    <motion.span
      className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 px-1.5 py-[1px] text-[8px] font-semibold uppercase tracking-wide text-white shadow-sm opacity-70"
      initial={{ opacity: 0, scale: 0.3, y: -2 }}
      animate={{ opacity: 0.7, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      Soon
    </motion.span>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false); // mobile nav

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    mass: 0.2,
  });

  return (
    <header className="sticky top-0 z-40">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX }}
        className="origin-left h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
      />

      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Left: Brand + Desktop Nav */}
            <div className="flex items-center gap-6">
              {/* Brand */}
              <Link to="/" className="group inline-flex items-center gap-2">
                <motion.span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-sm"
                  initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  {/* Logo */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 overflow-visible"
                    role="img"
                    aria-label="Lighter logo"
                  >
                    <defs>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Tall bar */}
                    <motion.polygon
                      points="8,22 12,20 12,1 8,3"
                      fill="white"
                      filter="url(#glow)"
                      initial={{ y: 0, rotate: -0.5, opacity: 0.95 }}
                      animate={{ y: [0, -0.8, 0], rotate: [-0.5, 0.5, -0.5] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 3.2,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Short bar */}
                    <motion.polygon
                      points="15,20 18,18.6 18,8.6 15,10"
                      fill="white"
                      filter="url(#glow)"
                      initial={{ y: 0, rotate: 0.6, opacity: 0.95 }}
                      animate={{ y: [0, -1.2, 0], rotate: [0.6, -0.6, 0.6] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 2.6,
                        ease: "easeInOut",
                        delay: 0.15,
                      }}
                    />
                  </svg>
                </motion.span>

                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                  LighterScope
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="relative hidden lg:flex items-center gap-1">
                <motion.div
                  key="underline-anchor"
                  layoutId="nav-underline"
                  className="absolute bottom-0 h-[2px] rounded-full bg-blue-500/70"
                  initial={false}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.18 }}
                  style={{ opacity: 0 }}
                />
                {NAV.map((item) =>
                  item.disabled ? (
                    <div
                      key={item.to}
                      className={`${baseLinkCls} relative cursor-not-allowed text-gray-400 dark:text-gray-500 select-none`}
                    >
                      <span className="relative inline-flex items-center">
                        <span className="px-1">{item.label}</span>
                        <SoonBadge />
                      </span>
                    </div>
                  ) : (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `${baseLinkCls} ${isActive
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <span className="relative inline-flex items-center">
                          <span className="px-1">{item.label}</span>
                          {isActive && (
                            <motion.span
                              layoutId="nav-underline"
                              className="absolute -bottom-1 left-1 right-1 h-[2px] rounded-full bg-blue-500/80"
                              transition={{ type: "tween", ease: "easeOut", duration: 0.18 }}
                            />
                          )}
                        </span>
                      )}
                    </NavLink>
                  )
                )}
              </nav>
            </div>

            {/* Right: only burger (no theme toggle) */}
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <AnimatePresence initial={false} mode="wait">
                  {open ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet drawer */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                key="drawer"
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.18 }}
                className="lg:hidden absolute left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95"
              >
                <div className="px-4 pb-4 pt-2">
                  <nav className="grid gap-1">
                    {NAV.map((item) =>
                      item.disabled ? (
                        <div
                          key={item.to}
                          className={`${baseLinkCls} relative flex items-center text-gray-400 dark:text-gray-500 cursor-not-allowed select-none`}
                        >
                          <span className="relative inline-flex items-center">
                            <span className="px-1">{item.label}</span>
                            <SoonBadge />
                          </span>
                        </div>
                      ) : (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `${baseLinkCls} ${isActive
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <span className="relative inline-flex items-center w-full">
                              {isActive && (
                                <motion.span
                                  layoutId="mobile-nav-underline"
                                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500/70"
                                  transition={{ type: "tween", ease: "easeOut", duration: 0.18 }}
                                />
                              )}
                              <span>{item.label}</span>
                            </span>
                          )}
                        </NavLink>
                      )
                    )}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
