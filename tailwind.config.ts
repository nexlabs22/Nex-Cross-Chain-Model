import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        whiteBackground:{
          500: "#F2F2F2"
        },
        whiteText:{
          500: "#F2F2F2"
        },
        blackText:{
          500: "#2A2A2A"
        },
        colorOne: {
          500: "#91AC9A"
        },
        colorTwo: {
          500: "#A9C3B6"
        },
        colorThree: {
          500: "#B7D1D3"
        },
        colorFour: {
          500: "#8FB8CA"
        },
        colorFive: {
          500: "#A6C3CE"
        },
        colorSix: {
          500: "#CEDFDF"
        },
        colorSeven: {
          500: "#5E869B"
        },
        lightBlueBackground:{
          500: "#86afbfe6"
        },
        nexLightGreen: {
          500: "#089981",
        },
        nexLightRed:{
          500: "#F23645"
        }
      }
    },
  },
  plugins: [require("daisyui")],
}
export default config
