import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix@1.0.5";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.1";

export default {
  presets: [presetAutoprefix(), presetTailwind()],
  plugins: {
    btn: `font-bold py-2 px-4 rounded`,
    "btn-blue": `bg-blue-500 hover:bg-blue-700 text-white`,
    "btn-muted": `font-light text-gray-500`,
  },
};
