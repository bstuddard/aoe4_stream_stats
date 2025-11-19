<template>
	<div class="p-4">
		<RecentGames v-if="playerId" :playerId="playerId" />
		<div v-else class="max-w-md mx-auto">
			<div
				class="bg-gradient-to-br from-slate-900/75 via-slate-800/75 to-slate-900/75 backdrop-blur-md rounded-xl border-4 border-amber-500/70 shadow-[0_0_30px_rgba(217,119,6,0.3)] p-8"
			>
				<h2
					class="text-2xl font-bold text-white mb-4 drop-shadow-[0_3px_6px_rgba(0,0,0,1)] text-center"
				>
					⚠️ No Player ID Provided
				</h2>
				<p class="text-white drop-shadow-[0_3px_6px_rgba(0,0,0,1)] text-center">
					Add ?playerId=YOUR_PLAYER_ID to the URL
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Library
import { ref, onMounted } from 'vue'

// Local files
import RecentGames from '@/components/RecentGames.vue'

// State
const playerId = ref<string>('7228992') // Default player ID - change this or use ?playerId=YOUR_ID in URL

// Get player ID from URL parameters (overrides default)
onMounted(() => {
	const urlParams = new URLSearchParams(window.location.search)
	const playerIdParam = urlParams.get('playerId')

	if (playerIdParam) {
		playerId.value = playerIdParam
		console.log('Player ID from URL:', playerIdParam)
	} else {
		console.log('Using default player ID:', playerId.value)
	}
})
</script>

<style scoped></style>
