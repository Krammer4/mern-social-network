import React from "react";
import ContentLoader from "react-content-loader";

const MusicCardSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={744}
    height={188}
    viewBox="0 0 744 188"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="152" y="24" rx="3" ry="3" width="143" height="19" />
    <rect x="152" y="52" rx="3" ry="3" width="85" height="15" />
    <rect x="20" y="20" rx="10" ry="10" width="120" height="120" />
    <circle cx="167" cy="89" r="15" />
    <rect x="154" y="110" rx="0" ry="0" width="98" height="9" />
    <rect x="153" y="132" rx="0" ry="0" width="151" height="7" />
    <rect x="626" y="49" rx="0" ry="0" width="13" height="46" />
    <rect x="645" y="49" rx="0" ry="0" width="13" height="46" />
  </ContentLoader>
);

export default MusicCardSkeleton;
