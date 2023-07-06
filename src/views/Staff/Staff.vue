<template>
    <el-container>
        <!-- 搜索框 -->
        <el-header class="el-header">
            <el-form inline>
                <el-form-item label="员工姓名">
                    <el-input placeholder="请输入内容" v-model="getData.stf_name" @change="updateList(1)"></el-input>
                </el-form-item>
                <el-form-item label="员工类型">
                    <el-select v-model="getData.stf_category" @change="updateList(1)">
                        <el-option label="- 请选择 -" :value="0"></el-option>
                        <el-option v-for="item in typelist" :key="item.dic_id" :label="item.dic_name"
                            :value="item.dic_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-button type="success" @click="beginAdd">+新增</el-button>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-form>
                <el-table :data="list" border stripe height="320" style="background-color: transparent">
                    <el-table-column fixed label="#" width="85">
                        <template #default="{ row }">
                            <span>{{ row.stf_id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="姓名" width="150">
                        <template #default="{ row }">
                            <span>{{ row.stf_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="职务类型" width="200">
                        <template #default="{ row }">
                            <span
                                v-text="row.stf_id !== 0 ? dictionaryStore.dictionaryData.find(item => item.dic_id === row.stf_category)?.dic_name : ''"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" width="200">
                        <template #default="{ row }">
                            <span>{{ row.stf_remark }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="员工状态" width="200">
                        <template #default="{ row }">
                            <span v-if="row.stf_invalid === 0" style="color:red">离职</span>
                            <span v-else style="color:green">在职</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250">
                        <template #default="{ row }">
                            <div>
                                <el-button type="primary" @click="beginUpdate(row)">编辑</el-button>
                                <el-button :type="row.stf_invalid !== 0 ? 'danger' : 'success'" @click="status(row)">{{
                                    row.stf_invalid !== 0 ? '离职' : '入职'
                                }}</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </el-main>
        <!-- 分页 -->
        <el-footer>
            <el-pagination :total="pagination.total" :page-sizes="[5, 8, 10, 12]" background
                layout="prev, pager,next,jumper,->,total,sizes" v-model:page-size="pagination.pageSize"
                v-model:current-page="pagination.currentPage" @size-change="updateList()" @current-change="updateList">
            </el-pagination>
            <!-- 新增用户弹窗 -->
            <el-dialog v-model="staffEdit.isEdit" :title="staffEdit.model.stf_id !== 0 ? '编辑' : '新增'"
                label-width="100px">
                <el-form :model="staffEdit.model" :rules="staffEdit.rules" :ref="(el: any) => staffEdit.formRef = el">
                    <el-form-item label="员工姓名" prop="stf_name">
                        <el-input v-model="staffEdit.model.stf_name"></el-input>
                    </el-form-item>
                    <el-form-item label="员工类型" prop="stf_category">
                        <el-select v-model="staffEdit.model.stf_category">
                            <el-option v-for="item in typelist" :key="item.dic_id" :label="item.dic_name"
                                :value="item.dic_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="员工备注" prop="stf_remark">
                        <el-input maxlength="30" show-word-limit type="textarea" placeholder="请输入内容"
                            v-model="staffEdit.model.stf_remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="save">确实</el-button>
                        <el-button @click="staffEdit.isEdit = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, shallowRef, markRaw, Raw, computed, nextTick } from 'vue'
import { StaffApi } from '@/api';
import { useDictionaryStore } from "@/store";
import { FormRules, FormInstance, ElMessage } from 'element-plus';

const list = shallowRef<Array<Vm.Staff>>([]);  //展示的数据
const dictionaryStore = useDictionaryStore();  //字典表仓库
const pagination = reactive({ currentPage: 1, pageSize: 5, total: 0 });  //页码
const typelist = computed(() => { return dictionaryStore.dictionaryData.slice(3, dictionaryStore.dictionaryData.length - 3) })
const getData = ref<HttpPayLoad.GetStaff>({
    stf_name: "",
    stf_category: 0
});
const staffEdit = reactive<{
    isEdit: boolean;
    formRef: FormInstance | null;
    model: HttpPayLoad.StaffEdit;
    rules: Raw<FormRules>;
}>({
    isEdit: false,
    formRef: null,
    model: { stf_id: 0, stf_name: "", stf_category: 0, stf_remark: "", stf_invalid: 0 },
    rules: markRaw({
        stf_name: [
            { required: true, message: "* 用户名不能为空", trigger: "blur" },
            { min: 2, max: 20, message: "* 用户长度2-20", trigger: "blur" }
        ]
    })
});

const updateList = async (currentPage: number = 1) => {
    pagination.currentPage = currentPage;
    list.value.splice(0, list.value.length);
    const result = await StaffApi.getList({ ...getData.value, begin: (pagination.currentPage - 1) * pagination.pageSize, pageSize: pagination.pageSize })
    list.value = result.list;
    pagination.total = result.total;
}

onMounted(async () => {
    try {
        await updateList();
    } catch (e) {/**/ }
});

const beginAdd = () => {  //新增弹出层
    staffEdit.formRef?.resetFields();
    staffEdit.model.stf_id = 0;
    staffEdit.model.stf_name = "";
    staffEdit.model.stf_category = 0;
    staffEdit.model.stf_remark = "";
    nextTick(() => staffEdit.isEdit = true);
};

const save = async () => {
    try {
        if (staffEdit.model.stf_id === 0) {
            staffEdit.formRef?.validate(); //表单验证
            await StaffApi.add(staffEdit.model); //发送ajax保存
            ElMessage({ type: "success", message: `员工:"${staffEdit.model.stf_name}"添加成功` }); //提示
        } else {
            await StaffApi.update(staffEdit.model);
            const i = list.value.findIndex(item => item.stf_id === staffEdit.model.stf_id);
            list.value.splice(i, 1, { ...staffEdit.model });
        }
        await updateList(pagination.currentPage);  //更新list
        staffEdit.isEdit = false; //关闭弹出层
    } catch (e) {/**/ }
};

const beginUpdate = (Staff: Vm.Staff) => {
    staffEdit.model.stf_id = Staff.stf_id;
    staffEdit.model.stf_name = Staff.stf_name;
    staffEdit.model.stf_category = Staff.stf_category;
    staffEdit.model.stf_remark = Staff.stf_remark;

    staffEdit.isEdit = true;
};

const status = async (Staff: Vm.Staff) => {
    try {
        if (Staff.stf_invalid === 0) {
            await StaffApi.reinstate(Staff.stf_id);
            console.log("状态设置离职")

        } else {
            await StaffApi.dimission(Staff.stf_id);
        }
        await updateList(pagination.currentPage);
        ElMessage({ type: "success", message: Staff.stf_invalid === 0 ? "入职成功" : "离职成功" });
    } catch (e) {/**/ };
};
</script>


<style scoped lang="stylus">


    
</style>