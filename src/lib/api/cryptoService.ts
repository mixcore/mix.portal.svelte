// Crypto service for encrypting/decrypting data for the Mixcore API
import { browser } from '$app/environment';
import CryptoJS from 'crypto-js';

// Default encryption key if not set in environment
const DEFAULT_KEY = 'mixcore';
const KEY_SIZE = 256; // 256 bits

/**
 * Parse the encryption key format used by Mixcore API
 * @param completeEncodedKey The complete encoded key string
 * @returns Object with iv and key properties
 */
function parseKeys(completeEncodedKey: string) {
  const keyStrings = CryptoJS.enc.Utf8.stringify(
    CryptoJS.enc.Base64.parse(completeEncodedKey)
  ).split(',');
  
  return {
    iv: CryptoJS.enc.Base64.parse(keyStrings[0]),
    key: CryptoJS.enc.Base64.parse(keyStrings[1])
  };
}

/**
 * Get encryption key from environment or use default
 */
const getEncryptionKey = (key?: string): string => {
  if (key) return key;
  if (browser && import.meta.env.VITE_ENCRYPTION_KEY) {
    return import.meta.env.VITE_ENCRYPTION_KEY;
  }
  return DEFAULT_KEY;
};

/**
 * Encrypt a message using AES with the same configuration as the AngularJS app
 * @param message Data to encrypt
 * @param completeEncodedKey Optional encryption key
 * @returns Encrypted data as string
 */
export function encryptAES(message: string, completeEncodedKey?: string): string {
  if (!browser) return message;
  
  try {
    // Get the encryption key
    const encryptKey = getEncryptionKey(completeEncodedKey);
    
    // Parse the key format expected by the API
    const keys = parseKeys(encryptKey);
    
    // Create encryption options matching AngularJS implementation
    const options = {
      iv: keys.iv,
      keySize: KEY_SIZE / 8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    };
    
    // Perform AES encryption
    const encrypted = CryptoJS.AES.encrypt(message, keys.key, options);
    
    // Return the ciphertext in Base64 format
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  } catch (error) {
    console.error('Encryption error:', error);
    
    // Fallback to simple encryption if the proper key format isn't available
    // This should only be used for development or as a last resort
    const fallbackKey = CryptoJS.enc.Utf8.parse(DEFAULT_KEY);
    const iv = CryptoJS.lib.WordArray.random(16);
    const options = {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    };
    
    const encrypted = CryptoJS.AES.encrypt(message, fallbackKey, options);
    return encrypted.toString();
  }
}

/**
 * Decrypt AES encrypted data
 * @param ciphertext Encrypted data
 * @param completeEncodedKey Optional decryption key
 * @returns Decrypted data as string
 */
export function decryptAES(ciphertext: string, completeEncodedKey?: string): string {
  if (!browser) return ciphertext;
  
  try {
    // Get the encryption key
    const encryptKey = getEncryptionKey(completeEncodedKey);
    
    // Parse the key format expected by the API
    const keys = parseKeys(encryptKey);
    
    // Create decryption options matching AngularJS implementation
    const options = {
      iv: keys.iv,
      keySize: KEY_SIZE / 8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    };
    
    // Create cipher params for the encrypted data
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    });
    
    // Perform AES decryption
    const decrypted = CryptoJS.AES.decrypt(cipherParams, keys.key, options);
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return ciphertext;
  }
}

export const CryptoService = {
  encryptAES,
  decryptAES,
  parseKeys
}; 