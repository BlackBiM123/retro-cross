<template>
  <div class="store-container">
    <h3 class="header">Welcome to CrossSTORE</h3>
    <store-item v-for="item of mainItems" :item="item"/>
    <br>
    <hr>
    <br>
    <store-item v-for="item of skinXItems" :item="item"/>
  </div>
</template>

<script setup>
import StoreItem from './StoreItem.vue'

  const mainItems = ref([
    {id: 1, type: 'consumables', name: 'bomb', icon: '💣', price: 500},
    {id: 2, type: 'consumables', name: 'nitro', icon: '🚀', price: 1000},
  ])
  const skinXItems = ref([
    {id: 10, type: 'skins', name: '1inch', icon: 'cryptocurrency-color:1inch', price: 2000},
    {id: 11, type: 'skins', name: 'Atom', icon: 'cryptocurrency-color:atom', price: 2000},
    {id: 12, type: 'skins', name: 'Polkadot', icon: 'cryptocurrency-color:dot', price: 2000},
    {id: 13, type: 'skins', name: 'F*ck', icon: '🖕', price: 10000},
    {id: 14, type: 'skins', name: 'Bear', icon: 'emojione:bear-face', price: 1000},
  ])
</script>

<style scoped lang="scss">
  .store-container{
    width:100%;
  }
  .header{
    display:flex;
    width:100%;
    justify-content: center;
    align-items: center;
    font-size:20px;
    margin-bottom:40px;
    background: rgba(255,255,255,0.03);
    border-radius: 10px;
    color:#f5bf65;
    height:40px;
  }
</style>
