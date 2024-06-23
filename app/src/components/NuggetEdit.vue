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
            <v-row class="text-body"> {{ nuggetData.name }} &nbsp; </v-row>
            <v-row class="mt-1 pt-0 text-caption text-grey"> Name </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-row class="text-body">
              {{ nuggetData.description }} &nbsp;
            </v-row>
            <v-row class="mt-1 pt-0 text-caption text-grey">
              Description
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-row class="text-body">
              {{ nuggetData.tags.join(",") }} &nbsp;
            </v-row>
            <v-row class="mt-1 pt-0 text-caption text-grey"> Tags </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Files</v-col>
          <v-col cols="12" md="6" v-for="(file, index) in files" :key="index" class="text-caption py-0">
            {{ file.fileName }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Images</v-col>
          <v-row v-for="(file, index) in capturedImages" :key="index" class="text-body-2">
            <v-col>
              <v-row class="align-center justify-center">
                <v-divider></v-divider>
                <v-col>
                  <img :src="file.dataURL" width="100%" />
                  <span class="text-caption">{{ file.name }}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";

import { useNuggetStore } from "@/stores/nugget";

const props = defineProps(["nuggetId"]);

const nug = useNuggetStore();

const nuggetData = ref();
const files = ref();

watch(
  () => props.nuggetId,
  async (newVal, oldVal) => {
    if (newVal) {
      nuggetData.value = await nug.getNugget(newVal);
      files.value = await nug.getNuggetFiles(newVal);
    }
  },
  { immediate: true }
);
</script>
