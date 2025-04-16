
import React from 'react';
import { ShoppingCart, X, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  currency: 'gems' | 'real';
}

interface CartDrawerProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
  onClear: () => void;
}

export const CartDrawer = ({
  items,
  onRemove,
  onUpdateQuantity,
  onCheckout,
  onClear
}: CartDrawerProps) => {
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getMajorityCurrency = (): 'gems' | 'real' => {
    const gemsCount = items.filter(item => item.currency === 'gems').length;
    const realCount = items.filter(item => item.currency === 'real').length;
    return gemsCount >= realCount ? 'gems' : 'real';
  };

  const formatPrice = (price: number, currency: 'gems' | 'real') => {
    if (currency === 'gems') {
      return `${price} gemas`;
    }
    return `R$ ${price.toFixed(2)}`;
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }
    
    onCheckout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fantasy-button primary relative">
          <ShoppingCart size={18} />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-fantasy-dark border-fantasy-purple/30 w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-fantasy-gold font-medievalsharp">Seu Carrinho</SheetTitle>
          <SheetDescription>
            {items.length === 0 
              ? "Seu carrinho está vazio." 
              : `Você tem ${items.length} ${items.length === 1 ? 'item' : 'itens'} no seu carrinho.`}
          </SheetDescription>
        </SheetHeader>

        {items.length > 0 && (
          <>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClear}
                className="text-xs text-fantasy-stone hover:text-white hover:bg-fantasy-dark/50"
              >
                <Trash2 size={14} className="mr-1" />
                Limpar Carrinho
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-12rem)] mt-2 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-3 p-2 rounded-md border border-fantasy-purple/20 bg-fantasy-dark/50"
                  >
                    <div className="h-16 w-16 rounded overflow-hidden border border-fantasy-purple/20">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="h-5 w-5 rounded-full bg-fantasy-dark/50 flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-fantasy-gold">
                          {formatPrice(item.price, item.currency)}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-5 w-5 rounded bg-fantasy-dark/70 flex items-center justify-center"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-xs w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-5 w-5 rounded bg-fantasy-dark/70 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <SheetFooter className="mt-4 border-t border-fantasy-purple/20 pt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total:</span>
                  <span className="text-lg font-medievalsharp text-fantasy-gold">
                    {formatPrice(getTotalPrice(), getMajorityCurrency())}
                  </span>
                </div>
                
                <SheetClose asChild>
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full fantasy-button primary"
                  >
                    <CreditCard size={16} className="mr-2" />
                    Finalizar Compra
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
