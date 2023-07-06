<template>
    <div class="container">
        <el-form class="login" label-width="100px" :model="model" :rules="rules">
            <el-form-item>
                <h2 style="color: #888;">潍坊科技学院教务系统</h2>
            </el-form-item>
            <el-form-item label="用户名：" prop="user_name">
                <el-input v-model="model.user_name"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="user_pwd">
                <el-input v-model="model.user_pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { UserApi } from '@/api';
import { useRouter } from 'vue-router';
import { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const model = reactive<HttpPayload.Login>({ user_name: "", user_pwd: "" });
const formRef = ref<FormInstance | null>(null)
const rules: FormRules = {
    user_name: [
        { required: true, message: "用户名不能为空", trigger: "blur" },
        { min: 5, max: 8, message: "用户名长度5-8", trigger: "blur" }
    ],
    user_pwd: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        { min: 3, max: 8, message: "密码长度3-8", trigger: "blur" }
    ]
};
const login = async () => {
    try {
        await formRef.value?.validate();
        const token = await UserApi.login(model);
        sessionStorage.setItem('token', token);
        console.log(123)
        router.replace({ name: "Home" })
    } catch (e) {/*  */ }
};

</script>

<style lang="stylus" scoped>
.container
    width :100vw
    height :100vh
    background-image:url('./bg.jpg')
    background-size:cover
.login 
    width: 400px
    height: 300px
    box-sizing: border-box
    position: absolute
    top: 50%
    right: 15%
    transform: translateY(-60%)
    background-color: hsla(0,0%,100%,.9)
    display: flex
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
</style>
