<template>
    <el-tree class="custom-tree" :data="func.allFuncstreeData" :props="{ children: 'children' }" default-expand-all>
        <template #default="{ data, data: { func_name, func_id, func_key, children } }">
            <div class="custom-tree-node">
                <span :class="{ leaf: func_key !== '' }">
                    <el-icon style="vertical-align: bottom;" v-if="func_key !== ''" :size="18">
                        <Paperclip />
                    </el-icon>
                    {{ func_name }}
                </span>
                <span>
                    <el-button text v-if="func_key === ''" @click="beginAdd(data)" :icon="Plus">add</el-button>
                    <el-button text v-if="![0, 1, 2].includes(func_id)" @click="beginUpdata(data)"
                        :icon="Edit">edit</el-button>
                    <el-button text v-if="![0, 1, 2].includes(func_id)" :disabled="func_key === '' && children"
                        @click="removeHandler(func_id)" :icon="Delete">delete</el-button>
                </span>
            </div>
        </template>
    </el-tree>

    <el-dialog title="功能编辑" v-model="isEdit">
        <el-form>
            <el-form-item label="功能类型：">
                <el-radio-group v-model="isLeaf"
                    :disabled="model.func_id !== 0 && model.func_key === '' && func.allFuncs.some(item => item.func_fid === model.func_id)">
                    <el-radio :label="false">非叶子功能</el-radio>
                    <el-radio :label="true">叶子功能</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="父级功能：">
                <el-cascader :disabled="model.func_id === 0" v-model="model.func_fid" :options="noLeafFuncsTreeData"
                    :props="{ label: 'func_name', value: 'func_id', children: 'children', checkStrictly: true, emitPath: false }">

                </el-cascader>
            </el-form-item>
            <el-form-item label="功能名称：">
                <el-input placeholder="请输入功能名称..." v-model.trim="model.func_name"></el-input>
            </el-form-item>
            <el-form-item label="绑定组件名称：" v-if="isLeaf">
                <el-select v-model="model.func_key">
                    <el-option label="-请选择-" value=""></el-option>
                    <el-option v-for="item in Object.keys(dashboard.funcMap)" :key="item" :label="item"
                        :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="save">确定</el-button>
                <el-button @click="isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDashboard, useFunc } from '@/store';
import arrayToTree from '@/utils/arrayToTree';
import { Plus, Edit, Delete, Paperclip } from '@element-plus/icons-vue'
import { FuncApi } from '@/api';

const dashboard = useDashboard();
const func = useFunc();
const isEdit = ref<boolean>(false);
// 是否是叶子
const isLeaf = ref<boolean>(false);
// 收集数据
const model = reactive<HttpPayload.Func>({ func_id: 0, func_name: "", func_key: "", func_fid: -1 })


const noLeafFuncsTreeData = computed<Array<Vm.FuncNode>>(() => {
    return [{
        func_id: 0, func_name: "ROOT", func_key: "", func_fid: -1,
        children: arrayToTree(func.allFuncs.filter(item => item.func_key === ''), "func_id", "func_fid")
    }];
});
watch(isLeaf, newValue => { if (!newValue) model.func_key = ""; })
onMounted(async () => {
    try {
        func.init()
    } catch (e) {/*  */ }
});
const removeHandler = async (func_id: number) => {
    try {
        // 问用户是不是确定删除
        await ElMessageBox.confirm('真的删除吗？', '提示', { type: "warning" })
        // 通知func仓库去执行删除操作
        await func.remove(func_id);
        // 提示删除成功
        ElMessage({ type: "success", message: "成功删除" });
    } catch (e) {/*  */ }

};
const beginAdd = (func: Vm.Func) => {
    model.func_id = 0;
    model.func_name = "";
    model.func_key = "";
    model.func_fid = func.func_id;
    isEdit.value = false;
    isEdit.value = true;
};
const beginUpdata = (func: Vm.Func) => {
    model.func_id = func.func_id;
    model.func_name = func.func_name;
    model.func_key = func.func_key;
    model.func_fid = func.func_fid;
    isEdit.value = func.func_key !== "";
    isEdit.value = true;
};
const save = async () => {
    try {
        if (model.func_id === 0) {
            const func_id = await FuncApi.add(model);
            func.allFuncs.push({ ...model, func_id });
        } else {
            await FuncApi.updata(model)
            const i = func.allFuncs.findIndex(item => item.func_id === model.func_id)
            func.allFuncs.splice(i, 1, { ...model })
        }
        isEdit.value = false;
        ElMessage({ type: "success", message: "功能编辑成功" })
    } catch (e: any) {
        ElMessage({ type: "error", message: e.message })
    }
};
</script>

<style scoped lang="stylus">
.el-tree
    width:800px
    .custom-tree-node
        flex-grow:1
        display:flex
        justify-content:space-between
        align-items: center


</style>