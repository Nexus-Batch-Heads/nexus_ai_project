'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { HiOutlineHome, HiOutlineCpuChip, HiOutlineBeaker, HiOutlineChatBubbleLeftRight, HiOutlineArrowRightOnRectangle, HiOutlineBars3, HiOutlineXMark, HiOutlineSun, HiOutlineMoon, HiOutlineComputerDesktop } from 'react-icons/hi2';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { href: '/twin', label: 'My Twin', icon: HiOutlineCpuChip },
  { href: '/simulator', label: 'Simulator', icon: HiOutlineBeaker },
  { href: '/chat', label: 'Chat', icon: HiOutlineChatBubbleLeftRight },
];

const themeIcons = {
  dark: HiOutlineMoon,
  light: HiOutlineSun,
  system: HiOutlineComputerDesktop,
};

const themeLabels = {
  dark: 'Dark Mode',
  light: 'Light Mode',
  system: 'System Default',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const ThemeIcon = themeIcons[theme];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-neon-cyan/30 transition-all duration-300">
                <span className="text-dark-900 font-bold text-sm">NX</span>
              </div>
              <span className="font-display font-bold text-lg gradient-text hidden sm:block group-hover:text-glow-cyan transition-all duration-300">Nexus AI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-neon-cyan/10 text-neon-cyan'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* User section */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme toggle */}
              <motion.button
                onClick={cycleTheme}
                className="p-2 rounded-xl text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 relative"
                title={themeLabels[theme]}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThemeIcon className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <div className="text-right">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold text-white">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 transition-all"
                title="Logout"
              >
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile theme toggle */}
              <motion.button
                onClick={cycleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-neon-cyan transition-all"
                title={themeLabels[theme]}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThemeIcon className="w-5 h-5" />
                </motion.div>
              </motion.button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white"
              >
                {mobileOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neon-pink hover:bg-neon-pink/10 w-full"
                >
                  <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
