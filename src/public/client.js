import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const socket = io();

const chatInputDuck = document.getElementById("inputDuck");
const chatOutputDuck = document.getElementById("outputDuck");
const chatAnchorDuck = document.querySelector("#outputDuck .anchor");
const consoleOutputDuck = document.getElementById("consoleDuck");
const consoleAnchorDuck = document.querySelector("#consoleDuck .anchor");
const tabConsoleDuck = document.getElementById("consoleTabDuck");
const tabChatDuck = document.getElementById("chatTabDuck");
const chatDuck = document.getElementById("chatDuck");

const chatInputDuckling = document.getElementById("inputDuckling");
const chatOutputDuckling = document.getElementById("outputDuckling");
const chatAnchorDuckling = document.querySelector("#outputDuckling .anchor");
const consoleOutputDuckling = document.getElementById("consoleDuckling");
const consoleAnchorDuckling = document.querySelector("#consoleDuckling .anchor");
const tabConsoleDuckling = document.getElementById("consoleTabDuckling");
const tabChatDuckling = document.getElementById("chatTabDuckling");
const chatDuckling = document.getElementById("chatDuckling");

const chatInputDuckieprincess = document.getElementById("inputDuckieprincess");
const chatOutputDuckieprincess = document.getElementById("outputDuckieprincess");
const chatAnchorDuckieprincess = document.querySelector("#outputDuckieprincess .anchor");
const consoleOutputDuckieprincess = document.getElementById("consoleDuckieprincess");
const consoleAnchorDuckieprincess = document.querySelector("#consoleDuckieprincess .anchor");
const tabConsoleDuckieprincess = document.getElementById("consoleTabDuckieprincess");
const tabChatDuckieprincess = document.getElementById("chatTabDuckieprincess");
const chatDuckieprincess = document.getElementById("chatDuckieprincess");

function logDuck(msg, type = "info") {
    const p = document.createElement("p");
    p.textContent = msg;
    p.classList.add(type);
    consoleOutputDuck.insertBefore(p, consoleAnchorDuck);
    // If number of p tags exceeds 51, remove oldest one
    if (consoleOutputDuck.children.length > 51) {
        consoleOutputDuck.removeChild(consoleOutputDuck.children[0]);
    }
}
function logChatDuck(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    chatOutputDuck.insertBefore(p, chatAnchorDuck);
    // If number of p tags exceeds 101, remove oldest one
    if (chatOutputDuck.children.length > 101) {
        chatOutputDuck.removeChild(chatOutputDuck.children[0]);
    }
}
function logDuckling(msg, type = "info") {
    const p = document.createElement("p");
    p.textContent = msg;
    p.classList.add(type);
    consoleOutputDuckling.insertBefore(p, consoleAnchorDuckling);
    // If number of p tags exceeds 51, remove oldest one
    if (consoleOutputDuckling.children.length > 51) {
        consoleOutputDuckling.removeChild(consoleOutputDuckling.children[0]);
    }
}
function logChatDuckling(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    chatOutputDuckling.insertBefore(p, chatAnchorDuckling);
    // If number of p tags exceeds 101, remove oldest one
    if (chatOutputDuckling.children.length > 101) {
        chatOutputDuckling.removeChild(chatOutputDuckling.children[0]);
    }
}
function logDuckieprincess(msg, type = "info") {
    const p = document.createElement("p");
    p.textContent = msg;
    p.classList.add(type);
    consoleOutputDuckieprincess.insertBefore(p, consoleAnchorDuckieprincess);
    // If number of p tags exceeds 51, remove oldest one
    if (consoleOutputDuckieprincess.children.length > 51) {
        consoleOutputDuckieprincess.removeChild(consoleOutputDuckieprincess.children[0]);
    }
}
function logChatDuckieprincess(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    chatOutputDuckieprincess.insertBefore(p, chatAnchorDuckieprincess);
    // If number of p tags exceeds 101, remove oldest one
    if (chatOutputDuckieprincess.children.length > 101) {
        chatOutputDuckieprincess.removeChild(chatOutputDuckieprincess.children[0]);
    }
}

tabConsoleDuck.addEventListener("click", () => {
    tabChatDuck.classList.remove("active");
    tabConsoleDuck.classList.add("active");
    chatDuck.classList.remove("active");
    consoleOutputDuck.classList.add("active");
});
tabChatDuck.addEventListener("click", () => {
    tabConsoleDuck.classList.remove("active");
    tabChatDuck.classList.add("active");
    consoleOutputDuck.classList.remove("active");
    chatDuck.classList.add("active");
});
tabConsoleDuckling.addEventListener("click", () => {
    tabChatDuckling.classList.remove("active");
    tabConsoleDuckling.classList.add("active");
    chatDuckling.classList.remove("active");
    consoleOutputDuckling.classList.add("active");
});
tabChatDuckling.addEventListener("click", () => {
    tabConsoleDuckling.classList.remove("active");
    tabChatDuckling.classList.add("active");
    consoleOutputDuckling.classList.remove("active");
    chatDuckling.classList.add("active");
});
tabConsoleDuckieprincess.addEventListener("click", () => {
    tabChatDuckieprincess.classList.remove("active");
    tabConsoleDuckieprincess.classList.add("active");
    chatDuckieprincess.classList.remove("active");
    consoleOutputDuckieprincess.classList.add("active");
});
tabChatDuckieprincess.addEventListener("click", () => {
    tabConsoleDuckieprincess.classList.remove("active");
    tabChatDuckieprincess.classList.add("active");
    consoleOutputDuckieprincess.classList.remove("active");
    chatDuckieprincess.classList.add("active");
});


chatInputDuck.addEventListener("keyup", ({ key }) => {
    if (key !== "Enter") return;
    socket.emit("chat_input_duck", chatInputDuck.value);
    chatInputDuck.value = "";
});
chatInputDuckling.addEventListener("keyup", ({ key }) => {
    if (key !== "Enter") return;
    socket.emit("chat_input_duckling", chatInputDuckling.value);
    chatInputDuckling.value = "";
});
chatInputDuckieprincess.addEventListener("keyup", ({ key }) => {
    if (key !== "Enter") return;
    socket.emit("chat_input_duckieprincess", chatInputDuckieprincess.value);
    chatInputDuckieprincess.value = "";
});

socket.on("connect", () => {
    console.log("Connected to server");
    logDuck("Connected to server", "info");
    logDuckling("Connected to server", "info");
    logDuckieprincess("Connected to server", "info");
});

socket.on("log_error", (msg) => {
    console.error(`[ERROR] ${msg}`);
    logDuck(msg, "error");
    logDuckling(msg, "error");
});
socket.on("log_error_duck", (msg) => {
    console.error(`[ERROR] [DUCK] ${msg}`);
    logDuck(msg, "error");
});
socket.on("log_error_duckling", (msg) => {
    console.error(`[ERROR] [DUCKLING] ${msg}`);
    logDuckling(msg, "error");
});
socket.on("log_error_duckieprincess", (msg) => {
    console.error(`[ERROR] [DUCKIEPRINCESS] ${msg}`);
    logDuckieprincess(msg, "error");
});
socket.on("log_warn", (msg) => {
    console.warn(`[WARN] ${msg}`);
    logDuck(msg, "warn");
    logDuckling(msg, "warn");
});
socket.on("log_warn_duck", (msg) => {
    console.warn(`[WARN] [DUCK] ${msg}`);
    logDuck(msg, "warn");
});
socket.on("log_warn_duckling", (msg) => {
    console.warn(`[WARN] [DUCKLING] ${msg}`);
    logDuckling(msg, "warn");
});
socket.on("log_warn_duckieprincess", (msg) => {
    console.warn(`[WARN] [DUCKIEPRINCESS] ${msg}`);
    logDuckieprincess(msg, "warn");
});
socket.on("log_info", (msg) => {
    console.log(`[INFO] ${msg}`);
    logDuck(msg, "info");
    logDuckling(msg, "info");
});
socket.on("log_info_duck", (msg) => {
    console.log(`[INFO] [DUCK] ${msg}`);
    logDuck(msg, "info");
});
socket.on("log_info_duckling", (msg) => {
    console.log(`[INFO] [DUCKLING] ${msg}`);
    logDuckling(msg, "info");
});
socket.on("log_info_duckieprincess", (msg) => {
    console.log(`[INFO] [DUCKIEPRINCESS] ${msg}`);
    logDuckieprincess(msg, "info");
});

socket.on("chat_message_duck", (msg) => {
    logChatDuck(msg);
});
socket.on("chat_message_duckling", (msg) => {
    logChatDuckling(msg);
});
socket.on("chat_message_duckieprincess", (msg) => {
    logChatDuckieprincess(msg);
});