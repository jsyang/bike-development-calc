import * as React from 'react';
import {StyleSheet, css} from 'aphrodite';

import STYLES from '../styles';
import { playSound } from '../audio';

const styles = StyleSheet.create({    
    field: {
        appearance: 'none',
        opacity   : 0,
        position  : 'absolute',
        top       : 0,
        left      : 0,
        width     : '100%',
        height    : '100%'
    },
    rimName: {
        ...STYLES.FONT.BODY_SMALL,
        position    : 'relative',
        fontSize    : '2em',
        fontWeight  : 'bold',
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        marginBottom: '0.5em'
    }
});

interface IRimSizeProps {
    onChangeRim?: Function;
}

// In centimeters
const RIM_SIZES = {
    'custom'                      : 0,
    'Razor Scooter (100mm)'       : 10.0,
    'Wheelchair Castor (137mm)'   : 13.7,
    'Wheelchair Castor (152mm)'   : 15.2,
    '6 inch Trolley (150mm)'      : 15.0,
    '8 inch Scooter (200mm)'      : 20.0,
    '12 inch Child (ISO 302)'     : 30.2,
    '16 inch Brompton (ISO 349)'  : 34.9,
    '18 inch Birdy (ISO 355)'     : 35.5,
    '17 inch Moulton AM (ISO 369)': 36.9,
    '20 inch BMX (ISO 406)'       : 40.6,
    '20 inch Schwinn (ISO 419)'   : 419,
    '20 inch Recumbent (ISO 451)' : 45.1,
    '24 inch MTB (ISO 507)'       : 50.7,
    '24 inch Terry (ISO 520)'     : 52.0,
    '24 inch E6 (ISO 540)'        : 54.0,
    '24 inch S5 (ISO 547)'        : 54.7,
    '26 inch MTB (ISO 559)'       : 55.9,
    '27 inch (ISO 630)'           : 63.0,
    '27 inch 650b (ISO 584)'      : 58.4,
    '28 inch 650c (ISO 571)'      : 57.1,
    '28 inch (ISO 635)'           : 63.5,
    '29 inch 700c (ISO 622)'      : 62.2
};

export default class RimSize extends React.PureComponent<IRimSizeProps, any> {
    state = {
        diameterCM: 0,
        name: 'custom'
    };

    setToCustomType = () => this.setState({diameterCM: 0, name: 'custom'});

    onChange = e => {
        const value = e.currentTarget.value;
        this.setState({ 
            diameterCM: value,
            name      : e.currentTarget.querySelector(`option[value="${value}"]`).innerHTML
        });
        playSound('delete.mp3');
    };

    componentDidUpdate() {
        if(this.state.name !=='custom') {
            this.props.onChangeRim && this.props.onChangeRim();
        }
    }

    renderClassNames = () => ({
        field  : css(styles.field),
        rimName: css(styles.rimName)
    });

    render() {
        const { field, rimName } = this.renderClassNames();
        const { diameterCM, name } = this.state;

        const options = Object.keys(RIM_SIZES)
            .map((name, key) => <option value={RIM_SIZES[name]} key={key}>{name}</option>);

        return (
            <div className={rimName}>
                {name}
                <select 
                    onChange={this.onChange}
                    className={field} 
                    value={diameterCM}
                >{options}</select>
            </div>
        );
    }
}