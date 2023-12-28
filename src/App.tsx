import { SetStateAction, useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { IconExamples, Icons } from "./components/ui/icons";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

function App() {
  const [svg, setSvg] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    setSvg(await file.text());
  };

  const remove = () => {
    if (!confirm("delete your work?")) return;
    setSvg("");
  };

  useEffect(() => {
    const convertSvgToPng = async (
      canvasSize = 500,
      highRes = true,
      url = true,
    ) => {
      return new Promise((resolve, reject) => {
        const image = new Image();

        if (svg) {
          image.src = "data:image/svg+xml;base64," + btoa(svg);
        }

        image.onload = () => {
          const pixelRatio = highRes ? window.devicePixelRatio || 1 : 1; // Avoid blur on retina displays

          const canvas = document.createElement("canvas");
          canvas.width = canvasSize * pixelRatio;
          canvas.height = canvasSize * pixelRatio;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject("Error loading SVG");
            return;
          }

          ctx.scale(pixelRatio, pixelRatio);

          ctx.drawImage(image, 0, 0, canvasSize, canvasSize);

          url
            ? resolve(canvas.toDataURL("image/png"))
            : canvas.toBlob((blob) => resolve(blob));
        };

        image.onerror = () => {
          reject("Error loading SVG");
        };
      });
    };

    if (svg) {
      (async () =>
        setPreviewImage(
          (await convertSvgToPng()) as SetStateAction<string | null>,
        ))();
    } else {
      setPreviewImage(null);
    }
  }, [svg]);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-5 px-2 py-4 lg:grid lg:grid-cols-2 lg:gap-20">
      <header className="lg:absolute lg:left-3 lg:top-3">
        <h1 className="text-center text-xl font-extrabold">
          icon to logo converter
        </h1>
      </header>
      <section className="flex h-full items-center justify-center">
        {svg ? (
          <>
            <div className="flex justify-end gap-3">
              <Icons.x className="h-4 w-4 cursor-pointer" onClick={remove} />
            </div>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-[512px] w-full max-w-[512px]"
              />
            )}
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>upload an svg icon</Label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".svg"
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              <a
                href="https://lucide.dev/icons"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                lucide
              </a>
              {" or "}
              <a
                href="https://heroicons.com/"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                heroicons
              </a>{" "}
              are great sources.
            </div>

            <Label>or pick one example</Label>
            <div className="flex justify-between gap-3">
              {IconExamples.map((svg, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-14"
                  onClick={() => {
                    setSvg(svg);
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: svg }} />
                </Button>
              ))}
            </div>
          </div>
        )}
      </section>
      <section></section>
    </main>
  );
}

export default App;
