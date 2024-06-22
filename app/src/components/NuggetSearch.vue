<template>
   <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="900">
      <div v-if="title" class="text-center">
        <h1 class="text-h3 font-weight-bold">{{title}}</h1>
      </div>
    <v-form v-model="valid" @submit.prevent="submitSearch">
      <v-container>
        <v-row>
          <v-text-field v-model="searchText" label="Search text"></v-text-field>
        </v-row>
        <v-row>
          <v-autocomplete
            v-model="tags"
            clearable
            chips
            multiple
            label="Tags"
            :items="[
              'California',
              'Colorado',
              'Florida',
              'Georgia',
              'Texas',
              'Wyoming',
            ]"
          ></v-autocomplete>
        </v-row>
        <v-row justify="center">
          <v-col cols="5">
            <v-btn type="submit" block color="primary">Search</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    </v-responsive>
    </v-container>
</template>

<script setup>
import { ref } from "vue";

import { useNuggetStore } from "../stores/nugget";

const props = defineProps({
  title: {
    type: String,
    default: null
  },
});

const nug = useNuggetStore();

// Form Fields
const valid = ref();
const searchText = ref();
const tags = ref([]);

const submitSearch = async () => {
  const searchParams = {
    searchText: searchText.value,
    tags: tags.value,
  };
};
</script>
