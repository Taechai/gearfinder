import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				'noise': "url('/noise.png')", // Path to your noise image

			},
			colors: {
				dark: '#004377',
				'light-dark': '#60B8C6',
				light: '#D9F4F7',
				'primary-light': '#E3F2FD',
				'primary-main': '#90CAF9',
				'primary-dark': '#42A5F7',
				'secondary-light': '#F4E4F5',
				'secondary-main': '#CE93D8',
				'secondary-dark': '#AB47BC',
				'success-light': '#81C784',
				'success-main': '#66BB6A',
				'success-dark': '#388E3C',
				'error-light': '#E57373',
				'error-main': '#F44336',
				'error-dark': '#D3302F',
				'warning-light': '#FFB74D',
				'warning-main': '#FFA726',
				'warning-dark': '#F47D02',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontSize: {
				sm: '11px',
				md: '13px',
				lg: '20px',
				xl: '35px'
			},
			spacing: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px'
			},
			screens: {
				'max-sm': {
					max: '639px'
				},
				'h-sm': {
					raw: '(min-height: 600px)'
				},
				'h-md': {
					raw: '(min-height: 900px)'
				},
				'h-lg': {
					raw: '(min-height: 1000px)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
