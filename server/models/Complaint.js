const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    citizenName: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },

    damageType: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Complaint", complaintSchema);