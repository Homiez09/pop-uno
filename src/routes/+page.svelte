<script lang="ts">
	import { count } from '../lib/store';

	let countValue: number;
	let main: HTMLElement;
	let countForSubmit = 0;

	count.subscribe((value) => {
		countValue = value;
	});

	const incrementCount = () => {
		count.update((n) => n + 1);
		countForSubmit++;
	};

	const spin = (node: Node) => {
		return {
			duration: 100,
			css: (t: any) => `transform: scale(${1.5 - 0.5 * t}) rotate(${-10 + t * 10}deg);`
		};
	};

	const setSubmitCount = () => {
		setInterval(() => {
			if (countForSubmit === 0) return;
			console.log("update: " + countForSubmit);
			// code here
			countForSubmit = 0;
		}, 30000);
	}

	setSubmitCount();
</script>

<svelte:head>
	<title>UNO</title>
	<meta name="title" content="POPUNO" />
	<meta name="description" content="DOG" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
</svelte:head>

<svelte:body on:keydown={incrementCount} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main
	bind:this={main}
	class="no-select w-full h-screen flex flex-col items-center bg-transparent"
	on:mousedown={incrementCount}
>
	<img src="/uno.jpg" alt="uno" class="block fixed object-cover w-full h-full -z-10" />
	<img src="/title.png" alt="uno" class="mt-8 sm:w-8/12 md:w-2/4 lg:w-1/4" />
	{#key $count}
		<p class="Prompt text-stroke-count text-5xl text-white mt-1 p-2" in:spin>
			{$count.toLocaleString()}
		</p>
	{/key}

	<p class="noselect text-3xl border-black text-white mt-8 bg-black rounded p-2">
		Total: {Math.round(1).toLocaleString()}
		<span class="text-xs ml-1 text-green-400">
			<!-- {pps !== undefined ? `${abbreviateNumber(pps)} PPS` : '...'} -->
			99 pps
		</span>
	</p>
</main>

<style>
	.no-select {
		user-select: none;
	}

	.text-stroke-count {
		-webkit-text-stroke-width: 1.5px;
		-webkit-text-stroke-color: #000;
	}
</style>
