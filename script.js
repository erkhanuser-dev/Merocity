document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // MEROCITY — SCRIPT
    // ЧАСТЬ 1/4
    // =========================================================

    const SAVE_KEY = "merocity-save-v4";

    // =========================================================
    // СОСТОЯНИЕ ИГРЫ
    // =========================================================

    const defaultState = {
        turn: 1,
        maxTurns: 20,

        money: 1200,

        metrics: {
            happiness: 60,
            ecology: 55,
            mobility: 50,
            education: 45,
            health: 50,
            economy: 55
        },

        population: 120000,

        projects: {},

        news: [
            {
                turn: 1,
                text: "Вы вступили в должность акима города."
            }
        ],

        started: false,
        eventOpen: false,
        gameOver: false
    };

    let state = JSON.parse(JSON.stringify(defaultState));


    // =========================================================
    // ПРОЕКТЫ
    // =========================================================

    const PROJECTS = {

        park: {
            id: "park",
            name: "Городской парк",
            icon: "🌳",
            costs: [70, 45, 60],
            income: 2,

            effects: {
                ecology: 7,
                happiness: 6
            },

            position: [115, 330]
        },

        school: {
            id: "school",
            name: "Школа",
            icon: "🏫",
            costs: [100, 65, 90],
            income: 1,

            effects: {
                education: 9,
                happiness: 3
            },

            position: [230, 150]
        },

        hospital: {
            id: "hospital",
            name: "Больница",
            icon: "🏥",
            costs: [130, 80, 110],
            income: 1,

            effects: {
                health: 10,
                happiness: 5
            },

            position: [580, 150]
        },

        metro: {
            id: "metro",
            name: "Метро",
            icon: "🚇",
            costs: [250, 150, 200],
            income: 5,

            effects: {
                mobility: 15,
                economy: 5,
                happiness: 4
            },

            position: [330, 410]
        },

        recycling: {
            id: "recycling",
            name: "Центр переработки",
            icon: "♻️",
            costs: [90, 60, 80],
            income: 3,

            effects: {
                ecology: 12,
                economy: 2
            },

            position: [620, 420]
        },

        solar: {
            id: "solar",
            name: "Солнечная электростанция",
            icon: "☀️",
            costs: [180, 110, 150],
            income: 9,

            effects: {
                ecology: 10,
                economy: 7
            },

            position: [700, 300]
        },

        market: {
            id: "market",
            name: "Городской рынок",
            icon: "🏪",
            costs: [80, 55, 75],
            income: 12,

            effects: {
                economy: 8,
                happiness: 3
            },

            position: [220, 400]
        },

        housing: {
            id: "housing",
            name: "Жилой комплекс",
            icon: "🏢",
            costs: [160, 100, 140],
            income: 16,

            effects: {
                economy: 6,
                happiness: 4,
                mobility: -3
            },

            position: [530, 100]
        },

        bike: {
            id: "bike",
            name: "Велодорожки",
            icon: "🚲",
            costs: [60, 40, 55],
            income: 1,

            effects: {
                mobility: 8,
                ecology: 6,
                health: 3
            },

            position: [410, 500]
        },

        water: {
            id: "water",
            name: "Очистка воды",
            icon: "💧",
            costs: [120, 75, 100],
            income: 2,

            effects: {
                ecology: 9,
                health: 8
            },

            position: [690, 500]
        },

        university: {
            id: "university",
            name: "Университет",
            icon: "🎓",
            costs: [280, 180, 230],
            income: 10,

            effects: {
                education: 15,
                economy: 10
            },

            position: [90, 180]
        },

        stadium: {
            id: "stadium",
            name: "Стадион",
            icon: "🏟️",
            costs: [200, 120, 160],
            income: 10,

            effects: {
                happiness: 9,
                health: 5,
                economy: 5
            },

            position: [500, 520]
        },

        tourism: {
            id: "tourism",
            name: "Туристический комплекс",
            icon: "🏨",
            costs: [220, 140, 190],
            income: 20,

            effects: {
                economy: 14,
                happiness: 5,
                ecology: -3
            },

            position: [720, 100]
        }
    };


    // =========================================================
    // СОБЫТИЯ
    // =========================================================

    const EVENTS = [

        {
            id: "eco",
            type: "bad",

            tag: "ЭКОЛОГИЯ",
            icon: "🌫️",

            title: "Экологический кризис",

            description:
                "В городе резко ухудшилось качество воздуха. Жители требуют срочных действий.",

            choices: [
                {
                    text: "Выделить 50 ₸ на решение проблемы",
                    cost: 50,

                    effects: {
                        ecology: 12,
                        happiness: 4
                    },

                    news:
                        "Город выделил средства на борьбу с загрязнением."
                },

                {
                    text: "Ничего не делать",
                    effects: {
                        ecology: -12,
                        happiness: -6
                    },

                    news:
                        "Власти решили не вмешиваться в экологический кризис."
                }
            ]
        },


        {
            id: "traffic",
            type: "bad",

            tag: "ТРАНСПОРТ",
            icon: "🚗",

            title: "Транспортный коллапс",

            description:
                "На главных улицах образовались огромные пробки. Горожане требуют решения.",

            choices: [
                {
                    text: "Потратить 70 ₸ на регулирование движения",
                    cost: 70,

                    effects: {
                        mobility: 12,
                        economy: 3
                    },

                    news:
                        "Город направил средства на борьбу с пробками."
                },

                {
                    text: "Временно изменить движение",
                    effects: {
                        mobility: 7,
                        happiness: 3
                    },

                    news:
                        "В городе временно изменили схему движения."
                },

                {
                    text: "Ничего не делать",
                    effects: {
                        mobility: -10,
                        happiness: -7
                    },

                    news:
                        "Проблема с пробками осталась нерешённой."
                }
            ]
        },


        {
            id: "health",
            type: "bad",

            tag: "ЗДРАВООХРАНЕНИЕ",
            icon: "🏥",

            title: "Вспышка заболевания",

            description:
                "В городе увеличилось количество заболевших. Медицинская система испытывает нагрузку.",

            choices: [
                {
                    text: "Выделить 60 ₸ больницам",
                    cost: 60,

                    effects: {
                        health: 12,
                        happiness: 5
                    },

                    news:
                        "Город дополнительно профинансировал больницы."
                },

                {
                    text: "Ничего не делать",
                    effects: {
                        health: -12,
                        happiness: -8
                    },

                    news:
                        "Медицинская система города столкнулась с серьёзными проблемами."
                }
            ]
        },


        {
            id: "tourism",
            type: "neutral",

            tag: "ТУРИЗМ",
            icon: "🧳",

            title: "Туристический сезон",

            description:
                "В город приехало больше туристов. У города есть возможность заработать, но инфраструктура получит дополнительную нагрузку.",

            choices: [
                {
                    text: "Инвестировать 40 ₸ в туристическую инфраструктуру",
                    cost: 40,

                    effects: {
                        economy: 10,
                        happiness: 4
                    },

                    news:
                        "Город вложился в развитие туристической инфраструктуры."
                },

                {
                    text: "Принять туристов без дополнительных вложений",

                    money: 70,

                    effects: {
                        economy: 3,
                        happiness: -5
                    },

                    news:
                        "Туристы принесли городу дополнительный доход."
                }
            ]
        },


        {
            id: "investor",
            type: "good",

            tag: "ЭКОНОМИКА",
            icon: "💼",

            title: "Инвестор заинтересовался городом",

            description:
                "Крупный инвестор предлагает вложиться в экономику города.",

            choices: [
                {
                    text: "Принять предложение",

                    money: 100,

                    effects: {
                        economy: 12
                    },

                    news:
                        "Крупный инвестор вложил деньги в город."
                },

                {
                    text: "Отказаться",

                    effects: {
                        economy: -2
                    },

                    news:
                        "Город отказался от предложения инвестора."
                }
            ]
        },


        {
            id: "festival",
            type: "good",

            tag: "ГОРОДСКАЯ ЖИЗНЬ",
            icon: "🎉",

            title: "Городской фестиваль",

            description:
                "Жители предлагают провести большой городской фестиваль.",

            choices: [
                {
                    text: "Потратить 35 ₸ на фестиваль",
                    cost: 35,

                    effects: {
                        happiness: 12,
                        economy: 5
                    },

                    news:
                        "Город провёл большой фестиваль."
                },

                {
                    text: "Провести небольшой фестиваль за 10 ₸",
                    cost: 10,

                    effects: {
                        happiness: 5,
                        economy: 2
                    },

                    news:
                        "В городе прошёл небольшой праздник."
                }
            ]
        },


        {
            id: "schools",
            type: "neutral",

            tag: "ОБРАЗОВАНИЕ",
            icon: "📚",

            title: "Проблемы в школах",

            description:
                "Несколько школ сообщили о нехватке средств на оборудование.",

            choices: [
                {
                    text: "Выделить 50 ₸ школам",
                    cost: 50,

                    effects: {
                        education: 10
                    },

                    news:
                        "Город выделил средства на школы."
                },

                {
                    text: "Перераспределить бюджет",

                    effects: {
                        education: -5,
                        economy: 3
                    },

                    news:
                        "Средства на образование были частично перераспределены."
                }
            ]
        },


        {
            id: "weather",
            type: "neutral",

            tag: "ПОГОДА",
            icon: "🌧️",

            title: "Сильный дождь",

            description:
                "Сильные осадки обрушились на город. Решение властей повлияет на транспорт и настроение жителей.",

            choices: [
                {
                    text: "Потратить 60 ₸ на устранение последствий",
                    cost: 60,

                    effects: {
                        ecology: 5,
                        happiness: 6,
                        mobility: 7
                    },

                    news:
                        "Город быстро устранил последствия сильного дождя."
                },

                {
                    text: "Потратить 25 ₸ на основные работы",
                    cost: 25,

                    effects: {
                        happiness: 3,
                        mobility: 3
                    },

                    news:
                        "Город провёл основные работы после дождя."
                }
            ]
        },


        {
            id: "energy",
            type: "bad",

            tag: "ЭНЕРГЕТИКА",
            icon: "⚡",

            title: "Энергетический кризис",

            description:
                "Город столкнулся с нехваткой электроэнергии.",

            choices: [
                {
                    text: "Выделить 80 ₸ на энергосистему",
                    cost: 80,

                    effects: {
                        economy: 7,
                        happiness: 5
                    },

                    news:
                        "Город вложил средства в энергосистему."
                },

                {
                    text: "Ввести временные ограничения",

                    effects: {
                        economy: -3,
                        happiness: -8
                    },

                    news:
                        "В городе введены временные ограничения энергопотребления."
                }
            ]
        },


        {
            id: "grant",
            type: "good",

            tag: "ФИНАНСЫ",
            icon: "🏛️",

            title: "Городу предложили грант",

            description:
                "Город может получить государственный грант на развитие инфраструктуры.",

            choices: [
                {
                    text: "Подать заявку",

                    money: 120,

                    effects: {
                        economy: 5
                    },

                    news:
                        "Город получил дополнительное финансирование."
                },

                {
                    text: "Не подавать заявку",

                    effects: {},

                    news:
                        "Город решил не участвовать в программе финансирования."
                }
            ]
        }
    ];


        // =========================================================
    // DOM-ЭЛЕМЕНТЫ
    // =========================================================

    const startScreen = document.getElementById("startScreen");
    const startBtn = document.getElementById("startBtn");

    const turnElement = document.getElementById("turn");
    const moneyElement = document.getElementById("money");
    const incomeElement = document.getElementById("incomePerTurn");

    const projectsContainer = document.getElementById("projects");

    const happinessValue = document.getElementById("happinessValue");
    const happinessBar = document.getElementById("happinessBar");

    const ecologyValue = document.getElementById("ecologyValue");
    const ecologyBar = document.getElementById("ecologyBar");

    const mobilityValue = document.getElementById("mobilityValue");
    const mobilityBar = document.getElementById("mobilityBar");

    const educationValue = document.getElementById("educationValue");
    const educationBar = document.getElementById("educationBar");

    const healthValue = document.getElementById("healthValue");
    const healthBar = document.getElementById("healthBar");

    const economyValue = document.getElementById("economyValue");
    const economyBar = document.getElementById("economyBar");

    const newsTurn = document.getElementById("newsTurn");
    const newsList = document.getElementById("newsList");

    const projectObjects = document.getElementById("projectObjects");

    const eventModal = document.getElementById("eventModal");
    const eventTag = document.getElementById("eventTag");
    const eventIcon = document.getElementById("eventIcon");
    const eventTitle = document.getElementById("eventTitle");
    const eventDescription = document.getElementById("eventDescription");
    const eventChoices = document.getElementById("eventChoices");

    const finishModal = document.getElementById("finishModal");
    const finalScore = document.getElementById("finalScore");
    const finalHappiness = document.getElementById("finalHappiness");
    const finalEcology = document.getElementById("finalEcology");
    const finalEconomy = document.getElementById("finalEconomy");

    const toast = document.getElementById("toast");


    // =========================================================
    // ЗАЩИТА МОДАЛКИ СОБЫТИЙ
    // =========================================================

    // Очень важная часть.
    // Даже если CSS случайно оставит скрытую модалку
    // поверх страницы, она не сможет блокировать кнопки.

    if (eventModal) {
        eventModal.style.display = "none";
        eventModal.style.pointerEvents = "none";
    }

    if (finishModal) {
        finishModal.style.display = "none";
        finishModal.style.pointerEvents = "none";
    }


    // =========================================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // =========================================================

    function clamp(value, min = 0, max = 100) {
        return Math.max(min, Math.min(max, value));
    }


    function formatMoney(value) {
        return Math.round(value).toLocaleString("ru-RU") + " ₸";
    }


    function changeMetric(metric, amount) {
        if (!state.metrics.hasOwnProperty(metric)) {
            return;
        }

        state.metrics[metric] = clamp(
            state.metrics[metric] + amount
        );
    }


    function addNews(text) {
        state.news.unshift({
            turn: state.turn,
            text: text
        });

        // Не даём журналу разрастаться бесконечно.
        if (state.news.length > 30) {
            state.news.length = 30;
        }
    }


    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }


    // =========================================================
    // ФИНАНСЫ
    // =========================================================

    function getIncome() {
        let income = 25;

        Object.keys(state.projects).forEach(id => {
            const level = state.projects[id];
            const project = PROJECTS[id];

            if (!project) return;

            income += project.income * level;
        });

        // Состояние экономики немного влияет
        // на доход города.
        income += Math.floor(state.metrics.economy / 20);

        return Math.max(0, Math.round(income));
    }


    function getExpenses() {
        let expenses = 12;

        Object.keys(state.projects).forEach(id => {
            const level = state.projects[id];

            if (level > 0) {
                expenses += level * 2;
            }
        });

        return expenses;
    }


    function getBalance() {
        return getIncome() - getExpenses();
    }


    // =========================================================
    // ПРОЕКТЫ
    // =========================================================

    function getProjectLevel(id) {
        return state.projects[id] || 0;
    }


    function getProjectCost(id) {
        const project = PROJECTS[id];

        if (!project) {
            return Infinity;
        }

        const level = getProjectLevel(id);

        if (level >= project.costs.length) {
            return null;
        }

        return project.costs[level];
    }


    function createProjectCards() {
        if (!projectsContainer) return;

        projectsContainer.innerHTML = "";

        Object.values(PROJECTS).forEach(project => {

            const level = getProjectLevel(project.id);
            const cost = getProjectCost(project.id);

            const card = document.createElement("div");
            card.className = "project-card";

            const title = document.createElement("h3");
            title.textContent =
                project.icon + " " + project.name;

            const levelText = document.createElement("p");
            levelText.textContent =
                level > 0
                    ? `Уровень: ${level}`
                    : "Не построено";

            const effectParts = [];

            Object.entries(project.effects).forEach(
                ([metric, value]) => {

                    const sign = value > 0 ? "+" : "";

                    effectParts.push(
                        `${metric}: ${sign}${value}`
                    );
                }
            );

            const effectsText = document.createElement("p");
            effectsText.textContent =
                effectParts.join(" • ");

            const button = document.createElement("button");

            button.type = "button";
            button.className = "project-btn";

            if (cost === null) {
                button.textContent = "МАКС. УРОВЕНЬ";
                button.disabled = true;
            } else {
                button.textContent =
                    level === 0
                        ? `ПОСТРОИТЬ — ${formatMoney(cost)}`
                        : `УЛУЧШИТЬ — ${formatMoney(cost)}`;

                if (state.money < cost) {
                    button.disabled = true;
                }

                button.addEventListener("click", () => {
                    buildProject(project.id);
                });
            }

            card.appendChild(title);
            card.appendChild(levelText);
            card.appendChild(effectsText);
            card.appendChild(button);

            projectsContainer.appendChild(card);
        });
    }


    // =========================================================
    // ПОКУПКА / СТРОИТЕЛЬСТВО
    // =========================================================

    function buildProject(id) {

        // Никаких действий, если игра сейчас не принимает ввод.
        if (state.gameOver) return;
        if (!state.started) return;
        if (state.eventOpen) return;

        const project = PROJECTS[id];

        if (!project) return;

        const currentLevel = getProjectLevel(id);
        const cost = getProjectCost(id);

        if (cost === null) {
            showToast("Этот проект уже на максимальном уровне.");
            return;
        }

        if (state.money < cost) {
            showToast("Недостаточно денег.");
            return;
        }


        // -----------------------------------------------------
        // ПОКУПКА
        // -----------------------------------------------------

        state.money -= cost;

        state.projects[id] = currentLevel + 1;

        const newLevel = state.projects[id];


        // -----------------------------------------------------
        // ЭФФЕКТЫ
        // -----------------------------------------------------

        // Первый уровень даёт полный эффект.
        // Улучшения дают 55%.
        const multiplier =
            newLevel === 1 ? 1 : 0.55;

        Object.entries(project.effects).forEach(
            ([metric, value]) => {

                const finalValue =
                    Math.round(value * multiplier);

                changeMetric(metric, finalValue);
            }
        );


        // -----------------------------------------------------
        // НОВОСТЬ
        // -----------------------------------------------------

        if (newLevel === 1) {

            addNews(
                `Построен объект: ${project.name}.`
            );

            showToast(
                `${project.icon} ${project.name} построен!`
            );

        } else {

            addNews(
                `${project.name} улучшен до уровня ${newLevel}.`
            );

            showToast(
                `${project.icon} ${project.name} улучшен!`
            );
        }


        // -----------------------------------------------------
        // ОБНОВЛЯЕМ ИГРУ
        // -----------------------------------------------------

        render();
        updateMap();
        saveGame();


        // -----------------------------------------------------
        // АВТОМАТИЧЕСКИЙ ПЕРЕХОД ХОДА
        // -----------------------------------------------------

        // Маленькая задержка нужна только для того,
        // чтобы игрок успел увидеть результат покупки.

        setTimeout(() => {

            if (state.gameOver) return;
            if (!state.started) return;
            if (state.eventOpen) return;

            nextTurn();

        }, 450);
    }


    // =========================================================
    // ДАЛЬШЕ БУДЕТ ЧАСТЬ 3/4
    // =========================================================
        // =========================================================
    // ЧАСТЬ 3/4
    // ХОДЫ, СОБЫТИЯ, КАРТА И ОТРИСОВКА
    // =========================================================


    // =========================================================
    // ОБНОВЛЕНИЕ ИНФОРМАЦИИ О ХОДЕ
    // =========================================================

    function updateTurn() {
        if (!turnElement) return;

        turnElement.textContent =
            `${Math.min(state.turn, state.maxTurns)} / ${state.maxTurns}`;
    }


    // =========================================================
    // ОБНОВЛЕНИЕ БЮДЖЕТА
    // =========================================================

    function updateBudget() {
        if (moneyElement) {
            moneyElement.textContent =
                formatMoney(state.money);
        }

        if (incomeElement) {
            const balance = getBalance();

            incomeElement.textContent =
                balance >= 0
                    ? `+${formatMoney(balance)} / ход`
                    : `${formatMoney(balance)} / ход`;
        }
    }


    // =========================================================
    // ОБНОВЛЕНИЕ ПОКАЗАТЕЛЕЙ ГОРОДА
    // =========================================================

    function updateMetric(valueElement, barElement, value) {
        const safeValue = clamp(Math.round(value));

        if (valueElement) {
            valueElement.textContent = safeValue;
        }

        if (barElement) {
            barElement.style.width = safeValue + "%";
        }
    }


    function updateMetrics() {

        updateMetric(
            happinessValue,
            happinessBar,
            state.metrics.happiness
        );

        updateMetric(
            ecologyValue,
            ecologyBar,
            state.metrics.ecology
        );

        updateMetric(
            mobilityValue,
            mobilityBar,
            state.metrics.mobility
        );

        updateMetric(
            educationValue,
            educationBar,
            state.metrics.education
        );

        updateMetric(
            healthValue,
            healthBar,
            state.metrics.health
        );

        updateMetric(
            economyValue,
            economyBar,
            state.metrics.economy
        );
    }


    // =========================================================
    // НОВОСТИ
    // =========================================================

    function renderNews() {

        if (!newsList) return;

        newsList.innerHTML = "";

        if (newsTurn) {
            newsTurn.textContent =
                `Ход ${Math.min(state.turn, state.maxTurns)}`;
        }

        state.news.forEach(item => {

            const element = document.createElement("div");

            element.className = "news-item";

            element.textContent =
                `Ход ${item.turn}: ${item.text}`;

            newsList.appendChild(element);
        });
    }


    // =========================================================
    // КАРТА
    // =========================================================

    function updateMap() {

        if (!projectObjects) return;

        projectObjects.innerHTML = "";

        Object.entries(state.projects).forEach(
            ([id, level]) => {

                const project = PROJECTS[id];

                if (!project || level <= 0) {
                    return;
                }

                const [x, y] = project.position;

                const group =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "g"
                    );

                group.setAttribute(
                    "data-project",
                    id
                );

                group.style.cursor = "default";


                // -------------------------------------------------
                // ФОН ОБЪЕКТА
                // -------------------------------------------------

                const circle =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );

                circle.setAttribute("cx", x);
                circle.setAttribute("cy", y);
                circle.setAttribute("r", "28");

                circle.setAttribute(
                    "fill",
                    "rgba(255,255,255,0.12)"
                );

                circle.setAttribute(
                    "stroke",
                    "currentColor"
                );

                circle.setAttribute(
                    "stroke-width",
                    "2"
                );


                // -------------------------------------------------
                // ИКОНКА
                // -------------------------------------------------

                const icon =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "text"
                    );

                icon.setAttribute("x", x);
                icon.setAttribute("y", y + 7);

                icon.setAttribute(
                    "text-anchor",
                    "middle"
                );

                icon.setAttribute(
                    "font-size",
                    "22"
                );

                icon.textContent = project.icon;


                // -------------------------------------------------
                // УРОВЕНЬ
                // -------------------------------------------------

                const levelText =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "text"
                    );

                levelText.setAttribute(
                    "x",
                    x + 21
                );

                levelText.setAttribute(
                    "y",
                    y - 20
                );

                levelText.setAttribute(
                    "text-anchor",
                    "middle"
                );

                levelText.setAttribute(
                    "font-size",
                    "12"
                );

                levelText.setAttribute(
                    "font-weight",
                    "bold"
                );

                levelText.textContent =
                    `Lv.${level}`;


                group.appendChild(circle);
                group.appendChild(icon);
                group.appendChild(levelText);

                projectObjects.appendChild(group);
            }
        );
    }


    // =========================================================
    // ОБЩАЯ ОТРИСОВКА
    // =========================================================

    function render() {
        updateTurn();
        updateBudget();
        updateMetrics();
        renderNews();
        createProjectCards();
    }


    // =========================================================
    // СЛУЧАЙНОЕ СОБЫТИЕ
    // =========================================================

    function randomEvent() {

        if (state.gameOver) return;
        if (!state.started) return;
        if (state.eventOpen) return;

        // 45% вероятность события после хода.
        if (Math.random() > 0.45) {
            return;
        }

        if (EVENTS.length === 0) {
            return;
        }

        const randomIndex =
            Math.floor(Math.random() * EVENTS.length);

        const event = EVENTS[randomIndex];

        if (!event) return;

        showEvent(event);
    }


    // =========================================================
    // ПОКАЗ СОБЫТИЯ
    // =========================================================

    function showEvent(event) {

        if (state.gameOver) return;
        if (!state.started) return;
        if (state.eventOpen) return;

        state.eventOpen = true;


        // -----------------------------------------------------
        // ТИП СОБЫТИЯ
        // -----------------------------------------------------

        if (event.type === "good") {

            eventTag.textContent =
                "ХОРОШЕЕ СОБЫТИЕ";

        } else if (event.type === "bad") {

            eventTag.textContent =
                "ПЛОХОЕ СОБЫТИЕ";

        } else {

            eventTag.textContent =
                "НЕЙТРАЛЬНОЕ СОБЫТИЕ";
        }


        // -----------------------------------------------------
        // КЛАСС ТИПА
        // -----------------------------------------------------

        eventTag.className =
            "event-tag " + event.type;


        // -----------------------------------------------------
        // ДАННЫЕ СОБЫТИЯ
        // -----------------------------------------------------

        eventIcon.textContent =
            event.icon || "❗";

        eventTitle.textContent =
            event.title || "Событие";

        eventDescription.textContent =
            event.description || "";


        // -----------------------------------------------------
        // КНОПКИ
        // -----------------------------------------------------

        eventChoices.innerHTML = "";

        event.choices.forEach(choice => {

            const button =
                document.createElement("button");

            button.type = "button";
            button.className = "event-choice";

            button.textContent =
                choice.text;

            button.addEventListener(
                "click",
                () => {
                    chooseEvent(event, choice);
                }
            );

            eventChoices.appendChild(button);
        });


        // -----------------------------------------------------
        // ВКЛЮЧАЕМ МОДАЛКУ
        // -----------------------------------------------------

        // ВАЖНО:
        // display + pointer-events задаются напрямую,
        // поэтому скрытая модалка никогда не сможет
        // перекрывать кнопки игры.

        eventModal.style.display = "";
        eventModal.style.pointerEvents = "auto";

        eventModal.classList.add("show");
    }


    // =========================================================
    // ВЫБОР В СОБЫТИИ
    // =========================================================

    function chooseEvent(event, choice) {

        if (!state.eventOpen) {
            return;
        }

        if (state.gameOver) {
            return;
        }


        // -----------------------------------------------------
        // ПРОВЕРКА СТОИМОСТИ
        // -----------------------------------------------------

        const cost =
            Number(choice.cost || 0);

        if (cost < 0) {
            return;
        }

        if (state.money < cost) {

            showToast(
                "Недостаточно денег для этого решения."
            );

            return;
        }


        // -----------------------------------------------------
        // ОПЛАТА
        // -----------------------------------------------------

        state.money -= cost;


        // -----------------------------------------------------
        // ЭФФЕКТЫ
        // -----------------------------------------------------

        if (choice.effects) {

            Object.entries(choice.effects)
                .forEach(([metric, value]) => {

                    changeMetric(
                        metric,
                        Number(value) || 0
                    );
                });
        }


        // -----------------------------------------------------
        // ДОПОЛНИТЕЛЬНЫЕ ДЕНЬГИ
        // -----------------------------------------------------

        const extraMoney =
            Number(choice.money || 0);

        if (extraMoney !== 0) {
            state.money += extraMoney;
        }


        // -----------------------------------------------------
        // НОВОСТЬ
        // -----------------------------------------------------

        if (choice.news) {
            addNews(choice.news);
        }


        // -----------------------------------------------------
        // ЗАКРЫВАЕМ СОБЫТИЕ
        // -----------------------------------------------------

        closeEvent();


        // -----------------------------------------------------
        // ОБНОВЛЯЕМ ИГРУ
        // -----------------------------------------------------

        render();
        updateMap();
        saveGame();
    }


    // =========================================================
    // ЗАКРЫТИЕ СОБЫТИЯ
    // =========================================================

    function closeEvent() {

        state.eventOpen = false;

        eventModal.classList.remove("show");

        // Самое главное:
        // полностью убираем модалку с экрана
        // и отключаем любые клики через неё.

        eventModal.style.pointerEvents = "none";
        eventModal.style.display = "none";
    }


    // =========================================================
    // ПЕРЕХОД НА СЛЕДУЮЩИЙ ХОД
    // =========================================================

    function nextTurn() {

        if (state.gameOver) return;
        if (!state.started) return;
        if (state.eventOpen) return;


        // -----------------------------------------------------
        // ДОХОДЫ И РАСХОДЫ
        // -----------------------------------------------------

        const income = getIncome();
        const expenses = getExpenses();
        const balance = income - expenses;

        state.money += balance;


        // -----------------------------------------------------
        // ЕСТЕСТВЕННЫЕ ИЗМЕНЕНИЯ
        // -----------------------------------------------------

        // Хорошее состояние города постепенно поддерживает
        // настроение жителей.

        if (state.metrics.economy >= 60) {
            changeMetric("happiness", 1);
        }

        if (state.metrics.ecology >= 70) {
            changeMetric("health", 1);
        }

        if (state.metrics.mobility >= 70) {
            changeMetric("happiness", 1);
        }


        // Если экономика совсем плохая,
        // настроение немного падает.

        if (state.metrics.economy < 30) {
            changeMetric("happiness", -2);
        }


        // -----------------------------------------------------
        // НАСЕЛЕНИЕ
        // -----------------------------------------------------

        let populationChange = 0;

        if (state.metrics.happiness >= 70) {
            populationChange += 1000;
        }

        if (state.metrics.happiness < 40) {
            populationChange -= 700;
        }

        if (state.metrics.health >= 70) {
            populationChange += 500;
        }

        if (state.metrics.health < 35) {
            populationChange -= 500;
        }

        state.population =
            Math.max(
                0,
                state.population + populationChange
            );


        // -----------------------------------------------------
        // ДЕФИЦИТ
        // -----------------------------------------------------

        if (balance < 0) {

            changeMetric(
                "economy",
                -2
            );

            addNews(
                `Расходы превысили доходы на ${formatMoney(
                    Math.abs(balance)
                )}.`
            );

        } else {

            addNews(
                `Бюджет города изменился на ${
                    balance >= 0 ? "+" : ""
                }${formatMoney(balance)}.`
            );
        }


        // -----------------------------------------------------
        // НОВЫЙ ХОД
        // -----------------------------------------------------

        state.turn += 1;


        // -----------------------------------------------------
        // ОБНОВЛЕНИЕ
        // -----------------------------------------------------

        render();
        updateMap();
        saveGame();


        // -----------------------------------------------------
        // ФИНИШ
        // -----------------------------------------------------

        if (state.turn > state.maxTurns) {

            finishGame();

            return;
        }


        // -----------------------------------------------------
        // СЛУЧАЙНОЕ СОБЫТИЕ
        // -----------------------------------------------------

        // Даём интерфейсу немного времени обновиться.

        setTimeout(() => {

            if (state.gameOver) return;
            if (!state.started) return;
            if (state.eventOpen) return;

            randomEvent();

        }, 350);
    }


    // =========================================================
    // ДАЛЬШЕ БУДЕТ ЧАСТЬ 4/4
    // =========================================================
        // =========================================================
    // ЧАСТЬ 4/4
    // ФИНИШ, СОХРАНЕНИЕ, ЗАГРУЗКА, СТАРТ
    // =========================================================


    // =========================================================
    // ФИНАЛЬНЫЙ СЧЁТ
    // =========================================================

    function calculateScore() {

        const metrics = Object.values(state.metrics);

        const average =
            metrics.reduce(
                (sum, value) => sum + value,
                0
            ) / metrics.length;


        // Небольшой бонус за деньги,
        // максимум +10 очков.

        const moneyBonus =
            Math.min(
                10,
                Math.max(
                    0,
                    Math.floor(state.money / 200)
                )
            );

        return Math.round(
            clamp(average) + moneyBonus
        );
    }


    // =========================================================
    // ЗАВЕРШЕНИЕ ИГРЫ
    // =========================================================

    function finishGame() {

        if (state.gameOver) {
            return;
        }

        state.gameOver = true;
        state.started = false;
        state.eventOpen = false;


        // -----------------------------------------------------
        // ЗАКРЫВАЕМ СОБЫТИЕ
        // -----------------------------------------------------

        if (eventModal) {

            eventModal.classList.remove("show");

            eventModal.style.pointerEvents = "none";
            eventModal.style.display = "none";
        }


        // -----------------------------------------------------
        // ФИНАЛЬНЫЕ ЗНАЧЕНИЯ
        // -----------------------------------------------------

        const score = calculateScore();


        if (finalScore) {
            finalScore.textContent = score;
        }

        if (finalHappiness) {
            finalHappiness.textContent =
                Math.round(state.metrics.happiness);
        }

        if (finalEcology) {
            finalEcology.textContent =
                Math.round(state.metrics.ecology);
        }

        if (finalEconomy) {
            finalEconomy.textContent =
                Math.round(state.metrics.economy);
        }


        // -----------------------------------------------------
        // ПОКАЗЫВАЕМ ФИНАЛЬНОЕ ОКНО
        // -----------------------------------------------------

        if (finishModal) {

            finishModal.style.display = "";
            finishModal.style.pointerEvents = "auto";

            finishModal.classList.add("show");
        }


        // -----------------------------------------------------
        // СОХРАНЕНИЕ БОЛЬШЕ НЕ НУЖНО
        // -----------------------------------------------------

        localStorage.removeItem(SAVE_KEY);
    }


    // =========================================================
    // СОХРАНЕНИЕ
    // =========================================================

    function saveGame() {

        if (!state.started || state.gameOver) {
            return;
        }

        try {

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(state)
            );

        } catch (error) {

            console.warn(
                "Не удалось сохранить игру:",
                error
            );
        }
    }


    // =========================================================
    // ЗАГРУЗКА
    // =========================================================

    function loadGame() {

        try {

            const saved =
                localStorage.getItem(SAVE_KEY);

            if (!saved) {
                return false;
            }

            const parsed =
                JSON.parse(saved);


            // -------------------------------------------------
            // ПРОВЕРКА СОХРАНЕНИЯ
            // -------------------------------------------------

            if (!parsed || typeof parsed !== "object") {
                return false;
            }

            if (!parsed.metrics) {
                return false;
            }

            if (typeof parsed.money !== "number") {
                return false;
            }

            if (typeof parsed.turn !== "number") {
                return false;
            }


            // -------------------------------------------------
            // ВОССТАНОВЛЕНИЕ
            // -------------------------------------------------

            state = {
                ...JSON.parse(
                    JSON.stringify(defaultState)
                ),

                ...parsed,

                metrics: {
                    ...defaultState.metrics,
                    ...parsed.metrics
                },

                projects: {
                    ...(parsed.projects || {})
                },

                news: Array.isArray(parsed.news)
                    ? parsed.news
                    : []
            };


            // Событие никогда не должно оставаться открытым
            // после перезагрузки страницы.

            state.eventOpen = false;
            state.gameOver = false;
            state.started = false;


            return true;

        } catch (error) {

            console.warn(
                "Ошибка загрузки сохранения:",
                error
            );

            return false;
        }
    }


    // =========================================================
    // НОВАЯ ИГРА
    // =========================================================

    function resetGame() {

        localStorage.removeItem(SAVE_KEY);

        state =
            JSON.parse(
                JSON.stringify(defaultState)
            );


        // -----------------------------------------------------
        // ЗАКРЫВАЕМ ОКНА
        // -----------------------------------------------------

        if (eventModal) {

            eventModal.classList.remove("show");

            eventModal.style.pointerEvents = "none";
            eventModal.style.display = "none";
        }


        if (finishModal) {

            finishModal.classList.remove("show");

            finishModal.style.pointerEvents = "none";
            finishModal.style.display = "none";
        }


        // -----------------------------------------------------
        // СТАРТОВЫЙ ЭКРАН
        // -----------------------------------------------------

        if (startScreen) {
            startScreen.classList.remove("hidden");
        }

        if (startBtn) {
            startBtn.textContent =
                "НАЧАТЬ ИГРУ →";
        }


        render();
        updateMap();
    }


    // =========================================================
    // НАЧАЛО / ПРОДОЛЖЕНИЕ ИГРЫ
    // =========================================================

    function startGame() {

        // Если каким-то образом нажали старт
        // после окончания игры — создаём новую.

        if (state.gameOver) {
            resetGame();
        }


        state.started = true;
        state.gameOver = false;
        state.eventOpen = false;


        // -----------------------------------------------------
        // СКРЫВАЕМ СТАРТОВЫЙ ЭКРАН
        // -----------------------------------------------------

        if (startScreen) {
            startScreen.classList.add("hidden");
        }


        // -----------------------------------------------------
        // НОВОСТЬ
        // -----------------------------------------------------

        // Добавляем только если это действительно
        // новый запуск, а не продолжение сохранения.

        if (
            state.news.length === 0 ||
            !state.news.some(
                item =>
                    item.text ===
                    "Вы вступили в должность акима."
            )
        ) {

            addNews(
                "Вы вступили в должность акима."
            );
        }


        render();
        updateMap();
        saveGame();
    }


    // =========================================================
    // КНОПКА СТАРТА
    // =========================================================

    if (startBtn) {

        startBtn.addEventListener(
            "click",
            startGame
        );
    }


    // =========================================================
    // ПОДГОТОВКА СТАРТОВОГО ЭКРАНА
    // =========================================================

    const hasSave = loadGame();


    // Стартовый экран показывается
    // ПРИ КАЖДОМ обновлении страницы.

    if (startScreen) {
        startScreen.classList.remove("hidden");
    }


    // =========================================================
    // ЕСЛИ ЕСТЬ СОХРАНЕНИЕ
    // =========================================================

    if (hasSave) {

        if (startBtn) {
            startBtn.textContent =
                "ПРОДОЛЖИТЬ →";
        }


        // -----------------------------------------------------
        // КНОПКА НОВОЙ ИГРЫ
        // -----------------------------------------------------

        // Удаляем старую динамическую кнопку,
        // если она каким-то образом уже существует.

        const oldNewGame =
            document.getElementById("newGameBtn");

        if (oldNewGame) {
            oldNewGame.remove();
        }


        const newGameBtn =
            document.createElement("button");

        newGameBtn.id = "newGameBtn";
        newGameBtn.type = "button";
        newGameBtn.textContent =
            "НОВАЯ ИГРА";


        newGameBtn.addEventListener(
            "click",
            () => {

                resetGame();

                // Сразу после resetGame
                // пользователь может нажать
                // "НАЧАТЬ ИГРУ".

            }
        );


        if (startScreen) {
            startScreen.appendChild(newGameBtn);
        }
    }


    // =========================================================
    // ЕСЛИ СОХРАНЕНИЯ НЕТ
    // =========================================================

    else {

        // Начинаем с чистого состояния.

        state =
            JSON.parse(
                JSON.stringify(defaultState)
            );

        render();
        updateMap();
    }


    // =========================================================
    // ПЕРВИЧНАЯ ОТРИСОВКА
    // =========================================================

    render();
    updateMap();


    // =========================================================
    // DEBUG API
    // =========================================================

    // Можно открыть консоль браузера и написать:
    //
    // merocity.state
    //
    // чтобы посмотреть состояние игры.

    window.meroCity = {

        get state() {
            return state;
        },

        save() {
            saveGame();
        },

        reset() {
            resetGame();
        },

        nextTurn() {
            nextTurn();
        },

        event() {
            randomEvent();
        }
    };


    // =========================================================
    // КОНЕЦ MEROCITY
    // =========================================================

});