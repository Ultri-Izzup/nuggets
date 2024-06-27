<template>
  <audio
    ref="audio"
    :muted="muted"
    :alt="altText"
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
  autoplay: Boolean,
  playsinline: Boolean,
  muted: Boolean
})

const audio = ref(null);

onMounted(async () => {
  console.log('LOADING FILE FROM OPFS', props.filePath)
  const srcData = await nug.readOPFSFile(props.filePath);
  srcData.onload = () => {
    audio.value.src = srcData.result;
  }
})

</script>
