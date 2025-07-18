const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ Load movies data from JSON file
const movieData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "movies_metadata.json"), "utf-8")
);

// ✅ Test route
app.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

// ✅ Route to list movies
app.get("/api/movies", (request, response) => {
  console.log("❇️ Received GET request to /api/movies");

  const movies = movieData.map(movie => ({
    id: movie.id,
    title: movie.title,
    tagline: movie.tagline,
    vote_average: parseFloat(movie.vote_average) || 0
  }));

  response.json({ data: movies });
});

// ✅ Route to get movie by ID
app.get("/api/movies/:id", (req, res) => {
  console.log(`❇️ Received GET request to /api/movies/${req.params.id}`);

  const movie = movieData.find(m => m.id === req.params.id);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

// ✅ Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// ✅ Start the server
const listener = app.listen(port, () => {
  console.log("✅ Express server is running on port", listener.address().port);
});
