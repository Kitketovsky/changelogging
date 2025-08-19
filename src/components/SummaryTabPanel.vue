<script setup>
import { ref } from 'vue';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import Skeleton from 'primevue/skeleton';
import TabPanel from 'primevue/tabpanel';
import { useQuery } from '@tanstack/vue-query';
import { watchEffect, toRefs } from 'vue';

import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/vue3-markdown.css';

const props = defineProps({
  isTabOpened: {
    type: Boolean,
    required: true,
  },
  tabName: {
    type: String,
    required: true,
  },
  openAIAPIKey: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
  },
  repo: {
    type: String,
  },
  currentVersion: {
    type: String,
    required: true,
  },
  latestVersion: {
    type: String,
    required: true,
  },
});

const summary = ref('');

const { isTabOpened, openAIAPIKey } = toRefs(props);

const { isError, error, data, refetch } = useQuery({
  queryKey: ['summary', props.owner, props.repo, props.currentVersion, props.latestVersion],
  queryFn: async () => {
    const openAIModel = createOpenAI({
      apiKey: openAIAPIKey.value,
    });

    let result = '';

    const { textStream } = streamText({
      model: openAIModel('gpt-4o-mini'),
      prompt: `I don't have time to read the changelog of the NPM package '${props.name}'. In details tell me about the changes between versions ${props.currentVersion} and ${props.latestVersion}. If there are API breaking changes, use code examples 'before' and 'after'. If possible, provide link to the official documentation.`,
    });

    for await (const textPart of textStream) {
      summary.value += textPart;
      result += textPart;
    }

    return result;
  },
  retry: false,
  enabled: false,
});

watchEffect(() => {
  if (isTabOpened.value && (!data.value || !summary.value) && openAIAPIKey.value) {
    refetch();
  }
});
</script>

<template>
  <TabPanel :value="props.tabName">
    <div v-if="!openAIAPIKey" class="flex items-center justify-center text-center h-[150px]">
      <p>OpenAI API key has not been provided!</p>
    </div>

    <div v-else-if="isError" class="flex items-center justify-center text-center h-[150px]">
      <!-- TODO: retry option via refetch function -->
      <p class="text-red-400">Error: {{ error.message }}</p>
    </div>

    <Skeleton v-else-if="!summary && !data" width="100%" height="150px" />

    <VMarkdownView v-else mode="dark" :content="summary || data" class="p-8" />
  </TabPanel>
</template>
