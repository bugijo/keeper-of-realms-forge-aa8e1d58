
import MainLayout from "@/components/layout/MainLayout";
import { Search, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const exampleTable = {
  name: "Reinos de Eldoria",
  id: "123456",
  dm: "Carlos Magno",
  nextSession: {
    date: "15/06/2024",
    time: "19:00 - 22:00"
  },
  players: {
    current: 3,
    max: 5
  },
  synopsis: "Uma antiga profecia ressurge nas terras de Eldoria. Heróis de diferentes reinos devem se unir para enfrentar uma ameaça milenar que desponta das profundezas."
};

const Tables = () => {
  const [tableId, setTableId] = useState("");
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <h1 className="text-3xl font-medievalsharp text-white mb-6 text-center">Mesas</h1>
        
        {/* Search section */}
        <div className="fantasy-card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar mesa por ID (6 dígitos)"
                  className="w-full bg-fantasy-dark border border-fantasy-purple/30 rounded-lg py-3 px-4 text-white"
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                />
              </div>
              <p className="text-xs text-fantasy-stone mt-2">Entre com o ID de 6 dígitos da mesa</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-fantasy-purple text-white py-3 px-6 rounded-lg font-medievalsharp"
            >
              <Search className="inline-block mr-2" size={16} />
              Buscar
            </motion.button>
          </div>
        </div>
        
        {/* Table details */}
        <div className="fantasy-card">
          <h2 className="text-2xl font-medievalsharp text-fantasy-purple mb-4">{exampleTable.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <div className="font-semibold text-fantasy-stone">ID:</div>
              <div className="ml-2 text-white">{exampleTable.id}</div>
            </div>
            <div className="flex items-center">
              <div className="font-semibold text-fantasy-stone">Mestre:</div>
              <div className="ml-2 text-white">{exampleTable.dm}</div>
            </div>
          </div>
          
          <div className="border-t border-fantasy-purple/20 pt-4 mb-4">
            <div className="flex items-center mb-3">
              <Calendar className="text-fantasy-gold mr-2" size={20} />
              <div className="font-medievalsharp text-white">
                Próxima sessão: {exampleTable.nextSession.date}
              </div>
            </div>
            <div className="ml-8 text-fantasy-stone mb-4">
              Horário: {exampleTable.nextSession.time}
            </div>
            
            <div className="flex items-center mb-4">
              <Users className="text-fantasy-gold mr-2" size={20} />
              <div className="text-white">
                Jogadores: {exampleTable.players.current}/{exampleTable.players.max}
              </div>
            </div>
          </div>
          
          <div className="bg-fantasy-dark/40 rounded-lg p-4 mb-6">
            <h3 className="text-fantasy-purple font-medievalsharp mb-2">Sinopse</h3>
            <p className="text-fantasy-stone">{exampleTable.synopsis}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-fantasy-purple text-white py-3 rounded-lg font-medievalsharp text-lg"
          >
            Entrar na Mesa
          </motion.button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tables;
