import type { Config } from "tailwindcss";
import { colors } from "./lib/design-tokens";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design token colors
        brand: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          neutral: colors.neutral,
        },
        // Keep existing theme colors
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
} as Config & {
  daisyui?: {
    themes: Array<string | Record<string, Record<string, string>>>;
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    logs?: boolean;
  };
};

// DaisyUI configuration using design tokens
(config as any).daisyui = {
  themes: [
    {
      pdfmerger: {
        "primary": colors.primary,      // Soft blue-gray
        "secondary": colors.secondary,  // Warm beige
        "accent": colors.accent,        // Muted brown
        "neutral": colors.neutral,      // Dark burgundy
        "base-100": colors.white,       // White background
        "base-200": colors.offWhite,    // Slate-50
        "base-300": colors.border,      // Slate-200
        "info": colors.info,            // Same as primary
        "success": colors.success,      // Emerald-500
        "warning": colors.warning,      // Amber-500
        "error": colors.error,          // Red-500
      },
    },
  ],
  base: true,      // Apply base styles
  styled: true,    // Include component styles
  utils: true,     // Include utility classes
  logs: false,     // Disable logs
};

export default config;
