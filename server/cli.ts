import { storage } from "./storage";
import { registerRoutes } from "./routes";
import express from "express";
import { createServer } from "http";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const roomId = args[1];
  const targetId = args[2];

  if (!command) {
    console.log("Usage: npx tsx server/cli.ts [close|ban|list] [room_id] [user_id_if_ban]");
    process.exit(1);
  }

  // CLI runs in a separate process, so we need to be careful with MemStorage.
  // In this specific template, we'll try to output useful info.
  
  switch (command) {
    case "close":
      if (!roomId) return console.log("Room ID required");
      await storage.closeRoom(roomId);
      console.log(`Command issued: Close Room ${roomId}`);
      break;
    case "ban":
      if (!roomId || !targetId) return console.log("Room ID and User ID required");
      await storage.banUser(roomId, targetId);
      console.log(`Command issued: Ban User ${targetId} from Room ${roomId}`);
      break;
    case "list":
      const rooms = await storage.getRooms();
      if (rooms.length === 0) {
        console.log("No active rooms found in this process memory.");
      } else {
        console.log("Active Rooms:");
        rooms.forEach(r => console.log(`- ${r.id} (Host: ${r.hostId}, Closed: ${r.isClosed})`));
      }
      break;
    default:
      console.log("Unknown command");
  }
}

main().catch(console.error);
