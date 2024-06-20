<template>
  <v-container>
    <v-row v-if="targetSource != 'screen'" justify="center">
      <v-select
        v-model="selectedDevice"
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
      :autoplay="autoplay"
      :playsinline="playsinline"
    />
    <v-row justify="center" class="mt-1">
      <v-btn icon="mdi-camera-iris" class="mx-1" @click="takeSnapshot"></v-btn>
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

const props = defineProps({
  emitAs: {
    type: String,
    default: "dataURL",
  },
  targetSource: {
    type: String,
  },
});

const emit = defineEmits([
  "snapshot",
  "deviceSelected",
  "chunk",
  "recordedVideo",
]);

const cameras = ref([]);
const selectedDevice = ref();
const snapshot = ref(null);

const video = ref();
const chunks = ref([]);
const mediaRecorder = ref();

const videoWidth = ref("100%");
const videoHeight = ref("auto");
const autoplay = ref(true);
const playsinline = ref(true);
const videoMuted = ref(true);
const videoSource = ref("Video");
const recording = ref(false);

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
          // console.log(deviceInfo);
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
      // Stream video to video HTML element
      video.value.srcObject = stream;
      enableVideoRecorder(stream);
    })
    .catch((error) => console.error(error));
};

const enableVideoRecorder = (stream) => {
  mediaRecorder.value = new MediaRecorder(stream);
  mediaRecorder.value.ondataavailable = (e) => {
    chunks.value.push(e.data);
  };
  mediaRecorder.value.onstop = (e) => {
    console.log("recorder stopped");

    const clipName = `video-clip-${new Date().toISOString()}.webm`;

    const blob = new Blob(chunks.value, { type: "video/webm" });
    chunks.value = [];
    const videoURL = (window.URL || window.webkitURL).createObjectURL(blob);
    console.log("VIDEO URL", videoURL);
    emit("recordedVideo", {
      name: clipName,
      videoURL: videoURL,
    });
  };
};

const takeSnapshot = async () => {
  console.log("Take snapshot image from video");

  await drawSnapshot();

  const sourcePart = props.targetSource === "screen" ? "screenshot" : "camera";

  const output = {
    name: `${sourcePart}-img-${new Date().toISOString()}.png`,
  };

  switch (props.emitAs) {
    case "dataURL": {
      output.dataURL = snapshot.value.toDataURL();
    }
  }

  emit("snapshot", output);
};

const drawSnapshot = async () => {
  snapshot.value.width = video.value.videoWidth;
  snapshot.value.height = video.value.videoHeight;

  const ctx = snapshot.value.getContext("2d");
  ctx.drawImage(video.value, 0, 0, snapshot.value.width, snapshot.value.height);
};

const startRecording = async () => {
  console.log("Record Video");
  recording.value = true;
  mediaRecorder.value.start();
  console.log(mediaRecorder.value.state);
  console.log("recorder started");
};

const stopRecording = async () => {
  console.log("Stop Recording video");
  recording.value = false;
  mediaRecorder.value.stop();
  console.log(mediaRecorder.value.state);
  console.log("recorder stopped");
};

onMounted(() => {
  if (props.targetSource === "screen") {
    try {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
          streamVideo(stream, "Screenshare");
          enableVideoRecorder(stream);
        });
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  } else {
    initDevices();
    if (props.targetSource) {
      selectedDevice.value = props.targetSource;
    }
  }
});

watch(
  selectedDevice,
  (newVal, oldVal) => {
    if (newVal) {
      console.log(newVal);
      console.log(`Use camera, ${newVal}`);
      loadSource(newVal);
      emit("deviceSelected", newVal);
    }
  },
  { immediate: true }
);
</script>
