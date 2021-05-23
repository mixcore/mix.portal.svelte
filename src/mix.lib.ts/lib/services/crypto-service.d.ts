export declare class CryptoService {
    size: number;
    encryptAES(message: string, iCompleteEncodedKey: string): string;
    decryptAES(ciphertext: string, iCompleteEncodedKey: string): string;
}
export declare class AESKey {
    iv?: any;
    key: string;
    /**
     *
     */
    constructor(encryptedKeys: string);
}
export declare const cryptoService: CryptoService;
