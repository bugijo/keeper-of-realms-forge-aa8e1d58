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
import ItemsView from "@/pages/items/ItemsView";
import MapsView from "@/pages/maps/MapsView";
import MonstersView from "@/pages/monsters/MonstersView";
import NpcsView from "@/pages/npcs/NpcsView";
import StoriesView from "@/pages/stories/StoriesView";
import GameMasterView from "@/pages/GameMasterView";
import PlayerView from "@/pages/PlayerView";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CombatSystem from '@/pages/CombatSystem';
import TacticalCombat from '@/pages/TacticalCombat';
import CharactersCollection from '@/pages/CharactersCollection';
import CreationsCollection from '@/pages/CreationsCollection';
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import Missions from "@/pages/Missions";
import TableDetailsView from "@/pages/table/TableDetailsView";
import NpcDetailsView from "@/pages/NpcsView"; // Import for NPC details view

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Missions />} />
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
          <Route path="/maps" element={<MapsView />} />
          <Route path="/stories" element={<StoriesView />} />
          <Route path="/items" element={<ItemsView />} />
          <Route path="/monsters" element={<MonstersView />} />
          <Route path="/npcs" element={<NpcsView />} />
          
          {/* View routes */}
          <Route path="/items/view/:id" element={<ItemsView />} />
          <Route path="/maps/view/:id" element={<MapsView />} />
          <Route path="/monsters/view/:id" element={<MonstersView />} />
          <Route path="/npcs/view/:id" element={<NpcDetailsView />} />
          <Route path="/stories/view/:id" element={<StoriesView />} />
          
          {/* Table routes */}
          <Route path="/table/gm/:id" element={<GameMasterView />} />
          <Route path="/table/player/:id" element={<PlayerView />} />
          <Route path="/tables/details/:id" element={<TableDetailsView />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNavigation />
    </Router>
  );
}

export default App;
