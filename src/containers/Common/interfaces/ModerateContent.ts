
 export enum MODERATION_TYPES {
    proposals = 'proposals',
    discussion = 'discussion',
    discussionMessage = 'discussionMessage',
}

export enum ModerationActionType{
    hide="hide",
    report="report"
}

export interface ReportContentPayload{
    moderationData:{
        reasons:string;
        moderatorNote:string;
        itemId:string;
    },
    userId?:string;
    type: MODERATION_TYPES
}

export interface HideContentPayload{
    itemId: string;
    commonId: string;
    userId: string;
    type: MODERATION_TYPES;
}

export interface ModerateModalAction{
    type: MODERATION_TYPES;
    itemId: string;
    actionType:ModerationActionType;
}
