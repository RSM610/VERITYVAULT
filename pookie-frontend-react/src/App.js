import Home from './components/home/Home';
import Login from './components/home/Login';
import ScannerPage from './components/pages/ScannerPage';
import Admin from './components/pages/Admin';
import Issuer from './components/pages/Issuer';
import Verifier from './components/pages/Verifier';
import User from './components/pages/User';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import AddAccount from './components/pages/AddAccount';
import ManageAccount from './components/pages/ManageAccount';
import AddProduct from './components/pages/AddProduct';
import Profile from './components/pages/Profile';
import UpdateProduct from './components/pages/UpdateProduct';
import Product from './components/pages/Product';
import AuthenticProduct from './components/pages/AuthenticProduct';
import FakeProduct from './components/pages/FakeProduct';
import UpdateProductDetails from './components/pages/UpdateProductDetails';

function App() {

  return (
      <Routes>
        <Route path='/' element={<Layout />}>

          {/* public routes */}
          <Route exact path='/' element={< Home />}></Route>
          <Route exact path='/login' element={< Login />}></Route>
          <Route exact path='/scanner' element={< ScannerPage />}></Route>
          <Route exact path='/product' element={< Product />}></Route>
          <Route exact path='/authentic-product' element={< AuthenticProduct />}></Route>
          <Route exact path='/fake-product' element={< FakeProduct />}></Route>

          {/* private routes */}
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route exact path='/admin' element={< Admin />}></Route>
            <Route exact path='/add-account' element={< AddAccount />}></Route>
            <Route exact path='/manage-account' element={< ManageAccount />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["issuer", "verifier", "user"]} />}>
            <Route exact path='/profile' element={< Profile />}></Route>
            <Route exact path='/update-product' element={< UpdateProduct />}></Route>
            <Route exact path='/update-product-details' element={< UpdateProductDetails />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["verifier", "user"]} />}>
            <Route exact path='/update-product' element={< UpdateProduct />}></Route>
            <Route exact path='/update-product-details' element={< UpdateProductDetails />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["issuer"]} />}>
            <Route exact path='/issuer' element={< Issuer />}></Route>
            <Route exact path='/add-product' element={< AddProduct />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["verifier"]} />}>
            <Route exact path='/verifier' element={< Verifier />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["user"]} />}>
            <Route exact path='/user' element={< User />}></Route>
          </Route>

          {/* catch all */}
          {/* <Route path='*' element={< Missing />}></Route> */}

        </Route>
      </Routes>

  );
}


export default App;