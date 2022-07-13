const randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

function mapRange(value, inputMin, inputMax, outputMin, outputMax, clamp) {
    // Reference:
    // https://openframeworks.cc/documentation/math/ofMath/
    if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
        return outputMin;
    } else {
        var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
        if (clamp) {
            if (outputMax < outputMin) {
                if (outVal < outputMax) outVal = outputMax;
                else if (outVal > outputMin) outVal = outputMin;
            } else {
                if (outVal > outputMax) outVal = outputMax;
                else if (outVal < outputMin) outVal = outputMin;
            }
        }
        return outVal;
    }
}

const degToRad = (degrees) => {
	return degrees / 180 * Math.PI;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}