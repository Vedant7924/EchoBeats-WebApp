/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2ee6c4', // Electric Neon Cyan
                accent: '#a78bfa',  // Soft Cosmic Violet
                surface: '#08080d', // Ultra Dark Background
                card: '#12121e',    // Glass Surface
                secondary: '#181828',
                grayText: '#94a3b8',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'equalizer': 'equalizer 1s ease-in-out infinite alternate',
            },
            keyframes: {
                equalizer: {
                    '0%': { height: '20%' },
                    '100%': { height: '100%' }
                }
            }
        },
    },
    plugins: [],
}
