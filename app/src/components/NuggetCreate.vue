<template>
  <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="900">
      <div v-if="title" class="text-center">
        <h1 class="text-h3 font-weight-bold">{{ title }}</h1>
      </div>
      <v-form v-model="valid" @submit.prevent="submitCreate">
        <v-container>
          <v-row class="align-center">
            <v-text-field
              v-model="name"
              label="Name"
              :rules="nameRules"
              required
            ></v-text-field>
            <!-- <v-btn icon="mdi-microphone" color="grey-darken-4" @click="voiceType('name')"></v-btn>
            <v-btn icon="mdi-speaker" color="grey-darken-4" @click="voiceType('name')"></v-btn> -->
          </v-row>
          <v-row>
            <v-textarea
              v-model="description"
              label="Description"
              :rules="descriptionRules"
              rows="1"
              auto-grow
            ></v-textarea>
          </v-row>
          <v-row>
            <v-combobox
              v-model="tags"
              clearable
              chips
              multiple
              label="Tags"
              :items="[
                'California',
                'Colorado',
                'Florida',
                'Georgia',
                'Texas',
                'Wyoming',
              ]"
            ></v-combobox>
          </v-row>
          <v-row justify="center">
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
              icon="mdi-pin"
              size="x-large"
            ></v-icon>

            <v-spacer />
          </v-row>
          <v-row justify="center">
            <v-col cols="5">
              <v-btn type="submit" block color="primary" :disabled="!valid"
                >Save</v-btn
              >
            </v-col>
          </v-row>
          <v-row v-if="geoLocation">
            <v-col cols="12" class="text-h6">Geo Location</v-col>
            <v-row>
              <v-divider></v-divider>
              <GeoLocation :geoLocation="geoLocation"></GeoLocation>
            </v-row>
          </v-row>
          <v-row v-if="waypoints && waypoints.length > 1">
            <v-col cols="12" class="text-h6">Waypoints</v-col>
            <v-row v-for="(position, ix) in waypoints" :key="ix">
              <v-divider></v-divider>
              <GeoLocation :geoLocation="position"></GeoLocation>
            </v-row>
          </v-row>
          <v-row v-if="tmpImages && tmpImages.length > 0">
            <v-col cols="12" class="text-h6">Images</v-col>
            <v-row
              v-for="(file, index) in tmpImages"
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
          <v-row v-if="videoRecordings && videoRecordings.length > 0">
            <v-col cols="12" class="text-h6">Video</v-col>
            <v-row v-for="(file, index) in videoRecordings" :key="index">
              <v-divider></v-divider>
              <v-col cols="12">
                <video
                  :src="file.blobURL"
                  controls
                  width="100%"
                  height="auto"
                />
                <span class="text-caption">{{ file.name }}</span>
              </v-col>
            </v-row>
          </v-row>
          <v-row v-if="tmpAudioRecordings && tmpAudioRecordings.length > 0">
            <v-col cols="12" class="text-h6">Audio</v-col>
            <v-row v-for="(file, index) in tmpAudioRecordings" :key="index">
              <v-divider></v-divider>
              <v-col>
                <audio :src="file.blobURL" controls />
              </v-col>
              <v-col>
                <span class="text-caption">{{ file.name }}</span>
              </v-col>
            </v-row>
          </v-row>
          <v-row v-if="selectedFiles && selectedFiles.length > 0">
            <v-col cols="12" class="text-h6">Attachments</v-col>
            <v-col
              cols="12"
              md="6"
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="text-caption py-0"
            >
              {{ file.name }}
            </v-col>
          </v-row>
        </v-container>

        <!-- DIALOGS -->

        <v-dialog v-model="showCameraDialog" class="flex ma-0 pa-0">
          <template v-slot:default="{ isActive }">
            <v-card
              prepend-icon="mdi-video"
              :title="videoSource"
              class="ma-0 pa-0"
            >
              <v-card-text class="flex ma-1 pa-1">
                <VideoCapture
                  emitAs="dataURL"
                  :targetSource="selectedVideoDevice"
                  @snapshot="tempStoreSnapshot"
                  @deviceSelected="saveVideoSource"
                  @chunk="saveVideoChunk"
                  @recordedVideo="tempStoreVideo"
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
                  @recordedAudio="tmpStoreAudio"
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

        <v-dialog v-model="showFileSelectDialog" class="flex ma-0 pa-0">
          <template v-slot:default="{ isActive }">
            <v-card
              prepend-icon="mdi-file-multiple"
              title="Select Files"
              class="ma-0 py-0 px-5"
            >
              <v-card-text class="flex ma-1 pa-1 text-center">
                <v-file-input v-model="selectedFiles" multiple label="Select files" @change="showFileSelectDialog = false"></v-file-input>
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
      </v-form>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useNuggetStore } from "../stores/nugget";
const props = defineProps({
  originNuggetId: {
    type: Number
  },
  relationType: {
    type: String
  },
  title: {
    type: String
  }
});

console.log('PROPS', props)

const nug = useNuggetStore();
const router = useRouter();

// FILES
const showFileSelectDialog = ref(false);
const selectedFiles = ref(); // Filehandles from local file picker

// AUDIO
const showAudioCaptureDialog = ref(false);
const selectedAudioDevice = ref();
const tmpAudioRecordings = ref([]); // audio recordings from device

// CAMERA / VIDEO
const showCameraDialog = ref(false);
const selectedVideoDevice = ref();
const videoRecordings = ref([]);
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

// FUNCTIONS
const submitCreate = async () => {
  const data = {
    name: name.value,
    description: description.value,
    tags: tags.value,
  };

  console.log(geoLocation.value);
  console.log(waypoints.value);

  if (geoLocation.value) {
    data.geoLocation = geoLocation.value;
  }

  if (waypoints.value && waypoints.value.length > 0) {
    data.geoPositions = waypoints.value;
  }

  // Object to send ALL data to Nugget store.
  // The Nugget store is responsible for sending parts to a worker.
  const fullNugget = {
    data: data,
  };

  if (selectedFiles.value && selectedFiles.value.length > 0) {
    fullNugget.selectedFiles = selectedFiles.value;
  }

  if (tmpImages.value && tmpImages.value.length > 0) {
    fullNugget.capturedImages = tmpImages.value;
  }

  if (videoRecordings.value && videoRecordings.value.length > 0) {
    fullNugget.videoRecordings = videoRecordings.value;
  }

  if (tmpAudioRecordings.value && tmpAudioRecordings.value.length > 0) {
    fullNugget.audioRecordings = tmpAudioRecordings.value;
  }

  console.log("CREATING NUGGET...", fullNugget);

  let nuggetId;

  try {
    nuggetId = await nug.createNugget(fullNugget);
    console.log("NEW NUGGET ID:", nuggetId);
    router.push(`/nuggets/${nuggetId}`);
  } catch (e) {
    console.error("FAILED to create record", e);
  }
};

const tempStoreSnapshot = (snapshotObj) => {
  tmpImages.value.push(snapshotObj);
};

const tmpStoreAudio = (audioCaptureObj) => {
  tmpAudioRecordings.value.push(audioCaptureObj);
};

const tempStoreVideo = (videoCaptureObj) => {
  videoRecordings.value.push(videoCaptureObj);
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
  videoRecordings.value.push(chunk);
  console.log("VIDEO CHUNK ADDED", chunk);
};

const saveAudioChunk = (chunk) => {
  tmpAudioRecordings.value.push(chunk);
  console.log("AUDIO CHUNK ADDED", chunk);
};

// Convert speech to text and
const voiceType = async (refName) => {
  console.log(`Capture voice for ${refName}`)

}

// BUTTON ACTIONS
const showFilePicker = async () => {
  if (window.showOpenFilePicker) {
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
    selectedFiles.value = await window.showOpenFilePicker(pickerOpts);
  } else {
    console.log("firefix sucks");
    showFileSelectDialog.value = true;
    // Show dialog with file input field
  }
};

const showScreenPicker = async () => {
  videoSource.value = "Screen";
  selectedVideoDevice.value = "screen";
  showCameraDialog.value = true;
};

const showCamera = async () => {
  videoSource.value = "Camera";
  selectedVideoDevice.value = preferredCamera.value
    ? preferredCamera.value
    : nug.preferredCamera;
  showCameraDialog.value = true;
};

const showAudio = async () => {
  showAudioCaptureDialog.value = true;
};

const getGeoLocation = async () => {
  console.log("Request GeoLocation");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords);
      const jsonPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };

      if (position.coords.speed) {
        jsonPos.speed = position.coords.speed;
      }

      geoLocation.value = jsonPos;
      waypoints.value.push(jsonPos);
    });
  }
};

</script>



