import { defineStore } from 'pinia';
import { reactive } from 'vue';

export default defineStore("staff", () => {
    let isInit: boolean = false;
    const allStaffs = reactive<Array<Vm.Staff>>([]);
    const init = async () => {
        if (isInit) return;
        isInit = true;
    }
    return {}
})