import { API_BASE_URL } from '@/consts/api_base_url';
import { apiHandler } from '@/app/api/common';

export const classifyImageUrl = async (imageUrl: string): Promise<string> => {
  const url = `${API_BASE_URL}/classify/url`;

  return await apiHandler({ url, body: { url: imageUrl } });
};
