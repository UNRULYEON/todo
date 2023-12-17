import { SignIn, SignUp } from '@clerk/clerk-react';
import { Route, Routes } from 'react-router-dom';
import { Guard } from '@/components';
import './App.css';

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
        <Route path="/inbox" element={<div>hello inbox</div>} />
        <Route path="/backlog" element={<div>hello backlog</div>} />
        <Route path="/archive" element={<div>hello archive</div>} />
        <Route path="/settings" element={<div>hello settings</div>} />
      </Route>
    </Routes>
  );
};

export default App;
