<script setup>
import data from './../data.json'
import Panel from 'primevue/panel'
</script>

<template>
  <div class="container mx-auto px-4 py-20 space-y-20">
    <div v-for="item in data" :key="item.category" class="space-y-2">
      <h2 class="text-2xl font-bold">
        {{ item.category }} <span class="text-xs text-gray-200">{{ item.description }}</span>
      </h2>

      <div class="space-y-4">
        <!-- TODO: on toggle show skeleton and fetch data from GitHub API -->
        <Panel v-for="item in item.items" :key="item.name" toggleable :collapsed="true">
          <template #header>
            <div class="flex items-center gap-2">
              <span>{{ item.name }}</span>
              <span class="text-xs text-gray-200"
                >{{ item.currentVersion }} → {{ item.latestVersion }}</span
              >
            </div>
          </template>

          <!-- Placeholder -->
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </Panel>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
