const searchInput = document.getElementById("searchInput");
const recipesContainer = document.getElementById("recipesContainer");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const modal = document.getElementById("recipeModal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.getElementsByClassName("close")[0];


closeBtn.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchRecipes();
    }
});

const RAPID_API_KEY = '78851314fbmsh0d2c0c116728054p154237jsn3cc42fe3fee5';
async function searchRecipes() {
  const query = searchInput.value.trim();

  if (!query) {
    errorElement.textContent = "Please enter a search term";
    return;
  }

  loadingElement.style.display = "block";
  errorElement.textContent = "";
  recipesContainer.innerHTML = "";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(
      `https://tasty.p.rapidapi.com/recipes/list?q=${query}&from=0&size=20`,
      options
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      displayRecipes(data.results);
    } else {
      errorElement.textContent =
        "No recipes found. Try different search terms.";
    }
  } catch (error) {
    console.error("Error:", error);
    errorElement.textContent =
      "Error fetching recipes. Please try again later.";
  } finally {
    loadingElement.style.display = "none";
  }
}

function displayRecipes(recipes) {
  recipesContainer.innerHTML = "";

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
                    <img src="${recipe.thumbnail_url}" alt="${recipe.name}" class="recipe-image">
                    <div class="recipe-content">
                        <h3 class="recipe-title">${recipe.name}</h3>
                        <div class="recipe-info">
                            ${ recipe.total_time_minutes ? `<p><i class="fas fa-clock"></i> ${recipe.total_time_minutes} mins</p>`: ""}
                            ${recipe.num_servings ? `<p><i class="fas fa-user-friends"></i> ${recipe.num_servings} servings</p>`: "" }
                        </div>
                        <div class="tags">
                            ${recipe.tags ? recipe.tags.slice(0, 3).map((tag) => `<span class="tag">${tag.display_name}</span>`).join(""): ""}
                        </div>
                    </div>
                `;

    card.onclick = () => showRecipeDetails(recipe);
    recipesContainer.appendChild(card);
  });
}

function showRecipeDetails(recipe) {
  modalContent.innerHTML = `
                <h2>${recipe.name}</h2>
                <img src="${recipe.thumbnail_url}" alt="${recipe.name}">
                
                ${
                  recipe.description
                    ? `
                    <h3>Description</h3>
                    <p>${recipe.description}</p>
                `
                    : ""
                }

                <h3>Ingredients</h3>
                <ul>
                    ${recipe.sections[0].components
                      .map((component) => `<li>${component.raw_text}</li>`)
                      .join("")}
                </ul>

                <h3>Instructions</h3>
                <div class="instructions">
                    ${recipe.instructions
                      .map(
                        (instruction, index) => `
                        <div class="instruction-step">
                            <strong>Step ${index + 1}:</strong> ${
                          instruction.display_text
                        }
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;

  modal.style.display = "block";
}


window.onload = function () {
  searchInput.value = "Biryani";
  searchRecipes();
};
