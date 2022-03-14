import React from "react";
import { VoteOutcome } from "@/shared/models";
import "./index.scss";

interface IProps {
  votes: number;
  type: VoteOutcome;
}

export default function VoteBar({ votes, type }: IProps) {
  return (
    <div className={`vote-bar-wrapper ${type}`} style={{ height: `${votes}px` }} />
  )
}
