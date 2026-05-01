import mongoose from "mongoose"
const monitorSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    interval: {
        type: Number,
        default: 60
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastStatus: {
        type: String,
        enum: ["UP", "DOWN", "UNKNOWN"],
        default: "UNKNOWN"
    },
    lastCheckedAt: {
        type: Date
    }
}, {
    timestamps: true
})

const Monitor = mongoose.model("Monitor", monitorSchema);
export default Monitor