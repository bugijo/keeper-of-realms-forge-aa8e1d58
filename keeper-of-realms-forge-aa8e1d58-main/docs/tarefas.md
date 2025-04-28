**Documento de Tarefas e Melhorias para o Dungeon Kreeper**  
*(Versão para Desenvolvimento Interno)*  

---

### **1. Introdução**  
Este documento lista as tarefas prioritárias, correções e melhorias necessárias para o sistema **Dungeon Kreeper**, com foco nas funcionalidades críticas para sessões de RPG. As tarefas são organizadas por módulos e prioridade técnica, considerando a experiência do mestre (DM) e dos jogadores durante o jogo.

---

### **2. Tarefas Prioritárias para o Sistema**  

#### **A. Correções Críticas**  
| **Módulo**       | **Tarefa**                                                                                   | **Status** |  
|-------------------|---------------------------------------------------------------------------------------------|------------|  
| **Navegação**     | Corrigir redirecionamentos quebrados (ex: Biblioteca de NPCs → erro 404).                   | Pendente   |  
| **Combate**       | Implementar cálculo correto de distância no grid (1 quadrado = 5ft).                        | Pendente   |  
| **Sincronização** | Garantir atualização em tempo real do inventário entre jogadores e mestre.                  | Em Progresso |  

#### **B. Finalização de Funcionalidades**  
| **Módulo**          | **Tarefa**                                                                                   | **Status** |  
|----------------------|---------------------------------------------------------------------------------------------|------------|  
| **Mapa Tático**      | Permitir arrastar tokens e aplicar Fog of War (névoa de guerra) controlável pelo mestre.     | Em Progresso |  
| **Inventário**       | Implementar cálculo automático de peso e encumbrance (sobrecarga).                          | Pendente   |  
| **Áudio**            | Implementar sistema de áudio para ambientação com playlists.                                | Pendente   |  
| **Sessões**          | Sistema de agendamento e gerenciamento de sessões.                                          | Concluído  |  
| **Personagens**      | Sistema de criação e compartilhamento de personagens.                                       | Concluído  |  

---

### **3. Melhorias para a Experiência de Jogo**  

#### **A. Interface do Mestre (Durante o Jogo)**  
- **Dashboard de Controle Rápido:**  
  - [ ] Adicionar botão de "Rolagem Secreta" (d20 com resultado visível apenas ao mestre).  
  - [ ] Implementar barra de busca rápida para regras (ex: "Ataque de Oportunidade").  
  - [x] Criar painel de status dos jogadores com informações básicas.  
  - [ ] Implementar painel de status com HP, condições e recursos em tempo real.  

- **Mapa Tático:**  
  - [ ] Adicionar ferramentas de medição de área (ex: círculo para magias *Fireball*).  
  - [ ] Permitir upload de mapas customizados com grid ajustável (hexagonal/quadrado).  
  - [x] Implementar sistema básico de tokens no mapa.  
  - [ ] Aprimorar sistema de Fog of War com controles mais precisos.  

#### **B. Interface do Jogador (Durante o Jogo)**  
- **Modo de Foco:**  
  - [ ] Implementar botão para ocultar UI não essencial (exceto HP e dados críticos).  
  - [ ] Adicionar visualização rápida para detalhes de itens/magias sem abrir menus.  

- **Ações Rápidas:**  
  - [ ] Criar atalho para rolagens contextuais (ex: "Percepção" → rola d20 + modificador).  
  - [x] Implementar sistema básico de inventário.  
  - [ ] Vincular inventário a ações rápidas (ex: arrastar item para o avatar → equipar).  

---

### **4. Requisitos Técnicos para o Sistema**  

#### **A. Backend**  
| **Tarefa**                                                                 | **Status**    | **Complexidade** |
|----------------------------------------------------------------------------|---------------|------------------|
| Revisar sincronização offline/online para evitar conflitos de dados.        | Pendente      | Alta             |
| Otimizar consultas ao banco de dados para reduzir lag no carregamento.     | Em Progresso  | Média            |
| Implementar sistema de tempo real para atualizações do mapa tático.        | Em Progresso  | Alta             |

#### **B. Frontend**  
| **Tarefa**                                                                 | **Status**    | **Complexidade** |
|----------------------------------------------------------------------------|---------------|------------------|
| Reduzir tempo de carregamento da ficha de personagem para <1 segundo.      | Pendente      | Alta             |
| Melhorar responsividade da interface para dispositivos móveis.             | Em Progresso  | Média            |
| Implementar tema visual consistente em todos os componentes.               | Concluído     | Média            |

---

### **5. Validação do Sistema**  
#### **Checklist de Testes (Pré-Beta)**  
- **Combate:**  
  - [ ] Iniciativa atualizada automaticamente após rolagem.  
  - [ ] Modificadores de condições aplicados corretamente (ex: -2 em testes por envenenado).  
  - [x] Sistema básico de combate com turnos implementado.  

- **Inventário:**  
  - [ ] Peso total recalcula ao adicionar/remover itens.  
  - [ ] Itens equipados alteram atributos do personagem (ex: armadura aumenta CA).  
  - [x] Transferência de itens entre personagens implementada.  

- **Sincronização:**  
  - [x] Alterações no mapa tático visíveis para todos os jogadores.  
  - [ ] Alterações no inventário do jogador refletem no dashboard do mestre em <2s.  

---

### **6. Considerações Futuras (Roadmap do Sistema)**  
- **Integrações Avançadas:**  
  - Suporte a dados físicos Bluetooth (ex: Pixels Dice).  
  - API para importação/exportação de campanhas em JSON.  
  - Integração com VTTs populares (Roll20, Foundry).  

- **Otimizações:**  
  - Cache de mapas e recursos para reduzir consumo de memória.  
  - Sistema de *auto-save* contínuo para evitar perda de dados.  
  - Modo offline para jogos sem conexão à internet.  

---

### **7. Conclusão e Próximos Passos**  
Este documento deve ser usado como guia para priorizar tarefas de desenvolvimento. Recomenda-se:  
1. **Focar nas correções críticas** (Seção 2.A) para estabilizar o sistema.  
2. **Completar o mapa tático com Fog of War** como prioridade alta.  
3. **Implementar sistema de áudio** para melhorar a experiência de jogo.  
4. **Validar a interface de jogo** (Seção 3) com testes de usabilidade em grupo.  
5. **Atualizar o roadmap** conforme conclusão de marcos.  

**Nota:** A implementação destas tarefas requer revisão do código atual para identificar gargalos de performance e inconsistências na arquitetura modular.  

--- 

**Versão do Documento:** 1.2  
**Última Atualização:** 2023-11-15  
**Responsável:** Equipe Dungeon Kreeper
