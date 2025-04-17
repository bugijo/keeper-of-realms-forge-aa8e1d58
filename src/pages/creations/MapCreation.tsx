import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const MapCreation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Simular a criação/edição do mapa
      toast.success(`Mapa "${title}" ${isEditing ? 'editado' : 'criado'} com sucesso!`);
      navigate('/maps');
    } catch (error: any) {
      toast.error(`Erro ao ${isEditing ? 'editar' : 'criar'} mapa: ${error.message}`);
    }
  };

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
          <Button type="submit" className="primary">
            {isEditing ? 'Salvar Mapa' : 'Criar Mapa'}
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
