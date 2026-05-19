import driver from "../config/neo4j";

export const findPath = async (fromName: string, toName: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (start:Actor {name: $fromName}), (end:Actor {name: $toName})
            MATCH p = shortestPath((start)-[:ACTED_IN*]-(end))
            RETURN p`,
      { fromName, toName },
    );

    if (result.records.length == 0) {
      return null;
    }
    const path = result.records[0].get("p");
    console.log({ path: path.segments });
    const nodes = path.segments.flatMap((seg: any) => [
      {
        id: seg.start.properties.id,
        name: seg.start.properties.name ?? seg.start.properties.title,
        type: seg.start.labels[0],
        year: seg.start.properties.year ?? null,
        profileUrl: seg.start.properties.profileUrl ?? null,
        posterUrl: seg.start.properties.posterUrl ?? null,
      },
      {
        id: seg.end.properties.id,
        name: seg.end.properties.name ?? seg.end.properties.title,
        type: seg.end.labels[0],
        year: seg.end.properties.year ?? null,
        profileUrl: seg.end.properties.profileUrl ?? null,
        posterUrl: seg.end.properties.posterUrl ?? null,
      },
    ]);

    const seen = new Set<string>();
    const uniqueNodes = nodes.filter((n: any) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });

    return {
      nodes: uniqueNodes,
      length: path.segments.length,
    };
  } finally {
    await session.close();
  }
};
