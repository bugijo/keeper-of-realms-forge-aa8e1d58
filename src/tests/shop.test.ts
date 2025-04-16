
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShopItem } from '../components/shop/ShopItem';
import { CartDrawer } from '../components/shop/CartDrawer';

// Mock data for tests
const mockItem = {
  id: '1',
  name: 'Poção de Cura',
  description: 'Restaura 50 pontos de vida',
  price: 100,
  image: '/placeholder.svg',
  category: 'potion',
  quantity: 1
};

describe('ShopItem Component', () => {
  it('renders the shop item correctly', () => {
    render(
      <ShopItem 
        item={mockItem}
        onAddToCart={() => {}}
      />
    );
    
    expect(screen.getByText('Poção de Cura')).toBeDefined();
    expect(screen.getByText('100 moedas')).toBeDefined();
  });
  
  it('calls onAddToCart when add button is clicked', () => {
    const mockAddToCart = vi.fn();
    
    render(
      <ShopItem 
        item={mockItem}
        onAddToCart={mockAddToCart}
      />
    );
    
    fireEvent.click(screen.getByText('Adicionar ao Carrinho'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem);
  });
  
  it('shows item details when clicked', () => {
    render(
      <ShopItem 
        item={mockItem}
        onAddToCart={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Poção de Cura'));
    expect(screen.getByText('Restaura 50 pontos de vida')).toBeDefined();
  });
});

describe('CartDrawer Component', () => {
  const mockCartItems = [
    {
      id: '1',
      name: 'Poção de Cura',
      description: 'Restaura 50 pontos de vida',
      price: 100,
      image: '/placeholder.svg',
      category: 'potion',
      quantity: 2
    },
    {
      id: '2',
      name: 'Espada de Aço',
      description: '+5 de Dano',
      price: 250,
      image: '/placeholder.svg',
      category: 'weapon',
      quantity: 1
    }
  ];
  
  it('renders cart items correctly', () => {
    render(
      <CartDrawer 
        isOpen={true}
        onClose={() => {}}
        items={mockCartItems}
        onRemoveItem={() => {}}
        onCheckout={() => {}}
      />
    );
    
    expect(screen.getByText('Poção de Cura')).toBeDefined();
    expect(screen.getByText('Espada de Aço')).toBeDefined();
    expect(screen.getByText('Total: 450 moedas')).toBeDefined();
  });
  
  it('calls onRemoveItem when remove button is clicked', () => {
    const mockRemoveItem = vi.fn();
    
    render(
      <CartDrawer 
        isOpen={true}
        onClose={() => {}}
        items={mockCartItems}
        onRemoveItem={mockRemoveItem}
        onCheckout={() => {}}
      />
    );
    
    const removeButtons = screen.getAllByText('Remover');
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });
});
