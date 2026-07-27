"use client";

// Real video testimonial. The section only renders when the file exists (the
// server page checks public/media/), and this hides itself if playback can't
// start for any other reason - no broken players on a premium page.

import { useState } from "react";

export default function TestimonialVideo({
  src,
  poster,
  caption,
}: {
  src: string;
  poster?: string;
  caption?: string;
}) {
  const [dead, setDead] = useState(false);
  if (dead) return null;
  return (
    <figure className="tvideo rv d1">
      <div className="shot video">
        <video
          controls
          preload="metadata"
          playsInline
          src={src}
          poster={poster}
          onError={() => setDead(true)}
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
