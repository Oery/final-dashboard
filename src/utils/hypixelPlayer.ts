interface Stats {
    bedwars_wins: number;
    bedwars_fkdr: number;
    bedwars_level: number;
    bedwars_final_kills: number;
    duels_uhc_wins: number;
}

export class HypixelPlayer {
    uuid: string;
    stats: any;

    constructor(uuid: string) {
        this.uuid = uuid;
        this.stats = {};
    }

    async fetch() {
        const response = await fetch(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&uuid=${this.uuid}`);
        this.stats = await response.json();
    }

    getFKDR() {
        const finalKills = this.stats.player.stats.Bedwars.final_kills_bedwars;
        const finalDeaths = this.stats.player.stats.Bedwars.final_deaths_bedwars;
        return finalKills / finalDeaths;
    }

    getStats(): Stats {
        return {
            bedwars_wins: this.stats.player.stats.Bedwars.wins_bedwars,
            bedwars_fkdr: this.getFKDR(),
            bedwars_level: this.stats.player.achievements.bedwars_level,
            bedwars_final_kills: this.stats.player.stats.Bedwars.final_kills_bedwars,
            duels_uhc_wins: this.stats.player.stats.Duels.uhc_duel_wins,
        };
    }
}
