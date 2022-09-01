<template>
  <div :class="isFixed ? 'sticky-fix' : ''" :style="{top:'0px',minHeight:isHeight,backgroundColor:isColor}">
    <div class="sticky-bg">
      <div class="sticky-title">
        <slot name="left" />
      </div>
      <div class="sticky-desc">
        <slot name="desc" />
      </div>
      <div style="flex: 1; text-align: right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Sticky"
};
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isFixed?: boolean;
    isHeight?:string;
    isColor?:string;
  }>(),
  {
    isFixed: true, //默认固定在顶部,
    isHeight:'54px',
    isColor:"rgb(237, 245, 255)"
  }
);
</script>

<style>
.sticky-bg{
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 54px;
}
.sticky-fix {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0 40px 0 40px ;
}
</style>
