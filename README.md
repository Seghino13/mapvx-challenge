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

## Data Handling

GeoJSON files are validated before being processed. Invalid features are discarded while valid ones are preserved.

Validation rules include:
- Only FeatureCollection with Point geometries are accepted
- Coordinates must be valid (WGS84)
- Properties must include name and category as strings

A summary of imported and discarded features is generated to provide feedback to the user.

A mapper is used to transform GeoJSON features into domain models, keeping the application decoupled from external formats.

## State Management

State is managed using Angular Signals instead of NgRx to keep the solution simple and efficient.

A lightweight store handles POIs and selection state, while a facade abstracts state mutations and provides a clean API for the UI layer.

## Setup

### Requirements

- Node.js (v18+ recommended)
- Angular CLI

### Install

```bash
npm install
