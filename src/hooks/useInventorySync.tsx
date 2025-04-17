import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number;
  value: number;
  type: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  equipped?: boolean;
  imageUrl?: string;
  character_id?: string;
}

interface UseInventoryOptions {
  characterId: string;
  isMaster?: boolean;
}

export function useInventorySync({ characterId, isMaster = false }: UseInventoryOptions) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalWeight, setTotalWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(150);

  // Calculate encumbrance status
  const encumbranceStatus = () => {
    if (totalWeight <= maxWeight * 0.33) return 'light';
    if (totalWeight <= maxWeight * 0.66) return 'medium';
    if (totalWeight <= maxWeight) return 'heavy';
    return 'overencumbered';
  };

  // Load inventory from database
  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('character_inventory')
          .select('*')
          .eq('character_id', characterId);
        
        if (error) throw error;
        
        const inventoryItems = data?.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity || 1,
          weight: item.weight || 0,
          value: item.value || 0,
          type: item.type || 'misc',
          rarity: item.rarity || 'common',
          equipped: item.equipped || false,
          imageUrl: item.imageUrl,
          character_id: item.character_id
        })) || [];
        
        setInventory(inventoryItems);
        
        const total = inventoryItems.reduce((sum, item) => {
          return sum + (item.weight * item.quantity);
        }, 0);
        
        setTotalWeight(total);
      } catch (err: any) {
        console.error("Error loading inventory:", err);
        setError(err.message);
        toast.error(`Erro ao carregar inventário: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (characterId) {
      loadInventory();
    }
  }, [characterId]);

  // Add item to inventory (placeholder until we create the proper table)
  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      // Since we don't have the character_inventory table yet,
      // we'll mock the addition and update local state
      const mockItem: InventoryItem = {
        id: `temp-${Date.now()}`,
        ...item
      };
      
      setInventory(prev => [...prev, mockItem]);
      setTotalWeight(prev => prev + (mockItem.weight * mockItem.quantity));
      
      toast.success(`${item.name} adicionado ao inventário!`);
      return mockItem;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao adicionar item: ${err.message}`);
      return null;
    }
  };

  // Remove item from inventory (placeholder)
  const removeItem = async (itemId: string) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      setInventory(prev => prev.filter(i => i.id !== itemId));
      setTotalWeight(prev => prev - (item.weight * item.quantity));
      
      toast.success(`${item.name} removido do inventário!`);
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao remover item: ${err.message}`);
      return false;
    }
  };

  // Update item quantity (placeholder)
  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      if (newQuantity <= 0) {
        return removeItem(itemId);
      }
      
      const oldQuantity = item.quantity;
      
      setInventory(prev => 
        prev.map(i => 
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        )
      );
      
      setTotalWeight(prev => prev - (item.weight * oldQuantity) + (item.weight * newQuantity));
      
      toast.success(`Quantidade de ${item.name} atualizada!`);
      return { ...item, quantity: newQuantity };
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao atualizar quantidade: ${err.message}`);
      return null;
    }
  };

  // Toggle equipped status (placeholder)
  const toggleEquipped = async (itemId: string) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      setInventory(prev => 
        prev.map(i => 
          i.id === itemId ? { ...i, equipped: !i.equipped } : i
        )
      );
      
      toast.success(item.equipped ? 
        `${item.name} desequipado!` : 
        `${item.name} equipado!`
      );
      
      return { ...item, equipped: !item.equipped };
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao atualizar status de equipamento: ${err.message}`);
      return null;
    }
  };

  return {
    inventory,
    loading,
    error,
    totalWeight,
    maxWeight,
    encumbranceStatus: encumbranceStatus(),
    addItem,
    removeItem,
    updateItemQuantity,
    toggleEquipped
  };
}
