
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
import Home from './pages/Home';

function App() {
  const { session } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<MainLayout><h1>Cadastro</h1></MainLayout>} />
        <Route path="/signin" element={<MainLayout><h1>Login</h1></MainLayout>} />
        
        {/* Rota protegida por autenticação usando o componente de proteção */}
        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          }
        />
        
        {/* Rotas de GM específicas usando o componente de proteção com verificação de GM */}
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
          element={
            <ProtectedRoute>
              <TablePlayerView />
            </ProtectedRoute>
          }
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
          element={
            <ProtectedRoute>
              <LiveSession />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/combat"
          element={
            <ProtectedRoute>
              <TacticalCombat />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/character/:id"
          element={
            <ProtectedRoute>
              <MainLayout><h1>Ficha de Personagem</h1></MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;
