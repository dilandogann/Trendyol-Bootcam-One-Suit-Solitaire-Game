const CardArray = [
    { value: 'A', nextValue: '2', image: require("./assets/hearts-ace.svg") },
    { value: 2, nextValue: 3, image: require("./assets/hearts-two.svg") },
    { value: 3, nextValue: 4, image: require("./assets/hearts-three.svg") },
    { value: 4, nextValue: 5, image: require("./assets/hearts-four.svg") },
    { value: 5, nextValue: 6, image: require("./assets/hearts-five.svg") },
    { value: 6, nextValue: 7, image: require("./assets/hearts-six.svg") },
    { value: 7, nextValue: 8, image: require("./assets/hearts-seven.svg") },
    { value: 8, nextValue: 9, image: require("./assets/hearts-eight.svg") },
    { value: 9, nextValue: 10, image: require("./assets/hearts-nine.svg") },
    { value: 10, nextValue: 'J', image: require("./assets/hearts-ten.svg") },
    { value: 'J', nextValue: 'Q', image: require("./assets/hearts-joker.svg") },
    { value: 'Q', nextValue: 'K', image: require("./assets/hearts-queen.svg") },
    { value: 'K', nextValue: null, image: require("./assets/hearts-king.svg") },
];
export default CardArray;
