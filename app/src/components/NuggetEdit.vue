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
      <v-row justify="center">

        <v-spacer />
        <v-icon
          @click="showCamera"
          color="gray"
          icon="mdi-link"
          size="x-large"
        ></v-icon>

        <v-spacer />
        <v-icon
          color="gray"
          icon="mdi-paperclip"
          size="x-large"
          @click="showFilePicker"
        ></v-icon>

        <v-spacer />
        <v-icon
          @click="showAudio"
          color="gray"
          icon="mdi-microphone"
          size="x-large"
        ></v-icon>

        <v-spacer />
        <v-icon
          @click="showCamera"
          color="gray"
          icon="mdi-camera"
          size="x-large"
        ></v-icon>

        <v-spacer />
        <v-icon
          @click="showScreenPicker"
          color="gray"
          icon="mdi-monitor"
          size="x-large"
        ></v-icon>

        <v-spacer />
        <v-icon
          @click="getGeoLocation"
          color="gray"
          icon="mdi-map-marker"
          size="x-large"
        ></v-icon>


        <v-spacer />
      </v-row>

      <!-- DATA -->
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
      <!--IMAGES -->
      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold"><v-icon icon="mdi-image-multiple" /> Images</h2>
        </v-col>
        <v-col v-if="savedImages && savedImages.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in savedImages"
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
      <!-- VIDEO -->
      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold"><v-icon icon="mdi-video" /> Videos</h2>
        </v-col>
        <v-col v-if="savedVideo && savedVideo.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in savedVideo"
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
      <!-- AUDIO -->
      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold"><v-icon icon="mdi-speaker"> </v-icon> Audio</h2>
        </v-col>
        <v-col v-if="savedAudio && savedAudio.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in savedAudio"
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
                      <v-icon icon="mdi-dots-vertical" size="x-large"></v-icon>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <!-- FILES -->
      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold"><v-icon icon="mdi-file-multiple" /> Files</h2>
        </v-col>
        <v-col v-if="savedFiles && savedFiles.length > 0" cols="12">
          <v-row>
            <v-col
              v-for="(file, index) in savedFiles"
              :key="index"
              class="text-body-2"
            >
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-card>
                    <v-card-actions>
                        {{ file.fileName }}
                        <v-icon icon="mdi-dots-vertical" size="x-large"></v-icon>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <!-- GEOLOCATION -->
      <v-row class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold"> <v-icon icon="mdi-map-marker" /> Location</h2>
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
      <!-- GEOPOSITIONS -->
      <v-row v-if="nuggetData && nuggetData.geoPositions" class="my-5">
        <v-col cols="12" class="pb-3">
          <h2 class="text-h5 font-weight-bold"><v-icon icon="mdi-map" /> Waypoints</h2>
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

      <v-divider v-if="!nuggetData || !nuggetData.geoPositions"></v-divider>

      <v-dialog v-model="showVideoDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card prepend-icon="mdi-video" :title="videoSource" class="ma-0 pa-0">
          <v-card-text class="flex ma-1 pa-1">
            <VideoCapture
              emitAs="dataURL"
              :targetSource="selectedVideoDevice"
              @snapshot="storeSnapshot"
              @deviceSelected="saveVideoSource"
              @chunk="saveVideoChunk"
              @recordedVideo="storeVideo"
            ></VideoCapture>
          </v-card-text>
          <template v-slot:actions>
            <v-btn
              prepend-icon="mdi-close"
              size="xl"
              color="grey"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>

    <v-dialog v-model="showAudioCaptureDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card
          prepend-icon="mdi-microphone"
          title="Audio Recorder"
          class="ma-0 pa-0"
        >
          <v-card-text class="flex ma-1 pa-1">
            <AudioCapture
              :targetSource="selectedAudioDevice"
              @recordedAudio="storeAudio"
              @deviceSelected="saveAudioSource"
              @chunk="saveAudioChunk"
            ></AudioCapture>
          </v-card-text>

          <template v-slot:actions>
            <v-btn
              prepend-icon="mdi-close"
              size="xl"
              color="grey"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>
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

// FILES
const tmpFiles = ref(); // Filehandles from local file picker

// AUDIO
const showAudioCaptureDialog = ref(false);
const selectedAudioDevice = ref();
const tmpAudio = ref([]); // audio recordings from device

// CAMERA / VIDEO
const showVideoDialog = ref(false);
const selectedVideoDevice = ref();
const tmpVideo = ref([]);
const tmpImages = ref([]);
const preferredCamera = ref();
const videoSource = ref("Video");

// GEOLOCATION
const geoLocation = ref();
const waypoints = ref([]);

// DATA FORM
const valid = ref();
const name = ref();
const nameRules = [
  (value) => {
    if (value) return true;

    return "Name is required.";
  },
  (value) => {
    if (value?.length >= 2) return true;

    return "Name must be at least 2 characters.";
  },
  (value) => {
    if (value?.length <= 50) return true;

    return "Name must be less than 50 characters.";
  },
];
const description = ref();
const descriptionRules = [
  (value) => {
    if (!value || value?.length <= 1500) return true;

    return "Description must be less than 1500 characters.";
  },
];
const tags = ref([]);


// These become reactive through the Dexie liveQuery observable
let savedFiles;
let savedImages;
let savedAudio;
let savedVideo;

const tempStoreSnapshot = (snapshotObj) => {
  tmpImages.value.push(snapshotObj);
};

const storeSnapshot = async (snapshotObj) => {
  await nug.addNuggetAsset(props.nuggetId, 'images', snapshotObj)
};

const tempStoreAudio = (audioCaptureObj) => {
  tmpAudio.value.push(audioCaptureObj);
};

const storeAudio = async (audioCaptureObj) => {
  await nug.addNuggetAsset(props.nuggetId, 'audio', audioCaptureObj)
};

const tempStoreVideo = (videoCaptureObj) => {
  tmpVideo.value.push(videoCaptureObj);
};

const storeVideo = async (audioCaptureObj) => {
  await nug.addNuggetAsset(props.nuggetId, 'videos', audioCaptureObj)
};

const saveVideoSource = (newSource) => {
  selectedVideoDevice.value = newSource;
  preferredCamera.value = newSource;
  nug.preferredCamera = newSource;
  console.log("VIDEO SOURCE SET", newSource);
};

const saveAudioSource = (newSource) => {
  selectedAudioDevice.value = newSource;
  console.log("AUDIO SOURCE SET", newSource);
};

const saveVideoChunk = (chunk) => {
  savedVideo.value.push(chunk);
  console.log("VIDEO CHUNK ADDED", chunk);
};

const saveAudioChunk = (chunk) => {
  savedAudio.value.push(chunk);
  console.log("AUDIO CHUNK ADDED", chunk);
};

const uploadFiles = async () => {
  console.log("FILE UPLOAD REQUESTED", tmpFiles.value);
};

// BUTTON ACTIONS
const showFilePicker = async () => {
  const pickerOpts = {
    types: [
      {
        description: "Images",
        accept: {
          "*/*": [".png", ".gif", ".jpeg", ".jpg"],
        },
      },
    ],
    excludeAcceptAllOption: false,
    multiple: true,
  };
  tmpFiles.value = await window.showOpenFilePicker(pickerOpts);
  // Auto save to OPFS
  await nug.addNuggetAttachments(props.nuggetId, tmpFiles.value)
};

const showScreenPicker = async () => {
  videoSource.value = "Screen";
  selectedVideoDevice.value = "screen";
  showVideoDialog.value = true;
};

const showCamera = async () => {
  videoSource.value = "Camera";
  selectedVideoDevice.value = preferredCamera.value ? preferredCamera.value : nug.preferredCamera;
  showVideoDialog.value = true;
};

const showAudio = async () => {
  showAudioCaptureDialog.value = true;
};

const getGeoLocation = async() => {
  console.log('Request GeoLocation')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log( position.coords );
      const jsonPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      }

      if(position.coords.speed) {
        jsonPos.speed = position.coords.speed
      }

      geoLocation.value = jsonPos;
      waypoints.value.push(jsonPos);
    });
  }
}

watch(
  () => props.nuggetId,
  async (newNuggetId, oldVal) => {
    if (newNuggetId) {
      nuggetData.value = await nug.getNugget(newNuggetId);

      savedFiles = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "files");
        })
      );

      savedImages = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "images");
        })
      );

      savedAudio = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "audio");
        })
      );

      savedVideo = useObservable(
        liveQuery(async () => {
          return await nug.getNuggetAssets(newNuggetId, "videos");
        })
      );
    }
  },
  { immediate: true }
);
</script>
