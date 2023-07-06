<script setup lang="ts">
import { useClassRoomStore } from '@/store';
import { markRaw, onMounted, reactive, nextTick } from 'vue';
import { ElMessage, ElMessageBox, FormRules, FormInstance } from 'element-plus';

const classroomStore = useClassRoomStore();

const classroomEdit = reactive<{ isEdit: boolean; model: HttpPayload.GetClassRoom; formRef: null | FormInstance; rules: FormRules }>({
   isEdit: false,
   model: { clsr_id: 0, clsr_name: "", clsr_occupy: 0 },
   formRef: null,
   rules: markRaw({
      clsr_name: [
         {
            validator: (type, value, callback) => {
               if (value === '')   //非空验证
                  callback(new Error("* 教室名不能为空"));
               else if (value.length < 2 || value.length > 20)  //长度验证
                  callback(new Error("* 教室名长度2 - 20"));
               else if (classroomStore.allClrs.some(classroom => classroom.clsr_name === value && classroom.clsr_id !== classroomEdit.model.clsr_id))  //唯一性验证
                  callback(new Error("* 教室已存在"));
               else
                  callback();
            },
            trigger: "blur"
         }
      ]
   })
})

onMounted(() => {
   try {
      classroomStore.init();
   } catch (e) {/**/ }
})

const beginAdd = () => {
   classroomEdit.formRef?.resetFields();
   classroomEdit.model = { clsr_id: 0, clsr_name: "", clsr_occupy: 0 };
   nextTick(() => classroomEdit.isEdit = true);
}

const beginUpdate = (classroom: Vm.ClassRoom) => {
   classroomEdit.formRef?.resetFields();
   classroomEdit.model = { ...classroom };
   nextTick(() => classroomEdit.isEdit = true);
}

const remove = async (classroom: Vm.ClassRoom) => {
   try {
      await ElMessageBox.confirm(`确定要删除教室: ${classroom.clsr_name} 吗? `, '提示', { type: "warning" });
      await classroomStore.remove(classroom.clsr_id);
      ElMessage({ type: "success", message: `教室: ${classroom.clsr_name} 删除成功..` })
   } catch (e) {/**/ }
};

const save = async () => {
   try {
      await classroomEdit.formRef?.validate();
      await classroomStore[classroomEdit.model.clsr_id === 0 ? "add" : "update"](classroomEdit.model);
      ElMessage({ type: "success", message: "教室编辑成功" });
      classroomEdit.isEdit = false;
   } catch (e) {/**/ }
};

</script>

<template>
   <el-container>
      <el-header class="box">
         <div class="state-header">
            <span class="state-free"></span>空闲
         </div>
         <div class="state-header">
            <span class="state-occupy"></span>使用中
         </div>
      </el-header>
      <el-container style="padding: 20px;">
         <el-row :gutter="30">
            <el-card shadow="always" v-for="item in classroomStore.allClrs" :key="item.clsr_id"
               :class="{ active: item.clsr_occupy === 1 }">
               <span>{{ item.clsr_name }}</span>
               <div class="btn-wrapper">
                  <el-button @click="beginUpdate(item)">编辑</el-button>
                  <el-button @click="remove(item)" v-if="item.clsr_occupy === 0">删除</el-button>
               </div>
            </el-card>
            <el-card class="card-always">
               <span @click="beginAdd()">+</span>
            </el-card>
         </el-row>
         <el-dialog v-model="classroomEdit.isEdit" title="教室编辑">
            <el-form :model="classroomEdit.model">
               <el-form-item label="教室名称:" prop="role_name">
                  <el-input v-model.trim="classroomEdit.model.clsr_name"></el-input>
               </el-form-item>
               <!-- <el-form-item label="教室空闲">
                  <el-radio-group v-model="classroomEdit.model.clsr_occupy"
                     :disabled="classroomEdit.model.clsr_id !== 0">
                     <el-radio :label="0" size="large">空闲</el-radio>
                     <el-radio :label="1" size="large">使用中</el-radio>
                  </el-radio-group>
               </el-form-item> -->
               <el-form-item>
                  <el-button @click="save">确定</el-button>
                  <el-button @click="classroomEdit.isEdit = false">取消</el-button>
               </el-form-item>
            </el-form>
         </el-dialog>
      </el-container>
   </el-container>
</template>

<style scoped lang="stylus">
.el-container
   padding: 0 20px
   box-sizing: border-box
.el-header
   height: 20px!important
   display: flex
   justify-content: flex-start
   box-sizing: border-box
.box
   display: flex
   align-items: center
   margin: 20px 0 20px 20px
.state-header
   display: flex
   justify-content: center
   margin: 0 20px
   height: 20px;
.state-free::before
   content: ""
   display: inline-block
   background-color: #67c23a
   border-radius: 50%
   margin-right: 10px
   width :20px
   height :20px
.state-occupy::before
   content: ""
   display: inline-block
   background-color: #e6a23c
   border-radius: 50%
   margin-right: 10px
   width :20px
   height :20px
.el-card
   display: flex
   justify-content: center
   align-items: center
   border-radius: 10px
   background-color: rgb(103, 194, 58)
   position: relative
   height: 100px
   width: 200px
   .btn-wrapper
      position: absolute
      top:0
      left:0
      width: 100%
      height: 100%
      background-color: rgba(0,0,0,0.5)
      display: none
   &:hover .btn-wrapper
      display: flex
      justify-content: center
      align-items: center

.active
   background-color: #e6a23c 
</style>