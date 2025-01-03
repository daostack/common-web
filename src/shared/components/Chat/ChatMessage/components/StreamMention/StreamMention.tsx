import React, { FC, useMemo } from "react";
import classNames from "classnames";
import styles from "../../ChatMessage.module.scss";
import { useQuery } from "@tanstack/react-query";
import { CommonFeedService } from "@/services";

interface StreamMentionProps {
  commonId: string;
  discussionId: string;
  title: string;
  mentionTextClassName?: string;
  onStreamMentionClick?: (feedItemId: string) => void;
}

const StreamMention: FC<StreamMentionProps> = (props) => {
  const {  discussionId, title, commonId, mentionTextClassName, onStreamMentionClick } =
    props;

  const { data } = useQuery({
    queryKey: ["stream-mention", discussionId],
    queryFn: () => CommonFeedService.getFeedItemByCommonAndDiscussionId({ commonId, discussionId }),
    enabled: !!discussionId,
    staleTime: Infinity
  })

  const feedItemId = useMemo(() => data?.id, [data?.id]);

  const handleStreamNameClick = () => {
    if (onStreamMentionClick && feedItemId) {
      onStreamMentionClick(feedItemId);
    }
  };

  return (
    <>
      <span
        className={classNames(styles.mentionText, mentionTextClassName)}
        onClick={feedItemId ? handleStreamNameClick : undefined}
      >
        @{title}
      </span>
    </>
  );
};

export default StreamMention;
