export const typeEffectiveness = {
    Fire: ["Water", "Rock", "Ground"],
    Grass: ["Fire", "Flying", "Bug", "Poison", "Ice"],
    Water: ["Electric", "Grass"],
    Electric: ["Ground"],
    Rock: ["Water", "Grass", "Fighting", "Ground", "Steel"],
    Ground: ["Water", "Grass", "Ice"],
    Flying: ["Electric", "Rock", "Ice"],
    Bug: ["Fire", "Flying", "Rock"],
    Poison: ["Ground", "Psychic"],
    Psychic: ["Bug", "Ghost", "Dark"],
    Dark: ["Fighting", "Bug", "Fairy"],
    Ice: ["Fire", "Rock", "Steel", "Fighting"],
    Fighting: ["Flying", "Psychic", "Fairy"],
    Steel: ["Fire", "Fighting", "Ground"],
    Fairy: ["Poison", "Steel"],
    Normal: ["Fighting"],
};
