import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "The Best People: what a few employees think of their boss";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const faces = [
  "pence", "tillerson", "sessions", "kelly", "mattis",
  "bolton", "barr", "esper", "milley", "devos",
];

export default async function Image() {
  const photos = await Promise.all(
    faces.map(async (name) => {
      const file = await readFile(join(process.cwd(), "public", "photos", `${name}.jpg`));
      return `data:image/jpeg;base64,${file.toString("base64")}`;
    })
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0b09",
          color: "#ece9e2",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, color: "#948f84" }}>
          THE WHITE HOUSE · 2017 TO 2021
        </div>
        <div style={{ fontSize: 124, fontWeight: 700, marginTop: 18, letterSpacing: -3 }}>
          The Best People
        </div>
        <div style={{ fontSize: 42, color: "#dcab52", marginTop: 6 }}>
          What a few employees think of their boss.
        </div>
        <div style={{ display: "flex", marginTop: 56 }}>
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              width={92}
              height={92}
              style={{
                borderRadius: 46,
                objectFit: "cover",
                marginLeft: i === 0 ? 0 : -14,
                border: "4px solid #0d0b09",
              }}
            />
          ))}
        </div>
      </div>
    ),
    size
  );
}
