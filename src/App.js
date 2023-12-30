import { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Component
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Page
import Main from './pages/Main';
import Detail from './pages/Detail';

// Admin Page
import Index from './pages/admin/Index';
import AddArticle from './pages/admin/AddArticle';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';

import { logoutAction } from './utils/action';
import api from './utils/api';

const AppLayout = () => (
  <>
    <div className="container mt-5">
      <Outlet />
    </div>
  </>
)

function App() {
  const [authUser, setauthUser] = useState(null);

  useEffect(() => {
    const asyncPreloadProcess = async () => {
      const authUser = await api.getOwnProfile();
      if (authUser.status !== 'success') {
        if (authUser.error === "Unauthorized" && authUser.message === "Token maximum age exceeded") {
          if (window.confirm('Sesi kamu udah habis. Perpanjang sesi?')) {
            await api.refreshToken();
            const userRefresh = await api.getOwnProfile();
            setauthUser(userRefresh.data)
          } else {
            return onSignOut();
          };
        }
      } else {
        setauthUser(authUser.data);
      }
    }
    asyncPreloadProcess();
  }, []);

  const onSignOut = () => {
    setauthUser(null);
    logoutAction();
  }

  return (
    <>
      <header>
        <Navigation authUser={authUser} onSignOut={onSignOut} />
      </header>
      <main>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Main />} />
            <Route path=':slug' element={<Detail />} />
          </Route>

          <Route path='/admin' element={<AppLayout />}>

            <Route index element={<Index />} />

            <Route path='login' element={<Login setauthUser={setauthUser} />} />
            <Route path='register' element={<Register />} />

            <Route path='add' element={<AddArticle />} />
          </Route>
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
