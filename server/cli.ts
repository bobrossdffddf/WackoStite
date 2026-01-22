import { storage } from "./storage";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const roomId = args[1];
  const targetId = args[2];

  if (!command || !roomId) {
    console.log("Usage: node server/cli.ts [close|ban] [room_id] [user_id_if_ban]");
    process.exit(1);
  }

  switch (command) {
    case "close":
      await storage.closeRoom(roomId);
      console.log(`Room ${roomId} closed.`);
      break;
    case "ban":
      if (!targetId) {
        console.log("User ID required for ban");
        process.exit(1);
      }
      await storage.banUser(roomId, targetId);
      console.log(`User ${targetId} banned from room ${roomId}.`);
      break;
    case "list":
      const rooms = await storage.getRooms();
      console.log("Active Rooms:");
      rooms.forEach(r => console.log(`- ${r.id} (Host: ${r.hostId}, Closed: ${r.isClosed})`));
      break;
    default:
      console.log("Unknown command");
  }
}

// Note: MemStorage clears on restart. In a real app with persistent DB, this would work across restarts.
main().catch(console.error);
