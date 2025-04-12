// Crypto service for encrypting/decrypting data for the Mixcore API
import { browser } from '$app/environment';
import CryptoJS from 'crypto-js';

// Default encryption key if not set in environment
const DEFAULT_KEY = 'mixcore';
const KEY_SIZE = 256; // 256 bits

// Basic default IV and key for fallback
const DEFAULT_IV = CryptoJS.enc.Base64.parse('YXZ2YXZ2YXZ2YXZ2');
const DEFAULT_KEY_PARSED = CryptoJS.enc.Base64.parse('bWl4Y29yZW1peGNvcmVtaXhjb3JlbWl4Y29yZQ==');

/**
 * Parse the encryption key format used by Mixcore API
 * @param completeEncodedKey The complete encoded key string
 * @returns Object with iv and key properties
 */
function parseKeys(completeEncodedKey: string) {
  try {
    // Debug key format
    console.log('[CryptoService] Parsing key:', completeEncodedKey);
    
    // First try to decode and split by comma as per AngularJS implementation
    const keyStrings = CryptoJS.enc.Utf8.stringify(
      CryptoJS.enc.Base64.parse(completeEncodedKey)
    ).split(',');
    
    // Verify we have both parts
    if (keyStrings.length < 2 || !keyStrings[0] || !keyStrings[1]) {
      console.warn('[CryptoService] Invalid key format, using fallback key format');
      return {
        iv: DEFAULT_IV,
        key: DEFAULT_KEY_PARSED
      };
    }
    
    return {
      iv: CryptoJS.enc.Base64.parse(keyStrings[0]),
      key: CryptoJS.enc.Base64.parse(keyStrings[1])
    };
  } catch (error) {
    console.error('[CryptoService] Error parsing keys:', error);
    // Fallback to default values
    return {
      iv: DEFAULT_IV,
      key: DEFAULT_KEY_PARSED
    };
  }
}

/**
 * Get encryption key from environment or use default
 */
const getEncryptionKey = (key?: string): string => {
  if (key) return key;
  if (browser && import.meta.env.VITE_ENCRYPTION_KEY) {
    return import.meta.env.VITE_ENCRYPTION_KEY;
  }
  
  // If no key is available, create a properly formatted key (iv,key in base64)
  // This is used for development only
  console.warn('[CryptoService] No encryption key provided, using default');
  
  const iv = CryptoJS.lib.WordArray.random(16);
  const keyData = CryptoJS.enc.Utf8.parse(DEFAULT_KEY);
  
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
  const keyBase64 = CryptoJS.enc.Base64.stringify(keyData);
  
  const formattedKey = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(`${ivBase64},${keyBase64}`)
  );
  
  return formattedKey;
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
    console.error('[CryptoService] Encryption error:', error);
    
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
    console.error('[CryptoService] Decryption error:', error);
    return ciphertext;
  }
}

/**
 * Debug function to help diagnose encryption issues
 */
export function debugEncryption(): void {
  try {
    console.log('[DEBUG] Starting encryption debug');
    
    // Get the encryption key
    let encryptKey;
    if (browser && import.meta.env.VITE_ENCRYPTION_KEY) {
      encryptKey = import.meta.env.VITE_ENCRYPTION_KEY;
      console.log('[DEBUG] Using env encryption key');
    } else {
      encryptKey = DEFAULT_KEY;
      console.log('[DEBUG] Using default encryption key');
    }
    
    // Test data
    const testData = {
      UserName: 'testuser',
      Password: 'testpassword',
      RememberMe: true
    };
    
    console.log('[DEBUG] Test data:', testData);
    const testJson = JSON.stringify(testData);
    
    // Create formatted key
    const iv = CryptoJS.lib.WordArray.random(16);
    const keyData = CryptoJS.enc.Utf8.parse(encryptKey);
    
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const keyBase64 = CryptoJS.enc.Base64.stringify(keyData);
    
    console.log('[DEBUG] IV Base64:', ivBase64);
    console.log('[DEBUG] Key Base64:', keyBase64);
    
    const formattedKey = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(`${ivBase64},${keyBase64}`)
    );
    
    console.log('[DEBUG] Formatted key:', formattedKey);
    
    // Try encrypting with the formatted key
    const encrypted = encryptAES(testJson, formattedKey);
    console.log('[DEBUG] Encrypted data:', encrypted);
    
    // Create payload for API
    const payload = { message: encrypted };
    console.log('[DEBUG] API payload:', payload);
    
    console.log('[DEBUG] Encryption debug complete');
  } catch (error) {
    console.error('[DEBUG] Encryption debug error:', error);
  }
}

export const CryptoService = {
  encryptAES,
  decryptAES,
  parseKeys,
  debugEncryption
}; 