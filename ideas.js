const API = "http://localhost:5000/api/ideas";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

const ideaForm = document.getElementById("ideaForm");
const ideasContainer = document.getElementById("ideasContainer");

async function loadIdeas() {
  const res = await fetch(API, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const ideas = await res.json();
  ideasContainer.innerHTML = "";

  ideas.forEach(idea => {
    ideasContainer.innerHTML += `
      <div class="idea-card">
        <h3>${idea.title}</h3>
        <p>${idea.description}</p>
        <button onclick="deleteIdea('${idea._id}')">🗑 Delete</button>
      </div>
    `;
  });
}

ideaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  });

  ideaForm.reset();
  loadIdeas();
});

async function deleteIdea(id) {
  if (!confirm("Are you sure you want to delete this idea?")) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      loadIdeas();
      alert("Idea deleted successfully!");
    } else {
      alert("Failed to delete idea");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Error deleting idea");
  }
}

loadIdeas();
