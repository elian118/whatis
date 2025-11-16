import React, { useState } from 'react';
import { apiHandler } from '@/app/api/common';
import { API_BASE_URL } from '@/consts/api_base_url';

export const useUrlInputForm = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    if (!imageUrl.trim()) {
      setError('이미지 URL을 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const url = `${API_BASE_URL}/classify/url`;
      const res = await apiHandler({ url, body: { url: imageUrl } });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    imageUrl,
    setImageUrl,
    result,
    loading,
    error,
    handleSubmit,
  };
};
