/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      boxShadow: {
        bottom: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px',
        card: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
      container: {
        center: true,
        padding: '2rem',
      },
    },
  },
}

export default config
