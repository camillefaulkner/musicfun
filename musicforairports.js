const SAMPLE_LIBRARY = {
    'Grand Piano': [
        { note: 'D', octave: 1, file: 'samples/D1.mp3' },
        { note: 'D', octave: 2, file: 'samples/D2.mp3' },
        { note: 'D', octave: 3, file: 'samples/D3.mp3' },
        { note: 'D', octave: 4, file: 'samples/D4.mp3' },
        { note: 'E', octave: 1, file: 'samples/E1.mp3' },
        { note: 'E', octave: 2, file: 'samples/E2.mp3' },
        { note: 'E', octave: 3, file: 'samples/E3.mp3' },
        { note: 'E', octave: 4, file: 'samples/E4.mp3' },
        { note: 'F#', octave: 1, file: 'samples/F#1.mp3' },
        { note: 'F#', octave: 2, file: 'samples/F#2.mp3' },
        { note: 'F#', octave: 3, file: 'samples/F#3.mp3' },
        { note: 'F#', octave: 4, file: 'samples/F#4.mp3' },
        // { note: 'G', octave: 1, file: 'samples/G1.mp3' },
        // { note: 'G', octave: 2, file: 'samples/G2.mp3' },
        // { note: 'G', octave: 3, file: 'samples/G3.mp3' },
        // { note: 'G', octave: 4, file: 'samples/G4.mp3' },
        { note: 'A', octave: 1, file: 'samples/A1.mp3' },
        { note: 'A', octave: 2, file: 'samples/A2.mp3' },
        { note: 'A', octave: 3, file: 'samples/A3.mp3' },
        { note: 'A', octave: 4, file: 'samples/A4.mp3' },
        { note: 'B', octave: 1, file: 'samples/B1.mp3' },
        { note: 'B', octave: 2, file: 'samples/B2.mp3' },
        { note: 'B', octave: 3, file: 'samples/B3.mp3' },
        { note: 'B', octave: 4, file: 'samples/B4.mp3' },
        { note: 'C#', octave: 1, file: 'samples/C#1.mp3' },
        { note: 'C#', octave: 2, file: 'samples/C#2.mp3' },
        { note: 'C#', octave: 3, file: 'samples/C#3.mp3' }
    ]
}

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

let audioContext = new AudioContext();

function fetchSample(path) {
  return fetch(encodeURIComponent(path))
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function noteValue(note, octave) {
  return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
  return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function getNearestSample(sampleBank, note, octave) {
  let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
    let distanceToA =
      Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    let distanceToB =
      Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function flatToSharp(note) {
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default:   return note;
  }
}

function getSample(instrument, noteAndOctave) {
  let [, requestedNote, requestedOctave] = /^(\w[b\#]?)(\d)$/.exec(noteAndOctave);
  requestedOctave = parseInt(requestedOctave, 10);
  requestedNote = flatToSharp(requestedNote);
  let sampleBank = SAMPLE_LIBRARY[instrument];
  let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
  let distance =
    getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
  return fetchSample(sample.file).then(audioBuffer => ({
    audioBuffer: audioBuffer,
    distance: distance
  }));
}

function playSample(instrument, note) {
  getSample(instrument, note).then(({audioBuffer, distance}) => {
    let playbackRate = Math.pow(2, distance / 12);
    let bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.playbackRate.value = playbackRate;
    bufferSource.connect(audioContext.destination);
    bufferSource.start();
  });
}

// var fs = require("fs")
// let songObj = {}
// var path = "musicforairports/samples"
// const random = () => {
//     let loopCount = parseInt(Math.random() * (40-20) + 20)
//     for (let i = 0; i < loopCount; i++) {
//         let noteNum = parseInt(Math.random() * (21)) //number of samples
//         let noteLength = parseInt(Math.random() * (30-3) + 3) * 250
//         let note = SAMPLE_LIBRARY["Grand Piano"][noteNum].note + SAMPLE_LIBRARY["Grand Piano"][noteNum].octave
        
//         // songObj[i] = setTimeout(() => playSample('Grand Piano', note),  noteLength);
//         setTimeout(() => playSample('Grand Piano', note),  noteLength);
//     }
// }
// random()

// console.log(songObj)
// for (const note in songObj) {
//     note
// }

// setTimeout(() => playSample('Grand Piano', 'F#2'),  1000);
// setTimeout(() => playSample('Grand Piano', 'A3'), 1500);
// setTimeout(() => playSample('Grand Piano', 'C#3'),  2000);
// setTimeout(() => playSample('Grand Piano', 'D3'), 1500);
// setTimeout(() => playSample('Grand Piano', 'E2'),  2500);
// setTimeout(() => playSample('Grand Piano', 'A3'), 3000);
// setTimeout(() => playSample('Grand Piano', 'C#3'),  3500);
// setTimeout(() => playSample('Grand Piano', 'D3'), 3000);
// setTimeout(() => playSample('Grand Piano', 'D2'), 4000);
// setTimeout(() => playSample('Grand Piano', 'A3'), 4500);
// setTimeout(() => playSample('Grand Piano', 'F#3'),  4500);

//take all samples and randomly select files and timestamps within 0 - 10,000 (maybe divisible by 250?)
//the same sample can be used more than once, the same time can be used more than once
//look at switches


// var note = document.querySelector(".blob");

// // Set up an event handler. Notice that we don't use "on" in front
// // of the event name when doing it this way.
// note.addEventListener("mouseover", changeDef);

// function changeDef(event){
//   playSample('Grand Piano', 'D2')
// }



// var note1 = document.querySelector(".blob1");

// // Set up an event handler. Notice that we don't use "on" in front
// // of the event name when doing it this way.
// note1.addEventListener("mouseover", changeDef1);

// function changeDef1(event){
//   playSample('Grand Piano', 'A3')
// }

// var note2 = document.querySelector(".blob2");

// // Set up an event handler. Notice that we don't use "on" in front
// // of the event name when doing it this way.
// note2.addEventListener("mouseover", changeDef2);

// function changeDef2(event){
//   playSample('Grand Piano', 'F#3')
// }

// var note3 = document.querySelector(".blob3");

// // Set up an event handler. Notice that we don't use "on" in front
// // of the event name when doing it this way.
// note3.addEventListener("mouseover", changeDef3);

// function changeDef3(event){
//   playSample('Grand Piano', 'G2')
// }

// var note4 = document.querySelector(".blob4");

// // Set up an event handler. Notice that we don't use "on" in front
// // of the event name when doing it this way.
// note4.addEventListener("mouseover", changeDef4);

// function changeDef4(event){
//   playSample('Grand Piano', 'E4')
// }

// var note5 = document.querySelector(".blob5");

// // Set up an event handler. Notice that we don't use "on" in front
// // of the event name when doing it this way.
// note5.addEventListener("mouseover", changeDef5);

// function changeDef5(event){
//   playSample('Grand Piano', 'B3')
// }


// var note6 = document.querySelector(".blob6");

// // Set up an event handler. Notice that we don't use "on" in front
// // of the event name when doing it this way.
// note6.addEventListener("mouseover", changeDef6);

// function changeDef6(event){
//   playSample('Grand Piano', 'C#4')
// }





document.addEventListener("keydown", (event) => {
  if (event.keyCode === 87) {
    playSample('Grand Piano', 'D2')
  }
  else if (event.keyCode === 69) {
    playSample('Grand Piano', 'E2')
  }
  else if (event.keyCode === 82) {
    playSample('Grand Piano', 'F#2')
  }
  else if (event.keyCode === 84) {
    playSample('Grand Piano', 'G2')
  }
  else if (event.keyCode === 89) {
    playSample('Grand Piano', 'A2')
  }
  else if (event.keyCode === 85) {
    playSample('Grand Piano', 'B2')
  }
  else if (event.keyCode === 73) {
    playSample('Grand Piano', 'C#2')
  }
  else if (event.keyCode === 83) {
    playSample('Grand Piano', 'D3')
  }
  else if (event.keyCode === 68) {
    playSample('Grand Piano', 'E3')
  }
  else if (event.keyCode === 70) {
    playSample('Grand Piano', 'F#3')
  }
  else if (event.keyCode === 71) {
    playSample('Grand Piano', 'G3')
  }
  else if (event.keyCode === 72) {
    playSample('Grand Piano', 'A3')
  }
  else if (event.keyCode === 74) {
    playSample('Grand Piano', 'B3')
  }
  else if (event.keyCode === 75) {
    playSample('Grand Piano', 'C#3')
  }
});