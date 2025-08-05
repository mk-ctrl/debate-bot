// chat.controller.js
import createRoom from "../model/room.model.js";

export const Create_Room = async (req, res) => {
  try {
    const { name, roomCode, topic } = req.body;
    const existing = await createRoom.findOne({ code: roomCode });
    if (existing) {
      return res.status(400).json({ message: "Room Code already Exists, Create a New One" });
    }
    const newRoom = new createRoom({
      host: name,
      code: roomCode,
      users: [name],
      topic: topic
    });
    await newRoom.save();
    return res.status(200).json({
      message: "Room Code generated Successfully",
      user: newRoom.users,
      topic: newRoom.topic,
      host: newRoom.host,
      roomCode: newRoom.code
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const JoinRoom = async (req, res) => {
  try {
    const { name, roomCode, side } = req.body;
    if (!name || !roomCode) return res.status(400).json({ message: "name and roomCode required" });

    const room = await createRoom.findOne({ code: roomCode });
    if (!room) {
      return res.status(400).json({ message: "Room Code not found" });
    }

    // add to users if not already present
    if (!room.users.includes(name)) room.users.push(name);

    // side check: original used 'bg-red-700' — preserve that mapping
    if (side === 'bg-red-700') {
      if (!room.team_red.includes(name)) room.team_red.push(name);
      // remove from blue if present
      room.team_blue = room.team_blue.filter(u => u !== name);
    } else {
      if (!room.team_blue.includes(name)) room.team_blue.push(name);
      room.team_red = room.team_red.filter(u => u !== name);
    }

    await room.save();

    const updated = await createRoom.findOne({ code: roomCode }).lean();

    // emit to room so other sockets update
    if (global.io) global.io.to(roomCode).emit('room-updated', updated);

    return res.status(200).json({
      message: "Room Found, Entering Debate",
      user: updated.users,
      topic: updated.topic,
      host: updated.host,
      username: name,
      roomCode: updated.code,
      team_red: updated.team_red,
      team_blue: updated.team_blue
    });
  } catch (error) {
    console.error('JoinRoom error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const ExitRoom = async (req, res) => {
  try {
    const { roomCode, username } = req.body;
    if (!roomCode || !username) return res.status(400).json({ error: "roomCode and username required" });

    const user = String(username).trim();
    if (!user) return res.status(400).json({ error: "invalid username" });

    const updated = await createRoom.findOneAndUpdate(
      { code: roomCode },
      { $pull: { users: user, team_red: user, team_blue: user } },
      { new: true, lean: true }
    );

    if (!updated) return res.status(404).json({ error: "Room not found" });

    // emit updated room to sockets in that room
    if (global.io) global.io.to(roomCode).emit('room-updated', updated);

    return res.status(200).json({ success: true, room: updated });
  } catch (err) {
    console.error('ExitRoom error:', err);
    return res.status(500).json({ error: "Server error" });
  }
};
