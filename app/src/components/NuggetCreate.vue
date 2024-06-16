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
        <v-col cols="12"
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
          <img :src="file.url" width="250px"/>
          <br />
          <span class="text-caption">{{ file.name }}</span>
        </v-col>
      </v-row>
    </v-container>

    <canvas ref="snapshot" style="overflow: auto" class="flex" hidden></canvas>

    <v-dialog v-model="showVideoDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card prepend-icon="mdi-video" :title="videoSource" class="ma-0 pa-0">
          <v-card-text class="flex ma-1 pa-1">
            <v-row v-if="videoSource === 'Camera'" justify="center">
              <v-select
                v-model="selectedCamera"
                density="compact"
                label="Camera"
                :items="cameras"
                item-title="label"
                item-value="value"
              ></v-select>
            </v-row>
            <video
              ref="video"
              :muted="videoMuted"
              :width="videoWidth"
              :height="videoHeight"
              :autoplay="videoAutoplay"
              :playsinline="videoPlaysinline"
            />
            <v-row justify="center" class="mt-1">
              <v-btn
                icon="mdi-camera-iris"
                class="mx-1"
                @click="takeSnapshot"
              ></v-btn>
              <!-- <v-btn
                v-if="recordingVideo"
                icon="mdi-stop"
                class="mx-1"
                @click="stopRecordVideo"
              ></v-btn>
              <v-btn
                v-else
                icon="mdi-record"
                class="mx-1"
                @click="recordVideo"
              ></v-btn> -->
            </v-row>
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

    <v-dialog v-model="showAudioDialog" class="flex ma-0 pa-0">
      <template v-slot:default="{ isActive }">
        <v-card prepend-icon="mdi-microphone" title="Audio Recorder" class="ma-0 pa-0">
          <v-card-text class="flex ma-1 pa-1">
            <!-- <v-row justify="center">
              <v-select
                v-model="selectedMicrophone"
                density="compact"
                label="Audio"
                :items="audioInputs"
                item-title="label"
                item-value="value"
              ></v-select>
            </v-row> -->

            <v-row justify="center" class="mt-1">
              <v-btn
                icon="mdi-record"
                class="mx-1"
                @click="recordAudio"
                :disabled="recordingAudio"
              ></v-btn>
              <v-btn
                icon="mdi-stop"
                class="mx-1"
                @click="stopRecordAudio"
                :disabled="!recordingAudio"
              ></v-btn>
            </v-row>
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

const cameras = ref([]);
const selectedCamera = ref();
const snapshot = ref(null);

const audioInputs = ref([]);

const videoWidth = ref("100%");
const videoHeight = ref("auto");
const videoAutoplay = ref(true);
const videoPlaysinline = ref(true);
const videoMuted = ref(true);
const videoSource = ref("Video");
const recordingVideo = ref(false);
const recordingAudio = ref(false);

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

const video = ref();
const videoChunks = ref([]);

const audio = ref();
const audioChunks = ref([]);

const showVideoDialog = ref(false);
const showAudioDialog = ref(false);

const selectedFiles = ref(); // Filehandles from local file picker
const dataURLs = ref([]); // dataURLs captured from the device

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
    console.error('FAILED to create IDB record', nuggetData)
  }


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
      .then((stream) => streamVideo(stream, "Screenshare"));
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

const streamVideo = (stream, srcName) => {
  videoSource.value = srcName;
  video.value.srcObject = stream;
};

const showCamera = async () => {
  console.log("CAMERA");
  if (cameras.value.length === 0) {
    initDevices();
  }
  videoSource.value = "Camera";
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

const initDevices = () => {
  const constraints = { video: true, audio: { echoCancellation: true } };

  // if (resolution.value) {
  //   constraints.video = {};
  //   constraints.video.height = resolution.value.height;
  //   constraints.video.width = resolution.value.width;
  // }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const tracks = stream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
      // tracks.forEach((track) => {
      //   track.stop();
      // });
      navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          const deviceInfo = deviceInfos[i];
          console.log(deviceInfo);
          switch(deviceInfo.kind) {
            case 'videoinput':
              cameras.value.push({
                label: deviceInfo.label,
                value: deviceInfo.deviceId,
              });
            break;
            case 'audioinput':
              audioInputs.value.push({
                label: deviceInfo.label,
                value: deviceInfo.deviceId,
              });
            break;
          }
          // if (deviceInfo.kind === "videoinput") {
          //   // store only the data we need
          //   cameras.value.push({
          //     label: deviceInfo.label,
          //     value: deviceInfo.deviceId,
          //   });
          // }
        }
      });
    })
    .catch((error) => console.error(error));
};

const loadCamera = (device) => {
  const constraints = {
    video: {
      deviceId: { exact: device },
    },
    audio: { echoCancellation: true },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.value.srcObject = stream;
    })
    .catch((error) => console.error(error));
};

const takeSnapshot = async () => {
  console.log(`Take snapshot image from ${videoSource.value} video`);

  await drawSnapshot();

  const dataURL = snapshot.value.toDataURL();

  const urlObj = {
    name: `${videoSource.value}-img-${new Date().toISOString()}.png`,
    url: dataURL
  }

  dataURLs.value.push(urlObj)

};

const drawSnapshot = async () => {
  snapshot.value.width = video.value.videoWidth;
  snapshot.value.height = video.value.videoHeight;

  const ctx = snapshot.value.getContext("2d");
  ctx.drawImage(video.value, 0, 0, snapshot.value.width, snapshot.value.height);
};

const recordVideo = async () => {
  console.log("Record Video");
  recordingVideo.value = true;
};

const stopRecordVideo = async () => {
  console.log("Stop Recording video");
  recordingVideo.value = false;
};

const recordAudio = async () => {
  console.log("Record Audio");
  recordingAudio.value = true;
};

const stopRecordAudio = async () => {

  console.log("Stop Recording audio");
  recordingAudio.value = false;
  showAudioDialog.value = false;
};

watch(selectedCamera, (newVal, oldVal) => {
  if (newVal) {
    console.log(newVal);
    console.log(`Use camera, ${newVal}`);
    loadCamera(newVal);
  }
});
</script>
