import React from 'react'

const UserAvatar = ({ user, size = "md", showInfo = false }) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-14 h-14 text-lg",
    };
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
                shadow-[0_0_10px_rgba(34,197,94,0.4)] 
                overflow-hidden`}
            >
                {user?.profileImage ? (
                    <img
                        src={user.profileImage}
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


export default UserAvatar
