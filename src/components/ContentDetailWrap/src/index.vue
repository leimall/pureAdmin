<script setup lang="ts">
import { ElCard } from "element-plus";
import { useDesign } from "@/hooks/web/useDesign";

defineOptions({
  name: "ContentDetailWrap"
});

const { getPrefixCls } = useDesign();

const prefixCls = getPrefixCls("content-detail-wrap");
</script>

<template>
  <div :class="[`${prefixCls}-container`, 'relative']">
    <ElCard :class="[`${prefixCls}-body`, 'mb-20px']" shadow="never">
      <div
        class="mb-20px pb-20px"
        style="border-bottom: 1px solid var(--el-border-color)"
      >
        <slot name="header" />
      </div>
      <slot />
    </ElCard>
  </div>
</template>
