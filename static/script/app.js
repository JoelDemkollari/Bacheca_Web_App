async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  alert(data.message || data.error);

  if (res.status === 200) location.href = "bacheca.html";
}

async function registerUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  alert(data.message || data.error);

  if (res.status === 201) location.href = "login.html";
}

async function logout() {
  await fetch("/api/logout", { method: "POST" });
  location.href = "login.html";
}

async function loadMessages() {
  const res = await fetch("/api/messages");

  if (res.status !== 200) {
    location.href = "login.html";
    return;
  }

  const data = await res.json();
  const list = document.getElementById("messageList");
  list.innerHTML = "";

  data.items.forEach((t) => {
    const li = document.createElement("li");
    li.className = "message";

    li.innerHTML = `
    <div class="message-left">
      <div class="message-header">
        <span class="message-user">${t.email}</span>
        <span class="message-time">${t.time}</span>
      </div>

      <div class="message-text">
        ${escapeHtml(t.text)}
      </div>
    </div>

    ${
      t.can_delete
        ? `<button class="icon-btn delete-btn" title="Elimina">
             <i class="fa-solid fa-trash"></i>
           </button>`
        : ""
    }
  `;

    if (t.can_delete) {
      li.querySelector(".delete-btn").onclick = () => deleteMessage(t.id);
    }

    document.getElementById("messageList").appendChild(li);
  });
}

async function addMessage() {
  const text = document.getElementById("messageText").value;

  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  loadMessages();
}

async function deleteMessage(id) {
  await fetch(`/api/messages/${id}`, { method: "DELETE" });
  loadMessages();
}

if (location.pathname.endsWith("bacheca.html")) loadMessages();

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
