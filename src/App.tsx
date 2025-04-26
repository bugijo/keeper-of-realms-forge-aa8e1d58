import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuth } from './contexts/SupabaseAuthContext';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Tables from './pages/Tables';
import GameMasterView from './pages/GameMasterView';
import TablePlayerView from './pages/table/PlayerView';
import GameMasterTable from './pages/table/GameMasterView';
import LiveSession from './pages/LiveSession';
import TacticalCombat from './pages/TacticalCombat';
import CharacterSheetPage from './pages/CharacterSheetPage';

// Importar a página de inventário
import Inventory from './pages/Inventory';

function App() {
  const { session } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/tables"
          element={session ? <Tables /> : <Navigate to="/signin" />}
        />
        <Route
          path="/gm/:id"
          element={session ? <GameMasterView /> : <Navigate to="/signin" />}
        />
        <Route
          path="/table/:id"
          element={session ? <TablePlayerView /> : <Navigate to="/signin" />}
        />
        <Route
          path="/gm/table/:id"
          element={session ? <GameMasterTable /> : <Navigate to="/signin" />}
        />
        <Route
          path="/session/:id"
          element={session ? <LiveSession /> : <Navigate to="/signin" />}
        />
        <Route
          path="/combat"
          element={session ? <TacticalCombat /> : <Navigate to="/signin" />}
        />
        <Route
          path="/character/:id"
          element={session ? <CharacterSheetPage /> : <Navigate to="/signin" />}
        />
        
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;
