// null = Modo Cadastro; Número = Modo Edição (índice do array)
let indiceEdicao = null;

function getCarros() {
    return JSON.parse(localStorage.getItem("carros")) || [];
}

function saveCarros(lista) {
    localStorage.setItem("carros", JSON.stringify(lista));
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function editarCarro(index) {
    const carros = getCarros();
    const carro = carros[index];

    document.getElementById("modelo").value = carro.modelo;
    document.getElementById("fabricante").value = carro.fabricante;
    document.getElementById("valor").value = carro.valor;
    document.getElementById("ano").value = carro.ano;

    indiceEdicao = index;
    
    // Alterna visualização dos botões
    const btnEnviar = document.getElementById("btnEnviar");
    btnEnviar.innerText = "Atualizar Carro";
    btnEnviar.style.background = "#007bff";
    
    document.getElementById("btnLimpar").style.display = "none";
    document.getElementById("btnCancelar").style.display = "block";
}

function removerCarro(index) {
    // Se remover o item que está sendo editado, limpa o form
    if (index === indiceEdicao) {
        resetarFormulario();
    }
    
    const carros = getCarros();
    carros.splice(index, 1);
    saveCarros(carros);
    exibirCarros();
}

function exibirCarros() {
    const lista = document.getElementById("listaCarros");
    lista.innerHTML = "";
    const carros = getCarros();

    if (carros.length === 0) {
        lista.innerHTML = "<p style='text-align:center; color:#777;'>Nenhum carro cadastrado.</p>";
        return;
    }

    carros.forEach((carro, index) => {
        lista.innerHTML += `
            <div class="card">
                <strong>Modelo:</strong> ${carro.modelo}<br>
                <strong>Fabricante:</strong> ${carro.fabricante}<br>
                <strong>Valor:</strong> ${formatarMoeda(carro.valor)}<br>
                <strong>Ano:</strong> ${carro.ano}<br>
                <div class="card-actions">
                    <button class="btn-editar" onclick="editarCarro(${index})">Editar</button>
                    <button class="btn-remover" onclick="removerCarro(${index})">Remover</button>
                </div>
            </div>
        `;
    });
}

function resetarFormulario() {
    document.getElementById("formCarro").reset();
    indiceEdicao = null;

    // Restaura botões para o padrão
    const btnEnviar = document.getElementById("btnEnviar");
    btnEnviar.innerText = "Salvar Carro";
    btnEnviar.style.background = "#28a745";
    
    document.getElementById("btnLimpar").style.display = "block";
    document.getElementById("btnCancelar").style.display = "none";
}

document.getElementById("formCarro").addEventListener("submit", function(e){
    e.preventDefault();

    const modelo = document.getElementById("modelo").value;
    const fabricante = document.getElementById("fabricante").value;
    const valor = parseFloat(document.getElementById("valor").value); 
    const ano = parseInt(document.getElementById("ano").value);
    
    // Regras de validação de negócio
    const anoAtual = new Date().getFullYear();
    if (valor < 0) return alert("O valor não pode ser negativo.");
    if (ano < 1886 || ano > (anoAtual + 1)) return alert("Ano inválido.");

    const carros = getCarros();
    const carroObjeto = { modelo, fabricante, valor, ano };

    if (indiceEdicao !== null) {
        carros[indiceEdicao] = carroObjeto; // Atualiza
    } else {
        carros.push(carroObjeto); // Cria
    }
    
    saveCarros(carros);
    resetarFormulario();
    exibirCarros();
});

document.getElementById("btnCancelar").addEventListener("click", resetarFormulario);

document.getElementById("btnLimpar").addEventListener("click", function(){
    if (confirm("Tem certeza que deseja apagar TODOS os carros?")) { 
        localStorage.removeItem("carros");
        exibirCarros();
    }
});

exibirCarros();