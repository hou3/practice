// 1.使用createPinia创建pinia仓库对象对导出给main.js 去use
//2. 将所有的仓库有在这里统一导入再统一export导出 ，让组件使用的舒服一些。
import {createPinia} from 'pinia';
import useDashboard from './dashboard';
import useFunc from './func';
import useRoleStore from './role';
import useDictionaryStore from "./dictionary";
import useClassRoomStore from './classroom';
import useTeacherStore from './teacher';
import useClassStore from './class';

const pinia = createPinia();
export default pinia;
export {
        useDashboard,
        useFunc,
        useRoleStore,
        useDictionaryStore,
        useClassRoomStore,
        useTeacherStore,
        useClassStore,
}