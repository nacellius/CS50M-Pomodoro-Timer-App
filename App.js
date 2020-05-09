import React from 'react';
import { Text, View, TouchableOpacity, TouchableHighlightBase } from 'react-native';

import styles from './AppStyle';
import FormattedTime from './FormattedTime';
import {vibrate} from './utils'

export default class App extends React.Component {

clockFunc = () => {};

  state = {
    increment: 1000,
    time: 6,
    workTime: 6,
    breakTime: 4,
    toggleText: 'Start',
    statusText: 'Paused!',
  }

  working = true;
  runTimer = false;
  repeat = false;


  decrementTime = () => {    
    this.clockFunc = setInterval(() => {
      console.log("decreasing time");
      this.setState(prevState => ({time: prevState.time - 1}));
    }, this.state.increment)
  }

  toggleTimer = () => {
    if (!this.runTimer){
      this.setState({toggleText: 'Pause'});
      this.startTimer();
    } else {
      this.setState({toggleText: 'Start'});
      this.pauseTimer();
    }
    this.updateStatus();
  }

  startTimer = () => {
    this.runTimer = true;
    this.decrementTime();
  }

  pauseTimer = () => {
    this.runTimer = false;
    clearInterval(this.clockFunc);
  }

  resetTimer = () => {
    this.setState({time: this.state.workTime, toggleText: 'Start'});
    this.runTimer = false;
    this.working = false;
    clearInterval(this.clockFunc);
    this.updateStatus();
  }

  timerComplete = () => {
    if (this.state.time < 1){
      vibrate();
      this.working = !this.working;
      clearInterval(this.clockFunc);
      if (this.working){
        this.setState({time: this.state.workTime});
      } else {
        this.setState({time: this.state.breakTime});
      }
    }
  }

  updateStatus = () => {

    if (this.runTimer && this.working){
      this.setState({statusText: 'Working!'});
    } else if (this.runTimer && !this.working){
      this.setState({statusText: 'Break Time!'});
    } else if (!this.runTimer) {
      this.setState({statusText: 'Paused!'});
    }
  }

  componentDidUpdate(prevProps, prevState){
    this.timerComplete();
  }

  componentWillUnmount() {
    clearInterval(this.clockFunc);
  }

  render() {
    
    return (
      <View style={styles.container}>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}> {this.state.statusText}</Text>
        </View>

        <View style={styles.timeContainer}>
          <FormattedTime time={this.state.time}/>
        </View>

        <View style={styles.topRow}>
          <TouchableOpacity style={styles.button} onPress={this.resetTimer}>
            <Text>Set Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.resetTimer}>
            <Text>Reset Time</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.button} onPress={this.toggleTimer}>
            <Text>{this.state.toggleText}</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}
