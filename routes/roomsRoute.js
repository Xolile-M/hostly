const express = require("express");
const router = express.Router();

const Room = require("../models/room");

router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getroombyid", async (req, res) => {
  const roomid = req.body.roomid;
  try {
    const room = await Room.findOne({ _id: roomid });
    res.send(room);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// Filter rooms by date range and type
router.post("/getroomsbydates", async (req, res) => {
  const { fromDate, toDate, roomType } = req.body;

  try {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Fetch rooms based on room type filter
    const query = roomType === "all" ? {} : { type: roomType };
    let rooms = await Room.find(query);

    // Filter rooms that have overlapping bookings
    rooms = rooms.filter((room) => {
      if (!room.bookings || room.bookings.length === 0) {
        return true; // Room is available if no bookings exist
      }

      return room.bookings.every(
        (booking) =>
          new Date(booking.toDate) < startDate ||
          new Date(booking.fromDate) > endDate
      );
    });

    res.send(rooms);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error filtering rooms" });
  }
});

// Endpoint to book a room
router.post("/bookroom", async (req, res) => {
  const { roomId, fromDate, toDate, userId } = req.body;

  try {
    const room = await Room.findOne({ _id: roomId });
    room.bookings.push({ fromDate, toDate, userId });
    await room.save();
    res.send("Booking successful");
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Booking failed" });
  }
});

module.exports = router;
