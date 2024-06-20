<template>
  <v-container>
    <v-row class="text-body2">
      <v-col cols="12 py-1">
        Lat/Long: {{ geoLocation.coords.latitude }},
        {{ geoLocation.coords.longitude }}
      </v-col>
      <v-col cols="12 py-1">
        Time: {{ new Date(geoLocation.timestamp).toLocaleString() }}
      </v-col>
      <v-col v-if="geoLocation.coords.altitude" cols="12">
        Altitude: {{ geoLocation.coords.altitude }}
      </v-col>
      <v-col v-if="geoLocation.coords.speed" cols="12">
        Speed: {{ geoLocation.coords.speed }}
      </v-col>
      <v-col v-if="geoLocation.coords.heading" cols="12">
        Heading: {{ geoLocation.coords.heading }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  geoLocation: Object,
});
</script>
