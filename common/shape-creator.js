/**
 * 创建一个圆形顶点数组。第一个点是圆心，其余点是圆周上的顶点。适用于使用
 * TRIANGLE_FAN 绘制圆形。
 * @param x 圆心 x 坐标
 * @param y 圆心 y 坐标
 * @param radius 圆的半径
 * @param granularity 圆的分段数，决定圆的平滑度
 * @param color {number[]} 圆的颜色，格式为 [r, g, b, a]，默认值为 [255, 0, 0, 1]（红色）。
 * @return {(*|number)[]} 返回一个包含圆形顶点的数组。
 */
function createCircleVertex(x, y, radius, granularity, color = [255, 0, 0, 1]) {
    // 创建容器，将第一个点设置为圆圈中心。
    const positions = [
        x, y,
        color[0],
        color[1],
        color[2],
        color[3]
    ];
    for (let i = 0; i <= granularity; i++) {
        // 角度转为弧度。
        const angle = (i * Math.PI * 2) / granularity;
        positions.push(
            // 计算圆周上每个点的坐标。
            x + radius * Math.sin(angle),
            y + radius * Math.cos(angle),
            // 使用传入的颜色值。
            color[0],
            color[1],
            color[2],
            color[3]
        );
    }
    return positions;
}

/**
 * 创建一个圆形顶点数组。第一个点是圆心，其余点是圆周上的顶点。适用于使用
 * TRIANGLE_FAN 绘制圆形。每个顶点都有随机颜色。
 * @param x 圆心 x 坐标
 * @param y 圆心 y 坐标
 * @param radius 圆的半径
 * @param granularity 圆的分段数，决定圆的平滑度
 * @return {(*|number)[]} 返回一个包含圆形顶点的数组。
 */
function createCircleVertexWithRandomColor(x, y, radius, granularity) {
    // 创建容器，将第一个点设置为圆圈中心。
    let color = randomColor();
    const positions = [
        x,
        y,
        color.r,
        color.g,
        color.b,
        color.a
    ];

    for (let i = 0; i <= granularity; i++) {
        // 角度转为弧度。
        const angle = (i * Math.PI * 2) / granularity;
        color = randomColor();
        positions.push(
            // 计算圆周上每个点的坐标，使用的三角函数是 sin 和 cos。
            x + radius * Math.sin(angle),
            y + radius * Math.cos(angle),
            // 随机颜色
            color.r,
            color.g,
            color.b,
            color.a
        );
    }
    return positions;
}

/**
 * 创建一个环形顶点数组。
 * @param x 圆环心 x 坐标
 * @param y 圆环心 y 坐标
 * @param innerRadius 内圆半径
 * @param outerRadius 外圆半径
 * @param granularity 圆环的分段数，决定圆环的平滑度
 * @returns {{indices: *[], positions: *[]}}
 */
function createRingVertexWithRandomColor(x, y, innerRadius, outerRadius, granularity) {
    let i;
    const positions = [];
    let color = randomColor();

    for (i = 0; i <= granularity; i++) {
        if (i % 2 === 0) {
            color = randomColor();
        }

        // 角度转为弧度。
        const angle = (i * Math.PI * 2) / granularity;

        // 内圆的顶点
        positions.push(
            x + innerRadius * Math.sin(angle),
            y + innerRadius * Math.cos(angle),
            color.r,
            color.g,
            color.b,
            color.a
        );

        // 外圆的顶点
        positions.push(
            x + outerRadius * Math.sin(angle),
            y + outerRadius * Math.cos(angle),
            color.r,
            color.g,
            color.b,
            color.a
        );
    }

    // 将内圆和外圆的顶点连接起来，形成环形。
    const indices = [];
    for (i = 0; i < granularity; i++) {
        const p0 = i * 2;
        const p1 = i * 2 + 1;
        let p2 = (i + 1) * 2 + 1;
        let p3 = (i + 1) * 2;
        if (i === granularity - 1) {
            p2 = 1;
            p3 = 0;
        }
        indices.push(p0, p1, p2, p2, p3, p0);
    }

    return {
        positions: positions,
        indices: indices,
    };
}
