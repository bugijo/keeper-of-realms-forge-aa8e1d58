
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile.css' // Add mobile styles
import { AuthProvider } from '@/contexts/SupabaseAuthContext'
import { Toaster } from 'sonner'

// Ensure the DOM is ready before rendering
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <AuthProvider>
      <App />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
