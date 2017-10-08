import * as React from 'react';
import {StyleSheet, css} from 'aphrodite';
import * as AnimatedNumber from 'react-animated-number';

import {IPage} from '../types';
import STYLES from '../styles';

import Wheel from './Wheel';
import Gear from './Gear';    

const styles = StyleSheet.create({ 
    page:        {
        marginTop: '5em',  
        display:   'block',
        boxSizing: 'border-box',
        height:    'calc(100vh - 5em)'
    },
    pageTitle: {
        position : 'absolute',
        left     : '50%',
        textAlign: 'center',
        transform: 'translate(-50%,0)',
        fontSize : '28px'
    },
    pageSubtitle: {
        lineHeight: '2em',
        fontSize  : '18px'
    },
    developmentContainer: {
        ...STYLES.FONT.BODY_SMALL,
        ...STYLES.POSITIONING.CONTAINER,
        width:  '50%',
        height: '100%'
    },
    content:     STYLES.POSITIONING.CENTERED_CONTENT,
    row:         {
        display:  'block',
        height:   '50%',
        position: 'relative',
        ':after': {
            clear: 'both'
        }
    }
});

const DEFAULT_ANIMATED_NUMBER_PROPS = {
    duration:      250,
    formatValue:   n => n.toFixed(2),
    stepPrecision: 2,
    frameStyle:    percent => {
        const percentLeft = (100 - percent) * 0.01;
        const textRGB     = 255 * percentLeft;

        return {
            verticalAlign  : 'top',
            fontSize       : '2em',
            backgroundColor: `rgba(0,0,0,${percentLeft})`,
            color          : `rgb(${textRGB},${textRGB},${textRGB})`
        };
    }
};

export default class DrivetrainPage extends React.PureComponent<IPage, any> {
    wheel: Wheel | null;
    gear: Gear | null;

    cadence = 80;

    state = {
        development:  0,
        hourDistance: 0,
        hourUnit:     '--',
        unit:         '--'
    };

    componentDidMount() {
        this.onRenderUpdateChild();
    }

    onRenderUpdateChild = () => {
        if (this.wheel && this.gear) {
            let {circumference, unit} = this.wheel.state;

            const FACTOR_UNIT = unit === 'cm' ? 1 / 100 : 1 / 12;
            const isMetric    = unit === 'cm';
            unit              = isMetric ? 'meters' : 'feet';

            const hourUnit   = isMetric ? 'km' : 'mi';
            const hourFactor = isMetric ? 1 / 1000 : 1 / 5280;

            const development = FACTOR_UNIT * circumference * this.gear.state.ratio

            this.setState({
                unit,
                development:  development,
                hourDistance: development * this.cadence * 60 * hourFactor,
                hourUnit
            });
        }
    };

    renderClassNames = () => ({
        page                : css(styles.page),
        pageTitle           : css(styles.pageTitle),
        pageSubtitle           : css(styles.pageSubtitle),
        developmentContainer: css(styles.developmentContainer),
        content             : css(styles.content),
        row                 : css(styles.row)
    });

    render() {
        const {development, unit, hourDistance, hourUnit} = this.state;
        const className                                   = this.renderClassNames();

        return (
            <div className={className.page}>
                <div className={className.pageTitle}>
                    <a href="https://bicycles.stackexchange.com/search?q=development" target="_blank">Development</a>
                    &nbsp;Calculator
                    <div className={className.pageSubtitle}>
                        How far will your gearing take you?
                    </div>
                </div>

                <Gear
                    onRenderUpdate={this.onRenderUpdateChild}
                    ref={el => this.gear = el}
                />

                <div className={className.row}>
                    <Wheel
                        diameter={34.9}
                        unit='cm'
                        onRenderUpdate={this.onRenderUpdateChild}
                        ref={el => this.wheel = el}
                    />
                    <div className = {className.developmentContainer}>
                    <div className = {className.content} style = {{ textAlign:'left'}}>
                            <AnimatedNumber {...DEFAULT_ANIMATED_NUMBER_PROPS} value={this.gear && this.gear.state.ratio}/> gear ratio
                            <br/>

                            <AnimatedNumber {...DEFAULT_ANIMATED_NUMBER_PROPS} value={development}/> {unit} per revolution
                            <br/><br/>

                            <AnimatedNumber {...DEFAULT_ANIMATED_NUMBER_PROPS} value={hourDistance}/> {hourUnit}/h @ {this.cadence} RPM
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
