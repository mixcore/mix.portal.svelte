<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => switchToLanguage('en-us')}>en-us</button>
	<button onclick={() => switchToLanguage('zh-cn')}>zh-cn</button>
	<button onclick={() => switchToLanguage('es-es')}>es-es</button>
	<button onclick={() => switchToLanguage('hi-in')}>hi-in</button>
	<button onclick={() => switchToLanguage('fr-fr')}>fr-fr</button>
	<button onclick={() => switchToLanguage('ar-sa')}>ar-sa</button>
	<button onclick={() => switchToLanguage('bn-bd')}>bn-bd</button>
	<button onclick={() => switchToLanguage('ru-ru')}>ru-ru</button>
	<button onclick={() => switchToLanguage('pt-br')}>pt-br</button>
	<button onclick={() => switchToLanguage('id-id')}>id-id</button>
	<button onclick={() => switchToLanguage('de-de')}>de-de</button>
	<button onclick={() => switchToLanguage('ja-jp')}>ja-jp</button>
	<button onclick={() => switchToLanguage('tr-tr')}>tr-tr</button>
	<button onclick={() => switchToLanguage('ko-kr')}>ko-kr</button>
	<button onclick={() => switchToLanguage('it-it')}>it-it</button>
	<button onclick={() => switchToLanguage('pl-pl')}>pl-pl</button>
	<button onclick={() => switchToLanguage('nl-nl')}>nl-nl</button>
	<button onclick={() => switchToLanguage('vi-vn')}>vi-vn</button>
	<button onclick={() => switchToLanguage('th-th')}>th-th</button>
	<button onclick={() => switchToLanguage('fa-ir')}>fa-ir</button>
</div>
