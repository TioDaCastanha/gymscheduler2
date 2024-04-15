<script lang="ts">
    import Agendamento from "$lib/Agendamento.svelte";
    import Calendario from "$lib/Calendario.svelte";
    import {inputTxt, formatador, range} from "$lib/store";
    import Lista from "$lib/Lista.svelte";
    import { createEventDispatcher, onMount } from 'svelte'
    import dayjs from 'dayjs'
    import 'dayjs/locale/pt-br.js'

    export let data;

  // data
    const dispatch = createEventDispatcher()
    let elModal // HTMLElement
    // export let inputTxt = writable() // string, défault date = now
    let isOpenCalendar = false // true: show calendar
    const arrDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    const currentDay = +dayjs().format('D') // 1..31
    const currentMonth = +dayjs().format('M') // 1..12
    const currentYear = +dayjs().format('YYYY') // 2021...
    let selectedDay = +dayjs().format('D') // 1..31
    let selectedMonth = +dayjs().format('M') // 1..12
    let selectedYear = +dayjs().format('YYYY') // 2021...
    let rows = initRows()
    let currentDate = dayjs(currentDay + '-' + currentMonth + '-' + currentYear).format('YYYY-MM-DD')
    let reservas = []

    /*data.records.filter(record => {
        return record.data === currentDate
    })*/

    let horasDisponiveis = []

    /*range.filter(hora => {
        // Check if the current hour is not present in any 'reservas' objects
        const isAvailable = !reservas.some(reserva => reserva.hora === hora);
        return isAvailable;
    });*/


    // reactivity, on inputTxt changes
    $: dispatch('datepicked', {
    datepicked: $inputTxt
    })

    // life cycle
    onMount(() => {
    dayjs.locale('pt-br') // use locale
    $inputTxt = dayjs().format('DD-MM-YYYY') // current day month year in input
    affecteRows()
    })

    // functions

    function initRows() {
    return [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]
    }

    function affecteRows() {
    rows = initRows()
    const firstDayOfCurrentMonth = ucFirst(
      dayjs(selectedYear + '-' + selectedMonth)
        .startOf('month')
        .format('ddd')
    ) // 'Lu'
    const lastDayOfCurrentMonth = +dayjs(selectedYear + '-' + selectedMonth)
      .endOf('month')
      .format('D') // 31
    selectedDay = 0
    let iRow = 0
    let iCol = 0
    let start = false
    let cpt = 0
    for (iRow = 0; iRow < 6; iRow++) {
      arrDays.forEach((daystr) => {
        if (cpt > lastDayOfCurrentMonth) {
          return
        }
        if (!start && daystr === firstDayOfCurrentMonth) {
          cpt++
          start = true
        }
        rows[iRow][iCol] = cpt
        iCol++
        if (start) {
          cpt++
        }
      })
      iCol = 0
    }
    }

    function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function previousMonth() {
    selectedMonth--
    if (selectedMonth <= 0) {
      selectedMonth = 12
      selectedYear--
    }
    affecteRows()
    }

    function nextMonth() {
    selectedMonth++
    if (selectedMonth > 12) {
      selectedMonth = 1
      selectedYear++
    }
    affecteRows()
    }

    function selectDate(y, m, d) {
        selectedDay = d
        $inputTxt = dayjs(y + '-' + m + '-' + d).format('DD-MM-YYYY')
        $formatador = dayjs(y + '-' + m + '-' + d).format('DD-MM-YYYY')
        isOpenCalendar = false
        changeDate($formatador)
    }

     function changeDate(newDate) {
        currentDate = newDate
        filterDate()
    }

    function filterDate() {
        reservas = data.records.filter(record => {
            return record.data === currentDate
        })

        horasDisponiveis = range.filter(hora => {
        // Check if the current hour is not present in any 'reservas' objects
        const isAvailable = !reservas.some(reserva => reserva.hora === hora);
        return isAvailable;
        });
    }

</script>

<Agendamento/>

<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th scope="col" class="py-3.5 px-4 text-sm font-bold text-left rtl:text-right dark:text-gray-400">
                                    <div class="flex items-center gap-x-3 text-white">
                                        <span>Data/Horario</span>
                                    </div>
                                </th>

                                <th scope="col" class="py-3.5 px-9 text-sm font-bold text-left rtl:text-right text-white">
                                    <span>Ação</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-700">
                        {#each data?.records as agendas}
                            <tr>
                                <td class="px-4 py-4 text-sm font-medium text-white whitespace-nowrap">
                                    <p>{agendas.data} {agendas.hora}:00</p>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                <form method="post" action="?/delete">
                                    <input id="id" name="id" type="hidden" value={agendas.id}/>
                                        <button id="delete" name="delete"  type="submit" class="focus:outline-none text-white bg-orange-600 hover:bg-yellow-500
                                        focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-1.5 me-1
                                        mb-1 dark:focus:ring-yellow-900">Cancelar</button>
                                </form>
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

<Calendario/>

   <div class="flex items-center justify-center py-8 px-4">
      <div class="shadow-lg">
        <div class="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t">
          <div class="px-4 flex items-center justify-between">
            <!-- Month year -->
            <span class="focus:outline-none text-base font-bold text-gray-200"
              >{ucFirst(dayjs(selectedYear + '-' + selectedMonth).format('MMMM YYYY'))}</span
            >
            <div class="flex items-center">
              <!-- bnt previous -->
              <button on:click={previousMonth} aria-label="calendar backward" class="text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-chevron-left"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>
              <!-- bnt next -->
              <button on:click={nextMonth} aria-label="calendar forward" class="ml-3 text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler  icon-tabler-chevron-right"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between pt-12 overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  {#each arrDays as day}
                    <th>
                      <div class="w-full flex justify-center">
                        <p class="text-base font-medium text-center text-gray-200">
                          {day}
                        </p>
                      </div>
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each rows as col}
                  <tr>
                    {#each col as i}
                      <td class="pt-4">
                        <div class="px-2 py-2 cursor-pointer flex w-full justify-center">
                          {#if i > 0}
                              <button
                              on:click={() => {
                                selectDate(selectedYear, selectedMonth, i)
                              }}
                              class="
                                rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700
                                  ${i === selectedDay
                                    ? 'focus:bg-indigo-500 hover:bg-indigo-500 bg-indigo-700 text-white'
                                    : 'focus:bg-indigo-500 hover:bg-indigo-500 text-gray-200  selection:bg-indigo-500'
                                }
                                w-7 h-7 flex items-center justify-center font-medium"
                              >
                              {i}
                            </button>
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>



<label for="horas" class="text-center block mb-2 text-sm font-medium text-gray-800">{$inputTxt} - Selecione o horário</label>
<form method="post" action="?/create" class="max-w-sm mx-auto mb-6">
    <input id="data" required name="data" type="hidden" value={$formatador} />
  <select id="horas" required name="hora" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <option selected>Escolha um Horário</option>
      {#each horasDisponiveis as horas}
      <option value="{horas}">{horas}:00</option>
      {/each}
  </select>
    <br>
    <div class="mx-auto ml-36 py-1.5 items-center">
    <button type="submit" class=" focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Agendar</button>
    </div>
</form>

<Lista/>

<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <div class="flex items-center gap-x-3 text-white font-bold">
                                        <span>Horários</span>
                                    </div>
                                </th>
                                <th scope="col" class="py-3.5 px-4 text-sm text-left rtl:text-right text-white font-bold">
                                    <span>Situação</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-700">
                        {#each reservas as reservado}
                                <tr>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        <p class="text-gray-300">{reservado.hora}:00</p>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div class="flex items-center gap-x-6">
                                            {#if reservado.reservado == true}
                                            <p class="text-gray-300">Indisponível</p>
                                            {:else }
                                            <p class="text-gray-300">Disponível</p>
                                            {/if}
                                        </div>
                                    </td>
                                </tr>
                        {/each}
                        {#each horasDisponiveis as horas}
                            <tr>
                                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        <p class="text-gray-300">{horas}:00</p>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div class="flex items-center gap-x-6">
                                            <p class="text-gray-300">Disponível</p>
                                        </div>
                                    </td>
                                </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
