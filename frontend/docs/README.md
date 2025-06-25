# StudentPerks Frontend

A modern React application built with Vite for managing and displaying student deals and discounts.

## 🚀 Features

- **Deal Management**: Browse, search, and filter student deals
- **Category Organization**: Organize deals by categories
- **Store Integration**: Associate deals with specific stores
- **Admin Panel**: Administrative interface for managing deals, categories, and stores
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Built-in theme switching
- **Real-time Search**: Instant search with debouncing
- **Performance Optimized**: Code splitting, lazy loading, and React Query caching

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: React Query + Context API
- **Routing**: React Router DOM
- **Type Safety**: TypeScript
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Shadcn/ui)
│   ├── admin/           # Admin-specific components
│   ├── DealList/        # Deal listing components
│   └── ErrorBoundary/   # Error handling components
├── hooks/               # Custom React hooks
│   ├── deals/           # Deal-related hooks
│   └── queries/         # React Query hooks
├── contexts/            # React Context providers
├── providers/           # App-level providers
├── pages/               # Page components
├── services/            # API service layer
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Design tokens and utilities
└── __tests__/           # Test files and utilities
```

## 🏗️ Architecture

### Component Architecture

The application follows a component-based architecture with clear separation of concerns:

- **Presentation Components**: Pure UI components that receive props and render UI
- **Container Components**: Components that manage state and handle business logic
- **Shared Components**: Reusable components used across the application
- **Page Components**: Top-level route components

### State Management

- **React Query**: Server state management, caching, and synchronization
- **Context API**: Global application state (auth, error handling)
- **Local State**: Component-specific state using useState and useReducer

### Data Flow

1. **API Layer**: Services handle all API communication
2. **Query Layer**: React Query manages server state and caching
3. **Component Layer**: Components consume data through custom hooks
4. **UI Layer**: Pure components render the interface

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update VITE_API_URL to point to your backend
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint

## 🧪 Testing

The application uses Vitest and React Testing Library for testing:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **Hook Tests**: Test custom hooks in isolation

Run tests:
```bash
npm run test
```

Generate coverage report:
```bash
npm run test:coverage
```

## 📦 Build and Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

- `VITE_API_URL`: Backend API URL

## 🎨 Design System

The application uses a consistent design system with:

- **Design Tokens**: Centralized spacing, colors, and typography
- **Component Variants**: Consistent styling patterns
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection with manual override

## 🔧 Performance

Performance optimizations implemented:

- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Dynamic imports for non-critical components
- **Memoization**: React.memo for expensive components
- **Query Caching**: React Query for server state management
- **Bundle Optimization**: Vite's built-in optimizations

## 🔒 Security

Security measures:

- **Input Validation**: Client-side validation with Zod schemas
- **Error Boundaries**: Graceful error handling
- **Authentication**: JWT-based authentication with refresh tokens
- **CORS**: Configured for secure API communication

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.
