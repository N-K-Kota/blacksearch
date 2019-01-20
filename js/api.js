let key = "AIzaSyBpfzkXsC_oKpMTMtG7Q5J1Co5GDVT6J6A";
let baseURL = "https://www.googleapis.com/youtube/v3/";

class Channel{
  constructor(id){
    this.id = id;
  }
  writeprop(obj){
    this.subscriberCount = obj.subscriberCount;
    this.videoCount = obj.videoCount;
    this.viewCount = obj.viewCount;
    this.commentCount = obj.commentCount;
  }
  getCount(){
      let option = `channels?part=statistics,snippet&id=${this.id}`;
      let request = baseURL+option+`&key=${key}`;
      return fetch(request).then(function(response){
        return response.json();
      }).then(function(json){
        if(json.items[0]){
        let item = json.items[0];
        let url = `https://www.youtube.com/channel/${item.id}`;
        let data = new Data(Number(item.statistics.viewCount),url,item.snippet.title);
        return data;
      }else{
        return new Data(0,"","");
      }
      });
  }
}

class Video{
  constructor(id){
    this.id  = id;
  }
  getCount(){
    let option = `videos?part=statistics,snippet&id=${this.id}`;
    let request = baseURL+option+`&key=${key}`;
    return fetch(request).then(function(response){
      return response.json();
    }).then(function(json){
      if(json.items[0]){
      let item = json.items[0];
      let nail = item.snippet.thumbnails.default.url;
      let url = `https://www.youtube.com/watch?v=${item.id}`;
      let data = new Data(Number(item.statistics.viewCount),url,item.snippet.title,nail);
      return data;
    }else{
      return new Data(0,"","");
    }
  }).catch(function(error){
    return error;
  });
  }
  getDis(){
    let option = `videos?part=statistics,snippet&id=${this.id}`;
    let request = baseURL+option+`&key=${key}`;
    return fetch(request).then(function(response){
      if(response.ok){
        return response.json();
      }else{
        throw new TypeError("can't get dislikes error");
      }
    }).then(function(json){
      if(json.items[0]){
      let item = json.items[0];
      let url = `https://www.youtube.com/watch?v=${item.id}`;
      let dislike = item.statistics.dislikeCount;
      let ratio;
      let nail = item.snippet.thumbnails.default.url;
      if(dislike == 0){
        ratio = 0;
      }else{
        ratio = item.statistics.viewCount/dislike;
      }
      let data = new Data(Number(ratio),url,item.snippet.title,nail);
      return data;
    }else{
      return new Data(0,"","");
    }
  }).catch(function(error){
    return error;
  });
  }
  getLike(){
    let option = `videos?part=statistics,snippet&id=${this.id}`;
    let request = baseURL+option+`&key=${key}`;
    return fetch(request).then(function(response){
      if(response.ok){
        return response.json();
      }else{
        throw new Error("can't get likes error");
      }
    }).then(function(json){
      if(json.items[0]){
      let item = json.items[0];
      let url = `https://www.youtube.com/watch?v=${item.id}`;
      let like = item.statistics.likeCount;
      let ratio;
      let nail = item.snippet.thumbnails.default.url;
      if(like == 0){
        ratio = 0;
      }else{
        ratio = item.statistics.viewCount/like;
      }
      let data = new Data(Number(ratio),url,item.snippet.title,nail);
      return data;
    }else{
      return new Data(0,"","","");
    }
  }).catch(function(error){
    return error;
  });
  }
}
class Search{
  constructor(q,type){
    this.query = q;
    this.type = type;
  }
  getJson(token){
     this.flag = false;
     let option=`search?part=id&maxResults=30&type=${this.type}&q=${this.query}`;
     if(token){
      option = option+`&pageToken=${token}`;
     }

     let request = `${baseURL}${option}&key=${key}`;
     return fetch(request).then(function(response){
       if(response.ok){
      return  response.json();
    }else{
      throw new Error("can't search error");
    }
     }).then(function(json){
      return json;
    }).catch(function(error){
      return error;
    });
    }
}
class Data{
  constructor(count,url,title,thumb){
    this.viewCount = count;
    this.url = url;
    this.title = title;
    this.thumbnails = thumb;
  }
}
