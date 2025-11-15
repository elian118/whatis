import { API_BASE_URL } from '@/consts/api_base_url';
import { apiHandler } from '@/app/api/common';

export const classifyImageFile = async (formData: FormData): Promise<string> => {
  const url = `${API_BASE_URL}/classify/upload`;

  return await apiHandler({ url, formData });
};
