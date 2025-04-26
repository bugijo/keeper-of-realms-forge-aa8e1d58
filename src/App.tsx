
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuth } from './contexts/SupabaseAuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import Tables from './pages/Tables';
import GameMasterView from './pages/GameMasterView';
import TablePlayerView from './pages/table/PlayerView';
import GameMasterTable from './pages/table/GameMasterView';
import LiveSession from './pages/LiveSession';
import TacticalCombat from './pages/TacticalCombat';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  const { session } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout><h1>RPG Companion</h1></MainLayout>} />
        <Route path="/signup" element={<MainLayout><h1>Cadastro</h1></MainLayout>} />
        <Route path="/signin" element={<MainLayout><h1>Login</h1></MainLayout>} />
        <Route
          path="/tables"
          element={session ? <Tables /> : <Navigate to="/signin" />}
        />
        <Route
          path="/gm/:id"
          element={
            <ProtectedRoute requireGM={true} tableIdParam="id">
              <GameMasterView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/table/:id"
          element={session ? <TablePlayerView /> : <Navigate to="/signin" />}
        />
        <Route
          path="/gm/table/:id"
          element={
            <ProtectedRoute requireGM={true} tableIdParam="id">
              <GameMasterTable />
            </ProtectedRoute>
          }
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
          element={session ? <MainLayout><h1>Ficha de Personagem</h1></MainLayout> : <Navigate to="/signin" />}
        />
        
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;
