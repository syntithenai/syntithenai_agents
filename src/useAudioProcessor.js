import {useRef} from 'react'

// downsamplerScript is a url to the downsampling_worker.js file, it can be a relative link eg './downsampling_worker.js'
export default function useAudioProcessor({downsamplerScript}) {
    let downsampler = useRef();

    let isRecording = false;
 
    let start = function (engines, errorCallback) {
        if (!downsampler.current) {
            navigator.mediaDevices.getUserMedia({audio: true})
                .then(stream => {
                    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    let audioSource = audioContext.createMediaStreamSource(stream);
                    let node = audioContext.createScriptProcessor(4096, 1, 1);
                    node.onaudioprocess = function (e) {
                        if (!isRecording) {
                            return;
                        }
                        downsampler.current.postMessage({command: "process", inputFrame: e.inputBuffer.getChannelData(0)});
                    };
                    audioSource.connect(node);
                    node.connect(audioContext.destination);

                    downsampler.current = new Worker(downsamplerScript);
                    downsampler.current.postMessage({command: "init", inputSampleRate: audioSource.context.sampleRate});
                    downsampler.current.onmessage = function (e) {
                        engines.forEach(function (engine) {
                            engine.processFrame(e.data);
                        });
                    };
                })
                .catch(errorCallback);
        }

        isRecording = true;
    };

    let stop = function () {
        isRecording = false;
        if (downsampler.current) downsampler.current.postMessage({command: "reset"});
    };

    return {start: start, stop: stop};
}
