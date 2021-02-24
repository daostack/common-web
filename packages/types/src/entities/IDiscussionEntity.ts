import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;
import { IBaseEntity } from './helpers/IBaseEntity';
import { IModerationEntity } from './IModerationEntity'

export interface IDiscussionEntity extends IBaseEntity {
  /**
   * Title of the discussion
   */
  title: string;

  /**
   * Message content
   */
  message: string;

  /**
   * The ID of the user who created the discussion
   */
  ownerId: string;

  /**
   * The ID of the common the discussion was created in
   */
  commonId: string;

  /**
   * Time of creation
   */
  createTime: Timestamp;

  /**
   * When was the last message sent in this discussion
   */
  lastMessage: Timestamp;

  /**
   * File URLs the discussion owner added in discussion creation
   */
  files: string[];

  /**
   * Image URLs the discussion owner added in discussion creation
   */
  images: string[];

  /**
   * Users who follow this discussion
   */
  followers: string[];

  moderation?: IModerationEntity

}