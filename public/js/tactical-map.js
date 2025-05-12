
// Variáveis globais
const GRID_SIZE = 50; // Tamanho da célula da grade em pixels
let stageWidth = 0;
let stageHeight = 0;
let scale = 1;
let gridVisible = true;
let selectedTokenId = null;
let tokens = [];
let participants = [];
let stage, layer, gridLayer, tokensLayer;

// Inicializar o mapa tático quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
  // Verificar se o usuário está autenticado
  const user = await getCurrentUser();
  if (!user) {
    createToast('Você precisa estar logado para acessar esta página', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }
  
  initializeMap();
  setupEventListeners();
  loadParticipants();
  
  // Fazer fade-in no mapa
  setTimeout(() => {
    document.getElementById('tacticalMapContainer').style.opacity = 1;
  }, 300);
});

// Inicializar o mapa tático com Konva
function initializeMap() {
  const container = document.getElementById('tacticalMapContainer');
  stageWidth = container.clientWidth;
  stageHeight = container.clientHeight;
  
  // Criar o palco Konva
  stage = new Konva.Stage({
    container: 'tacticalMapContainer',
    width: stageWidth,
    height: stageHeight,
    draggable: true
  });
  
  // Camada para a grade
  gridLayer = new Konva.Layer();
  stage.add(gridLayer);
  
  // Camada para os tokens
  tokensLayer = new Konva.Layer();
  stage.add(tokensLayer);
  
  // Desenhar a grade
  drawGrid();
}

// Desenhar a grade
function drawGrid() {
  gridLayer.destroyChildren();
  
  if (!gridVisible) return;
  
  const gridColor = 'rgba(255, 255, 255, 0.2)';
  
  // Linhas verticais
  for (let i = 0; i <= stageWidth; i += GRID_SIZE) {
    const line = new Konva.Line({
      points: [i, 0, i, stageHeight],
      stroke: gridColor,
      strokeWidth: 1
    });
    gridLayer.add(line);
  }
  
  // Linhas horizontais
  for (let j = 0; j <= stageHeight; j += GRID_SIZE) {
    const line = new Konva.Line({
      points: [0, j, stageWidth, j],
      stroke: gridColor,
      strokeWidth: 1
    });
    gridLayer.add(line);
  }
  
  gridLayer.batchDraw();
}

// Adicionar um token ao mapa
function addTokenToMap(tokenData) {
  const tokenSize = GRID_SIZE * parseFloat(tokenData.size);
  
  // Criar grupo para o token
  const tokenGroup = new Konva.Group({
    x: tokenData.x * GRID_SIZE,
    y: tokenData.y * GRID_SIZE,
    draggable: true,
    id: tokenData.id
  });
  
  // Criar círculo para o token
  const tokenCircle = new Konva.Circle({
    radius: tokenSize / 2,
    fill: tokenData.color,
    stroke: 'white',
    strokeWidth: 2
  });
  
  // Adicionar texto ao token
  const tokenText = new Konva.Text({
    text: tokenData.name.substring(0, 2),
    fontSize: tokenSize / 2,
    fontFamily: 'Arial',
    fill: 'white',
    align: 'center',
    verticalAlign: 'middle',
    width: tokenSize,
    height: tokenSize,
    offsetX: tokenSize / 2,
    offsetY: tokenSize / 2,
    x: 0,
    y: 0
  });
  
  // Adicionar ícone de visibilidade se o token não estiver visível
  if (!tokenData.visible) {
    const invisibleIcon = new Konva.Circle({
      radius: tokenSize / 6,
      fill: 'black',
      stroke: 'white',
      strokeWidth: 1,
      x: tokenSize / 2,
      y: -tokenSize / 6
    });
    
    const invisibleIconSlash = new Konva.Line({
      points: [tokenSize / 3, -tokenSize / 4, tokenSize / 1.5, -tokenSize / 12],
      stroke: 'white',
      strokeWidth: 1
    });
    
    tokenGroup.add(invisibleIcon, invisibleIconSlash);
  }
  
  // Adicionar círculo e texto ao grupo
  tokenGroup.add(tokenCircle, tokenText);
  
  // Adicionar eventos ao token
  tokenGroup.on('click', function(e) {
    e.cancelBubble = true;
    selectToken(tokenData.id);
  });
  
  tokenGroup.on('dragend', function() {
    const newX = Math.round(tokenGroup.x() / GRID_SIZE);
    const newY = Math.round(tokenGroup.y() / GRID_SIZE);
    
    // Atualizar posição do token
    tokenGroup.x(newX * GRID_SIZE);
    tokenGroup.y(newY * GRID_SIZE);
    
    // Atualizar dados do token
    const tokenIndex = tokens.findIndex(t => t.id === tokenData.id);
    if (tokenIndex !== -1) {
      tokens[tokenIndex].x = newX;
      tokens[tokenIndex].y = newY;
      
      if (selectedTokenId === tokenData.id) {
        updateSelectedTokenInfo();
      }
    }
    
    tokensLayer.batchDraw();
  });
  
  // Adicionar o token à camada
  tokensLayer.add(tokenGroup);
  tokensLayer.batchDraw();
  
  // Adicionar o token à lista de tokens
  tokens.push(tokenData);
  
  // Atualizar a lista de tokens na interface
  updateTokensList();
}

// Selecionar um token
function selectToken(tokenId) {
  // Remover seleção anterior
  if (selectedTokenId) {
    const prevToken = stage.findOne('#' + selectedTokenId);
    if (prevToken) {
      prevToken.findOne('Circle').strokeWidth(2);
    }
    
    // Remover classe 'selected' da lista
    const prevItem = document.querySelector(`.token-item[data-id="${selectedTokenId}"]`);
    if (prevItem) {
      prevItem.classList.remove('selected');
    }
  }
  
  // Definir novo token selecionado
  selectedTokenId = tokenId;
  
  // Destacar token selecionado
  if (selectedTokenId) {
    const token = stage.findOne('#' + selectedTokenId);
    if (token) {
      token.findOne('Circle').strokeWidth(4);
    }
    
    // Adicionar classe 'selected' ao item da lista
    const item = document.querySelector(`.token-item[data-id="${selectedTokenId}"]`);
    if (item) {
      item.classList.add('selected');
    }
    
    // Mostrar informações do token selecionado
    updateSelectedTokenInfo();
    document.getElementById('selectedTokenInfo').classList.remove('hidden');
  } else {
    document.getElementById('selectedTokenInfo').classList.add('hidden');
  }
  
  tokensLayer.batchDraw();
}

// Atualizar informações do token selecionado
function updateSelectedTokenInfo() {
  if (!selectedTokenId) return;
  
  const token = tokens.find(t => t.id === selectedTokenId);
  if (!token) return;
  
  document.getElementById('selectedTokenName').textContent = token.name;
  document.getElementById('selectedTokenPosition').textContent = `X: ${token.x}, Y: ${token.y}`;
  document.getElementById('selectedTokenSize').textContent = `${getSizeName(token.size)}`;
  
  const visibilityButton = document.getElementById('toggleVisibility');
  visibilityButton.textContent = token.visible ? 'Ocultar' : 'Mostrar';
  visibilityButton.className = token.visible ? 'fantasy-button secondary flex-1 text-sm' : 'fantasy-button primary flex-1 text-sm';
}

// Obter nome do tamanho do token
function getSizeName(size) {
  switch (size) {
    case '0.5': return 'Minúsculo';
    case '0.75': return 'Pequeno';
    case '1': return 'Médio';
    case '1.5': return 'Grande';
    case '2': return 'Enorme';
    case '3': return 'Colossal';
    default: return 'Médio';
  }
}

// Atualizar a lista de tokens na interface
function updateTokensList() {
  const tokensList = document.getElementById('tokensList');
  tokensList.innerHTML = '';
  
  tokens.forEach(token => {
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item flex justify-between items-center ' + (token.id === selectedTokenId ? 'selected' : '');
    tokenItem.setAttribute('data-id', token.id);
    
    tokenItem.innerHTML = `
      <div class="flex items-center">
        <div class="token-color" style="background-color: ${token.color}"></div>
        <span class="text-white">${token.name}</span>
      </div>
      <div class="text-xs text-fantasy-stone">${token.type}</div>
    `;
    
    tokenItem.addEventListener('click', () => selectToken(token.id));
    tokensList.appendChild(tokenItem);
  });
}

// Carregar lista de participantes
function loadParticipants() {
  // Simulação de participantes
  participants = [
    { id: 'p1', name: 'Jogador 1', role: 'player' },
    { id: 'p2', name: 'Jogador 2', role: 'player' },
    { id: 'p3', name: 'Mestre', role: 'gm' }
  ];
  
  // Atualizar lista de participantes na interface
  updateParticipantsList();
}

// Atualizar lista de participantes na interface
function updateParticipantsList() {
  const participantsList = document.getElementById('participantsList');
  participantsList.innerHTML = '';
  
  participants.forEach(participant => {
    const participantItem = document.createElement('div');
    participantItem.className = 'participant-item flex justify-between items-center';
    
    participantItem.innerHTML = `
      <span class="text-white">${participant.name}</span>
      <span class="text-xs px-2 py-1 rounded ${participant.role === 'gm' ? 'bg-fantasy-purple/20 text-fantasy-purple' : 'bg-fantasy-gold/20 text-fantasy-gold'}">
        ${participant.role === 'gm' ? 'Mestre' : 'Jogador'}
      </span>
    `;
    
    participantsList.appendChild(participantItem);
  });
}

// Configurar event listeners
function setupEventListeners() {
  // Eventos de zoom
  document.getElementById('zoomIn').addEventListener('click', zoomIn);
  document.getElementById('zoomOut').addEventListener('click', zoomOut);
  
  // Evento para toggle da grade
  document.getElementById('toggleGrid').addEventListener('click', toggleGrid);
  
  // Evento para adicionar token
  document.getElementById('addToken').addEventListener('click', showAddTokenModal);
  
  // Eventos de token selecionado
  document.getElementById('toggleVisibility').addEventListener('click', toggleTokenVisibility);
  document.getElementById('deleteToken').addEventListener('click', deleteSelectedToken);
  
  // Evento de formulário de token
  document.getElementById('tokenForm').addEventListener('submit', handleTokenFormSubmit);
  document.getElementById('closeTokenModal').addEventListener('click', hideAddTokenModal);
  
  // Eventos de sessão
  document.getElementById('pauseButton').addEventListener('click', toggleSessionPause);
  document.getElementById('endSessionButton').addEventListener('click', endSession);
  
  // Evento de redimensionamento da janela
  window.addEventListener('resize', handleResize);
  
  // Evento de zoom com roda do mouse
  stage.on('wheel', handleWheel);
  
  // Evento de clique no stage
  stage.on('click', function(e) {
    if (e.target === stage || e.target.getParent() === gridLayer) {
      selectToken(null);
    }
  });
}

// Função de zoom in
function zoomIn() {
  scale *= 1.2;
  applyZoom();
}

// Função de zoom out
function zoomOut() {
  scale *= 0.8;
  applyZoom();
}

// Aplicar zoom
function applyZoom() {
  stage.scale({ x: scale, y: scale });
  stage.batchDraw();
}

// Tratar evento de roda do mouse
function handleWheel(e) {
  e.evt.preventDefault();
  
  const oldScale = scale;
  const pointer = stage.getPointerPosition();
  
  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale
  };
  
  // Ajustar o zoom com base na direção da roda
  const direction = e.evt.deltaY > 0 ? 1 : -1;
  const newScale = direction > 0 ? oldScale * 0.9 : oldScale * 1.1;
  
  scale = newScale;
  
  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale
  };
  
  stage.scale({ x: newScale, y: newScale });
  stage.position(newPos);
  stage.batchDraw();
}

// Alternar visibilidade da grade
function toggleGrid() {
  gridVisible = !gridVisible;
  document.getElementById('toggleGrid').classList.toggle('bg-fantasy-purple/20', gridVisible);
  document.getElementById('toggleGrid').classList.toggle('bg-fantasy-dark/70', !gridVisible);
  drawGrid();
}

// Mostrar modal para adicionar token
function showAddTokenModal() {
  document.getElementById('addTokenModal').classList.remove('hidden');
}

// Ocultar modal para adicionar token
function hideAddTokenModal() {
  document.getElementById('addTokenModal').classList.add('hidden');
}

// Tratar envio do formulário de token
function handleTokenFormSubmit(e) {
  e.preventDefault();
  
  const tokenData = {
    id: 'token_' + Date.now(),
    name: document.getElementById('tokenName').value,
    type: document.getElementById('tokenType').value,
    color: document.getElementById('tokenColor').value,
    size: document.getElementById('tokenSize').value,
    x: parseInt(document.getElementById('tokenX').value),
    y: parseInt(document.getElementById('tokenY').value),
    visible: document.getElementById('tokenVisibility').checked
  };
  
  addTokenToMap(tokenData);
  hideAddTokenModal();
  createToast('Token adicionado com sucesso!', 'success');
}

// Alternar visibilidade do token selecionado
function toggleTokenVisibility() {
  if (!selectedTokenId) return;
  
  const tokenIndex = tokens.findIndex(t => t.id === selectedTokenId);
  if (tokenIndex === -1) return;
  
  tokens[tokenIndex].visible = !tokens[tokenIndex].visible;
  
  // Atualizar o token no mapa
  const tokenGroup = stage.findOne('#' + selectedTokenId);
  if (tokenGroup) {
    // Remover o token atual
    tokenGroup.destroy();
    tokensLayer.batchDraw();
    
    // Readicionar o token com a nova configuração
    addTokenToMap(tokens[tokenIndex]);
    selectToken(selectedTokenId);
  }
  
  updateSelectedTokenInfo();
}

// Excluir token selecionado
function deleteSelectedToken() {
  if (!selectedTokenId) return;
  
  // Remover o token da camada
  const tokenGroup = stage.findOne('#' + selectedTokenId);
  if (tokenGroup) {
    tokenGroup.destroy();
    tokensLayer.batchDraw();
  }
  
  // Remover o token da lista
  tokens = tokens.filter(t => t.id !== selectedTokenId);
  
  // Limpar seleção
  selectToken(null);
  
  // Atualizar lista de tokens
  updateTokensList();
  
  createToast('Token excluído com sucesso!', 'success');
}

// Tratar redimensionamento da janela
function handleResize() {
  const container = document.getElementById('tacticalMapContainer');
  stageWidth = container.clientWidth;
  stageHeight = container.clientHeight;
  
  stage.width(stageWidth);
  stage.height(stageHeight);
  
  drawGrid();
}

// Pausar/retomar sessão
function toggleSessionPause() {
  const pauseButton = document.getElementById('pauseButton');
  const isPaused = pauseButton.textContent === 'Retomar Sessão';
  
  if (isPaused) {
    pauseButton.textContent = 'Pausar Sessão';
    pauseButton.className = 'fantasy-button secondary';
    createToast('Sessão retomada!', 'success');
  } else {
    pauseButton.textContent = 'Retomar Sessão';
    pauseButton.className = 'fantasy-button primary';
    createToast('Sessão pausada!', 'success');
  }
}

// Encerrar sessão
function endSession() {
  if (confirm('Tem certeza que deseja encerrar esta sessão? Esta ação não pode ser desfeita.')) {
    createToast('Sessão encerrada com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'tables.html';
    }, 2000);
  }
}

// Criar toast de notificação
function createToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  
  toastMessage.textContent = message;
  
  if (type === 'success') {
    toastIcon.className = 'h-5 w-5 text-green-400';
    toastIcon.innerHTML = `
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    `;
  } else {
    toastIcon.className = 'h-5 w-5 text-red-400';
    toastIcon.innerHTML = `
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    `;
  }
  
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Verificar se o usuário está autenticado
async function getCurrentUser() {
  try {
    // Verificar se há uma sessão ativa no supabase
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return null;
  }
}
