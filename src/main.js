// src/index.js

class ErrAlytics {
    /**
     * Cria uma instância do ErrAlytics.
     * @param {Object} config - Configurações da lib.
     * Exemplo de configuração:
     * {
     *   trackingMethod: 'gtag' | 'dataLayer', // método de disparo, default é 'dataLayer'
     *   events: {
     *     400: { eventName: 'bad_request', data: { message: 'Dados inválidos enviados' } },
     *     401: { eventName: 'unauthorized', data: { message: 'Acesso não autorizado' } },
     *     403: { eventName: 'forbidden', data: { message: 'Acesso proibido' } },
     *     404: { eventName: 'page_not_found', data: { invalid_path: window.location.pathname } },
     *     408: { eventName: 'request_timeout', data: { message: 'Tempo de requisição excedido' } },
     *     429: { eventName: 'too_many_requests', data: { message: 'Muitas requisições' } },
     *     500: { eventName: 'server_error', data: { message: 'Erro no servidor' } },
     *     502: { eventName: 'bad_gateway', data: { message: 'Gateway inválido' } },
     *     503: { eventName: 'service_unavailable', data: { message: 'Serviço indisponível' } },
     *     504: { eventName: 'gateway_timeout', data: { message: 'Gateway expirou' } },
     *   }
     * }
     */
    constructor(config = {}) {
      const defaultConfig = {
        trackingMethod: 'dataLayer', // padrão: dataLayer
        events: {
          400: { eventName: 'bad_request', data: { message: 'Dados inválidos enviados' } },
          401: { eventName: 'unauthorized', data: { message: 'Acesso não autorizado' } },
          403: { eventName: 'forbidden', data: { message: 'Acesso proibido' } },
          404: { eventName: 'page_not_found', data: { invalid_path: window.location.pathname } },
          408: { eventName: 'request_timeout', data: { message: 'Tempo de requisição excedido' } },
          429: { eventName: 'too_many_requests', data: { message: 'Muitas requisições' } },
          500: { eventName: 'server_error', data: { message: 'Erro no servidor' } },
          502: { eventName: 'bad_gateway', data: { message: 'Gateway inválido' } },
          503: { eventName: 'service_unavailable', data: { message: 'Serviço indisponível' } },
          504: { eventName: 'gateway_timeout', data: { message: 'Gateway expirou' } },
        },
      };
      this.config = Object.assign(defaultConfig, config);
    }
  
    /**
     * Realiza uma requisição HEAD para a URL informada e dispara o evento configurado caso o status corresponda.
     * @param {string} [url=window.location.href] URL a ser verificada.
     * @returns {Promise<Response>}
     */
    track(url = window.location.href) {
      return fetch(url, { method: 'HEAD' })
        .then((response) => {
          const status = response.status;
          if (this.config.events[status]) {
            const { eventName, data } = this.config.events[status];
            if (this.config.trackingMethod === 'gtag') {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', eventName, data || {});
              } else {
                console.warn('gtag não está definido.');
              }
            } else if (this.config.trackingMethod === 'dataLayer') {
              if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                  event: eventName,
                  ...data,
                });
              } else {
                console.warn('dataLayer não está definido.');
              }
            } else {
              console.warn(`Método de rastreamento "${this.config.trackingMethod}" não suportado.`);
            }
          }
          return response;
        })
        .catch((err) => {
          console.error('Erro ao verificar a URL:', err);
        });
    }
  }
  
  export default ErrAlytics;
  