import React from "react";

interface VideoPlayerProps {
  videoSrc: string;
  posterSrc?: string;
  title: string;
}

const VideoPlayer = ({ videoSrc, posterSrc, title }: VideoPlayerProps) => {
  return (
    <div className="relative rounded-lg overflow-hidden w-full h-full min-h-[320px]">
      <video
        className="w-full h-full object-cover"
        controls
        autoPlay
        poster={posterSrc}
        title={title}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
