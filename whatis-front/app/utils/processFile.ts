import React from 'react';

export type ProcessFileArgs = {
  setError: (value: React.SetStateAction<string | null>) => void;
  setSelectedFile: (value: React.SetStateAction<File | null>) => void;
  setResult: (value: React.SetStateAction<string | null>) => void;
  file?: File;
};

export const processFile = ({ file, setError, setSelectedFile, setResult }: ProcessFileArgs) => {
  if (!file?.type.startsWith('image/')) {
    setError('이미지 파일만 업로드할 수 있습니다.');
    setSelectedFile(null);
    return;
  }
  setError(null);
  setSelectedFile(file);
  setResult(null); // 새 파일 선택 시 결과 초기화
};
