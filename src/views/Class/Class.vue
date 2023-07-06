<script setup lang="ts">
import { ClassApi } from "@/api";
import { useDictionaryStore, useTeacherStore, useClassRoomStore, useClassStore } from "@/store";
import { onMounted, reactive, markRaw, Raw, ref, nextTick, computed } from "vue";
import { FormRules, FormInstance, ElMessage, ElMessageBox } from 'element-plus';

const list = reactive<Array<Vm.Class>>([]);  //所有的班级数据
const dictionaryStore = useDictionaryStore();  //字典表仓库
const teacherStore = useTeacherStore();//教师仓库
const classRoomStore = useClassRoomStore();//全部教室
const classStore = useClassStore(); //班级仓库
const pagination = reactive({ currentPage: 1, pageSize: 5, total: 0 }) //页码
const typelist = computed(() => dictionaryStore.dictionaryData.slice(7));
const getData = ref<HttpPayload.GetClass>({
    cls_name: "",
    cls_dic_id_major: 0,
    cls_status: 0
})

const startClassData = reactive<{
    isEdit: boolean;
    model: HttpPayload.ClassStart;
}>({
    isEdit: false,
    model: {
        cls_id: 0,
        cls_clsr_id: null
    },
});

const classEdit = reactive<{
    isEdit: boolean;
    formRef: FormInstance | null;
    model: HttpPayload.ClassEdit;
    rules: Raw<FormRules>;
}>({
    isEdit: false,
    formRef: null,
    // cls_clsr_id: 0,
    model: { cls_id: 0, cls_name: "",  cls_dic_id_major: 0, cls_stf_id_teacher: 0, cls_stf_id_admin: 0, cls_stf_id_job: 0, cls_status: 0, cls_begin: 0, cls_end: 0, cls_remark: "" },
    rules: markRaw({
        cls_name: [
            { required: true, message: "* 用户名不能为空", trigger: "blur" },
            { min: 2, max: 20, message: "* 用户长度2-20", trigger: "blur" }
        ]
    })
});
// 页面的数据怎么变化的 怎么获取到的当前状态？
const updateAll = async (currentPage: number = 1) => {
    pagination.currentPage = currentPage;
    list.splice(0, list.length);
    const result = await ClassApi.getList({ ...getData.value, begin: (pagination.currentPage - 1) * pagination.pageSize, pageSize: pagination.pageSize });
    list.push(...result.list);
    pagination.total = result.total;
}
onMounted(async () => {
    try {
        await updateAll();
        await teacherStore.getMath();//获取全部数学老师存入仓库
        await teacherStore.educational();//获取全部教务老师存入仓库
        await teacherStore.obtain();//获取全部教务老师存入仓库
        await classRoomStore.init();//获取全部教室存入仓库
    } catch (e) {/**/ }
});

const beginAdd = () => {
    classEdit.formRef?.resetFields();
    classEdit.model.cls_name = "";
    classEdit.model.cls_dic_id_major = 0;
    classEdit.model.cls_stf_id_teacher = 0;
    classEdit.model.cls_stf_id_admin = 0;
    classEdit.model.cls_stf_id_job = 0;
    classEdit.model.cls_remark = "";
    nextTick(() => classEdit.isEdit = true);
}

const beginUpdate = (Class: Vm.Class) => {
    classEdit.model.cls_name = Class.cls_name;
    classEdit.model.cls_dic_id_major = Class.cls_dic_id_major;
    classEdit.model.cls_stf_id_teacher = Class.cls_stf_id_teacher;
    classEdit.model.cls_stf_id_admin = Class.cls_stf_id_admin;
    classEdit.model.cls_stf_id_job = Class.cls_stf_id_job;
    classEdit.model.cls_remark = Class.cls_remark;
    classEdit.isEdit = true;
}

const save = async () => {
    try {
        if (classEdit.model.cls_id === 0) {
            classEdit.formRef?.validate();
            await ClassApi.add(classEdit.model);
            ElMessage({ type: "success", message: `班级:"${classEdit.model.cls_name}"添加成功` });
        } else {
            await ClassApi.update(classEdit.model);
            const i = list.findIndex(item => item.cls_id === classEdit.model.cls_id);
            list.splice(i, 1, { ...classEdit.model });
        }
        await updateAll(pagination.currentPage);
        classEdit.isEdit = false;
    } catch (e) {/**/ }
}
const beginClass = async (item: Vm.Class) => {
    await ElMessageBox.confirm(`确认开课? `, '提示', { type: "warning" });
    startClassData.isEdit = true;
    classEdit.model.cls_id = item.cls_id;
    // startClassData.model.cls_clsr_id = item.cls_clsr_id;
}

const startClass = async () => {
    try {
        await ClassApi.start(classEdit.model);
        await updateAll(pagination.currentPage);
        //  classStore.startClass(startClassData.model);
         startClassData.isEdit = false; 
        ElMessage({ type: "success", message: `开课成功..` })
    } catch (e) {/**/ }
}
const endClass = async (id: number) => {
    try {
        await ElMessageBox.confirm(`确认结课? `, '提示', { type: "warning" });
        await ClassApi.end({cls_id:id});
        await updateAll(pagination.currentPage);
        ElMessage({ type: "success", message: `结课成功..` })
    } catch (e) {/**/ }
}

</script>


<template>
    <!-- 搜索框 -->
    <el-form inline>
        <el-form-item label="班级名称">
            <el-input v-model="getData.cls_name" @change="updateAll(1)" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="班级专业">
            <el-select v-model="getData.cls_dic_id_major" @change="updateAll(1)">
                <el-option label="- 请选择 -" :value="0"></el-option>
                <el-option v-for="item in typelist" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="班级状态">
            <el-select v-model="getData.cls_status" @change="updateAll(1)">
                <el-option label="- 所有 -" :value="0"></el-option>
                <el-option label="开课中" :value="1"></el-option>
                <el-option label="未开课" :value="2"></el-option>
                <el-option label="结课" :value="3"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="beginAdd">+新增</el-button>
        </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-form>
        <el-table :data="list" border stripe min-height="300" style="background-color: transparent">
            <el-table-column label="#" width="80" type="index"></el-table-column>
            <el-table-column label="班级名称" width="120">
                <template #default="{ row }">
                    <span>{{ row.cls_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="班级专业" width="120">
                <template #default="{ row }">
                    <span
                        v-text="row.cls_id !== 0 ? dictionaryStore.dictionaryData.find(item => item.dic_id === row.cls_dic_id_major)?.dic_name : ''"></span>
                </template>
            </el-table-column>
            <el-table-column label="教学老师" width="100">
                <template #default="{ row }">
                    <span
                        v-text="teacherStore.mathList !== undefined ? teacherStore.mathList.find(item => item.stf_id === row.cls_stf_id_teacher)?.stf_name : ''"></span>
                </template>
            </el-table-column>
            <el-table-column label="教务老师" width="100">
                <template #default="{ row }">
                    <span
                        v-text="teacherStore.deanList !== undefined ? teacherStore.deanList.find(item => item.stf_id === row.cls_stf_id_admin)?.stf_name : ''"></span>
                </template>
            </el-table-column>
            <el-table-column label="就业老师" width="100">
                <template #default="{ row }">
                    <span
                        v-text="teacherStore.jobList !== undefined ? teacherStore.jobList.find(item => item.stf_id === row.cls_stf_id_job)?.stf_name : ''"></span>
                </template>
            </el-table-column>
            <el-table-column label="教室" width="150">
                <template #default="{ row }">
                    <span
                        v-text="row.cls_id !== 0 ? classRoomStore.allClrs.find(item => item.clsr_id === row.cls_clsr_id)?.clsr_name : ''"></span>
                </template>
            </el-table-column>
            <el-table-column label="开课时间" width="180">
                <template #default="{ row }">
                    <span>{{ row.cls_begin }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结课时间" width="180">
                <template #default="{ row }">
                    <span>{{ row.cls_end }}</span>
                </template>
            </el-table-column>
            <el-table-column label="班级状态" width="100">
                <template #default="{ row }">
                    <span style="color:#F56C6C; " v-if="row.cls_begin && row.cls_end">结课</span>
                    <span style="color:#67C23A; " v-else-if="row.cls_begin && !row.cls_end">开课中</span>
                    <span style="color:#E6A23C; " v-else>未开课</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" width="200">
                <template #default="{ row }">
                    <span class="leave-out" :title="row.cls_remark">{{
                        row.cls_remark === null ?
                            '暂无相关描述' : row.cls_remark
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template #default="{ row }">
                    <div>
                        <el-button type="primary" @click="beginUpdate(row)">编辑</el-button>
                        <el-button type="danger" v-if="row.cls_begin && !row.cls_end"
                            @click="endClass(row.cls_id)">结课</el-button>
                        <el-button type="success" v-else-if="!row.cls_begin && !row.cls_end"
                            @click="beginClass(row)">开课</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
    <!-- 分页 -->
    <el-pagination :total="pagination.total" :page-sizes="[5, 8, 10, 12]" background
        layout="prev, pager,next,jumper,->,total,sizes" v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage" @size-change="updateAll()" @current-change="updateAll">
    </el-pagination>
    <!-- 新增弹出层 -->
    <el-dialog v-model="classEdit.isEdit" :title="classEdit.model.cls_id === 0 ? '新增' : '编辑'">
        <el-form :model="classEdit.model" :rules="classEdit.rules" :ref="(el: any) => classEdit.formRef = el">
            <el-form-item label="班级名称" prop="cls_name">
                <el-input v-model="classEdit.model.cls_name" placeholder="请输入班级名称" style="width: 380px"></el-input>
            </el-form-item>
            <el-form-item label="班级专业" prop="cls_dic_id_major">
                <el-select v-model="classEdit.model.cls_dic_id_major">
                    <el-option :value="0" label="-请选择-"></el-option>
                    <el-option v-for="item in typelist" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="教学老师" prop="cls_stf_id_teacher">
                <el-select v-model="classEdit.model.cls_stf_id_teacher">
                    <el-option :value="0" label="-请选择-"></el-option>
                    <el-option v-for="item in teacherStore.mathList" :key="item.stf_id" :value="item.stf_id"
                        :label="item.stf_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="教务老师" prop="cls_stf_id_admin">
                <el-select v-model="classEdit.model.cls_stf_id_admin">
                    <el-option :value="0" label="-请选择-"></el-option>
                    <el-option v-for="item in teacherStore.deanList" :key="item.stf_id" :value="item.stf_id"
                        :label="item.stf_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="就业老师" prop="cls_stf_id_job">
                <el-select v-model="classEdit.model.cls_stf_id_job">
                    <el-option :value="0" label="-请选择-"></el-option>
                    <el-option v-for="item in teacherStore.jobList" :key="item.stf_id" :value="item.stf_id"
                        :label="item.stf_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="员工备注" prop="stf_remark">
                <el-input maxlength="30" show-word-limit type="textarea" placeholder="请输入内容"
                    v-model="classEdit.model.cls_remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">确定</el-button>
                <el-button @click="classEdit.isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog v-model="startClassData.isEdit" title="选择开课教室">
        <el-form>
            <el-form-item>
                <el-select v-model="startClassData.model.cls_clsr_id">
                    <el-option :value="0" label="-请选择-"></el-option>
                    <el-option v-for="item in classRoomStore.allClrs" :key="item.clsr_id" :value="item.clsr_id"
                        :label="item.clsr_name" :disabled="item.clsr_occupy === 1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="startClass()">确定</el-button>
                <el-button @click="startClassData.isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>



<style scoped lang="stylus">
.leave-out
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    
</style>