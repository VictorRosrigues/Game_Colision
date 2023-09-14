const canvas = document.getElementById("jogoCanvas");
const ctx = canvas.getContext("2d");
const blocoSize = 40;
let playerX = 285;
const playerWidth = 30;
const playerSpeed = 20;
let blocos = [];
const tiros = [];
let pontos = 0;

// Função para criar um bloco aleatório
function criarBloco() {
    const x = Math.random() * (canvas.width - blocoSize);
    const novoBloco = { x, y: 0 };
    blocos.push(novoBloco);
}

// Função para criar um tiro
function criarTiro() {
    const tiroX = playerX + playerWidth / 2;
    const tiroY = canvas.height - playerWidth;
    tiros.push({ x: tiroX, y: tiroY });
}

// Função para verificar colisões entre tiros e blocos
function verificarColisoes() {
    for (let i = 0; i < tiros.length; i++) {
        const tiro = tiros[i];
        for (let j = 0; j < blocos.length; j++) {
            const bloco = blocos[j];
            if (
                tiro.x >= bloco.x &&
                tiro.x <= bloco.x + blocoSize &&
                tiro.y <= bloco.y + blocoSize
            ) {
                // Colisão detectada, remover o bloco e o tiro
                blocos.splice(j, 1);
                tiros.splice(i, 1);
                pontos++;
                document.getElementById("pontuacao").textContent = `Pontuação: ${pontos}`;
                return; // Sair do loop interno
            }
        }
    }
}

// Função para mover o jogador
function moverJogador(event) {
    switch (event.key) {
        case "A":
        case "a":
        case "ArrowLeft":
            if (playerX > 0) {
                playerX -= playerSpeed;
            }
            break;
        case "D":
        case "d":
        case "ArrowRight":
            if (playerX < canvas.width - playerWidth) {
                playerX += playerSpeed;
            }
            break;
        case " ":
            criarTiro();
            break;
    }
}

// Adicionar um ouvinte de eventos para detectar pressionamento de tecla
window.addEventListener("keydown", moverJogador);

// Adicionar um ouvinte de eventos para detectar a liberação da tecla Espaço
window.addEventListener("keyup", function(event) {
    if (event.key === " ") { // Espaço
        criarTiro();
    }
});

// Adicionar um ouvinte de eventos para detectar clique do botão esquerdo do mouse
canvas.addEventListener("mousedown", function(event) {
    if (event.button === 0) { // Botão esquerdo do mouse
        criarTiro();
    }
});

// Função para iniciar o jogo
function iniciarJogo() {
    document.getElementById("paginaInicial").style.display = "none"; // Esconde a página inicial
    canvas.style.display = "block"; // Mostra o canvas
    setInterval(criarBloco, 1000); // Crie um novo bloco a cada 1 segundo
    atualizar();
}

// Adicionar um ouvinte de eventos para o botão "Iniciar o Jogo"
document.getElementById("iniciarJogo").addEventListener("click", iniciarJogo);

// Função para atualizar a tela
function atualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX, canvas.height - playerWidth, playerWidth, playerWidth);

    for (let i = 0; i < blocos.length; i++) {
        const bloco = blocos[i];
        ctx.fillStyle = "red";
        ctx.fillRect(bloco.x, bloco.y, blocoSize, blocoSize);
        bloco.y += 2; // Velocidade de queda

        // Verificar colisão com a borda inferior do canvas
        if (bloco.y + blocoSize >= canvas.height) {
            alert("Game Over!");
            document.location.reload();
            return;
        }

        // Verificar colisão com o jogador
        if (bloco.y + blocoSize >= canvas.height - playerWidth && bloco.x >= playerX && bloco.x <= playerX + playerWidth) {
            alert("Game Over!");
            document.location.reload();
            return;
        }
    }

    for (let i = 0; i < tiros.length; i++) {
        const tiro = tiros[i];
        ctx.fillStyle = "green";
        ctx.fillRect(tiro.x, tiro.y, 2, 10); // Tiro como um retângulo verde
        tiro.y -= 5; // Velocidade do tiro

        // Remover tiros que saíram da tela
        if (tiro.y < 0) {
            tiros.splice(i, 1);
        }
    }

    verificarColisoes();

    // Remover blocos que saíram da tela
    blocos = blocos.filter(bloco => bloco.y + blocoSize < canvas.height);

    requestAnimationFrame(atualizar);
}
