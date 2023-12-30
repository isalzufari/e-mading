import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toBase64 } from '../../utils';
import api from '../../utils/api';

const AddArticle = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleTitleChange = ({ target }) => {
    setTitle(target.value);
  }

  const handleDescriptionChange = ({ target }) => {
    setDescription(target.value);
  }

  const onHandleFileEvent = async (e) => {
    if (!e.target.files[0]) return;
    if (e.target.files[0].size > 1048576) {
      alert("File is to big");
      return;
    }
    const file = e.target.files[0];
    const base64Image = await toBase64(file);
    setImage(base64Image);
  }

  const onAddArticle = async ({ title, description, image }) => {
    const { status } = await api.addArticle({ title, description, image });
    if (status === 'success') {
      return navigate('/admin');
    }
  }

  return (
    <div class="card">
      <div class="card-body">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
          <Link to="/admin" class="btn btn-outline-primary" type="button">{`<`}</Link>
        </div>
        <div className='row'>
          <div className="col">
            <div class="mb-3">
              <input onChange={(e) => onHandleFileEvent(e)} class="form-control" type="file" accept='image/png, image/jpeg' id="formFile" />
            </div>
            <div className="mb-3">
              <img style={{ width: '-webkit-fill-available', objectFit: 'cover' }} className='img-fluid rounded shadow' src={image} alt={title} />
            </div>
          </div>
          <div className="col">
            <div class="form-floating mb-3">
              <input onChange={handleTitleChange} value={title} type="email" class="form-control" id="floatingInput" placeholder="title" />
              <label for="floatingInput">Judul</label>
            </div>
            <div class="form-floating">
              <textarea onChange={handleDescriptionChange} value={description} class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: 300 }}></textarea>
              <label for="floatingTextarea2">Deskripsi</label>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2 mt-3">
          <button onClick={() => onAddArticle({ title, description, image })} class="btn btn-outline-primary" type="button">{`+`}</button>
        </div>
      </div>
    </div>
  )
}

export default AddArticle