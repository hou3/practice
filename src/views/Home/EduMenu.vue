<script setup lang="ts">
import { shallowRef, onMounted, computed } from 'vue';
import { UserApi } from '@/api';
import EduMenuItem from './EduMenuItem.vue';
import { useDashboard } from '@/store';
import arrayToTree from '@/utils/arrayToTree';

const dashboard = useDashboard();
const userFuncs = shallowRef<Array<Vm.Func>>([]);
const menuData = computed<Array<Vm.FuncNode>>(() => {
    return arrayToTree(userFuncs.value,"func_id", "func_fid")
});
onMounted(async () => userFuncs.value = await UserApi.getMenu());

</script>

<template>
    <el-menu :default-active="dashboard.activeFunc" @select="index => dashboard.addTab(index)" background-color="#fcd3d3" active-text-color="#fef0f0">
        <EduMenuItem :items="menuData"></EduMenuItem>
    </el-menu>
</template>

<style scoped>

</style>