<template>
  <v-app>
    <v-app-bar :elevation="1">
      <template v-slot:prepend>
        <v-app-bar-nav-icon  to="/"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Nuggets</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-plus" to="/nuggets/create"></v-btn>

        <v-btn icon="mdi-magnify" to="/nuggets/search"></v-btn>
        <v-menu>
          <template v-slot:activator="{props}">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item>
              {{route.params.nuggetId}}
              <v-list-item-title @click="route.params.id ? exportCurrentNugget() : ''" :class="route.params.id ? '' : 'text-grey'">
                <v-icon icon="mdi-export"></v-icon> Export Nugget
              </v-list-item-title>
               <v-list-item-title @click="exportCurrentNugget">
                <v-icon icon="mdi-export"></v-icon> Export ALL Nuggets
              </v-list-item-title>
              <v-list-item-title @click="router.push('/exports')">
                <v-icon icon="mdi-download-multiple"></v-icon> Download Exports
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";

import {useNuggetStore} from "@/stores/nugget";
const route = useRoute();
const router = useRouter();
const nug = useNuggetStore();
const exportCurrentNugget = async () => {
  console.log(`START EXPORT for ${route.params.id}`)
  const exportObj = await nug.startNuggetExport(route.params.id);
  console.log('STARTED EXPORT', exportObj)
}
</script>
