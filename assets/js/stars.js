document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let meteors = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        stars = [];
        for (let i = 0; i < 300; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.5,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    function drawStar(cx, cy, spikes, outerRadius, innerRadius, rotation, opacity) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.beginPath();
        let step = Math.PI / spikes;
        let angle = -Math.PI / 2;
        ctx.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            angle += step;
            ctx.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            angle += step;
            ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        ctx.restore();
    }

    function createMeteor() {
        if (Math.random() < 0.03) { // 3% 概率生成流星
            meteors.push({
                x: Math.random() * canvas.width * 0.5,  
                y: Math.random() * canvas.height * 0.5,
                speed: Math.random() * 8 + 4,
                length: Math.random() * 100 + 50,
                size: Math.random() * 4 + 2, // 初始大小
                curve: (Math.random() - 0.5) * 0.2, // 让流星轨迹微微弯曲
                opacity: 1
            });
        }
    }

    function drawMeteor(meteor) {
        ctx.beginPath();
        let gradient = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x + meteor.length, meteor.y + meteor.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`); 
        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.size; // 让流星开始时较大，后面变细
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x + meteor.length, meteor.y + meteor.length);
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 画普通星星
        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }

            // 让星星闪烁
            star.opacity += (Math.random() - 0.5) * 0.05;
            if (star.opacity < 0.3) star.opacity = 0.3;
            if (star.opacity > 1) star.opacity = 1;

            drawStar(star.x, star.y, 5, star.size * 2, star.size * 0.8, star.angle, star.opacity);
        });

        // 创建流星（偶尔出现）
        createMeteor();

        // 更新并绘制流星
        meteors.forEach((meteor, index) => {
            meteor.x += meteor.speed + meteor.curve; // 让流星轨迹稍微弯曲
            meteor.y += meteor.speed;
            meteor.opacity -= 0.02; // 让流星逐渐消失
            meteor.size *= 0.98; // 让流星逐渐变小
            
            drawMeteor(meteor);

            // 移除透明度完全消失的流星
            if (meteor.opacity <= 0 || meteor.size < 0.5) {
                meteors.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
});
