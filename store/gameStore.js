import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core'


export const useGameStore = defineStore('gameStore', () => {

    const inventory = ref({
        bombs: 2,
        nitro: 0,
        xSkins: ['cryptocurrency-color:btc'],
    })
    let balance = ref(50000)

    function updateBalance(val) {
        balance.value = val
    }

    function increaseBalance(val) {
        balance.value += val
    }
    function decreaseBalance(val) {
        balance.value -= val
    }

    function bombUpdate(remove, n) {
        console.log('asd')
        remove ? inventory.value.bombs -= n : inventory.value.bombs += n
    }
    function nitroUpdate(remove, n) {
        remove ? inventory.value.nitro -= n : inventory.value.nitro += n
    }
    function addXSkinUpdate(val) {
        //inventory.value.xSkins.push(val)
        inventory.value.xSkins = [val]
    }

    return { inventory, bombUpdate, nitroUpdate, addXSkinUpdate, balance, updateBalance, increaseBalance, decreaseBalance }
})
