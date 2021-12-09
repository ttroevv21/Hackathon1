let API = "http://localhost:8005/posts";

//! Create
let inpName = $(".inp-name");
let inpImg = $(".inp-img");
let inpLikes = $(".inp-likes");
let inpDescription = $(".inp-description");
let addForm = $(".add-form");

async function addPost(event) {
  event.preventDefault();
  let name = inpName.val();
  let img = inpImg.val();
  let likes = inpLikes.val();
  let description = inpDescription.val();

  let post = {
    name: name,
    img: img,
    likes: likes,
    description: description,
  };
  for (let key in post) {
    if (!post[key]) {
      alert("Fill inputs!");
      return;
    }
  }

  let response = await axios.post(API, post);

  inpName.val("");
  inpImg.val("");
  inpLikes.val("");
  inpDescription.val("");
  console.log(post);
}

addForm.on("submit", addPost);

//! Read
let post = $(".post");
let image = $(".image");
let dataDetails = $(".data");
let posts = [];

async function getPosts(API) {
  let response = await axios(API);
  posts = response.data;
  render(posts);
}

function render(data) {
  posts.forEach((item) => {
    image.append(`
            <img src="${item.img}">
        `);
    dataDetails.append(`
        <div class="nickname"> 
            <h4>${item.name}</h4>
        </div>
        <div class="description">
            <p>${item.description}</p>
        </div>
        <div class="likes">
            <img src="">
            <p>${item.likes}</p>
        </div>
    `);
  });
}

getPosts(API);
