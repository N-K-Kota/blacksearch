
let sBtn = document.getElementById("searchBtn");
let nextBtn = document.querySelector("#next1");
let nextBtn2 = document.querySelector("#next2");
let text = document.querySelector("[type=search]");
let kensuu = document.getElementById("kensuu");
let errormessage = document.getElementById("errormessage");
let idList = [];
let dataList = [];
let type;
let f = true;
let nextToken = "";
let prevToken = "";
let index = 0;
let ul = document.querySelector("ul");
const MaxC = 1000;
const MaxB = 500;
const MaxG = 1000;
let loading = false;
let gif = document.getElementById("loading");

function getSearchResult(json){
  let items = json.items;
  nextToken = json.nextPageToken;
  prevToken = json.prevPageToken;
  for(var i=0;i<items.length;i++){
    idList.push(items[i].id);
  }
}

function writeDataList(){
    let apiObj;
    let d;
    switch(type){
      case 0:
       apiObj = new Video(idList[index].videoId);
       d = apiObj.getLike();
      break;
      case 1:
      apiObj = new Video(idList[index].videoId);
      d = apiObj.getDis();
       break;
      case 2:
      apiObj = new Video(idList[index].videoId);
      d = apiObj.getCount();
       break;
      default:
      break;
    }
     index += 1;
      return d;
}

function makeLi(){
  for(var i=0;i<dataList.length;i++){
    let li = document.createElement("li");
    let a = document.createElement("a");
    let img = document.createElement("img");
    let span = document.createElement("span");
    let p = document.createElement("p");
    let br = document.createElement("br");
    let wrapa = document.createElement("a");

    switch(type){
      case 0:
      span.textContent = `グッドポイント:${Math.floor(MaxG-dataList[i].viewCount)}`;
      break;
      case 1:
      span.textContent = `バッドポイント:${Math.floor(MaxB-dataList[i].viewCount)}`;
      break;
      case 2:
      span.textContent = `再生回数:${dataList[i].viewCount}`;
      break;
    }
    img.src = dataList[i].thumbnails;
    img.alt=dataList[i].title;
    a.href=dataList[i].url;
    a.textContent = `${dataList[i].title}`;
    wrapa.href=dataList[i].url;
    wrapa.appendChild(img);
    p.appendChild(a);
    p.appendChild(br);
    p.appendChild(span);
    li.appendChild(wrapa);
    li.appendChild(p);
    ul.appendChild(li);
  }
  nextBtn.classList.remove("hide");
  nextBtn2.classList.remove("hide");
}

async function searchMethod(promise){
  if(!loading){
    loading = true;
    gif.classList.remove("hide");
  var n = true;
  while(n==true){
  await promise().then((data)=>{
    getSearchResult(data);
  }).catch((error)=>{
    console.log(error.message);
    errormessage.textContent = "Errorが発生しました";
    n = false;
  });

  for(var i=0;i<idList.length;i++){
    await writeDataList().then((data)=>{
      switch(type){
        case 0:
        if((data.viewCount<MaxG)&&(data.viewCount>0)){
        dataList.push(data)
       }
        break;
        case 1:
        if((data.viewCount<MaxB)&&(data.viewCount>0)){
        dataList.push(data)
       }
        break;
        case 2:
        if(data.viewCount < MaxC){
          dataList.push(data);
        }
        break;
      }
    }).catch((error)=>{
      errormessage.textContent = "Errorが発生しました";
      n=false;
    });
  }
  kensuu.textContent = `${dataList.length}件取得・・・待っててね👨‍❤️‍💋‍👨`;
  if(dataList.length>=30){
    n=false;
  }
  if(nextToken == ""){
    n=false;
  }
  idList = [];
  index = 0;
} //While終了
  dataList.sort(function(a,b){
    if(a.viewCount>=b.viewCount){
      return 1;
    }else{
      return -1;
    }
  });
  makeLi();
  loading = false;
  kensuu.textContent = "";
  gif.classList.add("hide");
}

}
function reset(){
  dataList = [];
  idList = [];
  ul.textContent = null;
  f = true;
  index = 0;
}
sBtn.addEventListener("click",function(){
  if(text.value){
    reset();
    nextToken = "";
    prevToken = "";
    let select = document.querySelector("select");
    let index = select.selectedIndex;
    type = index;
    let search = new Search(text.value,"video");
    let promise = search.getJson(nextToken)
};
  searchMethod(promise);
}
});

function setDatas(){
  for(var i = 0;i<dataList.length;i++){
    sessionStorage.setItem(`data${i}`,JSON.stringfy(dataList[i]));
  }
}
nextBtn.addEventListener("click",function(){
  if(text.value){
  reset();
  let search;
  search = new Search(text.value,"video");
  let promise = search.getJson(nextToken);
  searchMethod(promise);
}
});
nextBtn2.addEventListener("click",function(){
  if(text.value){
  reset();
  let search;
  search = new Search(text.value,"video");
  let promise = search.getJson(nextToken);
  searchMethod(promise);
}
});
