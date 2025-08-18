<script setup>
import data from './../data.json';
import Panel from 'primevue/panel';
import PackagePanel from './components/PackagePanel.vue';
</script>

<template>
  <div class="container mx-auto px-4 py-20 space-y-20">
    <div v-for="item in data" :key="item.category" class="space-y-2">
      <h2 class="text-2xl font-bold">
        {{ item.category }} <span class="text-xs text-gray-200">{{ item.description }}</span>
      </h2>

      <div class="space-y-4">
        <PackagePanel
          v-for="item in item.items"
          :key="item.name"
          :name="item.name"
          :currentVersion="item.currentVersion"
          :latestVersion="item.latestVersion"
          :owner="item.owner"
          :repo="item.repo"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
