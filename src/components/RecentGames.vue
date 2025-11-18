<template>
	<div class="p-6">
		<h2 class="text-3xl text-center font-bold text-white mb-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
			Recent Match History
		</h2>
		
		<!-- Summary Stats -->
		<div v-if="!loading && games.length > 0" class="grid grid-cols-3 gap-6 mb-10">
			<div class="text-center p-6 rounded-lg bg-green-900/90 backdrop-blur-sm border-3 border-green-400 shadow-xl">
				<p class="text-5xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">{{ wins }}</p>
				<p class="text-base font-bold text-green-100 uppercase tracking-wider mt-2">Wins</p>
			</div>
			<div class="text-center p-6 rounded-lg bg-red-900/90 backdrop-blur-sm border-3 border-red-400 shadow-xl">
				<p class="text-5xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">{{ losses }}</p>
				<p class="text-base font-bold text-red-100 uppercase tracking-wider mt-2">Losses</p>
			</div>
			<div class="text-center p-6 rounded-lg bg-blue-900/90 backdrop-blur-sm border-3 border-blue-400 shadow-xl">
				<p class="text-5xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">{{ winRate }}%</p>
				<p class="text-base font-bold text-blue-100 uppercase tracking-wider mt-2">Win Rate</p>
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
					<tr class="border-b-3 border-white/40">
						<th class="px-4 sm:px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Date</th>
						<th class="px-4 sm:px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Result</th>
						<th class="px-4 sm:px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Mode</th>
						<th class="px-4 sm:px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">ELO</th>
						<th class="px-4 sm:px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Opp ELO</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="game in games.slice(0, 2)" 
						:key="game.game_id" 
						class="border-b-2 border-white/30"
						:class="{
							'bg-green-900/40': game.result === 'win',
							'bg-red-900/40': game.result === 'loss'
						}"
					>
						<td class="px-4 sm:px-6 py-6 text-base sm:text-lg text-center font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{{ formatDate(game.started_at) }}</td>
						<td class="px-4 sm:px-6 py-6 text-base text-center">
							<span 
								class="inline-flex items-center px-4 py-2 rounded-full text-sm font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] shadow-lg"
								:class="{
									'bg-green-600 text-white': game.result === 'win',
									'bg-red-600 text-white': game.result === 'loss'
								}"
							>
								{{ game.result === 'win' ? '✓ WIN' : '✗ LOSS' }}
							</span>
						</td>
						<td class="px-4 sm:px-6 py-6 text-base sm:text-lg text-center font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
							{{ formatGameMode(game.game_mode) }}
						</td>
						<td class="px-4 sm:px-6 py-6 text-lg sm:text-xl text-center font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
							{{ game.own_team_elo || 'N/A' }}
						</td>
						<td class="px-4 sm:px-6 py-6 text-lg sm:text-xl text-center font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

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

// Watch for player ID changes and reload immediately
watch(() => props.playerId, (newPlayerId, oldPlayerId) => {
	if (newPlayerId !== oldPlayerId) {
		console.log('Player ID changed from', oldPlayerId, 'to', newPlayerId);
		stopAutoRefresh();
		loadGames();
		startAutoRefresh();
	}
});
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>

