<template>
    <el-container>
        <el-header>
            <el-form inline>
                <el-form-item label="学生姓名：">
                    <el-input v-model.trim="search.user_name" placeholder="请输入学生姓名" @change="updateList()"></el-input>
                </el-form-item>
                <el-form-item label="学生角色：">
                    <el-select v-model="search.role_id" @change="updateList()">
                        <el-option label="- 请选择 -" :value="-1"></el-option>
                        <el-option label="- 无角色 -" :value="0"></el-option>
                        <el-option v-for="item in roleStore.allRoles" :key="item.role_id" :label="item.role_name"
                            :value="item.role_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table :data="list" border>
                <el-table-column type="index" label="#" width="60" align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户名" width="150"></el-table-column>
                <el-table-column label="角色" width="150">
                    <template #default="{ row }">
                        <span v-if="row.role_id === null" class="no-role">无角色</span>
                        <span v-else>{{
                            roleStore.allRoles.find(item => item.role_id === row.rold_id)?.role_name
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #header>
                        <span style="margin-right: 50px;">操作</span>
                        <el-button @click="beginAdd()">新增</el-button>
                    </template>
                    <template #default="{ row }">
                        <el-button @click="resetPwd(row)">重置密码</el-button>
                        <el-button @click="beginRoleConfig(row)">分配角色</el-button>
                        <el-button @click="remove(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <!-- 分页 -->
            <el-pagination background layout="prev,pager,naxt,jumper,->,total,sizes" :total="pagination.total"
                v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage"
                :page-size="[6, 8, 10, 12]" @current-change="updateList" @size-change="updateList()">
            </el-pagination>
        </el-footer>
    </el-container>
    <!-- 修改的时候蹦出来的 -->
    <el-dialog v-model="userEdit.isEdit" title="新增用户">
        <el-form :model="userEdit.model" :rules="userEdit.rules" :ref="(el: any) => userEdit.formRef = el">
            <el-form-item label="用户名：" prop="user_name">
                <el-input v-model="userEdit.model.user_name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="add">确定</el-button>
                <el-button @click="userEdit.isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 角色 -->
    <el-dialog v-model="roleConfig.isEdit" title="用户角色分配">
        <el-form>
            <el-form-item label="用户名：">
                <span>{{ roleConfig.model.user_name }}</span>
            </el-form-item>
            <el-form-item label="用户角色：">
                <el-select v-model="roleConfig.model.role_id">
                    <el-option label="- 无角色 -" :value="0"></el-option>
                    <el-option v-for="item in roleStore.allRoles" :key="item.role_id" :label="item.role_name"
                        :value="item.role_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveRoleConfig">确定</el-button>
                <el-button @click="userEdit.isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted, markRaw, nextTick, Raw } from 'vue';
import { useRoleStore } from '@/store';
import { UserApi } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormRules, FormInstance } from 'element-plus';


const roleStore = useRoleStore();
const list = reactive<Array<Vm.User>>([]);
const search = reactive({ user_name: "", role_id: -1 });
const pagination = reactive({ currentPage: 1, pageSize: 6, total: 0 });
const userEdit = reactive<{
    isEdit: boolean;
    formRef: FormInstance | null;
    model: HttpPayload.UserEdit;
    rules: Raw<FormRules>;
}>({
    isEdit: false,
    formRef: null,
    model: { user_name: "", user_pwd: "123" },
    rules: markRaw({
        user_name: [
            { required: true, message: "*用户名不能为空", trigger: "blur" },
            { min: 2, max: 20, message: "*用户名长度2-20", trigger: "blur" }
        ]
    })
});

const roleConfig = reactive<{
    isEdit: boolean;
    formRef: FormInstance | null;
    model: HttpPayload.UserRole;
    /*  */
}>({
    isEdit: false,
    formRef: null,
    model: { user_name: "", role_id: 0 }
})

const updateList = async (currentPage: number = 1) => {
    pagination.currentPage = currentPage;
    list.splice(0, list.length);
    const result = await UserApi.getList({
        ...search,
        begin: (pagination.currentPage - 1) * pagination.pageSize,
        pageSize: pagination.pageSize
    });//发送ajax
    list.push(...result.list);
    pagination.total = result.total;
}

onMounted(async () => {
    try {
        roleStore.init();
        //初始化 更新
        await updateList();
    } catch (e) {/*  */ }

});

const resetPwd = async (user: Vm.User) => {
    try {
        // 问用户是否重置密码
        await ElMessageBox.confirm(`确定重置:"${user.user_name}"的密码吗？`, '提示', { type: "warning" })
        // 通知UserApi仓库去执行操作
        await UserApi.resetPwd({ user_name: user.user_name, user_pwd: '123' })
        // 提示成功
        ElMessage({ type: "success", message: `重置用户:"${user.user_name}"的密码成功` });
    } catch (e) {/*  */ }
};

const remove = async (user: Vm.User) => {
    try {
        // 问用户是不是确定删除
        await ElMessageBox.confirm(`确定删除用户:"${user.user_name}"的密码吗？`, '提示', { type: "warning" })
        // 通知UserApi仓库去执行删除操作
        await UserApi.remove(user.user_name)
        // 删除后自动回到第一页
        updateList();
        // 提示删除成功
        ElMessage({ type: "success", message: `用户:"${user.user_name}"删除成功` });
    } catch (e) {/*  */ }
};
const beginAdd = () => {
    userEdit.formRef?.resetFields();
    userEdit.model.user_name = "";
    nextTick(() => userEdit.isEdit = true)
};
const add = async () => {
    try {
        await userEdit.formRef?.validate();
        // 添加时验证是不是唯一
        const flag = await UserApi.validName({ user_name: userEdit.model.user_name });
        if (flag === 1) {
            ElMessage({ type: "error", message: `用户名："${userEdit.model.user_name}"已存在` });
            return;
        }
        await UserApi.add(userEdit.model);
        await updateList();
        ElMessage({ type: "success", message: `用户："${userEdit.model.user_name}"新增成功` })
        userEdit.isEdit = false;
    } catch (e) {/*  */ }
};
const beginRoleConfig = (user: Vm.User) => {
    roleConfig.model.user_name = user.user_name;
    roleConfig.model.role_id = user.role_id || 0;
    nextTick(() => roleConfig.isEdit = true)
};
const saveRoleConfig = async () => {
    await UserApi.roleConfig(roleConfig.model);
    (list.find(item => item.user_name === roleConfig.model.user_name) as Vm.User).role_id = roleConfig.model.role_id === 0 ? null : roleConfig.model.role_id;
    ElMessage({ type: "success", message: `用户："${roleConfig.model.user_name}角色分配成功"` });
    roleConfig.isEdit = false;
}
</script>

<style scoped lang="stylus">
.no-role
    color:#ccc
</style>