<script setup lang="ts">
interface Props{
    items:Array<Vm.FuncNode>
}
const props = defineProps<Props>();
</script>

<template>
    <template v-for="item in props.items">
        <el-sub-menu v-if="item.children" :index="item.func_id.toString()">
            <template #title>
                <span>{{ item.func_name }}</span>
            </template>
            <EduMenuItem :items="item.children"></EduMenuItem>
        </el-sub-menu>
        <el-menu-item v-else :index="`${item.func_key}&&${item.func_name}`">
            <span>{{ item.func_name }}</span>
        </el-menu-item>
    </template>
</template>

<style scoped>

</style>