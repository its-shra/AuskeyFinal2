URL = window.URL || window.webkitURL;

var gumStream;
var rec;
var input;

var canvasContext;
var analyser;
var dataArray;
var bufferLength;
var canvas;

function setupCanvas() {
  canvas = document.getElementById('liveWaveform');
  canvasContext = canvas.getContext('2d');
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function updateWaveform() {
  analyser.getByteTimeDomainData(dataArray);

  canvasContext.fillStyle = 'rgb(255, 255, 255)';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.lineWidth = 2;
  canvasContext.strokeStyle = 'rgb(0, 0, 0)';
  canvasContext.beginPath();
canvasContext.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Slightly transparent background
canvasContext.fillRect(0, 0, canvas.width, canvas.height);
canvasContext.lineWidth = 2;
canvasContext.strokeStyle = 'rgb(29, 131, 72)'; // Light green color for the wave
canvasContext.lineJoin = 'round'; // Rounded line joints for smoother curves
canvasContext.lineCap = 'round'; // Rounded line caps
canvasContext.beginPath();






  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasContext.lineTo(canvas.width, canvas.height / 2);
  canvasContext.stroke();

  requestAnimationFrame(updateWaveform); // Continue updating the waveform.
}


  
  

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
let originalAudioBlob;
const saveToComputerButton = document.getElementById("saveToComputer");
saveToComputerButton.addEventListener("click", saveAudioToComputer);
let isAudioPlaying = false;


var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var playButton = document.getElementById("playButton");

var cancelNoise = document.getElementById("cancelNoise");
var cardioFilter = document.getElementById("cardioFilter");
var respiFilter = document.getElementById("respiFilter");
var abdominalFilter = document.getElementById("abdominalFilter");

playButton.addEventListener("click", playRecording);

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
  console.log("recordButton clicked");

  var constraints = { audio: true, video: false };

  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false;

  setupCanvas(); // Initialize the waveform canvas

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      console.log(
        "getUserMedia() success, stream created, initializing Recorder.js ..."
      );

      audioContext = new AudioContext();

      gumStream = stream;

      input = audioContext.createMediaStreamSource(stream);

      rec = new Recorder(input, { numChannels: 1 });

      analyser = audioContext.createAnalyser();
      var source = audioContext.createMediaStreamSource(gumStream);
      source.connect(analyser);
      analyser.fftSize = 256;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      updateWaveform();

      rec.record();

      console.log("Recording started");
    })
    .catch(function (err) {
      recordButton.disabled = false;
      stopButton.disabled = true;
      pauseButton.disabled = true;
    });
}

function pauseRecording() {
  console.log("pauseButton clicked rec.recording=", rec.recording);
  if (rec.recording) {
    rec.stop();
    pauseButton.innerHTML = "Resume";
  } else {
    rec.record();
    pauseButton.innerHTML = "Pause";
  }
}

function sendAudioToAPI(audioBlob, lowCutoff, highCutoff) {
  console.log("sending audio");
  console.log(lowCutoff);
  console.log(highCutoff);

  const formData = new FormData();
  formData.append("audio", audioBlob, "recorded_audio.wav");
  formData.append("low_cutoff", lowCutoff.toString());
  formData.append("high_cutoff", highCutoff.toString());

  console.log(formData);

  fetch("http://iitbproj.pythonanywhere.com/process_audio", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((audioData) => {
      console.log("Audio data received from API:", audioData);
      const audioUrl = URL.createObjectURL(audioData);
      const audioPlayer = new Audio(audioUrl);
      audioPlayer.play();
    })
    .catch((error) => {
      console.error("Error sending audio to API:", error);
    });
}

function stopRecording() {
  console.log("stopButton clicked");
  stopButton.disabled = true;
  recordButton.disabled = false;
  playButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.innerHTML = "Pause";

  rec.stop();
  gumStream.getAudioTracks()[0].stop();

  rec.exportWAV((blob) => {
    originalAudioBlob = blob;
    console.log(originalAudioBlob);
    sendAudioToAPI(blob, 60, 8000);
  });

  const saveToComputerButton = document.getElementById("saveToComputer");
    saveToComputerButton.disabled = false;
}

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  audioPlayer.src = url;
  audioPlayer.style.display = "block";
  playButton.disabled = false;
}

function playRecording() {
  if (audioPlayer.src) {
    audioPlayer.play();
    console.log("playButton clicked");
  } else {
    alert("No audio to play. Please record audio first.");
  }
}

cancelNoise.addEventListener("click", () => {
  if (originalAudioBlob) {
    console.log(originalAudioBlob);
    sendAudioToAPI(originalAudioBlob, 1, 60); // Send the original audio with cutoff values
  }
});

cardioFilter.addEventListener("click", () => {
  if (originalAudioBlob) {
    sendAudioToAPI(originalAudioBlob, 60, 600); // Send the original audio with cutoff values
  }
});

respiFilter.addEventListener("click", () => {
  if (originalAudioBlob) {
    sendAudioToAPI(originalAudioBlob, 60, 4000); // Send the original audio with cutoff values
  }
});

abdominalFilter.addEventListener("click", () => {
  if (originalAudioBlob) {
    sendAudioToAPI(originalAudioBlob, 60, 8000); // Send the original audio with cutoff values
  }
});


function saveAudioToComputer() {
  const selectedFormat = document.getElementById("audioFormat").value;
  const audioBlob = originalAudioBlob; // Use the original audio blob

  if (!audioBlob) {
    alert("No audio to save. Please record audio first.");
    return;
  }

  const audioURL = URL.createObjectURL(audioBlob);
  const link = document.createElement("a");
  link.href = audioURL;
  link.download = `recorded_audio.${selectedFormat}`;
  link.click();
}