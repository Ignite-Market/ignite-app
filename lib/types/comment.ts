/**
 * Comment entity types.
 */
export enum CommentEntityTypes {
  PREDICTION_SET = 1,
  PROPOSAL = 2,
}

/**
 * Comment interface.
 */
export interface CommentInterface extends GeneralInterface {
  user_id: number;
  entity_id: number;
  entityType: number;
  parent_comment_id: number;
  content: string;
  username: string;
  walletAddress: string;
  reply_user_id: number;
  taggedUserUsername: string;
  replies: CommentInterface[];
}
