import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const count = writable(+((browser && localStorage.getItem('count')) || '0'));
export const tempCount = writable(+((browser && localStorage.getItem('tempCount')) || '0'));
export const totalCount = writable((browser && localStorage.getItem('countTotal')) || '0');

count.subscribe((val) => {
  if (browser) return (localStorage.count = `${val}`);
});

tempCount.subscribe((val) => {
    if (browser) return (localStorage.tempCount = `${val}`);
})

totalCount.subscribe((val) => {
  if (browser) return (localStorage.countTotal = `${val}`);
})