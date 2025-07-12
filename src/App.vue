<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script setup lang="ts">
const globalParams = inject<{
	token: string | null
	productId: string | null
	selectedTemplateId: string | null
	selectedTemplateMediaUrl: string | null
	selectedSize: {width: number; height: number; unit: "in" | "ft"}
	returnUrl: string | null
}>("globalParams")

if (!globalParams || !globalParams.selectedTemplateId || !globalParams.selectedTemplateMediaUrl) {
	throw new Error("Missing required parameters!")
}
</script>

<style lang="less">
ul,
li {
	list-style: none;
}
svg {
	vertical-align: middle;
}
.vue-waterfall-easy-scroll {
	overflow: inherit !important;
}
</style>
