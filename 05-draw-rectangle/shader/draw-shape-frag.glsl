// 设置浮点数精度为中等。
precision mediump float;

// 接收 JavaScript 传过来的颜色值（rgba）。
varying vec4 v_Color;

void main(){
    vec4 color = v_Color / vec4(255, 255, 255, 1);
    gl_FragColor = color;
}