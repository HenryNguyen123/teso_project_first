import path from 'path';
import * as fs from 'fs';

export const deleteFile = (filePath: string) => {
  try {
    if (filePath) {
      const oldPath = path.join(process.cwd(), 'public', filePath);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
  } catch (error) {
    console.log('delete file error:', error);
  }
};
