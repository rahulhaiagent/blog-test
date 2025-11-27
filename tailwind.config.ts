import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Professional, subdued color palette
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1d20',
        },
        accent: {
          50: '#e6f4ff',
          100: '#b3e0ff',
          200: '#80ccff',
          300: '#4db8ff',
          400: '#1aa3ff',
          500: '#0077cc',
          600: '#0066b3',
          700: '#005599',
          800: '#004480',
          900: '#003366',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            color: '#2e364e',
            lineHeight: '1.41',
            fontSize: '17px',
            a: {
              color: '#0077cc',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: '#005599',
                textDecoration: 'underline',
              },
            },
            h1: {
              color: '#1a1d20',
              fontWeight: '700',
              fontSize: '2.25rem',
              marginTop: '0',
              marginBottom: '1.5rem',
              lineHeight: '1.2',
            },
            h2: {
              color: '#212529',
              fontWeight: '600',
              fontSize: '1.875rem',
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
              lineHeight: '1.3',
            },
            h3: {
              color: '#343a40',
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              lineHeight: '1.4',
            },
            h4: {
              color: '#495057',
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1.75rem',
              marginBottom: '0.75rem',
            },
            h5: {
              color: '#495057',
              fontWeight: '600',
              fontSize: '1.125rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            h6: {
              color: '#6c757d',
              fontWeight: '600',
              fontSize: '1rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
            },
            strong: {
              color: '#212529',
              fontWeight: '600',
            },
            code: {
              color: '#0077cc',
              backgroundColor: '#e6f4ff',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1a1d20',
              color: '#e9ecef',
              padding: '1.25rem 1.5rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
              fontSize: '0.875rem',
              lineHeight: '1.7',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              fontSize: 'inherit',
              fontWeight: '400',
            },
            ul: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.625rem',
            },
            ol: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.625rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            blockquote: {
              fontStyle: 'italic',
              color: '#495057',
              borderLeftColor: '#dee2e6',
              borderLeftWidth: '0.25rem',
              paddingLeft: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;

