<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useNuggets } from "@/composables/Nuggets";
import { useMulticorder } from "@/composables/Multicorder";
const route = useRoute();
const router = useRouter();

const {
  // Temporarily store images, video or audio
  tmpStore,
  // Store directly to OPFS, must be in a nuggetId space
  opfsStore,
  // CAMERA / VIDEO / IMAGES
  saveVideoSource,
  showCamera,
  showCameraDialog,
  startNuggetExport,
  videoSource,
  selectedVideoDevice,
  // MICROPHONE / AUDIO RECORDINGS
  selectedAudioDevice,
  showAudio,
  showAudioCaptureDialog,
  saveAudioSource,
  audioCaptureMode,
  // SCREEN
  showScreenPicker,
  // GEOLOCATION
  getGeoLocation,
  // FILES
  showFilePicker,
  showFileSelectDialog,
} = useMulticorder();

const {
  showNewLinked,
  showNewLinkedDialog
} = useNuggets();

const leftDrawer = ref(false);
const appMenu = ref("nugget");

const toggleLeftDrawer = () => {
  leftDrawer.value = !leftDrawer.value;
};

const currentNuggetId = computed(() => {
  return route.params.nuggetId;
})

const exportCurrentNugget = async () => {
  console.log(`START EXPORT for ${route.params.nuggetId}`);
  const exportObj = await startNuggetExport(route.params.nuggetId);
  console.log("STARTED EXPORT", exportObj);
};
</script>

<template>
  <v-app>
    <v-app-bar :elevation="1">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="toggleLeftDrawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Ultri Space</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-plus" to="/nuggets/create"></v-btn>

        <v-btn icon="mdi-magnify" to="/nuggets/search"></v-btn>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list v-if="appMenu === 'nugget'" density="compact">

            <v-list-item
              v-if="currentNuggetId"
              @click="showNewLinked"
              append-icon="mdi-link"
              >Linked Nugget
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="showCamera()" append-icon="mdi-camera"
              >Camera
            </v-list-item>

            <v-list-item
              @click="showAudio('ospf')"
              append-icon="mdi-microphone"
              >Record Audio
            </v-list-item>

            <v-list-item
              @click="getGeoLocation()"
              append-icon="mdi-pin"
              >Geo Location
            </v-list-item>

            <v-list-item
              @click="showScreenPicker()"
              append-icon="mdi-monitor"
              >Screenshare
            </v-list-item>

            <v-list-item
              @click="showFilePicker(currentNuggetId)"
              append-icon="mdi-paperclip"
              >Attach Files
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item
              v-if="currentNuggetId"
              @click="route.params.nuggetId ? exportCurrentNugget() : ''"
              append-icon="mdi-export"
              >Export Nugget
            </v-list-item>
            <v-list-item
              @click="router.push('/exports')"
              append-icon="mdi-download"
            >
              Downloads
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="leftDrawer" temporary>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>

        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-brain"
          title="Nuggets"
          to="/nuggets"
        ></v-list-item>

        <!-- <v-list-item
          prepend-icon="mdi-mastodon"
          title="Fediverse"
          to="/fediverse"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-phone"
          title="VoIP"
          to="/voip"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-circle"
          title="Spheres"
          to="/spheres"
        ></v-list-item> -->

        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-export"
          title="Export / Import"
          to="/exports"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-file-multiple"
          title="File Browser"
          to="/files"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-database"
          title="Data Browser"
          to="/data"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
      <v-dialog v-model="showCameraDialog" class="flex ma-0 pa-0">
        <template v-slot:default="{ isActive }">
          <v-card
            prepend-icon="mdi-video"
            :title="videoSource"
            class="ma-0 pa-0"
          >
            <v-card-text class="flex ma-1 pa-1">
              <VideoCapture
                :targetSource="selectedVideoDevice"
                @snapshot="(assetObj) => currentNuggetId ? opfsStore(currentNuggetId, 'images', assetObj) : tmpStore('image', assetObj)"
                @deviceSelected="saveVideoSource"
                @recordedVideo="(assetObj) => currentNuggetId ? opfsStore(currentNuggetId, 'videos', assetObj) : tmpStore('video', assetObj)"
              ></VideoCapture>
            </v-card-text>
            <template v-slot:actions>
              <v-btn
                prepend-icon="mdi-close"
                size="xl"
                color="grey"
                @click="isActive.value = false"
              ></v-btn>
            </template>
          </v-card>
        </template>
      </v-dialog>

      <v-dialog v-model="showAudioCaptureDialog" class="flex ma-0 pa-0">
          <template v-slot:default="{ isActive }">
            <v-card
              prepend-icon="mdi-microphone"
              title="Audio Recorder"
              class="ma-0 pa-0"
            >
              <v-card-text class="flex ma-1 pa-1">
                <AudioCapture
                  :targetSource="selectedAudioDevice"
                  @recordedAudio="(assetObj) => audioCaptureMode === 'ospf' ? opfsStore(currentNuggetId, 'audio', assetObj) : tmpStore('audio', assetObj)"
                  @deviceSelected="saveAudioSource"
                ></AudioCapture>
              </v-card-text>

              <template v-slot:actions>
                <v-btn
                  prepend-icon="mdi-close"
                  size="xl"
                  color="grey"
                  @click="isActive.value = false"
                ></v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog v-model="showFileSelectDialog" class="flex ma-0 pa-0">
          <template v-slot:default="{ isActive }">
            <v-card
              prepend-icon="mdi-file-multiple"
              title="Select Files"
              class="ma-0 py-0 px-5"
            >
              <v-card-text class="flex ma-1 pa-1 text-center">
                <v-file-input
                  v-model="selectedFiles"
                  multiple
                  label="Select files"
                  @change="showFileSelectDialog = false"
                ></v-file-input>
              </v-card-text>

              <template v-slot:actions>
                <v-btn
                  prepend-icon="mdi-close"
                  size="xl"
                  color="grey"
                  @click="isActive.value = false"
                ></v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog v-model="showNewLinkedDialog" class="flex ma-0 pa-0">
          <template v-slot:default="{ isActive }">
            <v-card
              :title="`Link to ${currentNuggetId}`"
              class="ma-0 pa-0"
            >
              <v-card-text class="flex ma-1 pa-1">
                <NuggetCreate title="New Nugget" :linkedNugget="linkedNugget"></NuggetCreate>
              </v-card-text>

              <template v-slot:actions>
                <v-btn
                  prepend-icon="mdi-close"
                  size="xl"
                  color="grey"
                  @click="isActive.value = false"
                ></v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
    </v-main>
    <AppFooter />
  </v-app>
</template>
