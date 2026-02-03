cat > README.md << 'EOF'
# 🛒 Headless E-commerce Dashboard

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?logo=tailwindcss)
![Pinia](https://img.shields.io/badge/Pinia-2.1-yellow?logo=pinia)
![Vite](https://img.shields.io/badge/Vite-7.3-646cff?logo=vite)

> Modern, headless e-commerce admin panel built with Vue 3, TypeScript, and Tailwind CSS. Perfect for portfolio and production use.

## ✨ Features

### 🏗️ Architecture
- **Headless Architecture** - Works with any backend API
- **Modular Structure** - Clean separation of concerns
- **TypeScript First** - Full type safety
- **Composition API** - Modern Vue 3 patterns

### 📊 Dashboard Modules
- 📦 **Products Management** - Full CRUD with image upload
- 📈 **Sales Analytics** - Interactive charts and metrics
- 🛍️ **Orders Management** - Kanban board with drag & drop
- 🔔 **Real-time Notifications** - WebSocket integration
- 🌓 **Dark/Light Themes** - Automatic system detection
- 🌐 **Internationalization** - Multi-language support

### 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Vue 3 + Composition API |
| Language | TypeScript 5 |
| State Management | Pinia |
| API Client | TanStack Query (Vue Query) |
| Styling | Tailwind CSS + Headless UI |
| Charts | Chart.js + vue-chart-3 |
| Routing | Vue Router 4 |
| Testing | Vitest + Playwright |
| Linting | ESLint + Prettier |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+ or pnpm 8+ or yarn 1.22+

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/HEDb.git
cd HEDb

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Lint and format code
📁 Project Structure
text
src/
├── api/              # API layer (clients, endpoints, mocks)
├── components/       # Vue components
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── shared/      # Shared components
├── composables/      # Vue composables
├── stores/           # Pinia stores
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── views/            # Page components
└── locales/          # Internationalization files
```

### 🎨 UI Components
We use a custom design system built with:

Tailwind CSS for styling
Headless UI for accessible components
Lucide Icons for icons
Dark mode with system preference detection

### 🔌 API Integration
The dashboard uses a headless approach, connecting to:
Mock Service Worker for development
REST API with TanStack Query for caching
WebSocket for real-time updates
Supabase/Strapi ready (can be connected)

###🧪 Testing
```bash
# Unit tests with Vitest
npm run test:unit

# E2E tests with Playwright
npm run test:e2e

# Run all tests
npm test
```

### 🐳 Docker Deployment
```bash
# Build Docker image
docker build -t ecommerce-dashboard .

# Run container
docker run -p 3000:3000 ecommerce-dashboard
```

### 📦 Build for Production
```bash
# Build the project
npm run build

# The build artifacts will be in the `dist` directory
# Ready to deploy to Vercel, Netlify, or any static hosting
```
### 🔧 Configuration
Environment Variables
```
Create .env file:

env
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3002
VITE_APP_NAME="E-commerce Dashboard"
Tailwind Configuration
See tailwind.config.js for custom theming, colors, and plugins.
```

### 🤝 Contributing
Fork the project
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

### 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

### 🙏 Acknowledgments
Vue.js - Progressive JavaScript Framework  
Tailwind CSS - Utility-first CSS framework  
TanStack Query - Powerful async state management  
Chart.js - Simple yet flexible JavaScript charting  

### 📞 Contact
kali-krit@mail.ru  
Project Link: https://github.com/kalikrit/HEDb  

<div align="center">
Made with ❤️ and Vue 3

⭐ Star this repo if you found it useful!

</div>