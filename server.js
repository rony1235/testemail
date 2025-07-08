const express = require("express");
const app = express();
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");
const port = process.env.PORT || 8080;
app.use(express.static("public"));

// Register the custom font
registerFont(path.join(__dirname, "fonts", "Poppins Regular 400.ttf"), {
  family: "Freedom",
  weight: "bold",
});

// Home route
app.get("/", (req, res) => {
  res.send(
    "Subscribe to Arpan Neupane's channel" +
      createCanvas(1, 1).getContext("2d").getFontFamilies()
  );
});

// Generate card image
app.get("/generate-card", async (req, res) => {
  try {
    const name = req.query.name || "Guest";
    const number = req.query.number || "0000 0000 0000 0000";
    const textName = name.toUpperCase();
    const textNumber = number;

    // Standard credit card dimensions at 300 DPI: 1012x638 px
    const width = 1012;
    const height = 638;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Optional background image (if you have one)
    const imagePath = path.join(__dirname, "public", "card-background.png");
    const background = await loadImage(imagePath);
    ctx.drawImage(background, 0, 0, width, height);

    // Text styling
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.textAlign = "left";

    // Card number
    ctx.font = "bold 48px 'Freedom'";
    ctx.strokeText(textNumber, 60, height / 1.3);
    ctx.fillText(textNumber, 60, height / 1.3);

    // Name (bottom-left)
    ctx.font = "bold 36px 'Freedom'";
    ctx.strokeText(textName, 60, height - 80);
    ctx.fillText(textName, 60, height - 80);

    // Set headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");

    // Pipe image
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error("Error generating card:", error);
    res.status(500).send("Error generating image");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
