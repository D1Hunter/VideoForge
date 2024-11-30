import { Add } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useWasm } from "../../wasm/useWasm";

const ImageUploadPage: React.FC = () => {
    const [imageFile, setImageFile] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    //const wasmInstance = useWasm('invert.wasm');

    var memory = new WebAssembly.Memory({
        initial: 256,
        maximum: 512,
    });
    
    var exports: WebAssembly.Exports;
    
    WebAssembly.instantiateStreaming(fetch("invert.wasm"), {
        js: {
            mem: memory,
        },
        env: {
            emscripten_resize_heap: memory.grow
        }
    }).then(results => {
        exports = results.instance.exports;
    
        // Перевірка, чи memory експортовано
        if (exports.memory instanceof WebAssembly.Memory) {
            memory = exports.memory;
            console.log("Memory size (bytes):", memory.buffer.byteLength);
        } else {
            console.error("Exported memory is not an instance of WebAssembly.Memory");
        }
    }).catch(err => {
        console.error("Error instantiating WebAssembly module:", err);
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const imageURL = URL.createObjectURL(file);
            setImageFile(imageURL);

            const img = new Image();
            img.src = imageURL;
            img.onload = () => {
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                    }
                }
            };
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const invert = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
    
            if (ctx) {
                const startJS = performance.now();
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
    
                if (memory && exports) {
                    const size = Math.ceil(data.length / 65536);
                    const ptr = (exports.wasmmalloc as Function)(size);
                    
                    const wasmMemoryArray = new Uint8Array(memory.buffer, ptr, data.length);
                    wasmMemoryArray.set(data);
                    
                    (exports.invert_colors as Function)(ptr, data.length);
                    
                    data.set(wasmMemoryArray);
    
                    ctx.putImageData(imageData, 0, 0);
    
                    const endJS = performance.now();
                    (exports.wasmfree as Function)(ptr);
                    console.log(`JavaScript Execution Time: ${endJS - startJS} ms`);
                } else {
                    console.error("WebAssembly instance or memory is not properly initialized.");
                }
            }
        }
    };

    return (
        <Container sx={{ mt: 4, textAlign: "center" }}>
            {!imageFile ? (
                <>
                    <IconButton
                        color="default"
                        size="large"
                        component="label"
                        sx={{ backgroundColor: "blue" }}
                    >
                        <Add fontSize="large" />
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileUpload}
                        />
                    </IconButton>
                    <Typography>Click to upload an image</Typography>
                </>
            ) : (
                <Box sx={{ mt: 4 }}>
                    <canvas
                        ref={canvasRef}
                        style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}
                    />
                    <Button
                        onClick={invert}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Invert Colors
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default ImageUploadPage;
