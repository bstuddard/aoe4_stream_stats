// Quick test script for useAOE4API
// Usage: node tests/test-api.js [playerId]
import useAOE4API from '../src/composables/useAOE4API.ts';

const TEST_PLAYER_ID = process.argv[2] || '7228992'; // Default to 7228992 if no player ID provided

async function testAPI() {
	console.log('Testing AoE4 API...\n');
	
	const { fetchPlayerRecentGames } = useAOE4API();
	
	try {
		console.log(`Fetching last 10 games for player ${TEST_PLAYER_ID}...\n`);
		
		const games = await fetchPlayerRecentGames(TEST_PLAYER_ID);
		
		console.log('Results:');
		console.log('--------');
		games.forEach((game, index) => {
			const emoji = game.result === 'win' ? '✅' : game.result === 'loss' ? '❌' : '❓';
			const ownElo = game.own_team_elo ? game.own_team_elo : 'N/A';
			const oppElo = game.opponent_team_elo ? game.opponent_team_elo : 'N/A';
			const eloDiff = game.own_team_elo && game.opponent_team_elo 
				? (game.own_team_elo - game.opponent_team_elo >= 0 ? '+' : '') + (game.own_team_elo - game.opponent_team_elo)
				: 'N/A';
			
			console.log(`${index + 1}. ${emoji} ${game.result?.toUpperCase() || 'UNKNOWN'} | ${game.game_mode} | Own: ${ownElo} vs Opp: ${oppElo} (${eloDiff})`);
		});
		
		const wins = games.filter(g => g.result === 'win').length;
		const losses = games.filter(g => g.result === 'loss').length;
		console.log(`\nSummary: ${wins}W - ${losses}L`);
		
	} catch (error) {
		console.error('Error:', error.message);
	}
}

testAPI();

