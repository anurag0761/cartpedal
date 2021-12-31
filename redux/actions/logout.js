import {
     RESET_STORE
  } from "./index.actions";
  export const resetStore = () => {
      console.log('se')
    return {
      type: RESET_STORE
    }
  }