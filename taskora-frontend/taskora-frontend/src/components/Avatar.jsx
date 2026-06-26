import React, { useState, useEffect } from 'react';

// Shows an avatar image, or initials fallback when no src is available or the image fails.
const Avatar = ({ src, name = '?', size = 40 }) => {
  const [errored, setErrored] = useState(false);

  // Reset the error flag whenever the source changes (e.g. after upload).
  useEffect(() => { setErrored(false); }, [src]);

  const initials = (name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={name}
        className="tk-avatar"
        style={{ width: size, height: size }}
        onError={() => setErrored(true)}
      />
    );
  }
  return (
    <span
      className="tk-avatar-fallback"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
};

export default Avatar;
