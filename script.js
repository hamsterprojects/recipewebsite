// script.js

document.addEventListener('DOMContentLoaded', function() {
    const newRecipeBtn = document.getElementById('newRecipeBtn');
    const recipeFormModal = document.getElementById('recipeFormModal');
    const closeModal = document.querySelector('.close');
    const recipeForm = document.getElementById('recipeForm');
    const recipesContainer = document.getElementById('recipesContainer');
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    function displayRecipes() {
        recipesContainer.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const recipeElement = document.createElement('section');
            recipeElement.classList.add('recipe');
            recipeElement.innerHTML = `
                ${recipe.cover ? `<img src="${recipe.cover}" alt="${recipe.title} Cover Image">` : '<div class="no-cover">No Cover Image</div>'}
                <h2>${recipe.title}</h2>
                <div class="recipe-details" id="recipe-details-${index}">
                    <h3>Ingredients:</h3>
                    <ul>${recipe.ingredients.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>
                    <h3>Instructions:</h3>
                    <ol>${recipe.instructions.split('\n').map(item => `<li>${item}</li>`).join('')}</ol>
                </div>
                <button class="delete-btn" data-index="${index}">&times;</button>
            `;

            recipeElement.querySelector('.recipe-details').style.display = 'none';

            recipeElement.addEventListener('click', (event) => {
                if (event.target.classList.contains('delete-btn')) return;
                const details = recipeElement.querySelector('.recipe-details');
                document.querySelectorAll('.recipe-details').forEach(detail => {
                    if (detail !== details) {
                        detail.style.display = 'none';
                    }
                });
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            });

            const deleteBtn = recipeElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = deleteBtn.getAttribute('data-index');
                recipes.splice(index, 1);
                saveRecipes();
                displayRecipes();
            });

            recipesContainer.appendChild(recipeElement);
        });
    }

    function saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    newRecipeBtn.addEventListener('click', () => {
        recipeFormModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        recipeFormModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == recipeFormModal) {
            recipeFormModal.style.display = 'none';
        }
    });

    recipeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('recipeTitle').value;
        const ingredients = document.getElementById('recipeIngredients').value;
        const instructions = document.getElementById('recipeInstructions').value;
        const coverFile = document.getElementById('recipeCover').files[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            const cover = coverFile ? e.target.result : '';
            recipes.push({ title, ingredients, instructions, cover });
            saveRecipes();
            displayRecipes();
            recipeFormModal.style.display = 'none';
            recipeForm.reset();
        };

        if (coverFile) {
            reader.readAsDataURL(coverFile);
        } else {
            reader.onload();
        }
    });

    displayRecipes();
});
