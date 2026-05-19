import { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";

import ActorNode from "./components/ActorNode";
import MovieNode from "./components/MovieNode";
import SearchInput from "./components/SearchInput";
import PathPanel from "./components/PathPanel";
import "./App.css";

// Custom node types
const nodeTypes = {
  actor: ActorNode,
  movie: MovieNode,
};

// Types
interface Actor {
  id: string;
  name: string;
  image?: string;
}

interface PathNode {
  id: string;
  name: string;
  type: "Actor" | "Movie";
  year?: string;
  profileUrl: string;
  posterUrl: string;
}

interface PathResult {
  nodes: PathNode[];
  length: number;
}

// Mock data for preview
const MOCK_ACTORS: Actor[] = [
  { id: "1", name: "Tom Hanks" },
  { id: "2", name: "Tom Cruise" },
  { id: "3", name: "Kevin Bacon" },
  { id: "4", name: "Brad Pitt" },
  { id: "5", name: "Leonardo DiCaprio" },
  { id: "6", name: "Meryl Streep" },
  { id: "7", name: "Morgan Freeman" },
  { id: "8", name: "Scarlett Johansson" },
];

// API base URL from environment or empty for mock mode
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [fromActor, setFromActor] = useState("");
  const [_fromActorId, setFromActorId] = useState<string | undefined>();
  const [toActor, setToActor] = useState("");
  const [_toActorId, setToActorId] = useState<string | undefined>();
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/Netflix.mp3");
  }, []);

  const searchActors = async (query: string): Promise<Actor[]> => {
    if (API_BASE_URL) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`,
        );
        return await response.json();
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    } else {
      // Mock search
      return MOCK_ACTORS.filter((actor) =>
        actor.name.toLowerCase().includes(query.toLowerCase()),
      );
    }
  };

  const createGraphElements = useCallback((path: PathResult) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const nodeSpacing = 250;

    path.nodes.forEach((node, index) => {
      const isActor = node.type === "Actor";
      newNodes.push({
        id: node.id,
        type: isActor ? "actor" : "movie",
        position: { x: 100 + index * nodeSpacing, y: 200 },
        data: {
          label: node.name,
          year: node.year ?? null,
          image: node.type == "Actor" ? node.profileUrl : node.posterUrl,
          isStart: index === 0,
          isEnd: index === path.nodes.length - 1,
        },
      });

      if (index > 0) {
        newEdges.push({
          id: `edge-${path.nodes[index - 1].id}-${node.id}`,
          source: path.nodes[index - 1].id,
          target: node.id,
          type: "smoothstep",
          animated: true,
          style: {
            stroke: "#E50914",
            strokeWidth: 3,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#E50914",
            width: 20,
            height: 20,
          },
        });
      }
    });

    return { nodes: newNodes, edges: newEdges };
  }, []);

  const animatePath = useCallback(
    (path: PathResult) => {
      const { nodes: graphNodes, edges: graphEdges } =
        createGraphElements(path);

      // Animate nodes and edges sequentially
      setNodes([]);
      setEdges([]);

      graphNodes.forEach((node, index) => {
        setTimeout(() => {
          setNodes((prev) => [...prev, node]);

          if (index > 0) {
            setTimeout(() => {
              setEdges((prev) => [...prev, graphEdges[index - 1]]);
            }, 150);
          }
        }, index * 400);
      });
    },
    [createGraphElements, setNodes, setEdges],
  );

  const findPath = async () => {
    if (!fromActor || !toActor) return;

    setIsLoading(true);
    setPathResult(null);
    setNodes([]);
    setEdges([]);

    try {
      let path: PathResult;

      const response = await fetch(
        `${API_BASE_URL}/api/path?from=${encodeURIComponent(fromActor)}&to=${encodeURIComponent(toActor)}`,
      );
      path = await response.json();

      setPathResult(path);
      animatePath(path);

      // Play sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch (error) {
      console.error("Path error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pathPanelData =
    pathResult?.nodes.map((n) => ({
      type: n.type.toLowerCase() as "actor" | "movie",
      name: n.name,
      year: n.year,
    })) || [];

  return (
    <div className="app">
      {/* Background effects */}
      <div className="bg-gradient" />
      <div className="bg-spotlight" />
      <div className="film-grain" />

      {/* Header */}
      <header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="title">
            <span className="title-six">SIX</span>
            <span className="title-degrees">DEGREES</span>
          </h1>
          <p className="subtitle">Find the connection between any two actors</p>
        </motion.div>
      </header>

      {/* Search controls */}
      <motion.div
        className="controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="controls-inner">
          <div className="search-fields">
            <SearchInput
              label="From"
              value={fromActor}
              onChange={(value, id) => {
                setFromActor(value);
                setFromActorId(id);
              }}
              onSearch={searchActors}
              placeholder="Search actor..."
            />

            <div className="connector">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-7-7l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <SearchInput
              label="To"
              value={toActor}
              onChange={(value, id) => {
                setToActor(value);
                setToActorId(id);
              }}
              onSearch={searchActors}
              placeholder="Search actor..."
            />
          </div>

          <motion.button
            className="find-button"
            onClick={findPath}
            disabled={isLoading || !fromActor || !toActor}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span>FIND PATH</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Graph canvas */}
      <div className="canvas-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.5 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={2}
          panOnScroll
          zoomOnPinch
          panOnDrag
        >
          <Background color="#1a1a1a" gap={40} size={1} />
          <Controls
            style={{
              background: "rgba(20, 20, 20, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
            }}
          />
        </ReactFlow>

        {/* Empty state */}
        <AnimatePresence>
          {!pathResult && !isLoading && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="empty-icon">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <circle cx="5" cy="12" r="3" />
                  <circle cx="19" cy="12" r="3" />
                  <path d="M8 12h8" strokeDasharray="2 2" />
                </svg>
              </div>
              <h3>Discover Actor Connections</h3>
              <p>
                Enter two actors above and find the shortest path between them
                through their shared filmography.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Path panel */}
        <PathPanel path={pathPanelData} isVisible={!!pathResult} />
      </div>
    </div>
  );
}

export default App;
