
import MainLayout from "@/components/layout/MainLayout";
import { Gem, LayoutGrid, BoxSelect, Sparkles, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

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
  const [purchaseModal, setPurchaseModal] = useState<{show: boolean, item?: any, type?: string}>({show: false});
  const [userGems, setUserGems] = useState(350); // In a real app, fetch this from the user's profile
  
  const tabs = [
    { id: "themes", label: "Temas", icon: BoxSelect },
    { id: "assets", label: "Assets", icon: LayoutGrid },
    { id: "premium", label: "Premium", icon: Sparkles }
  ];
  
  const handlePurchase = (item: any, type: string) => {
    setPurchaseModal({show: true, item, type});
  };
  
  const completePurchase = () => {
    const item = purchaseModal.item;
    const type = purchaseModal.type;
    
    if (type === 'premium') {
      // In a real app, this would redirect to a payment gateway
      toast.success(`Assinatura ${item.name} iniciada!`, {
        description: `Você recebeu ${item.gems} cristais como bônus.`,
      });
      setUserGems(prev => prev + item.gems);
    } else {
      // Check if user has enough gems
      if (userGems >= item.price) {
        setUserGems(prev => prev - item.price);
        toast.success(`${item.name} comprado com sucesso!`, {
          description: "Item adicionado à sua coleção."
        });
      } else {
        toast.error("Saldo insuficiente", {
          description: "Você não tem cristais suficientes para esta compra."
        });
      }
    }
    
    setPurchaseModal({show: false});
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        {/* Balance at top */}
        <div className="py-2 px-4 bg-fantasy-dark/70 border-b border-fantasy-purple/20 mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medievalsharp text-white">Seu saldo:</h2>
          <div className="flex items-center">
            <span className="text-white font-bold">{userGems}</span>
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
                  onClick={() => handlePurchase(theme, 'theme')}
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
                  onClick={() => handlePurchase(asset, 'asset')}
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
                  onClick={() => handlePurchase(plan, 'premium')}
                >
                  Assinar Agora
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Purchase Confirmation Modal */}
      {purchaseModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-fantasy-dark border border-fantasy-purple/30 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple">Confirmar Compra</h2>
              <button 
                onClick={() => setPurchaseModal({show: false})}
                className="text-fantasy-stone hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {purchaseModal.type === 'premium' ? (
              <div className="mb-4">
                <h3 className="text-white font-medievalsharp mb-2">{purchaseModal.item?.name}</h3>
                <p className="text-fantasy-stone mb-3">{purchaseModal.item?.description}</p>
                <div className="bg-fantasy-dark/40 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Valor:</span>
                    <span className="text-white font-bold">{purchaseModal.item?.price}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-fantasy-stone">Bônus de cristais:</span>
                    <div className="flex items-center">
                      <span className="text-fantasy-gold">{purchaseModal.item?.gems}</span>
                      <Gem className="text-fantasy-gold ml-1" size={14} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-fantasy-stone mb-4">
                  Ao clicar em "Confirmar", você será redirecionado para a página de pagamento seguro.
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <h3 className="text-white font-medievalsharp mb-2">{purchaseModal.item?.name}</h3>
                <div className="bg-fantasy-dark/40 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Preço:</span>
                    <div className="flex items-center">
                      <span className="text-fantasy-gold">{purchaseModal.item?.price}</span>
                      <Gem className="text-fantasy-gold ml-1" size={14} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-fantasy-stone">Seu saldo atual:</span>
                    <div className="flex items-center">
                      <span className={`${userGems >= purchaseModal.item?.price ? 'text-fantasy-gold' : 'text-red-400'}`}>
                        {userGems}
                      </span>
                      <Gem className={`${userGems >= purchaseModal.item?.price ? 'text-fantasy-gold' : 'text-red-400'} ml-1`} size={14} />
                    </div>
                  </div>
                </div>
                {userGems < purchaseModal.item?.price && (
                  <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
                    <ShoppingCart className="inline-block mr-1" size={16} /> Saldo insuficiente para esta compra.
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                className="flex-1 bg-fantasy-dark/60 text-fantasy-stone py-2 rounded-lg"
                onClick={() => setPurchaseModal({show: false})}
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  (purchaseModal.type === 'premium' || userGems >= (purchaseModal.item?.price || 0))
                    ? 'bg-fantasy-gold text-fantasy-dark font-medievalsharp'
                    : 'bg-fantasy-dark/60 text-fantasy-stone/50 cursor-not-allowed'
                }`}
                onClick={completePurchase}
                disabled={purchaseModal.type !== 'premium' && userGems < (purchaseModal.item?.price || 0)}
              >
                <Check size={18} />
                Confirmar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default Shop;
