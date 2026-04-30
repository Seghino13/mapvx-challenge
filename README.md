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

## Map Interaction

Users can create new Points of Interest (POIs) directly from the map.

### Behavior

- Clicking on the map captures the geographic coordinates (longitude, latitude)
- A new POI is created using those coordinates
- The POI is immediately added to the application state
- The map updates reactively using Angular signals

### Implementation details

- Map click events are handled using MapLibre's event system
- Coordinates are extracted from the click event (`event.lngLat`)
- POIs are created through the facade, keeping UI decoupled from state logic
- The map is updated automatically via a reactive `effect` that listens to state changes

### Notes

- This interaction demonstrates real-time synchronization between Angular state (signals) and an external rendering library (MapLibre)
- No manual subscriptions or change detection triggers are required due to the use of zoneless + signals

## Setup

### Requirements

- Node.js (v18+ recommended)
- Angular CLI

### Install

```bash
npm install
