<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 16:04:59
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-12 16:37:40
 * @Description: 搜索组件
-->

<template>
	<div class="search-box">
		<Button
			type="text"
			class="back-btn"
			@click="clear"
			v-if="typeValue || searchKeyWord"
			icon="ios-arrow-back"
		></Button>

		<!-- <Select class="select" v-model="typeValue" :disabled="loading" @on-change="change">
			<Option v-for="item in typeList" :value="item.value" :key="item.value">
				{{ item.label }}
			</Option>
		</Select> -->
		<Input
			class="input"
			:placeholder="`Search within ${typeText}`"
			v-model="searchKeyWord"
			:disabled="loading"
			clearable
			@on-change="inputChange"
			@on-search="change"
			search
		/>
	</div>
</template>

<script name="ImportJson" setup>
import {debounce} from "lodash-es"

const props = defineProps({
	typeListApi: {
		type: Function,
		Object: () => ({})
	}
})
const emit = defineEmits(["change"])

const loading = ref(false)

const typeValue = ref("")
const searchKeyWord = ref("")
const typeList = ref([])
const typeText = computed(() => {
	const info = typeList.value.find((item) => item.value === typeValue.value)
	return info?.label || "All Items"
})

onMounted(async () => {
	loading.value = true

	try {
		const lng = [
			{
				id: 1,
				name: "Basic"
			},
			{
				id: 2,
				name: "Recommended"
			},
			{
				id: 4,
				name: "Stickers"
			}
		]
		const res = await props.typeListApi()
		const list = res.data.data.map((item) => {
			return {
				value: item.id,
				label: lng.find((el) => el.id === item.id)?.name ?? item.attributes.name
			}
		})
		typeList.value = [
			{
				label: "All Items",
				value: ""
			},
			...list
		]
	} catch (error) {
		console.log(error)
	}

	loading.value = false
})

const change = () => {
	emit("change", {searchKeyWord: searchKeyWord.value, typeValue: typeValue.value})
}

// const getValue = () => {
//   return { type: typeValue.value, searchKeyWord };
// };
const clear = () => {
	typeValue.value = ""
	searchKeyWord.value = ""
	change()
}

const setType = (type) => {
	typeValue.value = type
}

const inputChange = debounce(change, 300)

defineExpose({
	setType
})
</script>
<style scoped lang="less">
.search-box {
	padding-top: 10px;
	display: flex;

	.back-btn {
		margin-right: 10px;
	}
	.input {
		margin-left: 10px;
	}
	.select {
		width: 100px;
	}
}
</style>
