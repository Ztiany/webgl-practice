// 设置浮点数据类型为中级精度
precision mediump float;

// 接收顶点坐标 (x, y)
attribute vec2 a_Position;

void main(){
    gl_Position = vec4(a_Position, 0, 1);
}