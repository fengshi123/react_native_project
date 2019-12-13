
import React, { Component } from 'react';
import { View } from 'react-native';
import { 
  VictoryPie, 
  VictoryLegend, 
  VictoryTooltip 
} from 'victory-native';
import request from '../../utils/request';
import Loading from '../../components/Loading';
import style from '../../assets/styles/pages/exam/resultStatistics';

export default class ResultStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSum: 0,
      questionLength: 0,
      rightsum: [],
      isLoading: false,
      result: [2,2,2,2]
    };
    this.exam_id = this.props.navigation.state.params.exam_id;
    this.name = this.props.navigation.state.params.name;
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    this.getContent();
  }

  getContent() {
    let options = {
      url: '/exam/queryQuestionById?exam_id=' + this.exam_id,
      method: 'get'
    };
    let vm = this;
    request(options).then(function (res) {
      let result = res.data;
      if (result.code === 0) {
        vm.setState({
          questionLength: result.data.length
        });
        vm.getUserSum();
      }
    });
  }

  getUserSum() {
    let options = {
      url: '/exam/queryUserById?exam_id=' + this.exam_id,
      method: 'get'
    };
    let vm = this;
    request(options).then(function (res) {
      let result = res.data;
      if (result.code === 0) {
        vm.setState({
          userSum: result.data.length
        });
        vm.getScore();
      }
    });
  }

  getScore() {
    let options = {
      url: '/exam/queryScoreById?exam_id=' + this.exam_id,
      method: 'get'
    };
    let vm = this;
    request(options).then(function (res) {
      let result = res.data;
      if (result.code === 0) {
        vm.setState({
          rightsum: result.data,
          isLoading: false
        });
        vm.getResult();
      }
    });
  }

  getResult(){
    let rightSum;
    var sum = new Array(0, 0, 0, 0);
    var scores = new Array();
    for (var i = 0; i < this.state.userSum; i++) {
      if (this.state.rightsum[i] === undefined) {
        rightSum = 0;
      } else {
        rightSum = this.state.rightsum[i].rightSum;
      }
      var sc = rightSum / this.state.questionLength * 100;
      scores.push(sc);
      if (scores[i] >= 85){
        sum[0]++;
      } else if (scores[i] >= 75 && scores[i] < 85) {
        sum[1]++;
      } else if (scores[i] >= 60 && scores[i] < 75) {
        sum[2]++;
      } else {
        sum[3]++;
      }
    }
    this.setState({
      result: sum
    });
  }

  // loading 
  getLoading(){
    if(this.state.isLoading === true){
      return (
        <Loading loadingContent="正在加载成绩统计图表..." />
      );
    }
  }

  render() {
    const colorScale = ['#c23531', '#61a0a8', '#d48265', '#bda29a'];
    return (
        <View>
          <View style={style.pie}>
            <VictoryLegend
                orientation="vertical"
                data={[
                  {
                    name: '不及格   < 60 分',
                    symbol: { fill: colorScale[0], type: 'square' },
                  },
                  {
                    name: '及格     60 - 75 分',
                    symbol: { fill: colorScale[1], type: 'square' },
                  },
                  {
                    name: '良好     75 - 85 分',
                    symbol: { fill: colorScale[2], type: 'square' },
                  },
                  {
                    name: '优秀     > 85 分',
                    symbol: { fill: colorScale[3], type: 'square' },
                  }
                ]}
                width={180}
                height={125}
            />
            <VictoryPie
                colorScale={colorScale}
                data={[
                  { y: this.state.result[3], label: '不及格:' + this.state.result[3] + '人'},
                  { y: this.state.result[2], label: '及格:' + this.state.result[2] + '人' },
                  { y: this.state.result[1], label: '良好:' + this.state.result[1] + '人' },
                  { y: this.state.result[0], label: '优秀:' + this.state.result[0] + '人' }
                ]}
                innerRadius={60}
                height={300}
                width={345}
                animate={{
                  duration: 2000
                }}
                labelComponent={
                    <VictoryTooltip
                        active={({ datum }) => datum.y === 0 ? false : true}
                        constrainToVisibleArea={true}
                        flyoutHeight={30}
                        flyoutStyle={{ strokeWidth: 0.1}}
                    />
                }
            />
          </View>
          {this.getLoading()}
        </View>
    );
  }
}