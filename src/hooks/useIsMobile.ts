import { useState, useEffect } from 'react';

function useIsMobile () {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const { userAgent } = navigator;
    const mobileAgents = ['Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
    for (let i = 0; i < mobileAgents.length; i += 1) {
      if (userAgent.includes(mobileAgents[i])) {
        setIsMobile(true);
        break;
      }
    }
  }, []);

  return isMobile;
}

export default useIsMobile;
