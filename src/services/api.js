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

/**
 * Instância central do Axios.
 *
 * No arquivo .env:
 *
 * VITE_API_URL=https://n8n-n8n-30edfb-178-253-250-81.sslip.io/webhook
 *
 * Se o Webhook do n8n tiver o Path "login",
 * a chamada final será:
 *
 * https://n8n-n8n-30edfb-178-253-250-81.sslip.io/webhook/login
 */

const api = axios.create({
baseURL:
    import.meta.env.VITE_API_URL ||
    "https://n8n-n8n-30edfb-178-253-250-81.sslip.io/webhook/c70d6833-25db-4bff-9796-377f3bc370a3",

  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Adiciona o token de autenticação automaticamente
 * nas requisições, caso exista.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@escola-musica:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Cadastra um novo participante.
 */
export async function cadastrarParticipante({
  nome,
  telefone,
  instrumento,
}) {
  try {
    const { data } = await api.post("/cadastro", {
      nome,
      telefone,
      instrumento,
    });

    return data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }

    throw error;
  }
}

/**
 * Lista todos os participantes cadastrados.
 */
export async function listarParticipantes() {
  const { data } = await api.get("/participantes");

  return data;
}

/**
 * Realiza o login do organizador.
 *
 * O n8n deve retornar algo como:
 *
 * {
 *   sucesso: true,
 *   mensagem: "Login realizado com sucesso",
 *   usuario: {
 *     id: 1,
 *     nome: "Carlos",
 *     email: "carlos@gmail.com"
 *   }
 * }
 *
 * ou:
 *
 * {
 *   sucesso: false,
 *   mensagem: "E-mail ou senha inválidos"
 * }
 */
export async function login({ email, senha }) {
  const { data } = await api.post("/login", {
    email,
    senha,
  });

  console.log("Resposta recebida do n8n:", data);

  return data;
}

/**
 * Executa o sorteio.
 */
export async function sortear({ ignorarGanhadores }) {
  const { data } = await api.post("/sortear", {
    ignorarGanhadores,
  });

  return data;
}

/**
 * Retorna o histórico de sorteios.
 */
export async function buscarHistorico() {
  const { data } = await api.get("/historico");

  return data;
}

export default api;

