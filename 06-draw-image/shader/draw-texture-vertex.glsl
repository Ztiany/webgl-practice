// 设置浮点数精度为中等精度。
precision mediump float;

// 接收顶点坐标 (x, y)
attribute vec2 a_Position;
// 接收浏览器窗口尺寸(width, height)
attribute vec2 a_Screen_Size;
// 接收 JavaScript 传递过来的顶点 uv 坐标。
attribute vec2 a_Uv;

// 将接收的 uv 坐标传递给片元着色器
varying vec2 v_Uv;

void main(){
    // 将顶点坐标转换为标准化设备坐标(NDC)
    vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
    position = position * vec2(1.0, -1.0);
    gl_Position = vec4(position, 0, 1);

    //  将接收到的 uv 坐标传递给片元着色器
    v_Uv = a_Uv;
}
