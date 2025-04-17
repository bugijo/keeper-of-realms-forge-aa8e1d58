
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShopItem from '../components/shop/ShopItem';
import CartDrawer from '../components/shop/CartDrawer';

// Mock data for tests
const mockItem = {
  id: '1',
  name: 'Poção de Cura',
  description: 'Restaura 50 pontos de vida',
  price: 100,
  imageUrl: '/placeholder.svg',
  category: 'potion',
  quantity: 1
};

describe('ShopItem Component', () => {
  it('renders the shop item correctly', () => {
    render(
      <ShopItem 
        item={mockItem}
        onPurchase={() => {}}
      />
    );
    
    expect(screen.getByText('Poção de Cura')).toBeDefined();
    expect(screen.getByText('100 moedas')).toBeDefined();
  });
  
  it('calls onPurchase when add button is clicked', () => {
    const mockAddToCart = vi.fn();
    
    render(
      <ShopItem 
        id={mockItem.id}
        name={mockItem.name}
        description={mockItem.description}
        price={mockItem.price}
        imageUrl={mockItem.imageUrl}
        category={mockItem.category}
        onPurchase={mockAddToCart}
      />
    );
    
    fireEvent.click(screen.getByText('Adicionar ao Carrinho'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem.id);
  });
  
  it('shows item details when clicked', () => {
    render(
      <ShopItem 
        item={mockItem}
        onPurchase={() => {}}
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
      imageUrl: '/placeholder.svg',
      category: 'potion',
      quantity: 2
    },
    {
      id: '2',
      name: 'Espada de Aço',
      description: '+5 de Dano',
      price: 250,
      imageUrl: '/placeholder.svg',
      category: 'weapon',
      quantity: 1
    }
  ];
  
  it('renders cart items correctly', () => {
    render(
      <CartDrawer 
        items={mockCartItems}
        onRemove={() => {}}
        onUpdateQuantity={() => {}}
        onCheckout={() => {}}
        onClear={() => {}}
      />
    );
    
    expect(screen.getByText('Poção de Cura')).toBeDefined();
    expect(screen.getByText('Espada de Aço')).toBeDefined();
    expect(screen.getByText('Total: 450 moedas')).toBeDefined();
  });
  
  it('calls onRemove when remove button is clicked', () => {
    const mockRemoveItem = vi.fn();
    
    render(
      <CartDrawer 
        items={mockCartItems}
        onRemove={mockRemoveItem}
        onUpdateQuantity={() => {}}
        onCheckout={() => {}}
        onClear={() => {}}
      />
    );
    
    const removeButtons = screen.getAllByText('Remover');
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });
});
