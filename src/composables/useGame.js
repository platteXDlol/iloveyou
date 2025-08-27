import { ref, computed } from 'vue';

const allTasks = [
    "Give your partner a compliment.",
    "Share a favorite memory you have together.",
    "Tell your partner something you admire about them.",
    "Plan a dream date night together.",
    "What's one thing you're grateful for about your partner?",
    "Give your partner a 60-second massage.",
    "Sing a song for your partner.",
    "Make your partner laugh.",
    "Tell a joke.",
    "Stare into each other's eyes for 30 seconds.",
];

export function useGame() {
    const gameState = ref('not_started'); // 'not_started', 'in_progress'
    const players = ref([{ name: '' }, { name: '' }]);
    const currentPlayerIndex = ref(0);
    const levels = ref([
        { id: 1, unlocked: true, tasksCompleted: 0 },
        { id: 2, unlocked: false, tasksCompleted: 0 },
        { id: 3, unlocked: false, tasksCompleted: 0 },
        { id: 4, unlocked: false, tasksCompleted: 0 },
        { id: 5, unlocked: false, tasksCompleted: 0 },
    ]);
    const activeLevel = ref(null);
    const currentTask = ref('');
    const differentTaskCounter = ref(0);

    const currentPlayer = computed(() => players.value[currentPlayerIndex.value]);
    const unlockedLevels = computed(() => levels.value.filter(level => level.unlocked));
    const lockedLevels = computed(() => levels.value.filter(level => !level.unlocked));

    function startGame() {
        if (players.value[0].name && players.value[1].name) {
            currentPlayerIndex.value = Math.floor(Math.random() * 2);
            gameState.value = 'in_progress';
        } else {
            alert('Please enter both player names to start the game.');
        }
    }

    function restartGame() {
        gameState.value = 'not_started';
        levels.value.forEach((level, index) => {
            level.unlocked = index === 0;
            level.tasksCompleted = 0;
        });
        activeLevel.value = null;
        currentTask.value = '';
        players.value = [{ name: '' }, { name: '' }];
    }

    function selectLevel(level) {
        activeLevel.value = level;
        getNewTask();
    }

    function backToLevels() {
        activeLevel.value = null;
    }

    function getNewTask() {
        let newTask = currentTask.value;
        while (newTask === currentTask.value) {
            const randomIndex = Math.floor(Math.random() * allTasks.length);
            newTask = allTasks[randomIndex];
        }
        currentTask.value = newTask;
    }

    function handleDone() {
        if (!activeLevel.value) return;

        activeLevel.value.tasksCompleted++;
        currentPlayerIndex.value = (currentPlayerIndex.value + 1) % 2;

        if (activeLevel.value.tasksCompleted >= 4) {
            const currentLevelId = activeLevel.value.id;
            if (currentLevelId < levels.value.length) {
                levels.value[currentLevelId].unlocked = true;
            }
            
            
            
            activeLevel.value = null;
            alert(`Congratulations, ${currentPlayer.value.name}! You completed Level ${currentLevelId}.`);

        } else {
            getNewTask();
        }
    }

    function handleDifferentTask() {
        differentTaskCounter.value++;
        getNewTask();
    }

    return {
        gameState,
        players,
        currentPlayer,
        unlockedLevels,
        lockedLevels,
        activeLevel,
        currentTask,
        startGame,
        restartGame,
        selectLevel,
        backToLevels,
        handleDone,
        handleDifferentTask,
    };
}