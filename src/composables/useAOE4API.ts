interface GameResult {
	game_id: number;
	result: string | null;
	game_mode: string;
	own_team_elo: number | null;
	opponent_team_elo: number | null;
	started_at: string;
}

export default function useAOE4API() {
	
	async function fetchPlayerRecentGames(playerId: string): Promise<GameResult[]> {
		const url: string = `https://aoe4world.com/api/v0/players/${playerId}/games?limit=10`;
		console.log('Fetching games from:', url);
		
		const response = await fetch(url);
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		console.log('API Response received:', data);
		
		const games: GameResult[] = data.games.slice(0, 10).map((game: any) => {
			// Find our player's team and result
			let result: string | null = null;
			let ourTeamIndex: number = -1;
			
			game.teams.forEach((team: any, teamIndex: number) => {
				team.forEach((playerWrapper: any) => {
					if (playerWrapper.player.profile_id === parseInt(playerId)) {
						result = playerWrapper.player.result;
						ourTeamIndex = teamIndex;
					}
				});
			});
			
			// Calculate our team's average ELO
			let ownTeamElo: number | null = null;
			if (ourTeamIndex !== -1) {
				const ourTeam = game.teams[ourTeamIndex];
				const elos: number[] = [];
				ourTeam.forEach((playerWrapper: any) => {
					const elo: number | null = playerWrapper.player.mmr || playerWrapper.player.rating;
					if (elo !== null && elo !== undefined) {
						elos.push(elo);
					}
				});
				if (elos.length > 0) {
					ownTeamElo = elos.reduce((sum: number, elo: number) => sum + elo, 0) / elos.length;
				}
			}
			
			// Calculate opponent team(s) average ELO
			let opponentTeamElo: number | null = null;
			if (ourTeamIndex !== -1) {
				const allOpponentElos: number[] = [];
				game.teams.forEach((team: any, teamIndex: number) => {
					if (teamIndex !== ourTeamIndex) {
						team.forEach((playerWrapper: any) => {
							const elo: number | null = playerWrapper.player.mmr || playerWrapper.player.rating;
							if (elo !== null && elo !== undefined) {
								allOpponentElos.push(elo);
							}
						});
					}
				});
				if (allOpponentElos.length > 0) {
					opponentTeamElo = allOpponentElos.reduce((sum: number, elo: number) => sum + elo, 0) / allOpponentElos.length;
				}
			}
			
			return {
				game_id: game.game_id,
				result: result,
				game_mode: game.kind || 'unknown',
				own_team_elo: ownTeamElo ? Math.round(ownTeamElo) : null,
				opponent_team_elo: opponentTeamElo ? Math.round(opponentTeamElo) : null,
				started_at: game.started_at
			};
		});
		
		return games;
	}
	
	return {
		fetchPlayerRecentGames
	};
}