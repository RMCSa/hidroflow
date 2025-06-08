# Plano de Melhorias para Exibição Mobile e Estilo do Frontend

O objetivo é adequar toda a exibição para telas mobile e aplicar melhorias no estilo do frontend, incluindo cards de planta mais interativos e modernos, um layout responsivo e uma melhor apresentação das informações na página de cada planta.

## 1. Melhorias no Layout Responsivo Geral ([`src/components/Layout.tsx`](src/components/Layout.tsx:1))

*   **Barra de Navegação (`AppBar`) para Mobile:**
    *   Em telas menores (ex: `xs`, `sm`), os botões de navegação "Home" e "Dashboard" exibirão apenas ícones (ex: `HomeIcon`, `DashboardIcon`).
    *   Em telas menores, a saudação ao usuário e o botão "Sair" (e possivelmente "Dashboard") serão agrupados sob um `IconButton` (ex: `AccountCircleIcon`) que abre um `Menu` do Material-UI.
    *   O botão "Login / Registrar" será substituído por um ícone (ex: `LoginIcon`) em telas menores.
    *   Utilizar `useMediaQuery` para alternar entre as exibições.

## 2. Melhorias nos Cards de Planta ([`src/features/plant/PlantCard.tsx`](src/features/plant/PlantCard.tsx:1))

*   **Estrutura e Estilo do Card:**
    *   Adicionar ícone de planta (ex: `SpaIcon` ou `GrassIcon`) no cabeçalho.
    *   Implementar efeitos de `hover` (sombra sutil, transição suave).
    *   Ajustar espaçamentos internos para um visual moderno e limpo.
*   **Exibição de Status da Planta:**
    *   Integrar o hook `useMqtt` para obter `espStatus` e `lastData` (contendo `humidity_state`).
    *   Exibir `espStatus` visualmente (ex: círculo colorido – verde/Online, vermelho/Offline, cinza/Aguardando).
    *   Exibir `humidity_state` textualmente (ex: "Umidade: Seca").
*   **Responsividade do Card:**
    *   Garantir que o conteúdo se ajuste bem em larguras menores.

## 3. Melhorias na Página do Dashboard ([`src/pages/DashboardPage.tsx`](src/pages/DashboardPage.tsx:1))

*   **Formulário "Adicionar Nova Planta":**
    *   Apresentar como `Dialog` (Modal) do Material-UI em todas as telas para consistência e melhor experiência mobile.
*   **Layout da Grade de Cards:**
    *   Manter a lógica de largura responsiva existente para os cards.
    *   Revisar e ajustar o espaçamento (`spacing`) entre os cards em diferentes tamanhos de tela para otimizar a visualização.

## 4. Aprimoramento da Exibição na Página da Planta ([`src/pages/PlantPage.tsx`](src/pages/PlantPage.tsx:1) e [`src/components/StatusCard.tsx`](src/components/StatusCard.tsx:1))

*   **Alertas de Conexão ([`src/pages/PlantPage.tsx`](src/pages/PlantPage.tsx:1)):**
    *   Garantir que os alertas de status do Broker MQTT e do Dispositivo ESP32 sejam claramente visíveis e compreensíveis em telas mobile. Avaliar se o layout atual com `Stack` horizontal em telas maiores e vertical em menores é o ideal ou se podem ser mais compactos/empilhados de forma diferente em `xs`.
*   **Cards de Status ([`src/components/StatusCard.tsx`](src/components/StatusCard.tsx:1)):**
    *   **Responsividade Interna:**
        *   Em telas muito pequenas (`xs`), considerar alterar o `flexDirection` interno do `StatusCard` para `column` para que o ícone e título fiquem acima do valor e subtexto, otimizando o espaço vertical.
        *   Ajustar o `padding` interno (ex: o `pl: "44px"`) condicionalmente para telas menores se o layout interno mudar.
    *   **Tipografia:** Ajustar os tamanhos das fontes (`variant="h4"` para valor, `variant="h6"` para título) nos `StatusCard`s para melhor legibilidade e uso do espaço em mobile.
    *   **Estilo Visual:** Manter a borda lateral colorida, garantindo que o design seja coeso com o restante das modernizações.
*   **Título da Página:**
    *   Garantir que o título "Monitor da Planta: {plantId}" seja bem exibido e não quebre em telas menores.

## 5. Ajustes no Tema e Estilos Globais ([`src/lib/theme.ts`](src/lib/theme.ts:1)) (Conforme Necessário)

*   Definir ou ajustar cores no tema para os novos indicadores de status (Online, Offline, Aguardando, níveis de umidade) se as cores padrão não forem suficientes.
*   Revisar `borderRadius` e `boxShadow` para consistência no design "moderno".

## Diagrama de Fluxo de Componentes (Consolidado):

```mermaid
graph TD
    App[App.tsx] --> Layout[components/Layout.tsx]
    Layout -- contém --> AppBarResponsive[AppBar Responsiva]
    AppBarResponsive -- mobile --> NavIcons[Ícones Navegação Mobile]
    AppBarResponsive -- mobile --> UserMenu[Menu Usuário Mobile]

    Layout --> PageContent{Conteúdo da Página}
    PageContent --> DashboardPage[pages/DashboardPage.tsx]
    PageContent --> PlantPage[pages/PlantPage.tsx]

    DashboardPage -- exibe múltiplos --> PlantCard[features/plant/PlantCard.tsx]
    PlantCard -- usa hook --> useMqttHook[hooks/useMqtt.ts]
    DashboardPage -- abre --> AddPlantDialog[Dialog Adicionar Planta]

    PlantPage -- usa hook --> useMqttHook
    PlantPage -- exibe --> ConnectionAlerts[Alertas de Conexão]
    PlantPage -- exibe múltiplos --> StatusCard[components/StatusCard.tsx]

    subgraph "Estrutura Geral"
        App
        Layout
        AppBarResponsive
        NavIcons
        UserMenu
    end

    subgraph "Dashboard"
        DashboardPage
        PlantCard
        AddPlantDialog
    end

    subgraph "Página da Planta"
        PlantPage
        ConnectionAlerts
        StatusCard
    end

    subgraph "Lógica Compartilhada"
        useMqttHook
    end