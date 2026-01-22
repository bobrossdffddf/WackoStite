#!/usr/bin/env npx tsx
import { storage } from "./storage";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log("\n--- ADMIN PANEL ---");
  console.log("1. List All Rooms");
  console.log("2. Close a Room");
  console.log("3. Ban a User/IP");
  console.log("4. Close ALL Rooms");
  console.log("5. Exit");
  rl.question("Select option: ", handleChoice);
}

async function handleChoice(choice: string) {
  switch (choice) {
    case "1":
      const rooms = await storage.getRooms();
      console.log("\nActive Rooms:");
      rooms.forEach(r => console.log(`- ${r.id} (Host: ${r.hostId}, Closed: ${r.isClosed})`));
      showMenu();
      break;
    case "2":
      rl.question("Room ID: ", async (id) => {
        await storage.closeRoom(id);
        console.log(`Room ${id} closed.`);
        showMenu();
      });
      break;
    case "3":
      rl.question("Room ID: ", (roomId) => {
        rl.question("User ID or IP: ", async (target) => {
          await storage.banUser(roomId, target);
          console.log(`Target ${target} banned from ${roomId}.`);
          showMenu();
        });
      });
      break;
    case "4":
      const all = await storage.getRooms();
      for (const r of all) await storage.closeRoom(r.id);
      console.log("All rooms closed.");
      showMenu();
      break;
    case "5":
      rl.close();
      break;
    default:
      console.log("Invalid option");
      showMenu();
  }
}

console.log("Starting Wacko Admin CLI...");
showMenu();
