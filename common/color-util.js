const random = Math.random;

function randomColor() {
    return {
        r: random() * 255,
        g: random() * 255,
        b: random() * 255,
        a: random()
    };
}