import groceryData from "@/data/Grocery.json";
import chicagoInternet from "@/data/chicago_internet.json";

function uppercase_to_upper_camel_case(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// create a dictionary where neighborhood name is key and population is value
const neighborhoodPopulations: { [key: string]: number } = {};

const neighborhoodIncome: { [key: string]: number } = {};

for (const neighborhood of chicagoInternet) {
  neighborhoodPopulations[uppercase_to_upper_camel_case(neighborhood.name)] =
    neighborhood.total_pop;
  neighborhoodIncome[uppercase_to_upper_camel_case(neighborhood.name)] =
    neighborhood.hh_median_income;
}

const neighborhoodNumGroceryStores: { [key: string]: number } = {};

for (const groceryStore of groceryData) {
  neighborhoodNumGroceryStores[
    uppercase_to_upper_camel_case(groceryStore["COMMUNITY AREA NAME"])
  ] =
    ((1 +
      neighborhoodNumGroceryStores[
        groceryStore["COMMUNITY AREA NAME"]
      ]) as number) || 0;
}

// Calculate the food desertness score for each neighborhood
const foodDesertnessScores: { [key: string]: number } = {};

const averageMedianIncome =
  Object.values(neighborhoodIncome).reduce((a, b) => a + b, 0) /
  Object.values(neighborhoodIncome).length;

for (const neighborhood in neighborhoodPopulations) {
  const population = neighborhoodPopulations[neighborhood];
  const numGroceryStores =
    (neighborhoodNumGroceryStores[neighborhood] as number) || 1; // Avoid division by zero
  const medianIncome = neighborhoodIncome[neighborhood] || averageMedianIncome;
  const score =
    (population / numGroceryStores) * (averageMedianIncome / medianIncome);
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
export {
  neighborhoodPopulations,
  neighborhoodNumGroceryStores,
  neighborhoodIncome,
};
