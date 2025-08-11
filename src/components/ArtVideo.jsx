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

  const posterUrl = useMemo(() => {
    // Generate poster from video using video transformation to get a frame
    const posterVideo = cld.video(publicId);
    posterVideo
      .delivery(format('jpg')) // Convert video frame to JPG
      .delivery(quality('auto'))
      .addTransformation('so_0'); // Extract frame at 0 seconds
    return posterVideo.toURL();
  }, [cld, publicId]);

  return (
    <AdvancedVideo
      cldVid={video}
      controls={false}
      autoPlay
      loop
      muted
      playsInline
      poster={posterUrl}
      className="rounded-xl"
    />
  );
};

export default ArtVideo;
