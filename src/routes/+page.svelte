<script lang="ts">
	import { count, tempCount, totalCount } from '$lib/stores/count';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import {Howl} from 'howler';
	import type { DataInterface } from '$lib/types/DataInterface';


	const pb = new PocketBase('https://pop-uno.pockethost.io');
	
	let main: HTMLElement;
	let clicked: boolean = false;
	let ppsShow: number = 0;
	let pps: number = 0;

	const audio = new Howl({
      src: ['/effects/pop.mp3']
    });

	const incrementCount = () => {
		pps++;
		audio.play();
		count.update((n) => n + 1);
		tempCount.update((n) => n + 1);
	};

	const incrementKeyPressCount = () => {
		if (clicked) return;
		clicked = true;
		incrementCount();
	}

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
		getTotalCount();
		setInterval(async () => {
			if (!$tempCount) return;
			await pb.collection('records').update<DataInterface>('r68rzn7phg2oplq', {
				"name": "uno",
				"count+" : $tempCount
			}).then((data) => {
				$tempCount = 0;
			})
			
		}, 1000);
	};

	const getTotalCount = async () => {
		let record = await pb.collection('records').getOne("r68rzn7phg2oplq");
		pps = (record.count - parseInt($totalCount) > 0) ? record.count - parseInt($totalCount) : 0;
		ppsShow = pps;
		pps = 0;
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

	const ppsShowUpdate = () => {
		setInterval(async() => {
			ppsShow = pps;
			pps = 0;
		}, 1000);
	}

	onMount(async () => {
		updateCountRecord();
		ppsShowUpdate();
		await pb.autoCancellation(false);
	});

</script>

<svelte:body on:keydown={incrementKeyPressCount} on:keyup={resetClicked}/>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main
	bind:this={main}
	class="no-select w-full h-screen flex flex-col items-center bg-transparent"
	on:mousedown={incrementCount}
	
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
			{`+ ${abbreviateNumber(ppsShow)} PPS`}
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
