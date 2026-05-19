import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { motion } from "framer-motion";

type ActorNodeData = Node<{
  label: string;
  image?: string;
  isStart?: boolean;
  isEnd?: boolean;
}>;

function ActorNode({ data }: NodeProps<ActorNodeData>) {
  const isHighlighted = data.isStart || data.isEnd;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="actor-node"
      style={{
        background: isHighlighted
          ? "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)"
          : "linear-gradient(145deg, #141414 0%, #0a0a0a 100%)",
        borderRadius: "50%",
        width: 120,
        height: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isHighlighted
          ? "0 0 40px rgba(229, 9, 20, 0.6), 0 0 80px rgba(229, 9, 20, 0.3), inset 0 0 20px rgba(229, 9, 20, 0.1)"
          : "0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        border: isHighlighted
          ? "2px solid #E50914"
          : "1px solid rgba(255, 255, 255, 0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Spotlight effect */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Actor image or placeholder */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: data.image
            ? `url(${data.image}) center/cover`
            : "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "#666",
        }}
      >
        {!data.image && "🎭"}
      </div>

      {/* Actor name */}
      <span
        style={{
          color: isHighlighted ? "#fff" : "#e5e5e5",
          fontSize: 11,
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 100,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textShadow: isHighlighted ? "0 0 10px rgba(229, 9, 20, 0.5)" : "none",
          letterSpacing: "0.5px",
        }}
      >
        {data.label}
      </span>

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

export default memo(ActorNode);
