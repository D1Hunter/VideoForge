import { useEffect, useState } from "react";

export const useWasm = (wasmPath: string) => {
    const [wasmInstance, setWasmInstance] = useState<WebAssembly.Instance | null>(null);
  
    useEffect(() => {
      const loadWasm = async () => {
        try {
          const response = await fetch(wasmPath);
          const bytes = await response.arrayBuffer();
          const wasmModule = await WebAssembly.instantiate(bytes);
          console.log(wasmModule.instance);
          setWasmInstance(wasmModule.instance);
        } catch (error) {
          console.error('Error loading WASM:', error);
        }
      };
  
      loadWasm();
      console.log(wasmInstance);
    }, [wasmPath]);
  
    return wasmInstance;
  };