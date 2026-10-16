
export const texturesNames = {
    error: 0,
    grass: 1,
    dirt: 2,
    grassdirt: 3
}

export const blocksInfo = [
    {
    },
    {
        name: "grass",
        textures: [
            texturesNames.grass,
            texturesNames.dirt,
            
            texturesNames.grassdirt,
            texturesNames.grassdirt,
            texturesNames.grassdirt,
            texturesNames.grassdirt,
        ]
    },
    {
        name: "dirt",
        textures: [
            texturesNames.dirt,
            texturesNames.dirt,
            texturesNames.dirt,
            texturesNames.dirt,
            texturesNames.dirt,
            texturesNames.dirt
        ]
    }
]
