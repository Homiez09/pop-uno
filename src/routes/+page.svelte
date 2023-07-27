<script lang="ts">
	import { count } from '$lib/store';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';

	const pb = new PocketBase('https://pop-uno.pockethost.io');

	let countValue: number;
	let main: HTMLElement;
	let countForSubmit = 0;
	let clicked = false;

	count.subscribe((value) => {
		countValue = value;
	});

	const incrementCount = () => {
		if (clicked) return;
		count.update((n) => n + 1);
		countForSubmit++;
		clicked = true;
	};

	const resetClicked = () => {
		clicked = false;
	};

	const spin = (node: Node) => {
		return {
			duration: 100,
			css: (t: any) => `transform: scale(${1.5 - 0.5 * t}) rotate(${-10 + t * 10}deg);`
		};
	};

	const setSubmitCount = () => {
		setInterval(async () => {
			if (countForSubmit === 0) return;
			console.log('update: ' + countForSubmit);
			// example update data
			const data = {
				count: 1
			};

			const record = await pb.collection('records').update('6vudsot1eqffv7z',data);
			countForSubmit = 0;
		}, 30000);
	};

	setSubmitCount();

	onMount(async () => {});
</script>

<svelte:body on:keydown={incrementCount} on:keyup={resetClicked} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main
	bind:this={main}
	class="no-select w-full h-screen flex flex-col items-center bg-transparent"
	on:mousedown={incrementCount}
	on:mouseup={resetClicked}
>
	<img src="/uxno.jpg" alt="uno" class="block fixed object-cover w-full h-full -z-10" />
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
			99 ppsx
		</span>
	</p>
</main>

<!-- @firebase/firestore: Firestore (10.1.0): Could not reach Cloud Firestore backend. Connection failed 1 times. Most recent error: FirebaseError: [code=permission-denied]: Permission denied: Consumer 'project:undefined' has been suspended.
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend. -->

<!-- +page.svelte:53 Uncaught (in promise) FirebaseError: Failed to get document because the client is offline. -->

<style>
	.no-select {
		user-select: none;
	}

	.text-stroke-count {
		-webkit-text-stroke-width: 1.5px;
		-webkit-text-stroke-color: #000;
	}
</style>
