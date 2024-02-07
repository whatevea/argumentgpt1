export const generateRandomRoomId = () => {
    return Array.from({ length: 8 }, () => Math.random() > 0.5 ? String.fromCharCode(Math.floor(Math.random() * 26) + 97) : Math.floor(Math.random() * 10)).join('');
};