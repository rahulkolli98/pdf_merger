/**
 * Footer Component
 * Application footer with information and links
 */

'use client';

import Link from 'next/link';
import { colors } from '@/lib/design-tokens';
import { config } from '@/lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 border-t border-base-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <svg 
                  className="w-5 h-5 text-white"
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
              <h3 className="font-bold text-lg" style={{ color: colors.neutral }}>
                {config.app.name}
              </h3>
            </div>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Free online tool to merge PDF files quickly and securely. 
              All processing happens locally in your browser.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="font-semibold text-base mb-3" style={{ color: colors.neutral }}>
              Features
            </h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li className="flex items-center gap-2">
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: colors.success }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                No registration required
              </li>
              <li className="flex items-center gap-2">
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: colors.success }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                100% free forever
              </li>
              <li className="flex items-center gap-2">
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: colors.success }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                Files processed locally
              </li>
              <li className="flex items-center gap-2">
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: colors.success }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                No file size limits
              </li>
            </ul>
          </div>

          {/* Privacy & Security Section */}
          <div>
            <h4 className="font-semibold text-base mb-3" style={{ color: colors.neutral }}>
              Privacy & Security
            </h4>
            <p className="text-sm text-base-content/70 leading-relaxed mb-3">
              Your privacy is our priority. All PDF files are processed entirely in your browser using JavaScript.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-base-100 border border-base-300">
              <svg 
                className="w-5 h-5 flex-shrink-0 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 20 20"
                style={{ color: colors.primary }}
              >
                <path 
                  fillRule="evenodd" 
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div>
                <p className="text-xs font-semibold" style={{ color: colors.neutral }}>
                  No Upload to Server
                </p>
                <p className="text-xs text-base-content/60">
                  Files never leave your device
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-base-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-base-content/60 text-center sm:text-left">
              © {currentYear} {config.app.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-base-content/60">
              <Link 
                href="/privacy" 
                className="hover:text-base-content transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link 
                href="/terms" 
                className="hover:text-base-content transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
