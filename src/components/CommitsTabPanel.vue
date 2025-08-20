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
  repository_url: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

const { isTabOpened } = toRefs(props);

const queryKey = ['package', props.owner, props.repo, props.currentVersion, props.latestVersion];

const { isPending, isError, data, error, refetch } = useQuery({
  queryKey,
  queryFn: async ({ client }) => {
    if (!props.owner || !props.repo) {
      throw new Error(`Missing package owner or repo.`);
    }

    const failures = client.getQueryState(queryKey).fetchFailureCount;

    const currentVersion = failures === 0 ? props.currentVersion : `v${props.currentVersion}`;
    const latestVersion = failures === 0 ? props.latestVersion : `v${props.latestVersion}`;

    const link = `https://api.github.com/repos/${props.owner}/${props.repo}/compare/${currentVersion}...${latestVersion}`;
    const response = await fetch(link);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Repository version comparison failed. Status: ${response.status}. Reason: ${data.message}.`,
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
  retry: 2,
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
    <Skeleton v-if="isPending" width="100%" height="350px" />

    <div
      v-else-if="isError"
      class="flex flex-col gap-2 items-center justify-center text-center h-[150px]"
    >
      <p>{{ error.message }}</p>
      <p v-if="props.repository_url">
        Try visiting repository:
        <a class="underline" target="_blank" :href="props.repository_url">{{
          props.repository_url
        }}</a>
      </p>
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
          'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
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
