import * as React from 'react';
import {StyleSheet, css} from 'aphrodite';
import STYLES from '../styles';

import { playSound } from '../audio';

interface IGearProps {
  onRenderUpdate?: Function;
}

const styles = StyleSheet.create({
  container: {
    ...STYLES.FONT.BODY_SMALL,
    position: 'relative',
    height  : '50%',
    ':after': {
      clear : 'both'
    }
  },
  field: {
    fontSize     : '2em',
    verticalAlign: 'top'
  },
  halfWidth: {
    width   : '50%',
    height  : '100%',
    display : 'inline-block',
    float   : 'left',
    position: 'relative'
  },
  teethCount : {
    position : 'absolute',
    top      : '50%',
    left     : '50%',
    transform: 'translate(-50%, -50%)'
  },
  heading : {
    fontSize: '1.2em'
  },
  modifiers: {
    position:'relative',
    ':not(:empty) > button' : {
      height    : '2em',
      width     : '50%',
      fontSize  : '1em',
      background: 'rgb(32,32,32)',
      color     : 'rgb(255,255,255)',
      border    : 'none'
    }
  },
  countDisplay : {
    textAlign: 'center',
    margin: '0.5em 0'
  },
  ratioDisplay: {
    position : 'absolute',
    bottom   : '0',
    left     : '50%',
    transform: 'translateX(-50%)'
  }
});

export default class Gear extends React.PureComponent<IGearProps, any> {
  state = {
    teethCountFront: 32,
    teethCountRear: 14,
    ratio: 32 / 14
  };

  calculateRatio = ({ teethCountFront, teethCountRear }) => {
    this.setState({ ratio: teethCountFront / teethCountRear });
  };

  componentDidUpdate() {
    this.props.onRenderUpdate && this.props.onRenderUpdate();
    playSound('ratchet.mp3');
  }

  onChangeTeethCountFront = e => {
    const teethCountFront = e.target.value;

    if(teethCountFront > 5) {
      this.setState({ teethCountFront });
      this.calculateRatio({ teethCountRear: this.state.teethCountRear, teethCountFront });
    }
  };

  onAddTeethCountFront = () => this.onChangeTeethCountFront({target:{value:this.state.teethCountFront + 1}});
  onRemoveTeethCountFront = () => this.onChangeTeethCountFront({target:{value:this.state.teethCountFront - 1}});

  onChangeTeethCountRear = e => {
    const teethCountRear = e.target.value;

    if(teethCountRear > 5) {
      this.setState({ teethCountRear });
      this.calculateRatio({ teethCountFront: this.state.teethCountFront, teethCountRear });
    }
  };

  onAddTeethCountRear = () => this.onChangeTeethCountRear({target:{value:this.state.teethCountRear + 1}});
  onRemoveTeethCountRear = () => this.onChangeTeethCountRear({target:{value:this.state.teethCountRear - 1}});

  renderClassNames = () => ({
    container   : css(styles.container),
    field       : css(styles.field),
    halfWidth   : css(styles.halfWidth),
    teethCount  : css(styles.teethCount),
    heading     : css(styles.heading),
    modifiers   : css(styles.modifiers),
    countDisplay: css(styles.countDisplay),
    ratioDisplay: css(styles.ratioDisplay)
  });

  render() {
    const {
      container,
      field,
      halfWidth,
      teethCount,
      countDisplay,
      ratioDisplay,
      heading,
      modifiers
    } = this.renderClassNames();

    const { teethCountFront, teethCountRear } = this.state;

    return (
      <div className={container}>

        <div className={halfWidth}>
          <div className={teethCount}>
            <div className={heading}>Front chainring</div>
            <div className={countDisplay}>
              <span className={field}>{teethCountFront}</span> teeth
            </div>
            <div className={modifiers}>
              <button onClick={this.onAddTeethCountFront}>+</button>
              <button onClick={this.onRemoveTeethCountFront}>-</button>
            </div>
          </div>
        </div>

        <div className={halfWidth}>
          <div className={teethCount}>
            <div className={heading}>Rear sprocket</div>
            <div className={countDisplay}>
              <span className={field}>{teethCountRear}</span> teeth
            </div>
            <div className={modifiers}>
              <button onClick={this.onAddTeethCountRear}>+</button>
              <button onClick={this.onRemoveTeethCountRear}>-</button>
            </div>
          </div>
        </div>

        <div className={ratioDisplay}></div>
      </div>
    );
  }
}

