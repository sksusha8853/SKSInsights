const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,css}',
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin(),require('tailwind-scrollbar'),],
}
