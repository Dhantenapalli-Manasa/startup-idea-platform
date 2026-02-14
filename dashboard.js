
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}


function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}


async function fetchIdeas() {
  const res = await fetch("http://localhost:5000/api/ideas", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (res.ok) {
    const ideasList = document.getElementById("ideasList");
    ideasList.innerHTML = "";

    data.forEach(idea => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h4>${idea.title}</h4>
        <p>${idea.description}</p>
        <hr>
      `;
      ideasList.appendChild(div);
    });
  } else {
    alert("Failed to load ideas");
  }
}

fetchIdeas();
