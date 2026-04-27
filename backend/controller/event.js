const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Event = require("../model/event");
const Seller = require("../model/seller");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const catchAsyncError = require("../middleware/catchAsyncError");

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Create event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncError(async (req, res, next) => {
    const seller = await Seller.findById(req.body.shopId);

    if (!seller) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    if (!req.files?.length) {
      return next(new ErrorHandler("Please upload at least one event image", 400));
    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return next(new ErrorHandler("Please provide valid event dates", 400));
    }

    if (endDate < addDays(startDate, 3)) {
      return next(
        new ErrorHandler("Event end date must be at least 3 days after the start date", 400)
      );
    }

    const imageUrls = req.files.map((file) => file.filename);
    const eventData = {
      ...req.body,
      images: imageUrls,
      startDate,
      endDate,
      shop: seller,
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      event,
    });
  })
);

// Get all events
router.get(
  "/get-all-events",
  catchAsyncError(async (req, res) => {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  })
);

// Get single event details
router.get(
  "/get-event/:id",
  catchAsyncError(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
      success: true,
      event,
    });
  })
);

// Get all events for a seller/shop
router.get(
  "/get-all-events-shop/:id",
  catchAsyncError(async (req, res) => {
    const events = await Event.find({ shopId: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      events,
    });
  })
);

// Delete a seller/shop event
router.delete(
  "/delete-shop-event/:id",
  catchAsyncError(async (req, res, next) => {
    const filter = { _id: req.params.id };

    if (req.query.shopId) {
      filter.shopId = req.query.shopId;
    }

    const event = await Event.findOne(filter);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    await Promise.all(
      (event.images || []).map(async (image) => {
        try {
          await fs.promises.unlink(path.join("uploads", path.basename(image)));
        } catch {}
      })
    );
    await Event.deleteOne({ _id: event._id });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  })
);

module.exports = router;
