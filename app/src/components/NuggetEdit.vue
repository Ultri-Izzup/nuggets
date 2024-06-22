<template>
  <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="600">
      <div class="text-center">
        <h1 class="text-h3 font-weight-bold">Nugget</h1>
      </div>

      <div class="py-4" />

      <v-card>
       <v-card-text>
        Nugget Data for {{nuggetId}}
        {{nuggetData}}
       </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router"

import { useNuggetStore } from "@/stores/nugget";
const nug = useNuggetStore();

const route = useRoute ();
const nuggetId = ref(route.params.id);

const nuggetData = ref();

watch(
  () => route.params.id,
  async (newVal, oldVal) => {
    if (newVal) {
      console.log(newVal);
      nuggetData.value = await nug.getNugget(newVal);
    }
  },
  { immediate: true }
);

</script>
