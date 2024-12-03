import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from "fs";
import { v4 } from 'uuid';

@Injectable()
export class FileUploadService {

    async uploadFile(file: Express.Multer.File, dirPath: string) {
        const filePath = await this.generateFileName(file, dirPath);
        await fs.promises.access(dirPath).catch(async () => {
            await fs.promises.mkdir(dirPath, { recursive: true });
        });
        await fs.promises.writeFile(filePath, file.buffer);
        return filePath;
    }

    async uploadFiles(files: Express.Multer.File[], dirPath): Promise<string[]> {
        const filesPath = [];
        files.forEach(file => filesPath.push(this.generateFileName(file, dirPath)));
        await fs.promises.access(dirPath).catch(async () => {
            await fs.promises.mkdir(dirPath, { recursive: true });
        });
        filesPath.forEach(async (filePath, index) => await fs.promises.writeFile(filePath, files[index].buffer));
        return filesPath;
    }

    generateFileName(file: Express.Multer.File, dirPath: string) {
        const extension = file.originalname.split('.').pop();
        let filePath: string;
        const fileName = v4();
        filePath = path.resolve(dirPath, fileName) + `.${extension}`;
        return filePath;
    }

    async deleteFile(filePath: string) {
        try {
            await fs.promises.access(filePath);
            await fs.promises.unlink(filePath);
            return filePath;
        } catch {
            return null;
        }
    }

    async deleteFiles(filesPath: string[]) {
        for (const filePath of filesPath) {
            try {
                await fs.promises.access(filePath);
                await fs.promises.unlink(filePath);
            } catch {
                return false;
            }
        }
        return true;
    }

    async getFile(filePath: string): Promise<Buffer | null> {
        try {
            await fs.promises.access(filePath);
            return await fs.promises.readFile(filePath);
        } catch {
            return null;
        }
    }

    async ensureOutputDir(outputDir: string): Promise<void> {
        await fs.promises.access(outputDir).catch(async () => {
            await fs.promises.mkdir(outputDir, { recursive: true });
        });
    }
}
