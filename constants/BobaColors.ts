// A mapping of colors to related drinks, so that the cards
// can be colored based on the drink type

type KeywordTier = {
    primary: string[];    // prioritize these
    secondary: string[];  // use these as fallback
}

export const BobaColors: Record<string, KeywordTier> = {
    red: {
        primary: ['grapefruit', 'strawberry', 'cranberry'],
        secondary: []
    },
    orange: {
        primary: ['peach', 'thai milk tea', 'orange'],
        secondary: []
    },
    yellow: {
        primary: ['mango', 'passionfruit', 'passion fruit', 'lemon'],
        secondary: []
    },
    green: {
        primary: ['matcha', 'honeydew', 'pandan', 'lime', 'wintermelon'],
        secondary: ['green', 'oolong']
    },
    blue: {
        primary: ['blueberry'],
        secondary: []
    },
    purple: {
        primary: ['taro', 'ube', 'lavender'],
        secondary: []
    },
    pink: {
        primary: ['strawberry milk'],
        secondary: []
    },
    brown: {
        primary: ['brown sugar', '3 guys', '2 ladies', 'caramel', 'chocolate', 'coffee', 'latte', 'trio', 'hojicha'],
        secondary: ['milk', 'black tea']
    }
};
