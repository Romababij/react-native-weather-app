import React, { Component } from 'react';
import { 
  AppRegistry, 
  Image, 
  AsyncStorage,
  ScrollView,
  StatusBar, 
  TouchableOpacity,
  ListView,
  StyleSheet
} from "react-native";
import {
  Button,
  Text,
  Container,
  Left,
  Body,
  Right,
  List,
  ListItem,
  Content,
  Icon
} from "native-base";
import { NavigationActions } from 'react-navigation'
import weatherIcon from "../../Components/icons";
import ApiWeather from "../../api/apimain";

const routes = [
  {
    name: "Add City",
    route: "HomeScreen",
    icon: "md-add-circle"
  }
]

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  getItemFromMemory() {
    AsyncStorage.getItem('savedIds')
    .then((item) => {
         if (item) {
            var newItem = JSON.parse(item);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newItem)
            })
         } 
    });
  };

  removeCity(index, id) {
    AsyncStorage.getItem('savedIds').then((item) => {
      var newObj = JSON.parse(item);
      newObj.splice(index.rowID, 1)
      var infArray = newObj;

      let newArray = [];
      for(i = 0; i < infArray.length; i++) {
        newArray.push(infArray[i])
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newArray)
      });
      AsyncStorage.setItem('savedIds', JSON.stringify(infArray));
    }).done();
  }

  renderCityList(city, sectionID, rowID) {
    //const { navigate } = this.props.navigation;

    const navigateAction = NavigationActions.navigate({
      params: {city},
      action: NavigationActions.navigate({ routeName: 'SingleCity'})
    })

    //console.log(navigateAction)
    return (
      <ListItem style={styles.cityList}>
        <Left>
          <TouchableOpacity onPress={() => this.props.navigation.dispatch(navigateAction)}>
            <Text>{city}</Text>
          </TouchableOpacity>
        </Left>
        <Right>
          <TouchableOpacity style={styles.btnTrash} onPress={() => this.removeCity({rowID})}>
            <Icon style={styles.btnTrashIco} name="trash" />
          </TouchableOpacity>
        </Right>
      </ListItem>
    );
  }

  componentWillReceiveProps() {
    this.getItemFromMemory();
  }
  
  componentDidMount() {
    //AsyncStorage.removeItem("savedIds");
    this.getItemFromMemory();
  }

  render() {
    return (
      <Container>
        <Content>
          <Image style={styles.sideBarimage} source={require('../../Img/weather.gif')}></Image>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  style={styles.sidebarMain}
                  button
                  onPress={() => this.props.navigation.navigate(data.route)}
                >
                  <Left >
                    <Icon active name={data.icon} style={styles.menuIcons} />
                    <Text style={styles.text}>{data.name}</Text>
                  </Left>
                </ListItem>
              );
            }}
          />
          <List>
            <ListItem itemDivider style={styles.sidebarMain}>
              <Left>
                <Icon active name='md-list' style={styles.menuIcons} />
                <Text>Your cities</Text>
              </Left>
            </ListItem>  

            <ScrollView style={styles.foreCastList}>
              <ListView
                enableEmptySections
                dataSource={this.state.dataSource}
                renderRow={this.renderCityList.bind(this)}
                style={styles.listView}
              />
            </ScrollView>
          </List>
        </Content>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  sideBarimage: {
    height: 200,
    alignSelf: "center",
    resizeMode: 'contain'
  },
  sidebarMain: {
    marginLeft: 0,
    paddingLeft: 15
  },
  text: {
    fontWeight: 'bold'
  },
  smallIcon: {
    fontFamily: 'weathericons_regular_webfont',
    fontSize: 12,
    color: '#777',
    marginLeft: 0
  },
  cityList: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingRight: 0,
    marginLeft: 0,
  },
  btnTrash: {
    backgroundColor: '#d9534e',
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  btnTrashIco: {
    color: '#fff'
  }
});