'use client';

import React from 'react';
import Image from 'next/image';
import Upload from '@/icons/Upload';
import Alert from '@/icons/Alert';
import SubmitBtn from '@/components/SubmitBtn';
import { useFileInputForm } from '@/app/hooks/useFileInputForm';

const FileInputForm: React.FC = () => {
  const {
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
  } = useFileInputForm();

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
