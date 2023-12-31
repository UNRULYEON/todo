import { SignIn, SignUp } from '@clerk/clerk-react';
import { Route, Routes } from 'react-router-dom';
import { Guard } from '@/components';
import { RootPage, SettingsPage } from '@/pages';
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
        <Route path="/" element={<RootPage />} />
        <Route path="/inbox" element={<div>hello inbox</div>} />
        <Route path="/backlog" element={<div>hello backlog</div>} />
        <Route path="/archive" element={<div>hello archive</div>} />
        <Route path="/settings/*" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
