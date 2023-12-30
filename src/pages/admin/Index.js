import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Index = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticlesByIdHandler();
    return () => {
    };
  }, []);

  const getArticlesByIdHandler = async () => {
    const data = await api.getArticleById();
    setArticles(data);
    console.log(data);
  }

  const handleDraftUpdate = async ({ idArticle, isDraft }) => {
    const { status } = await api.updateDraft({ idArticle, isDraft });
    if (status === 'success') {
      const updatedArticle = articles.map(x => (x.id_article === idArticle ? { ...x, isDraft: isDraft === 0 ? 1 : 0 } : x));
      setArticles(updatedArticle);
      return navigate('/admin');
    }
  }

  return (
    <div class="card">
      <div class="card-body">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
          <Link to="add" class="btn btn-outline-primary" type="button">+</Link>
        </div>
        <div className="row">
          {articles.map((article, key) => (
            <div className="col-6">
              <div key={key} class="card">
                <Link to={`/${article.slug}`} className='text-decoration-none text-dark'>
                  <img src={article.image} class="card-img-top" alt={article.title} />
                </Link>
                <div class="card-footer">
                  <div class="d-flex justify-content-between">
                    <button onClick={() => handleDraftUpdate({ idArticle: article.id_article, isDraft: article.isDraft })} className={`btn btn-${article.isDraft === 1 ? 'success' : 'secondary'}`}>{article.isDraft === 1 ? 'Publish' : 'Draft'}</button>
                    <small class="text-body-secondary">Last updated 3 mins ago</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}

export default Index