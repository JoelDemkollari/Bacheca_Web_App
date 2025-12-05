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

    // Testo
    const textSpan = document.createElement("span");
    textSpan.textContent = t.text;

    // Area icone
    const actions = document.createElement("div");

    // 🗑 icona
    const del = document.createElement("button");
    del.className = "icon-btn";
    del.innerHTML =
      '<input type="image" src="icons/trash-icon.png" width="50px" height="50px" title="Elimina">';
    del.onclick = () => deleteMessage(t.id);

    //actions.appendChild(toggle);
    actions.appendChild(del);

    li.appendChild(textSpan);
    li.appendChild(actions);
    list.appendChild(li);
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
