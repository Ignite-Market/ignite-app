import type { SqlModelStatus } from '.';

/**
 * Banner interface for admin management.
 */
export interface BannerInterface {
  id: number;
  title: string;
  description: string;
  button: string;
  imageUrl: string;
  prediction_set_id: number;
  isActive: boolean;
  status: SqlModelStatus;
  createTime: string;
  updateTime: string;
}
