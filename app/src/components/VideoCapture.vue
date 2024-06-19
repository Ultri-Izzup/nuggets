<template>
  <v-container>
    <v-row justify="center">
      <v-select
        v-model="selectedSource"
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
      <v-btn icon="mdi-camera-iris" class="mx-1" @click="takeSnapshot"></v-btn>
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
    <canvas ref="snapshot" style="overflow: auto" class="flex" hidden></canvas>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  emitAs: {
    type: String,
    default: 'dataURL'
  },
  sourceOpts: {
    type: Array,
    default: ['camera', 'screen']
  },
  targetSource: {
    type: String
  }
})

const emit = defineEmits(["snapshot", "sourceSelected", "videoChunk"]);

const cameras = ref([]);
const selectedSource = ref();
const snapshot = ref(null);

const video = ref();
const videoChunks = ref([]);

const videoWidth = ref("100%");
const videoHeight = ref("auto");
const videoAutoplay = ref(true);
const videoPlaysinline = ref(true);
const videoMuted = ref(true);
const videoSource = ref("Video");
const recordingVideo = ref(false);

const streamVideo = (stream, srcName) => {
  videoSource.value = srcName;
  video.value.srcObject = stream;
};

const initDevices = () => {
  const constraints = { video: true, audio: { echoCancellation: true } };

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
          console.log(deviceInfo);
          switch (deviceInfo.kind) {
            case "videoinput":
              cameras.value.push({
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
  console.log('Take snapshot image from video');

  await drawSnapshot();

  const sourcePart = selectedSource.value === 'screen' ? 'screenshot' : 'camera'

  const output = {
    name: `${sourcePart}-img-${new Date().toISOString()}.png`,
  }

  switch(props.emitAs) {
    case 'dataURL': {
      output.dataURL = snapshot.value.toDataURL();
    }
  }

  emit('snapshot', output)
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

onMounted(() => {
  initDevices();
  if(props.targetSource){
    selectedSource.value = props.targetSource;
  }
})

watch(
  selectedSource,
  (newVal, oldVal) => {
    if (newVal) {
      console.log(newVal);
      console.log(`Use camera, ${newVal}`);
      loadSource(newVal);
      emit('sourceSelected', newVal)
    }
  },
  { immediate: true }
);
</script>