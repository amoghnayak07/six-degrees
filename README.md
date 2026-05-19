# 🎬 Six Degrees

> Find the shortest path between any two actors through shared films — powered by Neo4j graph traversal.

![Tech Stack](https://img.shields.io/badge/Neo4j-AuraDB-008CC1?style=flat-square&logo=neo4j&logoColor=white)
![Backend](https://img.shields.io/badge/Node.js-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Frontend](https://img.shields.io/badge/React-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Data](https://img.shields.io/badge/Data-TMDb_API-01B4E4?style=flat-square&logo=themoviedatabase&logoColor=white)

---

## What is this?

Six Degrees is a full-stack graph database learning project inspired by the **Six Degrees of Kevin Bacon** concept. Type any two actors and the app finds the shortest chain connecting them through movies they've appeared in together — a problem that would be painful in SQL but trivially elegant in a graph database.

```
Tom Hanks → Forrest Gump → Sally Field → Spider-Man: No Way Home → Tom Holland
```

The core query is a single Cypher `shortestPath()` call that traverses the graph in milliseconds across thousands of actors and movies.

---

## Tech Stack

| Layer               | Technology                            |
| ------------------- | ------------------------------------- |
| Graph Database      | Neo4j AuraDB (free tier)              |
| Backend             | Node.js + Express + TypeScript        |
| Frontend            | React + Vite + TypeScript             |
| Graph Visualization | React Flow + Framer Motion            |
| Data Source         | TMDb API (~1000 movies, 15 cast each) |
| Styling             | Netflix-inspired dark theme           |

---

## How it works

The data model is a **bipartite graph** — two node types with edges only flowing between them:

```
(:Actor)-[:ACTED_IN]->(:Movie)
```

Actors never connect directly to actors. Movies never connect directly to movies. Every connection between two actors is routed through a shared movie, which means the shortest path query always alternates:

```
Actor → Movie → Actor → Movie → Actor
```

The Cypher query that powers everything:

```cypher
MATCH (start:Actor {name: $fromName}), (end:Actor {name: $toName})
MATCH p = shortestPath((start)-[:ACTED_IN*]-(end))
RETURN p
```

---

## Project Structure

```
six-degrees/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── neo4j.ts          # Neo4j driver + connectivity check
│   │   │   └── seed.ts           # TMDb data import script
│   │   ├── routes/
│   │   │   ├── search.ts         # GET /api/search?q=
│   │   │   └── path.ts           # GET /api/path?from=&to=
│   │   ├── services/
│   │   │   ├── searchService.ts  # Actor autocomplete (Cypher fuzzy match)
│   │   │   └── pathService.ts    # Shortest path traversal
│   │   └── index.ts              # Express app entry point
│   ├── .env
│   └── tsconfig.json
│
└── frontend/
    ├── public/
    │   └── Netflix.mp3           # Tudum sound effect
    ├── src/
    │   ├── components/
    │   │   ├── ActorNode.tsx      # Custom React Flow node
    │   │   ├── MovieNode.tsx      # Custom React Flow node
    │   │   ├── SearchInput.tsx    # Debounced autocomplete input
    │   │   └── PathPanel.tsx      # Scrollable path breakdown panel
    │   ├── App.tsx
    │   └── App.css
    └── .env
```

---

## API Endpoints

### `GET /api/search?q={query}`

Returns a list of actors matching the query (fuzzy, case-insensitive).

```json
[
  { "id": "31", "name": "Tom Hanks" },
  { "id": "1892", "name": "Tom Holland" }
]
```

### `GET /api/path?from={actorName}&to={actorName}`

Returns the shortest path between two actors as an ordered list of nodes.

```json
{
  "nodes": [
    {
      "id": "31",
      "name": "Tom Hanks",
      "type": "Actor",
      "profileUrl": "https://..."
    },
    {
      "id": "101",
      "name": "Forrest Gump",
      "type": "Movie",
      "year": "1994",
      "posterUrl": "https://..."
    },
    {
      "id": "1892",
      "name": "Tom Holland",
      "type": "Actor",
      "profileUrl": "https://..."
    }
  ],
  "length": 2
}
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- A free [Neo4j AuraDB](https://neo4j.com/cloud/platform/aura-graph-database) instance
- A free [TMDb API](https://www.themoviedb.org/settings/api) read access token

### 1. Clone and install

```bash
git clone https://github.com/yourusername/six-degrees
cd six-degrees/backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

`backend/.env`

```env
NEO4J_URI=neo4j+s://xxxxxxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password
TMDB_TOKEN=your-tmdb-read-access-token
PORT=3001
```

`frontend/.env`

```env
VITE_API_URL=http://localhost:3001
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This fetches ~1000 popular movies and their top 15 cast members from TMDb and loads them into Neo4j. Takes 5–10 minutes.

### 4. Run the app

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173`, search for two actors and hit **Find Path**.

---

## What I learned

- **Graph databases shine** at relationship traversal — the `shortestPath()` query that would take complex recursive SQL is a one-liner in Cypher
- **Bipartite graphs** are a natural fit for actor-movie data — two node types, edges only between types, never within
- **Neo4j AuraDB** is a great free option for learning — no setup, just a connection string
- **React Flow** makes interactive graph visualization approachable with custom node components
- The difference between a **knowledge graph** (semantic, inferential) and a **domain graph** (operational, path queries) is meaningful in practice

---

## Data

Movie and cast data is sourced from [The Movie Database (TMDb)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

---

_Built in a half day as a hands-on introduction to graph databases._
