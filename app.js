// ============================================
// IMPORTS E CONFIGURAÇÃO
// ============================================
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const db = window.db;
const CLOUDINARY_CONFIG = window.CLOUDINARY_CONFIG;

// ============================================
// STATE MANAGEMENT
// ============================================
let currentUser = null;
let appData = {
    content: {},
    gallery: [],
    services: []
};

// ============================================
// CLOUDINARY FUNCTIONS
// ============================================
function initCloudinaryWidget(onSuccess) {
    const widget = cloudinary.createUploadWidget(
        {
            cloudName: CLOUDINARY_CONFIG.cloudName,
            uploadPreset: 'taynara_preset', // Vamos criar esse preset
            sources: ['local', 'url', 'camera'],
            multiple: false,
            maxFileSize: 10000000, // 10MB
            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
            maxImageWidth: 2000,
            maxImageHeight: 2000,
            cropping: true,
            croppingAspectRatio: 1,
            styles: {
                palette: {
                    window: '#FFF8F0',
                    windowBorder: '#8B6F47',
                    tabIcon: '#8B6F47',
                    menuIcons: '#6B5344',
                    textDark: '#4A3F35',
                    textLight: '#FFFFFF',
                    link: '#8B6F47',
                    action: '#8B6F47',
                    inactiveTabIcon: '#A0826D',
                    error: '#F44336',
                    inProgress: '#8B6F47',
                    complete: '#4CAF50',
                    sourceBg: '#F5EBE0'
                },
                fonts: {
                    default: null,
                    'Montserrat, sans-serif': {
                        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600',
                        active: true
                    }
                }
            }
        },
        (error, result) => {
            if (!error && result && result.event === 'success') {
                onSuccess(result.info);
            }
        }
    );
    
    return widget;
}

// ============================================
// FIREBASE FUNCTIONS
// ============================================
async function loadContent() {
    try {
        const contentDoc = await getDoc(doc(db, 'content', 'main'));
        if (contentDoc.exists()) {
            appData.content = contentDoc.data();
        }
    } catch (err) {
        console.error('Erro ao carregar conteúdo:', err);
    }
}

async function loadGallery() {
    try {
        const galleryDocs = await getDocs(collection(db, 'gallery'));
        appData.gallery = galleryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error('Erro ao carregar galeria:', err);
    }
}

async function loadServices() {
    try {
        const serviceDocs = await getDocs(collection(db, 'services'));
        appData.services = serviceDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error('Erro ao carregar serviços:', err);
    }
}

async function checkPin(pin) {
    try {
        const configDoc = await getDoc(doc(db, 'config', 'admin'));
        if (!configDoc.exists()) {
            await setDoc(doc(db, 'config', 'admin'), { pin: '1002' });
            return pin === '1002';
        }
        return configDoc.data().pin === pin;
    } catch (err) {
        console.error('Erro ao verificar PIN:', err);
        return false;
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderSite() {
    const root = document.getElementById('root');
    
    const defaultContent = {
        heroTitle: 'Especialista em Design de Sobrancelhas',
        heroSubtitle: 'Realce sua beleza natural com técnicas exclusivas e personalizadas para o seu rosto.',
        heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        aboutTitle: 'Sobre Mim',
        aboutText1: 'Sou Taynara, designer de sobrancelhas especializada em criar designs personalizados que realçam a beleza natural de cada cliente.',
        aboutText2: 'Com anos de experiência e formação em técnicas avançadas, meu compromisso é proporcionar um atendimento exclusivo e resultados impecáveis.',
        aboutText3: 'Cada sobrancelha é única, assim como você. Por isso, faço uma análise detalhada do formato do seu rosto para criar o design perfeito.',
        aboutImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
        contactText: 'Agende sua avaliação e descubra o poder de uma sobrancelha perfeita',
        phone: '(31) 99999-9999',
        address: 'Mateus Leme, MG',
        hours: 'Seg-Sáb: 9h às 18h'
    };
    
    const content = { ...defaultContent, ...appData.content };
    
    const defaultServices = [
        { id: '1', title: 'Design de Sobrancelhas', description: 'Técnica personalizada que analisa o formato do seu rosto para criar o design perfeito.', icon: '✨', price: 'A partir de R$ 80' },
        { id: '2', title: 'Henna', description: 'Coloração natural que preenche falhas e define o formato, durando até 15 dias.', icon: '🎨', price: 'A partir de R$ 60' },
        { id: '3', title: 'Micropigmentação', description: 'Técnica semi-permanente para sobrancelhas perfeitas por até 2 anos.', icon: '💫', price: 'Consulte valores' },
        { id: '4', title: 'Lash Lifting', description: 'Curvatura natural dos cílios sem extensão, efeito duradouro e olhar marcante.', icon: '👁️', price: 'A partir de R$ 100' }
    ];
    
    const services = appData.services.length > 0 ? appData.services : defaultServices;
    
    const defaultGallery = [
        { id: '1', url: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80' },
        { id: '2', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80' },
        { id: '3', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80' },
        { id: '4', url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80' },
        { id: '5', url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80' },
        { id: '6', url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80' }
    ];
    
    const gallery = appData.gallery.length > 0 ? appData.gallery : defaultGallery;
    
    root.innerHTML = `
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
            <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div class="font-display text-3xl font-bold" style="color: var(--brown-dark)">
                    Taynara Design
                </div>
                <div class="hidden md:flex gap-8 items-center">
                    <a href="#sobre" class="hover:opacity-70 transition-opacity font-medium">Sobre</a>
                    <a href="#servicos" class="hover:opacity-70 transition-opacity font-medium">Serviços</a>
                    <a href="#galeria" class="hover:opacity-70 transition-opacity font-medium">Galeria</a>
                    <a href="#contato" class="hover:opacity-70 transition-opacity font-medium">Contato</a>
                </div>
            </nav>
        </header>
        
        <!-- Hero Section -->
        <section class="bg-pattern min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
            <div class="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center z-10">
                <div class="animate-fadeInUp">
                    <h1 class="font-display text-6xl md:text-7xl font-bold mb-6" style="color: var(--brown-dark)">
                        ${content.heroTitle}
                    </h1>
                    <p class="text-xl mb-8 leading-relaxed" style="color: var(--text-dark)">
                        ${content.heroSubtitle}
                    </p>
                    <a href="#contato" class="inline-block px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg" style="background: linear-gradient(135deg, var(--brown-medium) 0%, var(--brown-dark) 100%)">
                        Agende sua Avaliação
                    </a>
                </div>
                <div class="relative animate-fadeIn" style="animation-delay: 0.3s">
                    <div class="aspect-square rounded-3xl overflow-hidden shadow-2xl animate-float">
                        <img src="${content.heroImage}" alt="Design de Sobrancelhas" class="w-full h-full object-cover">
                    </div>
                    <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style="background: var(--rose-gold)"></div>
                    <div class="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20" style="background: var(--brown-soft)"></div>
                </div>
            </div>
            <div class="decorative-curve">
                <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 100C240 150 480 50 720 100C960 150 1200 50 1440 100V200H0V100Z" fill="var(--cream)"/>
                </svg>
            </div>
        </section>
        
        <!-- Sobre Section -->
        <section id="sobre" class="py-24 px-6" style="background: var(--cream)">
            <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div class="order-2 md:order-1">
                    <h2 class="font-display text-5xl font-bold mb-6" style="color: var(--brown-dark)">${content.aboutTitle}</h2>
                    <div class="space-y-4 text-lg leading-relaxed" style="color: var(--text-dark)">
                        <p>${content.aboutText1}</p>
                        <p>${content.aboutText2}</p>
                        <p>${content.aboutText3}</p>
                    </div>
                    <div class="mt-10 grid grid-cols-3 gap-6">
                        <div class="text-center">
                            <div class="font-display text-4xl font-bold mb-2" style="color: var(--brown-medium)">5+</div>
                            <div class="text-sm">Anos de Experiência</div>
                        </div>
                        <div class="text-center">
                            <div class="font-display text-4xl font-bold mb-2" style="color: var(--brown-medium)">2000+</div>
                            <div class="text-sm">Clientes Satisfeitas</div>
                        </div>
                        <div class="text-center">
                            <div class="font-display text-4xl font-bold mb-2" style="color: var(--brown-medium)">100%</div>
                            <div class="text-sm">Dedicação</div>
                        </div>
                    </div>
                </div>
                <div class="order-1 md:order-2 relative">
                    <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img src="${content.aboutImage}" alt="Taynara" class="w-full h-auto">
                    </div>
                    <div class="absolute -bottom-6 -left-6 w-48 h-48 rounded-full opacity-30 -z-10" style="background: var(--nude-medium)"></div>
                </div>
            </div>
        </section>
        
        <!-- Serviços Section -->
        <section id="servicos" class="py-24 px-6 bg-pattern">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="font-display text-5xl font-bold mb-4" style="color: var(--brown-dark)">Serviços</h2>
                    <p class="text-xl max-w-2xl mx-auto" style="color: var(--text-dark)">Técnicas especializadas para realçar sua beleza natural</p>
                </div>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${services.map((service, index) => `
                        <div class="service-card p-8 rounded-3xl shadow-lg" style="background: white; animation-delay: ${index * 0.1}s">
                            <div class="text-5xl mb-4">${service.icon}</div>
                            <h3 class="font-display text-2xl font-bold mb-3" style="color: var(--brown-dark)">${service.title}</h3>
                            <p class="mb-4 leading-relaxed" style="color: var(--text-dark)">${service.description}</p>
                            <div class="font-semibold" style="color: var(--brown-medium)">${service.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        
        <!-- Galeria Section -->
        <section id="galeria" class="py-24 px-6" style="background: var(--cream)">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="font-display text-5xl font-bold mb-4" style="color: var(--brown-dark)">Galeria de Trabalhos</h2>
                    <p class="text-xl" style="color: var(--text-dark)">Confira alguns dos nossos trabalhos realizados</p>
                </div>
                <div class="gallery-grid">
                    ${gallery.map(item => `
                        <div class="gallery-item" onclick="openLightbox('${item.url}')">
                            <img src="${item.url}" alt="Trabalho">
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        
        <!-- Contato Section -->
        <section id="contato" class="py-24 px-6 bg-pattern">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="font-display text-5xl font-bold mb-6" style="color: var(--brown-dark)">Entre em Contato</h2>
                <p class="text-xl mb-12" style="color: var(--text-dark)">${content.contactText}</p>
                <div class="grid md:grid-cols-3 gap-8 mb-12">
                    <div class="p-6">
                        <div class="text-4xl mb-3">📱</div>
                        <h3 class="font-bold mb-2" style="color: var(--brown-dark)">WhatsApp</h3>
                        <p>${content.phone}</p>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl mb-3">📍</div>
                        <h3 class="font-bold mb-2" style="color: var(--brown-dark)">Endereço</h3>
                        <p>${content.address}</p>
                    </div>
                    <div class="p-6">
                        <div class="text-4xl mb-3">⏰</div>
                        <h3 class="font-bold mb-2" style="color: var(--brown-dark)">Horário</h3>
                        <p>${content.hours}</p>
                    </div>
                </div>
                <a href="https://wa.me/55${content.phone.replace(/\D/g, '')}" target="_blank" class="inline-block px-12 py-5 rounded-full font-semibold text-white text-xl transition-all hover:scale-105 shadow-xl" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%)">
                    Fale no WhatsApp
                </a>
            </div>
        </section>
        
        <!-- Footer -->
        <footer class="py-12 px-6 text-center" style="background: var(--brown-dark); color: var(--cream)">
            <div class="max-w-7xl mx-auto">
                <div class="font-display text-3xl font-bold mb-4">Taynara Design</div>
                <p class="mb-6">Especialista em Design de Sobrancelhas</p>
                <p class="text-sm opacity-70">© 2026 Taynara Design. Todos os direitos reservados.</p>
            </div>
        </footer>
        
        <!-- WhatsApp Float Button -->
        <div class="whatsapp-float" onclick="window.open('https://wa.me/55${content.phone.replace(/\D/g, '')}', '_blank')">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
        </div>
        
        <!-- Lightbox Modal -->
        <div id="lightbox" class="fixed inset-0 bg-black/90 z-50 hidden items-center justify-center p-6" onclick="closeLightbox()">
            <img id="lightbox-img" src="" alt="Preview" class="max-w-full max-h-full object-contain rounded-lg">
            <button class="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform">×</button>
        </div>
    `;
}

function renderAdminLogin() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-pattern px-6">
            <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
                <div class="text-center mb-8">
                    <div class="text-6xl mb-4">🔐</div>
                    <h2 class="font-display text-4xl font-bold" style="color: var(--brown-dark)">Painel Administrativo</h2>
                    <p class="mt-2 opacity-70">Digite o código PIN para acessar</p>
                </div>
                <form onsubmit="handleLogin(event)" class="space-y-6">
                    <div>
                        <label class="block mb-2 font-medium text-center">Código PIN</label>
                        <input type="password" id="pin-input" class="w-full px-4 py-4 rounded-xl border-2 focus:outline-none text-center text-2xl font-bold tracking-widest" style="border-color: var(--nude-medium)" placeholder="••••" maxlength="4" required>
                    </div>
                    <div id="error-msg" class="hidden p-3 rounded-xl bg-red-100 text-red-700 text-center"></div>
                    <button type="submit" class="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-105" style="background: linear-gradient(135deg, var(--brown-medium) 0%, var(--brown-dark) 100%)">Entrar</button>
                    <p class="text-center text-sm opacity-60 mt-4">PIN padrão: 1002</p>
                </form>
            </div>
        </div>
    `;
}

// ============================================
// EVENT HANDLERS
// ============================================
window.openLightbox = function(url) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = url;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
};

window.handleLogin = async function(event) {
    event.preventDefault();
    const pin = document.getElementById('pin-input').value;
    const errorMsg = document.getElementById('error-msg');
    
    const isValid = await checkPin(pin);
    if (isValid) {
        currentUser = true;
        window.location.hash = '#admin-panel';
        renderAdminPanel();
    } else {
        errorMsg.textContent = 'Código PIN incorreto';
        errorMsg.classList.remove('hidden');
    }
};

// ============================================
// ADMIN PANEL (próximo arquivo - está ficando muito grande)
// ============================================
function renderAdminPanel() {
    // Implementação do painel admin será no próximo arquivo
    const root = document.getElementById('root');
    root.innerHTML = '<div class="min-h-screen flex items-center justify-center"><h1 class="text-4xl">Painel Admin em desenvolvimento...</h1></div>';
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    await loadContent();
    await loadGallery();
    await loadServices();
    
    const hash = window.location.hash;
    if (hash === '#admin' || hash === '#admin-panel') {
        if (hash === '#admin-panel' && currentUser) {
            renderAdminPanel();
        } else {
            renderAdminLogin();
        }
    } else {
        renderSite();
    }
}

// Start app
init();
