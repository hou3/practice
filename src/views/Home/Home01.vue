<template>
    这是主页
</template>
<script setup lang="ts">
import { UserApi } from '@/api';
import { shallowRef, onMounted, computed } from 'vue';

const userFuncs = shallowRef<Array<Vm.Func>>([]);
const menuData = computed<Array<Vm.FuncNode>>(() => {
    // 递归辅助函数
    function updateFuncNodeChildren(funcNode: Vm.FuncNode) {
        let children = userFuncs.value.filter(func => func.func_fid === funcNode.func_id);
        // 如果没有 children就直接返回
        if (children.length === 0) return;
        funcNode.children = [];
        children.forEach(child => {
            let childFuncNode = { ...child };
            updateFuncNodeChildren(childFuncNode);
            funcNode.children?.push(childFuncNode);
        });
    }
    let result: Array<Vm.FuncNode> = [];
    const topFuncs = userFuncs.value.filter(func => func.func_fid === 0);
    topFuncs.forEach(topFunc => {
        let funcNode = { ...topFunc };
        // 更新顶级的数据 再进行push
        updateFuncNodeChildren(funcNode);
        result.push(funcNode);
    });
    return result;
});
onMounted(async () => userFuncs.value = await UserApi.getMenu());
</script>
  
<style lang="stylus">

</style>
  