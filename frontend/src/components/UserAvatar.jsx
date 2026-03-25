import { useState, useEffect } from "react";

const UserAvatar = ({ user, size = "md", showInfo = false }) => {
    const [imageUrl, setImageUrl] = useState(null);

    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-14 h-14 text-lg",
    };

    useEffect(() => {
        if (user?.profileImage) {
            // cache buster
            setImageUrl(`${user.profileImage}?t=${Date.now()}`);
        }
    }, [user?.profileImage]);

    const initial = (
        user?.username?.charAt(0) ||
        user?.name?.charAt(0) ||
        "U"
    ).toUpperCase();

    return (
        <div className="flex items-center gap-3">
            <div
                className={`${sizeClasses[size]} rounded-full 
                bg-linear-to-br from-green-500 to-emerald-600 
                flex items-center justify-center 
                text-white font-semibold 
                overflow-hidden`}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    initial
                )}
            </div>

            {showInfo && user && (
                <div className="flex flex-col leading-tight">
                    <span className="text-white text-sm font-medium">
                        {user?.name || user?.username}
                    </span>
                    {user?.email && (
                        <span className="text-gray-400 text-xs">
                            {user.email}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserAvatar;