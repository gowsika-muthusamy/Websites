const API_URL = "http://localhost:5000/api/notes";
const loginbtn =document.getElementById("loginbtn");
  const signupbtn =document.getElementById("signupbtn");

function getToken() {
  return localStorage.getItem("token");}

function showLogoutButton() {
  const div = document.getElementById("authdiv");

  if (!document.getElementById("logoutBtn")) {
    const button = document.createElement("button");
    button.innerText = "Logout";
    button.id = "logoutBtn";
    button.onclick = logout;
    div.appendChild(button);}}

function removeLogoutButton() {
  const btn = document.getElementById("logoutBtn");
  if (btn) btn.remove();}


async function login() {
  document.getElementById("email").disabled = true;
  document.getElementById("password").disabled = true;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  localStorage.setItem("userEmail", email);
  if (res.ok) {
    localStorage.setItem("token", data.token);
    showLogoutButton(); 
    alert("Login successful!");
    fetchNotes();
  } else {
    alert(data.message || "Login failed");}
  
  loginbtn.style.display = "none";
  signupbtn.style.display = "none";
  }


function logout() {
  document.getElementById("email").value="";
  document.getElementById("password").value="";
  document.getElementById("email").disabled = false;
  document.getElementById("password").disabled = false;
  localStorage.removeItem("token");
  localStorage.removeItem('email');
  document.getElementById("notes").innerHTML = "";
  removeLogoutButton(); 
   loginbtn.style.display = "block";
  signupbtn.style.display = "block";

  alert("Logged out");}
async function fetchNotes() {
  const token = getToken();
  if (!token) {
    document.getElementById("notes").innerHTML = "<p>Please login</p>";
    return;}
  const res = await fetch(API_URL, {
    headers: {
      "x-auth-token": token
    }});
  if (res.status === 401) {
    document.getElementById("notes").innerHTML = "<p>Unauthorized</p>";
    return;}
  const notes = await res.json();
  displayNotes(notes);
}
function displayNotes(notes) {
  const container = document.getElementById("notes");
  container.innerHTML = ""; 
  if (notes.length === 0) {
    container.innerHTML = "<p>No notes found</p>";
    return;}
  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-buttons">
        <button onclick="editNote('${note._id}', \`${note.title}\`, \`${note.content}\`)">Edit</button>
        <button onclick="deleteNote('${note._id}')">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });}
async function createNote() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": getToken()
    },
    body: JSON.stringify({ title, content })
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.message || "Error creating note");
    return;}
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
fetchNotes();}

async function editNote(id, oldTitle, oldContent) {
  const title = prompt("Edit title:", oldTitle);
  const content = prompt("Edit content:", oldContent);
  if (!title || !content) return;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": getToken()},
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) {
    alert("Error updating note");
    return;}
  fetchNotes();}

async function deleteNote(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": getToken()
    }});
  if (!res.ok) {
    alert("Error deleting note");
    return;}
  fetchNotes();}


if (getToken()) {
const savedEmail = localStorage.getItem("userEmail");
if (savedEmail) {
  document.getElementById("email").value = savedEmail;
  document.getElementById("email").disabled = true;
  
   
}
  showLogoutButton();
  loginbtn.style.display = "none";
  signupbtn.style.display = "none";
  fetchNotes();
} else {
  document.getElementById("notes").innerHTML = "<p>Please login</p>";
}
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
   document.getElementById("email").disabled = true;
  document.getElementById("password").disabled = true;

  const res = await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
localStorage.setItem("userEmail", email);
  if (res.ok) {
    localStorage.setItem("token", data.token);
    showLogoutButton();   
    alert("Signup successful!");
    fetchNotes();
  } else {
    alert(data.message || "Signup failed");
  }
}