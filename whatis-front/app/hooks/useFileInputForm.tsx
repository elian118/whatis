import React, { useCallback, useMemo, useState } from 'react';
import { processFile, ProcessFileArgs } from '@/app/utils/processFile';
import { API_BASE_URL } from '@/consts/api_base_url';
import { apiHandler } from '@/app/api/common';

export const useFileInputForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 선택된 파일의 미리보기 URL 생성
  const previewUrl = useMemo(() => {
    return selectedFile ? URL.createObjectURL(selectedFile) : null;
  }, [selectedFile]);

  const initProcessFile: ProcessFileArgs = {
    setError: setError,
    setSelectedFile: setSelectedFile,
    setResult: setResult,
  };

  // 1. 드래그 이벤트 핸들러
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 기본 동작(파일 열기) 방지
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile({
        ...initProcessFile,
        file: e.dataTransfer.files[0],
      });
    }
  }, []);

  // 2. 일반 파일 선택 핸들러
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile({
        ...initProcessFile,
        file: e.target.files[0],
      });
    }
  }, []);

  // 3. 폼 제출 (API 호출) 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    if (!selectedFile) {
      setError('분류할 이미지 파일을 선택하거나 드래그해주세요.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const url = `${API_BASE_URL}/classify/upload`;
      const res = await apiHandler({ url, formData });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedFile,
    isDragging,
    loading,
    error,
    result,
    previewUrl,
    handleSubmit,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileChange,
  };
};
