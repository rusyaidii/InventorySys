import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import PrivateRoute from './components/PrivateRoute.jsx';
import HomeScreens from './screens/HomeScreens.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import CreateProductScreen from './screens/CreateProductScreen.jsx';
import ViewProductScreen from './screens/ViewProductScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} path='/' element={<HomeScreens/>}/>
      <Route path='/admin' element={<LoginScreen/>}/>
      {/* Private Routes */}
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/new-product' element={<CreateProductScreen/>}/>
        <Route path='/view-product/:id' element={<ViewProductScreen/>}/>
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>,
)
