export enum InboxActionType {
  RESET_INBOX = "@INBOX/RESET_INBOX",

  GET_INBOX_ITEMS = "@INBOX/GET_INBOX_ITEMS",
  GET_INBOX_ITEMS_SUCCESS = "@INBOX/GET_INBOX_ITEMS_SUCCESS",
  GET_INBOX_ITEMS_FAILURE = "@INBOX/GET_INBOX_ITEMS_FAILURE",
  GET_INBOX_ITEMS_CANCEL = "@INBOX/GET_INBOX_ITEMS_CANCEL",

  ADD_NEW_INBOX_ITEMS = "@INBOX/ADD_NEW_INBOX_ITEMS",

  UPDATE_INBOX_ITEM = "@INBOX/UPDATE_INBOX_ITEM",

  RESET_INBOX_ITEMS = "@INBOX/RESET_INBOX_ITEMS",

  SET_SHARED_INBOX_ITEM_ID = "@INBOX/SET_SHARED_INBOX_ITEM_ID",
  SET_SHARED_INBOX_ITEM = "@INBOX/SET_SHARED_INBOX_ITEM",
}
