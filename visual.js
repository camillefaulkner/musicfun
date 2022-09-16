let song, analyzer;
let mic, fft;
let filter, filterFreq, filterRes;


function preload() {
    // song = loadSound('');
    song = new p5.AudioIn();
    // song.start();
    // fft = new p5.FFT();
    // fft.setInput(song);
}

function setup() {
    createCanvas(710, 200);
    reverb = new p5.Reverb();
    reverb.process(song, 4, 0.2); 
    reverb.amp(1);

    // song.loop();

    // create a new Amplitude analyzer
    analyzer = new p5.Amplitude();

    // Patch the input to an volume analyzer
    analyzer.setInput(song);

    // filter = new p5.LowPass();
    // soundFile.connect(filter);

    // fft = new p5.FFT();
}

function draw() {
    background(255);

    // Get the average (root mean square) amplitude
    let rms = analyzer.getLevel();
    fill(127);
    stroke(0);

    // Draw an ellipse with size based on volume
    ellipse(width / 2, height / 2, 10 + rms * 200, 10 + rms * 200);

    // // Map mouseX to a the cutoff frequency from the lowest
    // // frequency (10Hz) to the highest (22050Hz) that humans can hear
    // filterFreq = map(mouseX, 0, width, 10, 22050);

    // // Map mouseY to resonance (volume boost) at the cutoff frequency
    // filterRes = map(mouseY, 0, height, 15, 5);

    // // set filter parameters
    // filter.set(filterFreq, filterRes);

    // // Draw every value in the FFT spectrum analysis where
    // // x = lowest (10Hz) to highest (22050Hz) frequencies,
    // // h = energy (amplitude / volume) at that frequency
    // let spectrum = fft.analyze();
    // noStroke();
    // for (let i = 0; i < spectrum.length; i++) {
    //     let x = map(i, 0, spectrum.length, 0, width);
    //     let h = -height + map(spectrum[i], 0, 255, height, 0);
    //     rect(x, height, width / spectrum.length, h);
    // }

}