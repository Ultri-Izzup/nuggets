<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto py-6" max-width="600">
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">Nugget</h1>
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
              <v-form v-model="valid" @submit.prevent>
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="name"
                      label="Name"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-textarea
                      v-model="description"
                      label="Description"
                      :rules="descriptionRules"
                      rows="1"
                      auto-grow
                    ></v-textarea>
                  </v-row>
                  <v-row>
                    <v-combobox
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
                    ></v-combobox>
                  </v-row>
                  <v-row justify="center">
                    <v-spacer />
                    <v-icon
                      color="gray"
                      icon="mdi-microphone"
                      size="x-large"
                    ></v-icon>

                    <v-spacer />
                    <v-icon
                      color="gray"
                      icon="mdi-upload"
                      size="x-large"
                    ></v-icon>

                    <v-spacer />
                    <v-icon
                      color="gray"
                      icon="mdi-camera"
                      size="x-large"
                    ></v-icon>

                    <v-spacer />
                    <v-icon
                      color="gray"
                      icon="mdi-monitor"
                      size="x-large"
                    ></v-icon>
                    <v-spacer />
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="6">
                      <v-btn type="submit" block color="primary">Create</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-tabs-window-item>

            <v-tabs-window-item value="search">
              <v-card class="bg-grey-darken-3 pa-4"
                >Search</v-card
              ></v-tabs-window-item
            >
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

// Tabs
const tab = ref("create");

// Forms
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
</script>
