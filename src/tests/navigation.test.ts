
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the auth context
jest.mock('../contexts/SupabaseAuthContext', () => ({
  useAuth: () => ({
    currentUser: { id: 'test-user-id' },
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Navigation Tests', () => {
  test('Footer tabs navigate correctly', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Find and click the character tab
    const characterTab = screen.getByText(/character/i);
    fireEvent.click(characterTab);
    
    // Verify we navigated to the character page
    expect(screen.getByText(/character stats/i)).toBeInTheDocument();
    
    // Find and click the inventory tab
    const inventoryTab = screen.getByText(/inventory/i);
    fireEvent.click(inventoryTab);
    
    // Verify we navigated to the inventory page
    expect(screen.getByText(/inventory items/i)).toBeInTheDocument();
  });
});
