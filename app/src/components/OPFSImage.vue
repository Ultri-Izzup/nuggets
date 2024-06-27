<template>
  <img
  :src="src"
  :alt="altText"
  :width="width"
  :height="height"
  >
</template>

<script setup>
import {ref, onMounted} from "vue";

import { useNuggetStore } from "@/stores/nugget";
const nug = useNuggetStore();

const props = defineProps({
  filePath: String,
  altText: String,
  usemap: {
    type: String,
    default: null
  },
  height: String,
  width: String
})

const src = ref(null);

onMounted(async () => {
  const imgSrc = await nug.opfsFile(props.filePath);
  imgSrc.onload = () => {
    src.value = imgSrc.result;
  }
})

</script>
