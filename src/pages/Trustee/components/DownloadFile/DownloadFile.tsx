import React, { FC } from "react";
import DownloadIcon from "@/shared/icons/download_2.icon";
import { saveByURL } from "@/shared/utils";
import styles from "./DownloadFile.module.scss";

interface DownloadFileProps {
  downloadURL: string;
  name: string;
  fileName: string;
}

const DownloadFile: FC<DownloadFileProps> = ({
  downloadURL,
  name,
  fileName,
}) => {
  const downloadFile = () => {
    saveByURL(downloadURL, fileName);
  };

  return (
    <div className={styles.downloadFile} onClick={downloadFile}>
      <button className={styles.downloadFileLink}>{name}</button>
      <DownloadIcon />
    </div>
  );
};

export default DownloadFile;
