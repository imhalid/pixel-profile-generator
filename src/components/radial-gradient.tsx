import React, { useState, useRef, useEffect, SVGProps } from 'react';
import { generateRandomColor } from '../utils/randomcolor';
import ColorPicker from './color-picker';
import { setGradientColor, setRadialFirstColorPosition, setRadialSecondColorPosition } from '../store/slices/preview-slice';
import { useDispatch } from 'react-redux'
const RadialGradientGenerator = () => {
  // States
  const [colorStops, setColorStops] = useState([
    { color: '#3ddb82', position: 0 },
    { color: '#1c1c45', position: 100 }
  ]);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedStop, setDraggedStop] = useState<number | null>(null);
  const [isRepositioning, setIsRepositioning] = useState(false);


  const dispatch = useDispatch()
  // Refs
  const controlAreaRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const findOptimalPosition = () => {
    if (colorStops.length < 2) return 50;

    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    let maxGap = 0;
    let optimalPosition = 50;

    for (let i = 0; i < sortedStops.length - 1; i++) {
      const gap = sortedStops[i + 1].position - sortedStops[i].position;
      if (gap > maxGap) {
        maxGap = gap;
        optimalPosition = sortedStops[i].position + gap / 2;
      }
    }

    return Math.round(optimalPosition);
  };

  const generateGradientString = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    return `radial-gradient(circle at ${posX}% ${posY}%, ${stopsString})`;
  };

  const generateLinearGradientString = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    return `linear-gradient(to right, ${stopsString})`;
  };

  const handlePositionMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedStop(null);
    setIsRepositioning(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updatePosition(e);
    }
    if (!(draggedStop !== null && sliderRef.current)) {
      return;
    }
    e.preventDefault();
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;

    const newStops = colorStops.map((stop, index) => {
      if (index === draggedStop) {
        return { ...stop, position: Math.round(percentage) };
      }
      return stop;
    });
    
    setColorStops(newStops);
  };

  const updatePosition = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!controlAreaRef.current) {
      return;
    }
    const rect = controlAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPosX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newPosY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    
    dispatch(setRadialFirstColorPosition(Math.round(newPosX)));
    dispatch(setRadialSecondColorPosition(Math.round(newPosY)));
    setPosX(Math.round(newPosX));
    setPosY(Math.round(newPosY));
  };

  const handleStopMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ): void => {
    e.stopPropagation();

    // Store initial position
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;

    const handleMouseMove = (moveEvent: MouseEvent): void => {
      // Calculate distance moved
      const deltaX: number = Math.abs(
        moveEvent.clientX - dragStartPosRef.current.x
      );
      const deltaY: number = Math.abs(
        moveEvent.clientY - dragStartPosRef.current.y
      );

      // If moved more than 5px, consider it a drag
      if (!(deltaX > 5 || deltaY > 5)) {
        return;
      }
      isDraggingRef.current = true;
      setDraggedStop(index);
      setIsRepositioning(true);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    const handleMouseUp = (upEvent: MouseEvent): void => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // If it wasn't a drag, treat it as a click
      if (
        !isDraggingRef.current &&
        colorPickerRefs.current[index] &&
        !(upEvent.target as HTMLElement).closest('button')
      ) {
        colorPickerRefs.current[index]?.click();
      }

      // Reset dragging state
      setTimeout((): void => {
        setDraggedStop(null);
        setIsRepositioning(false);
        isDraggingRef.current = false;
      }, 0);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (!(isDragging || draggedStop !== null)) {
      return;
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggedStop]);

  useEffect(() => {
    dispatch(setGradientColor(generateGradientString()));
  }, [colorStops, posX, posY]);

  const addColorStop = () => {
    const newPosition = findOptimalPosition();
    const newColor = generateRandomColor();
    dispatch(setGradientColor(generateGradientString()))
    setColorStops([...colorStops, { color: newColor, position: newPosition }]);
  };

  const findClosestStop = (position: number) => {
    return colorStops.reduce((closest, current, index) => {
      const currentDiff = Math.abs(current.position - position);
      const closestDiff = Math.abs(colorStops[closest].position - position);
      return currentDiff < closestDiff ? index : closest;
    }, 0);
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || draggedStop !== null) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);

    const closestStopIndex = findClosestStop(percentage);
    const newStops = [...colorStops];
    newStops[closestStopIndex] = { ...newStops[closestStopIndex], position: percentage };
    setColorStops(newStops);
  };

  return (
    <div className="w-full max-w-2xl">
      <div>
        <div className="space-y-6">
          {/* Combined Preview and Position Control */}
          <div className="space-y-2">
            <div
              ref={controlAreaRef}
              className="relative w-full h-[150px] cursor-crosshair"
              style={{ background: generateGradientString() }}
              onMouseDown={handlePositionMouseDown}
            >
              {/* Grid Lines */}
              <div className="absolute w-full h-full">
                <div className="absolute left-1/4 mix-blend-overlay top-0 w-px h-full bg-white/50" />
                <div className="absolute left-1/2 mix-blend-overlay top-0 w-px h-full bg-white/50" />
                <div className="absolute left-3/4 mix-blend-overlay top-0 w-px h-full bg-white/50" />
                <div className="absolute top-1/4 mix-blend-overlay left-0 h-px w-full bg-white/50" />
                <div className="absolute top-1/2 mix-blend-overlay left-0 h-px w-full bg-white/50" />
                <div className="absolute top-3/4 mix-blend-overlay left-0 h-px w-full bg-white/50" />
              </div>

              {/* Position Indicator */}
              <div
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-black shadow-md"
                style={{
                  left: `${posX}%`,
                  top: `${posY}%`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>

          {/* Color Stops */}
          <div className="space-y-4">


            {/* Position Slider */}
            <div
              ref={sliderRef}
              className="relative h-5 select-none"
              style={{ background: generateLinearGradientString() }}
              onClick={handleSliderClick}
            >
              {colorStops.map((stop, index) => (
                <div
                  key={index}
                  className="absolute top-[10px] h-full"
                  style={{ left: `${stop.position}%` }}
                >
                  {/* Draggable Handle */}
                  <div
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-full border border-white shadow ${isRepositioning && draggedStop === index ? 'cursor-grabbing' : 'cursor-grab'
                      }`}
                    style={{ background: stop.color }}
                    onMouseDown={(e) => handleStopMouseDown(e, index)}
                  >
                    {/* Color Preview Tooltip */}
                    {draggedStop === index && (
                      <div
                        className="absolute p-2 rounded shadow-lg pointer-events-none"
                        style={{
                          left: '50%',
                          top: '-30px',
                          backgroundColor: stop.color,
                          width: '20px',
                          height: '20px',
                          transform: 'translateX(-50%)',
                          border: '2px solid white'
                        }}
                      />
                    )}
                    {/* Position indicator */}

                    <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                      {stop.position}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-end justify-end">
              <button
                onClick={addColorStop}
                className="flex items-center gap-1 bg-white text-black px-1"
              >

                Add Color
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>

              {colorStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-1 bg-neutral-800 px-1">
                  <ColorPicker
                    color={stop.color}
                    onChange={(newColor) => {
                      const newStops = [...colorStops];
                      newStops[index] = { ...newStops[index], color: newColor };
                      setColorStops(newStops);
                    }}
                  />
                  {
                    colorStops.length > 2 && (
                      <button
                        onClick={() => {
                          const newStops = colorStops.filter((_, i) => i !== index);
                          setColorStops(newStops);
                        }}
                        className=" hover:text-red-500 text-red-100/50 rounded"
                      >
                        <PixelarticonsTrash className="w-5 h-5" />
                      </button>
                    )
                  }
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RadialGradientGenerator;

export function PixelarticonsTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M16 2v4h6v2h-2v14H4V8H2V6h6V2zm-2 2h-4v2h4zm0 4H6v12h12V8zm-5 2h2v8H9zm6 0h-2v8h2z" /></svg>
  )
}