**Documento de Tarefas e Melhorias para o Sistema RPG Companion**  
*(Versão para Desenvolvimento Interno)*  

---

### **1. Introdução**  
Este documento lista as tarefas prioritárias, correções e melhorias necessárias para o sistema do **RPG Companion**, com foco nas funcionalidades críticas para sessões presenciais de RPG. As tarefas são organizadas por módulos e prioridade técnica, considerando a experiência do mestre (DM) e dos jogadores durante o jogo ativo.

---

### **2. Tarefas Prioritárias para o Sistema**  

#### **A. Correções Críticas**  
| **Módulo**       | **Tarefa**                                                                                   | **Status** |  
|-------------------|---------------------------------------------------------------------------------------------|------------|  
| **Navegação**     | Corrigir redirecionamentos quebrados (ex: Biblioteca de NPCs → erro 404).                   | Pendente   |  
| **Combate**       | Implementar cálculo correto de distância no grid (1 quadrado = 5ft).                        | Pendente   |  
| **Sincronização** | Garantir atualização em tempo real do inventário entre jogadores e mestre.                  | Pendente   |  

#### **B. Finalização de Funcionalidades**  
| **Módulo**          | **Tarefa**                                                                                   | **Status** |  
|----------------------|---------------------------------------------------------------------------------------------|------------|  
| **Mapa Tático**      | Permitir arrastar tokens e aplicar Fog of War (névoa de guerra) controlável pelo mestre.     | Pendente   |  
| **Inventário**       | Implementar cálculo automático de peso e encumbrance (sobrecarga).                          | Pendente   |  
| **Áudio**            | Corrigir persistência do volume entre sessões e sincronizar playlists com eventos do jogo.  | Pendente   |  

---

### **3. Melhorias para a Experiência de Jogo**  

#### **A. Interface do Mestre (Durante o Jogo)**  
- **Dashboard de Controle Rápido:**  
  - [ ] Adicionar botão de "Rolagem Secreta" (d20 com resultado visível apenas ao mestre).  
  - [ ] Implementar barra de busca rápida para regras (ex: "Ataque de Oportunidade").  
  - [ ] Criar painel de status dos jogadores com HP, condições e recursos em tempo real.  

- **Mapa Tático:**  
  - [ ] Adicionar ferramentas de medição de área (ex: círculo para magias *Fireball*).  
  - [ ] Permitir upload de mapas customizados com grid ajustável (hexagonal/quadrado).  

#### **B. Interface do Jogador (Durante o Jogo)**  
- **Modo de Foco:**  
  - [ ] Implementar botão para ocultar UI não essencial (exceto HP e dados críticos).  
  - [ ] Adicionar gesto de "toque longo" para ver detalhes de itens/magias sem abrir menus.  

- **Ações Rápidas:**  
  - [ ] Criar atalho para rolagens contextuais (ex: "Percepção" → rola d20 + modificador).  
  - [ ] Vincular inventário a gestos (ex: arrastar item para o avatar → equipar).  

---

### **4. Requisitos Técnicos para o Sistema**  

#### **A. Backend**  
| **Tarefa**                                                                 | **Complexidade** |  
|----------------------------------------------------------------------------|------------------|  
| Revisar sincronização offline/online para evitar conflitos de dados.        | Alta             |  
| Otimizar consultas ao banco de dados para reduzir lag no carregamento.     | Média            |  
| Implementar criptografia de dados locais (ex: fichas de personagem).       | Alta             |  

#### **B. Frontend**  
| **Tarefa**                                                                 | **Complexidade** |  
|----------------------------------------------------------------------------|------------------|  
| Reduzir tempo de carregamento da ficha de personagem para <1 segundo.      | Alta             |  
| Corrigir dropdowns quebrados na criação de personagem (raças, classes).    | Baixa            |  

---

### **5. Validação do Sistema**  
#### **Checklist de Testes (Pré-Beta)**  
- **Combate:**  
  - [ ] Iniciativa atualizada automaticamente após rolagem.  
  - [ ] Modificadores de condições aplicados corretamente (ex: -2 em testes por envenenado).  

- **Inventário:**  
  - [ ] Peso total recalcula ao adicionar/remover itens.  
  - [ ] Itens equipados alteram atributos do personagem (ex: armadura aumenta CA).  

- **Sincronização:**  
  - [ ] Alterações no inventário do jogador refletem no dashboard do mestre em <2s.  

---

### **6. Considerações Futuras (Roadmap do Sistema)**  
- **Integrações Avançadas:**  
  - Suporte a dados físicos Bluetooth (ex: Pixels Dice).  
  - API para importação/exportação de campanhas em JSON.  

- **Otimizações:**  
  - Cache de mapas e recursos para reduzir consumo de memória.  
  - Sistema de *auto-save* contínuo para evitar perda de dados.  

---

### **7. Conclusão e Próximos Passos**  
Este documento deve ser usado como guia para priorizar tarefas de desenvolvimento. Recomenda-se:  
1. **Focar nas correções críticas** (Seção 2.A) para estabilizar o sistema.  
2. **Validar a interface de jogo** (Seção 3) com testes de usabilidade em grupo.  
3. **Atualizar o roadmap** conforme conclusão de marcos.  

**Nota:** A implementação destas tarefas requer revisão do código atual para identificar gargalos de performance e inconsistências na arquitetura modular.  

--- 

**Versão do Documento:** 1.1  
**Última Atualização:** [INSERIR DATA]  
**Responsável:** [INSERIR NOME DO GERENTE DE PROJETO]
