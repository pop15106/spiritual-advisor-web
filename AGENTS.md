# AGENTS.md - Development Guidelines for Spiritual Advisor Web

This file contains build commands, code style guidelines, and development patterns for agentic coding agents working in this repository.

## 🚀 Build & Development Commands

### Core Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Testing
- No test framework is currently configured
- When adding tests, prefer Jest + React Testing Library
- Single test command should be: `npm test -- --testNamePattern="test name"`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard routes
│   ├── history/           # User history page
│   ├── layout.tsx         # Root layout with font config
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # App-wide providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── *Section.tsx       # Feature-specific sections (Tarot, Bazi, etc.)
│   ├── UserMenu.tsx       # User authentication menu
│   └── ApiKeyModal.tsx    # API key management modal
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state management
└── services/              # API services
    └── api.ts             # Centralized API client
```

## 🎨 Code Style Guidelines

### TypeScript Configuration
- Strict mode enabled
- Target: ES2017
- Path alias: `@/*` maps to `./src/*`
- JSX transform: React-JSX

### Import Organization
```typescript
// 1. React/Next.js imports (type imports first)
import type { Metadata } from "next";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

// 2. Local imports (use path aliases)
import { Providers } from "./providers";
import { tarotApi, TarotCard } from "@/services/api";

// 3. Third-party libraries
import { SomeComponent } from "third-party-lib";
```

### Component Patterns
```typescript
// Functional component with TypeScript
"use client"; // Add for client components

interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  children?: React.ReactNode;
}

export default function ComponentName({ 
  requiredProp, 
  optionalProp = 0,
  children 
}: ComponentProps) {
  const [state, setState] = useState<Type>(initialValue);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  return (
    <div className="container mx-auto px-4">
      {/* JSX content */}
    </div>
  );
}
```

### Naming Conventions
- **Components**: PascalCase (e.g., `TarotSection`, `UserMenu`)
- **Functions**: camelCase (e.g., `handleAnalyze`, `fetchTrials`)
- **Variables**: camelCase (e.g., `question`, `spreadType`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAJOR_ARCANA_FILES`, `API_BASE`)
- **Interfaces**: PascalCase with descriptive suffixes (e.g., `TarotCard`, `AuthContextType`)

### API Service Patterns
```typescript
// Service object with typed interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const apiService = {
  method: async (param: Type): Promise<ResponseType> => {
    try {
      const response = await fetch(`${API_BASE}/endpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ param }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }
};
```

### State Management
- Use React Context for global state (see `AuthContext.tsx`)
- Local component state with `useState`/`useReducer`
- Server state via API calls in components or custom hooks
- Stream responses handled with callback patterns

### Error Handling
```typescript
// API error handling pattern
try {
  const result = await apiCall();
  setData(result);
} catch (error) {
  console.error('Operation failed:', error);
  setError(error instanceof Error ? error.message : 'Unknown error');
} finally {
  setLoading(false);
}
```

### Styling with Tailwind CSS
- Use Tailwind utility classes exclusively
- Responsive design with mobile-first approach
- Component-specific styling in `className` props
- Custom colors follow spiritual theme: purple, violet, amber

### File Organization
- Keep components under 200 lines when possible
- Extract complex logic into custom hooks
- Group related constants and interfaces at file top
- Use JSDoc comments for complex functions

## 🔧 Development Patterns

### Component Sections
Each feature section (Tarot, Bazi, etc.) follows this pattern:
1. State management for user inputs
2. API integration with streaming support
3. Loading/error states
4. Results display with animations
5. Re-calculate/reset functionality

### Streaming API Pattern
```typescript
// For AI streaming responses
await api.analyzeStream(
  params,
  (data) => setData(data),      // Initial data
  (chunk) => setPrev(prev + chunk), // Text chunks
  () => setLoading(false),      // Completion
  (err) => setError(err.message) // Error
);
```

### Environment Variables
- Use `.env.local` for local development
- Prefix with `NEXT_PUBLIC_` for client-side access
- Required: `NEXT_PUBLIC_API_URL`

### Authentication Flow
- Google OAuth integration via `@react-oauth/google`
- Token stored in localStorage
- Context provider for auth state
- Trial system for API usage limits

## 📝 Content Guidelines

### Language Support
- Primary: Traditional Chinese (zh-TW)
- UI text in Chinese, code comments in English
- Metadata and descriptions in Chinese

### Spiritual Content
- Tarot: RWS deck with Major/Minor Arcana
- Chinese metaphysics: Bazi, Human Design, Astrology, Ziwei
- Integration: AI-powered cross-system analysis

## 🎯 Best Practices

### Performance
- Use Next.js Image for tarot card images
- Implement loading states for API calls
- Optimize bundle size with dynamic imports
- Leverage Next.js caching for static assets

### Accessibility
- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color schemes

### Security
- API keys managed via admin dashboard
- Input validation on forms
- XSS prevention with React's built-in protection
- CSRF protection via Next.js defaults

## 🚀 Deployment Notes

- Build target: Production
- Static assets in `/public` (tarot card images)
- Environment variables required for API connectivity
- Admin dashboard credentials managed separately

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Project README for setup instructions