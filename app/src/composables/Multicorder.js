/**
 * MULTICORDER
 */
import { ref, readonly } from "vue";

// Worker scripts
/**
  * Initialize Ultri Worker
  */
let fileHandleWorker = null;  // Used for local file attachments
// let dataURLWorker = null;     // Used for images
let blobWorker = null;        // Used for audio, images and video
let exportWorker = null;      // Used for exporting Nuggets

if (window.Worker) {

  fileHandleWorker = new Worker("/workers/fileHandleWorker.js", { type: "module" });
  fileHandleWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED FileHandle WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };
  console.log("FILE WORKER LOADED IN Nuggets Composable");

  // dataURLWorker = new Worker("/workers/dataURLWorker.js", { type: "module" });
  // dataURLWorker.onmessage = (msg) => {
  //   console.log(
  //     "DEDICATED URLDATA WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
  //     msg
  //   );
  // };
  // console.log("DATAURL WORKER LOADED IN Nuggets Composable");

  blobWorker = new Worker("/workers/blobWorker.js", { type: "module" });
  blobWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED BLOB WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };
  console.log("BLOB WORKER LOADED IN Nuggets Composable");

  exportWorker = new Worker("/workers/exportWorker.js", { type: "module" });
  exportWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED EXPORT WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };
  console.log("EXPORT WORKER LOADED IN Nuggets Composable");
}


// SHARED AUDIO / MICROPHONE
const showAudioCaptureDialog = ref(false);
const audioCaptureMode = ref('tmp');
const selectedAudioDevice = ref();
const tmpAudios = ref([]);

// VIDEO AND IMAGES
const tmpVideos = ref([]);
const tmpImages = ref([]);
const videoSource = ref("Video");
const selectedVideoDevice = ref();
const preferredCamera = ref();
const showCameraDialog = ref(false);
const vidCaptureMode = ref('tmp');

// GEOLOCATION
const geoLocation = ref();
const waypoints = ref([]);

// FILES
const tmpFiles = ref();
const showFileSelectDialog = ref(false);
const fileCaptureMode = ref('tmp');

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

  tmpFiles.value = null;
  showFileSelectDialog.value = false;

  audioCaptureMode.value = 'tmp'
  vidCaptureMode.value = 'tmp'
  fileCaptureMode.value = 'tmp'
}

// Add to the temporary assets
const tmpStore = (assetType, assetObj) => {

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

// Add to persisted OPFS assets
const opfsStore = (nuggetId, assetType, assetObj) => {

  blobWorker.postMessage({ nuggetId: Number(nuggetId), subDir: assetType, blobs: [assetObj] });

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


const showAudio = async (saveMode='tmp') => {
  showAudioCaptureDialog.value = true;
  audioCaptureMode.value = saveMode;
};

const showCamera = async (saveMode='tmp') => {
  videoSource.value = "Camera";
  selectedVideoDevice.value = preferredCamera.value ? preferredCamera.value : '';
  showCameraDialog.value = true;
  vidCaptureMode.value = saveMode;
};

const showScreenPicker = async (saveMode='tmp') => {
  videoSource.value = "Screen";
  selectedVideoDevice.value = "screen";
  showCameraDialog.value = true;
  vidCaptureMode.value = saveMode;
}

const showFilePicker = async (nuggetId=null, description="File Assets", accept={'*/*': ['.png', '.gif', '.jpeg', '.jpg']}) => {
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

    const pickedFiles = await window.showOpenFilePicker(pickerOpts);

    if(nuggetId) {
      console.log('MFNFILES', nuggetId, pickedFiles)

    } else {
      tmpFiles.value = pickedFiles;
    }


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
    vidCaptureMode,

    // AUDIO
    tmpAudios: readonly(tmpAudios),
    showAudio,
    showAudioCaptureDialog,
    selectedAudioDevice,
    audioCaptureMode,

    // FUNCTION TO STORE IMAGES, VIDEO, AUDIO IN MEMORY
    tmpStore,
    // FUNCTION TO STORE IMAGES, VIDEO, AUDIO IN DIRECTLY TO OPFS
    opfsStore,

    // GEOLOCATION
    getGeoLocation,
    geoLocation,
    waypoints,

    // FILES
    showFilePicker,
    tmpFiles: readonly(tmpFiles),
    showFileSelectDialog,
    fileCaptureMode,

    // CLEAR CHANGES, BACK TO DEFAULT
    resetMulticorderAssets,
  };
}
