import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#dae2fd",
        "on-secondary-container": "#663500",
        "error": "#ba1a1a",
        "background": "#faf8ff",
        "on-error": "#ffffff",
        "on-tertiary-container": "#77859a",
        "surface-tint": "#565e74",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#131b2e",
        "inverse-primary": "#bec6e0",
        "on-tertiary-fixed": "#0d1c2e",
        "on-secondary-fixed-variant": "#6e3900",
        "tertiary-fixed-dim": "#b9c7df",
        "secondary-fixed": "#ffdcc3",
        "primary-container": "#131b2e",
        "outline": "#76777d",
        "on-secondary": "#ffffff",
        "outline-variant": "#c6c6cd",
        "inverse-surface": "#283044",
        "on-primary-fixed": "#131b2e",
        "tertiary": "#000000",
        "on-primary-fixed-variant": "#3f465c",
        "on-background": "#131b2e",
        "secondary": "#904d00",
        "on-secondary-fixed": "#2f1500",
        "on-primary-container": "#7c839b",
        "surface-container": "#eaedff",
        "surface-container-low": "#f2f3ff",
        "tertiary-fixed": "#d5e3fc",
        "primary-fixed-dim": "#bec6e0",
        "surface-bright": "#faf8ff",
        "error-container": "#ffdad6",
        "secondary-container": "#fe932c",
        "surface-container-highest": "#dae2fd",
        "on-primary": "#ffffff",
        "inverse-on-surface": "#eef0ff",
        "surface-dim": "#d2d9f4",
        "secondary-fixed-dim": "#ffb77d",
        "on-error-container": "#93000a",
        "primary": "#000000",
        "on-surface-variant": "#45464d",
        "on-tertiary-fixed-variant": "#3a485b",
        "surface-container-high": "#e2e7ff",
        "surface": "#faf8ff",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#0d1c2e",
        "primary-fixed": "#dae2fd"
      },
      fontFamily: {
        "headline": ["var(--font-noto-serif)", "serif"],
        "body": ["var(--font-inter)", "sans-serif"],
        "label": ["var(--font-inter)", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
    },
  },
  plugins: [],
}

export default config
