
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
import CharacterCreation from './pages/creations/CharacterCreation';
import MapCreation from './pages/creations/MapCreation';
import StoryCreation from './pages/creations/StoryCreation';
import MonsterCreation from './pages/creations/MonsterCreation';
import NpcCreation from './pages/creations/NpcCreation';
import NotFound from './pages/NotFound';
import TableDetailsView from './pages/table/TableDetailsView';
import TableCreate from './pages/table/TableCreate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tables routes */}
        <Route path="/tables" element={<Tables />} />
        <Route path="/table/create" element={<TableCreate />} />
        <Route path="/table/:id" element={<TableDetailsView />} />
        <Route path="/table/player/:id" element={<PlayerView />} />
        <Route path="/table/gm/:id" element={<GMView />} />
        <Route path="/gm/:id" element={<GMView />} /> {/* Alternative GM route */}
        <Route path="/table/live/:id" element={<LiveSession />} />
        <Route path="/session/:id" element={<LiveSession />} /> {/* Alternative session route */}
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
        
        {/* Creations main page */}
        <Route path="/creations" element={<Creations />} />
        
        {/* Individual creation routes */}
        <Route path="/creations/characters" element={<CharacterCreation />} />
        <Route path="/creations/characters/:id" element={<CharacterCreation />} />
        <Route path="/creations/maps" element={<MapCreation />} />
        <Route path="/creations/maps/:id" element={<MapCreation />} />
        <Route path="/creations/stories" element={<StoryCreation />} />
        <Route path="/creations/stories/:id" element={<StoryCreation />} />
        <Route path="/creations/items" element={<ItemCreation />} />
        <Route path="/creations/items/:id" element={<ItemCreation />} />
        <Route path="/creations/monsters" element={<MonsterCreation />} />
        <Route path="/creations/monsters/:id" element={<MonsterCreation />} />
        <Route path="/creations/npcs" element={<NpcCreation />} />
        <Route path="/creations/npcs/:id" element={<NpcCreation />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
