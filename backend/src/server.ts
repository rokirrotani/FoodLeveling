import { initDatabase } from "./db/init";
import app from "./app";

initDatabase();

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`🚀 FoodLeveling backend running on http://localhost:${PORT}`);
});
