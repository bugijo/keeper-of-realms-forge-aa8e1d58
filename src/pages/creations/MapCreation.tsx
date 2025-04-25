
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

const MapCreation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && user) {
      const fetchMapDetails = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('maps')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          toast.error('Erro ao carregar detalhes do mapa');
          navigate('/maps');
        } else if (data) {
          setTitle(data.name);
          setDescription(data.description || '');
          setImageUrl(data.image_url || '');
        }
        setIsLoading(false);
      };

      fetchMapDetails();
    }
  }, [id, isEditing, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Você precisa estar logado para criar um mapa');
      return;
    }

    if (!title || !description) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      const mapData = {
        name: title,
        description,
        image_url: imageUrl,
        user_id: user.id
      };

      let result;
      if (isEditing) {
        result = await supabase
          .from('maps')
          .update(mapData)
          .eq('id', id)
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('maps')
          .insert(mapData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(`Mapa "${title}" ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      navigate('/maps');
    } catch (error: any) {
      toast.error(`Erro ao ${isEditing ? 'editar' : 'criar'} mapa: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 text-center">
          <p className="text-fantasy-stone">Carregando detalhes do mapa...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-medievalsharp text-fantasy-gold mb-4">
          {isEditing ? 'Editar Mapa' : 'Criar Novo Mapa'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="block text-sm font-medium text-gray-200">
              Título do Mapa
            </Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-200">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 p-2 w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-200">
              URL da Imagem
            </Label>
            <Input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 p-2 w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="primary">
            {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Mapa' : 'Criar Mapa')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/maps')}>
            Cancelar
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default MapCreation;
