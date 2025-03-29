import React, { useEffect, useRef } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
}

const BilliardsSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Initialize balls
    const balls: Ball[] = [
      { x: 200, y: 200, vx: 2, vy: 1, radius: 10, mass: 1 },
      { x: 400, y: 200, vx: -1, vy: 1, radius: 10, mass: 1 },
    ];

    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw table border
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Update and draw balls
      balls.forEach((ball) => {
        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Handle wall collisions
        if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
          ball.vx *= -0.99; // Add slight energy loss
        }
        if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
          ball.vy *= -0.99; // Add slight energy loss
        }

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.closePath();
      });

      // Ball-to-ball collision detection
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const dx = balls[j].x - balls[i].x;
          const dy = balls[j].y - balls[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < balls[i].radius + balls[j].radius) {
            // Collision detected - calculate new velocities
            const normalX = dx / distance;
            const normalY = dy / distance;

            const relativeVelocityX = balls[j].vx - balls[i].vx;
            const relativeVelocityY = balls[j].vy - balls[i].vy;

            const impulse = 2 * (relativeVelocityX * normalX + relativeVelocityY * normalY) /
              (balls[i].mass + balls[j].mass);

            balls[i].vx += impulse * balls[j].mass * normalX;
            balls[i].vy += impulse * balls[j].mass * normalY;
            balls[j].vx -= impulse * balls[i].mass * normalX;
            balls[j].vy -= impulse * balls[i].mass * normalY;
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #2c3e50',
          borderRadius: '4px',
          background: '#ecf0f1'
        }}
      />
    </div>
  );
};

export default BilliardsSimulation;