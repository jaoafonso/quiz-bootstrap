const perguntas = [
    {
        tipo: "radio",
        enunciado: "Qual linguagem de programação é conhecida como a linguagem da web?",
        opcoes: ["Python", "Java", "JavaScript", "C++"],
        respostaCorreta: "JavaScript"
    },
    {
        tipo: "checkbox",
        enunciado: "Quais dessas são linguagens de programação orientadas a objetos?",
        opcoes: ["Java", "C++", "HTML", "Python"],
        respostaCorreta: ["Java", "C++", "Python"]
    },
    {
        tipo: "texto",
        enunciado: "Qual é o nome da linguagem que lembra uma cobra?",
        respostaCorreta: "Python"
    },
    {
        tipo: "radio",
        enunciado: "O que significa a sigla SQL?",
        opcoes: ["Structured Query Language", "Standard Query Language", "Sequential Query Language", "Simple Query Language"],
        respostaCorreta: "Structured Query Language"
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
        opcoes: ["Manipulação de dados", "Reutilização de código", "Design de interfaces", "Criação de algoritmos"],
        respostaCorreta: "Reutilização de código"
    },
    {
        tipo: "checkbox",
        enunciado: "Quais dessas são estruturas de dados comumente usadas?",
        opcoes: ["Lista", "Árvore", "Tabela Periódica", "Grafo"],
        respostaCorreta: ["Lista", "Árvore", "Grafo"]
    },
    {
        tipo: "texto",
        enunciado: "Qual é o comando usado para clonar um repositório do Git?",
        respostaCorreta: "git clone"
    },
    {
        tipo: "radio",
        enunciado: "Qual empresa criou a linguagem C?",
        opcoes: ["Microsoft", "IBM", "Bell Labs", "Google"],
        respostaCorreta: "Bell Labs"
    },
    {
        tipo: "checkbox",
        enunciado: "Quais dessas práticas fazem parte do desenvolvimento ágil?",
        opcoes: ["Scrum", "Kanban", "Waterfall", "Extreme Programming (XP)"],
        respostaCorreta: ["Scrum", "Kanban", "Extreme Programming (XP)"]
    },
    {
        tipo: "texto",
        enunciado: "Qual é o termo usado para descrever um erro em um programa?",
        respostaCorreta: "Bug"
    }
];

let perguntaAtual = 0;
let acertos = 0;

function carregarPergunta() {
    const pergunta = perguntas[perguntaAtual];
    const tipoArquivo = `elements/${pergunta.tipo}.html`;

    fetch(tipoArquivo)
        .then(response => response.text())
        .then(data => {
            document.getElementById('quizContainer').innerHTML = data;
            document.getElementById('enunciado').innerText = pergunta.enunciado;

            if (pergunta.tipo !== "texto") {
                pergunta.opcoes.forEach((opcao, index) => {
                    document.getElementById(`option${index + 1}`).nextElementSibling.innerText = opcao;
                });
            }
        });
}

function proximaPergunta() {
    let possuiProximaPergunta = perguntaAtual < perguntas.length - 1;
    corrigirPergunta();
    if (possuiProximaPergunta) {
        carregarPergunta();
    } else {
        carregarResultado(acertos);
    }
}

function corrigirPergunta() {
    if (acertouPergunta()) {
        acertos++;
    }
    perguntaAtual++;
}

function acertouPergunta() {
    const pergunta = perguntas[perguntaAtual];
    if (pergunta.tipo === "radio") {
        const resposta = document.querySelector(`input[type="radio"]:checked`).nextElementSibling.innerText;
        return resposta === pergunta.respostaCorreta;
    }
    if (pergunta.tipo === "checkbox") {
        const respostas = Array.from(document.querySelectorAll(`input[type="checkbox"]:checked`)).map(input => input.nextElementSibling.innerText);
        return pergunta.respostaCorreta.every(val => respostas.includes(val))
    }
    if (pergunta.tipo === "texto") {
        const respostaTexto = document.getElementById('answer').value;
        return respostaTexto.toLowerCase() === pergunta.respostaCorreta.toLowerCase();
    }
    return false;
}

function carregarResultado(pontuacao) {
    fetch("elements/resultado.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById('quizContainer').innerHTML = data;
            document.getElementById('pontuacao').innerText = `Sua pontuação: ${pontuacao}`;
            document.getElementById('resultado').innerText = pontuacao === perguntas.length
                ? "Parabéns! Você acertou todas as perguntas!" 
                : "Tente novamente para melhorar sua pontuação.";;
        });
}

carregarPergunta();
