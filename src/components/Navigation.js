import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ authUser, onSignOut }) => {
  const location = useLocation();
  const namePlace = location.pathname.split('/');
  const slug = namePlace[1];

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm">
      <div className="container p-2">
        <Link className="navbar-brand" to='/'></Link>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className={`nav-link ${slug === '' && 'active'}`} aria-current="page" to="/">beranda</Link>
          </li>
        </ul>

        {slug === 'admin' &&
          <>
            {!authUser ? <div className="text-end">
              <Link to="admin/login" type="button" className="btn btn-primary">sign-in</Link>
            </div> :
              <>
                <div className="flex-shrink-0 dropdown">
                  <a href="#/" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span>{authUser.name}</span>
                  </a>
                  <ul className="dropdown-menu text-small shadow">
                    <li><a onClick={onSignOut} className="dropdown-item" href="#/">Sign out</a></li>
                  </ul>
                </div>
                {/* <button onClick={signOut} className='btn btn-outline-primary'><i class="bi bi-box-arrow-right"></i></button> */}
              </>
            }
          </>
        }
      </div>
    </nav>
  )
}

export default Navigation