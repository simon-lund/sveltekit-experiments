export async function load({ url }) {
	const skip = Number(url.searchParams.get('skip') || 0);
	const limit = Number(url.searchParams.get('limit') || 10);

	const res = await fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`);
	const data = await res.json();

	return {
		skip,
		limit,
		total: data.total,
		products: data.products,
	};
}
