import AES from 'aes-js';
import AES_Module from '../wasm/aes_wrapper';

const SECRET_KEY = '75f2455f9c30df03';

function addPadding(data: Uint8Array, blockSize: number): Uint8Array {
    const padding = blockSize - (data.length % blockSize);
    const paddedData = new Uint8Array(data.length + padding);
    paddedData.set(data);
    paddedData.fill(padding, data.length);
    return paddedData;
}

function removePadding(data: Uint8Array): Uint8Array {
    const padding = data[data.length - 1];
    if (padding > 0 && padding <= 16) {
        return data.slice(0, -padding);
    }
    return data;
}

export const encryptFile = async (file: File) => {
    try {
        const module = await AES_Module();

        const fileData = await file.arrayBuffer();
        const data = new Uint8Array(fileData);
    
        const key = new TextEncoder().encode(SECRET_KEY);
    
        const iv = crypto.getRandomValues(new Uint8Array(16));
    
        const blockSize = 16;
        const paddedData = addPadding(data, blockSize);
    
        const totalSize = paddedData.length + key.length + iv.length + 4;
        const memoryPointer = module._malloc(totalSize);
    
        const dataPointer = memoryPointer;
        const keyPointer = dataPointer + paddedData.length;
        const ivPointer = keyPointer + key.length;
        const lengthPointer = ivPointer + iv.length;
    
        module.HEAPU8.set(paddedData, dataPointer);
        module.HEAPU8.set(key, keyPointer);
        module.HEAPU8.set(iv, ivPointer);
        module.HEAPU32[lengthPointer / 4] = paddedData.length;
    
        module._encryptAES(dataPointer, lengthPointer, keyPointer, ivPointer);
    
        const encryptedLength = module.HEAPU32[lengthPointer / 4];
        const encryptedData = new Uint8Array(module.HEAPU8.subarray(dataPointer, dataPointer + encryptedLength));
    
        module._free(memoryPointer);
    
        return { encryptedData, iv };
    } catch (error) {
        console.error('File encryption error:', error);
    }
};

export const decryptFile = async (encryptedData: Uint8Array, iv: Uint8Array) => {
    try {
        const module = await AES_Module();

        const key = new TextEncoder().encode(SECRET_KEY);
        
        const blockSize = 16;
        const paddedData = addPadding(encryptedData, blockSize);

        const dataPointer = module._malloc(paddedData.length);
        const keyPointer = module._malloc(key.length);
        const ivPointer = module._malloc(iv.length);
        const lengthPointer = module._malloc(4);

        module.HEAPU8.set(encryptedData, dataPointer);
        module.HEAPU8.set(key, keyPointer);
        module.HEAPU8.set(iv, ivPointer);

        module.HEAPU32[lengthPointer / 4] = encryptedData.length;

        module._decryptAES(dataPointer, lengthPointer, keyPointer, ivPointer);

        const decryptedLength = module.HEAPU32[lengthPointer / 4];
        const decryptedData = new Uint8Array(module.HEAPU8.subarray(dataPointer, dataPointer + decryptedLength));

        module._free(dataPointer);
        module._free(keyPointer);
        module._free(ivPointer);
        module._free(lengthPointer);

        const unpaddedData = removePadding(decryptedData);

        return unpaddedData;
    } catch (error) {
        console.error('File decryption error:', error);
    }
};

export const encryptFileJS = async (file: File) => {
    try {
        const fileData = await file.arrayBuffer();
        const data = new Uint8Array(fileData);

        const key = new TextEncoder().encode(SECRET_KEY);
        const iv = crypto.getRandomValues(new Uint8Array(16));

        const blockSize = 16;
        const paddedData = addPadding(data, blockSize);

        const aesCbc = new AES.ModeOfOperation.cbc(key, iv);
        const encryptedData = aesCbc.encrypt(paddedData);

        return { encryptedData: new Uint8Array(encryptedData), iv };
    } catch (error) {
        console.error('File encryption error:', error);
    }
};

export const decryptFileJS = async (encryptedData: Uint8Array, iv: Uint8Array) => {
    try {
        const key = new TextEncoder().encode(SECRET_KEY);

        const blockSize = 16;
        const paddedData = addPadding(encryptedData, blockSize);

        const aesCbc = new AES.ModeOfOperation.cbc(key, iv);
        const decryptedData = aesCbc.decrypt(paddedData);

        const unpaddedData = removePadding(new Uint8Array(decryptedData));

        return unpaddedData;
    } catch (error) {
        console.error('File decryption error:', error);
    }
};