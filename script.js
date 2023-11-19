document.addEventListener('DOMContentLoaded', function () {
    const gameContainer = document.querySelector('.game-container');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const columnsInput = document.getElementById('columns');
    const rowsInput = document.getElementById('rows');
    const gameTitle = document.getElementById('gameTitle');

    let isPlaying = false;
    let intervalId;
    let cells = [];

    function createGrid(columns, rows) {
        gameContainer.innerHTML = '';
        gameContainer.style.gridTemplateColumns = `repeat(${columns}, 20px)`;

        for (let i = 0; i < columns * rows; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', toggleCellState);
            gameContainer.appendChild(cell);
        }

        cells = document.querySelectorAll('.cell');
        updateGameTitle("GAME OF LIFE");
        updateBackgroundColor();
    }

    function toggleCellState() {
        this.classList.toggle('alive');
    }

    function updateGrid() {
        const newStates = [];

        cells.forEach((cell, index) => {
            const isAlive = cell.classList.contains('alive');
            const neighbors = getNeighbors(index, columnsInput.value, cells.length);

            let liveNeighbors = 0;
            neighbors.forEach(neighborIndex => {
                if (cells[neighborIndex].classList.contains('alive')) {
                    liveNeighbors++;
                }
            });

            if (isPlaying) {
                if (isAlive) {
                    if (liveNeighbors < 2 || liveNeighbors > 3) {
                        newStates.push(false);
                    } else {
                        newStates.push(true);
                    }
                } else {
                    if (liveNeighbors === 3) {
                        newStates.push(true);
                    } else {
                        newStates.push(false);
                    }
                }
            } else {
                newStates.push(isAlive);
            }
        });

        cells.forEach((cell, index) => {
            cell.classList.toggle('alive', newStates[index]);
        });
        updateBackgroundColor();
    }

    function getNeighbors(index, columns, totalCells) {
        const neighbors = [];
        const row = Math.floor(index / columns);
        const col = index % columns;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborRow = row + i;
                const neighborCol = col + j;

                if (
                    neighborRow >= 0 &&
                    neighborRow < Math.floor(totalCells / columns) &&
                    neighborCol >= 0 &&
                    neighborCol < columns &&
                    !(i === 0 && j === 0)
                ) {
                    neighbors.push(neighborRow * columns + neighborCol);
                }
            }
        }

        return neighbors;
    }

    function resetGame() {
        clearInterval(intervalId);
        isPlaying = false;
        updateGameTitle("GAME OF LIFE");
    }

    function updateBackgroundColor() {
        const randomColor = getRandomColor();
        document.body.style.background = `linear-gradient(to right, ${randomColor}, #e52e71)`;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    playBtn.addEventListener('click', function () {
        if (!isPlaying) {
            intervalId = setInterval(updateGrid, 1000);
            isPlaying = true;
            updateGameTitle("PLAYING");
        }
    });

    pauseBtn.addEventListener('click', function () {
        resetGame();
    });

    clearBtn.addEventListener('click', function () {
        cells.forEach(cell => {
            cell.classList.remove('alive');
        });
        resetGame();
        updateBackgroundColor();
    });

    columnsInput.addEventListener('input', function () {
        const columnsValue = columnsInput.value;
        const rowsValue = rowsInput.value;
        createGrid(columnsValue, rowsValue);
        resetGame();
    });

    rowsInput.addEventListener('input', function () {
        const columnsValue = columnsInput.value;
        const rowsValue = rowsInput.value;
        createGrid(columnsValue, rowsValue);
        resetGame();
    });

   
    createGrid(20, 20);
});

function updateGameTitle(title) {
    gameTitle.textContent = title;
}
