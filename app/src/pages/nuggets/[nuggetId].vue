<template>
  <NuggetEdit :nuggetId="nuggetId"/>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const nuggetId = ref(route.params.nuggetId);

</script>
