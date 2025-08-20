<script setup>
import data from './../data.json';
import { provide, ref } from 'vue';

import PackagePanel from './components/PackagePanel.vue';
import SettingsOption from './components/SettingsOption.vue';

const apikey = ref('');

provide('apikey', apikey);
</script>

<template>
  <div class="container mx-auto px-4 py-20 flex flex-col gap-14">
    <header class="flex items-center justify-end gap-2">
      <SettingsOption />
    </header>

    <h1 class="text-3xl font-bold">Packages Changelog</h1>

    <div class="space-y-20">
      <div v-for="item in data" :key="item.category" class="space-y-2">
        <h2 class="text-2xl font-bold">
          {{ item.category }} <span class="text-xs text-gray-200">{{ item.description }}</span>
        </h2>

        <div class="space-y-4">
          <PackagePanel v-for="item in item.items" :key="item.name" v-bind="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
