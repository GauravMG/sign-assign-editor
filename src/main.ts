import {createApp, reactive} from "vue"
import App from "./App.vue"
import router from "./router"
import ViewUiPlus from "view-ui-plus"
import "view-ui-plus/dist/styles/viewuiplus.css"
import VueLazyLoad from "vue3-lazyload"
import {VueMasonryPlugin} from "vue-masonry"
import "@/assets/fonts/font.css"
import i18n from "./language/index"

async function bootstrap() {
	const app = createApp(App)

	// 📌 parse URL data once, globally
	const raw = window.location.search
	const encoded = new URLSearchParams(raw).get("data") || ""
	let decoded = ""
	try {
		decoded = atob(encoded)
	} catch {}
	const p = new URLSearchParams(decoded)
	const globalParams = reactive({
		token: p.get("token"),
		productId: p.get("productId"),
		selectedTemplateId: p.get("selectedTemplateId"),
		selectedSize: JSON.parse(p.get("selectedSize") || "{}"),
		returnUrl: p.get("returnUrl")
	})

	// Provide for injection in child components
	app.provide("globalParams", globalParams)

	app.use(VueMasonryPlugin)
	app.use(router)
	app.use(i18n)
	app.use(VueLazyLoad, {})
	app.use(ViewUiPlus)

	await router.isReady()
	app.mount("#app")
}

bootstrap()
