let typingTimeout;
const typingIndicator = document.createElement("div");
typingIndicator.style.fontSize = "12px";
typingIndicator.style.color = "gray";
typingIndicator.style.margin = "5px";
document.querySelector(".chat-window").appendChild(typingIndicator);

// Typing event
const input = document.getElementById("messageInput");
input.addEventListener("input", () => {
  socket.emit("typing", true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => socket.emit("typing", false), 1000);
});

// Show typing indicator
socket.on("typing", ({ alias, isTyping }) => {
  typingIndicator.textContent = isTyping ? `${alias} is typing...` : "";
});

// Messages
socket.on("chatMessage", ({ id, alias, msg, color }) => {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.classList.add("message");

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.style.background = color;
  div.appendChild(avatar);

  const span = document.createElement("span");
  span.textContent = `${alias}: ${msg}`;
  div.appendChild(span);

  // Read receipt span
  const receipt = document.createElement("small");
  receipt.classList.add("receipt");
  receipt.textContent = "";
  div.appendChild(receipt);

  if (socket.id === id) {
    div.style.justifyContent = "flex-end";
    div.dataset.mine = "true"; // mark my own message
  }

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  // Unread badge for other groups
  if (alias !== window.alias) {
    groups.forEach(g => {
      if (g !== currentGroup && document.getElementById(`badge-${g}`)) {
        unreadCounts[g] = (unreadCounts[g] || 0) + 1;
        const badge = document.getElementById(`badge-${g}`);
        badge.textContent = unreadCounts[g];
        badge.style.display = "inline-block";
      }
    });
  }
});

// Mark messages as read when joining a group
function joinGroup(group) {
  currentGroup = group;
  document.getElementById("currentGroupName").textContent = group;
  unreadCounts[group] = 0;
  document.getElementById(`badge-${group}`).style.display = "none";
  socket.emit("joinGroup", { groupId: group, alias });
  document.getElementById("messages").innerHTML = "";

  // tell server we read all messages
  socket.emit("readMessages");
}

// Update receipts
socket.on("messagesRead", ({ reader }) => {
  const myMsgs = document.querySelectorAll(".message[data-mine='true'] .receipt");
  myMsgs.forEach(r => {
    r.textContent = "✓✓"; // double tick
    r.style.color = "blue";
  });
});
