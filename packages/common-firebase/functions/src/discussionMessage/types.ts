import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

export interface IDiscussionMessage {

  /**
   * ID of the parent discussion of this message, could be a Discussion ID, or a Proposal ID 
   */
	discussionId: string;

  /**
   * The ID of the creator of the message
   */
	ownerId: string;

  /**
   * The name of the creator of the message
   */
	ownerName: string;

  /**
   * The content of the message
   */
	text: string;

  /**
   * Time of creation
   */
	createTime: Timestamp;

  /**
   * Image URLs of the user's avatar
   */
	ownerAvatar: string;

}