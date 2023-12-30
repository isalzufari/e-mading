import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { registerAction } from '../../utils/action';


const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = ({ target }) => {
    setName(target.value);
  }

  const handleEmailChange = ({ target }) => {
    setEmail(target.value);
  }

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value);
  }

  const onRegister = async ({ name, email, password }) => {
    const { status } = await registerAction({ name, email, password });
    if (status === 'success') {
      return navigate('/admin/login');
    }
  }

  return (
    <div style={{ maxWidth: 330, padding: 15 }} className='m-auto w-100'>
      <form className='text-center'>
        <h1 class="h4 mb-3 fw-normal">daftar</h1>

        <div class="form-floating mb-3">
          <input value={name} onChange={handleNameChange} type="text" class="form-control" id="floatingInput" placeholder="name@example.com" />
          <label for="floatingInput">name</label>
        </div>

        <div class="form-floating mb-3">
          <input value={email} onChange={handleEmailChange} type="email" class="form-control" id="floatingInput" placeholder="name@example.com" />
          <label for="floatingInput">email</label>
        </div>

        <div class="form-floating mb-3">
          <input value={password} onChange={handlePasswordChange} type="password" class="form-control" id="floatingPassword" placeholder="password" />
          <label for="floatingPassword">password</label>
        </div>

        <button onClick={() => onRegister({ name, email, password })} class="w-100 btn btn btn-primary" type="button">daftar</button>
        <p className='mt-3'>sudah punya akun? <Link to="/admin/login">masuk</Link></p>
      </form>
    </div>
  )
}

export default Register;