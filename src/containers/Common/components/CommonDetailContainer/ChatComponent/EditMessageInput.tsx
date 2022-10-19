import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { Linkify, ElementDropdown, UserAvatar, Button } from "@/shared/components";
import { DiscussionMessage, User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { DynamicLinkType, Orientation, ChatType, ENTITY_TYPES } from "@/shared/constants";
import { useDispatch } from "react-redux";
import { updateDiscussionMessage } from "@/containers/Common/store/actions";

interface Props {
  discussionMessage: DiscussionMessage;
  onClose: () => void;
}

export default function EditMessageInput(
  {
    discussionMessage,
    onClose
  }: Props
) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(discussionMessage.text);

  const updateMessage = () => {
    dispatch(updateDiscussionMessage.request({
      payload: {
        discussionMessageId: discussionMessage.id,
        ownerId: discussionMessage.ownerId,
        text: message,
      },
      discussionId: discussionMessage.discussionId,
      callback(isSucceed) {
          // TODO: Add notify if something wrong
          onClose();
      },
    }));
  }

  return (
    <div style={{boxSizing: 'border-box', borderRadius: '0.875rem', border: '1px #979BBA solid', width: '85%', backgroundColor: '#fff', padding: '0.5rem 1rem'}}>
      <div className="message-name">
        {getUserName(discussionMessage.owner)}
      </div>
      <textarea
        style={{
          resize: 'none',
          width:'100%',
          borderWidth: 0,
          outline: 0,
        }}
        value={message}
        onChange={(event) => {
          console.log('---event.target.value',event.target.value)
          setMessage(event.target.value)
        }}
      />
      <div style={{ marginTop: 12, float: 'right'}}>
        <Button onClick={onClose} style={{border: '1px #979BBA solid', color: '#979BBA', fontSize: 14, borderRadius: 8, backgroundColor: '#EEEEEE', padding: '7.5px 13px', height: 'fit-content', marginRight: 8}}>Cancel</Button>
        <Button onClick={updateMessage} style={{border: '1px #5666F5 solid', color: '#fff', fontSize: 14, borderRadius: 8, backgroundColor: '#5666F5', padding: '7.5px 13px', height: 'fit-content', marginLeft: 8}} >Save</Button>
      </div>
    </div>
  );
}
