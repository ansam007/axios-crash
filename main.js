///Axios Global///
axios.defaults.headers.common["X-Auth-Token"] = "someToken";



///////////////////////////////////////////////////// GET REQUEST //////////////////////////////////////////////////
//function getTodos() {
//   axios({
//     method : "get",
//     url : "https://jsonplaceholder.typicode.com/todos?_limit=3"
//   })
//   .then((res)=>showOutput(res))
//   .catch((err)=>console.error(err));
// }

function getTodos(){
  axios.get("https://jsonplaceholder.typicode.com/todos?_limit=3", {timeout : 5000})
  .then((res)=>showOutput(res))
  .catch((err)=>console.log(err));
}

///////////////////////////////////////////////////// POST REQUEST //////////////////////////////////////////////////
// function addTodo() {
//   axios({
//     method : "post",
//     url : "https://jsonplaceholder.typicode.com/todos",
//     data : {
//       title : "new todo",
//       completed : false
//     }
//   })
//   .then((res)=>showOutput(res))
//   .catch((err)=>console.error(err));
// }

function addTodo(){
  axios.post("https://jsonplaceholder.typicode.com/todos", {title : "new todo", completed : false})
  .then((res)=>showOutput(res))
  .catch((err)=>console.log(err));
}

///////////////////////////////////////////////////// PUT REQUEST //////////////////////////////////////////////////
function updateTodo() {
  axios.put("https://jsonplaceholder.typicode.com/todos/1", {title : "update Todo", completed : true})
  .then((res)=>showOutput(res))
  .catch((err)=>console.error(err));
}

///////////////////////////////////////////////////// PATCH REQUEST //////////////////////////////////////////////////
function updateTodo(){
  axios.patch("https://jsonplaceholder.typicode.com/todos/1", {title : "update Todo", completed : true})
  .then((res)=>showOutput(res))
  .catch((err)=>console.error(err));
}

///////////////////////////////////////////////////// DELETE REQUEST //////////////////////////////////////////////////
function removeTodo() {
  axios.delete("https://jsonplaceholder.typicode.com/todos/1")
  .then((res)=>showOutput(res))
  .catch((err)=>console.error(err));
  
}

///////////////////////////////////////////////////// SIMULTANEOUS REQUEST //////////////////////////////////////////////////
// function getData() {
//   axios.all([
//     axios.get("https://jsonplaceholder.typicode.com/todos"),
//     axios.get("https://jsonplaceholder.typicode.com/posts")
//   ])
//   .then((res)=>{
//     console.log(res[0]);
//     console.log(res[1]);
//     showOutput(res[1]);
//   })
//   .catch((err)=>console.error(err));
// }

function getData(){
  axios.all([
    axios.get("https://jsonplaceholder.typicode.com/todos"),
    axios.get("https://jsonplaceholder.typicode.com/posts")
  ])
  .then(axios.spread((todos,posts)=>showOutput(posts)))
  .catch((err)=>console.log(err));
}

//////////////////////////////////////////////////////// CUSTOM HEADERS //////////////////////////////////////////////////
function customHeaders() {
  const config = {
    headers : {
      "content-Type" : "application/json",
      Authorization : "someKindOfToken" 
    }
  }
  axios.post("https://jsonplaceholder.typicode.com/todos", {title : 'new Todo', completed : false}, config)
  .then((res)=>showOutput(res))
  .catch((err)=>console.log(err))
}

/////////////////////////////////////////////////TRANSFORMING REQUESTS & RESPONSES////////////////////////////////////////
function transformResponse() {
  const options = {
    method : "post",
    url : "https://jsonplaceholder.typicode.com/todos",
    data : {
      title : "hello world"
    },
    transformResponse : axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase()
      return data;
    })
  }
  axios(options).then(res => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  axios.get("https://jsonplaceholder.typicode.com/todoss", {
    // validateStatus : function(status){
    //   return status < 500 
    // }
  })
  .then((res)=>showOutput(res))
  .catch((err)=>{
    if(err.response){
      //Server responded with a status other than 200 range
      console.error(err.response.data);
      console.error(err.response.status);
      console.error(err.response.headers);

      if(err.response.status === 404){
        alert("Error : Page Not Found");
      }
    }else if(err.request){
      //request was made but no response
      console.error(err.request);
    }else{
      console.error(err.message);
    }
  })
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();
  axios.get("https://jsonplaceholder.typicode.com/todos", { cancelToken: source.token })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      }
    });

    if(true){
      source.cancel('Request Canceled!');
    }
}


// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use((config)=>{
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);
  return config;
},error => {
  return Promise.reject(error);
})

// AXIOS INSTANCES
const axiosInstance = axios.create({
  baseURL : "https://jsonplaceholder.typicode.com"
});
// axiosInstance.get("/comments").then(res => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
