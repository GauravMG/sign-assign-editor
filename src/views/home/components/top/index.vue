<template>
	<Header>
		<div class="left">
			<!-- <logo></logo> -->
			<img src="http://3.109.198.252/images/logo.png?t=1752042560" alt="Sign Assign" />
			<Divider type="vertical" />

			<!-- 导入 -->
			<!-- <import-Json></import-Json> -->
			<!-- <Divider type="vertical" /> -->
			<!-- <import-file></import-file>
			<Divider type="vertical" /> -->
			<!-- <Button type="text" to="/template" target="_blank">全部模板</Button> -->
			<!-- <Divider type="vertical" /> -->

			<myTemplName></myTemplName>
			<!-- 标尺开关 -->
			<Tooltip :content="$t('grid')">
				<iSwitch v-model="toggleModel" size="small" class="switch"></iSwitch>
			</Tooltip>
			<Divider type="vertical" />
			<history></history>
		</div>

		<div class="right">
			<!-- <a href="https://pro.kuaitu.cc/" target="_blank" alt="商业版">
				<img width="15" :src="proIcon" alt="vue-fbric-editor" />
			</a> -->
			<!-- 管理员模式 -->
			<admin />
			<!-- 预览 -->
			<previewCurrent />
			<!-- <waterMark /> -->
			<!-- <save></save> -->
			<!-- <login></login> -->
			<!-- <lang></lang> -->

			<!-- <Button type="primary" @click="onContinue">Continue</Button> -->
			<Button type="primary" @click="goToCart">Proceed to Cart</Button>
		</div>
	</Header>

	<Modal v-model="modalVisible" title="🚀 Next Steps">
		<div style="flex: 1">
			<p style="font-size: 14px; color: #555; line-height: 1.6">
				Please review your design. If everything looks good, click the
				<strong>Add to Cart</strong>
				button below to proceed. Otherwise, use the
				<strong>Edit Design</strong>
				button to make changes.
			</p>
		</div>

		<template #footer>
			<Button type="primary" @click="goToCart">Proceed to Cart</Button>
		</template>
	</Modal>
</template>

<script name="Top" setup lang="ts">
import {inject, ref} from "vue"

const canvasEditor = inject("canvasEditor") as any
const uploading = ref(false)

import proIcon from "@/assets/icon/proIcon.png"
// 导入元素
import importJson from "@/components/importJSON.vue"
import importFile from "@/components/importFile.vue"

// 顶部组件
import logo from "@/components/logo.vue"
import myTemplName from "@/components/myTemplName.vue"
import previewCurrent from "@/components/previewCurrent"
import save from "@/components/save.vue"
import lang from "@/components/lang.vue"
import waterMark from "@/components/waterMark.vue"
import login from "@/components/login"
import admin from "@/components/admin"
import history from "@/components/history.vue"

const modalVisible = ref(false)

const global = inject<{
	token: string
	productId: string
	selectedTemplateId: string
	returnUrl: string
}>("globalParams")!

const props = defineProps(["ruler"])
const emit = defineEmits(["update:ruler"])

const toggleModel = computed({
	get() {
		return props.ruler
	},
	set(value) {
		emit("update:ruler", value)
	}
})

function onContinue() {
	modalVisible.value = true
}

async function goToCart() {
	if (!canvasEditor || !canvasEditor.canvas) {
		alert("Canvas is not initialized.")
		return
	}

	uploading.value = true
	console.log("Uploading your design...")

	try {
		const svgString = canvasEditor.canvas.toSVG()

		const blob = new Blob([svgString], {type: "image/svg+xml"})
		const file = new File([blob], "design.svg", {
			type: "image/svg+xml"
		})

		const formData = new FormData()
		formData.append("file", file)

		let headers = {}
		// const token = localStorage.getItem("token") || ""
		// if (token) {
		headers = {
			Authorization: `Bearer ${global.token}`
		}
		// }

		// const apiUrl = "https://6vqt42ml-9101.inc1.devtunnels.ms"
		const apiUrl = "http://3.109.198.252/api"
		const response = await fetch(`${apiUrl}/v1/upload/artwork`, {
			method: "POST",
			headers,
			body: formData
		})

		if (!response.ok) {
			throw new Error("Upload API failed")
		}

		const {data} = await response.json()
		console.log("Upload successful:", data)
		alert("Design uploaded successfully!")

		const returnUrl = global.returnUrl
		const productId = global.productId
		const selectedTemplateId = global.selectedTemplateId

		const dataObj = {
			url: data.url,
			previewUrl: data.previewUrl,
			name: data.name,
			size: data.size,
			mediaType: data.mediaType
		}

		const params = new URLSearchParams()
		params.set("productId", productId)
		params.set("selectedTemplateId", selectedTemplateId)
		params.set("dataObject", JSON.stringify(dataObj))

		const encoded = btoa(params.toString())

		const separator = returnUrl.includes("?") ? "&" : "?"
		window.location.href = `${returnUrl}${separator}data=${encoded}`
	} catch (error) {
		console.error(error)
		alert("Failed to upload design.")
	} finally {
		uploading.value = false
	}
}
</script>

<style lang="less" scoped>
.left,
.right {
	display: flex;
	align-items: center;
	img {
		display: block;
		margin-right: 10px;
	}
}
</style>
