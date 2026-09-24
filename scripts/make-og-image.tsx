/**
 * npm run og:image
 *
 * Renders the social share image to src/app/opengraph-image.png (and its alt text).
 * Static export can't give a generated image a .png extension, so the image is committed as
 * a plain file instead. Re-run this if the emblem or tagline changes.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const alt =
  "MettleNest: Behaviour Coaching & Educational Training. Understand, Connect, Grow.";
const size = { width: 1200, height: 630 };

async function main() {
  const cwd = process.cwd();
  const emblem = `data:image/png;base64,${await readFile(join(cwd, "public/brand/emblem.png"), "base64")}`;
  const youngSerif = await readFile(
    join(cwd, "src/assets/fonts/YoungSerif-Regular.ttf"),
  );

  // The round emblem on the BRIDGE navy, with the name and tagline.
  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: "0 90px",
        background: "#13294B",
        fontFamily: "Young Serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og */}
      <img
        src={emblem}
        width={400}
        height={400}
        alt=""
        style={{ borderRadius: 400 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, color: "#FFFFFF", lineHeight: 1 }}>
          MettleNest
        </div>
        <div style={{ fontSize: 34, color: "#DDB05A", marginTop: 28 }}>
          Behaviour Coaching
        </div>
        <div style={{ fontSize: 34, color: "#DDB05A" }}>
          & Educational Training
        </div>
        <div style={{ fontSize: 28, color: "#B7C3D3", marginTop: 36 }}>
          Understand · Connect · Grow
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Young Serif", data: youngSerif, style: "normal", weight: 400 },
      ],
    },
  );

  const png = Buffer.from(await image.arrayBuffer());
  await writeFile(join(cwd, "src/app/opengraph-image.png"), png);
  await writeFile(join(cwd, "src/app/opengraph-image.alt.txt"), alt);
  console.log(
    `Wrote src/app/opengraph-image.png (${Math.round(png.length / 1024)} KB)`,
  );
}

main();
