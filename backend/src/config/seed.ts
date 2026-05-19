import axios from "axios";
import driver from "./neo4j";

const TMDB_TOKEN = process.env.TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";
const TOTAL_PAGES = 50;
const IMG_BASE = "https://image.tmdb.org/t/p/w200";

const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  accept: "application/json",
};

interface Movie {
  id: number;
  title: string;
  year: string;
  posterUrl: string | null;
}

interface CastMember {
  id: number;
  name: string;
  profileUrl: string | null;
}

const fetchPopularMovies = async (): Promise<Movie[]> => {
  const movies: Movie[] = [];

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`📄 Fetching movies page ${page}/${TOTAL_PAGES}...`);
    try {
      const res = await axios.get(`${BASE_URL}/movie/popular`, {
        headers,
        params: { language: "en-US", page },
      });

      for (const m of res.data.results) {
        movies.push({
          id: m.id,
          title: m.title,
          year: m.release_date?.split("-")[0] ?? "Unknown",
          posterUrl: m.poster_path ? `${IMG_BASE}${m.poster_path}` : null,
        });
      }
    } catch (err) {
      console.error(`⚠️ Failed to fetch page ${page}, skipping...`);
    }
  }

  return movies;
};

const fetchCast = async (movieId: number): Promise<CastMember[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      headers,
    });
    return res.data.cast.slice(0, 15).map((c: any) => ({
      id: c.id,
      name: c.name,
      profileUrl: c.profile_path ? `${IMG_BASE}${c.profile_path}` : null,
    }));
  } catch {
    return [];
  }
};

const seed = async () => {
  const session = driver.session();

  try {
    console.log("🌱 Clearing existing data...");
    await session.run("MATCH (n) DETACH DELETE n");

    const movies = await fetchPopularMovies();
    console.log(`🎬 Fetched ${movies.length} movies — loading into Neo4j...`);

    for (const movie of movies) {
      await session.run(
        `MERGE (m:Movie {id: $id})
         SET m.title = $title, m.year = $year, m.posterUrl = $posterUrl`,
        {
          id: movie.id.toString(),
          title: movie.title,
          year: movie.year,
          posterUrl: movie.posterUrl ?? "",
        },
      );

      const cast = await fetchCast(movie.id);

      for (const actor of cast) {
        await session.run(
          `MERGE (a:Actor {id: $actorId})
           SET a.name = $actorName, a.profileUrl = $profileUrl
           WITH a
           MATCH (m:Movie {id: $movieId})
           MERGE (a)-[:ACTED_IN]->(m)`,
          {
            actorId: actor.id.toString(),
            actorName: actor.name,
            profileUrl: actor.profileUrl ?? "",
            movieId: movie.id.toString(),
          },
        );
      }

      console.log(
        `✅ ${movie.title} (${movie.year}) — ${cast.length} cast members`,
      );
    }

    console.log("🎉 Seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
};

seed();
