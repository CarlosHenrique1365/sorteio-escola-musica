import axios from "axios";

/**
 * Instância central do Axios.
 * Configure VITE_API_URL no seu .env apontando para o webhook do n8n.
 * Ex: VITE_API_URL=https://seu-n8n.exemplo.com/webhook
 */
/**
 * Instância central do Axios.
 * Configure VITE_API_URL no seu .env apontando para o webhook do n8n.
 * Ex: VITE_API_URL=https://seu-n8n.exemplo.com/webhook
 *
 * IMPORTANTE: o path do node Webhook no n8n foi configurado como "cadastro"
 * (sem UUID, sem "webhook-test" duplicado). A URL final chamada é:
 *   {baseURL}/cadastro
 * Então a baseURL deve terminar em ".../webhook" (produção) ou
 * ".../webhook-test" (enquanto testa no editor do n8n) — nunca os dois juntos.
 */
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://n8n-n8n-30edfb-178-253-250-81.sslip.io/webhook-test/c70d6833-25db-4bff-9796-377f3bc370a3/webhook-test",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Anexa o token salvo (login do organizador) em toda requisição, se existir.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@escola-musica:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Cadastra um novo participante.
 *
 * Retorna sempre um objeto (nunca undefined), com dois formatos possíveis:
 *  - Sucesso:        { sucesso: true,  cadastrado: false, numero, nome, mensagem }
 *  - Já cadastrado:  { sucesso: false, cadastrado: true,  numero, nome, mensagem }
 *
 * O componente que chamar essa função deve checar `data.cadastrado`
 * para saber se é um cadastro novo ou uma tentativa duplicada.
 */
export async function cadastrarParticipante({ nome, telefone, instrumento }) {
  try {
    const { data } = await api.post("/cadastro", { nome, telefone, instrumento });
    return data;
  } catch (error) {
    // Se o n8n respondeu com um status de erro (ex.: 400) mas ainda
    // assim mandou um corpo JSON (ex.: telefone já cadastrado),
    // usamos esse corpo em vez de deixar a exception estourar como undefined.
    if (error.response?.data) {
      return error.response.data;
    }
    // Erro de rede real (sem resposta do servidor) — repropaga para o
    // componente tratar (ex.: mostrar "sem conexão com o servidor").
    throw error;
  }
}

/** Lista todos os participantes cadastrados. */
export async function listarParticipantes() {
  const { data } = await api.get("/participantes");
  return data;
}

/** Autentica o organizador. Retorna { token, nome }. */
export async function login({ email, senha }) {
  const { data } = await api.post("/login", { email, senha });
  return data;
}

/** Executa o sorteio. Retorna o vencedor: { numero, nome, telefone }. */
export async function sortear({ ignorarGanhadores }) {
  const { data } = await api.post("/sortear", { ignorarGanhadores });
  return data;
}

/**
 * Retorna o histórico de sorteios, mais recente primeiro.
 * Cada item deve ter o formato: { numero, nome, telefone, sorteadoEm }
 * — "sorteadoEm" é uma string ISO 8601, usada pelo HistoryTable para exibir data e hora.
 */
export async function buscarHistorico() {
  const { data } = await api.get("/historico");
  return data;
}

export default api;