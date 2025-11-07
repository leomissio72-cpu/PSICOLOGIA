<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consulta de Pacientes</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f7fb;
      padding: 30px;
    }
    h1 { text-align: center; color: #333; }
    form, .dados {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      max-width: 600px;
      margin: 20px auto;
    }
    h2, h3 { color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px; }
    label { display: block; margin-top: 15px; font-weight: bold; color: #555; }
    input, textarea, button {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
    }
    button {
      background: #28a745; /* Cor verde para ação de salvar */
      color: white;
      border: none;
      cursor: pointer;
      margin-top: 20px;
      transition: background 0.3s;
    }
    #buscaForm button {
      background: #007bff; /* Cor azul para ação de buscar */
    }
    button:hover { background: #0056b3; }
    .historico { background: #f8f9fa; padding: 15px; margin-top: 15px; border-radius: 8px; border: 1px solid #eee; }
    .historico p { margin: 5px 0; border-bottom: 1px dotted #ccc; padding-bottom: 5px; }
    .historico p:last-child { border-bottom: none; }
    #mensagem { margin-top: 15px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Consulta e Cadastro de Pacientes</h1>

  <form id="buscaForm">
    <label>Buscar paciente pelo nome:</label>
    <input type="text" id="buscaNome" required placeholder="Digite o nome completo">
    <button type="submit">Buscar</button>
  </form>

  <div id="dadosPaciente" class="dados" style="display:none;">
    <h2>Dados do Paciente</h2>
    <p><b>Nome:</b> <span id="pNome"></span></p>
    <p><b>CPF:</b> <span id="pCPF"></span></p>
    <p><b>Tratamento:</b> <span id="pTratamento"></span></p>
    <p><b>Preço da Sessão:</b> R$ <span id="pPreco"></span></p>
    <p><b>Sessões neste mês:</b> <span id="pSessoes"></span></p>
    <p><b>Total no mês:</b> R$ <span id="pTotal"></span></p>

    <h3>Histórico de Sessões</h3>
    <div id="pHistorico" class="historico"></div>

    <h3>Registrar Nova Sessão</h3>
    <form id="novaSessao">
      <input type="hidden" name="nome" id="nNome">
      <input type="hidden" name="cpf" id="nCPF">
      <input type="hidden" name="data_nascimento" id="nNasc">
      <input type="hidden" name="tratamento" id="nTrat">
      <input type="hidden" name="preco" id="nPreco">

      <label>Data da Sessão:</label>
      <input type="date" name="data_sessao" required>

      <label>Anotação (Opcional):</label>
      <textarea name="anotacao" rows="3" placeholder="Anotações da sessão..."></textarea>

      <button type="submit">Salvar Sessão</button>
    </form>
    <p id="mensagem"></p>
  </div>

  <script>
    // LINK FINAL DO SEU GOOGLE APPS SCRIPT
    const scriptURL = "https://script.google.com/macros/s/AKfycbxwiOvj9ffd8Tn2SA0CaATKduzRocduv9Cd6pwdwrVGzDuaScc-2qpTc2_XLF7PkyrX/exec";

    // Função para buscar paciente
    document.getElementById("buscaForm").addEventListener("submit", async e => {
      e.preventDefault();
      const nome = document.getElementById("buscaNome").value.trim();
      if (!nome) return;

      document.getElementById("dadosPaciente").style.display = "none";
      document.getElementById("pHistorico").innerHTML = "Buscando...";

      try {
        const res = await fetch(`${scriptURL}?nome=${encodeURIComponent(nome)}`);
        const dados = await res.json();

        if (dados.erro) {
          alert(dados.erro);
          document.getElementById("pHistorico").innerHTML = "";
          return;
        }

        const p = dados.paciente;
        document.getElementById("dadosPaciente").style.display = "block";
        document.getElementById("pNome").textContent = p.nome;
        document.getElementById("pCPF").textContent = p.cpf;
        document.getElementById("pTratamento").textContent = p.tratamento;
        document.getElementById("pPreco").textContent = parseFloat(p.preco).toFixed(2);
        document.getElementById("pSessoes").textContent = dados.sessoesNoMes;
        document.getElementById("pTotal").textContent = parseFloat(dados.totalMes).toFixed(2);

        // Preencher campos escondidos para o formulário de nova sessão
        document.getElementById("nNome").value = p.nome;
        document.getElementById("nCPF").value = p.cpf;
        document.getElementById("nNasc").value = p.data_nascimento;
        document.getElementById("nTrat").value = p.tratamento;
        document.getElementById("nPreco").value = p.preco;

        // Montar Histórico
        const historicoHTML = dados.historico.map(h => 
          `<p><b>${h.data_sessao}</b>: ${h.anotacao || "(sem anotação)"}</p>`
        ).join("");
        document.getElementById("pHistorico").innerHTML = historicoHTML || "<p>Nenhum histórico encontrado.</p>";
      } catch (error) {
        alert("Erro ao conectar com o servidor.");
        document.getElementById("pHistorico").innerHTML = "";
      }
    });

    // Função para salvar nova sessão
    document.getElementById("novaSessao").addEventListener("submit", async e => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      formData.append("acao", "registrarSessao"); // Nome da ação para o Apps Script

      const msg = document.getElementById("mensagem");
      msg.textContent = "Enviando...";
      msg.style.color = "blue";

      try {
        const res = await fetch(scriptURL, { method: "POST", body: formData });
        if (res.ok) {
          const result = await res.json();
          if (result.sucesso) {
            msg.textContent = "Sessão registrada com sucesso!";
            msg.style.color = "green";
            form.reset();
          } else {
            msg.textContent = result.erro || "Erro desconhecido ao registrar sessão.";
            msg.style.color = "red";
          }
        } else {
          msg.textContent = "Erro de conexão com o servidor.";
          msg.style.color = "red";
        }
      } catch (error) {
        msg.textContent = "Falha na comunicação de rede.";
        msg.style.color = "red";
      }
    });
  </script>
</body>
</html>
