<template>
  <v-container>
    <v-row v-if="targetSource != 'screen'" justify="center">
      <v-select
        v-model="selectedDevice"
        density="compact"
        label="Audio Input"
        :items="devices"
        item-title="label"
        item-value="value"
      ></v-select>
    </v-row>
    <v-row justify="center" class="mt-1">
      <v-btn
        v-if="!recording"
        icon="mdi-record"
        class="mx-1"
        @click="startRecording"
        color="primary"
      ></v-btn>
      <v-btn
        v-if="recording"
        icon="mdi-stop"
        class="mx-1"
        @click="stopRecording"
        color="red"
      ></v-btn>
    </v-row>
    <canvas ref="snapshot" style="overflow: auto" class="flex" hidden></canvas>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useNuggetStore } from "../stores/nugget";

const nug = useNuggetStore();

const props = defineProps({
  emitAs: {
    type: String,
    default: "dataURL",
  },
  targetSource: {
    type: String,
  },
});

const emit = defineEmits(["deviceSelected", "chunk", "recordedAudio"]);

const mediaRecorder = ref();

const devices = ref([]);
const selectedDevice = ref();

let chunks = ref([]);

const muted = ref(true);
const recording = ref(false);

const stream = (stream, srcName) => {
  audioSource.value = srcName;
  audio.value.srcObject = stream;
};

const initDevices = () => {
  const constraints = { audio: true };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const tracks = stream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
      navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          const deviceInfo = deviceInfos[i];
          // console.log(deviceInfo);
          switch (deviceInfo.kind) {
            case "audioinput":
              devices.value.push({
                label: deviceInfo.label,
                value: deviceInfo.deviceId,
              });
              break;
          }
        }
      });
    })
    .catch((error) => console.error(error));
};

const loadSource = (device) => {
  const constraints = {
    audio: true,
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      console.log("AUDIO STREAMING", device);
      mediaRecorder.value = new MediaRecorder(stream);
      mediaRecorder.value.ondataavailable = (e) => {
        chunks.value.push(e.data);
      };
      mediaRecorder.value.onstop = (e) => {
        console.log("recorder stopped");

        const clipName = `audio_clip_${nug.newFileTimestamp()}.mp3`;

        const blob = new Blob(chunks.value, { type: 'audio/mp3' });
        chunks.value = [];
        const audioURL = (window.URL || window.webkitURL).createObjectURL(blob);
        console.log('AUDIO URL', audioURL)
        emit('recordedAudio', {
          name: clipName,
          audioURL: audioURL
        })
      };
    })
    .catch((error) => console.error(error));
};

const startRecording = async () => {
  console.log("Record Audio");
  recording.value = true;
  mediaRecorder.value.start();
  console.log(mediaRecorder.value.state);
  console.log("recorder started");
};

const pauseRecording = async () => {
  console.log("Pause Recording Audio");
  recording.value = false;
};

const stopRecording = async () => {
  console.log("Stop Recording Audio");
  recording.value = false;
  mediaRecorder.value.stop();
};

onMounted(() => {
  initDevices();
  if (props.targetSource) {
    selectedDevice.value = props.targetSource;
  }
});

watch(
  selectedDevice,
  (newVal, oldVal) => {
    if (newVal) {
      console.log(newVal);
      console.log(`Use audio input, ${newVal}`);
      loadSource(newVal);
      emit("deviceSelected", newVal);
    }
  },
  { immediate: true }
);
</script>
