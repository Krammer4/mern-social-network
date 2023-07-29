import React from "react";
import ContentLoader from "react-content-loader";

export const PostSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      width={800}
      height={160}
      viewBox="0 0 800 160"
      backgroundColor="#e7e5f0"
      foregroundColor="#5c529a"
    >
      <rect x="48" y="8" rx="3" ry="3" width="100" height="6" />
      <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
      <rect x="0" y="91" rx="3" ry="3" width="810" height="6" />
      <circle cx="20" cy="20" r="20" />
      <rect x="-4" y="105" rx="3" ry="3" width="810" height="6" />
      <rect x="-3" y="120" rx="3" ry="3" width="810" height="6" />
      <rect x="1" y="69" rx="3" ry="3" width="88" height="8" />
      <rect x="701" y="8" rx="3" ry="3" width="88" height="10" />
    </ContentLoader>
  );
};
