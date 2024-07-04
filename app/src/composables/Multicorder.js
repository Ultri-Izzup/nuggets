/**
 * MULTICORDER
 */
import { ref, readonly } from "vue";

// SHARED temporary assest storage, AVAILABLE TO ALL COMPONENTS
// MICROPHONE
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

// SHARED File or FileSystem handles from the browser OS
const selectedFiles = ref();



const $reset = () => {
  tmpAudios.value=[];
  showAudioCaptureDialog.value = false;
  selectedAudioDevice.value=null;
  tmpVideos.value=[];
  tmpImages.value=[];
  videoSource.value = ref("Video");
  selectedVideoDevice = ref();
  preferredCamera.value = ref();
  showCameraDialog.value = ref(false);
  selectedFiles.value = null;
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
  console.log("showinf screen picjer")
  videoSource.value = "Screen";
  selectedVideoDevice.value = "screen";
  showCameraDialog.value = true;
}



/**
 * export for use as a composable
 */
export function useMulticorder() {

  return {

    showScreenPicker,

    tmpImages: readonly(tmpImages),
    tmpVideos: readonly(tmpVideos),
    saveVideoSource,
    saveVideoChunk,
    selectedVideoDevice,
    preferredCamera,
    showCamera,
    showCameraDialog,
    videoSource,

    tmpAudios: readonly(tmpAudios),
    showAudio,
    showAudioCaptureDialog,
    selectedAudioDevice,

    tmpStore,

    $reset
  };
}
