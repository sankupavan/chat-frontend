const socket = io(window.BACKEND_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true
});

const statusEl = document.getElementById("status");
const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");
const usernameEl = document.getElementById("username");

socket.on("connect", () => {
  statusEl.textContent = "Connected";
});
socket.on("connect_error", (err) => {
  statusEl.textContent = "Connection error: " + err.message;
});
socket.on("disconnect", () => {
  statusEl.textContent = "Disconnected";
});

socket.on("chat:message", (payload) => {
  const li = document.createElement("li");
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${payload.username} • ${new Date(payload.timestamp).toLocaleTimeString()}`;
  const text = document.createElement("div");
  text.textContent = payload.message;
  li.appendChild(meta);
  li.appendChild(text);
  messagesEl.appendChild(li);
  messagesEl.scrollTop = messagesEl.scrollHeight;
});

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameEl.value.trim();
  const message = inputEl.value.trim();
  if (!username || !message) return;

  const payload = {
    username,
    message,
    timestamp: Date.now()
  };
  socket.emit("chat:message", payload);
  inputEl.value = "";
});
