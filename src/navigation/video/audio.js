import VideoList from '../../pages/video/VideoList';
import VideoPlayer from '../../pages/video/VideoPlayer';
export default {
    VideoList: {
        screen: VideoList,
        navigationOptions: {
          title: '视频列表'
        }
      },
      VideoPlayer: {
        screen: VideoPlayer,
        navigationOptions: {
          title: '视频播放'
        }
      },
};