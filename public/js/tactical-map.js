
document.addEventListener('DOMContentLoaded', function() {
  // Configuração do Supabase
  const supabaseUrl = 'https://your-supabase-url.supabase.co';
  const supabaseKey = 'your-supabase-anon-key';
  let supabase;
  
  try {
    supabase = supabase.createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    showToast('Erro de conexão com o servidor', 'error');
  }
  
  // Variáveis globais
  let stage, layer;
  let tokens = [];
  let selectedTokenId = null;
  let isGameMaster = true; // Determine com base no login do usuário
  let isPaused = false;
  let userId = ''; // Será definido após autenticação
  let sessionId = ''; // Será definido com base na URL ou estado
  let showGrid = true;
  let scale = 1;
  let fogOfWar = [];
  let gridSize = 50;
  
  // Elementos DOM
  const mapContainer = document.getElementById('tacticalMapContainer');
  const tokensList = document.getElementById('tokensList');
  const selectedTokenInfo = document.getElementById('selectedTokenInfo');
  const selectedTokenName = document.getElementById('selectedTokenName');
  const selectedTokenPosition = document.getElementById('selectedTokenPosition');
  const selectedTokenSize = document.getElementById('selectedTokenSize');
  const toggleVisibilityBtn = document.getElementById('toggleVisibility');
  const deleteTokenBtn = document.getElementById('deleteToken');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const toggleGridBtn = document.getElementById('toggleGrid');
  const addTokenBtn = document.getElementById('addToken');
  const toggleFogBtn = document.getElementById('toggleFog');
  const addTokenModal = document.getElementById('addTokenModal');
  const closeTokenModalBtn = document.getElementById('closeTokenModal');
  const tokenForm = document.getElementById('tokenForm');
  
  // Inicializar o mapa Konva
  function initializeMap() {
    const width = mapContainer.offsetWidth;
    const height = mapContainer.offsetHeight;
    
    stage = new Konva.Stage({
      container: 'tacticalMapContainer',
      width: width,
      height: height,
      draggable: true
    });
    
    layer = new Konva.Layer();
    stage.add(layer);
    
    // Background
    const background = new Konva.Rect({
      x: -10000,
      y: -10000,
      width: 20000,
      height: 20000,
      fill: '#1a1625'
    });
    layer.add(background);
    
    // Desenhar grid
    drawGrid();
    
    // Handlers de eventos
    stage.on('wheel', handleWheel);
    window.addEventListener('resize', handleResize);
    
    // Mostrar o mapa com animação
    setTimeout(() => {
      mapContainer.classList.add('fade-in');
      mapContainer.classList.remove('opacity-0');
    }, 500);
    
    // Carregar tokens iniciais
    loadTokens();
  }
  
  // Desenhar grid
  function drawGrid() {
    if (!showGrid) return;
    
    // Limpar grid existente
    layer.find('.grid-line').forEach(line => line.destroy());
    
    // Desenhar linhas horizontais e verticais
    for (let i = 0; i < 400; i++) {
      const verticalLine = new Konva.Line({
        points: [i * gridSize - 10000, -10000, i * gridSize - 10000, 10000],
        stroke: 'rgba(255, 255, 255, 0.1)',
        strokeWidth: 1,
        name: 'grid-line'
      });
      
      const horizontalLine = new Konva.Line({
        points: [-10000, i * gridSize - 10000, 10000, i * gridSize - 10000],
        stroke: 'rgba(255, 255, 255, 0.1)',
        strokeWidth: 1,
        name: 'grid-line'
      });
      
      layer.add(verticalLine);
      layer.add(horizontalLine);
    }
    
    layer.batchDraw();
  }
  
  // Lidar com o zoom
  function handleWheel(e) {
    e.evt.preventDefault();
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };
    
    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
    const limitedScale = Math.max(0.5, Math.min(3, newScale));
    
    stage.scale({ x: limitedScale, y: limitedScale });
    
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale
    };
    
    stage.position(newPos);
    scale = limitedScale;
    
    stage.batchDraw();
  }
  
  // Lidar com o redimensionamento da janela
  function handleResize() {
    if (!mapContainer) return;
    
    const width = mapContainer.offsetWidth;
    const height = mapContainer.offsetHeight;
    
    stage.width(width);
    stage.height(height);
    stage.batchDraw();
  }
  
  // Carregar tokens do Supabase
  async function loadTokens() {
    // Simulando tokens para demonstração
    const demoTokens = [
      {
        id: '1',
        name: 'Aragorn',
        token_type: 'character',
        color: '#3b82f6',
        size: 1,
        x: 5,
        y: 5,
        is_visible_to_players: true,
        user_id: '123'
      },
      {
        id: '2',
        name: 'Goblin',
        token_type: 'monster',
        color: '#ef4444',
        size: 0.75,
        x: 8,
        y: 7,
        is_visible_to_players: true,
        user_id: null
      },
      {
        id: '3',
        name: 'Gandalf',
        token_type: 'npc',
        color: '#f59e0b',
        size: 1,
        x: 3,
        y: 4,
        is_visible_to_players: false,
        user_id: null
      }
    ];
    
    tokens = demoTokens;
    
    // Caso a integração com Supabase esteja funcionando:
    /*
    try {
      const { data, error } = await supabase
        .from('map_tokens')
        .select('*')
        .eq('session_id', sessionId);
        
      if (error) throw error;
      tokens = data;
    } catch (error) {
      console.error('Erro ao carregar tokens:', error);
      showToast('Erro ao carregar tokens', 'error');
    }
    */
    
    // Desenhar tokens
    drawTokens();
    // Atualizar lista de tokens
    updateTokensList();
  }
  
  // Desenhar todos os tokens
  function drawTokens() {
    // Remover tokens existentes
    layer.find('.token').forEach(token => token.destroy());
    
    tokens.forEach(token => {
      if (!isGameMaster && !token.is_visible_to_players) return;
      
      const size = token.size * gridSize;
      const isOwner = token.user_id === userId;
      const canDrag = isGameMaster || isOwner;
      
      const group = new Konva.Group({
        x: token.x * gridSize,
        y: token.y * gridSize,
        draggable: canDrag && !isPaused,
        name: 'token',
        id: token.id
      });
      
      const circle = new Konva.Circle({
        radius: size / 2,
        fill: token.color,
        stroke: token.id === selectedTokenId ? 'white' : 'rgba(255, 255, 255, 0.6)',
        strokeWidth: token.id === selectedTokenId ? 3 : 2,
        opacity: token.is_visible_to_players || !isGameMaster ? 1 : 0.5
      });
      
      const text = new Konva.Text({
        text: token.name.substring(0, 2).toUpperCase(),
        fill: 'white',
        fontSize: size / 3,
        fontStyle: 'bold',
        align: 'center',
        verticalAlign: 'middle',
        width: size,
        height: size,
        offsetX: size / 2,
        offsetY: size / 2
      });
      
      group.add(circle);
      group.add(text);
      
      if (isGameMaster && !token.is_visible_to_players) {
        const visibilityIcon = new Konva.Circle({
          radius: size / 8,
          fill: 'rgba(0, 0, 0, 0.5)',
          stroke: 'rgba(255, 255, 255, 0.3)',
          strokeWidth: 1,
          x: size / 2 - 5,
          y: -size / 5
        });
        
        group.add(visibilityIcon);
      }
      
      group.on('dragend', function(e) {
        handleTokenDragEnd(e, token.id);
      });
      
      group.on('click', function() {
        selectToken(token.id);
      });
      
      group.on('tap', function() {
        selectToken(token.id);
      });
      
      layer.add(group);
    });
    
    layer.batchDraw();
  }
  
  // Atualizar a lista de tokens no painel lateral
  function updateTokensList() {
    tokensList.innerHTML = '';
    
    tokens.forEach(token => {
      if (!isGameMaster && !token.is_visible_to_players) return;
      
      const tokenItem = document.createElement('div');
      tokenItem.className = `token-item ${token.id === selectedTokenId ? 'selected' : ''}`;
      tokenItem.dataset.tokenId = token.id;
      
      const iconType = getTokenTypeIcon(token.token_type);
      
      tokenItem.innerHTML = `
        <span class="token-color" style="background-color: ${token.color}"></span>
        <span class="flex-1">${token.name}</span>
        ${!token.is_visible_to_players ? '<span class="text-gray-500 ml-2">👁️</span>' : ''}
      `;
      
      tokenItem.addEventListener('click', () => selectToken(token.id));
      
      tokensList.appendChild(tokenItem);
    });
  }
  
  // Obter o ícone para o tipo de token
  function getTokenTypeIcon(type) {
    switch (type) {
      case 'character': return '👤';
      case 'monster': return '👹';
      case 'npc': return '🧙';
      case 'object': return '📦';
      default: return '⚪';
    }
  }
  
  // Selecionar um token
  function selectToken(tokenId) {
    if (selectedTokenId === tokenId) {
      selectedTokenId = null;
      selectedTokenInfo.classList.add('hidden');
    } else {
      selectedTokenId = tokenId;
      const token = tokens.find(t => t.id === tokenId);
      
      if (token) {
        selectedTokenName.textContent = token.name;
        selectedTokenPosition.textContent = `X: ${token.x}, Y: ${token.y}`;
        selectedTokenSize.textContent = getTokenSizeText(token.size);
        
        toggleVisibilityBtn.textContent = token.is_visible_to_players ? 'Esconder' : 'Mostrar';
        toggleVisibilityBtn.classList.toggle('fantasy-button-secondary', token.is_visible_to_players);
        toggleVisibilityBtn.classList.toggle('fantasy-button-primary', !token.is_visible_to_players);
        
        selectedTokenInfo.classList.remove('hidden');
      }
    }
    
    // Redesenhar tokens para atualizar seleção visual
    drawTokens();
    updateTokensList();
  }
  
  // Obter texto do tamanho do token
  function getTokenSizeText(size) {
    switch (size) {
      case 0.5: return 'Minúsculo';
      case 0.75: return 'Pequeno';
      case 1: return 'Médio';
      case 1.5: return 'Grande';
      case 2: return 'Enorme';
      case 3: return 'Colossal';
      default: return 'Médio';
    }
  }
  
  // Lidar com o fim do arrasto de um token
  function handleTokenDragEnd(e, tokenId) {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    const canMove = isGameMaster || (token.user_id === userId);
    if (!canMove || isPaused) {
      e.target.position({
        x: token.x * gridSize,
        y: token.y * gridSize
      });
      return;
    }
    
    const pos = e.target.position();
    const gridX = Math.round(pos.x / gridSize);
    const gridY = Math.round(pos.y / gridSize);
    
    e.target.position({
      x: gridX * gridSize,
      y: gridY * gridSize
    });
    
    // Atualizar posição do token
    token.x = gridX;
    token.y = gridY;
    
    // Se estiver selecionado, atualizar informações
    if (selectedTokenId === tokenId) {
      selectedTokenPosition.textContent = `X: ${token.x}, Y: ${token.y}`;
    }
    
    // Enviar atualização para o servidor
    updateTokenPosition(tokenId, gridX, gridY);
  }
  
  // Atualizar posição do token no servidor
  function updateTokenPosition(tokenId, x, y) {
    // Simulação - em um ambiente real, isso enviaria para o Supabase
    console.log(`Token ${tokenId} movido para X: ${x}, Y: ${y}`);
    
    // Com Supabase seria:
    /*
    try {
      const { error } = await supabase
        .from('map_tokens')
        .update({ x, y })
        .eq('id', tokenId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar posição do token:', error);
      showToast('Erro ao atualizar posição', 'error');
    }
    */
  }
  
  // Adicionar um novo token
  async function addNewToken() {
    const name = document.getElementById('tokenName').value;
    const tokenType = document.getElementById('tokenType').value;
    const color = document.getElementById('tokenColor').value;
    const size = parseFloat(document.getElementById('tokenSize').value);
    const x = parseInt(document.getElementById('tokenX').value);
    const y = parseInt(document.getElementById('tokenY').value);
    const isVisible = document.getElementById('tokenVisibility').checked;
    
    if (!name) {
      showToast('Nome do token é obrigatório', 'error');
      return;
    }
    
    const newToken = {
      id: Date.now().toString(), // Temporário
      name,
      token_type: tokenType,
      color,
      size,
      x,
      y,
      is_visible_to_players: isVisible,
      user_id: null
    };
    
    // Adicionar ao array local
    tokens.push(newToken);
    
    // Atualizar a visualização
    drawTokens();
    updateTokensList();
    
    // Fechar o modal
    addTokenModal.classList.add('hidden');
    
    // Mostrar toast de sucesso
    showToast('Token adicionado com sucesso!', 'success');
    
    // Com Supabase seria:
    /*
    try {
      const { data, error } = await supabase
        .from('map_tokens')
        .insert({
          name,
          token_type: tokenType,
          color,
          size,
          x,
          y,
          is_visible_to_players: isVisible,
          session_id: sessionId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Adicionar o token retornado com ID gerado pelo banco
      tokens.push(data);
      drawTokens();
      updateTokensList();
      
      addTokenModal.classList.add('hidden');
      showToast('Token adicionado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar token:', error);
      showToast('Erro ao adicionar token', 'error');
    }
    */
  }
  
  // Excluir um token
  async function deleteSelectedToken() {
    if (!selectedTokenId) return;
    
    // Remover do array local
    tokens = tokens.filter(token => token.id !== selectedTokenId);
    
    // Atualizar a visualização
    drawTokens();
    updateTokensList();
    
    // Limpar seleção
    selectedTokenId = null;
    selectedTokenInfo.classList.add('hidden');
    
    // Mostrar toast de sucesso
    showToast('Token excluído com sucesso!', 'success');
    
    // Com Supabase seria:
    /*
    try {
      const { error } = await supabase
        .from('map_tokens')
        .delete()
        .eq('id', selectedTokenId);
        
      if (error) throw error;
      
      tokens = tokens.filter(token => token.id !== selectedTokenId);
      drawTokens();
      updateTokensList();
      
      selectedTokenId = null;
      selectedTokenInfo.classList.add('hidden');
      
      showToast('Token excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir token:', error);
      showToast('Erro ao excluir token', 'error');
    }
    */
  }
  
  // Alternar visibilidade do token
  async function toggleTokenVisibility() {
    if (!selectedTokenId) return;
    
    const token = tokens.find(t => t.id === selectedTokenId);
    if (!token) return;
    
    // Alternar visibilidade
    token.is_visible_to_players = !token.is_visible_to_players;
    
    // Atualizar botão
    toggleVisibilityBtn.textContent = token.is_visible_to_players ? 'Esconder' : 'Mostrar';
    
    // Atualizar a visualização
    drawTokens();
    updateTokensList();
    
    // Mostrar toast de sucesso
    const message = token.is_visible_to_players ? 
      'Token agora é visível para jogadores' : 
      'Token agora está escondido dos jogadores';
    showToast(message, 'success');
    
    // Com Supabase seria:
    /*
    try {
      const { error } = await supabase
        .from('map_tokens')
        .update({ is_visible_to_players: token.is_visible_to_players })
        .eq('id', selectedTokenId);
        
      if (error) throw error;
      
      toggleVisibilityBtn.textContent = token.is_visible_to_players ? 'Esconder' : 'Mostrar';
      drawTokens();
      updateTokensList();
      
      const message = token.is_visible_to_players ? 
        'Token agora é visível para jogadores' : 
        'Token agora está escondido dos jogadores';
      showToast(message, 'success');
    } catch (error) {
      console.error('Erro ao atualizar visibilidade:', error);
      showToast('Erro ao atualizar visibilidade', 'error');
    }
    */
  }
  
  // Toast de notificação
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
      toastIcon.classList.remove('text-green-400');
      toastIcon.classList.add('text-red-400');
      toastIcon.innerHTML = `
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      `;
    } else {
      toastIcon.classList.remove('text-red-400');
      toastIcon.classList.add('text-green-400');
      toastIcon.innerHTML = `
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      `;
    }
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
  
  // Event Listeners
  zoomInBtn.addEventListener('click', () => {
    const newScale = Math.min(scale + 0.2, 3);
    scale = newScale;
    stage.scale({ x: newScale, y: newScale });
    stage.batchDraw();
  });
  
  zoomOutBtn.addEventListener('click', () => {
    const newScale = Math.max(scale - 0.2, 0.5);
    scale = newScale;
    stage.scale({ x: newScale, y: newScale });
    stage.batchDraw();
  });
  
  toggleGridBtn.addEventListener('click', () => {
    showGrid = !showGrid;
    toggleGridBtn.classList.toggle('bg-fantasy-purple/20', showGrid);
    toggleGridBtn.classList.toggle('bg-fantasy-dark/70', !showGrid);
    
    if (showGrid) {
      drawGrid();
    } else {
      layer.find('.grid-line').forEach(line => line.destroy());
      layer.batchDraw();
    }
  });
  
  addTokenBtn.addEventListener('click', () => {
    if (!isGameMaster) return;
    addTokenModal.classList.remove('hidden');
  });
  
  closeTokenModalBtn.addEventListener('click', () => {
    addTokenModal.classList.add('hidden');
  });
  
  tokenForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewToken();
  });
  
  deleteTokenBtn.addEventListener('click', () => {
    if (!isGameMaster) return;
    deleteSelectedToken();
  });
  
  toggleVisibilityBtn.addEventListener('click', () => {
    if (!isGameMaster) return;
    toggleTokenVisibility();
  });
  
  // Fechar modal ao clicar fora
  addTokenModal.addEventListener('click', (e) => {
    if (e.target === addTokenModal) {
      addTokenModal.classList.add('hidden');
    }
  });
  
  // Inicializar o mapa
  initializeMap();
});
