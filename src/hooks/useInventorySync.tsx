
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
        
        const { data, error } = await supabase
          .from('character_inventory')
          .select('*')
          .eq('character_id', characterId);
        
        if (error) throw error;
        
        setInventory(data || []);
        
        // Calculate total weight
        const total = (data || []).reduce((sum, item) => {
          return sum + (item.weight * item.quantity);
        }, 0);
        
        setTotalWeight(total);
        
        // Subscribe to real-time changes
        const channel = supabase
          .channel('character-inventory-changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'character_inventory',
              filter: `character_id=eq.${characterId}`
            }, 
            (payload) => {
              // Handle different types of changes
              if (payload.eventType === 'INSERT') {
                setInventory(prev => [...prev, payload.new]);
                setTotalWeight(prev => prev + (payload.new.weight * payload.new.quantity));
              } else if (payload.eventType === 'UPDATE') {
                setInventory(prev => 
                  prev.map(item => 
                    item.id === payload.new.id ? payload.new : item
                  )
                );
                // Recalculate total weight after update
                setInventory(items => {
                  const total = items.reduce((sum, item) => {
                    return sum + (item.weight * item.quantity);
                  }, 0);
                  setTotalWeight(total);
                  return items;
                });
              } else if (payload.eventType === 'DELETE') {
                setInventory(prev => 
                  prev.filter(item => item.id !== payload.old.id)
                );
                setTotalWeight(prev => prev - (payload.old.weight * payload.old.quantity));
              }
            }
          )
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err: any) {
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

  // Add item to inventory
  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      // Check if similar item already exists
      const existingItem = inventory.find(i => 
        i.name === item.name && i.type === item.type && !i.equipped
      );
      
      if (existingItem) {
        // Update quantity of existing item
        return updateItemQuantity(existingItem.id, existingItem.quantity + item.quantity);
      }
      
      // Insert new item
      const { data, error } = await supabase
        .from('character_inventory')
        .insert({
          character_id: characterId,
          ...item
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`${item.name} adicionado ao inventário!`);
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao adicionar item: ${err.message}`);
      return null;
    }
  };

  // Remove item from inventory
  const removeItem = async (itemId: string) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      const { error } = await supabase
        .from('character_inventory')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      toast.success(`${item.name} removido do inventário!`);
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao remover item: ${err.message}`);
      return false;
    }
  };

  // Update item quantity
  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      if (newQuantity <= 0) {
        return removeItem(itemId);
      }
      
      const { data, error } = await supabase
        .from('character_inventory')
        .update({ quantity: newQuantity })
        .eq('id', itemId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Quantidade de ${item.name} atualizada!`);
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao atualizar quantidade: ${err.message}`);
      return null;
    }
  };

  // Toggle equipped status
  const toggleEquipped = async (itemId: string) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) throw new Error('Item não encontrado');
      
      const { data, error } = await supabase
        .from('character_inventory')
        .update({ equipped: !item.equipped })
        .eq('id', itemId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(item.equipped ? 
        `${item.name} desequipado!` : 
        `${item.name} equipado!`
      );
      return data;
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
