<template>
  <v-container>
    <v-row class="text-body2">
      <v-col cols="12 py-1">
        Lat/Long: {{ geoLocation.latitude }},
        {{ geoLocation.longitude }}
      </v-col>
      <v-col cols="12 py-1">
        Time: {{ new Date(geoLocation.timestamp).toLocaleString() }}
      </v-col>
      <v-col v-if="geoLocation.altitude" cols="12">
        Altitude: {{ geoLocation.altitude }}
      </v-col>
      <v-col v-if="geoLocation.speed" cols="12">
        Speed: {{ geoLocation.speed }}
      </v-col>
      <v-col v-if="geoLocation.heading" cols="12">
        Heading: {{ geoLocation.heading }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  geoLocation: Object,
});
</script>
