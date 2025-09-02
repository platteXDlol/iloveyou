import { ref, reactive, computed } from 'vue';
import { supabase } from '../supabase';

export function useGame() {
    // Game State
    const gameState = ref('not_started'); // 'not_started', 'in_progress'
    const loading = ref(false);
    const error = ref(null);

    // Player Management
    const players = reactive([{ name: '' }, { name: '' }]);
    const currentPlayerIndex = ref(0);
    const currentPlayer = computed(() => players[currentPlayerIndex.value]);

    // Level Management
    const totalLevels = 5;
    const activeLevel = ref(null); // The level number currently being played, e.g., 1, 2, ...
    const tasksCompletedThisLevel = ref(0);
    const completedTasks = reactive({});


    // Task Management
    const tasksForCurrentLevel = ref([]);
    const currentTask = ref('');

    // --- DATABASE FUNCTIONS ---

    async function fetchTasksForLevel(levelId) {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: dbError } = await supabase.from('flirty_game').select('text').eq('level', levelId);
            if (dbError) throw dbError;
            tasksForCurrentLevel.value = data.map(t => t.text);
            if (tasksForCurrentLevel.value.length === 0) {
                throw new Error(`No tasks found for level ${levelId}.`);
            }
        } catch (e) {
            error.value = `Failed to fetch tasks: ${e.message}`;
            console.error(error.value);
        } finally {
            loading.value = false;
        }
    }

    // --- HELPER FUNCTIONS ---

    function getNewRandomTask() {
        if (tasksForCurrentLevel.value.length === 0) {
            currentTask.value = "No tasks available for this level.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * tasksForCurrentLevel.value.length);
        currentTask.value = tasksForCurrentLevel.value[randomIndex];
    }

    function switchPlayer() {
        currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.length;
    }

    // --- GAME ACTIONS ---

    function startGame() {
        if (players[0].name && players[1].name) {
            currentPlayerIndex.value = 0;
            gameState.value = 'in_progress';
        } else {
            alert('Please enter names for both players.');
        }
    }

    function restartGame() {
        gameState.value = 'not_started';
        players[0].name = '';
        players[1].name = '';
        activeLevel.value = null;
        tasksCompletedThisLevel.value = 0;
        currentTask.value = '';
        Object.keys(completedTasks).forEach(key => delete completedTasks[key]);
    }

    async function selectLevel(levelNumber) {
        if (levelNumber > 1 && (completedTasks[levelNumber - 1] || 0) < 4) {
            alert(`Complete Level ${levelNumber - 1} to unlock this level.`);
            return;
        }
        activeLevel.value = levelNumber;
        tasksCompletedThisLevel.value = 0;
        await fetchTasksForLevel(levelNumber);
        getNewRandomTask();
    }

    function backToLevels() {
        activeLevel.value = null;
    }

    function handleDone() {
        tasksCompletedThisLevel.value++;
        if (!completedTasks[activeLevel.value]) {
            completedTasks[activeLevel.value] = 0;
        }
        completedTasks[activeLevel.value]++;

        if (tasksCompletedThisLevel.value >= 4) {
            // Level complete, go back to level selection
            activeLevel.value = null;
        } else {
            // Next task
            switchPlayer();
            getNewRandomTask();
        }
    }

    function handleDifferentTask() {
        getNewRandomTask();
    }

    return {
        // State
        gameState,
        players,
        currentPlayer,
        totalLevels,
        activeLevel,
        tasksCompletedThisLevel, // For the UI: "Task X of 4"
        completedTasks,
        currentTask,
        loading,
        error,

        // Actions
        startGame,
        restartGame,
        selectLevel,
        backToLevels,
        handleDone,
        handleDifferentTask,
    };
}
