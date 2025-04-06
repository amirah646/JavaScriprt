
async function getRecipe() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  const data = await res.json();
  return data;
}

getRecipe().then(data => {
 const recipes=data.meals
  const grid = document.getElementById("recipeGrid");

    recipes.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.title}">
        <h3>${recipe.strMeal}</h3>
        <p>${recipe.strInstructions}</p>
      `;
      grid.appendChild(card);
    });
});