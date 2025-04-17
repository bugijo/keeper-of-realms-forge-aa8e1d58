
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Character from "@/pages/Character";
import CharacterView from "@/pages/CharacterView";
import Inventory from "@/pages/Inventory";
import Shop from "@/pages/Shop";
import Tables from "@/pages/Tables";
import Creations from "@/pages/Creations";
import CreationRouter from "@/pages/CreationRouter";
import ItemsView from "@/pages/ItemsView";
import MapsView from "@/pages/MapsView";
import MonstersView from "@/pages/MonstersView";
import NpcsView from "@/pages/NpcsView";
import StoriesView from "@/pages/StoriesView";
import GameMasterView from "@/pages/GameMasterView";
import PlayerView from "@/pages/PlayerView";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CombatSystem from '@/pages/CombatSystem';
import TacticalCombat from '@/pages/TacticalCombat';
import CharactersCollection from '@/pages/CharactersCollection';
import CreationsCollection from '@/pages/CreationsCollection';
import { MobileNavigation } from "@/components/mobile/MobileNavigation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute children={undefined} />}>
          <Route path="/character" element={<CharactersCollection />} />
          <Route path="/character/view/:id" element={<CharacterView />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/combat" element={<CombatSystem />} />
          <Route path="/tactical-combat" element={<TacticalCombat />} />
          <Route path="/tables" element={<Tables />} />
          
          {/* Creation routes */}
          <Route path="/creations" element={<Creations />} />
          <Route path="/creations/*" element={<CreationRouter />} />
          
          {/* Collections routes */}
          <Route path="/maps" element={<CreationsCollection />} />
          <Route path="/stories" element={<CreationsCollection />} />
          <Route path="/items" element={<CreationsCollection />} />
          <Route path="/monsters" element={<CreationsCollection />} />
          <Route path="/npcs" element={<CreationsCollection />} />
          
          {/* View routes */}
          <Route path="/items/view/:id" element={<ItemsView />} />
          <Route path="/maps/view/:id" element={<MapsView />} />
          <Route path="/monsters/view/:id" element={<MonstersView />} />
          <Route path="/npcs/view/:id" element={<NpcsView />} />
          <Route path="/stories/view/:id" element={<StoriesView />} />
          
          {/* Table routes */}
          <Route path="/table/gm/:id" element={<GameMasterView />} />
          <Route path="/table/player/:id" element={<PlayerView />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNavigation />
    </Router>
  );
}

export default App;
