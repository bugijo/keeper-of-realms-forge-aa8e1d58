
import { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Image, Trash2, MapPin, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const MapCreation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mapName, setMapName] = useState('');
  const [mapDescription, setMapDescription] = useState('');
  const [mapImage, setMapImage] = useState<File | null>(null);
  const [mapPreview, setMapPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Verificar tamanho (limite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem é muito grande, o limite é 5MB');
      return;
    }

    setMapImage(file);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setMapPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Verificar tamanho (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem é muito grande, o limite é 5MB');
        return;
      }

      setMapImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setMapPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setMapImage(null);
    setMapPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveMap = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para salvar um mapa');
      return;
    }

    if (!mapName.trim()) {
      toast.error('Por favor, dê um nome ao seu mapa');
      return;
    }

    if (!mapImage) {
      toast.error('Por favor, faça upload de uma imagem para o mapa');
      return;
    }

    try {
      setIsUploading(true);

      // 1. Fazer upload da imagem para o Storage do Supabase
      const filename = `${Date.now()}_${mapImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('maps')
        .upload(`${currentUser.id}/${filename}`, mapImage);

      if (uploadError) throw uploadError;

      // 2. Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('maps')
        .getPublicUrl(`${currentUser.id}/${filename}`);

      // 3. Salvar os metadados do mapa no banco de dados
      const { error: insertError } = await supabase
        .from('maps')
        .insert({
          name: mapName,
          description: mapDescription,
          image_url: urlData.publicUrl,
          user_id: currentUser.id
        });

      if (insertError) throw insertError;

      toast.success('Mapa salvo com sucesso!');
      navigate('/creations');
    } catch (error) {
      console.error('Erro ao salvar mapa:', error);
      toast.error('Erro ao salvar mapa. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

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
          <h1 className="text-2xl font-medievalsharp text-white">Criar Mapa</h1>
        </div>
        
        <div className="fantasy-card p-4 mb-6">
          <div className="mb-4">
            <label className="block text-white mb-2">Nome do Mapa</label>
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="Digite um nome para seu mapa"
              className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white mb-2">Descrição (opcional)</label>
            <textarea
              value={mapDescription}
              onChange={(e) => setMapDescription(e.target.value)}
              placeholder="Adicione uma descrição para o seu mapa..."
              className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[100px]"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white mb-2">Imagem do Mapa</label>
            
            {!mapPreview ? (
              <div 
                className="border-2 border-dashed border-fantasy-purple/30 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="text-fantasy-purple mb-4" size={40} />
                <p className="text-fantasy-stone text-center mb-2">
                  Arraste e solte sua imagem aqui, ou clique para selecionar
                </p>
                <p className="text-xs text-fantasy-stone/70 text-center">
                  Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-fantasy-purple/30">
                <img 
                  src={mapPreview} 
                  alt="Preview do mapa" 
                  className="w-full object-contain max-h-[400px]"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={removeImage}
                    className="p-2 bg-red-600/80 rounded-full hover:bg-red-600 transition-colors"
                    title="Remover imagem"
                  >
                    <Trash2 size={18} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medievalsharp text-fantasy-purple">Ferramentas</h3>
            
            <div className="flex gap-2">
              <button className="fantasy-button secondary flex items-center gap-1">
                <Download size={16} />
                <span className="text-sm">Baixar</span>
              </button>
              
              <button className="fantasy-button secondary flex items-center gap-1">
                <MapPin size={16} />
                <span className="text-sm">Marcar Pontos</span>
              </button>
            </div>
          </div>
          
          <p className="text-fantasy-stone text-sm mb-6">
            Dica: Para uma melhor experiência, você pode editar seu mapa em um programa de edição 
            de imagens antes de fazer o upload, adicionando detalhes e marcadores.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
          onClick={saveMap}
          disabled={isUploading}
        >
          {isUploading ? 'Salvando...' : (
            <>
              <Save size={18} />
              Salvar Mapa
            </>
          )}
        </motion.button>
      </div>
    </MainLayout>
  );
};

export default MapCreation;
