import fs from 'react-native-fs';

export type Durations = {
  writeMs: number;
  deleteMs: number;
  totalMs: number;
};

export const rawPerformance = async (content: string): Promise<Durations> => {
  const tempDir = fs.TemporaryDirectoryPath;
  const filePath = `${tempDir}/perf.pdf`;

  const start = performance.now();
  await fs.writeFile(filePath, content, 'base64');
  const endWrite = performance.now();

  await fs.unlink(filePath);
  const end = performance.now();

  const durations = {
    writeMs: endWrite - start,
    deleteMs: end - endWrite,
    totalMs: end - start,
  };

  return durations;
};

export const cleanTempFile = async (filename: string): Promise<boolean> => {
  const tempDir = fs.TemporaryDirectoryPath;
  const filePath = `${tempDir}/${filename}`;

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Temporary file deleted:', filePath);
    return false;
  }
};

export const tempStoreFile = async (
  base64: string,
  filename: string,
): Promise<string | null> => {
  try {
    const tempDir = fs.TemporaryDirectoryPath;
    const filePath = `${tempDir}/${filename}`;

    // Writing data to a text file

    await fs.writeFile(filePath, base64, 'base64');
    console.log('File saved to temporary storage:', filePath);
    // ... Use the file
    return filePath;
  } catch (error) {
    console.error('Error while handling file:', error);
    return null;
  }
};
