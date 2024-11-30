import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from "fs";
import { v4 } from 'uuid';

@Injectable()
export class FileUploadService {
    
    async uploadFile(file: Express.Multer.File, dirPath: string){
        path.resolve();
        const filePath = this.generateFileName(file, dirPath);
        if(!fs.existsSync(dirPath)){
            await fs.promises.mkdir(dirPath, {recursive: true});
        }
        await fs.promises.writeFile(filePath, file.buffer);
        return filePath;
    }

    async uploadFiles(files: Express.Multer.File[], dirPath): Promise<string[]>{
        path.resolve();
        const filesPath = [];
        files.forEach(file=>filesPath.push(this.generateFileName(file, dirPath)));
        if(!fs.existsSync(dirPath)){
            await fs.promises.mkdir(dirPath, {recursive: true});
        }
        filesPath.forEach(async (filePath, index) => await fs.promises.writeFile(filePath, files[index].buffer));
        return filesPath;
    }

    generateFileName(file: Express.Multer.File, dirPath: string){
        const extension = file.originalname.split('.').pop();
        let filePath ="";
        do{
            const fileName = v4();
            filePath = path.resolve(dirPath, fileName) + `.${extension}`;
        } while(fs.existsSync(filePath));
        return filePath;
    }

    async deleteFile(filePath:string){
        if(!fs.existsSync(filePath)){
            return null;
        }
        await fs.promises.unlink(filePath);
        return filePath;
    }

    async deleteFiles(filesPath: string[]){
        for(const filePath of filesPath){
            if(!fs.existsSync(filePath)){
                return false;
            }
            await fs.promises.unlink(filePath);
        }
        return true;
    }

    async getFile(filePath:string){
        if(!fs.existsSync(filePath)){
            return null;
        }
        return fs.promises.readFile(filePath);
    }
}
