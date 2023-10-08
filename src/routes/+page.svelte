<script lang="ts">
	import { count, tempCount, totalCount } from '$lib/stores/count';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import {Howl} from 'howler';
	import type { DataInterface } from '$lib/types/DataInterface';


	const pb = new PocketBase('https://pop-uno.pockethost.io');
	
	let main: HTMLElement;
	let clicked: boolean = false;
	let pps: number = 0;

	const audio = new Howl({
      src: ['/effects/pop.mp3']
    });

	const incrementCount = () => {
		if (clicked) return;
		audio.play();
		count.update((n) => n + 1);
		tempCount.update((n) => n + 1);
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

	const updateCountRecord = () => {
		setInterval(async () => {
			getTotalCount() 

			if (!$tempCount) return;
			await pb.collection('records').update<DataInterface>('r68rzn7phg2oplq', {
				"name": "uno",
				"count+" : $tempCount
			}).then(
				() => {
					tempCount.set(0);
				}
			)

		}, 1000);
	};

	const getTotalCount = async () => {
		let record = await pb.collection('records').getOne("r68rzn7phg2oplq");
			pps = record.count - parseInt($totalCount);
			let countTotal = record.count;
			totalCount.set(countTotal.toString());
	};

	const abbreviateNumber = (pps: number) => {
		const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
		const tier = (Math.log10(pps) / 3) | 0;
		if (tier === 0) return pps;
		const suffix = SI_SYMBOL[tier];
		const scale = Math.pow(10, tier * 3);
		const scaled = pps / scale;
		return scaled.toFixed(1) + suffix;
	}

	onMount(async () => {
		updateCountRecord();
		await pb.autoCancellation(false);
	
	});

</script>

<svelte:body on:keydown={incrementCount} on:keyup={resetClicked}/>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main
	bind:this={main}
	class="no-select w-full h-screen flex flex-col items-center bg-transparent"
	on:mousedown={incrementCount}
	on:mouseup={resetClicked}
>
	<img src="/uno.jpg" alt="uno" class="block fixed object-cover w-full h-full -z-10 bg-black" />
	<img src="/title.png" alt="uno" class="mt-8 sm:w-8/12 md:w-2/4 lg:w-1/4" />

	{#key $count}
		<p class="Prompt text-stroke-count text-5xl text-white mt-1 p-2" in:spin>
			{$count.toLocaleString()}
		</p>
	{/key}

	<p class="noselect text-3xl border-black text-white mt-8 bg-black rounded p-2">
		Total: {(parseInt($totalCount) + $tempCount).toLocaleString()}
		<span class="text-xs ml-1 text-green-400">
			{pps !== undefined ? `+${abbreviateNumber(pps)} PPS` : '...'}
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
