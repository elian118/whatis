import React from 'react';
import SubmitBtn from '@/components/SubmitBtn';
import Image from 'next/image';
import Alert from '@/icons/Alert';
import { useUrlInputForm } from '@/app/hooks/useUrlInputForm';

const UrlInputForm = () => {
  const { imageUrl, setImageUrl, loading, error, result, handleSubmit } = useUrlInputForm();

  return (
    <div className="w-full">
      {/* 1. 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-lg font-medium dark:text-gray-300">이미지 URL</span>
          </div>
          <input
            type="url"
            placeholder="이미지 주소(URL)를 입력하세요"
            className="input input-bordered w-full text-base bg-white dark:bg-zinc-700 dark:text-white transition-colors"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        {/* 2. 제출 버튼 */}
        <button
          type="submit"
          className="btn btn-primary mt-4 w-full sm:w-auto self-end transition-all duration-300"
          disabled={loading}
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
        {imageUrl && !loading && !error && (
          <div className="mt-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3 dark:text-gray-300">입력된 이미지</h3>
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg border-2 border-base-300 dark:border-zinc-600">
              <Image
                unoptimized
                width={0}
                height={0}
                src={imageUrl}
                alt="입력 이미지 미리보기"
                className="w-full h-auto object-cover transition-opacity duration-500 opacity-100"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/333333?text=Image+Load+Error';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlInputForm;
