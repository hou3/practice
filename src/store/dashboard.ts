
import { defineStore } from 'pinia';//定义仓库 提取出来defineStore
import {defineAsyncComponent, markRaw, reactive, ref } from 'vue';

// defineStore 这个函数返回 “一个可以得到仓库的函数”
export default defineStore("dashboard", () => {
    // 地址管理
    const funcMap = markRaw({
        classroom : defineAsyncComponent( () => import("@/views/Classroom/Classroom.vue")),
        staff : defineAsyncComponent( () => import("@/views/Staff/Staff.vue")),
        func: defineAsyncComponent( () =>  import("@/views/Func/Func.vue")),
        roleFunc: defineAsyncComponent( () =>  import("@/views/RoleFunc/RoleFunc.vue")),
        userRole: defineAsyncComponent( () =>  import("@/views/UserRole/UserRole.vue")),
        student: defineAsyncComponent( () =>  import("@/views/Student/Student.vue")),
        class: defineAsyncComponent( () =>  import("@/views/Class/Class.vue")),
        changePwd: defineAsyncComponent( () =>  import("@/views/ChangePwd/ChangePwd.vue"))
    });


    const tabs = reactive<Array<string>>([]);
    const activeFunc = ref<string>("")
    // activeFunc 存放一会渲染出来的addTab
    const addTab = (menuItemIndex: string) => {
        if (tabs.indexOf(menuItemIndex) === -1) {
            tabs.push(menuItemIndex)
        }
        activeFunc.value = menuItemIndex;
    };
    const removeTab = (tabName: string) => {
        const i: number = tabs.indexOf(tabName);
        tabs.splice(i, 1);
        if (tabName !== activeFunc.value) { }
        else if (tabs.length === 0) activeFunc.value = "";
        else if (i > 0) activeFunc.value = tabs[i - 1];
        else activeFunc.value = tabs[0]
    }

    return { funcMap, tabs, activeFunc, addTab, removeTab }
});
