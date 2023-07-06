<script setup lang="ts">
import EduMenu from './EduMenu.vue';
import EduTabs from './EduTabs.vue';
</script>

<template>
    <el-container class="common-layout">
        <el-aside>
            <EduMenu></EduMenu>
        </el-aside>
        <el-container>
            <el-header height="80px">
                <h1>教务系统2.0~</h1>
            </el-header>
            <el-main>
                <EduTabs></EduTabs>
            </el-main>
            <el-footer height="50px">
                <p>页脚</p>
            </el-footer>
        </el-container>
    </el-container>
</template>

<style scoped lang="stylus">
.common-layout 
    height: 100vh
.el-aside 
    background-color: #c45656
.el-header 
    background-color: #f89898
.el-footer
    background-color: #fab6b6
</style>