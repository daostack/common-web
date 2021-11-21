import React from "react";

interface GeneralInfoProps {
  setTitle: (title: string) => void;
  onFinish: () => void;
}

export default function GeneralInfo({ setTitle, onFinish }: GeneralInfoProps) {
  return (
    <div>GeneralInfo</div>
  )
}
