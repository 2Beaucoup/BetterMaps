import groceryData from "@/data/Grocery.json";
import chicagoInternet from "@/data/chicago_internet.json";

// create a dictionary where neighborhood name is key and population is value
const neighborhoodPopulations: { [key: string]: number } = {};

for (const neighborhood of chicagoInternet) {
  neighborhoodPopulations[neighborhood.name.toLowerCase()] =
    neighborhood.total_pop;
}

const neighborhoodNumGroceryStores: { [key: string]: number } = {};

for (const groceryStore of groceryData) {
  neighborhoodNumGroceryStores[
    groceryStore["COMMUNITY AREA NAME"].toLowerCase()
  ] =
    ((1 +
      neighborhoodNumGroceryStores[
        groceryStore["COMMUNITY AREA NAME"].toLowerCase()
      ]) as number) || 0;
}

// Calculate the food desertness score for each neighborhood
const foodDesertnessScores: { [key: string]: number } = {};

for (const neighborhood in neighborhoodPopulations) {
  const population = neighborhoodPopulations[neighborhood];
  const numGroceryStores =
    (neighborhoodNumGroceryStores[neighborhood] as number) || 1; // Avoid division by zero
  const score = population / numGroceryStores;
  foodDesertnessScores[neighborhood] = score;

}

// Normalize the scores to a scale of 0 to 100
const maxScore = Math.max(...Object.values(foodDesertnessScores));
const minScore = Math.min(...Object.values(foodDesertnessScores));

const normalizedFoodDesertnessScores: { [key: string]: number } = {};

for (const neighborhood in foodDesertnessScores) {
  const score = foodDesertnessScores[neighborhood];
  const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
  normalizedFoodDesertnessScores[neighborhood] = normalizedScore;
}

export default normalizedFoodDesertnessScores;
