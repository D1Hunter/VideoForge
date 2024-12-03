import { useEffect, useState } from "react";

export const useWasm = (wasmPath: string) => {
  const [wasmInstance, setWasmInstance] = useState<WebAssembly.Instance | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        var memory = new WebAssembly.Memory({
          initial: 1,
          maximum: 2
        });
        var exports;
        WebAssembly.instantiateStreaming(
          fetch("memory.wasm"), {
          js: {
            mem: memory
          },
          env: {
            emscripten_resize_heap: function (delta) {
              memory.grow(delta)
            }
          }
        }
        ).then(results => {
          exports = results.instance.exports;
          memory = results.instance.exports.memory;
          console.log("Memory size (bytes):", memory.buffer.byteLength);
        });
      } catch (error) {
        console.error('Error loading WASM:', error);
      }
    };

    loadWasm();
  }, [wasmPath]);

  return wasmInstance;
};