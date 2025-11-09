import { useState, useEffect } from 'react';
import { getCategories, getQuestions, resetToken } from './api/triviaApi';
import { DifficultyChart, CategoryChart } from './components/Charts';
import CategoryList from './components/CategoryList';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      const [categoriesData, questionsData] = await Promise.all([
        getCategories(),
        getQuestions(50)
      ]);
      
      setCategories(categoriesData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load data. Please refresh the page.');
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchData();
      setLoading(false);
    };
    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setSelectedCategory(null);
    await resetToken();
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const filteredQuestions = selectedCategory
    ? questions.filter(q => q.category === selectedCategory)
    : questions;

  return (
    <div className="App">
      <header>
        <div className='header'>
          <h1>Trivia Questions Visualizer</h1>
          <p>Total Questions: {questions.length}</p>
        </div>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Loading...' : 'Get New Sample'}
        </button>
      </header>

      <div className="main-container">
        <CategoryList
          categories={categories}
          questions={questions}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className={`charts-area`}>
          {selectedCategory && (
            <div className="filter-info">
              Showing: <strong>{selectedCategory}</strong> ({filteredQuestions.length} questions)
            </div>
          )}
          
          {!selectedCategory && (
            <CategoryChart questions={filteredQuestions} categories={categories} />
          )}
          <DifficultyChart questions={filteredQuestions} />
        </div>
      </div>
    </div>
  );
}

export default App;