import { apiClient, ApiSuccessResponse } from './client';
import type { UploadedFile } from './types';

// Storage API
export const storageApi = {
  // Upload single file
  upload: async (file: File): Promise<ApiSuccessResponse<UploadedFile>> => {
    return apiClient.uploadFile<ApiSuccessResponse<UploadedFile>>('/storage/upload', file);
  },

  // Upload multiple files
  uploadMultiple: async (files: File[]): Promise<ApiSuccessResponse<UploadedFile[]>> => {
    return apiClient.uploadFiles<ApiSuccessResponse<UploadedFile[]>>('/storage/upload/multiple', files);
  },

  // Delete file
  delete: async (fileId: string): Promise<ApiSuccessResponse<void>> => {
    return apiClient.delete<ApiSuccessResponse<void>>(`/storage/${fileId}`);
  },

  // Get file
  getFile: async (fileId: string): Promise<ApiSuccessResponse<UploadedFile>> => {
    return apiClient.get<ApiSuccessResponse<UploadedFile>>(`/storage/${fileId}`);
  },
};
