<template>
    <el-form :model="changePwdEdit.model" :rules="changePwdEdit.rules" ref="form" label-width="100px">
        <el-form-item prop="oldPwd" label="原始密码">
            <el-input v-model="changePwdEdit.model.oldPwd"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
            <el-input v-model="changePwdEdit.model.newPwd"></el-input>
        </el-form-item>
        <el-form-item prop="newPwdConfirm" label="新密码确认">
            <el-input v-model="changePwdEdit.model.newPwdConfirm"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">确认</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { markRaw, reactive, Raw } from 'vue';
import { FormRules,FormInstance, ElMessageBox} from 'element-plus';
import { ElMessage} from 'element-plus';
import { ChangePwdApi } from '@/api';

const changePwdEdit = reactive<{
    formRef: FormInstance | null;
    model: HttpPayload.changePwd;
    rules: Raw<FormRules>;
}>({
    formRef: null,
    model:{oldPwd: "", newPwd: "",newPwdConfirm: ""},
    rules: markRaw({
        oldPwd: [
            {required: true, message: "* 必填", trigger: "blur"},
            {min: 2, max: 16, message:"请输入正确的旧密码", trigger: "blur"}
        ],
        newPwd: [
            {pattern: /[A-Za-z0-9]/, message:"请输入正确的密码", trigger: "blur"},
            {validator: (rule, value, callback) => {
                if(value === '') callback("* 必填");
                else if(changePwdEdit.model.newPwdConfirm !== "") changePwdEdit.formRef?.validateField("newPwdConfirm");
                callback()
            }, trigger: "blur"}
        ],
        newPwdConfirm: [
            {required: true, message: "* 必填", trigger: "blur"},
            {validator: (rule, value, callback) => {
                if(value !== changePwdEdit.model.newPwdConfirm) callback("两次密码输入不一致");
                callback()
            }, trigger: "blur"}
        ]
    })
});
const save = async () => {
    try {
        await ElMessageBox.confirm("确定修改密码?", "提示",{
            confirmButtonText:'确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
    if(sessionStorage.getItem("userName") === 'admin') {
        ElMessage({ type: 'error', message: '管理员请直接修改配置文件!'})
        return;
    }  
    await ChangePwdApi.changePwd(changePwdEdit.model);  
    ElMessage({ type:'success', message:'密码修改成功'})
    changePwdEdit.formRef?.resetFields();
    } catch(e: any) {
        ElMessage({
            type: "error",
            message: e.message
        })
    }
}
</script>

<style scoped lang="stylus">
.el-form-item
    width: 500px
</style>