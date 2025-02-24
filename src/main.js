/**
 * Classe para rastreamento de erros HTTP usando diferentes métodos de rastreamento.
 * 
 * @class
 * @param {Object} [config={}] - Configuração personalizada para a instância do ErrAlytics.
 * @param {string} [config.trackingMethod="dataLayer"] - Método de rastreamento a ser utilizado ("dataLayer" ou "gtag").
 * @param {Object} [config.events] - Mapeamento de códigos de status HTTP para eventos personalizados.
 * @param {Object} [config.events.400] - Evento para código de status 400 (Bad Request).
 * @param {Object} [config.events.401] - Evento para código de status 401 (Unauthorized).
 * @param {Object} [config.events.403] - Evento para código de status 403 (Forbidden).
 * @param {Object} [config.events.404] - Evento para código de status 404 (Not Found).
 * @param {Object} [config.events.408] - Evento para código de status 408 (Request Timeout).
 * @param {Object} [config.events.429] - Evento para código de status 429 (Too Many Requests).
 * @param {Object} [config.events.500] - Evento para código de status 500 (Internal Server Error).
 * @param {Object} [config.events.502] - Evento para código de status 502 (Bad Gateway).
 * @param {Object} [config.events.503] - Evento para código de status 503 (Service Unavailable).
 * @param {Object} [config.events.504] - Evento para código de status 504 (Gateway Timeout).
 * 
 * @example
 * const errAlytics = new ErrAlytics({
 *   trackingMethod: "gtag",
 *   events: {
 *     404: { eventName: "pagina_nao_encontrada", data: { caminho_invalido: window.location.pathname } },
 *   },
 * });
 * 
 * errAlytics.track();
 */
class ErrAlytics {
  constructor(config = {}) {
    const defaultConfig = {
      trackingMethod: "dataLayer",
      events: {
        400: { eventName: "bad_request", data: { message: "Dados inválidos enviados" } },
        401: { eventName: "unauthorized", data: { message: "Acesso não autorizado" } },
        403: { eventName: "forbidden", data: { message: "Acesso proibido" } },
        404: { eventName: "page_not_found", data: { invalid_path: window.location.pathname } },
        408: { eventName: "request_timeout", data: { message: "Tempo de requisição excedido" } },
        429: { eventName: "too_many_requests", data: { message: "Muitas requisições" } },
        500: { eventName: "server_error", data: { message: "Erro no servidor" } },
        502: { eventName: "bad_gateway", data: { message: "Gateway inválido" } },
        503: { eventName: "service_unavailable", data: { message: "Serviço indisponível" } },
        504: { eventName: "gateway_timeout", data: { message: "Gateway expirou" } },
      },
    };
    this.config = Object.assign(defaultConfig, config);
  }

  /**
   * Tracks the given URL using the specified tracking method.
   *
   * @param {string} [url=window.location.href] - The URL to track. Defaults to the current window location.
   * @returns {Promise<Response>} - A promise that resolves to the fetch response.
   *
   * @example
   * // Example usage:
   * track("https://example.com")
   *   .then(response => {
   *     console.log("Tracking successful:", response);
   *   })
   *   .catch(err => {
   *     console.error("Tracking failed:", err);
   *   });
   *
   * @throws {Error} - Throws an error if the fetch request fails.
   */
  track(url = window.location.href) {
    return fetch(url, { method: "HEAD" })
      .then((response) => {
        const status = response.status;
        if (this.config.events[status]) {
          const { eventName, data } = this.config.events[status];
          if (this.config.trackingMethod === "gtag") {
            if (typeof window !== "undefined" && window.gtag) {
              window.gtag("event", eventName, data || {});
            } else {
              console.warn("gtag não está definido.");
            }
          } else if (this.config.trackingMethod === "dataLayer") {
            if (typeof window !== "undefined" && window.dataLayer) {
              window.dataLayer.push({
                event: eventName,
                ...data,
              });
            } else {
              console.warn("dataLayer não está definido.");
            }
          } else {
            console.warn(`Método de rastreamento "${this.config.trackingMethod}" não suportado.`);
          }
        }
        return response;
      })
      .catch((err) => {
        console.error("Erro ao verificar a URL:", err);
      });
  }
}

// Expor a classe no escopo global para uso via CDN
if (typeof window !== "undefined") {
  window.ErrAlytics = ErrAlytics;
}

// Exportação para suportar CommonJS e ES Module
export default ErrAlytics;
