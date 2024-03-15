import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux'

const PrivateRoute = () => {
    const storedRole = localStorage.getItem('isAdmin');
    return storedRole ? <Outlet/> : <Navigate to='/admin' replace/>
}

export default PrivateRoute;