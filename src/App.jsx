import { useState } from 'react'
import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [displayRecipes, setDisplayRecipes] = useState([]);
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [bestPrice, setBestPrice] = useState('');
  const [bestHealthScore, setBestHealthScore] = useState('');

  const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=15`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecipes(data.recipes);
        console.log(recipes);
        setDisplayRecipes(data.recipes);

        const prices = recipes.map(recipe => recipe.pricePerServing);
        const maxPrice = Math.max(...prices);
        setBestPrice(recipes[prices.indexOf(maxPrice)]);

        const healthScores = recipes.map(recipe => recipe.healthScore);
        const maxHealthScore = Math.max(...healthScores);
        setBestHealthScore(recipes[healthScores.indexOf(maxHealthScore)]);

      } catch (error) {
        console.error('Error fetching recipes:', error);
      } 
    };

    fetchRecipes();
  }, [API_KEY]);

  useEffect(() => {
    // Filter recipes based on search term
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchName.toLowerCase())
    );
    setDisplayRecipes(filtered);
  }, [searchName, recipes]);

  useEffect(() => {
    if (showVeganOnly) //if we cant show non vegan recipes
      setDisplayRecipes(displayRecipes.filter(recipe => recipe.vegan));
    else { //update to match search
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchName.toLowerCase())
      );
      setDisplayRecipes(filtered);
    }
  }, [searchName, showVeganOnly, recipes]) //search param passed bc needs to update too

  return (
    <div>
      <h1>Recipe Stuff 🍕</h1>
      <div>
        <h2>Da Facts:</h2>
        <h3>The number of vegan recipes: {recipes.filter(recipe => recipe.vegan).length}</h3>
        <h3>The recipe with best price/serving: {bestPrice.title}</h3>
        <h3>The "healthiest" recipe: {bestHealthScore.title}</h3>

      </div>

      <h2>Filter:</h2>
      <input type="text" name="searchname" placeholder="Search by Name..." onChange={(e) => setSearchName(e.target.value)}/> 
      <input type="checkbox" id="isvegan" name="isvegan" checked={showVeganOnly} onChange={(e) => setShowVeganOnly(!showVeganOnly)}/>
      <label for="isvegan">Show Only Vegan Options</label>
    
      <table>
        <thead>
          <tr>
              <td>Title</td>
              <td>Health Score</td>
              <td>Servings</td>
              <td>Price/Serving ($)</td>
              <td>Ready in Minutes</td>
              <td>Vegan</td>
          </tr>
        </thead>
        <tbody>
          {displayRecipes.map((recipe) => (
              <tr key={recipe.id}>
                <td><a href={recipe.sourceUrl}>{recipe.title}</a></td>
                <td>{recipe.healthScore}</td>
                <td>{recipe.servings}</td>
                <td>{recipe.pricePerServing}</td>
                <td>{recipe.readyInMinutes}</td>
                <td>{recipe.vegan ? `yes` : `no`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App
