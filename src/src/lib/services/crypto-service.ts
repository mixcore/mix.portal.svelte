import { NgAppSettings } from '$lib/config/app-settings';
import CryptoJS from 'crypto-js';
import { get } from 'svelte/store';
import { globalSettings } from './api-service';

// Size: 128 / 192 / 256
const size = 256;

export const CryptoService = {
  encryptAES(message: string | object, iCompleteEncodedKey: string | null = null): string {
    let key, iv;
    
    // Use provided key or get from global settings
    iCompleteEncodedKey = iCompleteEncodedKey || get(globalSettings)?.apiEncryptKey || NgAppSettings.encryptKey;
    
    const keys = this.parseKeys(iCompleteEncodedKey);
    key = keys.key;
    iv = keys.iv;
    
    return this.encryptMessage(message, key, iv);
  },

  decryptAES(ciphertext: string, iCompleteEncodedKey: string | null = null): string {
    let key, iv;
    
    // Use provided key or get from global settings
    iCompleteEncodedKey = iCompleteEncodedKey || get(globalSettings)?.apiEncryptKey || NgAppSettings.encryptKey;
    
    const keys = this.parseKeys(iCompleteEncodedKey);
    key = keys.key;
    iv = keys.iv;
    
    return this.decryptMessage(ciphertext, key, iv);
  },

  decryptMessage(ciphertext: string, key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray): string {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    });
    
    const options = {
      iv: iv,
      keySize: size / 8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
    
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, options);
    return decrypted.toString(CryptoJS.enc.Utf8);
  },

  encryptMessage(message: string | object, key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray): string {
    const options = {
      iv: iv,
      keySize: size / 8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
    
    // Convert object to string if necessary
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    
    const encrypted = CryptoJS.AES.encrypt(message, key, options);
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  },

//   parseKeys(iCompleteEncodedKey: string): { iv: CryptoJS.lib.WordArray; key: CryptoJS.lib.WordArray } {
//     const keyStrings = CryptoJS.enc.Utf8.stringify(
//       CryptoJS.enc.Base64.parse(iCompleteEncodedKey)
//     ).split(',');
    
//     return {
//       iv: CryptoJS.enc.Base64.parse(keyStrings[0]),
//       key: CryptoJS.enc.Base64.parse(keyStrings[1]),
//     };
//   }

// var _parseKeys = function (iCompleteEncodedKey) {
//     var keyStrings = CryptoJS.enc.Utf8.stringify(
//       CryptoJS.enc.Base64.parse(iCompleteEncodedKey)
//     ).split(",");
//     return {
//       iv: CryptoJS.enc.Base64.parse(keyStrings[0]),
//       key: CryptoJS.enc.Base64.parse(keyStrings[1]),
//     };
//   };

parseKeys(iCompleteEncodedKey: string): { iv: CryptoJS.lib.WordArray; key: CryptoJS.lib.WordArray } {
    const decodedKey = CryptoJS.enc.Base64.parse(iCompleteEncodedKey);
    const keyString = CryptoJS.enc.Utf8.stringify(decodedKey);
    const keyStrings = keyString.split(',');
  
    if (keyStrings.length !== 2) {
      throw new Error('Invalid key format');
    }
  
    return {
      iv: CryptoJS.enc.Base64.parse(keyStrings[0]),
      key: CryptoJS.enc.Base64.parse(keyStrings[1]),
    };
  }
}