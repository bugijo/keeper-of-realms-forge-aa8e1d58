
import MainLayout from "@/components/layout/MainLayout";
import { Gem, LayoutGrid, BoxSelect, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const themes = [
  {
    id: 1,
    name: "Tema Dragão Ancião",
    price: 250,
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd734e311?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJhZ29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Tema Reino Élfico",
    price: 200,
    image: "https://images.unsplash.com/photo-1531826267553-c4979aefab12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxmJTIwZm9yZXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Tema Cidade Subterrânea",
    price: 300,
    image: "https://images.unsplash.com/photo-1566252768331-98371942ea8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F2ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  }
];

const assets = [
  {
    id: 1,
    name: "Pack de Tokens Aventureiros",
    price: 150,
    image: "https://images.unsplash.com/photo-1610890704766-95f8085afb95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGljZSUyMGdhbWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Mapas Fantásticos",
    price: 180,
    image: "https://images.unsplash.com/photo-1533729590644-695ded775ced?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  }
];

const premium = [
  {
    id: 1,
    name: "Plano Mensal",
    price: "R$ 14,90",
    description: "Acesso a todas as funcionalidades premium por 1 mês",
    gems: 200
  },
  {
    id: 2,
    name: "Plano Anual",
    price: "R$ 149,90",
    description: "Acesso a todas as funcionalidades premium por 12 meses",
    gems: 3000,
    discount: "15% de desconto!"
  }
];

const Shop = () => {
  const [activeTab, setActiveTab] = useState("themes");
  
  const tabs = [
    { id: "themes", label: "Temas", icon: BoxSelect },
    { id: "assets", label: "Assets", icon: LayoutGrid },
    { id: "premium", label: "Premium", icon: Sparkles }
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        {/* Balance at top */}
        <div className="py-2 px-4 bg-fantasy-dark/70 border-b border-fantasy-purple/20 mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medievalsharp text-white">Seu saldo:</h2>
          <div className="flex items-center">
            <span className="text-white font-bold">350</span>
            <span className="text-fantasy-gold ml-2">💎</span>
            <span className="text-fantasy-gold ml-1">Cristais</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mb-6 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex-1 py-3 px-4 rounded-full font-medievalsharp transition-colors ${
                activeTab === tab.id 
                  ? 'bg-fantasy-purple text-white' 
                  : 'bg-fantasy-dark/50 text-fantasy-stone hover:bg-fantasy-dark'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex items-center justify-center">
                <tab.icon size={18} className="mr-2" />
                {tab.label}
              </div>
            </button>
          ))}
        </div>
        
        {/* Content based on active tab */}
        {activeTab === "themes" && (
          <div className="space-y-6">
            {themes.map(theme => (
              <div key={theme.id} className="fantasy-card">
                <div className="h-40 overflow-hidden rounded-lg mb-4">
                  <img 
                    src={theme.image} 
                    alt={theme.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medievalsharp text-white mb-2">{theme.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-fantasy-gold text-xl font-bold">{theme.price}</span>
                    <Gem className="text-fantasy-gold ml-2" size={18} />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-fantasy-purple text-white py-2 rounded-lg font-medievalsharp"
                >
                  Comprar
                </motion.button>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "assets" && (
          <div className="space-y-6">
            {assets.map(asset => (
              <div key={asset.id} className="fantasy-card">
                <div className="h-40 overflow-hidden rounded-lg mb-4">
                  <img 
                    src={asset.image} 
                    alt={asset.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medievalsharp text-white mb-2">{asset.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-fantasy-gold text-xl font-bold">{asset.price}</span>
                    <Gem className="text-fantasy-gold ml-2" size={18} />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-fantasy-purple text-white py-2 rounded-lg font-medievalsharp"
                >
                  Comprar
                </motion.button>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "premium" && (
          <div className="space-y-6">
            {premium.map(plan => (
              <div key={plan.id} className="fantasy-card">
                <h3 className="text-xl font-medievalsharp text-white mb-2">{plan.name}</h3>
                <p className="text-fantasy-stone mb-4">{plan.description}</p>
                
                {plan.discount && (
                  <div className="bg-green-600/20 text-green-400 py-1 px-3 rounded-full inline-block mb-4">
                    {plan.discount}
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-white">{plan.price}</span>
                  <div className="flex items-center">
                    <span className="text-fantasy-gold">+{plan.gems}</span>
                    <Gem className="text-fantasy-gold ml-1" size={16} />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-fantasy-gold text-fantasy-dark py-2 rounded-lg font-medievalsharp mt-4"
                >
                  Assinar Agora
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Shop;
