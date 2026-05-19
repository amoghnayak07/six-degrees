import driver from "../config/neo4j";

export const searchActors = async (query: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (a:Actor)
            WHERE toLower(a.name) CONTAINS toLower($query)
            RETURN a.id as id, a.name as name
            ORDER by a.name
            LIMIT 10`,
      { query },
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
    }));
  } finally {
    await session.close();
  }
};
