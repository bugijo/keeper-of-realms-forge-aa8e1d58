
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Gift, Gem, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

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
}: ShopItemProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const finalPrice = discountPrice || price;

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer compras!");
      return;
    }

    try {
      if (currency === 'gems') {
        // Verificar saldo de gemas
        const { data: balance } = await supabase
          .from('user_balance')
          .select('gems')
          .eq('user_id', user.id)
          .single();

        if (!balance || balance.gems < finalPrice) {
          toast.error("Saldo de gemas insuficiente!");
          return;
        }

        // Criar transação
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            item_id: id,
            item_name: name,
            amount: finalPrice,
            currency: 'gems',
            status: 'completed'
          });

        if (transactionError) throw transactionError;

        // Atualizar saldo
        const { error: updateError } = await supabase
          .from('user_balance')
          .update({ gems: balance.gems - finalPrice })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        toast.success(`Item "${name}" comprado com sucesso!`);
        setIsDialogOpen(false);
      } else {
        // Criar transação pendente para pagamento real
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            item_id: id,
            item_name: name,
            amount: finalPrice,
            currency: 'real',
            status: 'pending'
          });

        if (transactionError) throw transactionError;

        // TODO: Implement Stripe checkout
        toast.info("Redirecionando para o pagamento...");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Erro na compra:', error);
      toast.error("Erro ao processar a compra. Tente novamente.");
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="fantasy-button primary h-8 px-3 py-1 text-xs"
              >
                <ShoppingCart size={14} className="mr-1" />
                Comprar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-fantasy-dark border-fantasy-purple/30">
              <DialogHeader>
                <DialogTitle className="text-fantasy-gold font-medievalsharp">Confirmar Compra</DialogTitle>
                <DialogDescription>
                  Você deseja comprar "{name}" por {formatPrice(finalPrice)}?
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex justify-end gap-3">
                <Button 
                  onClick={handlePurchase}
                  className="fantasy-button primary"
                >
                  Confirmar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;
