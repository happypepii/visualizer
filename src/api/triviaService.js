// https://opentdb.com/api_config.php
const BASE_URL = 'https://opentdb.com';

// Category Lookup: Returns the entire list of categories and ids in the database.
export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/api_category.php`);
  const data = await response.json();
  return data.trivia_categories;
};

// Fetch 50 questions from triviaDB
export const fetchQuestions = async (amount = 50, category = null) => {
  let url = `${BASE_URL}/api.php?amount=${amount}`;
  if (category) {
    url += `&category=${category}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};