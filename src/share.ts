import Share from 'react-native-share';
import {ShareOpenResult} from 'react-native-share/lib/typescript/src/types';
import {cleanTempFile, tempStoreFile} from './store';

const share = async (url: string): Promise<ShareOpenResult> => {
  try {
    return await Share.open({
      title: 'Share your PDF',
      url,
    });
  } catch (error) {
    return {
      success: false,
      // @ts-ignore
      message: error?.message ?? 'Failed to share document',
    };
  }
};

export const shareBase64Pdf = async (
  base64: string,
): Promise<ShareOpenResult> => {
  // NOTICE: the Share API actually takes base64 directly.
  return share(`data:application/pdf;base64,${base64}`);
};

let fileCount = 0;

export const sharePdfFile = async (
  base64Content: string,
): Promise<ShareOpenResult> => {
  const filename = `perf-${fileCount}.pdf`;
  fileCount++;

  const filepath = await tempStoreFile(base64Content, filename);
  if (!filepath) {
    return {
      success: false,
      message: 'Failed to save temp file',
    };
  }

  // Use the temp storage path
  const shareRes = await share(`file:///${filepath}`);
  const delRes = await cleanTempFile(filename);

  if (!delRes) {
    return {
      success: false,
      message: 'Failed to delete temp file',
    };
  }

  return shareRes;
};
