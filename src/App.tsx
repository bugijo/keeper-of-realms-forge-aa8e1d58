
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tables from './pages/Tables';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Character from './pages/Character';
import CharacterView from './pages/CharacterView';
import ItemsView from './pages/items/ItemsView';
import ItemCreation from './pages/creations/ItemCreation';
import ItemsViewOld from './pages/ItemsView';
import PlayerView from './pages/PlayerView';
import GMView from './pages/GameMasterView';
import LiveSession from './pages/LiveSession';
import PreSessionScreen from './components/game/PreSessionScreen';
import MapsView from './pages/MapsView';
import MonstersView from './pages/MonstersView';
import NpcsView from './pages/NpcsView';
import StoriesView from './pages/StoriesView';
import ItemView from './pages/items/ItemView';
import Creations from './pages/Creations';
import Missions from './pages/Missions';
import Inventory from './pages/Inventory';
import Shop from './pages/Shop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tables routes */}
        <Route path="/tables" element={<Tables />} />
        <Route path="/table/player/:id" element={<PlayerView />} />
        <Route path="/table/gm/:id" element={<GMView />} />
        <Route path="/table/live/:id" element={<LiveSession />} />
        <Route path="/table/pre-session/:id" element={<PreSessionScreen tableId="demo" />} />

        {/* Game entities routes */}
        <Route path="/maps" element={<MapsView />} />
        <Route path="/monsters" element={<MonstersView />} />
        <Route path="/npcs" element={<NpcsView />} />
        <Route path="/stories" element={<StoriesView />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/shop" element={<Shop />} />

        {/* Character routes */}
        <Route path="/character" element={<Character />} />
        <Route path="/character/:id" element={<CharacterView />} />

        {/* Items routes */}
        <Route path="/items" element={<ItemsView />} />
        <Route path="/items/view" element={<ItemsView />} />
        <Route path="/items/view/:id" element={<ItemView />} />
        
        {/* Creations routes */}
        <Route path="/creations" element={<Creations />} />
        <Route path="/creations/items" element={<ItemCreation />} />
        <Route path="/creations/items/:id" element={<ItemCreation />} />
      </Routes>
    </Router>
  );
}

export default App;
