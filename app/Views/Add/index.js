import React, { Component } from 'react';
import { 
  StyleSheet, 
  StatusBar,
  NavigationActions,
  AsyncStorage
} from "react-native";
import { 
  Container, 
  Header, 
  Title, 
  Item, 
  Left, 
  Icon, 
  Right, 
  Button, 
  Body, 
  Input, 
  Content,
  Text
} from "native-base";

import * as Animatable from "react-native-animatable";

export default class HomeScreen extends Component {
  getWeather() {
    
    function toTitleCase(str){
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    AsyncStorage.getItem('savedIds', (err, result) => {
      var cityName = toTitleCase(this.state.searchedCity),
          newObj = JSON.parse(result);
      console.log(cityName)
      if(result !== null) { 
        if(newObj.indexOf(cityName) === -1) {  
          var newNames = newObj.concat(cityName);
          AsyncStorage.setItem('savedIds', JSON.stringify(newNames));
        } else {
          console.log('Already exist')
        }
      } else {
        let array = new Array();
        array.push(cityName)
        AsyncStorage.setItem('savedIds', JSON.stringify(array));
      }
    });
    this.props.navigation.navigate('SingleCity', {data: this.state});
  }

  // componentWillMount(){
  //   //this.getWeather();
  // }

  render() {
    return (
      <Container style={styles.bodyBg}>
        <StatusBar hidden={true} />
        <Header style={styles.header}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon style={styles.whiteText} name="menu" />
            </Button>
          </Left>
          <Body>
            <Title style={styles.whiteText}>Add</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Animatable.View animation='fadeInDownBig' 
                           iterationCount={1} 
                           direction='alternate'> 
            <Item rounded>
               <Input style={styles.input} 
                      placeholder="Add your city" 
                      placeholderTextColor="#fff"
                      onChangeText={(text) => {this.onChangeCity(text);}}
                      onSubmitEditing={(event) => {this.getWeather();}}
               />
            </Item>
          </Animatable.View>
        </Content>
      </Container>
    );
  }

  onChangeCity(searchedCity) {
    this.setState({
      searchedCity: searchedCity
    })
  }
}

var styles = StyleSheet.create({
  header: {
    backgroundColor: '#33485e',
    paddingTop: 0,
    borderBottomWidth: 0
  },
  bodyBg: {
    backgroundColor: '#33485e',
  },
  whiteText: {
    color: '#fff'
  },
  infoText: {
    alignSelf: 'center'
  },
  input: {
    borderColor: "#fff",
    color: '#fff',
    paddingLeft: 30,
    paddingRight: 30
  }
});