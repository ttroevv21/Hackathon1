let API = "http://localhost:8005/posts";

//! Create styles

const password = document.getElementById("password");
const background = document.getElementById("background");

password.addEventListener("input", (e) => {
  const input = e.target.value;
  const length = input.length;
  const blurValue = 20 - length * 2;
  background.style.filter = `blur(${blurValue}px)`;
});

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
  // console.log(post);
  getPosts(API);
}

addForm.on("submit", addPost);

//! Read
let container = $(".container");
let image = $(".image");
let dataDetails = $(".data");
let posts = [];

async function getPosts(API) {
  let response = await axios(API);
  posts = response.data;
  handlePagination();
}

function render(posts) {
  container.html("");
  posts.forEach((item) => {
    container.append(`
      <div class="post">
            <div class='image'>
              <img src="${item.img}">
            </div>
            <div class="data">
              <div class="nickname"> 
                <h4>${item.name}</h4>
              </div>
              <div class="description">
                <p>${item.description}</p>
              </div>
              <div class="likes">
                <img src="https://cdn-icons.flaticon.com/png/512/2589/premium/2589197.png?token=exp=1639129720~hmac=ed3366a1fbe8e81034b28fa82d67b05d">
                <p>${item.likes}</p>
              </div>
              <div class="btns">
                <button class="btn-delete" id="${item.id}">Delete</button>
                <button id="${item.id}" class="btn-edit">Edit</button>
              </div>
            </div>  
      </div>
        `);
  });
}

getPosts(API);

//! Delete
async function deletePost(event) {
  let id = event.currentTarget.id;
  await axios.delete(`${API}/${id}`);
  getPosts(API);
}

$(document).on("click", ".btn-delete", deletePost);

//! Update
let editForm = $(".edit-form");
let editName = $(".edit-inp-name");
let editImg = $(".edit-inp-img");
let editLikes = $(".edit-inp-likes");
let editDesc = $(".edit-inp-description");

async function postEditer(event) {
  console.log(event);
  let id = event.target.id;
  let response = await axios(`${API}/${id}`);

  const { data } = response;
  editName.val(data.name);
  editImg.val(data.img);
  editLikes.val(data.likes);
  editDesc.val(data.description);

  editForm.attr("id", id);
}

$(document).on("click", ".btn-edit", (event) => {
  postEditer(event);
  $(".background").css("zIndex", "20");
  $(".background").css("backdropFilter", "blur(5px)");
  $(".background").css("position", "fixed");
  $(".modal-window").css("display", "block");
});

async function saveEditedPost(event) {
  event.preventDefault();
  let id = event.currentTarget.id;
  let name = editName.val();
  let img = editImg.val();
  let likes = editLikes.val();
  let description = editDesc.val();

  let editedPost = {
    name,
    img,
    likes,
    description,
  };
  for (let key in editedPost) {
    if (!editedPost[key]) {
      alert("Fill inputs!");
      return;
    }
  }
  await axios.patch(`${API}/${id}`, editedPost);
  getPosts(API);
  $(".modal-window").css("display", "none");
  editName.val("");
  editImg.val("");
  editLikes.val("");
  editDesc.val("");
}

editForm.on("submit", () => {
  saveEditedPost(event);
  $(".background").css("backdropFilter", "none");
  $(".background").css("zIndex", "-20");
  $(".background").css("position", "absolute");
  $(".modal-window").css("display", "none");
});
$(".modal-close").on("click", () => {
  $(".background").css("backdropFilter", "none");
  $(".background").css("zIndex", "-20");
  $(".background").css("position", "absolute");
  $(".modal-window").css("display", "none");
});

//! Search

let searchInp = $(".search-inp");

async function liveSearch(event) {
  let value = event.target.value;
  let newAPI = `${API}?q=${value}`;
  currentPage = 1;
  getProducts(newAPI, false);
}
searchInp.on("input", liveSearch);

//! Pagination

const postsPerPage = 1;
let pagesCount = 1;
let currentPage = 1;
let totalPostsCount = 0;

function handlePagination() {
  let indexOfLastPost = currentPage * postsPerPage;
  let indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  console.log(currentPosts);
  totalPostsCount = posts.length;
  // console.log(totalPostsCount);
  pagesCount = Math.ceil(totalPostsCount / postsPerPage);
  addPagination(pagesCount);
  render(currentPosts);
}

let pagination = $(".pagination");
function addPagination(pagesCount) {
  pagination.html("");
  pagination.append(`
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link prev-item" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `);

  for (let i = 1; i <= pagesCount; i++) {
    if (i == currentPage) {
      pagination.append(`
        <li class="page-item active">
          <a hfer="#" class="page-link pagination-item">${i}</a>
        </li>
      `);
    } else {
      pagination.append(`
      <li class="page-item">
      <a hfer="#" class="page-link pagination-item">${i}</a>
    </li>
      `);
    }
  }

  pagination.append(`
  <li class="page-item ${currentPage === pagesCount ? "disabled" : ""}">
    <a class="page-link next-item" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
  `);
}

function paginate(event) {
  let newPage = event.target.innerText;
  currentPage = +newPage;
  handlePagination();
  ``;
}

$(document).on("click", ".pagination-item", paginate);

function nextPage() {
  if (currentPage === pagesCount) {
    return;
  }
  currentPage++;
  handlePagination();
}
function prevPage() {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  handlePagination();
}

$(document).on("click", ".next-item", nextPage);
$(document).on("click", ".prev-item", prevPage);
