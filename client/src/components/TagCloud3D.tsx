import { useEffect, useRef, useState } from 'react';

interface Tag {
  text: string;
  x: number;
  y: number;
  z: number;
  x2d: number;
  y2d: number;
  scale: number;
  alpha: number;
}

export function TagCloud3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const skills = [
    'Java', 'Rust', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML5', 'CSS3',
    'Spring Boot', 'Node.js', 'Express.js', 'FastAPI',
    'React.js', 'Dragula', 'Bootstrap', 'TailwindCSS', 'Three.js',
    'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
    'JUnit 5', 'MockMvc', 'Mockito', 'PyTest',
    'Git', 'GitHub', 'Docker', 'Gradle', 'Vercel', 'Render',
    'RESTful APIs', 'Bitwise Optimization', 'OOP', 'UML/ERD',
    'Prompt Engineering', 'Gemini API'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Configuration Constants ---
    const N = skills.length;
    const RADIUS_COEFF = 0.65; // Sphere radius as percentage of canvas half-width
    const DEPTH = 300; // Perspective depth coordinate
    const BASE_SPEED_X = 0.002; // Elegant idle drift X
    const BASE_SPEED_Y = 0.002; // Elegant idle drift Y

    let radius = 120;
    let angleX = BASE_SPEED_X;
    let angleY = BASE_SPEED_Y;
    let targetAngleX = BASE_SPEED_X;
    let targetAngleY = BASE_SPEED_Y;

    let mouseX = 0;
    let mouseY = 0;
    let isMouseOver = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    // Generate tags mathematically distributed evenly on a sphere
    const tags: Tag[] = skills.map((text, i) => {
      const theta = Math.acos(-1 + (2 * i) / N);
      const phi = Math.sqrt(N * Math.PI) * theta;

      return {
        text,
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
        x2d: 0,
        y2d: 0,
        scale: 1,
        alpha: 1,
      };
    });

    // Resize handler to match canvas to parent HUD box
    const handleResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 380;
      const height = Math.min(width, 380);

      canvas.width = width;
      canvas.height = height;
      radius = (width / 2) * RADIUS_COEFF;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mathematical rotation along X and Y axes
    const rotateX = (tag: Tag, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = tag.y * cos - tag.z * sin;
      const z = tag.z * cos + tag.y * sin;
      tag.y = y;
      tag.z = z;
    };

    const rotateY = (tag: Tag, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = tag.x * cos + tag.z * sin;
      const z = tag.z * cos - tag.x * sin;
      tag.x = x;
      tag.z = z;
    };

    // Animation Loop
    let animationId = 0;
    let currentHover: string | null = null;

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Smoothly interpolate rotation speeds (easing drag/velocity drifts)
      if (!isDragging) {
        angleX += (targetAngleX - angleX) * 0.05;
        angleY += (targetAngleY - angleY) * 0.05;
      }

      // Check hover collisions
      let closestTag: Tag | null = null;
      let maxZ = -Infinity;

      tags.forEach((tag) => {
        // Apply rotations
        if (!currentHover || isDragging) {
          rotateX(tag, angleX);
          rotateY(tag, angleY);
        }

        // Perspective 3D -> 2D projection
        const sphereX = tag.x * radius;
        const sphereY = tag.y * radius;
        const sphereZ = tag.z * radius;

        tag.scale = DEPTH / (DEPTH - sphereZ);
        tag.alpha = (tag.z + 1.2) / 2.2; // Range ~ [0.1, 1.0]

        tag.x2d = sphereX * tag.scale + centerX;
        tag.y2d = sphereY * tag.scale + centerY;

        // Calculate text boundaries for mouse collision
        ctx.font = `bold ${Math.max(10, Math.floor(13 * tag.scale))}px Share Tech Mono, monospace`;
        const metrics = ctx.measureText(tag.text);
        const w = metrics.width + 12;
        const h = Math.max(10, Math.floor(13 * tag.scale)) + 10;

        if (
          isMouseOver &&
          mouseX >= tag.x2d - w / 2 &&
          mouseX <= tag.x2d + w / 2 &&
          mouseY >= tag.y2d - h / 2 &&
          mouseY <= tag.y2d + h / 2
        ) {
          if (sphereZ > maxZ) {
            maxZ = sphereZ;
            closestTag = tag;
          }
        }
      });

      // Update hover state
      if (closestTag) {
        canvas.style.cursor = 'pointer';
        currentHover = (closestTag as Tag).text;
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'default';
        currentHover = null;
      }
      setHoveredTag(currentHover);

      // Render tags sorted by depth (Z-ordering) to prevent layout overlaps
      const sortedTags = [...tags].sort((a, b) => a.z - b.z);

      sortedTags.forEach((tag) => {
        const isHovered = tag.text === currentHover;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fontSize = Math.max(9, Math.floor((isHovered ? 15 : 12) * tag.scale));
        ctx.font = `bold ${fontSize}px Orbitron, sans-serif`;

        // Render text glow effects
        if (isHovered) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00f5ff';
          ctx.fillStyle = '#00f5ff';
        } else {
          ctx.shadowBlur = 4 * tag.scale;
          ctx.shadowColor = 'rgba(233,30,140,0.4)';
          ctx.fillStyle = `rgba(253, 240, 255, ${tag.alpha})`;
        }

        // Draw skill label background pill for focused tags
        if (isHovered) {
          ctx.fillStyle = 'rgba(0, 245, 255, 0.1)';
          const metrics = ctx.measureText(tag.text);
          const px = metrics.width + 16;
          const py = fontSize + 10;
          ctx.beginPath();
          ctx.roundRect(tag.x2d - px / 2, tag.y2d - py / 2, px, py, 6);
          ctx.fill();
          ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#00f5ff';
        }

        ctx.fillText(tag.text, tag.x2d, tag.y2d);
        ctx.restore();
      });

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    // --- Interactive Mouse Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseOver = true;

      if (isDragging) {
        // Pivot sphere based on mouse drag movements
        const deltaX = mouseX - dragStartX;
        const deltaY = mouseY - dragStartY;
        angleY = deltaX * 0.005;
        angleX = -deltaY * 0.005;
        dragStartX = mouseX;
        dragStartY = mouseY;
      } else {
        // Accelerate rotation when cursor approaches boundaries
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        targetAngleY = (mouseX - cx) * 0.00002;
        targetAngleX = -(mouseY - cy) * 0.00002;
      }
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
      isDragging = false;
      targetAngleX = BASE_SPEED_X;
      targetAngleY = BASE_SPEED_Y;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      dragStartX = e.clientX - rect.left;
      dragStartY = e.clientY - rect.top;
      isDragging = true;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch support for responsive devices (smartphones/tablets)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
      isMouseOver = true;

      if (isDragging) {
        const deltaX = mouseX - dragStartX;
        const deltaY = mouseY - dragStartY;
        angleY = deltaX * 0.008;
        angleX = -deltaY * 0.008;
        dragStartX = mouseX;
        dragStartY = mouseY;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      dragStartX = e.touches[0].clientX - rect.left;
      dragStartY = e.touches[0].clientY - rect.top;
      isDragging = true;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex flex-col items-center justify-center relative p-6 border border-[#e91e8c]/20 bg-black/40 rounded-2xl shadow-[0_0_20px_rgba(233,30,140,0.05)] overflow-hidden animate-[alyra-fade-in_1s_ease-out]"
    >
      <div className="absolute top-3 left-4 text-[9px] font-mono text-[#00f5ff]/60 uppercase tracking-widest">
        [3D_TACTICAL_ARSE_PROJ]
      </div>
      <div className="absolute top-3 right-4 text-[8px] font-mono text-[#ff6eb4]/60 uppercase tracking-widest animate-pulse">
        {hoveredTag ? `[LOCKED: ${hoveredTag.toUpperCase()}]` : '[DRIFTING_MODE]'}
      </div>
      
      {/* 3D Canvas element */}
      <canvas 
        ref={canvasRef} 
        className="max-w-full aspect-square"
      />
      
      <div className="text-[9px] font-mono text-[#cc99ff]/60 uppercase tracking-widest mt-2">
        &lt; DRAG OR HOVER SPHERE TO DECIPHER TARGETS _ &gt;
      </div>
    </div>
  );
}
