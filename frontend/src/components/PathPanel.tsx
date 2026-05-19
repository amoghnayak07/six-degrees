import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PathStep {
  type: "actor" | "movie";
  name: string;
  year?: string;
}

interface PathPanelProps {
  path: PathStep[];
  isVisible: boolean;
}

export default function PathPanel({ path, isVisible }: PathPanelProps) {
  const [expanded, setExpanded] = useState(window.innerWidth > 768);

  const isMobile = window.innerWidth <= 768;

  if (!isVisible || path.length === 0) return null;

  const degrees = path.filter((p) => p.type === "movie").length;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 24,
          zIndex: 50,
        }}
      >
        {/* Pill toggle — always visible on mobile */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setExpanded((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            background: "linear-gradient(135deg, #E50914 0%, #b20710 100%)",
            border: "none",
            borderRadius: 999,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(229, 9, 20, 0.5)",
            letterSpacing: "0.5px",
            marginLeft: "auto",
          }}
        >
          🎬 {degrees} {degrees === 1 ? "hop" : "hops"}
          <span style={{ fontSize: 10, opacity: 0.8 }}>
            {expanded ? "▲" : "▼"}
          </span>
        </motion.button>

        {/* Full panel — always visible on desktop, toggled on mobile */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                marginTop: isMobile ? 8 : 0,
                background:
                  "linear-gradient(145deg, rgba(20, 20, 20, 0.98) 0%, rgba(10, 10, 10, 0.99) 100%)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                padding: 24,
                minWidth: 260,
                maxWidth: 320,
                width: isMobile ? "calc(100vw - 48px)" : undefined,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(229, 9, 20, 0.1)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #E50914 0%, #b20710 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px rgba(229, 9, 20, 0.5)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    {degrees}
                  </span>
                </motion.div>
                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {degrees === 1 ? "1 Degree" : `${degrees} Degrees`}
                  </div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    of Separation
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: "25vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  paddingRight: 4,
                }}
              >
                {/* Steps */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {path.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 0",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: step.type === "actor" ? "50%" : 6,
                            background:
                              step.type === "actor"
                                ? "linear-gradient(135deg, #E50914 0%, #b20710 100%)"
                                : "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            border:
                              step.type === "actor"
                                ? "none"
                                : "1px solid rgba(255,255,255,0.1)",
                            boxShadow:
                              step.type === "actor"
                                ? "0 0 15px rgba(229, 9, 20, 0.4)"
                                : "none",
                            flexShrink: 0,
                          }}
                        >
                          {step.type === "actor" ? "🎭" : "🎬"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              color: "#fff",
                              fontSize: 13,
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {step.name}
                          </div>
                          {step.year && (
                            <div style={{ color: "#666", fontSize: 11 }}>
                              {step.year}
                            </div>
                          )}
                        </div>
                      </div>

                      {index < path.length - 1 && (
                        <div
                          style={{
                            marginLeft: 15,
                            width: 2,
                            height: 12,
                            background:
                              "linear-gradient(180deg, rgba(229,9,20,0.5) 0%, rgba(229,9,20,0.1) 100%)",
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
