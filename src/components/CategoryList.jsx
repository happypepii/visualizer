function CategoryList({ questions, selectedCategory, onSelectCategory }) {
  // count number of questions in each category
  const categoryCounts = questions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => 
    a[0].localeCompare(b[0])
  );


  return (
    <div className="category-list">
      <h2>Categories</h2>
      
      <button 
        className={`category-item ${selectedCategory === null ? 'active' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        <span className="category-name">All Categories</span>
        <span className="category-count">{questions.length}</span>
      </button>

      {sortedCategories.map(([category, count]) => (
          <button
            key={category}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            <span className="category-name">{category}</span>
            <span className="category-count">{count}</span>
          </button>
        ))}
    </div>
  );
}

export default CategoryList;