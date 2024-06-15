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
          id="trigger-microphone-dialog"
          color="gray"
          icon="mdi-microphone"
          size="x-large"
        ></v-icon>

        <v-spacer />
        <v-icon id="trigger-camera-dialog" color="gray" icon="mdi-camera" size="x-large"></v-icon>

        <v-spacer />
        <v-icon @click="showScreenPicker" color="gray" icon="mdi-monitor" size="x-large"></v-icon>
        <v-spacer />
      </v-row>
      <v-row justify="center">
        <v-col cols="5">
          <v-btn type="submit" block color="primary" :disabled="!valid">Save</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="selectedFiles && selectedFiles.length > 0">
        <v-col cols="12" class="text-h6">Attachments</v-col>
        <v-col
          v-for="(file, index) in selectedFiles"
          :key="index"
          class="text-body-2"
        >
          {{ file.name }}
        </v-col>
      </v-row>
      <v-row v-if="pendingFiles && pendingFiles.length > 0">
        <v-col cols="12" class="text-h6">Media</v-col>
        <v-col
          v-for="(file, index) in pendingFiles"
          :key="index"
          class="text-body-2"
        >
          {{ file.name }}
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showVideoDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card
          prepend-icon="mdi-video"
          :title="videoSource"
          class="ma-0 pa-0"
        >
        <v-card-text class="flex ma-1 pa-1">
        <video
            ref="video"
            :muted="videoMuted"
            width="100%"
            height="100%"
            :autoplay="videoAutoplay"
            :playsinline="videoPlaysinline"
          />
        </v-card-text>

          <template v-slot:actions>
            <v-btn
              class="ml-auto"
              text="Close"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>


  </v-form>
</template>

<script setup>
import { ref } from "vue";

import { useNuggetStore } from "../stores/nugget";
const nug = useNuggetStore();

const videoWidth = ref('640');
const videoHeight = ref('480');
const videoAutoplay = ref(true);
const videoPlaysinline = ref(true);
const videoMuted = ref(true);
const videoSource = ref('Video')

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

const video = ref(); // shared video object

const showVideoDialog = ref();

const selectedFiles = ref(); // Files from local file picker
const pendingFiles = ref(); // Files cpatured from device to OPFS

const submitCreate = async () => {
  const nuggetData = {
    name: name.value,
    description: description.value,
    tags: tags.value,
  };

  console.log("CREATING...", nuggetData);

  const nuggetId = await nug.createNugget(nuggetData);

  console.log("NEW NUGGET ID:", nuggetId);

  console.log("UPLOADS", selectedFiles.value);
};

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
  try {
    showVideoDialog.value = true;
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => streamVideo(stream, 'Screenshare'));
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

const streamVideo = (stream, srcName) => {
  videoSource.value = srcName;
  video.value.srcObject = stream;
}

</script>
