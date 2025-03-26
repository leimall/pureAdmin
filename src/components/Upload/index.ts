import uploadImage from "./src/index.vue";

import { withInstall } from "@pureadmin/utils";

/** 支持`Tooltip`提示的文本省略组件 */
export const UploadImage = withInstall(uploadImage);

export default UploadImage;
