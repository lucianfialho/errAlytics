# errAlytics

[![npm version](https://img.shields.io/npm/v/err-alytics.svg)](https://www.npmjs.com/package/err-alytics) [![License: MIT](https://img.shields.io/npm/l/err-alytics.svg)](LICENSE)

**errAlytics** é uma biblioteca leve e flexível para rastrear erros HTTP no navegador. Ela realiza uma requisição HEAD para a URL especificada (ou para a URL atual) e dispara eventos analíticos para ferramentas como o Google Tag Manager (via dataLayer – padrão) ou via gtag, conforme sua configuração.

## Recursos

- **Monitoramento de Erros HTTP**: Suporte para códigos de status comuns, como 400, 401, 403, 404, 408, 429, 500, 502, 503 e 504.
- **Disparo de Eventos Analíticos**: Integração simples para disparar eventos no `dataLayer` (padrão) ou via `gtag`.
- **Configuração Personalizável**: Permite sobrescrever o método de rastreamento e customizar os eventos disparados para cada código HTTP.
- **Compatibilidade UMD**: Bundle gerado em formato UMD para uso em ambientes com módulos (ES/CommonJS) e via CDN.

## Instalação

### Via npm

```bash
npm install err-alytics
```

```bash
pnpm add err-alytics
```

## Uso
Em um Projeto com Módulos (ES6/Node)
Importe a classe e instancie-a, passando (opcionalmente) sua configuração personalizada. Por padrão, o método de rastreamento é o dataLayer.

```javascript
import ErrAlytics from 'err-alytics';

const tracker = new ErrAlytics({
  // A configuração padrão já abrange:
  // 400: bad_request, 401: unauthorized, 403: forbidden, 404: page_not_found, 408: request_timeout,
  // 429: too_many_requests, 500: server_error, 502: bad_gateway, 503: service_unavailable, 504: gateway_timeout
  // Você pode sobrescrever ou adicionar novas configurações se necessário.
});

// Rastreia a URL atual (ou passe outra URL como parâmetro)
tracker.track().then((response) => {
  console.log('Status verificado:', response.status);
});
```

## Usando via CDN

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Exemplo errAlytics via CDN</title>
  <!-- Inclua o bundle UMD da lib -->
  <script src="https://unpkg.com/err-alytics@1.0.0/dist/http-error-tracker.umd.js"></script>
</head>
<body>
  <script>
    // A lib estará disponível globalmente como HttpErrorTracker
    const tracker = new HttpErrorTracker({
      // Para usar gtag em vez de dataLayer, basta alterar:
      // trackingMethod: 'gtag'
    });
    tracker.track();
  </script>
</body>
</html>
```

## TODO
[] Monitoramento de Erros JavaScript: Implementar uma camada adicional que capture erros JavaScript globais (por exemplo, via window.onerror ou window.addEventListener('error')) e dispare eventos analíticos, integrando essa funcionalidade à lib.