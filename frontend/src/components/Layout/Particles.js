export function initParticles() {

    const canvas = document.getElementById('particles-js');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,  // Posição X 
        y: Math.random() * canvas.height, // Posição Y
        radius: Math.random() * 3 + 1,   // Tamanho 
        color: '#fff',                // Cor 
        velocityX: (Math.random() - 0.5) * 2, // Velocidade X
        velocityY: (Math.random() - 0.5) * 2, // Velocidade Y
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        particles.forEach((particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); 
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
    }

    function update() {
        particles.forEach((particle) => {
            particle.x += particle.velocityX; 
            particle.y += particle.velocityY; 

            if (particle.x < 0 || particle.x > canvas.width) particle.velocityX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.velocityY *= -1;
        });
    }

   
    function animate() {
        draw();
        update();
        requestAnimationFrame(animate); 
    }
    
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
