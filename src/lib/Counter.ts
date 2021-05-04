import { getDefaultAxiosConfiguration, MixRestService } from "./mix-lib";
import { MixModelType } from './model-type.enums';
import { onMount } from 'svelte';
import type { MixPostMvc } from "./mix-post-mvc";

export let count = 0;
export let text = '';


export function mainIncrement() {
	return (count += 1);
}

export class PostService extends MixRestService<MixPostMvc> {
	constructor() {
		let appUrl = 'https://store.mixcore.org/api/v1/rest/';
		let viewName = 'mvc';
		let specificulture = 'en-us';
		var conf = getDefaultAxiosConfiguration();
		conf.withCredentials = false;
		super(appUrl, MixModelType.Post, viewName, specificulture, conf);
	}
	public getSingleModel(id: any) {
		let queries = {
			kw: 'test'
		};
		return super.getSingleModel(id, queries);
	}
}

export let response = [];

onMount(async () => {
	var srv = new PostService();
	srv.getListModel().then(resp => {
		response = resp.items;
		console.log(resp);
	})
});