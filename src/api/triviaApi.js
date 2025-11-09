// src/api/triviaApi.js

import { decodeHTML } from '../utils/decodeHTML';

const BASE_URL = 'https://opentdb.com';
const CACHE_KEY = 'trivia_cache';
const TOKEN_KEY = 'trivia_token';
const CACHE_DURATION = 10 * 60 * 1000; // 10 分鐘

const getCache = () => {
  const cache = localStorage.getItem(CACHE_KEY);
  if (!cache) return null;
  
  const { data, timestamp } = JSON.parse(cache);
  const isExpired = Date.now() - timestamp > CACHE_DURATION;
  
  return isExpired ? null : data;
};

const setCache = (data) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};

const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const decodeQuestion = (question) => ({
  ...question,
  category: decodeHTML(question.category),
  question: decodeHTML(question.question),
  correct_answer: decodeHTML(question.correct_answer),
  incorrect_answers: question.incorrect_answers.map(decodeHTML)
});

export const initToken = async () => {
  let token = getToken();
  
  if (!token) {
    const response = await fetch(`${BASE_URL}/api_token.php?command=request`);
    const data = await response.json();
    token = data.token;
    setToken(token);
  }
  
  return token;
};

// get new sample questions
export const resetToken = async () => {
  const token = getToken();
  
  if (token) {
    await fetch(`${BASE_URL}/api_token.php?command=reset&token=${token}`);
  }
  
  clearCache();
  return initToken();
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/api_category.php`);
  const data = await response.json();
  return data.trivia_categories;
};

export const getQuestions = async (amount = 50, category = null) => {
  const cached = getCache();
  if (cached) {
    console.log('Using cached data');
    return cached;
  }
  
  const token = await initToken();
  
  let url = `${BASE_URL}/api.php?amount=${amount}&token=${token}`;
  if (category) {
    url += `&category=${category}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Token exhausted, requesting a new one
  if (data.response_code === 4) {
    console.warn()
    await resetToken('Token expired, resetting...');
    return getQuestions(amount, category);
  }
  
  if (data.response_code !== 0) {
    throw new Error(`API Error: ${data.response_code}`);
  }
  
  const results = (data.results || []).map(decodeQuestion);
  
  setCache(results);
  
  return results;
};