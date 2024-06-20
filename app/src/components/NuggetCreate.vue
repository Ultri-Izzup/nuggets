<template>
  <v-form v-model="valid" @submit.prevent="submitCreate">
    <v-container>
      <v-row>
        <v-text-field
          v-model="name"
          label="Name"
          :rules="nameRules"
          required
        ></v-text-field>
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
          icon="mdi-map-marker"
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
      <v-row v-if="dataURLs && dataURLs.length > 0">
        <v-col cols="12" class="text-h6">Images</v-col>
        <v-row
          v-for="(file, index) in dataURLs"
          :key="index"
          class="text-body-2"
        >
        <v-col>
          <v-row class="align-center justify-center">
            <v-divider></v-divider>
            <v-col>
              <img :src="file.dataURL" width="250px" />
            </v-col>
            <v-col>
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
          <v-col>
            <video :src="file.videoURL" controls />
          </v-col>
          <v-col>
            <span class="text-caption">{{ file.name }}</span>
          </v-col>
        </v-row>
      </v-row>
      <v-row v-if="audioRecordings && audioRecordings.length > 0">
        <v-col cols="12" class="text-h6">Audio</v-col>
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
      <v-row v-if="geoLocation">
        <v-col cols="12" class="text-h6">Geo Location</v-col>
        <v-row>
          <v-divider></v-divider>
          <v-col cols="12 py-1">
            Lat/Long: {{ geoLocation.coords.latitude}}, {{ geoLocation.coords.longitude}}
          </v-col>
          <v-col cols="12 py-1">
            Time: {{ new Date(geoLocation.timestamp).toLocaleString()}}
          </v-col>
          <v-col v-if="geoLocation.coords.altitude" cols="12">
            Altitude: {{ geoLocation.coords.altitude}}
          </v-col>
          <v-col v-if="geoLocation.coords.speed" cols="12">
            Speed: {{ geoLocation.coords.speed}}
          </v-col>
          <v-col v-if="geoLocation.coords.heading" cols="12">
            Heading: {{ geoLocation.coords.heading}}
          </v-col>
        </v-row>
      </v-row>
    </v-container>

    <!-- DIALOGS -->

    <v-dialog v-model="showVideoDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card prepend-icon="mdi-video" :title="videoSource" class="ma-0 pa-0">
          <v-card-text class="flex ma-1 pa-1">
            <VideoCapture
              emitAs="dataURL"
              :targetSource="selectedVideoDevice"
              @snapshot="tempStoreSnapshot"
              @deviceSelected="saveVideoSource"
              @chunk="saveVideoChunk"
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
              @recordedAudio="tempStoreAudio"
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
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";

import { useNuggetStore } from "../stores/nugget";
import { slotFlagsText } from "@vue/shared";
const nug = useNuggetStore();

// FILES
const selectedFiles = ref(); // Filehandles from local file picker

// AUDIO
const showAudioCaptureDialog = ref(false);
const selectedAudioDevice = ref();
const audioRecordings = ref([]); // audio recordings from device

// CAMERA / VIDEO
const showVideoDialog = ref(false);
const selectedVideoDevice = ref();
const videoRecordings = ref([]);
const dataURLs = ref([]);
const preferredCamera = ref();
const videoSource = ref("Video");

// GEOLOCATION
const geoLocation = ref();
const geoCoordinates = ref([]);

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
  const nuggetData = {
    name: name.value,
    description: description.value,
    tags: tags.value,
  };

  console.log("CREATING...", nuggetData);

  try {
    const nuggetId = await nug.createNugget(nuggetData, dataURLs.value);
  } catch (e) {
    console.error("FAILED to create IDB record", nuggetData);
  }

  console.log("NEW NUGGET ID:", nuggetId);

  console.log("UPLOADS", selectedFiles.value);
};

const tempStoreSnapshot = (snapshotObj) => {
  dataURLs.value.push(snapshotObj);
};

const tempStoreAudio = (audioCaptureObj) => {
  audioRecordings.value.push(audioCaptureObj);
};

const saveVideoSource = (newSource) => {
  selectedVideoDevice.value = newSource;
  preferredCamera.value = newSource;
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
  audioRecordings.value.push(chunk);
  console.log("AUDIO CHUNK ADDED", chunk);
};

const uploadFiles = async () => {
  console.log("FILE UPLOAD REQUESTED", selectedFiles.value);
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
  selectedFiles.value = await window.showOpenFilePicker(pickerOpts);
};

const showScreenPicker = async () => {
  videoSource.value = "Screen";
  selectedVideoDevice.value = "screen";
  showVideoDialog.value = true;
};

const showCamera = async () => {
  videoSource.value = "Camera";
  selectedVideoDevice.value = preferredCamera.value;
  showVideoDialog.value = true;
};

const showAudio = async () => {
  showAudioCaptureDialog.value = true;
};

const getGeoLocation = async() => {
  console.log('Request GeoLocation')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log('GEO LOCATION', position)
      geoLocation.value = position;
      geoCoordinates.value.push(position);
    });
  }
}
</script>
