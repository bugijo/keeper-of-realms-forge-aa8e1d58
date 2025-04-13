
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Wand2, Book, ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const storyTemplates = [
  {
    id: 'quest',
    name: 'Missão de Aventura',
    description: 'Uma missão completa com objetivos, desafios e recompensas',
    structure: [
      { title: 'Nome da Missão', type: 'input' },
      { title: 'Gancho Inicial', type: 'textarea', placeholder: 'Como os jogadores descobrem a missão?' },
      { title: 'Objetivo Principal', type: 'textarea', placeholder: 'O que os jogadores precisam alcançar?' },
      { title: 'Desafios', type: 'textarea', placeholder: 'Que obstáculos os jogadores encontrarão?' },
      { title: 'Recompensas', type: 'textarea', placeholder: 'O que os jogadores ganham ao completar a missão?' },
    ]
  },
  {
    id: 'backstory',
    name: 'História de Personagem',
    description: 'Desenvolva o passado e motivações de um personagem',
    structure: [
      { title: 'Nome do Personagem', type: 'input' },
      { title: 'Origem', type: 'textarea', placeholder: 'De onde o personagem vem?' },
      { title: 'Eventos Importantes', type: 'textarea', placeholder: 'Quais eventos moldaram o personagem?' },
      { title: 'Motivações', type: 'textarea', placeholder: 'O que motiva o personagem?' },
      { title: 'Segredos', type: 'textarea', placeholder: 'Que segredos o personagem esconde?' },
    ]
  },
  {
    id: 'location',
    name: 'Descrição de Local',
    description: 'Crie um lugar memorável para suas aventuras',
    structure: [
      { title: 'Nome do Local', type: 'input' },
      { title: 'Aparência', type: 'textarea', placeholder: 'Como o local se parece?' },
      { title: 'História', type: 'textarea', placeholder: 'Qual a história deste local?' },
      { title: 'Habitantes', type: 'textarea', placeholder: 'Quem vive ou frequenta este local?' },
      { title: 'Segredos e Tesouros', type: 'textarea', placeholder: 'O que está escondido neste local?' },
    ]
  },
];

const StoryCreation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [creationMode, setCreationMode] = useState<'easy' | 'classic' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [storyData, setStoryData] = useState<Record<string, string>>({});
  const [classicStory, setClassicStory] = useState({
    title: '',
    content: '',
    type: 'custom',
    tags: []
  });

  const handleStoryDataChange = (field: string, value: string) => {
    setStoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveStory = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para salvar uma história');
      return;
    }

    try {
      const storyToSave = creationMode === 'easy'
        ? {
            title: storyData['Nome da Missão'] || storyData['Nome do Personagem'] || storyData['Nome do Local'] || 'História sem título',
            content: JSON.stringify(storyData),
            type: selectedTemplate,
            user_id: currentUser.id,
            creation_mode: 'easy'
          }
        : {
            title: classicStory.title,
            content: classicStory.content,
            type: 'custom',
            user_id: currentUser.id,
            creation_mode: 'classic'
          };

      const { error } = await supabase
        .from('stories')
        .insert(storyToSave);

      if (error) throw error;

      toast.success('História salva com sucesso!');
      navigate('/creations');
    } catch (error) {
      console.error('Erro ao salvar história:', error);
      toast.error('Erro ao salvar história. Tente novamente.');
    }
  };

  const generateIdea = (field: string) => {
    const ideas = {
      'Gancho Inicial': [
        'Um misterioso estranho aborda os aventureiros em uma taverna...',
        'Um cartaz de recompensa é visto no quadro de avisos da cidade...',
        'Os personagens encontram um mapa antigo durante suas viagens...',
        'Um amigo de infância de um dos personagens pede ajuda...'
      ],
      'Objetivo Principal': [
        'Recuperar um artefato mágico de um templo em ruínas',
        'Resgatar um nobre sequestrado por cultistas',
        'Investigar o desaparecimento de moradores locais',
        'Derrotar um monstro que aterroriza uma vila'
      ],
      'Desafios': [
        'Um labirinto cheio de armadilhas e enigmas',
        'Confrontos com monstros e sentinelas hostis',
        'Negociações difíceis com facções rivais',
        'Condições climáticas extremas durante a jornada'
      ],
      'Origem': [
        'Nascido em uma pequena vila na fronteira do reino',
        'Criado em um templo dedicado a uma divindade misteriosa',
        'Órfão das ruas da capital, sobrevivendo com esperteza',
        'Membro de uma nobre família caída em desgraça'
      ],
      'Aparência': [
        'Castelo antigo coberto por hera e musgo, com torres parcialmente desmoronadas',
        'Caverna luminosa com cristais mágicos irradiando luz colorida',
        'Floresta densa onde as árvores parecem se mover e observar os intrusos',
        'Vila costeira construída sobre as costas de uma tartaruga gigante adormecida'
      ]
    };

    const fieldIdeas = ideas[field as keyof typeof ideas];
    if (fieldIdeas) {
      const randomIdea = fieldIdeas[Math.floor(Math.random() * fieldIdeas.length)];
      handleStoryDataChange(field, randomIdea);
      toast(`💡 Ideia gerada para ${field}`, {
        position: 'bottom-center',
      });
    }
  };

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
            <h1 className="text-2xl font-medievalsharp text-white">Criar História</h1>
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
                Crie sua história usando modelos pré-definidos com estrutura guiada.
                Ideal para iniciantes ou criação rápida.
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
                Crie sua história em formato livre, com total controle sobre o conteúdo.
                Para narradores experientes ou histórias mais complexas.
              </p>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (creationMode === 'easy' && !selectedTemplate) {
    return (
      <MainLayout>
        <div className="container mx-auto pb-16">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setCreationMode(null)}
              className="text-fantasy-purple hover:text-fantasy-gold transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-medievalsharp text-white">Escolher Modelo</h1>
          </div>
          
          <p className="text-fantasy-stone text-center mb-8">
            Selecione um modelo para sua história
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="fantasy-card p-6 cursor-pointer"
                onClick={() => setSelectedTemplate(template.id)}
              >
                {template.id === 'quest' && <ScrollText className="w-14 h-14 text-fantasy-gold mx-auto mb-4" />}
                {template.id === 'backstory' && <User className="w-14 h-14 text-fantasy-gold mx-auto mb-4" />}
                {template.id === 'location' && <MapPin className="w-14 h-14 text-fantasy-gold mx-auto mb-4" />}
                <h2 className="text-xl font-medievalsharp text-center text-fantasy-purple mb-2">
                  {template.name}
                </h2>
                <p className="text-center text-fantasy-stone">
                  {template.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (creationMode === 'easy' && selectedTemplate) {
    const template = storyTemplates.find(t => t.id === selectedTemplate);
    
    if (!template) return null;
    
    return (
      <MainLayout>
        <div className="container mx-auto pb-16">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-fantasy-purple hover:text-fantasy-gold transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-medievalsharp text-white">{template.name}</h1>
          </div>
          
          <div className="fantasy-card p-4 mb-6">
            {template.structure.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-white mb-2">{field.title}</label>
                <div className="flex items-center gap-2">
                  {field.type === 'input' ? (
                    <input
                      type="text"
                      value={storyData[field.title] || ''}
                      onChange={(e) => handleStoryDataChange(field.title, e.target.value)}
                      placeholder={field.placeholder}
                      className="flex-1 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    />
                  ) : (
                    <Textarea
                      value={storyData[field.title] || ''}
                      onChange={(e) => handleStoryDataChange(field.title, e.target.value)}
                      placeholder={field.placeholder}
                      className="flex-1 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg min-h-[100px]"
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <button 
                      onClick={() => generateIdea(field.title)}
                      className="fantasy-button secondary"
                      title="Gerar ideia aleatória"
                    >
                      <Wand2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
            onClick={saveStory}
          >
            <Save size={18} />
            Salvar História
          </motion.button>
        </div>
      </MainLayout>
    );
  }

  // Modo clássico
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setCreationMode(null)}
            className="text-fantasy-purple hover:text-fantasy-gold transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-medievalsharp text-white">Criar História</h1>
        </div>
        
        <div className="fantasy-card p-4 mb-6">
          <div className="mb-4">
            <label className="block text-white mb-2">Título da História</label>
            <input
              type="text"
              value={classicStory.title}
              onChange={(e) => setClassicStory({...classicStory, title: e.target.value})}
              placeholder="Digite um título para sua história"
              className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-white mb-2">Conteúdo</label>
            <Textarea
              value={classicStory.content}
              onChange={(e) => setClassicStory({...classicStory, content: e.target.value})}
              placeholder="Escreva sua história aqui..."
              className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg min-h-[300px]"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-white mb-2">Tags (opcional)</label>
            <input
              type="text"
              placeholder="Separe as tags por vírgula (ex: aventura, dungeon, tesouro)"
              className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
              onChange={(e) => setClassicStory({
                ...classicStory, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
          onClick={saveStory}
        >
          <Save size={18} />
          Salvar História
        </motion.button>
      </div>
    </MainLayout>
  );
};

export default StoryCreation;
