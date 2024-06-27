<template>
  <video
    ref="video"
    :muted="muted"
    :alt="altText"
    :width="width"
    :height="height"
    :autoplay="autoplay"
    :playsinline="playsinline"
    controls
  />
</template>

<script setup>
import {ref, onMounted} from "vue";

import { useNuggetStore } from "@/stores/nugget";
const nug = useNuggetStore();

const props = defineProps({
  filePath: String,
  altText: String,
  height: String,
  width: String,
  autoplay: Boolean,
  playsinline: Boolean,
  muted: Boolean
})

const video = ref(null);

onMounted(async () => {
  console.log('LOADING FILE FROM OPFS', props.filePath)
  const srcData = await nug.readOPFSFile(props.filePath);
  srcData.onload = () => {
    video.value.src = srcData.result;
  }
})

</script>
