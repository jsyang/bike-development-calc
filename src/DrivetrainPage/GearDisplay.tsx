import * as React from 'react';

// Possible use https://github.com/gliffy/canvas2svg for export

// GearDisplay adapted from
// https://stackoverflow.com/a/23532468

interface IDisplayProps {
    size: number;
    notches: number;
}

const PI2 = 2 * Math.PI;

const styles: any = {
    canvas: {
        verticalAlign: 'middle'
    }
};

const SIZE_SCALE = 30;

export default class Display extends React.PureComponent<IDisplayProps, any> {
    size = this.props.size;

    state = {
        notches: this.props.notches,
        canvasSize: this.props.notches * this.props.size * 2 / SIZE_SCALE
    };

    // O = outer
    // I = inner
    // values are %
    taperO = 50;
    taperI = 35;

    canvas: any;

    componentDidMount() {
        this.draw();
    }

    componentWillReceiveProps({ notches, size }) {
        this.setState({
            notches,
            canvasSize: notches * size * 2 / SIZE_SCALE
        });
        this.size = size;
    }

    componentDidUpdate() {
        this.draw();
    }

    draw() {
        const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'gray';

        const { canvasSize, notches } = this.state;
        const { size, taperO, taperI } = this;
        const cx = canvasSize / 2;
        const cy = canvasSize / 2;
        const radiusO = notches * size / SIZE_SCALE;
        const radiusI = radiusO - 5;

        // angle between notches
        const angle = PI2 / (notches * 2);
        // inner taper offset (100% = half notch)
        const taperAI = angle * taperI * 0.005;
        // outer taper offset
        const taperAO = angle * taperO * 0.005;

        let toggle = false;
        let a = angle; // angle iterator


        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.moveTo(cx + radiusO * Math.cos(taperAO), cy + radiusO * Math.sin(taperAO));

        for (; a <= PI2; a += angle) {
            // draw inner to outer line
            if (toggle) {
                ctx.lineTo(
                    cx + radiusI * Math.cos(a - taperAI),
                    cy + radiusI * Math.sin(a - taperAI)
                );
                ctx.lineTo(
                    cx + radiusO * Math.cos(a + taperAO),
                    cy + radiusO * Math.sin(a + taperAO)
                );
            }

            // draw outer to inner line
            else {
                ctx.lineTo(
                    cx + radiusO * Math.cos(a - taperAO),  // outer line
                    cy + radiusO * Math.sin(a - taperAO)
                );
                ctx.lineTo(
                    cx + radiusI * Math.cos(a + taperAI),  // inner line
                    cy + radiusI * Math.sin(a + taperAI)
                );
            }

            // switch level
            toggle = !toggle;
        }

        // close the final line
        ctx.closePath();
        ctx.fill();

        this.drawHole(ctx, cx, cy, radiusI);
    }

    drawHole(ctx, cx, cy, radiusI) {
        // "erase" mode (term simplified)
        ctx.globalCompositeOperation = 'destination-out';

        const radiusH = radiusI - 5;

        // create circle (full arc)
        ctx.beginPath();
        ctx.moveTo(cx + radiusH, cy);
        ctx.arc(cx, cy, radiusH, 0, PI2);
        ctx.closePath();

        // creates the hole
        ctx.fill();
    }

    render() {
        const { canvasSize } = this.state;
        return <canvas
            style={styles.canvas}
            width={canvasSize}
            height={canvasSize}
            ref={el => this.canvas = el}
        />;
    }
}
