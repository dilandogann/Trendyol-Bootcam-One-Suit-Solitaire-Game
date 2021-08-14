export default class Card {

    constructor(id, value, next, image) {
        this.id = id
        this.value = value;
        this.next = next
        this.image = image
        this.showFront = false
    }
}