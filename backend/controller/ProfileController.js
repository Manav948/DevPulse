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
            return res.status(401).json({ message: "User not authenticted" })
        }
        if (username) {
            user.username = username;
        }
        if (profileImage) {
            user.profileImage = profileImage;
        }
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server Error" })
    }

}