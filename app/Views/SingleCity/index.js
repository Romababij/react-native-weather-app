import React, { Component } from 'react';
import { 
  StyleSheet, 
  StatusBar, 
  ListView,
  View, 
  Animated,
  AsyncStorage
} from "react-native";
import { 
  Container, 
  Header, 
  Title, 
  Item, 
  Left, 
  Icon, 
  Label,
  Button, 
  Right, 
  Spinner,
  Body, 
  Input, 
  Content,
  Text
} from "native-base";

import * as Animatable from "react-native-animatable";
import weatherIcon from "../../Components/icons";
import ApiWeather from "../../api/apimain";
import timeNow from "../../Components/days";

export default class CityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false
    };
  }

  componentDidMount() {
    console.log(this.props)
    const navdata = this.props.navigation.state.params
    if(navdata == undefined) {
      var cityName = this.props.screenProps;
    } else if(navdata.data.searchedCity) {
      var cityName = navdata.data.searchedCity
    } else if(navdata.data.city) {
      var cityName = navdata.data.city
    } else if(navdata.data) {
      var cityName = navdata.data
    } else {
      console.log('Error.')
    }

    ApiWeather(cityName, false).then((response) => {
      let weatherList = response.list[0],
          BG_HOT = "#da8436",
          BG_WARM = "#efcc44",
          BG_COLD = "#0793c3",
          bg,
          temp = parseInt(weatherList.main.temp);
      if(temp < 14) {
        bg = BG_COLD;
      } else if(temp >= 14 && temp < 25) {
        bg = BG_WARM;
      } else if(temp >= 25) {
        bg = BG_HOT;
      }
      this.setState({
        savedCity: weatherList.id,
        temperature: Math.round(weatherList.main.temp) + "°C",
        city: weatherList.name,
        day: timeNow(weatherList.dt),
        country: weatherList.sys.country,
        currentColor: bg,
        description: weatherList.weather[0].description,
        icon: weatherIcon(weatherList.weather[0].icon)
      });
    });
    ApiWeather(cityName, true).then((response) => {
      let foreCastList = response.list;
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(foreCastList),
          loaded: true
      });
    });
  }

  renderLoadingView() {
    return (
      <Container style={styles.bodyBg}>
        <StatusBar hidden={true} />
        <Content>
          <Spinner style={styles.spinnerStyle} color='white' />
        </Content>
      </Container>
    );
  }

  renderForeCast(city) {
    function formatAMPM(date) {
      var hours = date.getHours();
      var ampm = (hours >= 12) ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      var strTime = hours + ':' + '00' + ' ' + ampm;
      return strTime;
    }
    let currentDate = new Date(city.dt*1000);
    let daysMonth = {
      days: {
        "0":"Sunday",
        "1":"Monday",
        "2":"Tuesday",
        "3":"Wednesday",
        "4":"Thursday",
        "5":"Friday",
        "6":"Saturday"
      }
    };
    return (
      <Animatable.View style={styles.dayList}
                       animation={'bounceIn'} 
                       iterationCount={1} 
                       duration={2400}
                       direction='alternate'>
        <View style={styles.dateContainer}>
          <Text style={styles.whiteText}>{daysMonth.days[currentDate.getDay()]}, {currentDate.getDate()}</Text>
          <Text style={styles.whiteText}>{formatAMPM(currentDate)}</Text>
        </View>
        <Text style={styles.smallIcon}>{weatherIcon(city.weather[0].icon)}</Text>
        <View style={styles.tmpBlock}>
          <View style={styles.tmpBlockInside}>
            <Text style={styles.whiteText}>{Math.round(city.main.temp_min) + "°"}</Text>
            <Text style={styles.minMaxTmpInfo}>min</Text>
          </View>
          <View style={styles.tmpBlockInside}>
            <Text style={styles.whiteText}>{Math.round(city.main.temp_max) + "°"} </Text>
            <Text style={styles.minMaxTmpInfo}>max</Text>
          </View>
        </View>
      </Animatable.View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    const navigate = this.props.navigation;
    const dataList = this.state;

    let bgColor = dataList.currentColor

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
            <Title style={styles.whiteText}>{dataList.city}</Title>
          </Body>
          <Right />
      </Header>
        <Content style={styles.container}>
           <View scrollEnabled={false} style={styles.topBlock}>
             <Animatable.Text style={[styles.weatherType, {color:bgColor}]} 
                              animation={'bounceInDown'} 
                              iterationCount={1} 
                              duration={2400}
                              direction='alternate'>
               {dataList.description.toUpperCase()} 
             </Animatable.Text>  
             <Animatable.Text style={styles.location} 
                              animation={'bounceInLeft'} 
                              iterationCount={1}
                              duration={3000} 
                              direction='alternate'>
               {dataList.city} , {dataList.country}
             </Animatable.Text>
           </View>
           <View style={styles.mainInformation}>
             <Animatable.Text style={[styles.icon, {color:bgColor}]} 
                              animation={'zoomInDown'} 
                              iterationCount={1} 
                              duration={2500}
                              direction='alternate'>
               {dataList.icon}
             </Animatable.Text>
             <Animatable.View animation={'bounceInRight'} 
                              iterationCount={1} 
                              duration={2500}
                              direction='alternate'>
               <Text style={[styles.temperature, {color:bgColor}]}>{dataList.temperature}</Text>
               <Text style={styles.date} >{dataList.day}</Text>
             </Animatable.View>
           </View>
           <View style={styles.foreCastList}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderForeCast}
              style={styles.listView}
            />
           </View>
        </Content>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    paddingBottom: 0,
    paddingTop: 20,
    flex: 1,
    flexShrink: 0
  },
  foreCastList: {
    flex: 1,
  },
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
  topBlock: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  mainInformation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  weatherType: {
    fontSize: 34,
    color: '#fff',
    alignSelf: 'center',
    fontFamily: 'Futura',
    paddingLeft: 10,
    paddingRight: 10  
  },
  location: {
    fontSize: 14,
    color: '#fff',
    fontWeight: "100",
    alignSelf: 'center'
  },
  temperature: {
    fontSize: 62,
    color: '#fff',
    fontWeight: "400",
    margin: 0,
    marginLeft: 20
  },
  date: {
    marginLeft: 20,
    color: '#fff'
  },
  icon: {
    fontFamily: 'weathericons_regular_webfont',
    fontSize: 100,
    color: '#fff',    
    padding: 0
  },
  spinnerStyle: {
    justifyContent: 'center',
    alignItems:'center',
    marginTop: 300
  },
  dayList: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff'
  },
  dateContainer: {
    alignItems: 'center'
  },
  dateText: {
    color: '#fff'
  },
  smallIcon: {
    fontFamily: 'weathericons_regular_webfont',
    fontSize: 24,
    color: '#fff'
  },
  tmpBlock: {
    flexDirection: 'row',
  },
  tmpBlockInside: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 10
  },
  minMaxTmpInfo: {
    color: '#fff',
    fontSize: 8
  }


});