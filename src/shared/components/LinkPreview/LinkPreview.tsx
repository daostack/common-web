import React, { useEffect, useState } from "react";
import styles from "./LinkPreview.module.scss";

interface LinkPreviewProps {
  url: string;
}

interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [linkPreview, setLinkPreview] = useState<LinkPreviewData>();

  const fetchLinkPreview = async (url: string) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const title = doc.querySelector("title")?.textContent || "";
      const description =
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "";
      const image =
        doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content") || "";

      setLinkPreview({ title, description, image, url });
    } catch (error) {
      console.error("Error fetching link preview:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchLinkPreview(url);
  }, [url]);

  return (
    <div>
      {linkPreview && (
        <div>
          <a
            className={styles.infoContainer}
            href={linkPreview.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className={styles.image}
              src={linkPreview.image}
              alt={linkPreview.title}
            />
            <div className={styles.descriptionContainer}>
              <span className={styles.title}>{linkPreview.title}</span>
              <span className={styles.description}>
                {linkPreview.description}
              </span>
              <span className={styles.url}>{linkPreview.url}</span>
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default LinkPreview;
