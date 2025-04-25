import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import Account from './pages/Account';
import Tables from './pages/Tables';
import TableCreation from './pages/TableCreation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Character from './pages/Character';
import CharacterCreation from './pages/CharacterCreation';
import CharacterView from './pages/CharacterView';
import ItemsView from './pages/items/ItemsView';
import ItemCreation from './pages/creations/ItemCreation';
import ItemsViewOld from './pages/ItemsView';
import PlayerView from './pages/PlayerView';
import GMView from './pages/GMView';
import LiveSession from './pages/LiveSession';
import PreSessionScreen from './components/game/PreSessionScreen';
import MapsView from './pages/MapsView';
import MonstersView from './pages/MonstersView';
import NpcsView from './pages/NpcsView';
import StoriesView from './pages/StoriesView';
import ItemView from './pages/items/ItemView';

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />

          {/* Tables routes */}
          <Route path="/tables" element={<Tables />} />
          <Route path="/tables/create" element={<TableCreation />} />
          <Route path="/table/player/:id" element={<PlayerView />} />
          <Route path="/table/gm/:id" element={<GMView />} />
          <Route path="/table/live/:id" element={<LiveSession />} />
          <Route path="/table/pre-session/:id" element={<PreSessionScreen />} />

          {/* Game entities routes */}
          <Route path="/maps" element={<MapsView />} />
          <Route path="/monsters" element={<MonstersView />} />
          <Route path="/npcs" element={<NpcsView />} />
          <Route path="/stories" element={<StoriesView />} />

          {/* Character routes */}
          <Route path="/character" element={<Character />} />
          <Route path="/character/create" element={<CharacterCreation />} />
          <Route path="/character/:id" element={<CharacterView />} />

          {/* Items routes */}
          <Route path="/items" element={<ItemsView />} />
          <Route path="/items/view" element={<ItemsView />} />
          <Route path="/items/view/:id" element={<ItemView />} />
          <Route path="/creations/items" element={<ItemCreation />} />
          <Route path="/creations/items/:id" element={<ItemCreation />} />
        </Routes>
      </Router>
    </SupabaseAuthProvider>
  );
}

export default App;
