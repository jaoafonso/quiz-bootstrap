const perguntas = [
    {
        tipo: "radio",
        enunciado: "Qual linguagem de programação é conhecida como a linguagem da web?",
        opcoes: ["Python", "Java", "JavaScript", "C++"],
        respostaCorreta: "JavaScript"
    },
    {
        tipo: "texto",
        enunciado: "Qual é o nome da linguagem que lembra uma cobra?",
        respostaCorreta: "Python"
    },
    {
        tipo: "checkbox",
        enunciado: "Quais dessas tecnologias são consideradas frameworks front-end?",
        opcoes: ["React", "Vue", "Laravel", "Angular"],
        respostaCorreta: ["React", "Vue", "Angular"]
    },
    {
        tipo: "texto",
        enunciado: "Qual é a extensão padrão para arquivos JavaScript?",
        respostaCorreta: ".js"
    },
    {
        tipo: "radio",
        enunciado: "Qual é o principal objetivo da programação orientada a objetos?",
        opcoes: ["Manipulação de dados", "Reutilização de código", "Dor de cabeça", "Criação de algoritmos"],
        respostaCorreta: "Reutilização de código"
    },
    {
        tipo: "checkbox",
        enunciado: "Quais dessas são estruturas de dados comumente usadas?",
        opcoes: ["Lista", "Árvore", "Tabela Periódica", "Elemento"],
        respostaCorreta: ["Lista", "Árvore"]
    },
    {
        tipo: "texto",
        enunciado: "Qual é o comando usado para clonar um repositório do Git?",
        respostaCorreta: "git clone"
    },
    {
        tipo: "checkbox",
        enunciado: "Quais dessas práticas fazem parte do desenvolvimento ágil?",
        opcoes: ["Scrum", "Kanban", "Cascata", "Go Horse"],
        respostaCorreta: ["Scrum", "Kanban"]
    },
    {
        tipo: "texto",
        enunciado: "Qual é o termo usado para descrever um erro em um programa?",
        respostaCorreta: "Bug"
    }
];

let respostas = [];
let perguntaAtual = 0;

function carregarPergunta() {
    const pergunta = perguntas[perguntaAtual];
    const tipoArquivo = `elements/${pergunta.tipo}.html`;

    fetch(tipoArquivo)
        .then(response => response.text())
        .then(data => {
            document.getElementById('quizContainer').innerHTML = data;
            document.getElementById('enunciado').innerText = pergunta.enunciado;
            carregarOpcoes(pergunta);
        });
}

function carregarOpcoes(pergunta) {
    if (pergunta.tipo !== "texto") {
        const labels = document.querySelectorAll('.form-check-label');

        pergunta.opcoes.forEach((opcao, index) => {
            labels[index].innerText = opcao;
        });
    }
}

function proximaPergunta() {
    corrigirPerguntaAtual();
    if (perguntaAtual < perguntas.length) {
        carregarPergunta();
    } else {
        carregarResultado();
    }
}

function corrigirPerguntaAtual() {
    const pergunta = perguntas[perguntaAtual];
    const acertou = validarRespostaAtual();
    respostas.push({
        enunciado: pergunta.enunciado,
        respostaUsuario: obterRespostaAtual(pergunta),
        correta: acertou,
        respostaCorreta: pergunta.respostaCorreta
    });

    perguntaAtual++;
}

function obterRespostaAtual(pergunta) {
    const getters = {
        radio: getRespostaRadio,
        checkbox: getRespostasCheckbox,
        texto: getRespostaTexto,
    };
    return getters[pergunta.tipo](pergunta);
}

function validarRespostaAtual() {
    const pergunta = perguntas[perguntaAtual];

    const validadores = {
        radio: validarRespostaRadio,
        checkbox: validarRespostaCheckbox,
        texto: validarRespostaTexto,
    };

    return validadores[pergunta.tipo](pergunta);
}

function validarRespostaRadio(pergunta) {
    return getRespostaRadio() === pergunta.respostaCorreta;
}

function validarRespostaCheckbox(pergunta) {
    const respostasSelecionadas = getRespostasCheckbox();
    const respostasCorretas = pergunta.respostaCorreta;

    return (
        respostasSelecionadas.length === respostasCorretas.length
        && respostasCorretas.every(resposta => respostasSelecionadas.includes(resposta))
    );
}

function validarRespostaTexto(pergunta) {
    return getRespostaTexto().toLowerCase() === pergunta.respostaCorreta.toLowerCase();
}

function getRespostaRadio() {
    return document.querySelector('input[type="radio"]:checked').nextElementSibling.innerText;
}

function getRespostasCheckbox() {
    return Array.from(
        document.querySelectorAll('input[type="checkbox"]:checked')
    ).map(input => input.nextElementSibling.innerText);
}

function getRespostaTexto() {
    return document.getElementById("answer").value.trim();
}

function carregarResultado() {
    fetch("elements/resultado.html")
        .then(response => response.text())
        .then(data => {
            const pontuacao = respostas.filter(resultado => resultado.correta === true).length;
            document.getElementById('quizContainer').innerHTML = data;
            document.getElementById('pontuacao').innerText = `Sua pontuação: ${pontuacao}`;

            const tabelaBody = document.querySelector("#tabelaResultado tbody");
            respostas.forEach((resultado, index) => {
                const linha = document.createElement("tr");

                linha.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${resultado.enunciado}</td>
                    <td>${Array.isArray(resultado.respostaUsuario) ? resultado.respostaUsuario.join(", ") : resultado.respostaUsuario}</td>
                    <td>${Array.isArray(resultado.respostaCorreta) ? resultado.respostaCorreta.join(", ") : resultado.respostaCorreta}</td>
                    <td>${resultado.correta ? `✅` : `❌`}</td>
                `;

                tabelaBody.appendChild(linha);
            });
        });
}

carregarPergunta();
