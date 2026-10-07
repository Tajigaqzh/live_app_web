import { useState, type RefObject } from "react";
import { useStreamPlayer } from "../hooks/useStreamPlayer";

export function Player({ videoRef }: { videoRef: RefObject<HTMLVideoElement> }) {
  const [muted, setMuted] = useState(true);
  useStreamPlayer(videoRef);
  return (
    <video
      ref={videoRef}
      className="video"
      muted={muted}
      controls
      playsInline
      onClick={() => setMuted((value) => !value)}
    />
  );
}
