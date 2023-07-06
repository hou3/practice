<template>
    <!-- 搜索框 -->
    <el-form inline>
        <el-form-item label="学生姓名">
            <el-input v-model="getData.stu_name" @change="updateList(1)" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="所在班级">
            <el-select v-model="getData.stu_cls_id" @change="updateList(1)">
                <el-option label=" - 请选择 - " :value="0"></el-option>
                <el-option v-for="item in typelist" :key="item.cls_id" :label="item.cls_name"
                    :value="item.cls_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="学生学历">
            <el-select v-model="getData.stu_qualification" @change="updateList(1)">
                <el-option label=" - 请选择 - " :value="0"></el-option>
                <el-option v-for="item in xueli" :key="item.dic_id" :label="item.dic_name"
                    :value="item.dic_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="beginAdd">+新增</el-button>
            <el-button type="success" @click="classroomfirm"
                :disabled="distributedata.stu_ids.length === 0">批量分班</el-button>
            <el-button type="warning" @click="bulkExport">导出学生信息</el-button>
        </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-form>
        <el-table :data="list" border stripe height="380" style="background-color: transparent"
            @selection-change="handleSelectionChange">
            <el-table-column fixed label="#" width="80">
                <template #default="{ row }">
                    <span>{{ row.stu_id }}</span>
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55" />
            <el-table-column label="学生姓名" width="100">
                <template #default="{ row }">
                    <span class="name">{{ row.stu_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="班级" width="100">
                <template #default="{ row }">
                    <span
                        v-text="row.stu_cls_id !== null ? classStore.allClass.find(item => item.cls_id === row.stu_cls_id)?.cls_name : '无教室'"
                        :style="{ color: row.stu_cls_id !== null ? '#67c23a' : '#909399' }">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="存档照片" width="100">
                <template #default="{ row }">
                    <el-popover placement="right" trigger="click">
                        <el-container>
                            <el-header><span v-text="row.stu_name"></span></el-header>
                            <el-main>
                                <img :src="row.stu_avatar" />
                            </el-main>
                        </el-container>
                        <template #reference>
                            <el-button type="success" plain>预览</el-button>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="性别" width="80">
                <template #default="{ row }">
                    <span :style="{ color: row.stu_sex ? '#409eff' : '#f56c6c' }">{{ row.stu_sex ? '女' : '男' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" width="120">
                <template #default="{ row }">
                    <span>{{ row.stu_phone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话2" width="120">
                <template #default="{ row }">
                    <span>{{ row.stu_phone2 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="出生日期" width="120">
                <template #default="{ row }">
                    <span>{{ row.stu_born }}</span>
                </template>
            </el-table-column>
            <el-table-column label="学历" width="150">
                <template #default="{ row }">
                    <span
                        v-text="row.stu_id !== 0 ? dictionaryStore.dictionaryData.find(item => item.dic_id === row.stu_qualification)?.dic_name : ''"></span>
                </template>
            </el-table-column>
            <el-table-column label="毕业院校" width="150">
                <template #default="{ row }">
                    <span>{{ row.stu_school }}</span>
                </template>
            </el-table-column>
            <el-table-column label="院校专业" width="150">
                <template #default="{ row }">
                    <span>{{ row.stu_major }}</span>
                </template>
            </el-table-column>
            <el-table-column label="家庭地址" width="280">
                <template #default="{ row }">
                    <span>{{ row.stu_address }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" width="280">
                <template #default="{ row }">
                    <span>{{ row.stu_remark }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="350">
                <template #default="{ row }">
                    <el-button type="success" @click="fenban(row.stu_id)">分班</el-button>
                    <el-button type="warning" @click="beginAvatarUpdate(row.stu_id, row.stu_avatar)">照片上传</el-button>
                    <el-button type="primary" @click="beginUpdate(row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
    <!-- 分页 -->
    <el-pagination :total="pagination.total" :page-sizes="[5, 8, 10, 12]" background
        layout="prev, pager,next,jumper,->,total,sizes" v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage" @size-change="updateList()" @current-change="updateList">
    </el-pagination>
    <!-- 新增学生弹出层 -->
    <el-dialog v-model="studentEdit.isEdit" :title="studentEdit.model.stu_id !== 0 ? '编辑' : '新增'">
        <el-form :model="studentEdit.model" :rules="studentEdit.rules" :ref="(el: any) => studentEdit.formRef = el">
            <el-form-item label="学生姓名" prop="stu_name">
                <el-input v-model="studentEdit.model.stu_name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="stu_sex">
                <el-radio-group v-model="studentEdit.model.stu_sex">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="联系电话" prop="stu_phone">
                <el-input v-model="studentEdit.model.stu_phone"></el-input>
            </el-form-item>
            <el-form-item label="备用电话" prop="stu_phone2">
                <el-input v-model="studentEdit.model.stu_phone2"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="stu_born">
                <div class="datetime">
                    <div class="demonstration">
                        <el-date-picker value-format="YYYY-MM-DD" v-model="studentEdit.model.stu_born" type="date"
                            placeholder="选择出生日期" />
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="学历" prop="stu_qualification">
                <el-select v-model="studentEdit.model.stu_qualification">
                    <el-option label="-请选择-" :value="0"></el-option>
                    <el-option v-for="item in xueli" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id" />
                </el-select>
            </el-form-item>
            <el-form-item label="在读/毕业院校" prop="stu_school">
                <el-input v-model="studentEdit.model.stu_school" placeholder="请输入在读/毕业院校(选填)"></el-input>
            </el-form-item>
            <el-form-item label="在校学习专业" prop="stu_major">
                <el-input v-model="studentEdit.model.stu_major" placeholder="请输入在校学习专业(选填)"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="stu_address">
                <el-input v-model="studentEdit.model.stu_address" placeholder="请输入家庭住址"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="stu_remark">
                <el-input v-model="studentEdit.model.stu_remark" maxlength="30" show-word-limit type="textarea"
                    placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">确认</el-button>
                <el-button @click="studentEdit.isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 分班弹出层 -->
    <el-dialog v-model="banding.isEdit" title="班级分配">
        <el-form :model="distributedata" :rules="studentEdit.rules" ref="form">
            <el-form-item label="班级" prop="stu_cls_id">
                <el-select v-model="distributedata.stu_cls_id">
                    <el-option :value="0" label="-请选择-"></el-option>
                    <el-option v-for="item in typelist" :key="item.cls_id" :label="item.cls_name"
                        :value="item.cls_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="distribution">分配</el-button>
                <el-button type="info" @click="banding.isEdit = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 上传图片弹窗 -->
    <el-dialog v-model="avatarUpload.isEdit">
        <el-upload v-if="avatarUpload.isEdit"
         accept=".png,.jpg" 
         action="/student/avatarupload"
          name="avatar"
            :headers="avatarUpload.headers" 
            :file-list="avatarUpload.fileList"
             list-type="picture-card"
            :before-upload="beforeUploadHandler"
             :on-success="uploadSuccessHandler">
            选择图片
            <template #tip>
                <div style="color: red; padding:10px 0">
                    请上传png/jpg文件,且小于2MB
                </div>
            </template>
        </el-upload>
        <el-button @click="avatarUpdate" :disabled="avatarUpload.model.stu_avatar_new === null">存档</el-button>
        <el-button @click="avatarUpload.isEdit = false">取消</el-button>
    </el-dialog>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
import { nextTick, reactive, ref, Raw, markRaw, onMounted, computed } from 'vue';
import { StudentApi } from '@/api';
import { useDictionaryStore, useClassStore } from '@/store';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from 'element-plus';
import { FormRules, FormInstance } from 'element-plus';


const list = reactive<Array<Vm.Student>>([]); //展示的数据
const dictionaryStore = useDictionaryStore();  //字典表仓库
const classStore = useClassStore();
const pagination = reactive({ currentPage: 1, pageSize: 5, total: 0 });  //页码
const typelist = computed(() => { return classStore.allClass });
const xueli = computed(() => { return dictionaryStore.dictionaryData.slice(0, 3) });


//导出学生信息
const DetailsForm = computed(() => {
    const data = JSON.parse(JSON.stringify(list))
    return data.reduce((res: any, item: any) => {
        item.stu_cls_id = item.stu_cls_id ? classStore.allClass.find(it => it.cls_id === item.stu_cls_id)?.cls_name : ''
        item.stu_sex = item.stu_sex ? '男' : '女'
        item.stu_qualification = xueli.value.find(it => it.dic_id === item.stu_qualification)?.dic_name
        res.push(item)
        console.log(res)
        return res
    }, [])
})

// 批量导出的表
const bulkExport = () => {
    // 创建一个新的工作簿
    const workbook = XLSX.utils.book_new();
    // 创建一个新的工作表
    const worksheet = XLSX.utils.json_to_sheet(DetailsForm.value);
    // 将工作表附加到工作簿，并将工作表命名为students
    XLSX.utils.book_append_sheet(workbook, worksheet, "学生信息");
    // 向worksheet工作表中的A1位置添加数据的数组
    XLSX.utils.sheet_add_aoa(worksheet, [["学生姓名", "存档照片", "班级", "性别", "联系电话", "联系电话2", "出生日期", "学历", "毕业院校", "院校专业", "家庭地址", "备注"]], { origin: "B1" });
    // 导出工作簿，并命名导出文件名为Presidents.xlsx
    XLSX.writeFile(workbook, "学生信息.xlsx");
}


const distributedata = ref<{ stu_id: number | null, stu_ids: Array<number>, stu_cls_id: number }>({
    stu_id: null,
    stu_ids: [],
    stu_cls_id: 0
})
const getData = ref<HttpPayload.GetStudent>({
    stu_name: "",
    stu_cls_id: 0,
    stu_qualification: 0
});
//分班信息
const banding = reactive<{
    isEdit: boolean;
    formRef: FormInstance | null;
}>({
    isEdit: false,
    formRef: null,
})
// 学生信息
const studentEdit = reactive<{
    isEdit: boolean;
    formRef: FormInstance | null;
    model: HttpPayload.StudentEdit;
    rules: Raw<FormRules>;
}>({
    isEdit: false,
    formRef: null,
    model: {
        stu_id: 0,
        stu_name: "",
        stu_cls_id: null,
        stu_sex: 0,
        stu_phone: '',
        stu_phone2: '',
        stu_born: "",
        stu_qualification: 0,
        stu_school: "",
        stu_major: "",
        stu_address: "",
        stu_remark: "",
        stu_avatar: ''
    },
    rules: markRaw({
        stu_name: [
            { required: true, message: "* 用户名不能为空", trigger: "blur" },
            { min: 2, max: 20, message: "* 用户长度2-20", trigger: "blur" }
        ],
        stu_phone: [
            { required: true, message: "* 手机号不能为空", trigger: "blur" },
            { min: 2, max: 20, message: "* 手机号长度为11位", trigger: "blur" }
        ],
        stu_phone2: [
            { required: true, message: "* 手机号不能为空", trigger: "blur" },
            { min: 2, max: 20, message: "* 手机号长度为11位", trigger: "blur" }
        ]
    })
})
//学生信息
const updateList = async (currentPage: number = 1) => {
    // currentPage 页码的更新
    pagination.currentPage = currentPage;
    list.splice(0, list.length);
    const result = await StudentApi.getList({ ...getData.value, begin: (pagination.currentPage - 1) * pagination.pageSize, pageSize: pagination.pageSize })
    list.push(...result.list);
    pagination.total = result.total;
}
onMounted(async () => {
    try {
        await updateList();
        await classStore.init();
    } catch (e) {/**/ }
});
// 图片
const avatarUpload = reactive<{
    isEdit: boolean,
    headers: Headers | Record<string, any>,
    model: HttpPayload.StudentAvatarUpdate,
    fileList: Array<UploadUserFile>
}>({
    isEdit: false,
    headers: { Authorization: sessionStorage.getItem('token') },
    model: { stu_id: 0, stu_avatar_old: null, stu_avatar_new: null },
    fileList: []
});
// 图片
const beforeUploadHandler = (file: UploadRawFile) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        ElMessage.error('存档图片必须是jpg/png格式')
        return false;
    } else if (file.size / 1024 / 1024 > 2) {
        ElMessage.error('图片必须小于2MB')
        return false;
    }
    return true;
};

const uploadSuccessHandler = (res: any, file: UploadFile, fileList: UploadFiles) => {
    avatarUpload.model.stu_avatar_new = res.data;
    if (fileList.length > 1) fileList.shift();
}

const beginAvatarUpdate = (stu_id: number, stu_avatar_old: string | null) => {
    avatarUpload.model.stu_id = stu_id;
    avatarUpload.model.stu_avatar_old = stu_avatar_old;
    avatarUpload.model.stu_avatar_new = null;
    avatarUpload.fileList.splice(0, avatarUpload.fileList.length)
    if (stu_avatar_old !== null) {
        avatarUpload.fileList.push({
            name: stu_avatar_old,
            url: stu_avatar_old
        })
    }
    nextTick(() => avatarUpload.isEdit = true);
};

const avatarUpdate = async () => {
    const newAvatarPath = await StudentApi.avatarUpdate(avatarUpload.model);
    // 更新列表数据
    console.log("更新列表数据")
    ElMessage.success('图片存档成功')
    avatarUpload.isEdit = false;
}

const beginAdd = () => { //新增弹出层
    studentEdit.formRef?.resetFields();
    studentEdit.model.stu_cls_id = null;
    studentEdit.model.stu_name = "";
    studentEdit.model.stu_sex = 0;
    studentEdit.model.stu_phone = '';
    studentEdit.model.stu_phone2 = '';
    studentEdit.model.stu_born = '';
    studentEdit.model.stu_qualification = 0;
    studentEdit.model.stu_school = '';
    studentEdit.model.stu_major = '';
    studentEdit.model.stu_address = '';
    studentEdit.model.stu_remark = '';
    studentEdit.model.stu_avatar = '';
    nextTick(() => studentEdit.isEdit = true);
};

const beginUpdate = (Student: Vm.Student) => {
    studentEdit.model.stu_cls_id = Student.stu_cls_id;
    studentEdit.model.stu_id = Student.stu_id;
    studentEdit.model.stu_name = Student.stu_name;
    studentEdit.model.stu_sex = Student.stu_sex;
    studentEdit.model.stu_phone = Student.stu_phone;
    studentEdit.model.stu_phone2 = Student.stu_phone2;
    studentEdit.model.stu_born = Student.stu_born;
    studentEdit.model.stu_qualification = Student.stu_qualification;
    studentEdit.model.stu_school = Student.stu_school;
    studentEdit.model.stu_major = Student.stu_major;
    studentEdit.model.stu_address = Student.stu_address;
    studentEdit.model.stu_remark = Student.stu_remark;

    studentEdit.isEdit = true;
}

const save = async () => {
    try {
        studentEdit.formRef?.validate();
        if (studentEdit.model.stu_id === 0) {
            await StudentApi.add(studentEdit.model);
            ElMessage({ type: "success", message: `学生:"${studentEdit.model.stu_name}"添加成功` }); //提示
        } else {
            await StudentApi.update(studentEdit.model);
            const i = list.findIndex(item => item.stu_id === studentEdit.model.stu_id);
            list.splice(i, 1, { ...studentEdit.model });
        }
        studentEdit.isEdit = false; //关闭弹出层
    } catch (e) {/**/ }
}

const handleSelectionChange = (val: Array<number>) => {
    distributedata.value.stu_ids = val.map(item => item.stu_id)
    // distributedata.value.stu_ids = val.map
    // val是一个number类型的数组  ，然后这句话是啥意思   根据当前的学生 val是啥嗷嗷
}

const classroomfirm = async () => { //批量分班
    try {
        nextTick(() => banding.isEdit = true);
    } catch (e) {/**/ }
}

const fenban = (stu_id: number) => {  //单个分班
    distributedata.value = {
        stu_id: stu_id,
        stu_ids: [],
        stu_cls_id: 0
    }
    nextTick(() => banding.isEdit = true);
    // distributedata.value.stu_id = stu_id;
}

const distribution = async () => {  //分班确认
    try {
        if (distributedata.value.stu_id === null) {
            await StudentApi.assignclass(distributedata.value); //批量分班
        } else {
            await StudentApi.assignclass(distributedata.value);  //单个分班
        }
        distributedata.value = {
            stu_id: null,
            stu_ids: [],
            stu_cls_id: 0
        }
        await updateList(pagination.currentPage); //更新
        banding.isEdit = false;
    } catch (e) {/**/ }
}

</script>

<style scoped lang="stylus">
.name
    color:cornflowerblue
.pane 
    min-height: 100%
    padding: 0 20px
    box-sizing: border-box
    display: flex
    flex-direction: column
.el-main img
    width: 100px
</style>