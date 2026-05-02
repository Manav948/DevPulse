import Monitor from "../model/monitorModel.js";
import axios from "axios"

const WORKER_TICK_MS = 30 * 1000;

const parseInterval = (interval) => {
    const parsed = Number(interval);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return Math.floor(parsed);
};

export const createMonitor = async (req, res) => {

    try {
        const { title, url, interval } = req.body;
        const userId = req.user.id

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

        const parsedInterval = interval !== undefined
            ? parseInterval(interval)
            : 60;

        if (!parsedInterval) {
            return res.status(400).json({
                message: "Interval must be a positive number of seconds"
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
            interval: parsedInterval
        })
        return res.status(201).json({ message: "Monitor created successfully", monitor });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const startMonitor = async () => {
    setInterval(async () => {
        console.log("Running monitoring cycle");
        try {
            const monitors = await Monitor.find({ isActive: true });
            const now = Date.now();

            for (const monitor of monitors) {
                const monitorIntervalMs = (parseInterval(monitor.interval) || 60) * 1000;
                const lastCheckedAtMs = monitor.lastCheckedAt
                    ? new Date(monitor.lastCheckedAt).getTime()
                    : 0;

                if (lastCheckedAtMs && now - lastCheckedAtMs < monitorIntervalMs) {
                    continue;
                }

                const start = Date.now();
                try {
                    await axios.get(monitor.url);
                    const responseTime = Date.now() - start;
                    await Monitor.findByIdAndUpdate(monitor._id, {
                        lastStatus: "UP",
                        lastCheckedAt: new Date()
                    })
                    console.log(`${monitor.url} UP (${responseTime}ms)`);
                } catch (error) {
                    await Monitor.findByIdAndUpdate(monitor._id, {
                        lastStatus: "DOWN",
                        lastCheckedAt: new Date()
                    })
                    console.log(`${monitor.url} DOWN`);
                }
            }
        } catch (error) {
            console.log("Worker error:", error);
        }
    }, WORKER_TICK_MS);
}

export const deleteMonitor = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id
        if (!id) {
            return res.status(400).json({ message: "monitorId is required" });
        }
        const monitor = await Monitor.findOneAndDelete({
            _id: id,
            userId
        })

        if (!monitor) {
            return res.status(404).json({ message: "Monitor deleted successfully" })
        }
        return res.status(200).json({ message: "monitor deleted successfully" })
    } catch (error) {
        console.log("Delete Monitor Error:", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getMonitor = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const monitor = await Monitor.findOne({
            _id: id,
            userId
        })

        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" })
        }
        return res.status(200).json({
            message: "Monitors get successfully",
            monitor
        });
    } catch (error) {
        console.log("Get Monitor Error:", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllMonitor = async (req, res) => {
    try {
        const userId = req.user.id
        const monitors = await Monitor.find({
            userId
        }).sort({ createdAt: -1 })

        if (!monitors) {
            return res.status(404).json({ message: "Monitor not found" })
        }
        return res.status(200).json({
            message: "Monitors fetched successfully",
            monitors
        });
    } catch (error) {
        console.log("Get Monitor Error:", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateMonitor = async (req, res) => {
    try {
        const { id } = req.params
        const { title, url, interval } = req.body
        const userId = req.user.id
        const monitor = await Monitor.findOne({
            _id: id,
            userId
        })

        if (!monitor) {
            return res.status(404).json({ messsage: "Monitor not found" })
        }
        if(url) {
            let parsedUrl;
            try {
                parsedUrl = new URL(url);
            } catch (error) {
                return res.status(400).json({ message: "Invalid Url" })
            }
            if(!["http:", "https:"].includes(parsedUrl.protocol)){
                return res.status(400).json({
                    message : "URL must start with http or https"
                })
            }
        }
        const parsedInterval = interval !== undefined 
        ? parseInterval(interval)
        : monitor.interval

        if(!parsedInterval) {
            return res.status(400).json({
                message : "Interval must be a positive number of seconds"
            })
        }
        monitor.title = title || monitor.title
        monitor.url = url || monitor.url
        monitor.interval = parsedInterval

        await monitor.save()

        return res.status(200).json({
            message : "Monitor updated successfully",
            monitor
        })
    }
    catch (error) {
        console.log("Update Monitor Error:", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}