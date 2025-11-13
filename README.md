# React Data Grid Assignment

A modern, feature-rich document management system built with React, Next.js, and TypeScript. This application displays 1,000 documents in an interactive data grid with advanced filtering, sorting, search, and column configuration capabilities.

## Features

### Core Functionality

- **Data Grid**: Displays 1,000 document records with 7 columns
  - Document Nr
  - Document Title
  - Description
  - Revision Nr
  - Created Date
  - Document Owner
  - Favourite (toggle)

- **Pagination**: Client-side pagination with configurable page sizes (10, 25, 50, 100)
- **Sorting**: Click column headers to sort ascending/descending/default
- **Column Configuration**: Show/hide columns via dialog
- **Global Search**: Debounced search (300ms) across multiple fields
- **Advanced Filters**: Modal with multiple filter options
  - Date range (from/to)
  - Revision number (equals, greater than, less than)
  - Owner (multi-select)
  - Favourite status
- **Filter Chips**: Visual display of active filters with individual removal
- **Favourite Toggle**: Star icon to mark documents as favourites
- **Reset Functionality**: One-click reset to default state
- **Persistence**: Settings saved to localStorage
  - Column visibility
  - Page size
  - Applied filters
  - Favourite selections

### Bonus Features Implemented

✅ TypeScript implementation  
✅ Debounced search (300ms)  
✅ LocalStorage persistence for settings  
✅ Responsive UI  
✅ Accessibility features (ARIA labels, keyboard navigation)  
✅ Clean, modern design with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Data Persistence**: localStorage
- **Mock Data**: Faker.js - Generate realistic fake data
- **Testing**: Vitest + Testing Library
- **Documentation**: Storybook
- **Code Quality**: ESLint, Prettier with import sorting

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd react-data-grid
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Testing

The project uses [Vitest](https://vitest.dev/) for unit testing with @testing-library/react for component testing.

### Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with UI
yarn test:ui

# Generate coverage report
yarn test:coverage
```

### Test Files

- `lib/utils.test.ts` - Utility function tests (cn helper)
- `lib/data-grid-utils.test.ts` - Data grid filtering, sorting, and pagination tests (39 tests)
- `components/ui/button.test.tsx` - Button component tests (12 tests)
- `components/filter-chips/filter-chips.test.tsx` - Filter chips component tests (12 tests)

**Total: 68 tests covering core functionality**

## Storybook

Component documentation and visual testing with Storybook.

```bash
# Run Storybook development server
yarn storybook

# Build Storybook for production
yarn build-storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

## Code Quality

### Linting

```bash
# Run ESLint
yarn lint

# Fix ESLint errors automatically
yarn lint:fix
```

### Formatting

The project uses Prettier with automatic import sorting via [@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports).

```bash
# Format all files
yarn format

# Check formatting without making changes
yarn format:check
```

**Import Order Configuration:**

1. React imports
2. Next.js imports
3. Third-party packages
4. Alias imports (`@/...`)
5. Relative imports (`./...`)

## Key Design Decisions

### Architecture

- **Component Composition**: Split functionality into focused, reusable components
- **Modular Structure**: Data grid broken into sub-components for better maintainability
- **State Management**: Centralized state in `DataGridContainer` with props drilling for simplicity
- **Data Flow**: Unidirectional data flow with clear parent-child relationships
- **Business Logic Separation**: Filtering and data transformation extracted to pure utility functions

### Performance

- **Memoization**: Used `useMemo` for expensive filtering/sorting operations
- **Debouncing**: 300ms debounce on search to reduce unnecessary re-renders
- **Client-side Processing**: All operations happen client-side for instant feedback
- **Pure Functions**: All data transformations use pure functions for predictable performance

### User Experience

- **Persistence**: Settings saved to localStorage for seamless return visits
- **Visual Feedback**: Active filters shown as removable chips
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Accessibility**: Proper ARIA labels, keyboard navigation, semantic HTML

### Trade-offs

- **Client-side vs Server-side**: Chose client-side for simplicity and instant feedback. For production with larger datasets, server-side pagination/filtering would be better.
- **State Management**: Used React hooks instead of Redux/Zustand for reduced complexity. For larger apps, a state management library would be beneficial.
- **Mock Data**: Using Faker.js to generate realistic synthetic data with reproducible results. In production, this would come from an API.

## Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   └── page.tsx             # Main page component
├── components/              # React components
│   ├── ui/                  # Base UI components (shadcn/ui)
│   ├── data-grid/          # Data grid components
│   ├── filter-chips/       # Filter chips component
│   ├── search-bar/         # Search bar component
│   └── ...
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions and types
│   ├── utils.ts            # Utility functions
│   ├── data-grid-utils.ts  # Data grid helpers
│   ├── types.ts            # TypeScript types
│   └── mock-data.ts        # Mock data generation
├── stories/                # Storybook stories
├── .prettierrc             # Prettier configuration
├── .eslintrc.json          # ESLint configuration
├── vitest.config.ts        # Vitest configuration
└── tsconfig.json           # TypeScript configuration
```

## Docker Support

The project includes Docker support for both development and production deployment.

### Docker Compose (Development)

Create a `docker-compose.dev.yml` file in the project root with the following content:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      target: builder
    ports:
      - '4000:4000'
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - PORT=4000
```

Run the following command to start the application in development mode:

```bash
docker-compose -f docker-compose.dev.yml up
```

The application will be available at [http://localhost:4000](http://localhost:4000)

### Production Deployment

For production deployment, use the optimized `docker-compose.yml` file. The image is optimized with:

- Standalone output mode
- Minimal dependencies
- Non-root user (nextjs)
- Security hardening
- Health checks

Run the following command to start the application in production mode:

```bash
docker-compose up -d
```

The application will be available at [http://localhost:4000](http://localhost:4000)

### Available Docker Commands

**To see the running containers:**

```bash
docker ps
```

**Build the Docker image:**

```bash
docker build -t document-management-system .
```

**Run the Docker container:**

```bash
docker run -p 4000:4000 document-management-system
```

**Run the Docker container in detached mode:**

```bash
docker run -d -p 4000:4000 --name document-management-system document-management-system
```

**Stop the Docker container:**

```bash
docker stop document-management-system
```

**Remove the Docker container:**

```bash
docker rm document-management-system
```

**To view the logs of the running container:**

```bash
docker logs document-management-system
```

**To follow the logs in real-time:**

```bash
docker logs -f document-management-system
```

**Using Docker Compose:**

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and start
docker-compose up -d --build
```
