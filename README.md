# 🍽️ PrivateDiningPros

> **The Ultimate NYC Private Dining Directory**  
> Discover and manage exclusive private dining venues across New York City

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://www.privatediningpros.com)

---

## 📖 About

**PrivateDiningPros** is a comprehensive platform connecting event planners, corporate teams, and individuals with New York City's finest private dining venues. Whether you're planning an intimate dinner for 10 or a corporate event for 100, our curated directory makes it easy to find the perfect space.

### 🌟 Key Features

- **🗺️ Interactive Map** - Explore restaurants by neighborhood with Mapbox integration
- **🔍 Advanced Search** - Filter by capacity, cuisine, price range, and amenities
- **📸 Rich Media** - High-quality images powered by ImageKit CDN
- **⭐ Reviews & Ratings** - Authentic feedback from Google Places API
- **👥 Multi-Role System** - User, Admin, and Super Admin access levels
- **📊 Analytics Dashboard** - Track submissions, approvals, and trends
- **🤖 AI-Powered** - Auto-generate descriptions with OpenAI
- **📱 Responsive Design** - Beautiful UI on all devices

---

## 🚀 Live Demo

**Production:** [https://www.privatediningpros.com](https://www.privatediningpros.com)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (migrating from Chakra UI)
- **Icons:** Lucide React
- **Maps:** Mapbox GL JS
- **Markdown:** react-markdown + remark-gfm

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Authentication:** NextAuth.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Image CDN:** ImageKit.io
- **Data Enrichment:** Outscraper API (Google Places)
- **AI:** OpenAI GPT-4

### DevOps
- **Hosting:** Vercel
- **Version Control:** Git + GitHub
- **CI/CD:** Vercel Auto-Deployment
- **Environment:** Node.js 20+

---

## 📦 Installation

### Prerequisites

- Node.js 20+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/jjaramillo34/privatediningpros.git
cd privatediningpros
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatediningpros

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Outscraper (Optional - for data enrichment)
OUTSCRAPER_API_KEY=your_outscraper_key

# OpenAI (Optional - for AI descriptions)
OPENAI_API_KEY=sk-your-openai-key

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
privatediningpros/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (auth)/
│   │   │   └── signin/          # Sign-in page
│   │   ├── admin/               # Admin dashboard
│   │   │   └── edit/[id]/       # Restaurant edit page
│   │   ├── super-admin/         # Super admin dashboard
│   │   ├── restaurant/[id]/     # Restaurant detail page
│   │   ├── map/                 # Interactive map page
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── restaurants/     # Restaurant CRUD
│   │   │   ├── users/           # User management
│   │   │   ├── upload-image/    # Image uploads
│   │   │   └── outscraper-enhance/ # Data enrichment
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── restaurant/          # Restaurant-specific components
│   │   │   ├── RestaurantHero.tsx
│   │   │   ├── RestaurantSidebar.tsx
│   │   │   └── PrivateRoomsDisplay.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── RestaurantMap.tsx
│   ├── lib/                     # Utilities and configs
│   │   ├── mongodb.ts           # MongoDB connection
│   │   ├── auth.ts              # NextAuth config
│   │   ├── imagekit.ts          # ImageKit integration
│   │   ├── restaurant.model.ts  # Mongoose schema
│   │   └── user.model.ts        # User schema
│   └── data/                    # Static data files
├── public/                      # Static assets
├── scripts/                     # Utility scripts
│   ├── create-indexes.js        # MongoDB index creation
│   └── migrate-to-production.js # Data migration
├── .env.local                   # Environment variables (gitignored)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
└── package.json                 # Dependencies
```

---

## 🗄️ Database Schema

### Restaurant Model

```typescript
{
  name: string;
  address: string;
  full_address: string;
  city: string;
  state: string;
  postal_code: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  description: string;           // Markdown format
  short_description: string;
  image: string;                 // Main image URL
  images: [                      // Gallery images
    {
      url: string;
      alt: string;
      title: string;
      source: string;
      website: {...};
      dimensions: {...};
      position: number;
    }
  ];
  rating: number;
  reviews: number;
  working_hours: object;
  category: string;
  price_range: string;
  privateRooms: [
    {
      name: string;
      capacity: number;
      description: string;
      setup: string;              // Event types supported
    }
  ];
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  // ... additional fields
}
```

### User Model

```typescript
{
  name: string;
  email: string;
  password: string;              // Hashed
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔑 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/restaurants` | List all approved restaurants |
| `GET` | `/api/restaurants?featured=true` | List featured restaurants |
| `GET` | `/api/restaurants/[id]` | Get restaurant details |

### Authenticated Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/restaurants` | Create restaurant | User+ |
| `PUT` | `/api/restaurants/[id]` | Update restaurant | Admin+ |
| `DELETE` | `/api/restaurants/[id]` | Delete restaurant | Super Admin |
| `POST` | `/api/users` | Create user | Super Admin |
| `PUT` | `/api/restaurants/[id]/status` | Approve/reject | Admin+ |
| `POST` | `/api/upload-image` | Upload single image | Admin+ |
| `POST` | `/api/upload-images-from-urls` | Bulk image upload | Admin+ |
| `POST` | `/api/outscraper-enhance` | Enrich data | Admin+ |

---

## 👥 User Roles

### 🧑 User
- Submit new restaurant suggestions
- View all approved restaurants
- Use search and map features

### 🛡️ Admin
- All User permissions
- Edit restaurant details
- Approve/reject submissions
- Upload images
- Access admin dashboard

### 👑 Super Admin
- All Admin permissions
- Manage users (create, edit, delete)
- Delete restaurants
- View analytics
- Access super-admin dashboard
- Bulk operations

---

## 🎨 Key Features in Detail

### 1. Interactive Map

Browse restaurants visually on an interactive Mapbox map:
- **Color-coded markers** by price range ($, $$, $$$)
- **Cluster markers** for dense areas
- **Click markers** to view details
- **Fly-to animation** when selecting from list
- **Filter by capacity, amenities, and more**

### 2. Data Enrichment

Automatically enhance restaurant data using Outscraper API:
- Extract from Google Places
- Fetch high-quality photos
- Get ratings and reviews
- Update operating hours
- Generate AI descriptions

### 3. Image Management

Complete image workflow with ImageKit:
- **Upload from URLs** directly in admin panel
- **Manual metadata editor** for alt text, titles, sources
- **Thumbnail previews** in super-admin table
- **CDN optimization** automatic
- **Drag-and-drop support** (coming soon)

### 4. Admin Dashboards

**Admin Dashboard:**
- View all restaurants
- Quick approve/reject
- Edit details
- Upload images

**Super Admin Dashboard:**
- User management
- Advanced analytics
- System-wide operations
- Image thumbnail column
- Bulk actions

### 5. Advanced Search & Filters

Filter restaurants by:
- Name, category, neighborhood
- Price range ($-$$$)
- Capacity (10, 20, 50, 100+ guests)
- Status (pending/approved/rejected)
- Featured status
- Alphabetical sorting

---

## 🧪 Database Optimization

### Indexes

MongoDB indexes for optimal performance:

```javascript
// Compound index for status filtering + sorting
{ status: 1, createdAt: -1 }

// Single field indexes
{ featured: 1 }
{ name: 1 }
{ neighborhood: 1 }
{ category: 1 }
{ rating: -1 }
{ place_id: 1 }
{ google_id: 1 }
```

### Query Optimization

- **Field selection** - Only fetch necessary fields
- **Lean queries** - Plain objects instead of Mongoose documents
- **80-90% faster** on MongoDB free tier
- **5-10x performance improvement** in super-admin dashboard

---

## 🔒 Authentication

NextAuth.js with credentials provider:

```typescript
// Sign in
POST /api/auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}

// Session management
GET /api/auth/session
```

Protected routes automatically redirect to sign-in page.

---

## 🌍 Environment Setup

### Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Scripts

```bash
# Create MongoDB indexes
node scripts/create-indexes.js

# Migrate data to production
node scripts/migrate-to-production.js

# Create demo users
node scripts/create-demo-users.js
```

---

## 📸 Screenshots

### Homepage
Beautiful landing page with featured restaurants and search.

### Interactive Map
Explore NYC restaurants with clustering and filters.

### Restaurant Detail
Rich detail pages with galleries, reviews, and private room info.

### Admin Dashboard
Manage submissions with approve/reject workflow.

### Super Admin
Advanced analytics, user management, and bulk operations.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **🐛 Report Bugs** - Found a bug? [Open an issue](https://github.com/jjaramillo34/privatediningpros/issues)
2. **💡 Suggest Features** - Have an idea? Share it!
3. **📝 Improve Documentation** - Help others understand
4. **🎨 Design Improvements** - Enhance the UI/UX
5. **🔧 Code Contributions** - Submit pull requests

### Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/privatediningpros.git
   cd privatediningpros
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes locally

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "✨ Add new feature: description"
   ```

   **Commit Message Format:**
   - `✨ feat:` New feature
   - `🐛 fix:` Bug fix
   - `📝 docs:` Documentation
   - `💄 style:` Styling/formatting
   - `♻️ refactor:` Code refactoring
   - `⚡ perf:` Performance improvement
   - `✅ test:` Tests
   - `🔧 chore:` Maintenance

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes
   - Submit!

### Pull Request Guidelines

✅ **DO:**
- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Test your changes thoroughly
- Write clear commit messages
- Reference related issues

❌ **DON'T:**
- Mix multiple features in one PR
- Include unrelated changes
- Break existing functionality
- Skip testing

### Code Style

- **TypeScript** - Use types, avoid `any`
- **Components** - Functional components with hooks
- **Naming** - PascalCase for components, camelCase for functions
- **Formatting** - Prettier/ESLint (auto-format on save)

### Testing Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Test in browser
open http://localhost:3000

# Build to check for errors
npm run build
```

### Need Help?

- 💬 Join discussions in GitHub Issues
- 📧 Email: javier@privatediningpros.com
- 🐛 Report bugs with detailed steps to reproduce
- 💡 Share ideas in feature requests

---

## 📝 Roadmap

### ✅ Completed
- [x] Core restaurant directory
- [x] Interactive map with Mapbox
- [x] Admin approval workflow
- [x] Image upload with ImageKit
- [x] Data enrichment with Outscraper
- [x] AI-generated descriptions
- [x] Super admin dashboard
- [x] Image thumbnail column
- [x] Performance optimizations

### 🚧 In Progress
- [ ] Migration to shadcn/ui (from Chakra UI)
- [ ] Advanced filtering system
- [ ] User reviews and ratings
- [ ] Booking integration

### 🔮 Future
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Multi-language support
- [ ] API for third-party developers
- [ ] Advanced analytics dashboard
- [ ] Restaurant owner portal
- [ ] Payment integration
- [ ] Social media sharing

---

## 🐛 Known Issues

- Vercel CLI deployment issues (use Git push deployment)
- Outscraper API rate limits (handled with retries)
- ImageKit quota on free tier (upgrade for production)

See [GitHub Issues](https://github.com/jjaramillo34/privatediningpros/issues) for full list.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License

```
MIT License

Copyright (c) 2025 Javier Jaramillo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Developer

**Javier Jaramillo**

- 🌐 Website: [privatediningpros.com](https://www.privatediningpros.com)
- 📧 Email: javier@privatediningpros.com
- 💼 LinkedIn: [linkedin.com/in/javier-jaramillo](https://linkedin.com/in/javier-jaramillo)
- 🐙 GitHub: [@jjaramillo34](https://github.com/jjaramillo34)

### About the Developer

Javier Jaramillo is a full-stack developer passionate about building practical web applications that solve real-world problems. PrivateDiningPros was created to simplify the process of finding private dining venues in NYC, combining modern web technologies with elegant design.

**Specialties:**
- Full-stack web development (Next.js, React, Node.js)
- Database design and optimization (MongoDB, PostgreSQL)
- API integration and development
- Cloud deployment (Vercel, AWS)
- UI/UX design and implementation

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Vercel** - Seamless deployment
- **MongoDB Atlas** - Reliable database hosting
- **ImageKit** - Image optimization and CDN
- **Outscraper** - Google Places data enrichment
- **OpenAI** - AI-powered content generation
- **Mapbox** - Beautiful interactive maps
- **shadcn/ui** - Excellent UI components
- **Lucide** - Beautiful icons

Special thanks to the open-source community for the countless libraries and tools that made this project possible.

---

## 💬 Support

If you find this project useful, please consider:

- ⭐ **Starring the repository** on GitHub
- 🐛 **Reporting bugs** and suggesting features
- 🤝 **Contributing** code or documentation
- ☕ **Supporting** via [Buy Me a Coffee](https://buymeacoffee.com/javierjaramillo)
- 📣 **Sharing** with others who might find it useful

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/jjaramillo34/privatediningpros?style=social)
![GitHub forks](https://img.shields.io/github/forks/jjaramillo34/privatediningpros?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/jjaramillo34/privatediningpros?style=social)

---

<div align="center">

**Built with ❤️ by [Javier Jaramillo](https://github.com/jjaramillo34)**

[🌐 Website](https://www.privatediningpros.com) • [📧 Contact](mailto:javier@privatediningpros.com) • [🐙 GitHub](https://github.com/jjaramillo34/privatediningpros)

© 2025 PrivateDiningPros. All rights reserved.

</div>
