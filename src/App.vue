<script setup>
import data from './../data.json';
import { ref } from 'vue';

import PackagePanel from './components/PackagePanel.vue';
import Password from 'primevue/password';

const openAIAPIKey = ref('');
</script>

<template>
  <div class="container mx-auto px-4 py-20 flex flex-col gap-14">
    <h1 class="text-3xl font-bold">Packages Changelog</h1>

    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold">OpenAI API Key</h2>

      <Password
        name="openAIAPIKey"
        v-model="openAIAPIKey"
        :feedback="false"
        autocomplete="off"
        toggleMask
        class="max-w-lg"
        input-class="w-full"
      />
    </div>

    <div class="space-y-20">
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
            :openAIAPIKey="openAIAPIKey"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
