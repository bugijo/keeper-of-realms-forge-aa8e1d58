
import MainLayout from "@/components/layout/MainLayout";
import { Gem, LayoutGrid, BoxSelect, Sparkles, ShoppingCart, Check, CreditCard, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

// New gem packages for direct purchase
const gemPacks = [
  {
    id: 1,
    name: "Pacote Inicial",
    gems: 500,
    price: "R$ 9,90",
    bonus: "0%"
  },
  {
    id: 2,
    name: "Pacote Popular",
    gems: 1200,
    price: "R$ 19,90",
    bonus: "+20% bônus"
  },
  {
    id: 3,
    name: "Pacote Épico",
    gems: 3000,
    price: "R$ 39,90",
    bonus: "+50% bônus"
  },
  {
    id: 4,
    name: "Pacote Lendário",
    gems: 10000,
    price: "R$ 99,90",
    bonus: "+100% bônus"
  }
];

const Shop = () => {
  const [activeTab, setActiveTab] = useState("themes");
  const [purchaseModal, setPurchaseModal] = useState<{show: boolean, item?: any, type?: string}>({show: false});
  const [userGems, setUserGems] = useState(350); // In a real app, fetch this from the user's profile
  const [paymentModal, setPaymentModal] = useState(false);
  const [gemPurchaseModal, setGemPurchaseModal] = useState<{show: boolean, pack?: any}>({show: false});
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [loading, setLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  const tabs = [
    { id: "themes", label: "Temas", icon: BoxSelect },
    { id: "assets", label: "Assets", icon: LayoutGrid },
    { id: "premium", label: "Premium", icon: Sparkles },
    { id: "gems", label: "Cristais", icon: Gem }
  ];
  
  const handlePurchase = (item: any, type: string) => {
    setPurchaseModal({show: true, item, type});
  };
  
  const handleBuyGems = (pack: any) => {
    setGemPurchaseModal({show: true, pack});
  };
  
  const completePurchase = () => {
    const item = purchaseModal.item;
    const type = purchaseModal.type;
    
    if (type === 'premium') {
      setPaymentModal(true);
      setPurchaseModal({show: false});
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
      
      setPurchaseModal({show: false});
    }
  };
  
  const completeCardPayment = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setPurchaseSuccess(true);
      
      // If it was gem purchase
      if (gemPurchaseModal.show && gemPurchaseModal.pack) {
        setUserGems(prev => prev + gemPurchaseModal.pack.gems);
        
        toast.success("Compra de cristais concluída!", {
          description: `${gemPurchaseModal.pack.gems} cristais foram adicionados à sua conta.`
        });
      } else {
        // Premium subscription
        toast.success("Assinatura ativada com sucesso!", {
          description: "Você agora tem acesso a todos os recursos premium."
        });
      }
      
      // Reset after 2 seconds
      setTimeout(() => {
        setPaymentModal(false);
        setGemPurchaseModal({show: false});
        setPurchaseSuccess(false);
        setCardInfo({
          number: '',
          name: '',
          expiry: '',
          cvc: ''
        });
      }, 2000);
    }, 2000);
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Format with spaces every 4 digits
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
    }
    
    setCardInfo(prev => ({...prev, number: value}));
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    // Format as MM/YY
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    
    setCardInfo(prev => ({...prev, expiry: value}));
  };
  
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardInfo(prev => ({...prev, cvc: value}));
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
        <div className="flex mb-6 gap-2 overflow-x-auto">
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
        
        {activeTab === "gems" && (
          <div className="space-y-6">
            <div className="fantasy-card p-4">
              <h3 className="text-xl font-medievalsharp text-white mb-4">Comprar Cristais</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {gemPacks.map(pack => (
                  <div key={pack.id} className="bg-fantasy-dark/40 p-4 rounded-lg border border-fantasy-purple/20">
                    <h4 className="text-lg font-medievalsharp text-fantasy-gold mb-1">{pack.name}</h4>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-fantasy-gold font-bold text-xl">{pack.gems}</span>
                        <Gem className="text-fantasy-gold ml-1" size={16} />
                      </div>
                      {pack.bonus !== "0%" && (
                        <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                          {pack.bonus}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">{pack.price}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBuyGems(pack)}
                      >
                        <CreditCard className="mr-1 h-4 w-4" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-fantasy-dark/20 p-4 rounded-lg border border-fantasy-purple/10">
                <h4 className="text-lg font-medievalsharp text-fantasy-purple mb-2">Como usar cristais?</h4>
                <p className="text-fantasy-stone text-sm mb-3">
                  Cristais são a moeda premium do sistema. Com eles você pode:
                </p>
                <ul className="list-disc list-inside text-sm text-fantasy-stone space-y-1 ml-2">
                  <li>Adquirir temas exclusivos para personalizar sua interface</li>
                  <li>Comprar assets para usar nas suas aventuras</li>
                  <li>Desbloquear recursos extras para suas mesas</li>
                  <li>Obter vantagens nas criações e geração de conteúdo</li>
                </ul>
              </div>
            </div>
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
      
      {/* Payment Modal */}
      {(paymentModal || gemPurchaseModal.show) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-fantasy-dark border border-fantasy-purple/30 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple">
                {purchaseSuccess ? "Pagamento Concluído" : "Informações de Pagamento"}
              </h2>
              <button 
                onClick={() => {
                  setPaymentModal(false);
                  setGemPurchaseModal({show: false});
                }}
                className="text-fantasy-stone hover:text-white"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            
            {purchaseSuccess ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <Check size={32} className="text-green-500" />
                </div>
                <h3 className="text-lg font-medievalsharp text-white mb-2">Pagamento Aprovado!</h3>
                <p className="text-fantasy-stone mb-6">
                  Sua compra foi processada com sucesso.
                </p>
                <p className="text-sm text-fantasy-gold">
                  {gemPurchaseModal.show && gemPurchaseModal.pack
                    ? `${gemPurchaseModal.pack.gems} cristais foram adicionados à sua conta.`
                    : "Sua assinatura premium está ativa."}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-white font-medievalsharp mb-2">
                    {gemPurchaseModal.show && gemPurchaseModal.pack 
                      ? `Comprar ${gemPurchaseModal.pack.gems} Cristais` 
                      : "Assinar Plano Premium"}
                  </h3>
                  <p className="text-fantasy-stone mb-4">
                    Valor total: <span className="text-white font-bold">
                      {gemPurchaseModal.show && gemPurchaseModal.pack 
                        ? gemPurchaseModal.pack.price 
                        : "R$ 14,90"}
                    </span>
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="block text-fantasy-stone text-sm mb-1">Número do Cartão</label>
                    <input 
                      type="text" 
                      className="w-full bg-fantasy-dark/50 border border-fantasy-purple/30 rounded p-2 text-white"
                      placeholder="0000 0000 0000 0000"
                      value={cardInfo.number}
                      onChange={handleCardNumberChange}
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-fantasy-stone text-sm mb-1">Nome no Cartão</label>
                    <input 
                      type="text" 
                      className="w-full bg-fantasy-dark/50 border border-fantasy-purple/30 rounded p-2 text-white"
                      placeholder="NOME COMPLETO"
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo(prev => ({...prev, name: e.target.value.toUpperCase()}))}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-fantasy-stone text-sm mb-1">Validade</label>
                      <input 
                        type="text" 
                        className="w-full bg-fantasy-dark/50 border border-fantasy-purple/30 rounded p-2 text-white"
                        placeholder="MM/AA"
                        value={cardInfo.expiry}
                        onChange={handleExpiryChange}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-fantasy-stone text-sm mb-1">CVC</label>
                      <input 
                        type="text" 
                        className="w-full bg-fantasy-dark/50 border border-fantasy-purple/30 rounded p-2 text-white"
                        placeholder="000"
                        value={cardInfo.cvc}
                        onChange={handleCvcChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-fantasy-stone">
                    Este é um ambiente de demonstração. Nenhum valor será cobrado e você pode inserir
                    dados fictícios para simular o pagamento.
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
                  onClick={completeCardPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block h-4 w-4 border-2 border-fantasy-dark border-t-transparent rounded-full"></span>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Finalizar Pagamento
                    </>
                  )}
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default Shop;
