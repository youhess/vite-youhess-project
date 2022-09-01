<template>
    <div>
        <div class="StatusTag" :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
            <div :class="type"></div>
            <div>{{ txt }}</div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "StatusTag"
};
</script>

<script setup lang="ts">
withDefaults(
    defineProps<{
        type?: string;
        txt?: string;
    }>(),
    {
        type: 'peddingTag',
        txt: ''
    }
);
</script>

<style lang="scss" scoped>
.successTag {
    width: 9px;
    height: 9px;
    background: #67c23a;
    margin-right: 5px;
}

.peddingTag {
    width: 9px;
    height: 9px;
    background: #1678ff;
    margin-right: 5px;
}

.rejectTag {
    width: 9px;
    height: 9px;
    background: #f56c6c;
    margin-right: 5px;
}

.warningTag {
    width: 9px;
    height: 9px;
    background: #E6A23C;
    margin-right: 5px;
}

.infoTag {
    width: 9px;
    height: 9px;
    background: #909399;
    margin-right: 5px;
}
</style>
