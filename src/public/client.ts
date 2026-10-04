import { io } from "socket.io-client";

const socket = io();
const chatInput = document.getElementById("input") as HTMLInputElement;
const chatOutput = document.getElementById("output") as HTMLDivElement;
const consoleOutput = document.getElementById("console") as HTMLDivElement;

function log(msg: string, type: "info" | "warn" | "error" = "info") {
    const p = document.createElement("p");
    p.textContent = msg;
    p.classList.add(type);
    consoleOutput.appendChild(p);
    // If number of p tags exceeds 50, remove oldest one
    if (consoleOutput.children.length > 50) {
        consoleOutput.removeChild(consoleOutput.children[0]);
    }
}
function logChat(msg: HTMLElement) {
    const p = document.createElement("p");
    p.appendChild(msg);
    chatOutput.appendChild(p);
    // If number of p tags exceeds 100, remove oldest one
    if (chatOutput.children.length > 100) {
        chatOutput.removeChild(chatOutput.children[0]);
    }
}

chatInput.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("chat_input", chatInput.value);
    chatInput.value = "";
});

socket.on("connect", () => {
    console.log("Connected to server");
    log("Connected to server", "info");
});

socket.on("log_error", (msg) => {
    console.error(msg);
    log(msg, "error");
});
socket.on("log_warn", (msg) => {
    console.warn(msg);
    log(msg, "warn");
});
socket.on("log_info", (msg) => {
    console.log(msg);
    log(msg, "info");
});

socket.on("chat_message", (msg) => {
    logChat(msg);
});