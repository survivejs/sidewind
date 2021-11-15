import * as twindColors from "https://cdn.skypack.dev/twind@0.16.16/colors?min";
import twindTypography from "https://cdn.skypack.dev/@twind/typography@0.0.2?min";

export default {
  theme: { extend: { colors: twindColors } },
  plugins: {
    ...twindTypography(),
    btn: `font-bold py-2 px-4 rounded`,
    "btn-blue": `bg-blue-500 hover:bg-blue-700 text-white`,
    "btn-muted": `font-light text-gray-500`,
  },
};
