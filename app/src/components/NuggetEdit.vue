<template>
  <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="900">
      <div class="text-center">
        <h1 class="text-h4 font-weight-bold">Nugget</h1>
      </div>

      <div class="py-3" />
      <v-container v-if="nuggetData" max-width="600">
        <v-row>
          <v-col cols="12">
            <v-row class="text-body">
              {{ nuggetData.name }} &nbsp;
            </v-row>
            <v-row class="mt-1 pt-0 text-caption text-grey"> Name </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-row class="text-body">
              {{ nuggetData.description }} &nbsp;
            </v-row>
            <v-row class="mt-1 pt-0 text-caption text-grey"> Description </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-row class="text-body">
              {{ nuggetData.tags.join(',') }} &nbsp;
            </v-row>
            <v-row class="mt-1 pt-0 text-caption text-grey"> Tags </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useNuggetStore } from "@/stores/nugget";
const nug = useNuggetStore();

const route = useRoute();
const nuggetId = ref(route.params.id);

const nuggetData = ref();

watch(
  () => route.params.id,
  async (newVal, oldVal) => {
    if (newVal) {
      const reqNug = await nug.getNugget(newVal);
      nuggetData.value = reqNug;
    }
  },
  { immediate: true }
);
</script>
