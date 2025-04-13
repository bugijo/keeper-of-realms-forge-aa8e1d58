
// Using vitest instead of playwright for this test
import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MobileNavigation } from '../components/mobile/MobileNavigation';

// Mock useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/'
    })
  };
});

test('navigation elements render properly', () => {
  render(
    <BrowserRouter>
      <MobileNavigation />
    </BrowserRouter>
  );
  
  // Check if the navigation contains Missões
  expect(screen.getByText('Missões')).toBeDefined();
  
  // Check if the Inventory tab exists
  expect(screen.getByText('Inventário')).toBeDefined();
  
  // Check if the Creations tab exists
  expect(screen.getByText('Criações')).toBeDefined();
});
