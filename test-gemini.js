const API_KEY = "AIzaSyCrY7aUCGvxVX0eCJ4jETfHc2nFigChG0E";

async function listModels() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
  );

  const data = await res.json();

  console.log(JSON.stringify(data, null, 2));
}

listModels();