
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Gift, Gem, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export type ItemCategory = 'theme' | 'asset' | 'premium' | 'gem';

export interface ShopItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: 'gems' | 'real';
  imageUrl: string;
  category: ItemCategory;
  popular?: boolean;
  new?: boolean;
  onPurchase?: (id: string) => void;
}

export const ShopItem = ({
  id,
  name,
  description,
  price,
  discountPrice,
  currency,
  imageUrl,
  category,
  popular = false,
  new: isNew = false,
  onPurchase
}: ShopItemProps) => {
  const handlePurchase = () => {
    // Simular uma compra
    toast.success(`Item "${name}" adicionado ao carrinho!`);
    if (onPurchase) {
      onPurchase(id);
    }
  };

  const getCategoryIcon = (category: ItemCategory) => {
    switch (category) {
      case 'theme':
        return <Sparkles size={14} />;
      case 'asset':
        return <Gift size={14} />;
      case 'premium':
        return <Sparkles size={14} />;
      case 'gem':
        return <Gem size={14} />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: ItemCategory) => {
    switch (category) {
      case 'theme':
        return 'Tema';
      case 'asset':
        return 'Asset';
      case 'premium':
        return 'Premium';
      case 'gem':
        return 'Gemas';
      default:
        return '';
    }
  };

  const formatPrice = (value: number) => {
    if (currency === 'gems') {
      return `${value} gemas`;
    }
    return `R$ ${value.toFixed(2)}`;
  };

  const getDiscountPercentage = () => {
    if (discountPrice && price > 0) {
      const discount = Math.round(((price - discountPrice) / price) * 100);
      return discount > 0 ? `-${discount}%` : '';
    }
    return '';
  };

  return (
    <div className="fantasy-card p-0 overflow-hidden">
      <div className="relative">
        <div className="h-40 bg-gray-700 relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-fantasy-dark to-transparent opacity-80"></div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant="outline" className="bg-fantasy-dark/80 text-xs font-normal px-2 py-0.5 flex gap-1 items-center">
            {getCategoryIcon(category)}
            {getCategoryLabel(category)}
          </Badge>
          
          {isNew && (
            <Badge className="bg-green-600 text-white border-none text-xs font-normal">Novo</Badge>
          )}
          
          {popular && (
            <Badge className="bg-amber-500 text-white border-none text-xs font-normal">Popular</Badge>
          )}
        </div>

        {/* Discount */}
        {discountPrice && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-500 text-white border-none">
              {getDiscountPercentage()}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-lg font-medievalsharp text-fantasy-gold">{name}</h3>
        <p className="text-xs text-fantasy-stone mt-1 line-clamp-2">{description}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <div>
            {discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xs line-through text-fantasy-stone/70">
                  {formatPrice(price)}
                </span>
                <span className="text-sm font-medium text-fantasy-gold">
                  {formatPrice(discountPrice)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-fantasy-gold">
                {formatPrice(price)}
              </span>
            )}
          </div>
          
          <Button 
            onClick={handlePurchase}
            className="fantasy-button primary h-8 px-3 py-1 text-xs"
          >
            <ShoppingCart size={14} className="mr-1" />
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;
