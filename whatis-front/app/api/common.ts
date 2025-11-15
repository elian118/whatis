'use client';

import { ClassificationResult } from '@/app/interfaces/ClassificationResult';
import { ReqParams } from '@/app/interfaces/ReqParams';

export const apiHandler = async ({ url, body, formData }: ReqParams) => {
  try {
    const headers: HeadersInit = {
      // JSON 요청일 때만 Content-Type 설정
      ...(!formData && { 'Content-Type': 'application/json' }),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData || JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP 오류 발생: ${response.status}`);
    }

    const data: ClassificationResult = await response.json();
    return data.label;
  } catch (error) {
    console.error('URL 분류 API 호출 실패:', error);
    throw new Error(`분류 요청 실패: ${error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}`);
  }
};
