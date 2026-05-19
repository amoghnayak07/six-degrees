import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { motion } from "framer-motion";

type MovieNodeData = Node<{
  label: string;
  year?: string;
  image?: string;
}>;

function MovieNode({ data }: NodeProps<MovieNodeData>) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateY: -90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{
        background: "linear-gradient(145deg, #1f1f1f 0%, #0f0f0f 100%)",
        borderRadius: 8,
        width: 100,
        height: 140,
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(229, 9, 20, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Film reel holes decoration */}
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 0,
          bottom: 0,
          width: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          padding: "8px 0",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 2,
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          />
        ))}
      </div>

      {/* Poster area */}
      <div
        style={{
          flex: 1,
          margin: "8px 8px 4px 16px",
          borderRadius: 4,
          background: data.image
            ? `url(${data.image}) center/cover`
            : "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {!data.image && "🎬"}
      </div>

      {/* Movie info */}
      <div style={{ padding: "4px 8px 8px 16px" }}>
        <div
          style={{
            color: "#fff",
            fontSize: 10,
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 2,
          }}
        >
          {data.label}
        </div>
        {data.year && (
          <div
            style={{
              color: "#E50914",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "1px",
            }}
          >
            {data.year}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#E50914", border: "none", width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#E50914", border: "none", width: 8, height: 8 }}
      />
    </motion.div>
  );
}

export default memo(MovieNode);
