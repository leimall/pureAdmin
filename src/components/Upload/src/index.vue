<template>
  <div>
    <el-upload
      :action="`${getBaseUrl()}/api/mall/product/image/${props.productId}`"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :before-upload="beforeImageUpload"
      :multiple="false"
      :on-error="handleImageError"
    >
      <el-button type="primary" :loading="isLoading"> 上传商品图 </el-button>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImageCompress from "@/utils/image";
import { ElMessage, ElUpload, ElButton } from "element-plus";
import { getBaseUrl } from "@/utils/format";

defineOptions({
  name: "UploadImage"
});

const emit = defineEmits(["on-success"]);
const props = defineProps({
  imageUrl: {
    type: String,
    default: ""
  },
  fileSize: {
    type: Number,
    default: 1024
  },
  maxWH: {
    type: Number,
    default: 1920
  },
  productId: {
    type: String,
    default: ""
  }
});

const isLoading = ref(false);

const beforeImageUpload = async file => {
  isLoading.value = true;
  try {
    const isJPG = file.type === "image/jpeg";
    const isPng = file.type === "image/png";
    if (!isJPG && !isPng) {
      ElMessage.error("上传头像图片只能是 jpg或png 格式!");
      isLoading.value = false;
      return false;
    }

    const isRightSize = file.size / 1024 < props.fileSize;
    if (!isRightSize) {
      const compress = new ImageCompress(file, props.fileSize, props.maxWH);
      return await compress.compress();
    }
    return true;
  } catch (error) {
    console.error("文件处理失败:", error);
    ElMessage.error("文件处理失败");
    isLoading.value = false;
    return false;
  }
};

const handleImageSuccess = res => {
  isLoading.value = false;
  const { data } = res;
  if (data.file) {
    emit("on-success", data.file.url);
  }
};

const handleImageError = error => {
  isLoading.value = false;
  ElMessage.error("上传失败");
  console.error("上传错误:", error);
};
</script>
