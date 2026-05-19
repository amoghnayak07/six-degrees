import { motion } from "framer-motion";

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
  if (!isVisible || path.length === 0) return null;

  const degrees = Math.floor(path.filter((p) => p.type === "movie").length);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      style={{
        position: "absolute",
        bottom: 24,
        left: 45,
        background:
          "linear-gradient(145deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)",
        backdropFilter: "blur(20px)",
        borderRadius: 16,
        padding: 24,
        minWidth: 280,
        maxWidth: 320,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(229, 9, 20, 0.1)",
        zIndex: 50,
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
      }}
    >
      {/* Header with degree count */}
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
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E50914 0%, #b20710 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 30px rgba(229, 9, 20, 0.5)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            {degrees}
          </span>
        </motion.div>
        <div>
          <div
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            {degrees === 1 ? "1 Degree" : `${degrees} Degrees`}
          </div>
          <div
            style={{
              color: "#888",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            of Separation
          </div>
        </div>
      </div>

      {/* Path steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {path.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
              }}
            >
              {/* Icon */}
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
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow:
                    step.type === "actor"
                      ? "0 0 15px rgba(229, 9, 20, 0.4)"
                      : "none",
                }}
              >
                {step.type === "actor" ? "🎭" : "🎬"}
              </div>

              {/* Info */}
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
                  <div style={{ color: "#666", fontSize: 11 }}>{step.year}</div>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < path.length - 1 && (
              <div
                style={{
                  marginLeft: 15,
                  width: 2,
                  height: 16,
                  background:
                    "linear-gradient(180deg, rgba(229, 9, 20, 0.5) 0%, rgba(229, 9, 20, 0.1) 100%)",
                  borderRadius: 1,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
