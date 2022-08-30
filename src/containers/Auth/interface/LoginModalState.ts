export enum LoginModalType {
  Default,
  RequestToJoin,
}

export interface LoginModalState {
  isShowing: boolean;
  type?: LoginModalType;
  title?: string;
  canCloseModal?: boolean;
  shouldShowUserDetailsAfterSignUp?: boolean;
}
