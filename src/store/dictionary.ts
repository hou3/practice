import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { UserApi } from "@/api";

export default defineStore("dictionary", () => {
    const dictionaryData = ref<Vm.Category[]>([]);

    onMounted(async () => {
        dictionaryData.value = await UserApi.getCategory();
    })

    return { dictionaryData }
})