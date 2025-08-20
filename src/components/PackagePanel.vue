<script setup>
import Panel from 'primevue/panel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';

import { ref } from 'vue';
import CommitsTabPanel from './CommitsTabPanel.vue';
import SummaryTabPanel from './SummaryTabPanel.vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  currentVersion: {
    type: String,
    required: true,
  },
  latestVersion: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
  },
  repo: {
    type: String,
  },
  repository_url: {
    type: String,
  },
  type: {
    type: String,
  },
});

const collapsed = ref(true);
const currentTab = ref('commits');
</script>

<template>
  <Panel toggleable v-model:collapsed="collapsed">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ name }}</span>
        <span class="text-xs text-gray-200">{{ currentVersion }} → {{ latestVersion }}</span>
      </div>
    </template>

    <Tabs v-model:value="currentTab" v-if="!collapsed">
      <TabList>
        <Tab value="commits">Commits</Tab>
        <Tab value="summary">Summary</Tab>
      </TabList>
      <TabPanels>
        <CommitsTabPanel
          :is-tab-opened="currentTab === 'commits'"
          tab-name="commits"
          v-bind="props"
        />

        <SummaryTabPanel
          :is-tab-opened="currentTab === 'summary'"
          tab-name="summary"
          v-bind="props"
        />
      </TabPanels>
    </Tabs>
  </Panel>
</template>

<style scoped></style>
