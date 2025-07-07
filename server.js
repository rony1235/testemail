const express = require("express");
const app = express();
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");
const port = process.env.PORT || 8080;
app.use(express.static("public"));

registerFont(path.join(__dirname, "fonts", "Freedom-10eM.ttf"), {
  family: "Freedom",
  weight: "bold",
});
app.get("/", (req, res) => {
  // console.log(createCanvas(1, 1).getContext("2d").getFontFamilies());

  res.send(
    "Subscribe to Arpan Neupane's channel" +
      createCanvas(1, 1).getContext("2d").getFontFamilies()
  );
});

app.get("/generate-card", async (req, res) => {
  try {
    const name = req.query.name || "Guest";
    const number = req.query.number || "000";
    const text = `${name} - ${number}`;

    // Load card background image
    const imagePath = path.join(__dirname, "public", "card-background.png");
    const background = await loadImage(imagePath);

    // Create canvas matching background size
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(background, 0, 0);

    // Text styling
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";
    ctx.font = "bold 60px 'Freedom', 'Helvetica', sans-serif";

    // Calculate position (top center with padding)
    const x = canvas.width / 2;
    const y = 80;

    // Draw text with outline
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);

    // Set response headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store, max-age=0");

    // Send image
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error("Error generating card:", error);
    res.status(500).send("Error generating image");
  }
});

app.listen(port, () => {
  `Server started on port ${port}`;
});
