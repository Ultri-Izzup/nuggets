<template>
  <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-3" max-width="1600">
      <v-row>
        <v-col cols="12" class="text-center">
          <h1 class="text-h4 font-weight-bold">
            {{ nuggetData ? nuggetData.name : "Nugget" }}
          </h1>
        </v-col>
      </v-row>

      <v-container v-if="nuggetData">
        <v-row>
          <v-col cols="12" class="text-body-1 mb-0 pb-0">
            {{ nuggetData.description }}
          </v-col>
          <v-col cols="12" class="mt-0 pt-0 text-caption text-grey">
            Description
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-body-1 mb-0 pb-0">
            {{ nuggetData.tags.join(",") }}
          </v-col>
          <v-col cols="12" class="mt-0 pt-0 text-caption text-grey">
            Tags
          </v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold">Images</h2>
        </v-col>
        <v-col v-if="images && images.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in images"
              :key="index"
              class="text-body-2"
            >
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-card>
                    <v-card-text>
                      <OPFSImage
                        :filePath="`nugget/${file.nuggetId}/${file.subDir}/${file.fileName}`"
                        width="100%"
                      ></OPFSImage>
                      {{ file.fileName }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold">Videos</h2>
        </v-col>
        <v-col v-if="videoRecordings && videoRecordings.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in videoRecordings"
              :key="index"
              class="text-body-2"
            >
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-card>
                    <v-card-text>
                      <OPFSVideo
                        :filePath="`nugget/${file.nuggetId}/${file.subDir}/${file.fileName}`"
                        width="100%"
                      ></OPFSVideo>
                      {{ file.fileName }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold">Audio</h2>
        </v-col>
        <v-col v-if="audioRecordings && audioRecordings.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in audioRecordings"
              :key="index"
              class="text-body-2"
            >
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-card>
                    <v-card-text class="text-center">
                      <OPFSAudio
                        :filePath="`nugget/${file.nuggetId}/${file.subDir}/${file.fileName}`"
                        width="100%"
                      ></OPFSAudio>
                      {{ file.fileName }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold">Files</h2>
        </v-col>
        <v-col v-if="files && files.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in files"
              :key="index"
              class="text-body-2"
            >
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-card>
                    <v-card-text>
                      {{ file.fileName }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold">Geolocation</h2>
        </v-col>
        <v-col v-if="nuggetData && nuggetData.geoLocation" cols="12">
          <v-row>
            <v-col>
              <GeoLocation :geoLocation="nuggetData.geoLocation"></GeoLocation>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-if="nuggetData && nuggetData.geoPositions" class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold">Waypoints</h2>
        </v-col>

        <v-col cols="12">
          <v-row>
            <v-col
              v-for="(position, index) in nuggetData.geoPositions"
              :key="index"
              cols="12"
            >
              <GeoLocation
                v-if="index !== 0"
                :geoLocation="position"
              ></GeoLocation>
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider v-if="!nuggetData || ! nuggetData.geoPositions"></v-divider>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, watch, computed } from "vue";

import { useNuggetStore } from "@/stores/nugget";

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
          return await nug.getNuggetAssets(newNuggetId, "videos");
        })
      );
    }
  },
  { immediate: true }
);
</script>
