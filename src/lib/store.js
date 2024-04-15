import dayjs from "dayjs";
import {writable} from "svelte/store";

export let inputTxt = writable()
export let formatador = writable(dayjs().format('DD-MM-YYYY'))

export let range = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]