<script setup>
import Panel from 'primevue/panel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

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
  openAIAPIKey: {
    type: String,
  },
});

const collapsed = ref(true);
</script>

<!-- TODO:
- add toggle button for sorting commits by date
- add summarize button that asks ChatGPT to summarize the changes between versions
- render summary in markdown component
-->

<template>
  <Panel toggleable v-model:collapsed="collapsed">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ name }}</span>
        <span class="text-xs text-gray-200">{{ currentVersion }} → {{ latestVersion }}</span>
      </div>
    </template>

    <Tabs value="0" v-if="!collapsed">
      <TabList>
        <Tab value="0">Commits</Tab>
        <Tab value="1">Summary</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <CommitsTabPanel :current-version :latest-version :owner :repo />
        </TabPanel>
        <TabPanel value="1">
          <SummaryTabPanel :name :current-version :latest-version :owner :repo :openAIAPIKey />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Panel>
</template>

<style scoped></style>
