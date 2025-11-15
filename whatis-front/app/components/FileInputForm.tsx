'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Upload from '@/icons/Upload';
import Alert from '@/icons/Alert';
import SubmitBtn from '@/components/SubmitBtn';
import { processFile, ProcessFileArgs } from '@/app/utils/processFile';
import { classifyImageFile } from '@/app/api/fileClassifier';

const FileInputForm: React.FC = () => {
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
      const res = await classifyImageFile(formData);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 1. 입력 및 드래그 앤 드롭 영역 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div
          className={`
            border-2 border-dashed rounded-lg p-10 text-center transition-all duration-300 cursor-pointer
            ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700'}
          `}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload-input')?.click()}
        >
          {selectedFile ? (
            <div className="text-lg font-semibold text-success dark:text-green-400">
              ✅ 파일 선택 완료: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              <Upload />
              {isDragging ? '파일을 여기에 놓으세요!' : '이미지 파일을 드래그하거나 클릭하여 선택하세요 (JPEG, PNG)'}
            </div>
          )}

          <input
            id="file-upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        {/* 2. 제출 버튼 */}
        <button
          type="submit"
          className="btn btn-primary mt-4 w-full sm:w-auto self-end transition-all duration-300"
          disabled={loading || !selectedFile}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              분류 중...
            </>
          ) : (
            '이미지 분류하기'
          )}
        </button>
      </form>

      {/* 3. 결과 및 메시지 표시 영역 */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-zinc-700">
        {error && (
          <div role="alert" className="alert alert-error truncate">
            <Alert />
            <span>오류: {error}</span>
          </div>
        )}

        <SubmitBtn result={result} />

        {/* 4. 입력된 이미지 미리보기 */}
        {previewUrl && !loading && !error && (
          <div className="mt-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3 dark:text-gray-300">선택된 이미지</h3>
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg border-2 border-base-300 dark:border-zinc-600">
              <Image
                unoptimized
                width={0}
                height={0}
                src={previewUrl}
                alt="선택된 파일 미리보기"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Object URL 메모리 정리 */}
            <p className="text-xs text-gray-500 mt-2">이미지 미리보기를 위해 브라우저에 임시 URL이 생성되었습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInputForm;
