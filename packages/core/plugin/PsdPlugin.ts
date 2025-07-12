/*
 * @Author: 秦少卫
 * @Date: 2024-05-27 16:09:29
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-08 18:31:24
 * @Description: PSD插件
 */
import {fabric} from "fabric"
import {selectFiles} from "../utils/utils"
import psdToJson from "../utils/psd"
import Psd from "@webtoon/psd"
import type {IEditor, IPluginTempl} from "@kuaitu/core"

type IPlugin = Pick<PsdPlugin, "insertPSD" | "loadPSDFromUrl">

declare module "@kuaitu/core" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface IEditor extends IPlugin {}
}

class PsdPlugin implements IPluginTempl {
	static pluginName = "PsdPlugin"
	static apis = ["insertPSD", "loadPSDFromUrl"]

	constructor(public canvas: fabric.Canvas, public editor: IEditor) {}

	insertPSD(callback?: () => void) {
		return new Promise((resolve, reject) => {
			selectFiles({accept: ".psd"})
				.then((files) => {
					if (files && files.length > 0) {
						const file = files[0]
						const reader = new FileReader()
						reader.readAsText(file, "UTF-8")
						reader.onload = async () => {
							const result = await file.arrayBuffer()
							const psdFile = Psd.parse(result as ArrayBuffer)
							console.log(psdFile, "11111")
							const json = await psdToJson(psdFile)
							this.loadJSON(json, callback)
							resolve("")
						}
					}
				})
				.catch(reject)
		})
	}

	/**
	 * Load a PSD file from a remote URL.
	 * @param url URL of the PSD file
	 * @param callback Optional callback after loading
	 */
	async loadPSDFromUrl(url: string, callback?: () => void): Promise<void> {
		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`Failed to fetch PSD: ${response.statusText}`)
			}
			const arrayBuffer = await response.arrayBuffer()
			const psdFile = Psd.parse(arrayBuffer)
			console.log(psdFile, "PSD loaded from URL")
			const json = await psdToJson(psdFile)
			this.loadJSON(json, callback)
		} catch (error) {
			console.error("Error loading PSD from URL:", error)
			throw error
		}
	}

	loadJSON(json: string, callback?: () => void) {
		this.editor.loadJSON(json, callback)
	}
}

export default PsdPlugin
