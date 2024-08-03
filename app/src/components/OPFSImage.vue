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

import { readOPFSFile } from "@/shared/opfsFuncs";

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

console.log('PROPS', props)

const src = ref(null);

onMounted(async () => {
  console.log('LOADING FILE FROM OPFS', props.filePath)
  const imgSrc = await readOPFSFile(props.filePath);
  console.log('SRC', imgSrc)
  imgSrc.onload = () => {
    const r = imgSrc.result;
    console.log(
      `${props.filePath} RESULT `, r
    )
    src.value = r;
    // const encoder = new TextEncoder('utf-8')
    // const encoded = window.crypto.subtle.digest('SHA-256',  encoder.encode(imgSrc.result))
    // console.log('SRC RESULT', encoded)
  }
})

</script>
