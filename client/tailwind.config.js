/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "surface-container-low": "#f6f3eb",
        "secondary-container": "#fd9849",
        "secondary": "#954a00",
        "on-tertiary": "#ffffff",
        "secondary-fixed-dim": "#ffb784",
        "inverse-primary": "#b7c6ee",
        "secondary-fixed": "#ffdcc6",
        "route-teal": "#2F8F82",
        "on-surface-variant": "#45464e",
        "on-secondary": "#ffffff",
        "background": "#fcf9f1",
        "on-tertiary-container": "#44a093",
        "ink-navy": "#1B2A4A",
        "primary-container": "#1b2a4a",
        "on-background": "#1c1c17",
        "on-primary-container": "#8392b7",
        "on-surface": "#1c1c17",
        "surface-container-highest": "#e5e2da",
        "on-secondary-fixed": "#301400",
        "surface-variant": "#e5e2da",
        "surface-container-lowest": "#ffffff",
        "primary": "#041534",
        "on-error-container": "#93000a",
        "slate": "#6B7280",
        "on-primary-fixed-variant": "#384668",
        "surface-container-high": "#ebe8e0",
        "paper": "#F7F4EC",
        "surface-bright": "#fcf9f1",
        "on-secondary-fixed-variant": "#713700",
        "inverse-on-surface": "#f3f1e9",
        "primary-fixed": "#d9e2ff",
        "on-secondary-container": "#6c3400",
        "tertiary-fixed": "#98f3e3",
        "on-primary": "#ffffff",
        "inverse-surface": "#31312b",
        "tertiary": "#001a17",
        "outline-variant": "#c5c6cf",
        "on-tertiary-fixed": "#00201c",
        "surface": "#fcf9f1",
        "surface-container": "#f1eee6",
        "surface-dim": "#dcdad2",
        "alert-coral": "#E85D4E",
        "surface-tint": "#4f5e81",
        "horizon-amber": "#E8873A",
        "tertiary-container": "#00312b",
        "on-primary-fixed": "#0a1a3a",
        "on-tertiary-fixed-variant": "#005048",
        "outline": "#75777f",
        "on-error": "#ffffff",
        "tertiary-fixed-dim": "#7cd6c7",
        "primary-fixed-dim": "#b7c6ee"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "stack-sm": "8px",
        "stack-lg": "24px",
        "margin-page": "24px",
        "stack-md": "16px",
        "gutter": "16px"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "caption": ["Inter", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "headline-sm": ["Space Grotesk", "sans-serif"],
        "data-mono-sm": ["IBM Plex Mono", "monospace"],
        "data-mono": ["IBM Plex Mono", "monospace"],
        "headline-lg": ["Space Grotesk", "sans-serif"]
      },
      fontSize: {
        "body-md": ["15px", { "lineHeight": "22px", "fontWeight": "400" }],
        "caption": ["13px", { "lineHeight": "18px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "0.01em", "fontWeight": "700" }],
        "headline-sm": ["18px", { "lineHeight": "26px", "fontWeight": "600" }],
        "data-mono-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
        "data-mono": ["14px", { "lineHeight": "20px", "fontWeight": "500" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "0.02em", "fontWeight": "700" }]
      }
    }
  },
  plugins: []
};
