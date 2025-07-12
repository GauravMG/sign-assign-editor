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
				</div>
				<Right v-if="state.show" />
			</Content>
		</Layout>
	</div>
</template>

<script setup lang="ts">
import {reactive, ref, onMounted, onUnmounted, inject, provide} from "vue"
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

// Inject global params including selectedSize (width, height, unit)
const global = inject<{
	selectedSize: {width: number; height: number; unit: "in" | "ft"}
	selectedTemplateMediaUrl: string
	returnUrl: string
}>("globalParams")!

const modalVisible = ref(false)
const state = reactive({show: false, ruler: true})
const canvasEditor = new Editor() as IEditor

// Set fabric DPI for conversions (default 96 is standard CSS DPI)
fabric.DPI = 96

// Convert selectedSize (width/height) from ft or in to pixels
function unitToPx(value: number, unit: "in" | "ft") {
	if (unit === "ft") {
		return value * 12 * fabric.DPI // feet -> inches -> pixels
	}
	return value * fabric.DPI // inches -> pixels
}

let fixedW = 0,
	fixedH = 0

onMounted(() => {
	// Initialize fabric canvas
	const canvas = new fabric.Canvas("canvas", {
		fireRightClick: true,
		stopContextMenu: true,
		controlsAboveOverlay: true,
		preserveObjectStacking: true
	})
	canvasEditor.init(canvas)

	// Use plugins as before
	canvasEditor
		.use(DringPlugin)
		.use(PolygonModifyPlugin)
		.use(AlignGuidLinePlugin)
		.use(ControlsPlugin)
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

	// Convert selectedSize to px
	fixedW = unitToPx(global.selectedSize.width, global.selectedSize.unit)
	fixedH = unitToPx(global.selectedSize.height, global.selectedSize.unit)

	// Set fixed canvas size
	// canvas.setWidth(fixedW)
	// canvas.setHeight(fixedH)
	canvasEditor.setSize(fixedW, fixedH)

	console.log("Canvas fixed size before PSD load:", fixedW, fixedH)

	canvasEditor.on("sizeChange", () => {
		console.log("Intercepting sizeChange!")
		canvasEditor.setSize(fixedW, fixedH)

		const canvas = (canvasEditor as any).canvas(canvasEditor as any).canvas.renderAll()

		const bgRect = canvas.getObjects().find((obj) => obj.id === "fixedBackgroundRect")
		if (!bgRect) {
			const rect = new fabric.Rect({
				id: "fixedBackgroundRect",
				left: 0,
				top: 0,
				width: fixedW,
				height: fixedH,
				fill: "#ffffff",
				selectable: false,
				evented: false
			})
			canvas.insertAt(rect, 0)
		} else {
			bgRect.set({
				width: fixedW,
				height: fixedH
			})
		}

		canvas.requestRenderAll()
	})

	// Load PSD template
	async function loadPSDAndFit(url: string, fixedW: number, fixedH: number) {
		await canvasEditor.loadPSDFromUrl(url)

		// Wait for any async mutations the plugin does internally (next tick or frame)
		await new Promise((resolve) => requestAnimationFrame(resolve))

		const canvas = (canvasEditor as any).canvas

		// Force canvas to fixed size again
		canvas.setDimensions({width: fixedW, height: fixedH})

		// Optional: match HTML canvas style for clarity
		canvas.getElement().style.width = fixedW + "px"
		canvas.getElement().style.height = fixedH + "px"

		// Now get PSD group (may be group or multiple layers)
		const psdGroup = canvas
			.getObjects()
			.find((obj) => obj.type === "group" || obj.type === "activeSelection")

		if (psdGroup) {
			const padding = 20
			const maxWidth = fixedW - padding * 2
			const maxHeight = fixedH - padding * 2

			const scaleX = maxWidth / psdGroup.width!
			const scaleY = maxHeight / psdGroup.height!
			const scale = Math.min(scaleX, scaleY, 1)

			psdGroup.scale(scale)

			psdGroup.set({
				left: (fixedW - psdGroup.getScaledWidth()) / 2,
				top: (fixedH - psdGroup.getScaledHeight()) / 2
			})

			psdGroup.setCoords()
			canvas.renderAll()

			console.log("Canvas forced to fixed size:", fixedW, fixedH)
		}
	}
	loadPSDAndFit(global.selectedTemplateMediaUrl, fixedW, fixedH)
})

onUnmounted(() => canvasEditor.destory())

function rulerSwitch(val: boolean) {
	if (val) canvasEditor.rulerEnable()
	else canvasEditor.rulerDisable()
	document.activeElement?.blur()
}

provide("fabric", fabric)
provide("canvasEditor", canvasEditor)
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

// .canvas-box {
// 	position: relative;
// }
.canvas-box {
	position: relative;
	width: fit-content;
	height: fit-content;
	margin: 0 auto;
}

#canvas {
	display: block;
	width: 100%;
	height: 100%;
}

.inside-shadow {
	position: absolute;
	width: 100%;
	height: 100%;
	box-shadow: inset 0 0 9px 2px #0000001f;
	z-index: 2;
	pointer-events: none;
}

#canvas {
	/* Make canvas actual CSS size reflect fabric size */
	// width: 100%;
	// height: 100%;
	// margin: 0 auto;
	// display: block;
}

#workspace {
	flex: 1;
	width: 100%;
	position: relative;
	background: #f1f1f1;
	overflow: hidden;
}

.switch {
	margin-right: 10px;
}

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
