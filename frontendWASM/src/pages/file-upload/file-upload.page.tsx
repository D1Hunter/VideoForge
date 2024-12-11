import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Input } from '@mui/material';
import AES_Module from '../../wasm/aes_wrapper';
import aesjs from 'aes-js';

const FileUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [encryptedFile, setEncryptedFile] = useState<Uint8Array | null>(null);

  useEffect(() => {
    AES_Module().then((instance) => {
      console.log('WASM модуль ініціалізовано', instance);
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Симуляція завантаження
    setTimeout(() => {
      console.log('Файл завантажено:', selectedFile.name);
      setIsUploading(false);
      setSelectedFile(null);
    }, 2000);
  };

  const SECRET_KEY = 'my-secret-key-1234'

  const encryptFile = async (file:File) => {
      try {
        const module = await AES_Module();
        const fileData = await file.arrayBuffer();
        const data = new Uint8Array(fileData);

        const key = new TextEncoder().encode(SECRET_KEY);
        const encryptedPointer = module._wasm_malloc(data.length);
        const keyPointer = module._wasm_malloc(key.length);

        module.HEAPU8.set(data, encryptedPointer);
        module.HEAPU8.set(key, keyPointer);

        module._encryptAES(encryptedPointer, keyPointer);

        const encryptedData = new Uint8Array(module.HEAPU8.subarray(encryptedPointer, encryptedPointer + data.length));

        module._wasm_free(encryptedPointer);
        module._wasm_free(keyPointer);

        return encryptedData;
      } catch (error) {
        console.error('Помилка шифрування файлу:', error);
      }
  };
  
  const addPadding = (data: Uint8Array): Uint8Array => {
    const padding = 16 - (data.length % 16);
    const paddedData = new Uint8Array(data.length + padding);
    paddedData.set(data);
    paddedData.fill(padding, data.length); // Заповнюємо padding значенням
    return paddedData;
  };

  const encryptFileJS = async () => {
    if (selectedFile) {
      try {
        const startJS = performance.now();
  
        const fileData = await selectedFile.arrayBuffer();
        const data = new Uint8Array(fileData);
  
        const key = aesjs.utils.utf8.toBytes('my-secret-key-12');
  
        const aesEcb = new aesjs.ModeOfOperation.ecb(key);
        const paddedData = addPadding(data);

        const endJS = performance.now();
        console.log(`JavaScript Execution Time: ${endJS - startJS} ms`);
  
        const encryptedData = aesEcb.encrypt(paddedData);
  
        setEncryptedFile(encryptedData);
      } catch (error) {
        console.error('Помилка шифрування файлу:', error);
      }
    }
  };

  const downloadEncryptedFile = () => {
    if (encryptedFile && selectedFile) {
      const blob = new Blob([encryptedFile], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encrypted_${selectedFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={2}
    >
      <Typography variant="h4" gutterBottom>
        Завантаження файлу
      </Typography>

      <label htmlFor="file-upload">
        <Input id="file-upload" type="file" onChange={handleFileChange} />
        <Button variant="contained" component="span">
          Обрати файл
        </Button>
      </label>

      {selectedFile && (
        <Typography variant="body1" marginTop={2}>
          Обраний файл: {selectedFile.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        sx={{ marginTop: 2 }}
      >
        {isUploading ? <CircularProgress size={24} /> : 'Завантажити'}
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={encryptFileJS}
        disabled={!selectedFile}
        sx={{ marginTop: 2 }}
      >
        Зашифрувати
      </Button>

      {encryptedFile && (
        <Button
          variant="contained"
          color="success"
          onClick={downloadEncryptedFile}
          sx={{ marginTop: 2 }}
        >
          Завантажити зашифрований файл
        </Button>
      )}
    </Box>
  );
};

export default FileUploadPage;