import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{html,ts}',
    './src/**/**/*.{html,ts}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};

export default config;
