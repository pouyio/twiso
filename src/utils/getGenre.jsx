const genres = {
    action: {
        name: "Acción",
        emoji: "👊"
    },
    adventure: {
        name: "Aventura",
        emoji: "🗺"
    },
    animation: {
        name: "Animación",
        emoji: "👾"
    },
    anime: {
        name: "Anime",
        emoji: "🇯🇵"
    },
    comedy: {
        name: "Comedia",
        emoji: "😆"
    },
    crime: {
        name: "Crimen",
        emoji: "💣"
    },
    documentary: {
        name: "Documental",
        emoji: "🗃"
    },
    drama: {
        name: "Drama",
        emoji: "👥"
    },
    family: {
        name: "Familiar",
        emoji: "👨‍👩‍👧‍👦"
    },
    fantasy: {
        name: "Fanstasía",
        emoji: "🐲"
    },
    history: {
        name: "Histórica",
        emoji: "📜"
    },
    holiday: {
        name: "Vacaciones",
        emoji: "🏖"
    },
    horror: {
        name: "Terror",
        emoji: "👹"
    },
    music: {
        name: "Música",
        emoji: "🎤"
    },
    musical: {
        name: "Musical",
        emoji: "🎶"
    },
    mystery: {
        name: "Misterio",
        emoji: "🔍"
    },
    none: {
        name: "Ninguna",
        emoji: "❌"
    },
    romance: {
        name: "Romántica",
        emoji: "💕"
    },
    "science-fiction": {
        name: "Ciencia-ficción",
        emoji: "🚀"
    },
    short: {
        name: "Corto",
        emoji: "🎥"
    },
    "sporting-event": {
        name: "Deportes",
        emoji: "⚽️"
    },
    superhero: {
        name: "Superhéroes",
        emoji: "💪🏻"
    },
    suspense: {
        name: "Suspense",
        emoji: "⏸"
    },
    thriller: {
        name: "Thriller",
        emoji: "🔪"
    },
    war: {
        name: "Bélica",
        emoji: "⚔️"
    },
    western: {
        name: "Western",
        emoji: "🏜"
    }
};

export default function getGenre(genre) {

    return genres[genre] || {
        name: genre, emoji: '❓'

    }
}