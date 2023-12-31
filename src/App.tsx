import { useState, useEffect, useRef } from 'react';
import jwtDecode from "jwt-decode";
import { RouterProvider } from 'react-router';
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route
} from "react-router-dom";
import Root from './pages/Root';
import AuthContainer from './pages/AuthContainer';
import Login from './components/Login';
import Register from './components/Register';
import AuthContext, { AuthContextData } from './contexts/AuthContext';
import { KEY_LOCAL_STORAGE } from './utils/Contantes';
import { LocalStorageTokenType } from './hooks/useAuth';
import TokenDataType from './types/TokenDataType';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Genres from './pages/Genres';
import GenresSave from './pages/GenresSave';
import GenresEdit from './pages/GenresEdit/GenresEdit';
import PrivateRoutes from './pages/PrivateRoutes';
import AdminContainer from './pages/AdminContainer';
import AdminMovies from './pages/AdminMovies';
import MoviesSave from './pages/MoviesSave';
import Movies from './pages/Movies';
import Movie from './pages/Movie';
import MovieEdit from './pages/MovieEdit';
import Users from './pages/Users';
import Profile from './pages/Profile';
import UsersEdit from './pages/UsersEdit';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={ <Root /> } errorElement={ <ErrorPage /> } >
      <Route index element={ <Home /> } />
      <Route >
        <Route path='profile' element={ <Profile /> } />
      </Route>
      <Route element={ <PrivateRoutes roles={['admin', 'worker']} /> } >
        <Route path="admin" element={ <AdminContainer /> }>
          <Route path="genres" element={ <Genres /> } />
          <Route path="movies" element={ <AdminMovies /> } />
          <Route path="users" element={ <Users /> } />
        </Route>
        <Route path="genres/save" element={ <GenresSave /> } />
        <Route path='genres/edit/:id' element={ <GenresEdit /> } />
        <Route path="movies/save" element={ <MoviesSave /> } />
        <Route path="movies/edit/:id" element={ <MovieEdit /> } />
        <Route path='users/edit/:id' element={ <UsersEdit /> } />
      </Route>
      <Route element={ <PrivateRoutes /> }>
        <Route path='movies/:id' element={ <Movie /> } />
      </Route>
      <Route path="auth" element={ <AuthContainer /> } >
        <Route path="login" element={ <Login /> } />
        <Route path="register" element={ <Register /> } />
      </Route>
      <Route path='movies' element={ <Movies /> } />
    </Route>
  )
)

const App = () => {
  const [authContextData, setAuthContextData] = useState<AuthContextData>({});
  const [isReady, setIsReady] = useState<boolean>(false);
  const refVerifyToken = useRef<boolean>(false);

  useEffect(() => {
    if(refVerifyToken.current === false) {
      const localStorageData = localStorage.getItem(KEY_LOCAL_STORAGE);
      if(localStorageData) {
        const localStorageObj = JSON.parse(localStorageData) as LocalStorageTokenType;
        try {
          const token = localStorageObj.token;
          const tokenData = jwtDecode(token) as  TokenDataType;
          setAuthContextData({
            tokenData,
            token
          })
        }
        catch(e) {}
      }
      setIsReady(true);
    }
  }, [])

  if(isReady) {
    return (
      <AuthContext.Provider value={{
        authContextData,
        setAuthContextData
      }}>
        <RouterProvider router={router} />
        <ToastContainer
          theme='dark'
          position='bottom-right'
          autoClose={3000}
        />
      </AuthContext.Provider>
    );
  }
  else {
    return  <></>
  }

}

export default App
