import neo4j, { Driver } from "neo4j-driver";
import { Config } from "./config";

const driver: Driver = neo4j.driver(
  Config.NEO4J_URI as string,
  neo4j.auth.basic(
    Config.NEO4J_USERNAME as string,
    Config.NEO4J_PASSWORD as string,
  ),
);

export const verifyConnectivity = async () => {
  try {
    await driver.verifyConnectivity();
    console.log("Connected to Neo4j");
  } catch (error) {
    console.error("Neo4j connection failed: ", error);
    process.exit(1);
  }
};

export default driver;
