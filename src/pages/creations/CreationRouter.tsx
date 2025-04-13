
import { Routes, Route } from 'react-router-dom';
import CharacterCreation from './CharacterCreation';
import StoryCreation from './StoryCreation';
import MapCreation from './MapCreation';

const CreationRouter = () => {
  return (
    <Routes>
      <Route path="/characters" element={<CharacterCreation />} />
      <Route path="/stories" element={<StoryCreation />} />
      <Route path="/maps" element={<MapCreation />} />
      {/* Adicione outras rotas de criação conforme necessário */}
    </Routes>
  );
};

export default CreationRouter;
