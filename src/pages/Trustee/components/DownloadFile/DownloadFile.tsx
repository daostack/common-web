import React, { FC } from "react";
import DownloadIcon from "@/shared/icons/download_2.icon";
import { saveByURL } from "@/shared/utils";
import styles from "./DownloadFile.module.scss";

interface DownloadFileProps {
  downloadURL: string;
  fileName: string;
}

const DownloadFile: FC<DownloadFileProps> = ({ downloadURL, fileName }) => {
  const downloadFile = () => {
    saveByURL(downloadURL, fileName);
  };

  return (
    <div className={styles.downloadFile} onClick={downloadFile}>
      <button className={styles.downloadFileLink}>{fileName}</button>
      <DownloadIcon />
    </div>
  );
};

export default DownloadFile;
