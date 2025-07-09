<template>
	<div class="home">
		<Layout>
			<Top v-if="state.show" :ruler="state.ruler" @update:ruler="rulerSwitch" />
			<Content style="display: flex; height: calc(100vh - 64px); position: relative">
				<Left v-if="state.show" />
				<div id="workspace" style="flex: 1; position: relative">
					<div class="canvas-box">
						<div class="inside-shadow"></div>
						<canvas id="canvas" :class="state.ruler ? 'design-stage-grid' : ''" />
						<dragMode v-if="state.show" />
						<zoom />
					</div>
					<Button
						type="primary"
						@click="onLoadPSD"
						style="position: absolute; top: 10px; right: 10px"
					>
						Load PSD
					</Button>
				</div>
				<Right v-if="state.show" />
			</Content>
		</Layout>
	</div>
</template>

<script setup lang="ts">
import {reactive, ref, onMounted, onUnmounted, inject} from "vue"
import {fabric} from "fabric"

import Top from "./components/top/index.vue"
import Left from "./components/left/index.vue"
import Right from "./components/right/index.vue"

import zoom from "@/components/zoom.vue"
import dragMode from "@/components/dragMode.vue"

import Editor, {
	IEditor,
	DringPlugin,
	AlignGuidLinePlugin,
	ControlsPlugin,
	// ControlsRotatePlugin,
	CenterAlignPlugin,
	LayerPlugin,
	CopyPlugin,
	MoveHotKeyPlugin,
	DeleteHotKeyPlugin,
	GroupPlugin,
	DrawLinePlugin,
	GroupTextEditorPlugin,
	GroupAlignPlugin,
	WorkspacePlugin,
	HistoryPlugin,
	FlipPlugin,
	RulerPlugin,
	MaterialPlugin,
	WaterMarkPlugin,
	FontPlugin,
	PolygonModifyPlugin,
	DrawPolygonPlugin,
	FreeDrawPlugin,
	PathTextPlugin,
	PsdPlugin,
	SimpleClipImagePlugin,
	BarCodePlugin,
	QrCodePlugin,
	ImageStroke,
	ResizePlugin,
	LockPlugin,
	AddBaseTypePlugin,
	MaskPlugin
} from "@kuaitu/core"

const APIHOST = import.meta.env.APP_APIHOST

const global = inject<{
	selectedSize: {width: number; height: number; unit: "in" | "ft"}
	returnUrl: string
}>("globalParams")!

const modalVisible = ref(false)
const state = reactive({show: false, ruler: true})
const canvasEditor = new Editor() as IEditor

// DPI & unit-to-pixel conversion
fabric.DPI = 300
function unitToPx(v: number, unit: "in" | "ft") {
	if (unit === "ft") return v * 12 * fabric.DPI
	return fabric.util.parseUnit(`${v}in`)
}

let fixedW = 0,
	fixedH = 0

onMounted(() => {
	const canvas = new fabric.Canvas("canvas", {
		fireRightClick: true, // 启用右键，button的数字为3
		stopContextMenu: true, // 禁止默认右键菜单
		controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
		// imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
		preserveObjectStacking: true // 当选择画布中的对象时，让对象不在顶层。
	})
	canvasEditor.init(canvas)
	canvasEditor
		.use(DringPlugin)
		.use(PolygonModifyPlugin)
		.use(AlignGuidLinePlugin)
		.use(ControlsPlugin)
		// .use(ControlsRotatePlugin)
		.use(CenterAlignPlugin)
		.use(LayerPlugin)
		.use(CopyPlugin)
		.use(MoveHotKeyPlugin)
		.use(DeleteHotKeyPlugin)
		.use(GroupPlugin)
		.use(DrawLinePlugin)
		.use(GroupTextEditorPlugin)
		.use(GroupAlignPlugin)
		.use(WorkspacePlugin)
		.use(HistoryPlugin)
		.use(FlipPlugin)
		.use(RulerPlugin)
		.use(DrawPolygonPlugin)
		.use(FreeDrawPlugin)
		.use(PathTextPlugin)
		.use(SimpleClipImagePlugin)
		.use(BarCodePlugin)
		.use(QrCodePlugin)
		.use(FontPlugin, {
			repoSrc: APIHOST
		})
		.use(MaterialPlugin, {
			repoSrc: APIHOST
		})
		.use(WaterMarkPlugin)
		.use(PsdPlugin)
		.use(ImageStroke)
		.use(ResizePlugin)
		.use(LockPlugin)
		.use(AddBaseTypePlugin)
		.use(MaskPlugin)

	state.show = true
	if (state.ruler) canvasEditor.rulerEnable()

	// Set fixed canvas size:
	fixedW = Number(unitToPx(global.selectedSize.width, global.selectedSize.unit))
	fixedH = Number(unitToPx(global.selectedSize.height, global.selectedSize.unit))
	canvas.setWidth(fixedW)
	canvas.setHeight(fixedH)

	console.log("Canvas fixed size:", fixedW, "×", fixedH)
})

onUnmounted(() => canvasEditor.destory())

function onLoadPSD() {
	const beforeW = fixedW,
		beforeH = fixedH
	console.log("Before loading PSD; canvas size:", fixedW, fixedH)

	canvasEditor.insertPSD().then(() => {
		// the PSD plugin may have resized the canvas internally
		const canvas = (canvasEditor as any).canvas // bypass TS encapsulation
		canvas.setWidth(beforeW)
		canvas.setHeight(beforeH)
		canvas.renderAll()

		console.log("After PSD insert, canvas size STILL:", fixedW, fixedH)
		// Done—canvas dimensions remain unchanged.
	})
}

function rulerSwitch(val: boolean) {
	val ? canvasEditor.rulerEnable() : canvasEditor.rulerDisable()
	document.activeElement?.blur()
}

provide("fabric", fabric)
provide("canvasEditor", canvasEditor)
// provide('mixinState', mixinState);
</script>

<style lang="less" scoped>
:deep(.ivu-layout-header) {
	--height: 45px;
	padding: 0 0px;
	border-bottom: 1px solid #eef2f8;
	background: #fff;
	height: var(--height);
	line-height: var(--height);
	display: flex;
	justify-content: space-between;
}

.home,
.ivu-layout {
	height: 100vh;
}

.icon {
	display: block;
}

.canvas-box {
	position: relative;
}

// 画布内阴影
.inside-shadow {
	position: absolute;
	width: 100%;
	height: 100%;
	box-shadow: inset 0 0 9px 2px #0000001f;
	z-index: 2;
	pointer-events: none;
}

#canvas {
	width: 300px;
	height: 300px;
	margin: 0 auto;
}

#workspace {
	flex: 1;
	width: 100%;
	position: relative;
	background: #f1f1f1;
	overflow: hidden;
}

// 标尺
.switch {
	margin-right: 10px;
}

// 网格背景
.design-stage-grid {
	--offsetX: 0px;
	--offsetY: 0px;
	--size: 16px;
	--color: #dedcdc;
	background-image: linear-gradient(
			45deg,
			var(--color) 25%,
			transparent 0,
			transparent 75%,
			var(--color) 0
		),
		linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
	background-position: var(--offsetX) var(--offsetY),
		calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
	background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
