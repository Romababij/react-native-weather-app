import React, {Component} from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import HomeScreen from "./Views/Add/";
import SingleCity from "./Views/SingleCity/";
import SideBar from "./Views/SideBar/";


const AddScreen = DrawerNavigator({
   HomeScreen: { screen: HomeScreen },
   SingleCity: { screen: SingleCity }
},{
   initialRouteName : 'HomeScreen',
   contentComponent: props => <SideBar {...props} />
});

const CityScreen = DrawerNavigator({
   HomeScreen: { screen: HomeScreen },
   SingleCity: { screen: SingleCity }
},{
   initialRouteName : 'SingleCity',
   contentComponent: props => <SideBar {...props} />
});


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityChecker: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('savedIds', (err, result) => {
        if(result != null && result != '[]') {
          let firstCity = JSON.parse(result);
          this.setState({
            firstCity: firstCity[0],
            cityChecker: true
          });
        } else {
          this.setState({
            firstCity: '',
            cityChecker: false
          });
        }
    });
  }

  render(){
    if (this.state.cityChecker == true ){
      return (
         <CityScreen screenProps={this.state.firstCity} />
      ) 
    } else {
       return(
          <AddScreen />
        ) 
    }
   }
 }