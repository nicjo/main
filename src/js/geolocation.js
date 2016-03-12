import {
  default as canUseDOM,
}
from "can-use-dom";

export default (            // old modules.export
  canUseDOM && navigator.geolocation || {
    getCurrentPosition: (success, failure) => {
      failure(`Your browser doesn't support geolocation.`);
    },
  }
);