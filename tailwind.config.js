export const theme = {
    extend: {
        keyframes: {
            move: {
                '0%': { transform: 'translateX(0%)' },
                '100%': { transform: 'translateX(100%)' },
            },
        },
        animation: {
            move: 'move 3s linear infinite alternate',
        },
    },
};
