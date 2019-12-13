export function getUniqueName (name, files) {
    for (let num = 0; ; num++) {
      let newName = name;
      if (num !== 0) {
        newName = newName + '(' + num + ')';
      }
      let i = 0;
      for (; i < files.length; i++) {
        if (newName === files[i]) {
          break;
        }
      }
      if (i === files.length && files[i] !== newName) {
        return newName;
      }
    }
  }
  export function getFileType (name) {
    if (name.charAt('.') < 0) {
      return 'unknown';
    } else {
      name = name.split('.').pop();
      name = name.toLowerCase();
      const fileType = {
        'img': ['bmp', 'gif', 'jpg', 'png', 'jpeg', 'psd', 'svg', 'webp'],
        'doc': ['docx', 'doc'],
        'txt': ['txt'],
        'xml': ['xml'],
        'xls': ['xls', 'xlsx'],
        'ppt': ['pptx', 'ppt'],
        'zip': ['rar', 'zip', 'tar', 'gz', '7z', 'bz2', 'arj', 'z'],
        'pdf': ['pdf'],
        'video': ['flv', 'swf', 'mkv', 'avi', 'rm', 'rmvb', 'mpeg', 'mpg', 'ogv', 'mov', 'wmv', 'mp4', 'webm', 'swf'],
        'audio': ['mp3', 'wav', 'ogg', 'aif', 'au', 'ram', 'wma', 'mmf', 'amr', 'aac', 'flac']
      };
  
      for (let key in fileType) {
        for (let type of fileType[key]) {
          if (name === type) {
            return key;
          }
        }
      }
      return 'unknown';
    }
  }
  
  export function getMimeType(type) {
  
      switch (type) {
          case 'doc' :
              return 'application/msword';
          case 'docx' :
              return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          case 'ppt':
              return 'application/vnd.ms-powerpoint';
          case 'pptx':
              return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          case 'xls' :
              return 'application/vnd.ms-excel';
          case 'xlsx' :
              return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          case 'pdf' :
              return 'application/pdf';
          case 'png' :
              return 'image/png';
          case 'bmp' :
              return 'application/x-MS-bmp';
          case 'gif' :
              return 'image/gif';
          case 'jpg' :
              return 'image/jpeg';
          case 'jpeg' :
              return 'image/jpeg';
          case 'avi' :
              return 'video/x-msvideo';
          case 'aac' :
              return 'audio/x-aac';
          case 'mp3' :
              return 'audio/mpeg';
          case 'mp4' :
              return 'video/mp4';
          case 'apk' :
              return 'application/vnd.Android.package-archive';
          case 'txt' :
          case 'log' :
          case 'h' :
          case 'cpp' :
          case 'js' :
          case 'html' :
              return 'text/plain';
          default:
              return '*/*';
      }
  }
  