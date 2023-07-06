<template>
    <el-row :gutter="20">
        <el-col :span="6" v-for="role in roleStore.allRoles" :key="role.role_id">
            <el-card>
                <div>
                    <el-icon>
                        <user />
                    </el-icon>
                    <span>{{ role.role_name }}</span>
                </div>
                <div class="btn-wrapper">
                    <el-button @click="beginUpdate(role)">编辑</el-button>
                    <el-button @click="beginRoleFuncConfig(role.role_id)">功能分配</el-button>
                    <el-button @click="remove(role)">删除</el-button>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card @click="beginAdd">
                <div>+</div>
            </el-card>
        </el-col>
    </el-row>
    <el-dialog v-model="roleEdit.isEdit" title="角色编辑">
        <el-form :model="roleEdit.model" :rules="roleEdit.rules" :ref="(el: any) => roleEdit.formRef = el">
            <el-form-item label="角色名称:" prop="role_name">
                <el-input v-model.trim="roleEdit.model.role_name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="save">确定</el-button>
                <el-button @click="roleEdit.isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-drawer v-model="roleFuncConfig.isEdit" title="角色功能数据">
        <el-tree :ref="(el: any) => roleFuncConfig.treeRef = el" node-key="func_id" show-checkbox default-expand-all
            class="custom-tree" :data="funcStore.allFuncstreeData" :props="{ children: 'children' }"
            :expand-on-click-node="false">
            <template #default="{ data: { func_name, func_key } }">
                <div class="custom-tree-node">
                    <span :class="{ leaf: func_key !== -1 }">
                        <el-icon v-if="func_key !== ''" :size="20" color="#337ecc">
                            <Paperclip />
                        </el-icon>
                        {{ func_name }}
                    </span>
                </div>
            </template>
        </el-tree>
        <template #footer>
            <el-button @click="saveRoleFuncConfig">确定</el-button>
            <el-button @click="roleFuncConfig.isEdit = false">取消</el-button>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
//所有的角色展现出来
import { onMounted, reactive, nextTick, markRaw, Raw } from 'vue';
import { useRoleStore, useFunc } from '@/store';
import { ElMessage, ElMessageBox, FormRules, FormInstance, ElTree } from 'element-plus';
//use要用的api仓库
const roleStore = useRoleStore();
const funcStore = useFunc();
//当前组件用到的数据
const roleEdit = reactive<{ isEdit: boolean; model: HttpPayload.Role; formRef: null | FormInstance; rules: FormRules }>({
    isEdit: false,
    model: { role_id: 0, role_name: "" },
    formRef: null,
    rules: markRaw({
        role_name: [
            {
                validator: (type, value, callback) => {
                    if (value === '')   //非空验证
                        callback(new Error("* 角色名不能为空"));
                    else if (value.length < 2 || value.length > 20)  //长度验证
                        callback(new Error("* 角色名长度2 - 20"));
                    else if (roleStore.allRoles.some(role => role.role_name === value && role.role_id !== roleEdit.model.role_id))  //唯一性验证
                        callback(new Error("* 角色名已存在"));
                    else
                        callback();
                },
                trigger: "blur"
            }
        ]
    })
})

const roleFuncConfig = reactive<{
    isEdit: boolean;
    treeRef: InstanceType<typeof ElTree> | null,
    model: Raw<HttpPayload.RoleFunc>
}>({
    isEdit: false,
    treeRef: null,
    model: markRaw({
        role_id: 19,        //点这个角色进行功能分配时再立即赋值更新
        role_func_ids: ""   //点保存的时候再现去从tree里搜集
    })
});
//当前组件用到的方法
onMounted(() => {
    try {
        roleStore.init();
        funcStore.init();
    } catch (e) {/**/ }
});

const remove = async (role: Vm.Role) => {
    try {
        await ElMessageBox.confirm(`确定要删除角色: ${role.role_name} 吗? `, '提示', { type: "warning" });
        await roleStore.remove(role.role_id);
        ElMessage({ type: "success", message: `角色: ${role.role_name} 删除成功..` })
    } catch (e) {/**/ }
};

const beginAdd = () => {
    roleEdit.formRef?.resetFields();
    roleEdit.model = { role_id: 0, role_name: "" };
    nextTick(() => roleEdit.isEdit = true);
}

const beginUpdate = (role: Vm.Role) => {
    roleEdit.formRef?.resetFields();
    roleEdit.model = { ...role };
    nextTick(() => roleEdit.isEdit = true);
}

const save = async () => {
    try {
        await roleEdit.formRef?.validate();
        await roleStore[roleEdit.model.role_id === 0 ? "add" : "update"](roleEdit.model);
        ElMessage({ type: "success", message: "角色编辑成功" });
        roleEdit.isEdit = false;
    } catch (e) {/**/ }
};

const beginRoleFuncConfig = async (role_id: number) => {
    try {
        //传来的role_id保存在roleFuncConfig的model中的role_id
        roleFuncConfig.model.role_id = role_id;
        //发送ajax：获取点击的觉得功能，在tree上回显
        const roleFuncs: Array<Vm.Func> = await roleStore.getRoleFuncs(role_id)
        //存放叶子节点的id
        const checkedKeys: Array<number> = roleFuncs.reduce((result: Array<number>, item) => {
            if (item.func_key !== "") result.push(item.func_id);
            return result;
        }, []);
        //roleFuncConfig中的isEdit改为true，激活显示的drawer
        nextTick(() => {
            roleFuncConfig.isEdit = true;
            //拿userFuncs去更新我们的tree回显
            nextTick(() => roleFuncConfig.treeRef?.setCheckedKeys(checkedKeys));
            //setCheckedKeys方法用来命令tree的哪些节点是勾选的，他的参数是一个数组，里面放着要勾选的节点的key
        }
        )
    } catch (e) {/**/ }
};

const saveRoleFuncConfig = async () => {
    const halfCheckedKeys = roleFuncConfig.treeRef?.getHalfCheckedKeys() as Array<number>;
    const checkedKeys = roleFuncConfig.treeRef?.getCheckedKeys() as Array<number>;
    const keys = [...halfCheckedKeys, ...checkedKeys];
    keys.shift();
    roleFuncConfig.model.role_func_ids = keys.join(",");

    await roleStore.roleFuncConfig(roleFuncConfig.model);
    ElMessage({ type: "success", message: "角色功能" });
    //设置
    roleFuncConfig.isEdit = false;
};
</script>

<style scoped lang="stylus">
.custom-tree-node
    flex-grow: 1
    display: flex
    justify-content: space-between
    align-items: center
    .leaf
        color: #337ecc
.el-row
    width: 100%;
    .el-card
        position relative
            .btn-wrapper
                position: absolute
                top:0
                left: 0
                width: 100%
                height: 100%
                background-color: rgba(0,0,0,0.5)
                display: none
            &:hover .btn-wrapper
                display: flex
                justify-content: center
                align-content: center
.btn-wrapper
    display:flex
</style>