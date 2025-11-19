<template>
	<!-- Main Container with strong background -->
	<div class="max-w-md mx-auto">
		<div
			class="bg-gradient-to-br from-slate-900/75 via-slate-800/75 to-slate-900/75 backdrop-blur-md rounded-xl border-4 border-amber-500/70 shadow-[0_0_30px_rgba(217,119,6,0.3)]"
		>
			<!-- Header with medieval styling -->
			<div
				class="bg-gradient-to-r from-amber-900/50 to-amber-800/50 border-b-4 border-amber-500/50 px-5 py-3 rounded-t-lg"
			>
				<h2
					class="text-2xl text-center font-black text-amber-100 uppercase tracking-widest drop-shadow-[0_3px_6px_rgba(0,0,0,1)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_100%)]"
					style="font-family: 'Cinzel', serif"
				>
					Match History
				</h2>
			</div>

			<div class="p-5">
				<!-- Summary Stats - Last 2 Days (or Last 20 Games if overflow) -->
				<div v-if="!loading && games.length > 0" class="mb-5">
					<div class="text-center mb-3">
						<p
							class="text-xs font-bold text-amber-200 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
						>
							{{ statsTimeframe }}
						</p>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div
							class="text-center p-3 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-2 border-slate-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
						>
							<p
								class="text-4xl font-black text-white drop-shadow-[0_3px_6px_rgba(0,0,0,1)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_100%)]"
							>
								{{ recentGamesCount }}
							</p>
							<p
								class="text-xs font-bold text-slate-200 uppercase tracking-wider mt-1"
							>
								Games
							</p>
						</div>
						<div
							class="text-center p-3 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-2 border-slate-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
						>
							<p
								class="text-4xl font-black text-white drop-shadow-[0_3px_6px_rgba(0,0,0,1)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_100%)]"
							>
								{{ recentWinRate }}%
							</p>
							<p
								class="text-xs font-bold text-slate-200 uppercase tracking-wider mt-1"
							>
								Win Rate
							</p>
						</div>
					</div>
				</div>

				<!-- Loading State -->
				<div v-if="loading" class="text-center py-8">
					<p class="text-lg text-white drop-shadow-[0_3px_6px_rgba(0,0,0,1)] font-bold">
						Loading...
					</p>
				</div>

				<!-- Error State -->
				<div v-else-if="error" class="text-center py-8">
					<p
						class="text-base text-red-300 drop-shadow-[0_3px_6px_rgba(0,0,0,1)] font-bold"
					>
						{{ error }}
					</p>
				</div>

				<!-- Recent Games - Compact card style (no table) -->
				<div v-else-if="games.length > 0" class="space-y-3">
					<div class="text-center mb-2">
						<p
							class="text-xs font-bold text-amber-200 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
						>
							Last 2 Games
						</p>
					</div>
					<div
						v-for="game in games.slice(0, 2)"
						:key="game.game_id"
						class="rounded-lg border-2 shadow-[0_4px_12px_rgba(0,0,0,0.6)] overflow-hidden"
						:class="{
							'bg-gradient-to-r from-green-800/80 to-green-900/80 border-green-500/80':
								game.result === 'win',
							'bg-gradient-to-r from-red-800/80 to-red-900/80 border-red-500/80':
								game.result === 'loss',
						}"
					>
						<!-- Game info in compact rows -->
						<div class="p-3 space-y-2">
							<!-- Top row: Result and Time -->
							<div class="flex items-center justify-between">
								<span
									class="inline-flex items-center px-3 py-1 rounded-md text-sm font-black uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_100%)]"
									:class="{
										'bg-green-600 text-white': game.result === 'win',
										'bg-red-600 text-white': game.result === 'loss',
									}"
								>
									{{ game.result === 'win' ? '✓ WIN' : '✗ LOSS' }}
								</span>
								<span
									class="text-sm font-bold text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
								>
									{{ formatDate(game.started_at) }}
								</span>
							</div>

							<!-- Bottom row: Mode and ELOs -->
							<div class="flex items-center justify-between text-white">
								<div class="flex items-center gap-2">
									<span class="text-xs font-semibold text-white/70 uppercase"
										>Mode:</span
									>
									<span
										class="text-base font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_100%)]"
									>
										{{ formatGameMode(game.game_mode) }}
									</span>
								</div>
								<div class="flex items-center gap-3">
									<div class="text-right">
										<div class="text-xs font-semibold text-white/70">
											{{ getEloLabel(game.game_mode) }}
										</div>
										<div
											class="text-lg font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_100%)]"
										>
											{{ game.own_team_elo || 'N/A' }}
										</div>
									</div>
									<span class="text-white/50 font-bold">vs</span>
									<div class="text-left">
										<div class="text-xs font-semibold text-white/70">
											Opp ELO
										</div>
										<div
											class="text-lg font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_100%)]"
										>
											{{ game.opponent_team_elo || 'N/A' }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty State -->
				<div v-else class="text-center py-8">
					<p class="text-base text-white drop-shadow-[0_3px_6px_rgba(0,0,0,1)] font-bold">
						No games found
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Library
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

// Types
import type { Ref } from 'vue'

// Local files
import useAOE4API from '@/composables/useAOE4API'

// Types
interface GameResult {
	game_id: number
	result: string | null
	game_mode: string
	own_team_elo: number | null
	opponent_team_elo: number | null
	started_at: string
}

// Props
const props = defineProps<{
	playerId: string
	refreshInterval?: number // in milliseconds, default 30000 (30 seconds)
}>()

// State
const loading: Ref<boolean> = ref(true)
const error: Ref<string | null> = ref(null)
const games: Ref<GameResult[]> = ref([])
let refreshTimer: number | null = null

// Computed - Determine if we should use time-based or count-based stats
const useTimeBasedStats = computed(() => {
	if (games.value.length < 20) return true // Not enough games, use time-based

	const twoDaysAgo = new Date()
	twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
	const game20 = games.value[19]
	if (!game20) return true // Safety check
	const game20Date = new Date(game20.started_at)

	// If 20th game is within 2 days, too many games - use count-based
	if (game20Date >= twoDaysAgo) return false

	// Check if we have enough games in the 2-day window (minimum 4)
	const gamesInWindow = games.value.filter((g) => new Date(g.started_at) >= twoDaysAgo).length
	if (gamesInWindow < 4) return false // Not enough games, use count-based

	return true // Good to use time-based
})

const statsTimeframe = computed(() => {
	return useTimeBasedStats.value ? 'Last 2 Days' : 'Last 20 Games'
})

const recentGamesCount = computed(() => {
	if (useTimeBasedStats.value) {
		const twoDaysAgo = new Date()
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
		return games.value.filter((g) => new Date(g.started_at) >= twoDaysAgo).length
	} else {
		return Math.min(games.value.length, 20)
	}
})

const recentWinRate = computed(() => {
	let relevantGames

	if (useTimeBasedStats.value) {
		const twoDaysAgo = new Date()
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
		relevantGames = games.value.filter((g) => new Date(g.started_at) >= twoDaysAgo)
	} else {
		relevantGames = games.value.slice(0, 20)
	}

	const wins = relevantGames.filter((g) => g.result === 'win').length
	const total = relevantGames.length
	return total > 0 ? Math.round((wins / total) * 100) : 0
})

// Methods
const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffMins = Math.floor(diffMs / 60000)
	const diffHours = Math.floor(diffMs / 3600000)
	const diffDays = Math.floor(diffMs / 86400000)

	// If less than 1 hour, show minutes
	if (diffMins < 60) {
		return diffMins === 1 ? '1 min ago' : `${diffMins} mins ago`
	}
	// If less than 24 hours, show hours
	else if (diffHours < 24) {
		return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
	}
	// If less than 7 days, show days
	else if (diffDays < 7) {
		return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
	}
	// Otherwise show date
	else {
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
	}
}

const formatGameMode = (mode: string): string => {
	const modes: Record<string, string> = {
		rm_solo: '1v1 RM',
		rm_1v1: '1v1 RM',
		rm_2v2: '2v2 RM',
		rm_3v3: '3v3 RM',
		rm_4v4: '4v4 RM',
		qm_1v1: '1v1 QM',
		qm_2v2: '2v2 QM',
		qm_3v3: '3v3 QM',
		qm_4v4: '4v4 QM',
	}
	return modes[mode] || mode
}

const isTeamGame = (mode: string): boolean => {
	return mode.includes('2v2') || mode.includes('3v3') || mode.includes('4v4')
}

const getEloLabel = (mode: string): string => {
	return isTeamGame(mode) ? 'Team ELO' : 'My ELO'
}

const loadGames = async (showLoading: boolean = true) => {
	if (showLoading) {
		loading.value = true
	}
	error.value = null

	try {
		console.log('Loading games for player:', props.playerId)
		const { fetchPlayerRecentGames } = useAOE4API()
		const result = await fetchPlayerRecentGames(props.playerId)
		console.log('Games loaded successfully:', result.length, 'games')
		games.value = result
		loading.value = false
	} catch (err: unknown) {
		console.error('Error loading games:', err)
		loading.value = false
		const errorMessage = err instanceof Error ? err.message : 'Failed to load games'
		error.value = `API Error: ${errorMessage}`
	}
}

const startAutoRefresh = () => {
	const interval = props.refreshInterval || 30000 // Default 30 seconds
	refreshTimer = window.setInterval(() => {
		// Refresh in background without showing loading state
		loadGames(false)
	}, interval)
}

const stopAutoRefresh = () => {
	if (refreshTimer !== null) {
		clearInterval(refreshTimer)
		refreshTimer = null
	}
}

// Lifecycle
onMounted(() => {
	loadGames()
	startAutoRefresh()
})

onUnmounted(() => {
	stopAutoRefresh()
})

// Watch for player ID changes and reload immediately
watch(
	() => props.playerId,
	(newPlayerId, oldPlayerId) => {
		if (newPlayerId !== oldPlayerId) {
			console.log('Player ID changed from', oldPlayerId, 'to', newPlayerId)
			stopAutoRefresh()
			loadGames()
			startAutoRefresh()
		}
	},
)
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>
