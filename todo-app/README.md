# Todo Uygulaması

Next.js 14 ve Laravel API ile geliştirilmiş modern bir todo (yapılacaklar) uygulaması.

## 🚀 Özellikler

### Temel Özellikler (MVP) ✅
- ✅ **CRUD İşlemleri**: Todo oluşturma, okuma, güncelleme ve silme
- ✅ **Filtreleme**: Durum, öncelik, etiket ve metin aramasına göre filtreleme
- ✅ **Sıralama**: Oluşturulma tarihi, bitiş tarihi ve başlığa göre sıralama
- ✅ **Sayfalama**: Sunucu taraflı sayfalama desteği
- ✅ **Form Doğrulama**: Zod ile hem istemci hem sunucu tarafında doğrulama
- ✅ **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- ✅ **Modern UI**: TailwindCSS ile temiz ve kullanıcı dostu arayüz
- ✅ **Laravel API Entegrasyonu**: Gerçek HTTP istekleriyle backend bağlantısı

### Gelişmiş Özellikler (Artı Puan) ⭐
- ⭐ **Etiketler (Tags)**: Çoklu etiket ekleme ve etikete göre filtreleme
- ⭐ **Toplu İşlemler**: Çoklu seçip toplu silme, status ve öncelik değiştirme
- ⭐ **Drag & Drop**: Status sütunları arasında sürükle-bırak (Kanban görünümü)
- ⭐ **Bildirim/Toasts**: İşlem başarı/hatada kullanıcıya geri bildirim
- ⭐ **Testler**: Jest + React Testing Library
- ⭐ **AI Chatbot**: OpenAI entegrasyonu ile akıllı todo asistanı (🔒 API key gerekli)

## 🔒 Güvenlik Notu

**API Key'ler Güvenli Şekilde Saklanıyor:**
- ✅ OpenAI API key'i kodda hardcoded değil
- ✅ Environment variables ile güvenli şekilde yönetiliyor
- ✅ GitHub'da hiçbir API key bulunmuyor
- ✅ Canlı demo'da tam fonksiyonel çalışıyor
- ✅ Local development için `.env.local` dosyası gerekli

### Görünüm Modları
- **Grid View**: Kart görünümü
- **List View**: Kompakt liste görünümü
- **Kanban View**: Drag & drop ile status yönetimi

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Laravel API (backend)
- OpenAI API Key (chatbot için gerekli)

## 🛠️ Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd todo-app
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın:**
```bash
cp env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
OPENAI_API_KEY=your_openai_api_key_here  # Required for chatbot
```

**Not**: `.env.local` dosyası otomatik olarak `.gitignore`'da bulunur ve GitHub'a pushlanmaz. API key'leriniz güvende kalır.

**Chatbot için**: OpenAI API key'i gerekli. API key olmadan chatbot çalışmaz.

**🔒 Güvenlik**: Bu projede API key'ler güvenli şekilde environment variables olarak yönetiliyor. Kodda hardcoded API key bulunmuyor.

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Route Handlers
│   │   ├── chat/          # Chatbot API endpoint
│   │   └── todos/         # Todo API endpoints
│   ├── globals.css        # Global CSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   ├── ui/               # Temel UI bileşenleri
│   ├── BulkActionsToolbar.tsx  # Toplu işlemler toolbar
│   ├── Chatbot.tsx       # OpenAI chatbot
│   ├── DraggableTodo.tsx # Drag & drop todo
│   ├── FilterBar.tsx     # Filtreleme çubuğu
│   ├── KanbanBoard.tsx   # Kanban board
│   ├── KanbanColumn.tsx  # Kanban sütunu
│   ├── Tag.tsx           # Tag bileşeni
│   ├── TagSelector.tsx   # Tag seçici
│   ├── TodoCard.tsx      # Todo kartı
│   ├── TodoForm.tsx      # Todo formu
│   ├── TodoList.tsx      # Todo listesi
│   └── Pagination.tsx    # Sayfalama
├── hooks/                # Custom React hooks
│   └── useTodos.ts       # Todo yönetimi hook'u
├── lib/                  # Yardımcı fonksiyonlar
│   ├── api.ts           # API istemci
│   ├── openai.ts        # OpenAI entegrasyonu
│   ├── schemas.ts       # Zod şemaları
│   └── utils.ts         # Utility fonksiyonlar
└── types/               # TypeScript tip tanımları
    └── todo.ts          # Todo tipleri
```

## 🔌 API Entegrasyonu

### Todo Endpoints
- `GET /api/todos` - Todo listesi (filtreleme, sıralama, sayfalama)
- `POST /api/todos` - Yeni todo oluşturma
- `GET /api/todos/:id` - Tekil todo getirme
- `PATCH /api/todos/:id` - Todo güncelleme
- `DELETE /api/todos/:id` - Todo silme

### Toplu İşlem Endpoints
- `POST /api/todos/bulk-delete` - Çoklu todo silme
- `POST /api/todos/bulk-update-status` - Çoklu status güncelleme
- `POST /api/todos/bulk-update-priority` - Çoklu öncelik güncelleme

### Tag Endpoints
- `GET /api/tags` - Tüm etiketleri getir
- `POST /api/tags` - Yeni etiket oluştur
- `PATCH /api/tags/:id` - Etiket güncelle
- `DELETE /api/tags/:id` - Etiket sil

### Filtreleme Parametreleri
```
GET /api/todos?status=todo,in_progress&priority=high&search=auth&tags=1,2&sort=dueDate:asc&page=1&limit=12
```

### Todo Veri Modeli
```typescript
interface Todo {
  id: number
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

interface Tag {
  id: number
  name: string
  color: string
  createdAt: string
  updatedAt: string
}
```

## 🎨 UI Bileşenleri

### Temel Bileşenler
- **Button** - Çoklu varyant ve boyut desteği
- **Input** - Form input alanları
- **Textarea** - Çok satırlı metin alanları
- **Select** - Dropdown seçim alanları
- **Modal** - Popup modal pencereler
- **Badge** - Durum ve öncelik etiketleri
- **Toast** - Bildirim mesajları
- **Spinner** - Yükleme animasyonu
- **Tag** - Etiket gösterimi
- **TagSelector** - Etiket seçici

### Özel Bileşenler
- **TodoCard** - Todo gösterim kartı
- **TodoForm** - Todo oluşturma/düzenleme formu
- **FilterBar** - Gelişmiş filtreleme arayüzü
- **TodoList** - Todo listesi yönetimi
- **Pagination** - Sayfalama kontrolü
- **BulkActionsToolbar** - Toplu işlemler toolbar
- **KanbanBoard** - Kanban board görünümü
- **Chatbot** - AI destekli todo asistanı

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint

# Kod formatlama
npm run format

# Testler
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🎯 Özellik Detayları

### Filtreleme
- **Durum**: Yapılacak, Devam Ediyor, Tamamlandı
- **Öncelik**: Düşük, Orta, Yüksek
- **Arama**: Başlık ve açıklama metinlerinde arama
- **Etiket**: Etiketlere göre filtreleme
- **Kombinasyon**: Birden fazla filtreyi birlikte kullanma

### Sıralama
- Oluşturulma tarihi (artan/azalan)
- Bitiş tarihi (yakın/uzak)
- Başlık (A-Z / Z-A)

### Toplu İşlemler
- ✅ Çoklu seçim ile checkbox
- ✅ Toplu silme
- ✅ Toplu status değiştirme
- ✅ Toplu öncelik değiştirme
- ✅ Seçimi temizleme

### Drag & Drop
- ✅ Kanban board görünümü
- ✅ Status sütunları arasında sürükle-bırak
- ✅ Smooth animasyonlar
- ✅ Görsel geri bildirim

### AI Chatbot
- ✅ OpenAI GPT-3.5 Turbo entegrasyonu
- ✅ Todo verilerini görme
- ✅ Akıllı öneriler
- ✅ Türkçe dil desteği
- ✅ Gerçek zamanlı mesajlaşma
- ✅ API key gerekli

### Form Doğrulama
- **İstemci tarafı**: Zod ile anlık doğrulama
- **Sunucu tarafı**: API'de tekrar doğrulama
- **Hata mesajları**: Türkçe kullanıcı dostu mesajlar

## 🧪 Testler

Proje Jest ve React Testing Library ile test edilmiştir:

```bash
# Testler
npm test

# Coverage raporu
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Kapsamı
- ✅ Component testleri
- ✅ Utility fonksiyon testleri
- ✅ API mock testleri
- ✅ Zod schema doğrulama testleri

## 📱 Responsive Tasarım

Uygulama tüm cihaz boyutlarında optimize edilmiştir:

- **Mobil** (< 768px): Tek sütunlu düzen
- **Tablet** (768px - 1024px): İki sütunlu düzen
- **Masaüstü** (> 1024px): Üç sütunlu düzen

## 🚀 Deployment

### Vercel (Önerilen)
1. GitHub repository'sini Vercel'e bağlayın
2. Environment variables'ları ayarlayın:
   - `NEXT_PUBLIC_API_URL`: Backend API URL'i
   - `OPENAI_API_KEY`: OpenAI API key'i (chatbot için)
3. Otomatik deployment aktif olacaktır

**🔒 Güvenlik**: Vercel'de environment variables güvenli şekilde saklanır ve kodda görünmez.

### Diğer Platformlar
- **Netlify**: Static site olarak deploy
- **Railway**: Full-stack uygulama olarak deploy
- **Docker**: Containerized deployment

## 🤖 AI Chatbot Kullanımı

Chatbot özelliği OpenAI API kullanarak akıllı todo yönetimi sağlar. **API key gerekli:**

### Örnek Sorular:
- "Bugün ne yapmalıyım?"
- "Hangi todo'lar geç kaldı?"
- "En önemli 3 todo hangisi?"
- "Bu hafta ne yapmalıyım?"

### Özellikler:
- Todo verilerinizi gerçek zamanlı görür
- Akıllı öneriler sunar
- Türkçe dil desteği
- Kullanıcı dostu arayüz

**🔒 Güvenlik**: API key environment variable olarak saklanır, kodda görünmez.

## 🔒 Güvenlik

- ✅ Environment variables ile API key koruması
- ✅ Server-side API route'lar
- ✅ Input validation (Zod)
- ✅ XSS koruması
- ✅ HTTPS desteği

## 📊 Performans

- ✅ Next.js App Router optimizasyonu
- ✅ Server Components
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Code splitting

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 14+** - React framework
- **TypeScript** - Tip güvenliği
- **TailwindCSS** - CSS framework
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - İkonlar
- **@dnd-kit** - Drag & drop

### Backend
- **Laravel 12+** - PHP framework
- **SQLite** - Database
- **Eloquent ORM** - Database ORM

### AI & Tools
- **OpenAI API** - GPT-3.5 Turbo
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Linting
- **Prettier** - Code formatting

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

Bu proje Ethis Stajyer değerlendirmesi kapsamında geliştirilmiştir.

### Geliştirme Notları

**Karar Noktaları:**
1. **Next.js App Router**: Modern ve performanslı routing için seçildi
2. **TypeScript**: Tip güvenliği ve geliştirici deneyimi için kullanıldı
3. **TailwindCSS**: Hızlı ve responsive UI geliştirme için tercih edildi
4. **Zod**: Hem client hem server validation için kullanıldı
5. **OpenAI**: AI chatbot özelliği için entegre edildi

**Yaşanan Zorluklar:**
1. **Laravel pivot table**: Many-to-many ilişki kurmak için pivot table ismi açıkça belirtilmeli
2. **Environment variables**: Next.js'te `.env.local` değişkenleri sadece server-side erişilebilir
3. **Drag & drop**: Kanban board'da smooth animasyonlar için `@dnd-kit` kütüphanesi kullanıldı
4. **API key security**: OpenAI API key'in güvenli bir şekilde saklanması için server-side route kullanıldı
5. **Bulk operations**: Toplu işlemlerde UI state yönetimi ve API entegrasyonu
6. **Test setup**: Jest ve React Testing Library ile component testleri kurulumu

---

**Not**: Bu uygulama Laravel backend API'si ile çalışacak şekilde tasarlanmıştır. Backend API'si ayrıca kurulmalı ve çalıştırılmalıdır.