import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const countTotal = writable((browser && localStorage.getItem('countTotal')) || '0');

countTotal.subscribe((val) => {
    if (browser) return (localStorage.countTotal = `${val}`);
})