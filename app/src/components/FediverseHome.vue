<template>
  <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="900">
      <div class="text-center">
        <h1 class="text-h3 font-weight-bold">Fediverse Client</h1>
      </div>
      <div class="text-body-1">This will support connecting to multiple Fediverse accounts. You will be able to publish Nuggets as well as save Fediverse content as Nuggets.</div>

    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

import { useNuggetStore } from "../stores/nugget";
const nug = useNuggetStore();


</script>
