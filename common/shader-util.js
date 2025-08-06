function $$(str) {
    if (!str) return null;
    if (str.startsWith('#')) {
        return document.querySelector(str);
    }
    let result = document.querySelectorAll(str);
    if (result.length === 1) {
        return result[0];
    }
    return result;
}

const enums = {
    FLOAT_VEC2: {
        value: 0x8b50,
        setter: function (location, v) {
            gl.uniform2fv(location, v);
        }
    },
    FLOAT_VEC3: {
        value: 0x8b51,
        setter: function (location, v) {
            console.log(v);
            gl.uniform3fv(location, v);
        }
    },
    FLOAT_VEC4: {
        value: 0x8b52,
        setter: function (location, v) {
            gl.uniform4fv(location, v);
        }
    },
    INT_VEC2: {
        value: 0x8b53,
        setter: function (location, v) {
            gl.uniform2iv(location, v);
        }
    },
    INT_VEC3: {
        value: 0x8b54,
        setter: function (location, v) {
            gl.uniform3iv(location, v);
        }
    },
    INT_VEC4: {
        value: 0x8b55,
        setter: function (location, v) {
            gl.uniform4iv(location, v);
        }
    },
    BOOL: {
        value: 0x8b56,
        setter: function (location, v) {
            gl.uniform1iv(location, v);
        }
    },
    BOOL_VEC2: {
        value: 0x8b57,
        setter: function (location, v) {
            gl.uniform2iv(location, v);
        }
    },
    BOOL_VEC3: {
        value: 0x8b58,
        setter: function (location, v) {
            gl.uniform3iv(location, v);
        }
    },
    BOOL_VEC4: {
        value: 0x8b59,
        setter: function (location, v) {
            gl.uniform4iv(location, v);
        }
    },
    FLOAT_MAT2: {
        value: 0x8b5a,
        setter: function (location, v) {
            gl.uniformMatrix2fv(location, false, v);
        }
    },
    FLOAT_MAT3: {
        value: 0x8b5b,
        setter: function (location, v) {
            gl.uniformMatrix3fv(location, false, v);
        }
    },
    FLOAT_MAT4: {
        value: 0x8b5c,
        setter: function (location, v) {
            gl.uniformMatrix4fv(location, false, v);
        }
    },
    SAMPLER_2D: {
        value: 0x8b5e,
        setter: function (location, texture) {
            gl.uniform1i(location, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
        }
    },
    SAMPLER_CUBE: {
        value: 0x8b60,
        setter: function (location, texture) {
            gl.uniform1i(location, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        }
    },

    INT: {
        value: 0x1404,
        setter: function (location, v) {
            gl.uniform1i(location, v);
        }
    },

    FLOAT: {
        value: 0x1406,
        setter: function (location, v) {
            gl.uniform1f(location, v);
        }
    }
};

function getKeyFromType(type) {
    for (let i in enums) {
        if (enums[i].value === type) {
            return i;
        }
    }
}

function getContext(canvas) {
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

function createShaderFromScript(gl, type, scriptId) {
    let sourceScript = $$('#' + scriptId);
    if (!sourceScript) {
        return null;
    }
    return createShader(gl, type, sourceScript.innerHTML);
}

/**
 * @returns 返回着色器对象
 * @param gl WebGL 上下文。
 * @param type 着色器类型，gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER。
 * @param str 着色器代码字符串。
 */
function createShaderFromString(gl, type, str) {
    return createShader(gl, type, str);
}

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // 检测是否编译正常。
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgramHolder(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    vertexShader && gl.attachShader(program, vertexShader);
    fragmentShader && gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let result = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (result) {
        console.log('着色器程序创建成功');
        let uniformSetters = createUniformSetters(gl, program);
        let attributeSetters = createAttributeSetters(gl, program);
        return {
            program: program,
            uniformSetters: uniformSetters,
            attributeSetters: attributeSetters
        };
    }
    let errorLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw errorLog;
}

function createUniformSetters(gl, program) {
    let uniformSetters = {};
    let uniformsCount = getVariableCounts(gl, program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformsCount; i++) {
        let uniformInfo = gl.getActiveUniform(program, i);
        if (!uniformInfo) {
            break;
        }
        let name = uniformInfo.name;
        if (name.substr(-3) === '[0]') {
            name = name.substr(0, name.length - 3);
        }
        uniformSetters[name] = createUniformSetter(gl, program, uniformInfo);
    }
    return uniformSetters;
}

function createUniformSetter(gl, program, uniformInfo) {
    let uniformLocation = gl.getUniformLocation(program, uniformInfo.name);
    let type = uniformInfo.type;
    let isArray = uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]';

    if (isArray && type === enums.INT.value) {
        return function (v) {
            gl.uniform1iv(uniformLocation, v);
        };
    }
    if (isArray && type === enums.FLOAT.value) {
        return function (v) {
            gl.uniform1fv(uniformLocation, v);
        };
    }
    return function createSetter(v) {
        return enums[getKeyFromType(type)].setter(uniformLocation, v);
    };
}

function createAttributeSetters(gl, program) {
    let attributesCount = getVariableCounts(gl, program, gl.ACTIVE_ATTRIBUTES);
    let attributeSetter = {};
    for (let i = 0; i < attributesCount; i++) {
        let attributeInfo = gl.getActiveAttrib(program, i);
        let attributeIndex = gl.getAttribLocation(program, attributeInfo.name);
        attributeSetter[attributeInfo.name] = createAttributeSetter(
            gl,
            attributeIndex
        );
    }
    return attributeSetter;
}

function createAttributeSetter(gl, attributeIndex) {
    return function (bufferInfo) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);
        gl.enableVertexAttribArray(attributeIndex);
        gl.vertexAttribPointer(
            attributeIndex,
            bufferInfo.numsPerElement || bufferInfo.size,
            bufferInfo.type || gl.FLOAT,
            bufferInfo.normalize || false,
            bufferInfo.stride || 0,
            bufferInfo.offset || 0
        );
    };
}

function getVariableCounts(gl, program, type) {
    return gl.getProgramParameter(program, type);
}