import CryptoJS from 'crypto-js';

// In a real application, the secret would be derived from a DH handshake per conversation
const MASTER_SECRET = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'nexa-chat-v1-super-secret-key';

/**
 * Encrypts a message using AES
 * @param text The plain text to encrypt
 * @param secret Optional specific secret for the conversation
 * @returns The encrypted ciphertext
 */
export const encryptMessage = (text: string, secret: string = MASTER_SECRET): string => {
  try {
    return CryptoJS.AES.encrypt(text, secret).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return text;
  }
};

/**
 * Decrypts a message using AES
 * @param ciphertext The encrypted text to decrypt
 * @param secret Optional specific secret for the conversation
 * @returns The decrypted plain text
 */
export const decryptMessage = (ciphertext: string, secret: string = MASTER_SECRET): string => {
  try {
    // If it doesn't look like AES ciphertext, return as is
    if (!ciphertext.includes('U2FsdGVkX1')) {
      // Common prefix for CryptoJS AES
      return ciphertext;
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || ciphertext;
  } catch (error) {
    // console.error('Decryption failed:', error);
    return ciphertext;
  }
};
