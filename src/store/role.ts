import {defineStore} from 'pinia';
import {reactive} from 'vue';
import {RoleApi} from '@/api';

export default defineStore("role",() => {
    let isInit: boolean = false;
    const allRoles = reactive<Array<Vm.Role>>([]);

    const init = async() => {//初始化数据
        if(isInit) return;
        allRoles.push(...await RoleApi.getAll());
        isInit = true;
    };

    const remove = async(role_id:number) => {
        await RoleApi.remove(role_id);
        const i = allRoles.findIndex(item => item.role_id === role_id);
        allRoles.splice(i,1);
    };

    const add = async(model:HttpPayload.Role) => {
        const role_id = await RoleApi.add(model);
        allRoles.push({...model, role_id});
    };

    const update = async(model:HttpPayload.Role) => {
        await RoleApi.update(model);
        const i = allRoles.findIndex(item => item.role_id = model.role_id);
        allRoles.splice(i,1,{...model});
    };

    const roleFuncConfig = async(data: HttpPayload.RoleFunc) => {
        await RoleApi.roleFuncConfig(data);
    };

    const getRoleFuncs = async(role_id: number) => {
        const roleFuncs = await RoleApi.getRoleFuncs(role_id);
        return roleFuncs;
    }; 

    return {allRoles,isInit,init,remove,add,update,roleFuncConfig,getRoleFuncs};
});