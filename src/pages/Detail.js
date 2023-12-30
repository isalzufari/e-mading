import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import api from '../utils/api';

const Detail = () => {
  const location = useLocation();
  const namePlace = location.pathname.split('/');
  const slug = namePlace[1];

  console.log(slug)

  const [isLoad, setIsLoad] = useState(true);
  const [article, setArticle] = useState(true);

  useEffect(() => {
    onSpotBySlug(slug);
  }, [slug]);

  const onSpotBySlug = async (slug) => {
    const data = await api.getArticleBySlug({ slug });
    setArticle(data);
    setIsLoad(false);
  }

  return (
    <div className='row'>
      <div className="col">
        <img style={{ width: '-webkit-fill-available', objectFit: 'cover' }} className='img-fluid rounded shadow' src={article.image} alt={article.title} />
      </div>
      <div className="col">
        <h5>{article.title}</h5>
        <p>{article.description}</p>
      </div>
    </div>
  )
}

export default Detail