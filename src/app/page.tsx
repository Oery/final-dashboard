import { supabase } from "@/utils/supabaseClient";
import { HypixelPlayer } from "@/utils/hypixelPlayer";
import "./globals.css";

async function getGoals() {
    const { data, error } = await supabase.from("goals").select("*");
    if (error) return [];
    return data;
}

async function updateGoal(goal: string, value: number) {
    const { data, error } = await supabase.from("goals").update({ value: value }).eq("name", goal);
    if (error) return;
    return data;
}

async function updateHypixelGoals() {
    const player = new HypixelPlayer("8bc4ea42dae4422aa2d7ae2b0415f802");
    await player.fetch();

    const stats = player.getStats();
    for (const goal in stats) {
        await updateGoal(goal, stats[goal as keyof typeof stats]);
    }
}

const goalsOrder = ["subscribers", "bedwars_level", "bedwars_final_kills", "bedwars_wins", "bedwars_fkdr", "duels_uhc_wins"];

function sortGoals(a: any, b: any) {
    return goalsOrder.indexOf(a.name) - goalsOrder.indexOf(b.name);
}

export const revalidate = 0;

export default async function Home() {
    const goals = await getGoals();
    goals.sort(sortGoals);

    for (const goal of goals) {
        goal.updated_at = new Date(goal.updated_at);

        if (typeof goal.value == "number" && goal.value.toString().includes(".")) {
            goal.value = goal.value.toFixed(2);
        } else if (typeof goal.value == "number") {
            goal.value = goal.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            goal.target = goal.target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }

    for (const goal of goals) {
        if (goal.name == "subscribers") continue;
        if (new Date().getTime() - goal.updated_at.getTime() > 86400000) {
            await updateHypixelGoals();
            break;
        }
    }

    return (
        <main>
            <ul>
                {goals.map((goal) => (
                    <div key={goal.id} className="card">
                        <h2>{goal.display_name}</h2>
                        <p>
                            {goal.value} / {goal.target}
                        </p>
                    </div>
                ))}
            </ul>
        </main>
    );
}
