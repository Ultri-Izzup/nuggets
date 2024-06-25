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
          <v-col cols="12" class="text-h6">Images</v-col>
          <v-row v-if="images && images.length">
            <v-row
              v-for="(file, index) in images"
              :key="index"
              class="text-body-2"
            >
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
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Video</v-col>
          <v-row v-if="videoRecordings && videoRecordings.length > 0">
            <v-row v-for="(file, index) in videoRecordings" :key="index">
              <v-divider></v-divider>
              <v-col>
                <video :src="file.videoURL" controls />
              </v-col>
              <v-col>
                <span class="text-caption">{{ file.name }}</span>
              </v-col>
            </v-row>
          </v-row>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Audio</v-col>
          <v-row v-if="audioRecordings && audioRecordings.length > 0">
            <v-row v-for="(file, index) in audioRecordings" :key="index">
              <v-divider></v-divider>
              <v-col>
                <audio :src="file.audioURL" controls />
              </v-col>
              <v-col>
                <span class="text-caption">{{ file.name }}</span>
              </v-col>
            </v-row>
          </v-row>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Attachments</v-col>
          <v-row v-if="files && files.length > 0">
            <v-col
              cols="12"
              md="6"
              v-for="(file, index) in files"
              :key="index"
              class="text-caption py-0"
            >
              {{ file.fileName }}
            </v-col>
          </v-row>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Geo Location</v-col>
          <v-row v-if="nuggetData.geoLocation">
            <v-col>
              <GeoLocation :geoLocation="nuggetData.geoLocation"></GeoLocation>
            </v-col>
          </v-row>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Waypoints</v-col>
          <v-row v-if="nuggetData.geoPositions">
            <v-col cols="12" md="6" class="pl-6">

            <v-row v-for="(position, index) in nuggetData.geoPositions" :key="index" cols="12">
              <GeoLocation v-if="index !== 0" :geoLocation="position"></GeoLocation>
              <v-divider></v-divider>
            </v-row>
          </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, watch, computed } from "vue";

import { useNuggetStore } from "@/stores/nugget";

import { db } from "@/dexie/db.js";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import GeoLocation from "./GeoLocation.vue";

const props = defineProps(["nuggetId"]);

const nug = useNuggetStore();

const nuggetData = ref();

// These become reactive through the Dexie liveQuery observable
let files;
let images;
let audioRecordings;
let videoRecordings;

watch(
  () => props.nuggetId,
  async (newNuggetId, oldVal) => {
    if (newNuggetId) {
      nuggetData.value = await nug.getNugget(newNuggetId);

      files = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "files");
        })
      );

      images = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "images");
        })
      );

      audioRecordings = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "audio");
        })
      );

      videoRecordings = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "video");
        })
      );
    }
  },
  { immediate: true }
);
</script>
