# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ACRE is an agricultural MVP platform for managing agricultural plots ("lotes"), planning campaigns, and generating recommendations for fertilizers, seeds, and herbicides. Built as a single-file React application with mock data for demonstration purposes.

## Architecture

### Single-File Application Structure

The entire application is contained in `acre-mvp-ui.tsx` (1225 lines). The application uses React 19 with hooks and functional components, and Recharts for data visualization.

**Key Components (in order of appearance):**

1. **Data Layer** (lines 4-86)
   - `MOCK_USERS`: Authentication data (admin/productor roles)
   - `MOCK_CLIENTES`: Client/customer data
   - `MOCK_INSUMOS`: Agricultural inputs (fertilizers, herbicides)
   - `MOCK_SEMILLAS`: Seed varieties with planting density ranges
   - `MOCK_LOTES`: Field plots with soil analysis, water table data, and ENSO status
   - `MOCK_LOGS`: System activity logs
   - `MOCK_RECOMENDACION`: Pre-calculated recommendations for inputs

2. **UI Components** (lines 100-503)
   - `SimpleMap`: Visual plot representation with OpenStreetMap background
   - `CreateLoteModal`: Plot creation workflow with drawing simulation
   - `GEELayersPanel`: Google Earth Engine integration (simulated) for DEM/NDVI layers
   - `LoginScreen`: Authentication interface

3. **Main Application** (line 505)
   - `App`: Root component managing authentication and user role routing

4. **Feature Modules** (lines 539-1224)
   - `WizardPlanificacion`: Multi-step planning wizard (semillas → fertilizantes → herbicidas)
   - `CargaDatos`: Data loading interface with tabs (suelo/malezas/napas)
   - `ProductorDashboard`: Main producer dashboard with plot management

### State Management Pattern

Uses React hooks exclusively:
- `useState` for local component state
- No Redux or external state management
- State is passed down through props between components
- Modal visibility controlled by boolean flags in parent components

### View Flow

```
LoginScreen → App (role router) → ProductorDashboard
                                       ↓
                     ┌─────────────────┴─────────────────┐
                     │                                   │
              CargaDatos ←→ WizardPlanificacion ←→ Reporte
                     │                                   │
                     └──────────── GEELayersPanel ───────┘
```

### Data Flow Patterns

- **Lotes (Plots)** are the central entity - all features revolve around plot management
- Each plot has states: 'Datos incompletos' → 'Listo para planificar' → 'Planificación generada'
- State transitions trigger different UI flows:
  - Incomplete data → Opens `CargaDatos` component
  - Ready to plan → Opens `WizardPlanificacion` component
  - Plan generated → Shows recommendations report

### Mock Data Integration Points

When converting to real backend:
1. Replace MOCK_* constants with API calls
2. GEELayersPanel simulations → Real Google Earth Engine API integration
3. CreateLoteModal drawing simulation → Actual map polygon drawing (e.g., Leaflet Draw)
4. Weather data (ENSO) → Real meteorological service integration
5. Soil analysis → Upload/import from lab results

## Development Commands

This is a standalone React component file without a build system configured. To run:

```bash
# Install dependencies
npm install

# For development, you'll need to set up a React development environment
# Option 1: Use Vite
npx vite

# Option 2: Use Create React App
# (First move acre-mvp-ui.tsx to src/App.tsx in a CRA project)

# Option 3: Use a simple dev server with an HTML wrapper
# Create an index.html that imports this file as a module
```

## Code Style & Patterns

### Function Declaration Style
- All functions use `function` keyword or function expressions: `const Foo = function() {}`
- Avoid arrow functions (`=>`) - not used in this codebase
- Event handlers: `onClick={function() { ... }}`

### Component Structure
- Functional components only (no class components)
- Props destructured in function parameters: `function Component({ prop1, prop2 }) {}`
- Conditional rendering with ternaries and `&&` operator

### Styling Approach
- Tailwind CSS utility classes throughout
- Color scheme: Green primary (`green-600`), blue/yellow for status indicators
- Responsive classes: `md:grid-cols-2 lg:grid-cols-3`
- No separate CSS files

### State Updates
- Immutable updates required for objects (React hooks requirement)
- Example pattern for nested object state:
  ```javascript
  setSuelo({ ph: newValue, mo: suelo.mo, p: suelo.p, n: suelo.n });
  ```

## Agricultural Domain Concepts

Key terminology used throughout:
- **Lote**: Agricultural plot/field
- **Campaña**: Growing season/campaign (e.g., "Soja 2025/26")
- **Superficie**: Surface area in hectares
- **ENSO**: El Niño-Southern Oscillation climate indicator
- **Napas freáticas**: Water table depth
- **Malezas**: Weeds
- **Insumos**: Agricultural inputs (fertilizers, seeds, herbicides)
- **NDVI**: Normalized Difference Vegetation Index
- **DEM**: Digital Elevation Model

## Integration Points

The application has placeholders for these external services:
1. **Google Earth Engine**: DEM and NDVI historical data (currently simulated)
2. **Weather Services**: ENSO data, precipitation forecasts
3. **Map Services**: OpenStreetMap tiles for background, polygon drawing needed
4. **Authentication**: Currently mock users, needs real auth system
5. **Database**: All data currently in-memory, needs persistence layer