const express = require("express");
const app = express();
const { createCanvas, loadImage, registerFont, Image } = require("canvas");
const path = require("path");
const QRCode = require("qrcode");
const port = process.env.PORT || 8080;
app.use(express.static("public"));

registerFont(path.join(__dirname, "fonts", "Poppins Regular 400.ttf"), {
  family: "Poppins",
  weight: "normal",
});

app.get("/", (req, res) => {
  res.send("QR Bank Card Generator");
});

app.get("/generate-card", async (req, res) => {
  try {
    const name = req.query.name || "Guest";
    const number = req.query.number || "0000 0000 0000 0000";
    const email = req.query.email;
    const textName = name.toUpperCase();
    const textNumber = number;

    const width = 1012;
    const height = 638;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Load background image
    const imagePath = path.join(__dirname, "public", "card-background.png");
    const background = await loadImage(imagePath);
    ctx.drawImage(background, 0, 0, width, height);

    // Text styling
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.textAlign = "left";

    // Card number (center-left)
    ctx.font = "bold 60px 'Freedom'";
    ctx.strokeText(textNumber, 60, height / 1.25);
    ctx.fillText(textNumber, 60, height / 1.25);

    // Name (bottom-left)
    ctx.font = "bold 36px 'Freedom'";
    ctx.strokeText(textName, 60, height - 80);
    ctx.fillText(textName, 60, height - 80);

    // Generate QR code
    const original = number;
    const cleaned = original.replace(/-/g, "");
    const qrData = `https://admin.cityscapelifestyle.com/member-management/zoho/${email}`;
    const qrBuffer = await QRCode.toBuffer(qrData, {
      width: 150,
      color: {
        dark: "#FFFFFF", // white QR code
        light: "#00000000", // fully transparent background
      },
    });
    const qrImage = new Image();
    qrImage.src = qrBuffer;

    // Draw QR code (bottom-right corner)
    const qrSize = 150;
    ctx.drawImage(
      qrImage,
      width - qrSize - 30,
      height - qrSize - 220,
      qrSize,
      qrSize
    );

    // Set headers and send image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");

    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error("Error generating card:", error);
    res.status(500).send("Error generating image");
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
