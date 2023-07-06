<script setup lang="ts">
import {useDashboard} from '@/store';

const dashboard = useDashboard();

</script>

<template>
	<el-tabs type="card"
	        v-model="dashboard.activeFunc"
	        @tab-remove="name => dashboard.removeTab(name as string)"
	        closable>
		<el-tab-pane v-for="tab in dashboard.tabs"
		            :key="tab.split('&&')[0]"
		            :label="tab.split('&&')[1]"
					:name="tab">
			<suspense>
				<template #fallback>
					<p>loading...</p>
				</template>
				<!--component可以指定is属性动态渲染组件-->
				<component :is="dashboard.funcMap[tab.split('&&')[0] as keyof typeof dashboard.funcMap ]"></component>
			</suspense>

		</el-tab-pane>
	</el-tabs>
</template>

<style scoped>

</style>