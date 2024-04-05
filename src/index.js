let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => renderToyCard(toy));
    });
});

function renderToyCard(toy) {
  const toyCollection = document.getElementById("toy-collection");
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  toyCollection.appendChild(card);
}

const toyForm = document.querySelector(".add-toy-form");

toyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(toyForm);
  const name = formData.get("name");
  const image = formData.get("image");
  const likes = 0;

  const newToy = { name, image, likes };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((response) => response.json())
    .then((toy) => {
      // After successfully adding the new toy, render its card in the DOM
      renderToyCard(toy);
      // Optionally, you can reset the form after submission
      toyForm.reset();
    })
    .catch((error) => console.error("Error adding new toy:", error));
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("like-btn")) {
    const toyId = event.target.id;
    const likeElement = event.target.previousElementSibling;
    const currentLikes = parseInt(likeElement.textContent);
    const newNumberOfLikes = currentLikes + 1;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newNumberOfLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        likeElement.textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => console.error("Error updating likes:", error));
  }
});
