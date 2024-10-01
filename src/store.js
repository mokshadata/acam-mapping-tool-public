import { writable } from 'svelte/store'
import { setContext, getContext } from 'svelte';

export const selectedZipcode= writable('')
export const selectedService = writable('')
export const selectedPartner = writable('')


const OpenCardContext = {};

export function createOpenCardContext() {
  const { subscribe, set } = writable(null);

  function openCard(index) {
    set(index);
  }

  function closeCard() {
    set(null);
  }
  
  selectedZipcode.subscribe(() => {
    closeCard();
    selectedPartner.set(null); 

  });


  return {
    subscribe,
    openCard,
    closeCard,
  };
}

export function setOpenCardContext(context) {
  setContext(OpenCardContext, context);
}

export function getOpenCardContext() {
  return getContext(OpenCardContext);
}