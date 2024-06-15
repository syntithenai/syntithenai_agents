import { useEffect, useState } from 'react';



const MISSING_BROWSER_ERROR =
  'useIsOnline only works in a browser environment.';

const missingWindow = typeof window === 'undefined';

const missingNavigator = typeof navigator === 'undefined';

const useIsOnline = () => {
  //if (missingWindow || missingNavigator) {
    //return {
      //error: MISSING_BROWSER_ERROR,
      //isOnline: false,
      //isOffline: false,
    //};
  //}

  const [isOnline, setOnlineStatus] = useState(window.navigator.onLine);

  useEffect(() => {
    const toggleOnlineStatus = () => setOnlineStatus(window.navigator.onLine);

    window.addEventListener('online', toggleOnlineStatus);
    window.addEventListener('offline', toggleOnlineStatus);

    return () => {
      window.removeEventListener('online', toggleOnlineStatus);
      window.removeEventListener('offline', toggleOnlineStatus);
    };
  }, [isOnline]);

  return {
    error: null,
    isOffline: !isOnline,
    isOnline,
  };
};

export default useIsOnline 
