# 🎣 Pescaria Pixel

**Pescaria Pixel** é um jogo de pesca single-player para navegador, focado em progressão, melhorias e uma mecânica ativa inspirada em *Stardew Valley* e *My Time at Portia*.

O jogo foi desenvolvido utilizando apenas **HTML, CSS e JavaScript**, sem dependências de backend, com salvamento local via `localStorage`.

---

## 🕹️ Sobre o Jogo

Você controla um pescador que navega por diferentes áreas do mapa, pesca peixes de raridades variadas, vende sua carga e investe em melhorias para avançar cada vez mais longe no oceano.

O loop principal consiste em:

1. Escolher uma área no mapa
2. Viajar até o local
3. Procurar peixes
4. Realizar a mecânica ativa de pesca
5. Armazenar os peixes no barco
6. Vender os peixes
7. Evoluir equipamentos e bônus

---

## ⚙️ Mecânicas Principais

### 🎣 Mecânica de Pesca
- Barra de precisão vertical
- Peixe se movimenta dinamicamente
- Progresso aumenta ao manter o peixe dentro da zona de captura
- Falhas reduzem o progresso
- Dificuldade varia conforme o peixe

### 🗺️ Mapa de Navegação
- Áreas progressivas
- Tempo de viagem variável
- Diferentes dificuldades e espécies
- Interface visual com nós interativos

### 🐟 Peixes e Raridade
- Comum
- Incomum
- Raro
- Lendário

Cada peixe possui:
- Valor
- Dificuldade
- Profundidade mínima
- Raridade

---

## 🚤 Progressão

### Vara de Pesca
- **Profundidade**: libera novos peixes
- **Estabilidade**: facilita a mecânica
- **Isca**: aumenta chances de raridade

### Barco
- **Capacidade**: quantidade máxima de peixes
- **Velocidade**: reduz tempo de viagem
- **Sonar**: reduz tempo de busca

### Bônus (Roguelike)
- Redução de tempo
- Bônus de XP
- Aumento no valor de venda
- Maior chance de peixes raros

---

## 💾 Salvamento

O progresso é salvo automaticamente no navegador usando:

```
localStorage
```

O jogo pode ser resetado pelas configurações.

---

## 📁 Estrutura do Projeto

```
/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── menu.png
│   └── 2.png
└── README.md
```

---

## 🖥️ Controles

### Desktop
- Clique do mouse para interações
- Segurar botão para a mecânica de pesca

### Mobile
- Toque na tela
- Suporte a eventos modernos (`pointer events`)

---

## 🚀 Como Executar

1. Baixe ou clone o repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Pronto! Nenhuma instalação adicional é necessária

---

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- TailwindCSS (via CDN)
- Google Fonts
- Material Symbols

---

## 📌 Observações

- Projeto focado em prototipagem e aprendizado
- Código todo em um único fluxo (sem build tools)
- Ideal para expandir com:
  - Novos mapas
  - Novos peixes
  - Eventos especiais
  - Sons e música

---

## 📄 Licença

Uso livre para estudos, protótipos e projetos pessoais.
