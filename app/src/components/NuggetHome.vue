<template>
  <v-container class="flex">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="600">
      <div class="text-center">
        <h1 class="text-h3 font-weight-bold">Nuggets</h1>
      </div>

      <div class="py-4" />

      <v-card>
        <v-tabs fixed-tabs v-model="tab">
          <v-tab value="create" prepend-icon="mdi-plus" text="Create"></v-tab>
          <v-tab
            value="search"
            prepend-icon="mdi-magnify"
            text="Search"
          ></v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="create">
              <NuggetCreate></NuggetCreate>
            </v-tabs-window-item>

            <v-tabs-window-item value="search">
              <NuggetSearch></NuggetSearch>
            </v-tabs-window-item
            >
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

import { useNuggetStore } from "../stores/nugget";
const nug = useNuggetStore();

// Tabs
const tab = ref("create");

// Form Fields
const valid = ref();

const name = ref();
const nameRules = [
  (value) => {
    if (value) return true;

    return "Name is required.";
  },
  (value) => {
    if (value?.length >= 2) return true;

    return "Name must be at least 2 characters.";
  },
  (value) => {
    if (value?.length <= 50) return true;

    return "Name must be less than 50 characters.";
  },
];

const description = ref();
const descriptionRules = [
  (value) => {
    if (!value || value?.length <= 1500) return true;

    return "Description must be less than 1500 characters.";
  },
];

const tags = ref([]);

// Content
const selectedFiles = ref();
const pendingFiles = ref();

const submitCreate = async () => {

  const nuggetData = {
    name: name.value,
    description: description.value,
    tags: tags.value
  }

  console.log('CREATING...', nuggetData);

  const nuggetId = await nug.createNugget(nuggetData);

  console.log('NEW NUGGET ID:', nuggetId);

  console.log('UPLOADS', selectedFiles.value)

}

const uploadFiles = async () => {
  console.log('FILE UPLOAD REQUESTED', selectedFiles.value)
}

const showFilePicker = async () => {
  const pickerOpts = {
  types: [
    {
      description: "Images",
      accept: {
        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: true,
};
  selectedFiles.value = await window.showOpenFilePicker(pickerOpts);
}

const submitSearch = async () => {
  console.log('SEARCHING...');

}
</script>
