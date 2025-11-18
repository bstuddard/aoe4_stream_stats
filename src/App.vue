<template>
	<div class="min-h-screen">
		<RecentGames v-if="playerId" :playerId="playerId" />
		<div v-else class="flex items-center justify-center min-h-screen">
			<div class="text-center p-8">
				<h2 class="text-2xl font-bold text-white mb-4 drop-shadow-lg">
					No Player ID Provided
				</h2>
				<p class="text-white drop-shadow-lg">
					Add ?playerId=YOUR_PLAYER_ID to the URL
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Library
import { ref, onMounted } from 'vue';

// Local files
import RecentGames from '@/components/RecentGames.vue';

// State
const playerId = ref<string>('7228992'); // Default player ID - change this or use ?playerId=YOUR_ID in URL

// Get player ID from URL parameters (overrides default)
onMounted(() => {
	const urlParams = new URLSearchParams(window.location.search);
	const playerIdParam = urlParams.get('playerId');
	
	if (playerIdParam) {
		playerId.value = playerIdParam;
		console.log('Player ID from URL:', playerIdParam);
	} else {
		console.log('Using default player ID:', playerId.value);
	}
});
</script>

<style scoped></style>
