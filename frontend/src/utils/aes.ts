import AES from 'aes-js';

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

export const decryptFile = async (encryptedData: Uint8Array, iv: Uint8Array) => {
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