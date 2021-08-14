const CardArray = [
    { value: 'A', nextValue: 2, image: require("./assets/hearts-ace.jpg") },
    { value: 2, nextValue: 3, image: require("./assets/hearts-two.jpg") },
    { value: 3, nextValue: 4, image: require("./assets/hearts-three.jpg") },
    { value: 4, nextValue: 5, image: require("./assets/hearts-four.jpg") },
    { value: 5, nextValue: 6, image: require("./assets/hearts-five.jpg") },
    { value: 6, nextValue: 7, image: require("./assets/hearts-six.jpg") },
    { value: 7, nextValue: 8, image: require("./assets/hearts-seven.jpg") },
    { value: 8, nextValue: 9, image: require("./assets/hearts-eight.jpg") },
    { value: 9, nextValue: 10, image: require("./assets/hearts-nine.jpg") },
    { value: 10, nextValue: 'J', image: require("./assets/hearts-ten.jpg") },
    { value: 'J', nextValue: 'Q', image: require("./assets/hearts-joker.jpg") },
    { value: 'Q', nextValue: 'K', image: require("./assets/hearts-queen.jpg") },
    { value: 'K', nextValue: null, image: require("./assets/hearts-king.jpg") },
];
export default CardArray;
