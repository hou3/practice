import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import arrayToTree from '@/utils/arrayToTree';
import { FuncApi } from "@/api";

export default defineStore('func', () => {
    let isInit: boolean = false;  //初始值
    let allFuncs = reactive<Array<Vm.Func>>([]);  //当前系统的所有功能,非常关键：功能管理和角色功能分配都要用到它
    const allFuncstreeData = computed<Array<Vm.FuncNode>>(() => {
        return [{
            func_id: 0, func_name: "ROOT", func_key: "", func_fid: -1,
            children: arrayToTree(allFuncs, "func_id", "func_fid")
        }];
    });
    // 初始化
    const init = async () => {
        if (isInit) return;
        allFuncs.push(...await FuncApi.getAll())
        isInit = true;
    }
    // 删除
    const remove = async (func_id: number) => {
        try {
            // 发送ajax从数据库中删除
            await FuncApi.remove(func_id);
            // 从allFuncs中删除功能，更新页面
            await allFuncs.splice(allFuncs.findIndex(item => item.func_id === func_id), 1);
        } catch (e) {/**/ }
    };
    // 新增
    const add = async (model: HttpPayload.Func) => {
        const func_id = await FuncApi.add(model);
        allFuncs.push({ ...model, func_id });
    };
    // 修改
    const update = async (model: HttpPayload.Func) => {
        await FuncApi.updata(model);
        const i = allFuncs.findIndex(item => item.func_id === model.func_id);
        allFuncs.splice(i, 1, { ...model })
    };

    return { allFuncs, allFuncstreeData, remove, add, update, init }
});

