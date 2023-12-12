import {
  RedirectToSignIn,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react';
import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';

const Guard = () => (
  <>
    <SignedIn>
      <Outlet />
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

const App = () => {
  return (
    <Routes>
      <Route
        path="/sign-in/*"
        element={<SignIn routing="path" path="/sign-in" />}
      />
      <Route
        path="/sign-up/*"
        element={<SignUp routing="path" path="/sign-up" />}
      />
      <Route path="/" element={<Guard />}>
        <Route path="/" element={<div>hello world</div>} />
      </Route>
    </Routes>
  );
};

export default App;
