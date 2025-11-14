/**
 * Header Component
 * Main navigation header with app branding and trust indicators
 */

'use client';

import Link from 'next/link';
import { colors } from '@/lib/design-tokens';
import { config } from '@/lib/config';
import { Badge } from '@/components/ui';

export function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-2xl blur-xl opacity-40" 
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div 
                className="relative p-2.5 rounded-2xl shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: colors.primary }}
              >
                <svg 
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 
                className="text-xl font-bold transition-colors"
                style={{ color: colors.primary }}
              >
                {config.app.name}
              </h1>
              <p className="text-xs text-gray-500">v{config.app.version}</p>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="#features" 
              className="text-sm font-medium text-gray-700 hover:opacity-70 transition-opacity"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium text-gray-700 hover:opacity-70 transition-opacity"
            >
              How It Works
            </Link>
            
            {/* Trust Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 20 20"
                style={{ color: colors.success }}
              >
                <path 
                  fillRule="evenodd" 
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span 
                className="text-xs font-semibold"
                style={{ color: colors.success }}
              >
                Files Stay Private
              </span>
            </div>

            {/* Free Badge */}
            <Badge variant="primary" size="md">
              100% Free
            </Badge>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: colors.neutral }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
