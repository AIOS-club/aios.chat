function isMobile() {
  let flag = false;
  const { userAgent } = navigator;
  const mobileAgents = ['Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
  for (let i = 0; i < mobileAgents.length; i += 1) {
    if (userAgent.includes(mobileAgents[i])) {
      flag = true;
      break;
    }
  }
  return flag;
}

const flag = isMobile();

function useIsMobile () {
  return flag;
}

export default useIsMobile;
