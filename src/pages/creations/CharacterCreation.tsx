
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  ArrowLeft, Save, Wand2, Dices, User, Book, 
  Shield, Sword, Heart, Brain 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

// Dados para o modo fácil
const races = [
  { id: 'human', name: 'Humano', description: 'Versáteis e adaptáveis, +1 em todos os atributos' },
  { id: 'elf', name: 'Elfo', description: 'Graciosos e longevos, +2 DES, visão no escuro' },
  { id: 'dwarf', name: 'Anão', description: 'Robustos e resistentes, +2 CON, resistência a venenos' },
  { id: 'halfling', name: 'Halfling', description: 'Pequenos e sortudos, +2 DES, sorte halfling' },
  { id: 'tiefling', name: 'Tiefling', description: 'Descendentes de demônios, +2 CAR, +1 INT, resistência a fogo' },
  { id: 'dragonborn', name: 'Draconato', description: 'Descendentes de dragões, +2 FOR, +1 CAR, sopro de dragão' },
];

const classes = [
  { id: 'fighter', name: 'Guerreiro', description: 'Mestre em armas e combate' },
  { id: 'wizard', name: 'Mago', description: 'Conjurador de magias arcanas' },
  { id: 'cleric', name: 'Clérigo', description: 'Servo divino com poderes de cura' },
  { id: 'rogue', name: 'Ladino', description: 'Especialista em furtividade e habilidades' },
  { id: 'ranger', name: 'Patrulheiro', description: 'Caçador e rastreador da natureza' },
  { id: 'bard', name: 'Bardo', description: 'Artista inspirador com magia musical' },
];

const backgrounds = [
  { id: 'acolyte', name: 'Acólito', description: 'Servo de um templo ou ordem religiosa' },
  { id: 'criminal', name: 'Criminoso', description: 'Experiente no submundo do crime' },
  { id: 'noble', name: 'Nobre', description: 'Membro de uma família aristocrática' },
  { id: 'soldier', name: 'Soldado', description: 'Veterano de conflitos e batalhas' },
  { id: 'sage', name: 'Sábio', description: 'Estudioso e pesquisador' },
];

const CharacterCreation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [creationMode, setCreationMode] = useState<'easy' | 'classic' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Dados para o modo fácil
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  
  // Dados para o modo clássico
  const [classicCharacter, setClassicCharacter] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    background: '',
    alignment: '',
    equipment: [],
    spells: [],
    proficiencies: [],
    notes: ''
  });
  
  const steps = [
    { name: 'Raça', icon: User },
    { name: 'Classe', icon: Shield },
    { name: 'Detalhes', icon: Book },
    { name: 'Equipamento', icon: Sword },
    { name: 'Revisão', icon: Save }
  ];
  
  const generateRandomName = () => {
    const humanNames = ['João', 'Artur', 'Ricardo', 'Guilherme', 'Pedro', 'Lucas'];
    const elfNames = ['Legolas', 'Elrond', 'Thranduil', 'Galadriel', 'Arwen', 'Celeborn'];
    const dwarfNames = ['Gimli', 'Thorin', 'Balin', 'Dwalin', 'Durin', 'Gloin'];
    
    let namePool = humanNames;
    
    if (selectedRace === 'elf') namePool = elfNames;
    if (selectedRace === 'dwarf') namePool = dwarfNames;
    
    const randomIndex = Math.floor(Math.random() * namePool.length);
    setCharacterName(namePool[randomIndex]);
  };
  
  const saveCharacter = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para salvar um personagem');
      return;
    }
    
    try {
      const characterData = creationMode === 'easy' 
        ? {
            name: characterName,
            race: selectedRace,
            class: selectedClass,
            background: selectedBackground,
            level: 1,
            creation_mode: 'easy',
            user_id: currentUser.id
          }
        : {
            ...classicCharacter,
            creation_mode: 'classic',
            user_id: currentUser.id
          };
      
      const { error } = await supabase
        .from('characters')
        .insert(characterData);
      
      if (error) throw error;
      
      toast.success('Personagem salvo com sucesso!');
      navigate('/creations');
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      toast.error('Erro ao salvar personagem. Tente novamente.');
    }
  };
  
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };
  
  const rollDice = (sides = 20) => {
    const result = Math.floor(Math.random() * sides) + 1;
    toast(`🎲 Resultado: ${result}`, {
      position: 'bottom-center',
      icon: '🎲'
    });
    return result;
  };
  
  // Retorna para a tela de escolha de modo se nenhum modo foi selecionado
  if (!creationMode) {
    return (
      <MainLayout>
        <div className="container mx-auto pb-16">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate('/creations')}
              className="text-fantasy-purple hover:text-fantasy-gold transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-medievalsharp text-white">Criar Personagem</h1>
          </div>
          
          <p className="text-fantasy-stone text-center mb-8">
            Escolha o modo de criação que deseja utilizar
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="fantasy-card p-6 cursor-pointer"
              onClick={() => setCreationMode('easy')}
            >
              <Wand2 className="w-14 h-14 text-fantasy-gold mx-auto mb-4" />
              <h2 className="text-2xl font-medievalsharp text-center text-fantasy-purple mb-2">
                Modo Fácil
              </h2>
              <p className="text-center text-fantasy-stone">
                Crie seu personagem através de escolhas simples e guiadas.
                Ideal para iniciantes ou para criação rápida.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="fantasy-card p-6 cursor-pointer"
              onClick={() => setCreationMode('classic')}
            >
              <Book className="w-14 h-14 text-fantasy-gold mx-auto mb-4" />
              <h2 className="text-2xl font-medievalsharp text-center text-fantasy-purple mb-2">
                Modo Clássico
              </h2>
              <p className="text-center text-fantasy-stone">
                Preencha a ficha de personagem completa com todos os detalhes,
                atributos e habilidades. Para jogadores experientes.
              </p>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Modo fácil - criação passo a passo
  if (creationMode === 'easy') {
    return (
      <MainLayout>
        <div className="container mx-auto pb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentStep === 0 ? setCreationMode(null) : handlePrevStep()}
                className="text-fantasy-purple hover:text-fantasy-gold transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-medievalsharp text-white">Criar Personagem</h1>
            </div>
            
            <button 
              onClick={() => rollDice()} 
              className="fantasy-icon p-2"
              aria-label="Rolar dado"
            >
              <Dices className="text-fantasy-gold" size={20} />
            </button>
          </div>
          
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex justify-between items-center w-full">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`rounded-full p-2 ${
                      currentStep === index 
                        ? 'bg-fantasy-purple text-white' 
                        : currentStep > index 
                          ? 'bg-fantasy-gold text-fantasy-dark' 
                          : 'bg-fantasy-purple/20 text-fantasy-stone'
                    }`}
                  >
                    <step.icon size={16} />
                  </div>
                  <span className={`text-xs mt-1 ${
                    currentStep === index 
                      ? 'text-white' 
                      : currentStep > index 
                        ? 'text-fantasy-gold' 
                        : 'text-fantasy-stone'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-fantasy-dark/70 h-1 mt-2 mb-6">
              <div 
                className="bg-gradient-to-r from-fantasy-purple to-fantasy-gold h-full rounded-full"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Conteúdo dos passos */}
          {currentStep === 0 && (
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Escolha sua Raça</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {races.map((race) => (
                  <motion.div
                    key={race.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer border ${
                      selectedRace === race.id 
                        ? 'border-fantasy-gold bg-fantasy-purple/20' 
                        : 'border-fantasy-purple/20 bg-fantasy-dark/60'
                    }`}
                    onClick={() => setSelectedRace(race.id)}
                  >
                    <h3 className="text-lg font-medievalsharp text-white mb-1">{race.name}</h3>
                    <p className="text-sm text-fantasy-stone">{race.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="fantasy-button primary"
                  onClick={handleNextStep}
                  disabled={!selectedRace}
                >
                  Próximo Passo
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Escolha sua Classe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((characterClass) => (
                  <motion.div
                    key={characterClass.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer border ${
                      selectedClass === characterClass.id 
                        ? 'border-fantasy-gold bg-fantasy-purple/20' 
                        : 'border-fantasy-purple/20 bg-fantasy-dark/60'
                    }`}
                    onClick={() => setSelectedClass(characterClass.id)}
                  >
                    <h3 className="text-lg font-medievalsharp text-white mb-1">{characterClass.name}</h3>
                    <p className="text-sm text-fantasy-stone">{characterClass.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  className="fantasy-button secondary"
                  onClick={handlePrevStep}
                >
                  Voltar
                </button>
                <button
                  className="fantasy-button primary"
                  onClick={handleNextStep}
                  disabled={!selectedClass}
                >
                  Próximo Passo
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Detalhes do Personagem</h2>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Nome do Personagem</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="flex-1 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    placeholder="Digite o nome do seu personagem"
                  />
                  <button 
                    onClick={generateRandomName}
                    className="fantasy-button secondary"
                    disabled={!selectedRace}
                    title="Gerar nome aleatório baseado na raça"
                  >
                    <Wand2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Antecedente</label>
                <div className="grid grid-cols-1 gap-2">
                  {backgrounds.map((background) => (
                    <motion.div
                      key={background.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-3 rounded-lg cursor-pointer border ${
                        selectedBackground === background.id 
                          ? 'border-fantasy-gold bg-fantasy-purple/20' 
                          : 'border-fantasy-purple/20 bg-fantasy-dark/60'
                      }`}
                      onClick={() => setSelectedBackground(background.id)}
                    >
                      <h3 className="text-md font-medievalsharp text-white">{background.name}</h3>
                      <p className="text-xs text-fantasy-stone">{background.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  className="fantasy-button secondary"
                  onClick={handlePrevStep}
                >
                  Voltar
                </button>
                <button
                  className="fantasy-button primary"
                  onClick={handleNextStep}
                  disabled={!characterName || !selectedBackground}
                >
                  Próximo Passo
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Equipamento</h2>
              
              <p className="text-fantasy-stone mb-4">
                Com base na sua classe ({classes.find(c => c.id === selectedClass)?.name}), 
                você receberá o equipamento padrão inicial.
              </p>
              
              <div className="bg-fantasy-dark/50 border border-fantasy-purple/20 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medievalsharp text-white mb-2">Equipamento Inicial</h3>
                <ul className="space-y-2">
                  {selectedClass === 'fighter' && (
                    <>
                      <li className="text-fantasy-stone flex items-center gap-2">
                        <Sword size={16} className="text-fantasy-gold" />
                        Espada longa
                      </li>
                      <li className="text-fantasy-stone flex items-center gap-2">
                        <Shield size={16} className="text-fantasy-gold" />
                        Escudo
                      </li>
                      <li className="text-fantasy-stone flex items-center gap-2">
                        <User size={16} className="text-fantasy-gold" />
                        Armadura de malha
                      </li>
                    </>
                  )}
                  
                  {selectedClass === 'wizard' && (
                    <>
                      <li className="text-fantasy-stone flex items-center gap-2">
                        <Wand2 size={16} className="text-fantasy-gold" />
                        Cajado arcano
                      </li>
                      <li className="text-fantasy-stone flex items-center gap-2">
                        <Book size={16} className="text-fantasy-gold" />
                        Livro de magias
                      </li>
                      <li className="text-fantasy-stone flex items-center gap-2">
                        <User size={16} className="text-fantasy-gold" />
                        Vestes de mago
                      </li>
                    </>
                  )}
                  
                  {(selectedClass !== 'fighter' && selectedClass !== 'wizard') && (
                    <li className="text-fantasy-stone">Equipamento padrão da classe selecionada</li>
                  )}
                </ul>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  className="fantasy-button secondary"
                  onClick={handlePrevStep}
                >
                  Voltar
                </button>
                <button
                  className="fantasy-button primary"
                  onClick={handleNextStep}
                >
                  Próximo Passo
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Revisão Final</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-fantasy-dark/50 border border-fantasy-purple/20 rounded-lg p-4">
                  <h3 className="text-lg font-medievalsharp text-white mb-2">Informações Básicas</h3>
                  <p className="text-fantasy-stone"><strong>Nome:</strong> {characterName}</p>
                  <p className="text-fantasy-stone"><strong>Raça:</strong> {races.find(r => r.id === selectedRace)?.name}</p>
                  <p className="text-fantasy-stone"><strong>Classe:</strong> {classes.find(c => c.id === selectedClass)?.name}</p>
                  <p className="text-fantasy-stone"><strong>Antecedente:</strong> {backgrounds.find(b => b.id === selectedBackground)?.name}</p>
                </div>
                
                <div className="bg-fantasy-dark/50 border border-fantasy-purple/20 rounded-lg p-4">
                  <h3 className="text-lg font-medievalsharp text-white mb-2">Atributos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-fantasy-purple/20 flex items-center justify-center mx-auto">
                        <Heart size={16} className="text-fantasy-gold" />
                      </div>
                      <p className="text-xs text-fantasy-stone mt-1">FOR 10</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-fantasy-purple/20 flex items-center justify-center mx-auto">
                        <Heart size={16} className="text-fantasy-gold" />
                      </div>
                      <p className="text-xs text-fantasy-stone mt-1">DES 10</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-fantasy-purple/20 flex items-center justify-center mx-auto">
                        <Heart size={16} className="text-fantasy-gold" />
                      </div>
                      <p className="text-xs text-fantasy-stone mt-1">CON 10</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-fantasy-purple/20 flex items-center justify-center mx-auto">
                        <Brain size={16} className="text-fantasy-gold" />
                      </div>
                      <p className="text-xs text-fantasy-stone mt-1">INT 10</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-fantasy-purple/20 flex items-center justify-center mx-auto">
                        <Brain size={16} className="text-fantasy-gold" />
                      </div>
                      <p className="text-xs text-fantasy-stone mt-1">SAB 10</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-fantasy-purple/20 flex items-center justify-center mx-auto">
                        <Brain size={16} className="text-fantasy-gold" />
                      </div>
                      <p className="text-xs text-fantasy-stone mt-1">CAR 10</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
                onClick={saveCharacter}
              >
                <Save size={18} />
                Salvar Personagem
              </motion.button>
              
              <div className="mt-4 flex justify-center">
                <button
                  className="fantasy-button secondary"
                  onClick={handlePrevStep}
                >
                  Voltar e Editar
                </button>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }
  
  // Modo clássico - ficha completa
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreationMode(null)}
              className="text-fantasy-purple hover:text-fantasy-gold transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-medievalsharp text-white">Ficha de Personagem</h1>
          </div>
          
          <button 
            onClick={() => rollDice()} 
            className="fantasy-icon p-2"
            aria-label="Rolar dado"
          >
            <Dices className="text-fantasy-gold" size={20} />
          </button>
        </div>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-fantasy-dark/70 border-b border-fantasy-purple/30 p-0 rounded-none w-full flex justify-start overflow-x-auto">
            <TabsTrigger 
              value="details" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Detalhes
            </TabsTrigger>
            <TabsTrigger 
              value="attributes" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Atributos
            </TabsTrigger>
            <TabsTrigger 
              value="equipment" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Equipamento
            </TabsTrigger>
            <TabsTrigger 
              value="spells" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Magias
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Anotações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <div className="fantasy-card p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1">Nome do Personagem</label>
                  <input
                    type="text"
                    value={classicCharacter.name}
                    onChange={(e) => setClassicCharacter({...classicCharacter, name: e.target.value})}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                  />
                  
                  <label className="block text-white mb-1">Raça</label>
                  <input
                    type="text"
                    value={classicCharacter.race}
                    onChange={(e) => setClassicCharacter({...classicCharacter, race: e.target.value})}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                  />
                  
                  <label className="block text-white mb-1">Classe</label>
                  <input
                    type="text"
                    value={classicCharacter.class}
                    onChange={(e) => setClassicCharacter({...classicCharacter, class: e.target.value})}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-1">Nível</label>
                  <input
                    type="number"
                    value={classicCharacter.level}
                    onChange={(e) => setClassicCharacter({...classicCharacter, level: parseInt(e.target.value) || 1})}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                    min={1}
                    max={20}
                  />
                  
                  <label className="block text-white mb-1">Antecedente</label>
                  <input
                    type="text"
                    value={classicCharacter.background}
                    onChange={(e) => setClassicCharacter({...classicCharacter, background: e.target.value})}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                  />
                  
                  <label className="block text-white mb-1">Tendência</label>
                  <input
                    type="text"
                    value={classicCharacter.alignment}
                    onChange={(e) => setClassicCharacter({...classicCharacter, alignment: e.target.value})}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attributes" className="pt-4">
            <div className="fantasy-card p-4">
              <h3 className="text-lg font-medievalsharp text-fantasy-purple mb-4">Atributos</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(classicCharacter.attributes).map(([attr, value]) => (
                  <div key={attr} className="bg-fantasy-dark/50 rounded-lg p-3 text-center">
                    <h4 className="text-md font-medievalsharp text-white capitalize mb-2">
                      {attr === 'strength' ? 'Força' :
                       attr === 'dexterity' ? 'Destreza' :
                       attr === 'constitution' ? 'Constituição' :
                       attr === 'intelligence' ? 'Inteligência' :
                       attr === 'wisdom' ? 'Sabedoria' :
                       'Carisma'}
                    </h4>
                    <div className="flex items-center justify-center">
                      <button
                        className="fantasy-icon p-1"
                        onClick={() => {
                          const newAttributes = {...classicCharacter.attributes};
                          newAttributes[attr as keyof typeof classicCharacter.attributes] = Math.max(1, value - 1);
                          setClassicCharacter({...classicCharacter, attributes: newAttributes});
                        }}
                      >
                        -
                      </button>
                      <div className="mx-2 w-10 h-10 bg-fantasy-purple/30 rounded-full flex items-center justify-center">
                        <span className="text-fantasy-gold font-medievalsharp">{value}</span>
                      </div>
                      <button
                        className="fantasy-icon p-1"
                        onClick={() => {
                          const newAttributes = {...classicCharacter.attributes};
                          newAttributes[attr as keyof typeof classicCharacter.attributes] = Math.min(20, value + 1);
                          setClassicCharacter({...classicCharacter, attributes: newAttributes});
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xs text-fantasy-stone mt-2">
                      Modificador: {Math.floor((value - 10) / 2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button
                  className="fantasy-button secondary"
                  onClick={() => {
                    // Rolar 4d6, descartar o menor valor, para cada atributo
                    const rollAttribute = () => {
                      const rolls = [
                        Math.floor(Math.random() * 6) + 1,
                        Math.floor(Math.random() * 6) + 1,
                        Math.floor(Math.random() * 6) + 1,
                        Math.floor(Math.random() * 6) + 1
                      ];
                      rolls.sort((a, b) => a - b);
                      return rolls.slice(1).reduce((sum, roll) => sum + roll, 0);
                    };
                    
                    const newAttributes = {
                      strength: rollAttribute(),
                      dexterity: rollAttribute(),
                      constitution: rollAttribute(),
                      intelligence: rollAttribute(),
                      wisdom: rollAttribute(),
                      charisma: rollAttribute()
                    };
                    
                    setClassicCharacter({...classicCharacter, attributes: newAttributes});
                    toast('🎲 Atributos rolados!', {
                      position: 'bottom-center',
                      icon: '🎲'
                    });
                  }}
                >
                  Rolar Atributos (4d6)
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="equipment" className="pt-4">
            <div className="fantasy-card p-4">
              <h3 className="text-lg font-medievalsharp text-fantasy-purple mb-4">Equipamento</h3>
              <p className="text-fantasy-stone mb-4">
                Adicione os equipamentos e itens do seu personagem.
              </p>
              
              <textarea
                className="w-full h-64 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                placeholder="Liste seu equipamento aqui..."
              ></textarea>
            </div>
          </TabsContent>
          
          <TabsContent value="spells" className="pt-4">
            <div className="fantasy-card p-4">
              <h3 className="text-lg font-medievalsharp text-fantasy-purple mb-4">Magias</h3>
              <p className="text-fantasy-stone mb-4">
                Adicione as magias conhecidas pelo seu personagem.
              </p>
              
              <textarea
                className="w-full h-64 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                placeholder="Liste suas magias aqui..."
              ></textarea>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="pt-4">
            <div className="fantasy-card p-4">
              <h3 className="text-lg font-medievalsharp text-fantasy-purple mb-4">Anotações</h3>
              <p className="text-fantasy-stone mb-4">
                Adicione anotações e informações adicionais sobre seu personagem.
              </p>
              
              <textarea
                className="w-full h-64 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 mb-4"
                placeholder="Escreva as anotações do seu personagem aqui..."
                value={classicCharacter.notes}
                onChange={(e) => setClassicCharacter({...classicCharacter, notes: e.target.value})}
              ></textarea>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
            onClick={saveCharacter}
          >
            <Save size={18} />
            Salvar Personagem
          </motion.button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CharacterCreation;
