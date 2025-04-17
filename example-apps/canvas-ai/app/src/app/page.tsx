"use client";

import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {guessDrawing} from "@/ai/flows/guess-drawing";
import {Slider} from "@/components/ui/slider";
import {Circle} from "lucide-react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [guess, setGuess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawingData, setDrawingData] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height); // Fill with white initially

    // Load drawing data if available
    if (drawingData) {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0);
      };
      image.src = drawingData;
    }
  }, [drawingData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineWidth = brushSize;
    context.strokeStyle = color;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    context.lineWidth = brushSize;
    context.strokeStyle = color;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);

    e.preventDefault(); // Prevent scrolling while drawing
  };

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Canvas not initialized.");
      return null;
    }

    return canvas.toDataURL("image/png");
  };

  const handleGuess = async () => {
    setError(null);
    setGuess(null);
    const imageBase64 = captureCanvas();

    if (!imageBase64) {
      setError("Could not capture canvas.");
      return;
    }

    try {
      const result = await guessDrawing({imageBase64});
      setGuess(result?.guess ?? "No guess available.");
    } catch (e: any) {
      console.error("Error during AI guess:", e);
      setError("Failed to get AI guess. Please try again.");
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white"; // Set fill color to white
    context.fillRect(0, 0, canvas.width, canvas.height); // Fill with white
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleBrushSizeChange = (value: number[]) => {
    setBrushSize(value[0]);
  };

  const colorOptions = [
    "black",
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "white",
    "gray",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <h1 className="text-2xl font-bold mb-4">Canvas AI</h1>

      <div className="mb-4 flex gap-2">
        {colorOptions.map((c) => (
          <button
            key={c}
            onClick={() => handleColorChange(c)}
            className={`w-6 h-6 rounded-full border-2 ${
              color === c ? "border-primary" : "border-transparent"
            }`}
            style={{backgroundColor: c}}
            aria-label={`Select color ${c}`}
          />
        ))}
      </div>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="brushSize" className="text-sm font-medium">
            Brush Size:
          </label>
          <span className="text-sm text-muted-foreground">{brushSize}</span>
        </div>
        <Slider
          id="brushSize"
          defaultValue={[brushSize]}
          min={1}
          max={20}
          step={1}
          onValueChange={handleBrushSizeChange}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="bg-white border-2 border-gray-300 rounded-md shadow-md touch-none"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
        onTouchStart={(e) => {
          setDrawing(true);
          draw({
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
            currentTarget: e.currentTarget,
          } as any);
        }}
        onTouchEnd={() => setDrawing(false)}
        onTouchMove={handleTouchMove}
      />

      <div className="mt-4 flex gap-4">
        <Button onClick={handleGuess} variant="outline">
          Guess Drawing
        </Button>
        <Button onClick={clearCanvas} variant="destructive">
          Clear Canvas
        </Button>
      </div>

      {guess && (
        <Alert className="mt-4">
          <Circle className="h-4 w-4"/>
          <AlertTitle>AI Guess:</AlertTitle>
          <AlertDescription>{guess}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Firebase Studio
      </footer>
    </div>
  );
};

export default Canvas;
