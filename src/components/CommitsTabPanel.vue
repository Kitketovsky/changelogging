<script setup>
import Skeleton from 'primevue/skeleton';
import { useQuery } from '@tanstack/vue-query';

const props = defineProps({
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

const { isPending, isError, data, error } = useQuery({
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
});
</script>

<template>
  <Skeleton v-if="isPending" width="100%" height="150px" />

  <div v-else-if="isError">
    <p class="text-red-500">{{ error.message }}</p>
  </div>

  <div v-else class="space-y-6">
    <div v-for="commit in data.commits" :key="commit.html_url" class="flex flex-col gap-2">
      <span class="text-xs text-gray-200">{{
        new Date(commit.date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      }}</span>
      <a :href="commit.html_url" target="_blank">{{ commit.message }}</a>
    </div>
  </div>
</template>
