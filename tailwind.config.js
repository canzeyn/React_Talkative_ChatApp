// /** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screen:{
        'xs':'300px',
        'sm':'450px',
        '2sm':'600px',
        'md':'750px',
        'lg':'900px',
        'xl':'1150px',
        '2xl':'1400px'
      },
      cursor: ['disabled'],

      spacing:{
            'messageInputXl':'700px',
            'messageInputLg':'600',
            'messageInputMd':'500px',
            'messageInput2Sm':'400px',
            'messageInputSm':'300px',
            'messageInputXs':'200px'
      },
    },
  },
  plugins: [],
});







































































































