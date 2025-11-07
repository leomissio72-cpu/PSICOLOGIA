// !!! SUBSTITUA PELA SUA URL DE IMPLANTAÇÃO (A URL LONGA DO APPS SCRIPT) !!!
const scriptURL = "https://script.google.com/macros/s/AKfycbxo6dRu7_tJ_fyGKPur_RvMjAaJTy3d2zYuB6hRUowBpH_xnT_T7GLQRWz2_ipyNPmg/exec"; 
// Você já fez essa parte! Mantenha a URL correta do seu Apps Script aqui.

// --- Variáveis Globais e DOM ---
const loginScreen = document.getElementById("loginScreen");
const mainContent = document.getElementById("mainContent");
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

const navLinks = document.querySelectorAll(".sidebar a");
const viewContents = document.querySelectorAll(".view-content");
const mainTitle = document.getElementById("mainTitle");
const statusMensagem = document.getElementById("statusMensagem");
const statusMensagemRelatorio = document.getElementById("statusMensagemRelatorio");

// Formulários e Divs
const buscaForm = document.getElementById("buscaForm");
const dadosPacienteDiv = document.getElementById("dadosPaciente");
const novaSessaoForm = document.getElementById("novaSessao");
const cadastroForm = document.getElementById("cadastroForm");
const alertaCadastroDiv = document.getElementById("alertaCadastro");
const btnVerPacientes = document.getElementById("btnVerPacientes");
const listaPacientesContainer = document.getElementById("listaPacientesContainer");
const listaPacientesUl = document.getElementById("listaPacientes");
const filtroRelatorioForm = document.getElementById("filtroRelatorioForm");

// --- FUNÇÕES DE LOGIN/LOGOUT ---

function showStatus(msg, type, isReport = false) {
    const statusEl = isReport ? statusMensagemRelatorio : statusMensagem;
    statusEl.textContent = msg;
    statusEl.className = `alert alert-${type}`;
    setTimeout(() => {
        statusEl.textContent = "";
        statusEl.className = "alert";
    }, 5000);
}

function showLoginStatus(msg, type) {
    loginStatus.textContent = msg;
    loginStatus.className = `alert alert-${type}`;
    setTimeout(() => {
        loginStatus.textContent = "";
        loginStatus.className = "alert";
    }, 5000);
}

loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const password = document.getElementById("loginPassword").value;
    
    showLoginStatus("Verificando senha...", "info");

    try {
        const res = await fetch(scriptURL, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'verificarLogin', 
                password: password 
            })
        });
        const result = await res.json();

        if (result.sucesso) {
            localStorage.setItem('isAuthenticated', 'true');
            loginScreen.style.display = 'none';
            mainContent.style.display = 'flex';
            showView('viewClientes');
        } else {
            showLoginStatus("Senha incorreta. Tente novamente.", "error");
            document.getElementById("loginPassword").value = '';
        }
    } catch (error) {
        showLoginStatus("Erro de rede. Verifique a URL do App Script.", "error");
    }
});

function checkAuth() {
    if (localStorage.getItem('isAuthenticated') === 'true') {
        loginScreen.style.display = 'none';
        mainContent.style.display = 'flex';
        showView('viewClientes');
    } else {
        loginScreen.style.display = 'flex';
        mainContent.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    loginScreen.style.display = 'flex';
    mainContent.style.display = 'none';
    document.getElementById("loginPassword").value = '';
    showLoginStatus("Você foi desconectado.", "info");
}

// --- RESTO DO CÓDIGO (Navegação, Busca, Cadastro, Sessão, Relatório) ---

function resetForms() {
    dadosPacienteDiv.style.display = "none";
    cadastroForm.style.display = "none";
    alertaCadastroDiv.style.display = "none";
    listaPacientesContainer.style.display = "none";
    statusMensagem.textContent = "";
    statusMensagem.className = "alert";
}

function showView(viewId) {
    viewContents.forEach(view => {
        view.style.display = 'none';
    });
    const viewElement = document.getElementById(viewId);
    viewElement.style.display = 'block';

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.view === viewId.replace('view', '').toLowerCase()) {
            link.classList.add('active');
            mainTitle.textContent = link.textContent.split("/")[0].trim();
        }
    });
    
    if (viewId === 'viewClientes') {
         mainTitle.textContent = 'Gerenciamento de Clientes e Sessões';
         btnVerPacientes.style.display = 'block';
         document.getElementById("buscaCpf").value = "";
         resetForms();
    } else if (viewId === 'viewRelatorios') {
         mainTitle.textContent = 'Relatórios Financeiros';
         btnVerPacientes.style.display = 'none';
         const hoje = new Date();
         const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
         document.getElementById('dataInicio').valueAsDate = primeiroDia;
         document.getElementById('dataFim').valueAsDate = hoje;
         filtroRelatorioForm.dispatchEvent(new Event('submit'));
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (link.id !== 'navLogout') {
            showView('view' + link.dataset.view.charAt(0).toUpperCase() + link.dataset.view.slice(1));
        }
    });
});

buscaForm.addEventListener("submit", async e => {
    e.preventDefault();
    const cpf = document.getElementById("buscaCpf").value.trim().replace(/\D/g, ''); 
    
    resetForms();
    showStatus("Buscando cliente e histórico...", "info");

    try {
        const res = await fetch(`${scriptURL}?action=buscarClienteCompleto&cpf=${encodeURIComponent(cpf)}`);
        const dados = await res.json();

        if (dados.erro === "Paciente não encontrado") {
            document.getElementById("cpfNaoEncontrado").textContent = cpf;
            document.getElementById("cCPF").value = cpf;
            alertaCadastroDiv.style.display = "block";
            cadastroForm.style.display = "block";
            document.getElementById("cNome").focus();
            showStatus("Cliente não encontrado. Preencha o cadastro RÁPIDO.", "info");
            return;
        } else if (dados.erro) {
            showStatus(dados.erro, "error");
            return;
        }

        const p = dados.paciente;
        const historico = dados.historico || [];
        const preco = parseFloat(p.preco_sessao || 0);
        const totalSessoesGeral = historico.length;
        const totalGeral = totalSessoesGeral * preco;
        
        const sessoesMes = dados.sessoesNoMes || 0;
        const totalMes = sessoesMes * preco;
        
        dadosPacienteDiv.style.display = "block";
        document.getElementById("pNome").textContent = p.nome;
        document.getElementById("pCPF").textContent = p.cpf;
        document.getElementById("pPreco").textContent = preco.toFixed(2);
        document.getElementById("pTratamento").textContent = p.tratamento || "Não informado";
        
        document.getElementById("pSessoesMes").textContent = sessoesMes;
        document.getElementById("pTotalMes").textContent = totalMes.toFixed(2);
        document.getElementById("pSessoesTotal").textContent = totalSessoesGeral;
        document.getElementById("pTotalGeral").textContent = totalGeral.toFixed(2);
        
        document.getElementById("nCPF").value = p.cpf;
        document.getElementById("data_sessao").valueAsDate = new Date(); 
        document.getElementById("anotacao").value = ""; 

        const historicoHTML = historico.map((h, index) => 
            `<p><b>Data: ${h.data_sessao} ${index === 0 ? '(Última Consulta)' : ''}</b><br>Anotação: ${h.anotacao || "(sem anotação)"}</p>`
        ).join("");
        document.getElementById("pHistorico").innerHTML = historicoHTML || "<p>Nenhum histórico de sessões encontrado.</p>";
        showStatus("Cliente carregado. Pronto para registrar nova sessão.", "success");

    } catch (error) {
        showStatus("Erro ao conectar com o servidor para buscar cliente.", "error");
        console.error("Erro na busca:", error);
    }
});

cadastroForm.addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    showStatus("Cadastrando cliente...", "info");

    try {
        const res = await fetch(scriptURL, { method: "POST", body: formData });
        const result = await res.json();
        
        if (result.sucesso) {
            showStatus("Cliente cadastrado! Carregando dados.", "success");
            buscaForm.dispatchEvent(new Event('submit')); 
        } else {
            showStatus(result.erro || "Erro desconhecido ao cadastrar cliente.", "error");
        }
    } catch (error) {
        showStatus("Falha na comunicação de rede ao cadastrar.", "error");
    }
});

novaSessaoForm.addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.set('compareceu', 'Sim'); 
    
    showStatus("Registrando sessão...", "info");

    try {
        const res = await fetch(scriptURL, { method: "POST", body: formData });
        const result = await res.json();
        
        if (result.sucesso) {
            showStatus("Sessão registrada com sucesso! Histórico atualizado.", "success");
            buscaForm.dispatchEvent(new Event('submit')); 
        } else {
            showStatus(result.erro || "Erro desconhecido ao registrar sessão.", "error");
        }
    } catch (error) {
        showStatus("Falha na comunicação de rede ao registrar sessão.", "error");
    }
});

// --- LISTAR TODOS OS PACIENTES ---
btnVerPacientes.addEventListener("click", async () => {
    resetForms();
    listaPacientesContainer.style.display = "block";
    showStatus("Carregando lista de clientes...", "info");
    try {
        const res = await fetch(`${scriptURL}?action=listarPacientes`);
        const dados = await res.json();

        if (dados.erro) {
            showStatus(dados.erro, "error");
            return;
        }

        if (dados.pacientes && dados.pacientes.length > 0) {
            listaPacientesUl.innerHTML = ""; // Limpa a lista
            dados.pacientes.forEach(p => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="#" data-cpf="${p.cpf}">${p.nome} (CPF: ${p.cpf})</a>`;
                listaPacientesUl.appendChild(li);
            });
            showStatus("Lista de clientes carregada.", "success");
        } else {
            listaPacientesUl.innerHTML = "<li>Nenhum cliente cadastrado ainda.</li>";
            showStatus("Nenhum cliente cadastrado ainda.", "info");
        }
    } catch (error) {
        showStatus("Erro ao carregar lista de clientes.", "error");
        console.error("Erro na lista:", error);
    }
});

listaPacientesUl.addEventListener("click", e => {
    if (e.target.tagName === "A") {
        e.preventDefault();
        const cpf = e.target.dataset.cpf;
        document.getElementById("buscaCpf").value = cpf; // Preenche a busca
        buscaForm.dispatchEvent(new Event('submit')); // Dispara a busca
        listaPacientesContainer.style.display = "none"; // Esconde a lista
    }
});

// --- RELATÓRIOS FINANCEIROS ---
filtroRelatorioForm.addEventListener('submit', async e => {
    e.preventDefault();
    await carregarRelatorioFinanceiro();
});

async function carregarRelatorioFinanceiro() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    if (!dataInicio || !dataFim) {
        showStatus("Por favor, selecione as datas de início e fim para o relatório.", "error", true);
        return;
    }
    
    showStatus("Gerando relatório financeiro...", "info", true);

    try {
        const res = await fetch(`${scriptURL}?action=gerarRelatorioFinanceiro&dataInicio=${dataInicio}&dataFim=${dataFim}`);
        const dados = await res.json();

        if (dados.erro) {
            showStatus(dados.erro, "error", true);
            return;
        }

        document.getElementById('rSessoesFiltradas').textContent = dados.totalSessoes;
        document.getElementById('rTotalFiltrado').textContent = dados.faturamentoTotal.toFixed(2);

        const tabelaBody = document.querySelector('#tabelaRelatorioMensal tbody');
        tabelaBody.innerHTML = ""; // Limpa a tabela

        if (dados.detalhesClientes && dados.detalhesClientes.length > 0) {
            dados.detalhesClientes.forEach(cliente => {
                const row = tabelaBody.insertRow();
                row.insertCell().textContent = cliente.nome;
                row.insertCell().textContent = cliente.numSessoes;
                row.insertCell().textContent = cliente.totalPagar.toFixed(2);
                
                const statusCell = row.insertCell();
                const statusSpan = document.createElement('span');
                statusSpan.textContent = cliente.status;
                statusSpan.classList.add('status-tag');
                statusSpan.classList.add(cliente.status === 'PAGO' ? 'status-pago' : 'status-pendente');
                statusCell.appendChild(statusSpan);

                const acaoCell = row.insertCell();
                if (cliente.status === 'PENDENTE') {
                    const btnMarcarPago = document.createElement('button');
                    btnMarcarPago.textContent = 'Marcar como Pago';
                    btnMarcarPago.style.cssText = 'padding: 8px 12px; font-size: 0.85em; margin: 0;';
                    btnMarcarPago.onclick = async () => {
                        showStatus(`Marcando pagamento para ${cliente.nome}...`, "info", true);
                        const marcado = await marcarPagamento(cliente.cpf, dataInicio, dataFim);
                        if (marcado) {
                             showStatus(`Pagamento de ${cliente.nome} marcado como PAGO.`, "success", true);
                             await carregarRelatorioFinanceiro(); // Recarrega o relatório
                        } else {
                             showStatus(`Erro ao marcar pagamento de ${cliente.nome}.`, "error", true);
                        }
                    };
                    acaoCell.appendChild(btnMarcarPago);
                } else {
                    acaoCell.textContent = '-'; // Ou "N/A"
                }
            });
            showStatus("Relatório financeiro gerado.", "success", true);
        } else {
            tabelaBody.innerHTML = '<tr><td colspan="5">Nenhum dado encontrado para o período.</td></tr>';
            showStatus("Nenhum dado encontrado para o período.", "info", true);
        }

    } catch (error) {
        showStatus("Erro ao gerar relatório: " + error.message, "error", true);
        console.error("Erro no relatório:", error);
    }
}

async function marcarPagamento(cpf, dataInicio, dataFim) {
    try {
        const res = await fetch(scriptURL, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'marcarPagamento',
                cpf: cpf,
                dataInicio: dataInicio,
                dataFim: dataFim
            })
        });
        const result = await res.json();
        return result.sucesso;
    } catch (error) {
        console.error("Erro ao chamar marcarPagamento:", error);
        return false;
    }
}

// Chama a função de autenticação ao carregar a página
window.onload = checkAuth;
