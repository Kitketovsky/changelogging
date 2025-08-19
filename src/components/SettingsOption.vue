<script setup>
import Button from 'primevue/button';
import Password from 'primevue/password';
import Dialog from 'primevue/dialog';

import { inject, ref } from 'vue';

const visible = ref(false);

const apikey = inject('apikey');
</script>

<template>
  <Button @click="visible = true" icon="pi pi-cog" size="small" aria-label="Open Settings" />

  <Dialog v-model:visible="visible" modal header="Settings" class="max-w-lg w-full">
    <div class="flex items-center gap-4 mb-8">
      <label for="apikey" class="font-semibold w-24">API key</label>

      <Password
        id="apikey"
        name="apikey"
        :feedback="false"
        v-model="apikey"
        autocomplete="off"
        toggleMask
        class="w-full"
        input-class="w-full"
      />
    </div>
  </Dialog>
</template>
