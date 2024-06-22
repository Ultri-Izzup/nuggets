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

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
//
</script>
