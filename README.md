# POI Map Editor

A lightweight web application to visualize, create, edit and manage Points of Interest (POIs) on an interactive map using Angular and MapLibre GL.

## Overview

The application allows users to:
- Import GeoJSON files containing POIs
- Visualize points on an interactive map
- Create, edit and delete POIs
- Persist data locally
- Export the current state as a GeoJSON file

## Tech Stack

- Angular (standalone components)
- TypeScript (strict mode)
- SCSS (7-1 architecture + BEM methodology)
- MapLibre GL JS

## Architecture

The project follows a lightweight Clean Architecture / DDD-inspired approach:

- **Domain**: business rules, models, validation
- **Infrastructure**: persistence, mappers, external integrations
- **Presentation**: Angular components and UI
- **Core**: shared configs and utilities

This separation ensures scalability, maintainability and testability.

## Key Technical Decisions

- **Standalone components**: reduce boilerplate and improve modularity
- **Signals-based state management**: simple and efficient alternative to NgRx for this scope
- **Zoneless change detection**: improves performance and predictability
- **Map isolation**: MapLibre logic is encapsulated to avoid coupling with Angular UI
- **GeoJSON as source of truth**: aligns with geospatial standards and simplifies import/export

## Setup

### Requirements

- Node.js (v18+ recommended)
- Angular CLI

### Install

```bash
npm install
