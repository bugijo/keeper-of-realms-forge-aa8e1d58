
import { describe, test, expect } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FooterTabs } from '@/components/rpg/FooterTabs';

describe('Footer Navigation', () => {
  test('Troca de abas animada', async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <FooterTabs />
      </BrowserRouter>
    );
    
    fireEvent.click(getByTestId('quests-tab'));
    await waitFor(() => {
      expect(getByTestId('quests-screen')).toBeVisible();
    });
  });
});
