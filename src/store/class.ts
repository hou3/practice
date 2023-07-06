import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { ClassApi } from "@/api";

export default defineStore('class', () => {
    const isInit = ref<boolean>(false);
    let allClass = reactive<Array<Vm.Class>>([]);
    const init = async () => {
        if (isInit.value) return;
        allClass.push(...await ClassApi.getAll());
        isInit.value = true;
    }
/*     const add = async (model: HttpPayload.ClassEdit) => {
        const cls_id = await ClassApi.add(model);
        allClass.push({ ...model, cls_id });
    };
    const update = async (model: HttpPayload.ClassEdit) => {
        await ClassApi.update(model);
        const i = allClass.findIndex(item => item.cls_id = model.cls_id);
        allClass.splice(i, 1, { ...model });
    };
    const startClass = async (startModel: HttpPayload.ClassStart) => {
        const result = await ClassApi.start(startModel);
        const id = allClass.findIndex(item => item.cls_id === startModel.cls_id)
        allClass[id].cls_clsr_id = startModel.cls_clsr_id;
        allClass[allClass.findIndex(item => item.cls_id === startModel.cls_id)].cls_begin = result;
    }
    const endClass = async (id: number) => {
        const result = await ClassApi.end(id);
        allClass[allClass.findIndex(item => item.cls_id === id)].cls_end = result;
    } */
    return { allClass, init }
})