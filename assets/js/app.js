const cl = console.log;
const userProfile = document.getElementById("userProfile");
const searchBar = document.getElementById("searchBar");

const baseUrl = `https://api.github.com/users`;

const templating = (user) => {
    let userName = user.name ? `<h3 class="card-title ml-4 mb-3 text-capitalize text-white">${user.name}</h3>` : '';
    let userBio = user.bio ? `<p class="ml-5 text-uppercase">${user.bio}</p>` : '';
    userProfile.innerHTML = `
            <div class="card mb-3 p-4">
                <div class="row no-gutters">
                    <div class="col-md-3">
                        <img src="${user.avatar_url}" alt="${user.name} Image" title="${user.name}" class="w-100 rounded-circle py-4 pl-2">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            ${userName}
                            ${userBio}
                            <ul class="list-inline userFollow text-center mb-3">
                                <li class="d-inline-block list-inline-item ml-3">
                                    <a href="javascript:;" class="d-inline-block text-capitalize text-white p-2">${user.followers} followers</a>
                                </li>
                                <li class="d-inline-block list-inline-item ml-3">
                                    <a href="javascript:;" class="d-inline-block text-capitalize text-white p-2">${user.following} following</a>
                                </li>
                                <li class="d-inline-block list-inline-item ml-3">
                                    <a href="javascript:;" class="d-inline-block text-capitalize text-white p-2">${user.public_repos} repos</a>
                                </li>
                            </ul>
                            <ul class="list-inline text-center repoLinks" id="repoLinks"></ul>
                        </div>
                    </div>
                </div>
            </div>
            `;
}

const userLinkCreate = (arr) => {
    arr.forEach(repo => {
        document.getElementById("repoLinks").innerHTML += `
            <li class="d-inline-block list-inline-item px-3 mb-2 ml-3">
                <a href="${repo.html_url}" target="_blank" class="d-inline-block text-white p-1">${repo.name}</a>
            </li>
    `;
    });
}


const makeApiCall = async (apiUrl, methodName, obj) => {
    let res = await fetch(apiUrl,{
        method : methodName,
        body : obj,
        headers : {
            "content-type" : "application/json"
        }
    })
    return res.json();
}

const onsearchHandler = async (eve) => {
    let searchValue = eve.target.value;
    let serachUrl = `${baseUrl}/${searchValue}`;
   if(searchValue.length !== 0){
        try{
            let userData = await makeApiCall(serachUrl, "GET", null)
            userProfile.classList.remove("d-none");
            templating(userData);
            userRepos(searchValue);
        }catch(error){
            cl(error);
        };
   }else{
        userProfile.classList.add("d-none");
   }
}

const userRepos = async (user) => {
    let repoUrl = `${baseUrl}/${user}/repos?sort=committer-date`;
    try{
        let res = await makeApiCall(repoUrl, "GET", null);
        let fiveRepos = res.splice(0,5);
        userLinkCreate(fiveRepos);
    }catch(error){
        cl(error);
    };
}

searchBar.addEventListener("keyup", onsearchHandler);