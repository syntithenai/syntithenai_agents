import { useEffect, useRef, useState } from 'react'


export default function useEmbeddingsWorker({workerUrl, onReady, onProgress}) {

  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);
  const [output, setOutput] = useState('');
  
  const worker = useRef(null);

    
  useEffect(() => {
    // console.log("usework INIT",worker.current)
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL(workerUrl, import.meta.url), {
        type: 'module'
      });
    }

    
    // Define a cleanup function for when the component is unmounted.
    // return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const run = (input) => {
    return new Promise(function(resolve,reject) {
        const onMessageReceived = (e) => {
            // console.log("usework MSG",e)
            switch (e.data.status) {
                case 'initiate':
                // Model file start load: add a new progress item to the list.
                setReady(false);
                setProgressItems(prev => [...prev, e.data]);
                break;

                case 'progress':
                // Model file progress: update one of the progress items.
                setProgressItems(
                    prev => prev.map(item => {
                    if (item.file === e.data.file) {
                        return { ...item, progress: e.data.progress }
                    }
                    return item;
                    })
                );
                if (onProgress) onProgress(e.data.progress)
                break;

                case 'done':
                // Model file loaded: remove the progress item from the list.
                setProgressItems(
                    prev => prev.filter(item => item.file !== e.data.file)
                );
                break;

                case 'ready':
                // Pipeline ready: the worker is ready to accept messages.
                setReady(true);
                if (onReady) onReady()
                break;


                case 'complete':
                // Generation complete: re-enable the "Translate" button
                setDisabled(false);
                worker.current.removeEventListener('message', onMessageReceived)
                // console.log("REWSOLVE")
                resolve(e.data.output)
                break;
            }
        };

        // Attach the callback function as an event listener.
        worker.current.addEventListener('message', onMessageReceived);  
        console.log("usework  RUN",input)

        setDisabled(true);
        worker.current.postMessage({
          text: input,
        });
        // console.log("usework  sent")      
    })

   
  }

  return {ready, disabled, progressItems, output, run}

}
  
//   (
//     <>
//       <h1>Transformers.js</h1>
//       <h2>ML-powered multilingual translation in React!</h2>

//       <div className='container'>
//         <div className='language-container'>
//           <LanguageSelector type={"Source"} defaultLanguage={"eng_Latn"} onChange={x => setSourceLanguage(x.target.value)} />
//           <LanguageSelector type={"Target"} defaultLanguage={"fra_Latn"} onChange={x => setTargetLanguage(x.target.value)} />
//         </div>

//         <div className='textbox-container'>
//           <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea>
//           <textarea value={output} rows={3} readOnly></textarea>
//         </div>
//       </div>

//       <button disabled={disabled} onClick={translate}>Translate</button>

//       <div className='progress-bars-container'>
//         {ready === false && (
//           <label>Loading models... (only run once)</label>
//         )}
//         {progressItems.map(data => (
//           <div key={data.file}>
//             <Progress text={data.file} percentage={data.progress} />
//           </div>
//         ))}
//       </div>
//     </>
//   )
// }

// export default App