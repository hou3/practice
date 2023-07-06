import {defineStore} from 'pinia';
import {shallowRef} from 'vue';
import {TeacherApi} from '@/api'

export default defineStore('teacher', () => {
    const mathList = shallowRef<Array<HttpPayLoad.Teacher>>();//数学老师
    const deanList = shallowRef<Array<HttpPayLoad.Teacher>>();//教务老师
    const jobList =  shallowRef<Array<HttpPayLoad.Teacher>>();//就业老师
    const getMath = async () => {  //教学老师
        try{
            mathList.value = await TeacherApi.getMath(4)
        }catch(e){/** */}
    }
    const educational = async () => {  //教务老师
        try{
            deanList.value = await TeacherApi.getMath(5)
        }catch(e){/** */}
    }
    const obtain = async () => {  //教务老师
        try{
            jobList.value = await TeacherApi.getMath(6)
        }catch(e){/** */}
    }
    return {mathList, deanList, jobList, getMath, educational, obtain}
})