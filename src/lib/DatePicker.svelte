<script>
  /**
   * INSTALL
   * yarn add dayjs
   *
   * USAGE
   * import DatePicker from './DatePicker.svelte'
   * function datepicked (e) { console.log(e.detail.datepicked) }
   *
   * <DatePicker
   *  on:datepicked={datepicked}
   *  customclass=""                  (facultative) css class
   * />
   */

 /* import { createEventDispatcher, onMount } from 'svelte'
  import dayjs from 'dayjs'
  import 'dayjs/locale/pt-br.js'
  import {formatador, inputTxt} from "$lib/store.js";
  import Lista from "$lib/Lista.svelte";

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
    $formatador = dayjs(y + '-' + m + '-' + d).format('YYYY-MM-DD')
    isOpenCalendar = false
  }*/
</script>

 <!--   <div class="flex items-center justify-center py-8 px-4">
      <div class="shadow-lg">
        <div class="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t">
          <div class="px-4 flex items-center justify-between">
            &lt;!&ndash; Month year &ndash;&gt;
            <span class="focus:outline-none text-base font-bold text-gray-200"
              >{ucFirst(dayjs(selectedYear + '-' + selectedMonth).format('MMMM YYYY'))}</span
            >
            <div class="flex items-center">
              &lt;!&ndash; bnt previous &ndash;&gt;
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
              &lt;!&ndash; bnt next &ndash;&gt;
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
    </div>-->




