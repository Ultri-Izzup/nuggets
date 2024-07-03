<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
            <!-- DIALOGS -->
<!--
            <v-dialog v-model="showCameraDialog" class="flex ma-0 pa-0">
          <template v-slot:default="{ isActive }">
            <v-card
              prepend-icon="mdi-video"
              :title="videoSource"
              class="ma-0 pa-0"
            >
              <v-card-text class="flex ma-1 pa-1">
                <VideoCapture
                  emitAs="dataURL"
                  :targetSource="selectedVideoDevice"
                  @snapshot="tempStoreSnapshot"
                  @deviceSelected="saveVideoSource"
                  @chunk="saveVideoChunk"
                  @recordedVideo="tempStoreVideo"
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
        </v-dialog> -->
  </v-app>
</template>

<script setup>
  //
</script>
