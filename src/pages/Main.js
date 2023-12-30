import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Main = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticlesHandler();
    return () => {
    };
  }, []);

  const getArticlesHandler = async () => {
    const data = await api.getArticles();
    setArticles(data);
  }

  return (
    <div class="card-group">
      {articles.map((article, key) => (
        <div key={key} class="card" style={{ width: 18 + 'rem' }}>
          <Link to={`/${article.slug}`} className='text-decoration-none text-dark'>
            <img src={article.image} class="card-img-top" alt={article.title} />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Main