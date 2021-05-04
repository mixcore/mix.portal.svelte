import {getDefaultAxiosConfiguration ,MixRestService} from "./mix-lib"
import { onMount } from 'svelte';

export let count = 0;
export let text = '';

export function mainIncrement() {
	return (count += 1);
}
export class PostService extends MixRestService {
	// constructor() {
	//   var conf = getDefaultAxiosConfiguration();
	//   conf.withCredentials = false;
	//   conf.baseURL = 'https://localhost:5001/api/v1/rest/en-us';
	// //   super('post', 'mvc', null, conf);
	// }
  }

let photos = [];

onMount(async () => {
	const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
	photos = await res.json();

	// MixRestService.
	// this.srv.get('').then((resp) => console.log(resp));
});