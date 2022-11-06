import { crptTokenKey } from "../const";

const decodeJwt = (token: string): any => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const isTokenValid = (token: string): boolean => decodeJwt(token).exp > Math.floor(Date.now() / 1000);


const setKeyToStorage = (token: string): void => {
  clearKeyStorage();
  localStorage.setItem(crptTokenKey, token);
}

const getKeyFromStorage = (): string => {
  const storageKey = localStorage.getItem(crptTokenKey);
  return (storageKey && isTokenValid(storageKey)) ? storageKey : '';
}

const clearKeyStorage = (): void => {
  localStorage.removeItem(crptTokenKey);
}

export {decodeJwt, isTokenValid, getKeyFromStorage, setKeyToStorage, clearKeyStorage};
