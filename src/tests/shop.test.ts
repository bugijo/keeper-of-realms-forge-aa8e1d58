
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
  currency: 'gems',
  quantity: 1
};

describe('ShopItem Component', () => {
  it('renders the shop item correctly', () => {
    render(
      <ShopItem 
        id={mockItem.id}
        name={mockItem.name}
        description={mockItem.description}
        price={mockItem.price}
        imageUrl={mockItem.imageUrl}
        category="theme"
        currency="gems"
        onPurchase={() => {}}
      />
    );
    
    expect(screen.getByText('Poção de Cura')).toBeDefined();
    expect(screen.getByText('100 gemas')).toBeDefined();
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
        category="theme"
        currency="gems"
        onPurchase={mockAddToCart}
      />
    );
    
    fireEvent.click(screen.getByText('Comprar'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem.id);
  });
  
  it('shows item details when clicked', () => {
    render(
      <ShopItem 
        id={mockItem.id}
        name={mockItem.name}
        description={mockItem.description}
        price={mockItem.price}
        imageUrl={mockItem.imageUrl}
        category="theme"
        currency="gems"
        onPurchase={() => {}}
      />
    );
    
    expect(screen.getByText('Restaura 50 pontos de vida')).toBeDefined();
  });
});

describe('CartDrawer Component', () => {
  const mockCartItems = [
    {
      id: '1',
      name: 'Poção de Cura',
      price: 100,
      imageUrl: '/placeholder.svg',
      quantity: 2,
      currency: 'gems'
    },
    {
      id: '2',
      name: 'Espada de Aço',
      price: 250,
      imageUrl: '/placeholder.svg',
      quantity: 1,
      currency: 'gems'
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
    expect(screen.getByText('450 gemas')).toBeDefined();
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
    
    const removeButtons = screen.getAllByRole('button', { name: /x/i });
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });
});
