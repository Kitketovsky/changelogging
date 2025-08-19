<script setup>
import Skeleton from 'primevue/skeleton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TabPanel from 'primevue/tabpanel';
import { useQuery } from '@tanstack/vue-query';
import { watchEffect, toRefs } from 'vue';

const props = defineProps({
  isTabOpened: {
    type: Boolean,
    required: true,
  },
  tabName: {
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

const { isTabOpened } = toRefs(props);

const { isPending, isError, data, error, refetch } = useQuery({
  queryKey: ['package', props.owner, props.repo, props.currentVersion, props.latestVersion],
  queryFn: async () => {
    if (!props.owner || !props.repo) {
      throw new Error(`Missing package owner or repo.`);
    }

    const response = await fetch(
      `https://api.github.com/repos/${props.owner}/${props.repo}/compare/v${props.currentVersion}...v${props.latestVersion}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error fetching package data. Status: ${response.status}. Reason: ${data.message}.`,
      );
    }

    return {
      total_commits: data.total_commits,
      commits: data.commits.map((commit) => ({
        message: commit.commit.message,
        date: commit.commit.author.date,
        html_url: commit.html_url,
      })),
    };
  },
  retry: false,
  enabled: false,
});

watchEffect(() => {
  if (isTabOpened.value && !data.value) {
    refetch();
  }
});
</script>

<template>
  <TabPanel :value="props.tabName">
    <Skeleton v-if="isPending" width="100%" height="150px" />

    <div v-else-if="isError" class="flex items-center justify-center text-center h-[150px]">
      <p class="text-red-500">{{ error.message }}</p>
    </div>

    <DataTable
      v-else
      :value="data.commits"
      paginator
      scrollable
      :rows="10"
      :rowsPerPageOptions="[10, 20, 30]"
      :paginatorTemplate="{
        '640px': 'PrevPageLink CurrentPageReport NextPageLink',
        '960px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        default:
          'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput',
      }"
    >
      <Column header="Date" field="date" sortable>
        <template #body="slotProps">
          <span class="block w-max">
            {{
              new Date(slotProps.data.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            }}
          </span>
        </template>
      </Column>
      <Column header="Message" field="message"></Column>
      <Column header="Source" field="html_url">
        <template #body="slotProps">
          <a :href="slotProps.data.html_url" target="_blank">Link</a>
        </template>
      </Column>
    </DataTable>
  </TabPanel>
</template>
