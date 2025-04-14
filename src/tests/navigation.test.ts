
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Navbar } from '@/components/layout/Navbar';

// Mock useLocation hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn()
  };
});

describe('Navigation', () => {
  beforeEach(() => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    });
  });

  it('renders navigation elements', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Verifica se os elementos de navegação estão presentes
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
