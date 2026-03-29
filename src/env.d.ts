/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
// 声明 Markdown 组件类型，消除 IDE 报错
declare module "@components/misc/Markdown.astro" {
	import type { ComponentType } from "astro";
	const Markdown: ComponentType;
	export default Markdown;
}
