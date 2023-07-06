import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { ClassRoomApi } from "@/api";

export default defineStore('classroom', () => {
    const isInit = ref<boolean>(false);
    let allClrs = reactive<Array<Vm.ClassRoom>>([]);//全部教室

    const init = async () => {
        if (isInit.value) return;
        allClrs.push(...await ClassRoomApi.getAll());
        isInit.value = true;
    }

    const add = async (model: HttpPayload.GetClassRoom) => {
        const clsr_id = await ClassRoomApi.add(model);
        await allClrs.push({ ...model, clsr_id });
    }
    const update = async (model: HttpPayload.GetClassRoom) => {
        await ClassRoomApi.update(model);
        await allClrs.splice(allClrs.findIndex(item => item.clsr_id === model.clsr_id), 1, { ...model });
    }
    const remove = async (clsr_id: number) => {
        try {
            await ClassRoomApi.remove(clsr_id);
            await allClrs.splice(allClrs.findIndex(item => item.clsr_id === clsr_id), 1);
        } catch (e) {/**/ }
    }
    return { allClrs, init, add, update, remove };
})