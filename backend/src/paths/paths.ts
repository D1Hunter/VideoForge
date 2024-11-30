import * as path from 'path';
import 'dotenv/config';

export const STATIC_FOLDER_PATH = path.resolve(__dirname, process.env.STATIC_FOLDER_PATH) || 'not defined';