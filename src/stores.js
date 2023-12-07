import { writable } from "svelte/store";

const storedArray = JSON.parse(localStorage.getItem("save")||"[]");
export const savedArray = writable(storedArray);

savedArray.subscribe(value => {
	console.log(value)
    localStorage.setItem("save", JSON.stringify(value));
});