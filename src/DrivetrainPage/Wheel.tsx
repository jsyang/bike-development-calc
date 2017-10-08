import * as React from 'react';
import {StyleSheet, css} from 'aphrodite';

import STYLES from '../styles';
import RimSize from './RimSize';

const CONVERT_TO = {
    in: 1 / 2.54,
    cm: 2.54
};

const UNITS = {
    'inches': 'in',
    'cm': 'cm'
};

const styles = StyleSheet.create({
    container: {
        height   : '100%',
        display  : 'inline-block',
        boxSizing: 'border-box',
        width    : '50%',
        float    : 'left',
        position : 'relative'
    },
    field: {
        ...STYLES.FONT.BODY_SMALL,
        fontSize    : '2em',
        textAlign   : 'right',
        border      : 'none',
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        borderRadius: 0,
        outline:'none'
    },
    unitField: {
        ...STYLES.FONT.BODY_SMALL,
        fontSize     : '1em',
        verticalAlign: 'top',
        border       : 'none',
        borderBottom : '1px solid rgba(0,0,0,0.2)',
        appearance   : 'none',
        borderRadius : 0,
        position     : 'relative',
        background   : 'none',
        outline      : 'none',
        marginLeft   : '0.25em'
    },
    content: {
        position : 'absolute',
        top      : '50%',
        left     : '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
    },
    heading: {
        fontSize: '1.2em'
    }
});

interface IWheelProps {
    onRenderUpdate?: Function;
    diameter : number;
    unit: string;
}

export default class Wheel extends React.PureComponent<IWheelProps, any> {
    rimSize: any;

    state = {
        diameter     : this.props.diameter,
        unit         : this.props.unit,
        circumference: 0
    };

    componentWillMount() {
        this.calculateCircumference(this.state.diameter);
    }

    calculateCircumference = diameter => {
        this.setState({ circumference: parseFloat((Math.PI * diameter).toFixed(2)) });
    };

    setUnit = unit => this.setState({ unit });

    setDiameter = diameter => {
        this.calculateCircumference(diameter);
        this.setState({ diameter });
    };

    onChangeUnit = e => {
        const unit = e.currentTarget.value;

        this.setUnit(unit);
        const { diameter } = this.state;

        const sigDigs2 = Math.round(diameter * CONVERT_TO[unit] * 100) / 100;
        this.setDiameter(sigDigs2);
    };

    onChangeDiameter = e => {
        this.rimSize.setToCustomType();
        this.setDiameter(parseFloat(e.currentTarget.innerText));
    };

    onChangeRim = () => {
        if(this.rimSize.state.diameterCM !== null) {
            this.setUnit('cm');
            this.setDiameter(this.rimSize.state.diameterCM);
        }
    };

    componentDidUpdate() {
        this.props.onRenderUpdate && this.props.onRenderUpdate();
    }

    renderClassNames = () => ({
        container    : css(styles.container),
        field        : css(styles.field),
        unitField    : css(styles.unitField),
        content      : css(styles.content),
        heading      : css(styles.heading)
    });

    render() {
        const className = this.renderClassNames();
        const { diameter, unit } = this.state;

        const optionsUnits = Object.keys(UNITS)
            .map(key => <option key={key} value={UNITS[key]}>{key}</option>);

        return (
            <div className={className.container}>
                <div className={className.content}>

                    <div className={className.heading}>Wheel type</div>

                    <RimSize 
                        onChangeRim={this.onChangeRim} 
                        ref={el => this.rimSize = el} 
                    />

                    <br/>

                    <div className={className.heading}>Wheel diameter</div>

                    <span
                        contentEditable
                        onBlur={this.onChangeDiameter} 
                        className={className.field}
                    >{diameter}</span>

                    <select 
                        onChange={this.onChangeUnit}
                        value={unit}
                        className={className.unitField}
                    >
                        {optionsUnits}
                    </select>
                </div>
            </div>
        );
    }
}