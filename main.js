;(function () {
  const dataPanel = document.getElementById('data-panel')
  const listsPanel = document.querySelector('#movie-lists')

  const BASE_URL = 'https://movie-list.alphacamp.io/'
  const INDEX_URL = BASE_URL + 'api/v1/movies'
  const POSTER_URL = BASE_URL + 'posters/'

  const data = [] //裝全部電影資料
  const lists = {
    '1': 'Action',
    '2': 'Adventure',
    '3': 'Animation',
    '4': 'Comedy',
    '5': 'Crime',
    '6': 'Documentary',
    '7': 'Drama',
    '8': 'Family',
    '9': 'Fantasy',
    '10': 'History',
    '11': 'Horror',
    '12': 'Music',
    '13': 'Mystery',
    '14': 'Romance',
    '15': 'Science Fiction',
    '16': 'TV Movie',
    '17': 'Thriller',
    '18': 'War',
    '19': 'Western',
  }
  

  //===串接api拿資料===
  axios
    .get(INDEX_URL)
    .then((response) => {
      //把資料撈進來存在data變數中
      data.push(...response.data.results)
      // console.log(data)
      //顯示左側清單
      displayList()
      //顯示右側電影卡片
      displayData(data)
    })
    .catch((err) => console.log(err))
  //===EventListener===
  //監聽清單點擊事件，顯示篩選後對應的卡片
  listsPanel.addEventListener('click', showSpecificGenres)
  //===function===
  //動態生成左側清單
  function displayList() {
    let dataID = 1
    let htmlContent = ''
    //透過 for...in，把list物件中的所有屬性名稱和屬性值都呼叫出來
    //把該物件的屬性存在item這個變數中，接著讀取下一個屬性，重覆直到沒有屬性為止
    //加入資料屬性data-id以利之後篩選
    for (let item in lists) {
      htmlContent += `
      <a href="#" class="list-group-item list-group-item-action" data-id="${dataID}">${lists[item]}</a>
      `
      dataID++
    }
    listsPanel.innerHTML = htmlContent
  }

  //為每一個電影生成一張卡片顯示在右側
  function displayData(data) {
    let htmlContent = ''

    data.forEach((movie) => {
      const { title, image, genres } = movie //問題：這個寫法是我從同學的社群名單看來的，想問這是什麼神奇的方法(不知道怎麼下關鍵字查詢)
      htmlContent += `
      <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100">
              <img class=" card-img-top" src="${POSTER_URL}${image}" alt="...">
              <div class="card-body">
                <h4 class="card-title">${title}</h4>           
                <p>${getGenres(genres)}</p>             
              </div>
            </div>
          </div>
      `
      // console.log(movie.genres) //得一個陣列，在心中命名為movieGenres
    })
    dataPanel.innerHTML = htmlContent
  }

  //把genres從數字轉化為文字
  //用bracket notation來存取物件的值
  function getGenres(movieGenres) {
    let htmlContent = ''
    movieGenres.forEach(genre=>{
      // console.log(typeof(genre)) //是數字
      htmlContent += `     
      <span class="mr-1 bg-dark text-light rounded">${lists[genre]}</span>              
  `
    })
    return htmlContent
  }
  //篩選出清單對應的電影並顯示
  function showSpecificGenres(event) {
    
    //拿到所有清單元素
    const lists =document.querySelectorAll('.list-group-item')
    // console.log(list)

    //先進去把active都清掉一次
    lists.forEach(list=>list.classList.remove('active'))

    //如果被觸發到，再加上active(亮藍色底)
    if(event.target.matches('.list-group-item')){
      event.target.classList.add('active')
    }
    // console.log(typeof(event.target.dataset.id)) //是字串
    let id=Number(event.target.dataset.id) //為了比對，先轉型
    let filteredList=[]

    //includes方法會判斷陣列是否包含特定的元素
    data.forEach(movie=>{
      if(movie.genres.includes(id)){
        filteredList.push(movie)
      }
    })
    console.log(filteredList)
    //如果沒資料，致歉公告
    if(filteredList.length===0){
      dataPanel.innerHTML=`<p>Sorry😅, we don't have this category of movies currently.</p>`
    }else{
      //顯示篩選後的資料
      displayData(filteredList)
    }
    
  }
})()
