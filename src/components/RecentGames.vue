<template>
	<div class="p-4">
		<h2 class="text-2xl text-center font-bold text-white mb-6 drop-shadow-lg">
			Recent Match History
		</h2>
		
		<!-- Summary Stats -->
		<div v-if="!loading && games.length > 0" class="grid grid-cols-3 gap-4 mb-8">
			<div class="text-center p-4 rounded-lg bg-green-900/80 backdrop-blur-sm border-2 border-green-500">
				<p class="text-3xl font-bold text-white drop-shadow-md">{{ wins }}</p>
				<p class="text-sm font-semibold text-green-200 uppercase tracking-wider">Wins</p>
			</div>
			<div class="text-center p-4 rounded-lg bg-red-900/80 backdrop-blur-sm border-2 border-red-500">
				<p class="text-3xl font-bold text-white drop-shadow-md">{{ losses }}</p>
				<p class="text-sm font-semibold text-red-200 uppercase tracking-wider">Losses</p>
			</div>
			<div class="text-center p-4 rounded-lg bg-blue-900/80 backdrop-blur-sm border-2 border-blue-500">
				<p class="text-3xl font-bold text-white drop-shadow-md">{{ winRate }}%</p>
				<p class="text-sm font-semibold text-blue-200 uppercase tracking-wider">Win Rate</p>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="text-center py-8">
			<p class="text-lg text-white drop-shadow-lg">Loading games for player {{ playerId }}...</p>
			<p class="text-sm text-gray-400 mt-2">If this takes too long, there may be a network issue</p>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="text-center py-8">
			<p class="text-lg text-red-400 drop-shadow-lg">{{ error }}</p>
		</div>

		<!-- Games Table -->
		<div v-else-if="games.length > 0" class="overflow-x-auto">
			<table class="table-auto w-full">
				<thead>
					<tr class="border-b-2 border-white/30">
						<th class="px-2 sm:px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white drop-shadow-md">Date</th>
						<th class="px-2 sm:px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white drop-shadow-md">Result</th>
						<th class="px-2 sm:px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white drop-shadow-md">Mode</th>
						<th class="px-2 sm:px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white drop-shadow-md">ELO</th>
						<th class="px-2 sm:px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white drop-shadow-md">Opp ELO</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="game in games" 
						:key="game.game_id" 
						class="border-b border-white/20"
						:class="{
							'bg-green-900/30': game.result === 'win',
							'bg-red-900/30': game.result === 'loss'
						}"
					>
						<td class="px-2 sm:px-4 py-4 text-xs sm:text-sm text-center font-medium text-white drop-shadow-lg">{{ formatDate(game.started_at) }}</td>
						<td class="px-2 sm:px-4 py-4 text-sm text-center">
							<span 
								class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold drop-shadow-lg"
								:class="{
									'bg-green-600 text-white': game.result === 'win',
									'bg-red-600 text-white': game.result === 'loss'
								}"
							>
								{{ game.result === 'win' ? '✓ WIN' : '✗ LOSS' }}
							</span>
						</td>
						<td class="px-2 sm:px-4 py-4 text-sm text-center font-medium text-white drop-shadow-lg">
							{{ formatGameMode(game.game_mode) }}
						</td>
						<td class="px-2 sm:px-4 py-4 text-sm text-center font-bold text-white drop-shadow-lg">
							{{ game.own_team_elo || 'N/A' }}
						</td>
						<td class="px-2 sm:px-4 py-4 text-sm text-center font-bold text-white drop-shadow-lg">
							{{ game.opponent_team_elo || 'N/A' }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Empty State -->
		<div v-else class="text-center py-8">
			<p class="text-lg text-white drop-shadow-lg">No games found</p>
		</div>
	</div>
</template>

<script setup lang="ts">
// Library
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Types
import type { Ref } from 'vue';

// Local files
import useAOE4API from '@/composables/useAOE4API';

// Types
interface GameResult {
	game_id: number;
	result: string | null;
	game_mode: string;
	own_team_elo: number | null;
	opponent_team_elo: number | null;
	started_at: string;
}

// Props
const props = defineProps<{
	playerId: string;
	refreshInterval?: number; // in milliseconds, default 30000 (30 seconds)
}>();

// State
const loading: Ref<boolean> = ref(true);
const error: Ref<string | null> = ref(null);
const games: Ref<GameResult[]> = ref([]);
let refreshTimer: number | null = null;

// Computed
const wins = computed(() => games.value.filter(g => g.result === 'win').length);
const losses = computed(() => games.value.filter(g => g.result === 'loss').length);
const winRate = computed(() => {
	const total = wins.value + losses.value;
	return total > 0 ? Math.round((wins.value / total) * 100) : 0;
});

// Methods
const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);
	
	// If less than 1 hour, show minutes
	if (diffMins < 60) {
		return diffMins === 1 ? '1 min ago' : `${diffMins} mins ago`;
	}
	// If less than 24 hours, show hours
	else if (diffHours < 24) {
		return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
	}
	// If less than 7 days, show days
	else if (diffDays < 7) {
		return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
	}
	// Otherwise show date
	else {
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
};

const formatGameMode = (mode: string): string => {
	const modes: Record<string, string> = {
		'rm_solo': '1v1',
		'rm_1v1': '1v1',
		'rm_2v2': '2v2',
		'rm_3v3': '3v3',
		'rm_4v4': '4v4',
		'qm_1v1': 'QM 1v1',
		'qm_2v2': 'QM 2v2',
		'qm_3v3': 'QM 3v3',
		'qm_4v4': 'QM 4v4'
	};
	return modes[mode] || mode;
};

const loadGames = async (showLoading: boolean = true) => {
	if (showLoading) {
		loading.value = true;
	}
	error.value = null;
	
	try {
		console.log('Loading games for player:', props.playerId);
		const { fetchPlayerRecentGames } = useAOE4API();
		const result = await fetchPlayerRecentGames(props.playerId);
		console.log('Games loaded successfully:', result.length, 'games');
		games.value = result;
		loading.value = false;
	} catch (err: unknown) {
		console.error('Error loading games:', err);
		loading.value = false;
		const errorMessage = err instanceof Error ? err.message : 'Failed to load games';
		error.value = `API Error: ${errorMessage}`;
	}
};

const startAutoRefresh = () => {
	const interval = props.refreshInterval || 30000; // Default 30 seconds
	refreshTimer = window.setInterval(() => {
		// Refresh in background without showing loading state
		loadGames(false);
	}, interval);
};

const stopAutoRefresh = () => {
	if (refreshTimer !== null) {
		clearInterval(refreshTimer);
		refreshTimer = null;
	}
};

// Lifecycle
onMounted(() => {
	loadGames();
	startAutoRefresh();
});

onUnmounted(() => {
	stopAutoRefresh();
});
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>

