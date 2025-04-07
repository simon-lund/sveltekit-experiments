<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const { data } = $props();
	let limit = $derived(data.limit);

	function next() {
		const url = new URL(page.url);
		url.searchParams.set('skip', String(data.skip + limit));
		url.searchParams.set('limit', String(limit));

		goto(url, { noScroll: true });
	}

	function prev() {
		const url = new URL(page.url);
		url.searchParams.set('skip', String(data.skip - limit));
		url.searchParams.set('limit', String(limit));

		goto(url, { noScroll: true });
	}
</script>

<main class="container mx-auto prose py-24">
	<h1>Pagination</h1>

	<p>
		Until recently, I hadn't needed search params in my SvelteKit apps.
		However, implementing pagination for my current project required managing search params like <code>skip</code> and <code>limit</code> (or sometimes <code>page</code> and <code>pageSize</code>).
 </p>

	<p>
		Initially, I thought creating a dedicated API endpoint was necessary for handling pagination requests.
		But I quickly realized that SvelteKit offers a simpler approach with the built-in <code>load</code> function, which automatically fetches data on page load or form submission.
		I already used the <code>load</code> function for other data fetching tasks, but I didn't consider it for pagination, because I thought changing parameters in the URL wouldn't trigger a page reload.
	</p>

	<p>
		However, I was mistaken! The <code>load</code> function is rerun when the URL changes, allowing you to use query parameters to pass data to it (see the <a href="https://svelte.dev/docs/kit/load#Rerunning-load-functions">documentation</a>).
		This technique not only simplifies data fetching but also integrates seamlessly with browser navigation.
		If properly implemented, it supports the browser's back and forward buttons, maintains state on page reload, and allows easy sharing of paginated views through URLs.<p>
	</p>

	<h2>
		Demo
	</h2>

	<p>
		Use the <code>next</code> and <code>prev</code> buttons below to navigate through the paginated products.
		You can also adjust the number of products displayed per page using the <code>limit</code> input field.
		The products are fetched by the <code>load</code> function defined in <code>+page.server.ts</code>.
	</p>

	<div class="border p-4 mb-4 space-y-4 not-prose">
		<div>
			<h3 class="font-bold">State</h3>
			<span>Skip: {data.skip}</span>
			<br />
			<span>Limit: {data.limit}</span>
			<br />
			<span>Total: {data.total}</span>
		</div>
		<div>
			<h3 class="font-bold">Controls</h3>
			<label class="input">
				<span>Limit</span>
				<input type="number" id="limit" bind:value={limit} />
			</label>
			<div class="flex gap-4 mt-2">
				<button onclick={prev} disabled={data.skip === 0} class="btn">Prev</button>
				<button onclick={next} disabled={data.skip + limit >= data.total} class="btn">Next</button>
			</div>
		</div>
		<div>
			<span class="font-bold">Products:</span>
			<ul class="list-disc list-inside">
				{#each data.products as product (product.id)}
					<li>{product.title}</li>
				{/each}
			</ul>
		</div>
	</div>
</main>