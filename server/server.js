const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Complaint = require("./models/Complaint");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Public Infrastructure Reporting System Backend is running!");
});

app.post("/api/complaints", async (req, res) => {
    try {
        const complaint = new Complaint(req.body);
        const savedComplaint = await complaint.save();

        res.status(201).json(savedComplaint);
    } catch (error) {
        res.status(500).json({
            message: "Failed to save complaint",
            error: error.message
        });
    }
});

app.get("/api/complaints", async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch complaints",
            error: error.message
        });
    }
});

app.put("/api/complaints/:id", async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json(complaint);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update complaint",
            error: error.message
        });
    }
});

app.delete("/api/complaints/:id", async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            message: "Complaint deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete complaint",
            error: error.message
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});