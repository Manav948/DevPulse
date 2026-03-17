import Monitor from "../model/monitorModel.js";

export const createMonitor = async (req, res) => {

    try {
        const { title, url, interval } = req.body;
        const userId = req.user.userId

        if (!title || !url) {
            return res.status(400).json({ message: "Title and url are required" })
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(url)
        } catch (error) {
            return res.status(400).json({ message: "Invalid Url" })
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                message: "URL must start with http or https"
            });
        }

        const existingMonitor = await Monitor.findOne({
            userId,
            url
        })

        if (existingMonitor) {
            return res.status(409).json({ message: "Monitor already exist" })
        }

        const monitor = await Monitor.create({
            userId,
            title,
            url,
            interval: interval || 60
        })
        return res.status(201).json("Monitor created successfully.", monitor)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}