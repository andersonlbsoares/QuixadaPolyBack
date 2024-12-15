import postgres from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new postgres.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  keepAlive: true
});

async function connectToDatabase() {
  try {
    await pool.connect();
    console.log("Conexão com o banco de dados estabelecida");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
  }
}

connectToDatabase();

export default pool;
