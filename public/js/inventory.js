
document.addEventListener('DOMContentLoaded', async function() {
  // Elementos DOM
  const characterSelector = document.getElementById('characterSelector');
  const inventoryItems = document.getElementById('inventoryItems');
  const emptyInventory = document.getElementById('emptyInventory');
  const noCharactersMessage = document.getElementById('noCharactersMessage');
  const inventoryContent = document.getElementById('inventoryContent');
  const encumbranceDisplay = document.getElementById('encumbranceDisplay');
  const addItemButton = document.getElementById('addItemButton');
  const itemModal = document.getElementById('itemModal');
  const closeItemModal = document.getElementById('closeItemModal');
  const cancelItemForm = document.getElementById('cancelItemForm');
  const itemForm = document.getElementById('itemForm');
  const modalTitle = document.getElementById('modalTitle');
  const submitButtonText = document.getElementById('submitButtonText');
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const cancelDelete = document.getElementById('cancelDelete');
  const confirmDelete = document.getElementById('confirmDelete');
  const deleteItemName = document.getElementById('deleteItemName');
  const imageUpload = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');
  
  // Estado da aplicação
  let characters = [];
  let inventory = [];
  let selectedCharacter = null;
  let currentUser = null;
  let editingItem = null;
  let itemToDelete = null;
  let totalWeight = 0;
  let maxWeight = 150;
  
  // Cores para status de peso
  const encumbranceColors = {
    light: 'text-green-400',
    medium: 'text-yellow-400',
    heavy: 'text-orange-400',
    overencumbered: 'text-red-400'
  };
  
  // Carregar usuário atual
  const loadCurrentUser = async () => {
    currentUser = await getCurrentUser();
    
    if (!currentUser) {
      // Usuário não está logado, mostrar mensagem
      noCharactersMessage.classList.remove('hidden');
      inventoryContent.classList.add('hidden');
      addItemButton.classList.add('hidden');
      return false;
    }
    
    return true;
  };
  
  // Carregar personagens do usuário
  const loadCharacters = async () => {
    try {
      const { data: userCharacters, error } = await supabase
        .from('characters')
        .select('id, name, class, race, level')
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      characters = userCharacters || [];
      
      if (characters.length === 0) {
        noCharactersMessage.classList.remove('hidden');
        inventoryContent.classList.add('hidden');
      } else {
        noCharactersMessage.classList.add('hidden');
        inventoryContent.classList.remove('hidden');
        renderCharacterSelector();
        // Selecionar primeiro personagem automaticamente
        selectedCharacter = characters[0].id;
        loadInventory(selectedCharacter);
      }
      
    } catch (err) {
      console.error('Erro ao carregar personagens:', err);
      createToast('Erro ao carregar seus personagens', 'error');
    }
  };
  
  // Renderizar seletor de personagens
  const renderCharacterSelector = () => {
    if (!characterSelector) return;
    
    characterSelector.innerHTML = '';
    
    characters.forEach(char => {
      const button = document.createElement('button');
      button.textContent = `${char.name} (${char.race} ${char.class})`;
      button.classList.add('character-button');
      
      if (selectedCharacter === char.id) {
        button.classList.add('selected');
      }
      
      button.addEventListener('click', () => {
        // Remover classe selecionada de todos os botões
        document.querySelectorAll('.character-button').forEach(btn => {
          btn.classList.remove('selected');
        });
        
        // Adicionar classe selecionada ao botão clicado
        button.classList.add('selected');
        selectedCharacter = char.id;
        loadInventory(char.id);
      });
      
      characterSelector.appendChild(button);
    });
  };
  
  // Carregar inventário
  const loadInventory = async (characterId) => {
    try {
      if (!characterId) return;
      
      const { data, error } = await supabase
        .from('character_inventory')
        .select('*')
        .eq('character_id', characterId);
      
      if (error) throw error;
      
      inventory = data || [];
      
      // Transformar os dados para corresponder à interface TypeScript
      inventory = inventory.map(item => ({
        ...item,
        imageUrl: item.image_url
      }));
      
      renderInventory();
      calculateWeight();
      
    } catch (err) {
      console.error('Erro ao carregar inventário:', err);
      createToast(`Erro ao carregar inventário: ${err.message}`, 'error');
    }
  };
  
  // Calcular peso total
  const calculateWeight = () => {
    totalWeight = inventory.reduce((sum, item) => {
      return sum + (Number(item.weight) * item.quantity);
    }, 0);
    
    updateEncumbranceDisplay();
  };
  
  // Atualizar display de peso/carga
  const updateEncumbranceDisplay = () => {
    if (!encumbranceDisplay) return;
    
    // Determinar status de sobrecarga
    const status = getEncumbranceStatus();
    
    // Remover todas as classes de cor
    Object.values(encumbranceColors).forEach(color => {
      encumbranceDisplay.classList.remove(color);
    });
    
    // Adicionar classe de cor correspondente
    encumbranceDisplay.classList.add(encumbranceColors[status]);
    encumbranceDisplay.textContent = `Peso: ${totalWeight} / ${maxWeight}`;
  };
  
  // Obter status de sobrecarga
  const getEncumbranceStatus = () => {
    if (totalWeight <= maxWeight * 0.33) return 'light';
    if (totalWeight <= maxWeight * 0.66) return 'medium';
    if (totalWeight <= maxWeight) return 'heavy';
    return 'overencumbered';
  };
  
  // Renderizar inventário
  const renderInventory = () => {
    if (!inventoryItems || !emptyInventory) return;
    
    if (inventory.length === 0) {
      inventoryItems.classList.add('hidden');
      emptyInventory.classList.remove('hidden');
      return;
    }
    
    inventoryItems.classList.remove('hidden');
    emptyInventory.classList.add('hidden');
    
    inventoryItems.innerHTML = '';
    
    inventory.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = `inventory-item ${item.rarity}`;
      
      itemElement.innerHTML = `
        <div class="item-info">
          <div class="item-image">
            ${item.imageUrl 
              ? `<img src="${item.imageUrl}" alt="${item.name}" />`
              : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-fantasy-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                 </svg>`
            }
          </div>
          <div class="item-details">
            <h3>${item.name}</h3>
            <div class="item-meta">
              <span>Qtd: ${item.quantity}</span>
              <span>Peso: ${item.weight}</span>
              ${item.value ? `<span>Valor: ${item.value}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="item-actions">
          <button class="equip-button ${item.equipped ? 'equipped' : ''}" data-id="${item.id}">
            ${item.equipped ? 'Equipado' : 'Equipar'}
          </button>
          <button class="edit-button" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button class="delete-button" data-id="${item.id}" data-name="${item.name}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      `;
      
      // Adicionar event listeners para os botões
      const equipButton = itemElement.querySelector('.equip-button');
      const editButton = itemElement.querySelector('.edit-button');
      const deleteButton = itemElement.querySelector('.delete-button');
      
      if (equipButton) {
        equipButton.addEventListener('click', () => toggleEquipped(item.id));
      }
      
      if (editButton) {
        editButton.addEventListener('click', () => editItem(item.id));
      }
      
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          itemToDelete = item.id;
          deleteItemName.textContent = item.name;
          deleteConfirmModal.classList.remove('hidden');
        });
      }
      
      inventoryItems.appendChild(itemElement);
    });
  };
  
  // Adicionar item
  const addItem = async (formData) => {
    try {
      if (!selectedCharacter) {
        createToast('Selecione um personagem primeiro', 'error');
        return;
      }
      
      // Converter para o formato do banco de dados
      const dbItem = {
        character_id: selectedCharacter,
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        weight: formData.weight,
        value: formData.value,
        type: formData.type,
        rarity: formData.rarity,
        image_url: formData.imageUrl
      };
      
      const { data, error } = await supabase
        .from('character_inventory')
        .insert(dbItem)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transformar para o formato da interface
      const newItem = {
        ...data,
        imageUrl: data.image_url
      };
      
      inventory.push(newItem);
      renderInventory();
      calculateWeight();
      
      createToast(`Item ${formData.name} adicionado com sucesso!`, 'success');
      
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      createToast(`Erro ao adicionar item: ${err.message}`, 'error');
    }
  };
  
  // Atualizar item
  const updateItem = async (itemId, formData) => {
    try {
      // Converter para o formato do banco de dados
      const dbItem = {
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        weight: formData.weight,
        value: formData.value,
        type: formData.type,
        rarity: formData.rarity,
        image_url: formData.imageUrl,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('character_inventory')
        .update(dbItem)
        .eq('id', itemId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transformar para o formato da interface
      const updatedItem = {
        ...data,
        imageUrl: data.image_url
      };
      
      // Atualizar item no array de inventário
      inventory = inventory.map(item => item.id === itemId ? updatedItem : item);
      renderInventory();
      calculateWeight();
      
      createToast(`Item ${formData.name} atualizado com sucesso!`, 'success');
      
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      createToast(`Erro ao atualizar item: ${err.message}`, 'error');
    }
  };
  
  // Remover item
  const removeItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('character_inventory')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Remover item do array de inventário
      inventory = inventory.filter(item => item.id !== itemId);
      renderInventory();
      calculateWeight();
      
      createToast('Item removido com sucesso!', 'success');
      
    } catch (err) {
      console.error('Erro ao remover item:', err);
      createToast(`Erro ao remover item: ${err.message}`, 'error');
    }
  };
  
  // Alternar status de equipado
  const toggleEquipped = async (itemId) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) {
        createToast('Item não encontrado', 'error');
        return;
      }
      
      const { data, error } = await supabase
        .from('character_inventory')
        .update({ equipped: !item.equipped })
        .eq('id', itemId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transformar para o formato da interface
      const updatedItem = {
        ...data,
        imageUrl: data.image_url
      };
      
      // Atualizar item no array de inventário
      inventory = inventory.map(item => item.id === itemId ? updatedItem : item);
      renderInventory();
      
      createToast(`Item ${item.equipped ? 'desequipado' : 'equipado'} com sucesso!`, 'success');
      
    } catch (err) {
      console.error('Erro ao atualizar status de equipamento:', err);
      createToast(`Erro ao atualizar status de equipamento: ${err.message}`, 'error');
    }
  };
  
  // Editar item
  const editItem = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    editingItem = item;
    
    // Preencher formulário com dados do item
    document.getElementById('itemId').value = item.id;
    document.getElementById('name').value = item.name;
    document.getElementById('description').value = item.description || '';
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('weight').value = item.weight;
    document.getElementById('value').value = item.value || 0;
    document.getElementById('type').value = item.type;
    document.getElementById('rarity').value = item.rarity;
    
    // Visualização da imagem
    if (item.imageUrl) {
      imagePreview.style.backgroundImage = `url(${item.imageUrl})`;
      imagePreview.classList.add('has-image');
      imagePreview.classList.remove('hidden');
    } else {
      imagePreview.style.backgroundImage = '';
      imagePreview.classList.remove('has-image');
      imagePreview.classList.add('hidden');
    }
    
    // Atualizar título do modal e texto do botão
    modalTitle.textContent = 'Editar Item';
    submitButtonText.textContent = 'Salvar';
    
    // Exibir modal
    itemModal.classList.remove('hidden');
  };
  
  // Processar upload de imagem
  const uploadImage = async (file) => {
    try {
      // Gerar um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `inventory-images/${fileName}`;
      
      // Fazer upload do arquivo
      const { data, error } = await supabase
        .storage
        .from('inventory-images')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Obter URL pública da imagem
      const { data: publicUrl } = supabase
        .storage
        .from('inventory-images')
        .getPublicUrl(filePath);
      
      return publicUrl.publicUrl;
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      createToast(`Erro ao fazer upload da imagem: ${err.message}`, 'error');
      return null;
    }
  };
  
  // Resetar formulário
  const resetForm = () => {
    itemForm.reset();
    editingItem = null;
    document.getElementById('itemId').value = '';
    imagePreview.style.backgroundImage = '';
    imagePreview.classList.remove('has-image');
    imagePreview.classList.add('hidden');
    
    // Resetar título do modal e texto do botão
    modalTitle.textContent = 'Adicionar Item';
    submitButtonText.textContent = 'Adicionar';
  };
  
  // Mostrar modal de item
  const showItemModal = () => {
    resetForm();
    itemModal.classList.remove('hidden');
  };
  
  // Fechar modal de item
  const closeItemModalFn = () => {
    itemModal.classList.add('hidden');
    resetForm();
  };
  
  // Fechar modal de confirmação
  const closeDeleteConfirmModal = () => {
    deleteConfirmModal.classList.add('hidden');
    itemToDelete = null;
  };
  
  // Event listeners
  
  // Verificar se o usuário está logado e carregar dados
  const init = async () => {
    const isLoggedIn = await loadCurrentUser();
    if (isLoggedIn) {
      await loadCharacters();
    }
  };
  
  // Adicionar event listeners
  if (addItemButton) {
    addItemButton.addEventListener('click', showItemModal);
  }
  
  if (closeItemModal) {
    closeItemModal.addEventListener('click', closeItemModalFn);
  }
  
  if (cancelItemForm) {
    cancelItemForm.addEventListener('click', closeItemModalFn);
  }
  
  if (itemForm) {
    itemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Coletar dados do formulário
      const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        quantity: parseInt(document.getElementById('quantity').value),
        weight: parseFloat(document.getElementById('weight').value),
        value: parseInt(document.getElementById('value').value),
        type: document.getElementById('type').value,
        rarity: document.getElementById('rarity').value,
        imageUrl: editingItem?.imageUrl || ''
      };
      
      // Processar upload de imagem se houver
      const fileInput = document.getElementById('imageUpload');
      if (fileInput.files && fileInput.files[0]) {
        const imageUrl = await uploadImage(fileInput.files[0]);
        if (imageUrl) {
          formData.imageUrl = imageUrl;
        }
      }
      
      if (editingItem) {
        // Atualizar item existente
        await updateItem(editingItem.id, formData);
      } else {
        // Adicionar novo item
        await addItem(formData);
      }
      
      closeItemModalFn();
    });
  }
  
  // Event listener para previsualização de imagem
  if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.style.backgroundImage = `url(${event.target.result})`;
        imagePreview.classList.add('has-image');
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Event listeners para modal de confirmação
  if (cancelDelete) {
    cancelDelete.addEventListener('click', closeDeleteConfirmModal);
  }
  
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async () => {
      if (itemToDelete) {
        await removeItem(itemToDelete);
        closeDeleteConfirmModal();
      }
    });
  }
  
  // Inicializar
  init();
  
  // Escutar por mudanças no estado de autenticação
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      init();
    } else if (event === 'SIGNED_OUT') {
      // Redirecionar para a página inicial se o usuário fizer logout
      window.location.href = 'index.html';
    }
  });
  
  // Configurar canal de tempo real para atualizações do inventário
  const setupRealtime = (characterId) => {
    if (!characterId) return;
    
    const channel = supabase
      .channel('character_inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'character_inventory',
          filter: `character_id=eq.${characterId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = {
              ...payload.new,
              imageUrl: payload.new.image_url,
            };
            
            inventory.push(newItem);
            renderInventory();
            calculateWeight();
            createToast(`Item adicionado: ${payload.new.name}`, 'success');
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedItem = {
              ...payload.new,
              imageUrl: payload.new.image_url,
            };
            
            inventory = inventory.map((item) => 
              item.id === payload.new.id ? updatedItem : item
            );
            
            renderInventory();
            calculateWeight();
          } 
          else if (payload.eventType === 'DELETE') {
            inventory = inventory.filter((item) => item.id !== payload.old.id);
            renderInventory();
            calculateWeight();
            createToast(`Item removido: ${payload.old.name}`, 'success');
          }
        }
      )
      .subscribe();
    
    return channel;
  };
  
  // Configurar realtime quando o personagem for selecionado
  let realtimeChannel = null;
  
  // Observar mudanças na variável selectedCharacter
  Object.defineProperty(window, 'selectedCharacter', {
    set: function(newValue) {
      // Se o canal existir, remova-o
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
      
      // Configure um novo canal para o novo personagem selecionado
      if (newValue) {
        realtimeChannel = setupRealtime(newValue);
      }
      
      // Definir o valor
      this._selectedCharacter = newValue;
    },
    get: function() {
      return this._selectedCharacter;
    }
  });
});

// Animações para a página quando estiver carregada
document.addEventListener('DOMContentLoaded', function() {
  // Animação para itens aparecerem gradualmente
  setTimeout(() => {
    const items = document.querySelectorAll('.inventory-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '0';
        item.style.animation = 'fadeIn 0.5s forwards';
      }, index * 100);
    });
  }, 300);
});
