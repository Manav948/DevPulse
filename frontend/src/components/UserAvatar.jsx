import { useState, useEffect, useRef } from "react";

/** Safe cache-bust for CDN URLs (handles existing ?query without breaking the URL). */
function withCacheBust(url, seed) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    u.searchParams.set("v", String(seed));
    return u.toString();
  } catch {
    const sep = trimmed.includes("?") ? "&" : "?";
    return `${trimmed}${sep}v=${seed}`;
  }
}

const UserAvatar = ({ user, size = "md", showInfo = false }) => {
  const [displaySrc, setDisplaySrc] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const loadAttempt = useRef(0);
  const profileKey = user?.profileImage?.trim() || "";

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-lg",
  };

  useEffect(() => {
    loadAttempt.current = 0;
    setShowImage(true);
    if (!profileKey) {
      setDisplaySrc(null);
      return;
    }
    setDisplaySrc(withCacheBust(profileKey, Date.now()));
  }, [profileKey]);

  const handleImgError = () => {
    if (loadAttempt.current < 1 && profileKey) {
      loadAttempt.current += 1;
      setDisplaySrc(withCacheBust(profileKey, Date.now()));
      return;
    }
    setShowImage(false);
    setDisplaySrc(null);
  };

  const initial = (
    user?.username?.charAt(0) ||
    user?.name?.charAt(0) ||
    "U"
  ).toUpperCase();

  const renderAvatar = showImage && displaySrc;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-green-500 to-emerald-600 font-semibold text-white`}
      >
        {renderAvatar ? (
          <img
            key={displaySrc}
            src={displaySrc}
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
            onError={handleImgError}
          />
        ) : (
          initial
        )}
      </div>

      {showInfo && user && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-white">
            {user?.name || user?.username}
          </span>
          {user?.email && (
            <span className="text-xs text-gray-400">{user.email}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
