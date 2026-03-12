import mongoose from "mongoose"
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        default: null,
        select: false
    },
    profileImage: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local"
    },
    providerId: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);
export default User;
