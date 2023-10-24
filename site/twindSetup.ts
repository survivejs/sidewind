import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix@1.0.5";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.1";
import presetTypography from "https://esm.sh/@twind/preset-typography@1.0.5";

export default {
  // mode: "silent",
  // theme: { extend: { colors: twindColors } },
  presets: [presetAutoprefix(), presetTailwind(), presetTypography()],
  plugins: {
    btn: `font-bold py-2 px-4 rounded`,
    "btn-blue": `bg-blue-500 hover:bg-blue-700 text-white`,
    "btn-muted": `font-light text-gray-500`,
  },
};

/*
import * as twindColors from "https://cdn.skypack.dev/twind@0.16.16/colors?min";

export default {
  mode: "silent",
  theme: { extend: { colors: twindColors } },
  plugins: {
    btn: `font-bold py-2 px-4 rounded`,
    "btn-blue": `bg-blue-500 hover:bg-blue-700 text-white`,
    "btn-muted": `font-light text-gray-500`,
  },
};
*/
