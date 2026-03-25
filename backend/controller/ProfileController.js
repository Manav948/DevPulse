import User from "../model/userModel.js"
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not Authenticated" });
        }

        const { username, profileImage } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (username) {
            user.username = username;
        }
        if (profileImage) {
            user.profileImage = profileImage;
        }
        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getMe = async (req, res) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({ message: "User not Authenticated" });
        }
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server Error"})
    }
}