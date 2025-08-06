'use client';

import React, { useMemo } from 'react';
import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';

const ArtVideo = ({ publicId, cloudName }) => {
  const cld = useMemo(
    () => new Cloudinary({ cloud: { cloudName } }),
    [cloudName]
  );

  const video = useMemo(() => {
    const v = cld.video(publicId);
    v.delivery(format('auto')).delivery(quality('auto'));
    return v;
  }, [cld, publicId]);

  return (
    <AdvancedVideo
      cldVid={video}
      controls={false}
      autoPlay
      loop
      muted
      playsInline
      className="rounded-xl"
    />
  );
};

export default ArtVideo;
