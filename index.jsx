import React, { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18/+esm';
import ReactDOM from 'https://cdn.jsdelivr.net/npm/react-dom@18/+esm';

// Firebase imports (SEM Storage e SEM Auth!)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8wbhq5Oi7wo9-4LBv5gdmvNRREJzRgIo",
  authDomain: "taynara-desg.firebaseapp.com",
  projectId: "taynara-desg",
  storageBucket: "taynara-desg.firebasestorage.app",
  messagingSenderId: "127070989394",
  appId: "1:127070989394:web:0eb0587d26c07eea57438b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Converter arquivo para base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Comprimir imagem mantendo qualidade
const compressImage = (base64, maxWidth = 1200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
  });
};

// ============================================
// COMPONENTE: WhatsApp Float Button
// ============================================
function WhatsAppButton({ phoneNumber }) {
  const handleClick = () => {
    const phone = phoneNumber.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}`, '_blank');
  };

  return (
    <div className="whatsapp-float" onClick={handleClick}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </div>
  );
}

// ============================================
// COMPONENTE: Header/Navegação
// ============================================
function Header({ isAdmin, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-display text-3xl font-bold" style={{color: 'var(--brown-dark)'}}>
          Taynara Design
        </div>
        
        {!isAdmin ? (
          <div className="hidden md:flex gap-8 items-center">
            <a href="#sobre" className="hover:opacity-70 transition-opacity font-medium">Sobre</a>
            <a href="#servicos" className="hover:opacity-70 transition-opacity font-medium">Serviços</a>
            <a href="#galeria" className="hover:opacity-70 transition-opacity font-medium">Galeria</a>
            <a href="#contato" className="hover:opacity-70 transition-opacity font-medium">Contato</a>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="px-6 py-2 rounded-full font-medium transition-all"
            style={{
              background: 'var(--brown-medium)',
              color: 'white'
            }}
          >
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}

// ============================================
// COMPONENTE: Hero Section
// ============================================
function HeroSection({ content }) {
  return (
    <section className="bg-pattern min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center z-10">
        <div className="animate-fadeInUp">
          <h1 className="font-display text-6xl md:text-7xl font-bold mb-6" style={{color: 'var(--brown-dark)'}}>
            {content?.heroTitle || 'Especialista em Design de Sobrancelhas'}
          </h1>
          <p className="text-xl mb-8 leading-relaxed" style={{color: 'var(--text-dark)'}}>
            {content?.heroSubtitle || 'Realce sua beleza natural com técnicas exclusivas e personalizadas para o seu rosto.'}
          </p>
          <a 
            href="#contato"
            className="inline-block px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg"
            style={{background: 'linear-gradient(135deg, var(--brown-medium) 0%, var(--brown-dark) 100%)'}}
          >
            Agende sua Avaliação
          </a>
        </div>
        
        <div className="relative animate-fadeIn" style={{animationDelay: '0.3s'}}>
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl animate-float">
            <img 
              src={content?.heroImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"}
              alt="Design de Sobrancelhas"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" 
               style={{background: 'var(--rose-gold)'}}></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20" 
               style={{background: 'var(--brown-soft)'}}></div>
        </div>
      </div>
      
      <div className="decorative-curve">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100C240 150 480 50 720 100C960 150 1200 50 1440 100V200H0V100Z" fill="var(--cream)"/>
        </svg>
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE: Sobre Section
// ============================================
function SobreSection({ content }) {
  return (
    <section id="sobre" className="py-24 px-6" style={{background: 'var(--cream)'}}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <h2 className="font-display text-5xl font-bold mb-6" style={{color: 'var(--brown-dark)'}}>
            {content?.aboutTitle || 'Sobre Mim'}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{color: 'var(--text-dark)'}}>
            <p>{content?.aboutText1 || 'Sou Taynara, designer de sobrancelhas especializada em criar designs personalizados que realçam a beleza natural de cada cliente.'}</p>
            <p>{content?.aboutText2 || 'Com anos de experiência e formação em técnicas avançadas, meu compromisso é proporcionar um atendimento exclusivo e resultados impecáveis.'}</p>
            <p>{content?.aboutText3 || 'Cada sobrancelha é única, assim como você. Por isso, faço uma análise detalhada do formato do seu rosto para criar o design perfeito.'}</p>
          </div>
          
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { number: '5+', label: 'Anos de Experiência' },
              { number: '2000+', label: 'Clientes Satisfeitas' },
              { number: '100%', label: 'Dedicação' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-4xl font-bold mb-2" style={{color: 'var(--brown-medium)'}}>
                  {stat.number}
                </div>
                <div className="text-sm" style={{color: 'var(--text-dark)'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="order-1 md:order-2 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={content?.aboutImage || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"}
              alt="Taynara - Designer de Sobrancelhas"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full opacity-30 -z-10"
               style={{background: 'var(--nude-medium)'}}></div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE: Serviços Section
// ============================================
function ServicesSection({ services }) {
  const defaultServices = [
    {
      id: '1',
      title: 'Design de Sobrancelhas',
      description: 'Técnica personalizada que analisa o formato do seu rosto para criar o design perfeito.',
      icon: '✨',
      price: 'A partir de R$ 80'
    },
    {
      id: '2',
      title: 'Henna',
      description: 'Coloração natural que preenche falhas e define o formato, durando até 15 dias.',
      icon: '🎨',
      price: 'A partir de R$ 60'
    },
    {
      id: '3',
      title: 'Micropigmentação',
      description: 'Técnica semi-permanente para sobrancelhas perfeitas por até 2 anos.',
      icon: '💫',
      price: 'Consulte valores'
    },
    {
      id: '4',
      title: 'Lash Lifting',
      description: 'Curvatura natural dos cílios sem extensão, efeito duradouro e olhar marcante.',
      icon: '👁️',
      price: 'A partir de R$ 100'
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="servicos" className="py-24 px-6 bg-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl font-bold mb-4" style={{color: 'var(--brown-dark)'}}>
            Serviços
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--text-dark)'}}>
            Técnicas especializadas para realçar sua beleza natural
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayServices.map((service, index) => (
            <div 
              key={service.id}
              className="service-card p-8 rounded-3xl shadow-lg"
              style={{
                background: 'white',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color: 'var(--brown-dark)'}}>
                {service.title}
              </h3>
              <p className="mb-4 leading-relaxed" style={{color: 'var(--text-dark)'}}>
                {service.description}
              </p>
              <div className="font-semibold" style={{color: 'var(--brown-medium)'}}>
                {service.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE: Galeria Section
// ============================================
function GallerySection({ gallery }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const defaultGallery = [
    { id: '1', url: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80", type: 'image' },
    { id: '2', url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", type: 'image' },
    { id: '3', url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", type: 'image' },
    { id: '4', url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80", type: 'image' },
    { id: '5', url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", type: 'image' },
    { id: '6', url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80", type: 'image' }
  ];

  const displayGallery = gallery.length > 0 ? gallery : defaultGallery;

  return (
    <section id="galeria" className="py-24 px-6" style={{background: 'var(--cream)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl font-bold mb-4" style={{color: 'var(--brown-dark)'}}>
            Galeria de Trabalhos
          </h2>
          <p className="text-xl" style={{color: 'var(--text-dark)'}}>
            Confira alguns dos nossos trabalhos realizados
          </p>
        </div>
        
        <div className="gallery-grid">
          {displayGallery.map((item) => (
            <div 
              key={item.id}
              className="gallery-item"
              onClick={() => setSelectedMedia(item)}
            >
              {item.type === 'video' ? (
                item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                  <iframe
                    src={item.url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" />
                )
              ) : (
                <img src={item.url} alt={`Trabalho ${item.id}`} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedMedia(null)}
        >
          {selectedMedia.type === 'video' ? (
            selectedMedia.url.includes('youtube.com') || selectedMedia.url.includes('youtu.be') ? (
              <iframe
                src={selectedMedia.url.replace('watch?v=', 'embed/')}
                className="max-w-4xl w-full aspect-video rounded-lg"
                allowFullScreen
              />
            ) : (
              <video src={selectedMedia.url} controls className="max-w-full max-h-full rounded-lg" />
            )
          ) : (
            <img 
              src={selectedMedia.url} 
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform"
            onClick={() => setSelectedMedia(null)}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}

// ============================================
// COMPONENTE: Contato Section
// ============================================
function ContatoSection({ content }) {
  return (
    <section id="contato" className="py-24 px-6 bg-pattern">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-5xl font-bold mb-6" style={{color: 'var(--brown-dark)'}}>
          Entre em Contato
        </h2>
        <p className="text-xl mb-12" style={{color: 'var(--text-dark)'}}>
          {content?.contactText || 'Agende sua avaliação e descubra o poder de uma sobrancelha perfeita'}
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-bold mb-2" style={{color: 'var(--brown-dark)'}}>WhatsApp</h3>
            <p style={{color: 'var(--text-dark)'}}>{content?.phone || '(31) 99999-9999'}</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold mb-2" style={{color: 'var(--brown-dark)'}}>Endereço</h3>
            <p style={{color: 'var(--text-dark)'}}>{content?.address || 'Mateus Leme, MG'}</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-3">⏰</div>
            <h3 className="font-bold mb-2" style={{color: 'var(--brown-dark)'}}>Horário</h3>
            <p style={{color: 'var(--text-dark)'}}>{content?.hours || 'Seg-Sáb: 9h às 18h'}</p>
          </div>
        </div>
        
        <a 
          href={`https://wa.me/55${(content?.phone || '31999999999').replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-12 py-5 rounded-full font-semibold text-white text-xl transition-all hover:scale-105 shadow-xl"
          style={{background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'}}
        >
          Fale no WhatsApp
        </a>
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE: Footer
// ============================================
function Footer() {
  return (
    <footer className="py-12 px-6 text-center" style={{background: 'var(--brown-dark)', color: 'var(--cream)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="font-display text-3xl font-bold mb-4">Taynara Design</div>
        <p className="mb-6">Especialista em Design de Sobrancelhas</p>
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Facebook</a>
          <a href="#" className="hover:opacity-70 transition-opacity">WhatsApp</a>
        </div>
        <p className="text-sm opacity-70">
          © 2026 Taynara Design. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

// ============================================
// COMPONENTE: Admin Login (COM PIN)
// ============================================
function AdminLogin({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const configDoc = await getDoc(doc(db, 'config', 'admin'));
      
      if (!configDoc.exists()) {
        // Se não existir, criar com PIN padrão 1002
        await setDoc(doc(db, 'config', 'admin'), { pin: '1002' });
        if (pin === '1002') {
          onLogin();
        } else {
          setError('Código PIN incorreto');
        }
      } else {
        const savedPin = configDoc.data().pin;
        if (pin === savedPin) {
          onLogin();
        } else {
          setError('Código PIN incorreto');
        }
      }
    } catch (err) {
      console.error('Erro ao verificar PIN:', err);
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="font-display text-4xl font-bold" style={{color: 'var(--brown-dark)'}}>
            Painel Administrativo
          </h2>
          <p className="mt-2 opacity-70">Digite o código PIN para acessar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-center" style={{color: 'var(--text-dark)'}}>
              Código PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:border-opacity-100 transition-all text-center text-2xl font-bold tracking-widest"
              style={{borderColor: 'var(--nude-medium)'}}
              placeholder="••••"
              maxLength="4"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-xl bg-red-100 text-red-700 text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
            style={{background: 'linear-gradient(135deg, var(--brown-medium) 0%, var(--brown-dark) 100%)'}}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
          
          <p className="text-center text-sm opacity-60 mt-4">
            PIN padrão: 1002 (altere dentro do painel)
          </p>
        </form>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Admin Panel
// ============================================
function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState('conteudo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // States para conteúdo
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    aboutTitle: '',
    aboutText1: '',
    aboutText2: '',
    aboutText3: '',
    contactText: '',
    phone: '',
    address: '',
    hours: ''
  });
  
  // States para galeria
  const [gallery, setGallery] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  // States para serviços
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: '✨',
    price: ''
  });
  
  // States para PIN
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Carregar dados do Firebase
  useEffect(() => {
    loadContent();
    loadGallery();
    loadServices();
    loadPin();
  }, []);

  const loadContent = async () => {
    try {
      const contentDoc = await getDoc(doc(db, 'content', 'main'));
      if (contentDoc.exists()) {
        setContent(contentDoc.data());
      }
    } catch (err) {
      console.error('Erro ao carregar conteúdo:', err);
    }
  };

  const loadGallery = async () => {
    try {
      const galleryDocs = await getDocs(collection(db, 'gallery'));
      const items = galleryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGallery(items);
    } catch (err) {
      console.error('Erro ao carregar galeria:', err);
    }
  };

  const loadServices = async () => {
    try {
      const serviceDocs = await getDocs(collection(db, 'services'));
      const items = serviceDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(items);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
    }
  };

  const loadPin = async () => {
    try {
      const configDoc = await getDoc(doc(db, 'config', 'admin'));
      if (configDoc.exists()) {
        setCurrentPin(configDoc.data().pin);
      }
    } catch (err) {
      console.error('Erro ao carregar PIN:', err);
    }
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'content', 'main'), content);
      setSuccess('Conteúdo salvo com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificar tamanho do arquivo (max 1MB para imagens, 5MB para vídeos)
    const maxSize = file.type.startsWith('video/') ? 5 * 1024 * 1024 : 1 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Arquivo muito grande! Máximo: ${file.type.startsWith('video/') ? '5MB para vídeos' : '1MB para imagens'}`);
      return;
    }
    
    setUploadingMedia(true);
    try {
      let mediaData;
      
      if (file.type.startsWith('image/')) {
        // Converter e comprimir imagem
        const base64 = await fileToBase64(file);
        const compressed = await compressImage(base64);
        mediaData = compressed;
      } else if (file.type.startsWith('video/')) {
        // Converter vídeo para base64 (aviso: pode ser grande!)
        mediaData = await fileToBase64(file);
      } else {
        alert('Tipo de arquivo não suportado. Use imagens ou vídeos.');
        return;
      }
      
      const newItem = {
        url: mediaData,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        createdAt: new Date().toISOString()
      };
      
      const id = `media_${Date.now()}`;
      await setDoc(doc(db, 'gallery', id), newItem);
      setGallery([...gallery, { id, ...newItem }]);
      setSuccess('Arquivo adicionado!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      alert('Erro ao adicionar arquivo. Tente reduzir o tamanho.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const addVideoUrl = async () => {
    const url = prompt('Cole o link do YouTube (ex: https://youtube.com/watch?v=...)');
    if (!url || !url.includes('youtube')) {
      alert('Link inválido! Use um link do YouTube.');
      return;
    }
    
    try {
      const newItem = {
        url,
        type: 'video',
        createdAt: new Date().toISOString()
      };
      
      const id = `video_${Date.now()}`;
      await setDoc(doc(db, 'gallery', id), newItem);
      setGallery([...gallery, { id, ...newItem }]);
      setSuccess('Vídeo do YouTube adicionado!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao adicionar vídeo:', err);
    }
  };

  const deleteMedia = async (id) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;
    
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setGallery(gallery.filter(item => item.id !== id));
      setSuccess('Item removido!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const addService = async () => {
    if (!newService.title || !newService.description) {
      alert('Preencha título e descrição!');
      return;
    }
    
    try {
      const id = `service_${Date.now()}`;
      await setDoc(doc(db, 'services', id), newService);
      setServices([...services, { id, ...newService }]);
      setNewService({ title: '', description: '', icon: '✨', price: '' });
      setSuccess('Serviço adicionado!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao adicionar serviço:', err);
    }
  };

  const deleteService = async (id) => {
    if (!confirm('Tem certeza que deseja remover este serviço?')) return;
    
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(services.filter(s => s.id !== id));
      setSuccess('Serviço removido!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao deletar serviço:', err);
    }
  };

  const changePin = async () => {
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      alert('O PIN deve ter 4 dígitos!');
      return;
    }
    
    if (newPin !== confirmPin) {
      alert('Os PINs não coincidem!');
      return;
    }
    
    try {
      await setDoc(doc(db, 'config', 'admin'), { pin: newPin });
      setCurrentPin(newPin);
      setNewPin('');
      setConfirmPin('');
      setSuccess('PIN alterado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao alterar PIN:', err);
      alert('Erro ao alterar PIN');
    }
  };

  return (
    <div className="min-h-screen" style={{background: 'var(--cream)'}}>
      <Header isAdmin={true} onLogout={onLogout} />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto pb-12">
        <h1 className="font-display text-5xl font-bold mb-8" style={{color: 'var(--brown-dark)'}}>
          Painel Administrativo
        </h1>
        
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-700 text-center animate-fadeIn">
            ✓ {success}
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 overflow-x-auto" style={{borderColor: 'var(--nude-medium)'}}>
          {['conteudo', 'galeria', 'servicos', 'seguranca'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                activeTab === tab ? 'border-b-4' : 'opacity-50 hover:opacity-100'
              }`}
              style={{
                borderColor: activeTab === tab ? 'var(--brown-medium)' : 'transparent',
                color: 'var(--text-dark)'
              }}
            >
              {tab === 'conteudo' ? '📝 Conteúdo' : 
               tab === 'galeria' ? '🖼️ Galeria' : 
               tab === 'servicos' ? '✨ Serviços' : '🔐 Segurança'}
            </button>
          ))}
        </div>
        
        {/* Conteúdo Tab */}
        {activeTab === 'conteudo' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
            <h2 className="font-display text-3xl font-bold mb-6" style={{color: 'var(--brown-dark)'}}>
              Editar Conteúdo do Site
            </h2>
            
            <div>
              <label className="block mb-2 font-medium">Título Principal (Hero)</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2"
                style={{borderColor: 'var(--nude-medium)'}}
                placeholder="Especialista em Design de Sobrancelhas"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Subtítulo (Hero)</label>
              <textarea
                value={content.heroSubtitle}
                onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 h-24"
                style={{borderColor: 'var(--nude-medium)'}}
                placeholder="Realce sua beleza natural..."
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Título Sobre</label>
              <input
                type="text"
                value={content.aboutTitle}
                onChange={(e) => setContent({...content, aboutTitle: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2"
                style={{borderColor: 'var(--nude-medium)'}}
                placeholder="Sobre Mim"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Sobre - Parágrafo 1</label>
              <textarea
                value={content.aboutText1}
                onChange={(e) => setContent({...content, aboutText1: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 h-24"
                style={{borderColor: 'var(--nude-medium)'}}
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Sobre - Parágrafo 2</label>
              <textarea
                value={content.aboutText2}
                onChange={(e) => setContent({...content, aboutText2: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 h-24"
                style={{borderColor: 'var(--nude-medium)'}}
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Sobre - Parágrafo 3</label>
              <textarea
                value={content.aboutText3}
                onChange={(e) => setContent({...content, aboutText3: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 h-24"
                style={{borderColor: 'var(--nude-medium)'}}
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Telefone (WhatsApp)</label>
              <input
                type="text"
                value={content.phone}
                onChange={(e) => setContent({...content, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2"
                style={{borderColor: 'var(--nude-medium)'}}
                placeholder="(31) 99999-9999"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Endereço</label>
              <input
                type="text"
                value={content.address}
                onChange={(e) => setContent({...content, address: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2"
                style={{borderColor: 'var(--nude-medium)'}}
                placeholder="Mateus Leme, MG"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Horário de Atendimento</label>
              <input
                type="text"
                value={content.hours}
                onChange={(e) => setContent({...content, hours: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2"
                style={{borderColor: 'var(--nude-medium)'}}
                placeholder="Seg-Sáb: 9h às 18h"
              />
            </div>
            
            <button
              onClick={saveContent}
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{background: 'linear-gradient(135deg, var(--brown-medium) 0%, var(--brown-dark) 100%)'}}
            >
              {loading ? 'Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        )}
        
        {/* Galeria Tab */}
        {activeTab === 'galeria' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="font-display text-3xl font-bold mb-6" style={{color: 'var(--brown-dark)'}}>
              Gerenciar Galeria
            </h2>
            
            <div className="mb-8 p-6 rounded-xl" style={{background: 'var(--nude-light)'}}>
              <h3 className="font-bold mb-4">📤 Adicionar Mídia</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Upload de Foto (máx 1MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadMedia}
                    disabled={uploadingMedia}
                    className="w-full px-4 py-3 rounded-xl border-2"
                    style={{borderColor: 'var(--nude-medium)'}}
                  />
                </div>
                
                <div className="text-center py-2 opacity-60">OU</div>
                
                <button
                  onClick={addVideoUrl}
                  className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{background: 'var(--brown-soft)', color: 'white'}}
                >
                  🎥 Adicionar Vídeo do YouTube
                </button>
              </div>
              
              {uploadingMedia && (
                <div className="mt-4 text-center">
                  <div className="spinner mx-auto"></div>
                  <p className="mt-2">Processando arquivo...</p>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-sm">
                <strong>⚠️ Dicas:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Fotos: máximo 1MB (compressão automática)</li>
                  <li>Vídeos: use YouTube (ilimitado e grátis)</li>
                  <li>Qualidade recomendada: 800x800px para fotos</li>
                </ul>
              </div>
            </div>
            
            <div className="gallery-grid">
              {gallery.map(item => (
                <div key={item.id} className="relative gallery-item">
                  {item.type === 'video' ? (
                    item.url.includes('youtube') ? (
                      <iframe
                        src={item.url.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <img src={item.url} alt="Galeria" />
                  )}
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {gallery.length === 0 && (
              <div className="text-center py-12 opacity-50">
                <p>Nenhuma foto ou vídeo adicionado ainda.</p>
                <p className="text-sm mt-2">Adicione suas primeiras fotos acima! 📸</p>
              </div>
            )}
          </div>
        )}
        
        {/* Serviços Tab */}
        {activeTab === 'servicos' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="font-display text-3xl font-bold mb-6" style={{color: 'var(--brown-dark)'}}>
              Gerenciar Serviços
            </h2>
            
            <div className="mb-8 p-6 rounded-xl" style={{background: 'var(--nude-light)'}}>
              <h3 className="font-bold mb-4">➕ Adicionar Novo Serviço</h3>
              <div className="grid gap-4">
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                  placeholder="Nome do Serviço"
                  className="px-4 py-3 rounded-xl border-2"
                  style={{borderColor: 'var(--nude-medium)'}}
                />
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Descrição"
                  className="px-4 py-3 rounded-xl border-2 h-24"
                  style={{borderColor: 'var(--nude-medium)'}}
                />
                <input
                  type="text"
                  value={newService.icon}
                  onChange={(e) => setNewService({...newService, icon: e.target.value})}
                  placeholder="Emoji/Ícone (ex: ✨)"
                  className="px-4 py-3 rounded-xl border-2"
                  style={{borderColor: 'var(--nude-medium)'}}
                />
                <input
                  type="text"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  placeholder="Preço (ex: A partir de R$ 80)"
                  className="px-4 py-3 rounded-xl border-2"
                  style={{borderColor: 'var(--nude-medium)'}}
                />
                <button
                  onClick={addService}
                  className="py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  style={{background: 'var(--brown-medium)'}}
                >
                  ➕ Adicionar Serviço
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {services.map(service => (
                <div 
                  key={service.id}
                  className="p-6 rounded-2xl border-2 relative"
                  style={{borderColor: 'var(--nude-medium)'}}
                >
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                  <p className="mb-2">{service.description}</p>
                  <p className="font-semibold" style={{color: 'var(--brown-medium)'}}>{service.price}</p>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {services.length === 0 && (
              <div className="text-center py-12 opacity-50">
                <p>Nenhum serviço adicionado ainda.</p>
                <p className="text-sm mt-2">Adicione seus serviços acima! ✨</p>
              </div>
            )}
          </div>
        )}
        
        {/* Segurança Tab */}
        {activeTab === 'seguranca' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="font-display text-3xl font-bold mb-6" style={{color: 'var(--brown-dark)'}}>
              🔐 Alterar Código PIN
            </h2>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="p-6 rounded-xl" style={{background: 'var(--nude-light)'}}>
                <p className="text-center mb-4">
                  <strong>PIN Atual:</strong> <span className="font-mono text-2xl">••••</span>
                </p>
                <p className="text-sm text-center opacity-70">
                  (por segurança, o PIN não é exibido)
                </p>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Novo PIN (4 dígitos)</label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-4 rounded-xl border-2 text-center text-2xl font-bold tracking-widest"
                  style={{borderColor: 'var(--nude-medium)'}}
                  placeholder="••••"
                  maxLength="4"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Confirmar Novo PIN</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-4 rounded-xl border-2 text-center text-2xl font-bold tracking-widest"
                  style={{borderColor: 'var(--nude-medium)'}}
                  placeholder="••••"
                  maxLength="4"
                />
              </div>
              
              <button
                onClick={changePin}
                disabled={newPin.length !== 4 || confirmPin.length !== 4 || newPin !== confirmPin}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                style={{background: 'linear-gradient(135deg, var(--brown-medium) 0%, var(--brown-dark) 100%)'}}
              >
                🔒 Alterar PIN
              </button>
              
              <div className="p-4 bg-blue-50 rounded-xl text-sm">
                <strong>💡 Dica de Segurança:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Use um PIN que só você conheça</li>
                  <li>Não compartilhe seu PIN com ninguém</li>
                  <li>Troque o PIN regularmente</li>
                  <li>Anote em local seguro caso esqueça</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL: App
// ============================================
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  
  // States para dados
  const [content, setContent] = useState({});
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadPublicData();
    setLoading(false);
  }, []);

  const loadPublicData = async () => {
    try {
      const contentDoc = await getDoc(doc(db, 'content', 'main'));
      if (contentDoc.exists()) {
        setContent(contentDoc.data());
      }
      
      const galleryDocs = await getDocs(collection(db, 'gallery'));
      const galleryItems = galleryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGallery(galleryItems);
      
      const serviceDocs = await getDocs(collection(db, 'services'));
      const serviceItems = serviceDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(serviceItems);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    window.location.hash = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="font-display text-2xl" style={{color: 'var(--brown-dark)'}}>Carregando...</p>
        </div>
      </div>
    );
  }

  // Página de Admin
  if (window.location.hash === '#admin' || window.location.pathname.includes('admin')) {
    if (!isAdmin) {
      return <AdminLogin onLogin={() => setIsAdmin(true)} />;
    }
    return <AdminPanel onLogout={handleLogout} />;
  }

  // Site público
  return (
    <>
      <Header isAdmin={false} />
      <HeroSection content={content} />
      <SobreSection content={content} />
      <ServicesSection services={services} />
      <GallerySection gallery={gallery} />
      <ContatoSection content={content} />
      <Footer />
      <WhatsAppButton phoneNumber={content.phone || '31999999999'} />
    </>
  );
}

// Renderizar o app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
