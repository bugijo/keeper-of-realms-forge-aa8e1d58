
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

interface CharacterInventoryItem {
  id: string;
  character_id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number;
  value: number;
  type: string;
  rarity: string;
  equipped?: boolean;
  imageUrl?: string;
}

export function useInventorySync({ characterId, isMaster = false }: UseInventoryOptions) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalWeight, setTotalWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(150); // Default max weight (can be calculated based on strength)

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
        
        // Use direct fetch approach to avoid type issues with non-existing tables
        const { data, error } = await supabase
          .rpc('get_character_inventory', {
            p_character_id: characterId
          });
        
        if (error) throw error;
        
        // Map the data to match our InventoryItem interface
        const inventoryItems: InventoryItem[] = (data || []).map((item: any) => ({
          id: item.id,
          character_id: item.character_id,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity || 1,
          weight: item.weight || 0,
          value: item.value || 0,
          type: item.type || 'misc',
          rarity: item.rarity || 'common',
          equipped: item.equipped || false,
          imageUrl: item.imageUrl
        }));
        
        setInventory(inventoryItems);
        
        // Calculate total weight
        const total = inventoryItems.reduce((sum, item) => {
          return sum + (item.weight * item.quantity);
        }, 0);
        
        setTotalWeight(total);
        
        // For real-time updates, we would need to set up a subscription
        // but since the "character_inventory" table doesn't exist in Supabase yet,
        // we'll use a polling mechanism instead
        const intervalId = setInterval(() => {
          loadInventory();
        }, 60000); // Refresh every minute
        
        return () => {
          clearInterval(intervalId);
        };
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
