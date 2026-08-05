import { useEffect, useRef } from 'react';

const moodGradients = {
    Chill: ['#2ee6c4', '#3b82f6'],
    Party: ['#ec4899', '#8b5cf6'],
    Workout: ['#f97316', '#ef4444'],
    Focus: ['#06b6d4', '#6366f1'],
    Romantic: ['#f43f5e', '#a855f7'],
    Happy: ['#eab308', '#22c55e'],
    Sad: ['#64748b', '#3b82f6'],
    Default: ['#2ee6c4', '#a78bfa']
};

const Visualizer = ({ isPlaying, mood = 'Chill', height = 180 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const colors = moodGradients[mood] || moodGradients.Default;

        // Set high DPI canvas
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const barCount = 48;
        const barWidth = (rect.width / barCount) - 4;
        let phase = 0;

        const render = () => {
            ctx.clearRect(0, 0, rect.width, height);

            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1]);

            ctx.fillStyle = gradient;

            for (let i = 0; i < barCount; i++) {
                let barHeight;
                if (isPlaying) {
                    // Procedural wave equation simulating audio frequency bars
                    const sinVal = Math.sin(phase + i * 0.2) * Math.cos(phase * 0.7 + i * 0.1);
                    const noise = Math.sin(i * 1.5 + phase * 2) * 0.3;
                    barHeight = Math.max(8, (Math.abs(sinVal) + Math.abs(noise)) * (height * 0.75));
                } else {
                    barHeight = 6; // Idle height
                }

                const x = i * (barWidth + 4) + 2;
                const y = height - barHeight;

                // Draw rounded frequency bar
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
                ctx.fill();
            }

            if (isPlaying) {
                phase += 0.08;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, mood, height]);

    return (
        <div className="w-full relative overflow-hidden rounded-2xl py-2">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default Visualizer;
