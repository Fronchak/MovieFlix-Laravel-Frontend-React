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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={ <Root /> }
    >
      <Route
        path="auth"
        element={ <AuthContainer /> }
      >
        <Route
          path="login"
          element={ <Login /> }
        />
        <Route
          path="register"
          element={ <Register /> }
        />
      </Route>
    </Route>
  )
)

const App = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App
