/**
 * MULTICORDER
 */
import { ref, readonly } from "vue";

// SHARED AUDIO / MICROPHONE
const showAudioCaptureDialog = ref(false);
const selectedAudioDevice = ref();
const tmpAudios = ref([]);

// VIDEO AND IMAGES
const tmpVideos = ref([]);
const tmpImages = ref([]);
const videoSource = ref("Video");
const selectedVideoDevice = ref();
const preferredCamera = ref();
const showCameraDialog = ref(false);

// GEOLOCATION
const geoLocation = ref();
const waypoints = ref([]);

// FILES
const tmpFiles = ref();
const showFileSelectDialog = ref(false);

const $reset = () => {
  tmpAudios.value=[];
  showAudioCaptureDialog.value = false;
  //selectedAudioDevice.value=null;
  tmpVideos.value=[];
  tmpImages.value=[];
  videoSource.value = "Video";
  //selectedVideoDevice.value = null;
  preferredCamera.value = null;
  showCameraDialog.value = false;
  geoLocation.value = null;
  waypoints.value = [];

  tmpFiles.value = [];
  showFileSelectDialog.value = false;
}

// Add to the temporary assets
const tmpStore = (assetType, assetObj) => {

  console.log("WTF", assetType, assetObj)
  switch(assetType) {
    case 'image':
      tmpImages.value.push(assetObj);
      break;

    case 'video':
      tmpVideos.value.push(assetObj);
      break;

    case 'audio':
      tmpAudios.value.push(assetObj);
      break;
  }
};

const saveVideoSource = (newSource) => {
  selectedVideoDevice.value = newSource;
  preferredCamera.value = newSource;
  console.log("VIDEO SOURCE SET", newSource);
};

const saveVideoChunk = (chunk) => {
  tmpVideos.value.push(chunk);
  console.log("VIDEO CHUNK ADDED", chunk);
};


const showAudio = async () => {
  showAudioCaptureDialog.value = true;
};

const showCamera = async () => {
  videoSource.value = "Camera";
  selectedVideoDevice.value = preferredCamera.value ? preferredCamera.value : '';
  showCameraDialog.value = true;
};

const showScreenPicker = async () => {
  videoSource.value = "Screen";
  selectedVideoDevice.value = "screen";
  showCameraDialog.value = true;
}

const showFilePicker = async (description="File Assets", accept={'*/*': ['.png', '.gif', '.jpeg', '.jpg']}) => {
  if (window.showOpenFilePicker) {
    const pickerOpts = {
      types: [
        {
          description: description,
          accept: accept,
        },
      ],
      excludeAcceptAllOption: false,
      multiple: true,
    };
    tmpFiles.value = await window.showOpenFilePicker(pickerOpts);
    console.log('MFNFILES', tmpFiles.value)
  } else {
    showFileSelectDialog.value = true;
    // Show dialog with file input field
  }
};

const getGeoLocation = async () => {
  console.log("Request GeoLocation");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords);
      const jsonPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };

      if (position.coords.speed) {
        jsonPos.speed = position.coords.speed;
      }

      geoLocation.value = jsonPos;
      waypoints.value.push(jsonPos);
    });
  }
};

const resetMulticorderAssets = async () => {
  $reset();
}




/**
 * export for use as a composable
 */
export function useMulticorder() {

  return {

    // SCREEN
    showScreenPicker,

    // IMAGES / VIDEO / CAMERA
    tmpImages: readonly(tmpImages),
    tmpVideos: readonly(tmpVideos),
    saveVideoSource,
    saveVideoChunk,
    selectedVideoDevice,
    preferredCamera,
    showCamera,
    showCameraDialog,
    videoSource,

    // AUDIO
    tmpAudios: readonly(tmpAudios),
    showAudio,
    showAudioCaptureDialog,
    selectedAudioDevice,

    // FUNCTION TO STORE IMAGES, VIDEO, AUDIO IN MEMORY
    tmpStore,

    // GEOLOCATION
    getGeoLocation,
    geoLocation,
    waypoints,

    // FILES
    showFilePicker,
    tmpFiles,
    showFileSelectDialog,

    // CLEAR CHANGES, BACK TO DEFAULT
    resetMulticorderAssets,
  };
}
