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
        <v-col cols="12" class="text-h6">Media</v-col>
        <v-col
          v-for="(file, index) in dataURLs"
          :key="index"
          class="text-body-2"
        >
          <img :src="file.dataURL" width="250px" />
          <br />
          <span class="text-caption">{{ file.name }}</span>
        </v-col>
      </v-row>
    </v-container>

    <!-- <canvas ref="snapshot" style="overflow: auto" class="flex" hidden></canvas> -->

    <v-dialog v-model="showVideoDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card prepend-icon="mdi-video" :title="videoSource" class="ma-0 pa-0">
          <v-card-text class="flex ma-1 pa-1">
            <VideoCapture emitAs="dataURL" :targetSource="selectedDevice" @snapshot="tempStoreSnapshot" @deviceSelected="saveSource"></VideoCapture>
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

    <!-- <v-dialog v-model="showAudioDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card
          prepend-icon="mdi-microphone"
          title="Audio Recorder"
          class="ma-0 pa-0"
        >
          <v-card-text class="flex ma-1 pa-1">

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
    </v-dialog> -->
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";

import { useNuggetStore } from "../stores/nugget";
import { slotFlagsText } from "@vue/shared";
const nug = useNuggetStore();

const selectedDevice = ref();
const preferredCamera = ref();

const showVideoDialog = ref(false);
const videoSource = ref("Video");

const selectedFiles = ref(); // Filehandles from local file picker
const dataURLs = ref([]); // dataURLs captured from the device

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
  dataURLs.value.push(snapshotObj)
}

const saveSource = (newSource)  => {
  selectedDevice.value = newSource;
  preferredCamera.value = newSource;
  console.log('SOURCE SET', newSource)
}

const uploadFiles = async () => {
  console.log("FILE UPLOAD REQUESTED", selectedFiles.value);
};

const showFilePicker = async () => {
  const pickerOpts = {
    types: [
      {
        description: "Images",
        accept: {
          "image/*": [".png", ".gif", ".jpeg", ".jpg"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: true,
  };
  selectedFiles.value = await window.showOpenFilePicker(pickerOpts);
};

const showScreenPicker = async () => {
  videoSource.value = 'Screen'
  selectedDevice.value = 'screen';
  showVideoDialog.value = true;
};

const showCamera = async () => {
  videoSource.value = "Camera";
  selectedDevice.value = preferredCamera.value;
  showVideoDialog.value = true;
};

const showAudio = async () => {
  console.log("AUDIO");
  if (audioInputs.value.length === 0) {
    initDevices();
  }

  const constraints = { audio: true };
  let chunks = [];

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      audio.value = mediaRecorder;
    })
    .catch((err) => {
      console.error(`The following error occurred: ${err}`);
    });

  showAudioDialog.value = true;
};

</script>
