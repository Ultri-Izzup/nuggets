<template>
  <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="900">
      <div class="text-center">
        <h1 class="text-h3 font-weight-bold">File Manager</h1>
      </div>
      <div class="text-body-1">View/delete files in OPFS</div>

    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

import { useNuggetStore } from "../stores/nugget";
const nug = useNuggetStore();


</script>
