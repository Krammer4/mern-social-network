import React from "react";
import ContentLoader from "react-content-loader";

const UserCardSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={700}
    height={120}
    viewBox="0 0 700 120"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="93" y="17" rx="3" ry="3" width="143" height="14" />
    <rect x="94" y="45" rx="3" ry="3" width="85" height="9" />
    <circle cx="41" cy="43" r="40" />
  </ContentLoader>
);

export default UserCardSkeleton;
