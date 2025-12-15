// Sección de inicio
document.getElementById('start-btn').addEventListener('click', function() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('table-container').style.display = 'block';
    generatePeriodicTable();
});

// Generar tabla periódica
function generatePeriodicTable() {
    const table = document.getElementById('periodic-table');
    const dummies = [
        { symbol: '*', name: 'Lantanoides', row: 6, column: 3, class: 'lanthanide-series' },
        { symbol: '**', name: 'Actinoides', row: 7, column: 3, class: 'actinide-series' }
    ];

    // Añadir dummies
    dummies.forEach(dummy => {
        const div = document.createElement('div');
        div.classList.add('element', dummy.class);
        div.style.gridRow = dummy.row;
        div.style.gridColumn = dummy.column;
        div.innerHTML = `
            <div class="symbol">${dummy.symbol}</div>
            <div class="name">${dummy.name}</div>
        `;
        table.appendChild(div);
    });

    // Añadir elementos
    elementsData.forEach(el => {
        const div = document.createElement('div');
        const regionClass = el.region.toLowerCase().replace(/ /g, '-');
        div.classList.add('element', regionClass);
        let row = el.period;
        let column = el.group;
        if (el.category.includes('lanthanide')) {
            row = 8;
            column = el.number - 54;
        } else if (el.category.includes('actinide')) {
            row = 9;
            column = el.number - 86;
        }
        div.style.gridRow = row;
        div.style.gridColumn = column || 1; // Fallback si group null
        div.innerHTML = `
            <div class="number">${el.number}</div>
            <div class="symbol">${el.symbol}</div>
            <div class="name">${el.name}</div>
        `;
        div.addEventListener('click', () => showElementModal(el));
        table.appendChild(div);
    });
}

// Mostrar modal de elemento
function showElementModal(element) {
    document.getElementById('element-title').textContent = `${element.name} (${element.symbol})`;
    document.getElementById('element-image').src = element.image3d;
    document.getElementById('element-basic').innerHTML = `
        Número atómico: ${element.number}<br>
        Masa atómica: ${element.atomic_mass}<br>
        Grupo: ${element.group || 'f-block'}<br>
        Período: ${element.period}<br>
        Región: ${element.region}
    `;
    document.getElementById('element-summary').textContent = element.summary.substring(0, 200) + '...';
    document.getElementById('element-applications').textContent = element.applications;
    document.getElementById('element-modal').style.display = 'block';

    // Eventos de botones
    document.getElementById('back-to-table').onclick = function() {
        document.getElementById('element-modal').style.display = 'none';
        showQuizModal(element);
    };
    document.getElementById('see-another').onclick = function() {
        document.getElementById('element-modal').style.display = 'none';
    };
    document.querySelector('.close').onclick = function() {
        document.getElementById('element-modal').style.display = 'none';
    };
}

// Mostrar modal de quiz
function showQuizModal(element) {
    document.getElementById('quiz-element').textContent = element.name;
    const questionsDiv = document.getElementById('quiz-questions');
    questionsDiv.innerHTML = '';
    const summaryDiv = document.getElementById('quiz-summary');
    summaryDiv.style.display = 'none';
    document.getElementById('finish-quiz').style.display = 'none';

    const questions = [
        {
            question: '¿Cuál es el número atómico?',
            correct: element.number.toString(),
            options: [element.number.toString(), (element.number + 1).toString(), (element.number - 1).toString()]
        },
        {
            question: '¿Cuál es el símbolo?',
            correct: element.symbol,
            options: [element.symbol, 'He', 'Li'] // Ejemplos genéricos, se pueden randomizar más
        },
        {
            question: '¿Qué grupo pertenece?',
            correct: (element.group || 'f-block').toString(),
            options: [(element.group || 'f-block').toString(), '1', '18']
        },
        {
            question: '¿Qué región es?',
            correct: element.region,
            options: [element.region, 'Metales alcalinos', 'Gases nobles']
        },
        {
            question: '¿Cuál es una de sus aplicaciones en la vida real?',
            correct: element.applications.split('.')[0],
            options: [element.applications.split('.')[0], 'Usado en baterías', 'En medicina']
        },
        {
            question: '¿Cuál es su masa atómica aproximada?',
            correct: Math.round(element.atomic_mass).toString(),
            options: [Math.round(element.atomic_mass).toString(), (Math.round(element.atomic_mass) + 5).toString(), (Math.round(element.atomic_mass) - 5).toString()]
        }
    ];

    let currentQuestion = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    function displayQuestion() {
        if (currentQuestion >= questions.length) {
            questionsDiv.style.display = 'none';
            summaryDiv.textContent = `Tuviste ${correctAnswers} aciertos y ${incorrectAnswers} errores`;
            summaryDiv.style.display = 'block';
            document.getElementById('finish-quiz').style.display = 'block';
            return;
        }

        const q = questions[currentQuestion];
        q.options = shuffle(q.options);
        const qContainer = document.createElement('div');
        qContainer.innerHTML = `<p>${q.question}</p>`;
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.onclick = function() {
                if (opt === q.correct) {
                    btn.style.backgroundColor = 'green';
                    btn.innerHTML += ' ✅';
                    correctAnswers++;
                } else {
                    btn.style.backgroundColor = 'red';
                    btn.innerHTML += ' ❌';
                    incorrectAnswers++;
                }
                setTimeout(() => {
                    qContainer.remove();
                    currentQuestion++;
                    displayQuestion();
                }, 1000);
            };
            qContainer.appendChild(btn);
        });
        questionsDiv.appendChild(qContainer);
    }

    displayQuestion();
    document.getElementById('quiz-modal').style.display = 'block';

    document.getElementById('finish-quiz').onclick = function() {
        document.getElementById('quiz-modal').style.display = 'none';
    };
    document.querySelector('.close-quiz').onclick = function() {
        document.getElementById('quiz-modal').style.display = 'none';
    };
}

// Función para shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Cerrar modales al clic fuera
window.onclick = function(event) {
    const elementModal = document.getElementById('element-modal');
    const quizModal = document.getElementById('quiz-modal');
    if (event.target === elementModal) {
        elementModal.style.display = 'none';
    }
    if (event.target === quizModal) {
        quizModal.style.display = 'none';
    }
};
