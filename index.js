// console.log('working')

const input = document.querySelector('.main-input');
const searchSection = document.querySelector('.search-section');
const repositorySection = document.querySelector('.repository-section');

let arrayResults = []
for (let i = 0; i < 5; i++) {
  let res = document.createElement('button');
  res.classList.add('search-item');
  res.textContent = "";
  searchSection.appendChild(res);
  arrayResults.push(res);
}

const debounce = (fn, debounceTime) => {
    let timeout;
    return function(...args) {
        const fnCall = () => {
            fn.apply(this, args)
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, debounceTime);
    };
};

async function fetchData(repositoryName) {
    try {
      const response = await fetch(`https://api.github.com/search/repositories?q=${repositoryName}&per_page=5`);
  
      if (!response.ok) {
        throw new Error(`Возникла ошибка: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка запроса:", error);
      return { items: [] };
    }
  }

const searchFetch = debounce(function () {
    let repositoryName = input.value.trim();

    if (repositoryName.length === 0) {
      searchSection.style.display = "none";
      return;
    }

    searchSection.style.display = "flex";
    arrayResults.forEach(res => {
      res.textContent = "...loading";
    })

    fetchData(repositoryName)
        .then((array) => {
          const items = array.items || [];
          arrayResults.forEach((res, index) => {
            let newRes = document.createElement('button');
            newRes.classList.add('search-item');
            
            if (items[index]) {
              newRes.textContent = items[index].name;
              newRes.onclick = () => repositoryList(items[index]);
            }
            res.replaceWith(newRes); 
            arrayResults[index] = newRes;
          });
        })
        .catch((error) => {
          console.error("Ошибка запроса:", error);
        });
    }, 763)
    
input.addEventListener('input', searchFetch)

function repositoryList (repositoryObject) {
  input.value = "";
  searchSection.style.display = "none";

  const template = document.getElementById('template');
  const clone = template.content.cloneNode(true);

  const repositoryListName = clone.querySelector('.repository');
  const repositoryListAutor = clone.querySelector('.autor');
  const repositoryListStars = clone.querySelector('.stars');
  const closeButton = clone.querySelector('.close');

  repositoryListName.textContent = `Repository: ${repositoryObject.name}`;
  repositoryListAutor.textContent = `Autor: ${repositoryObject.owner.login}`;
  repositoryListStars.textContent = `Stars: ${repositoryObject.stargazers_count}`;
  
  repositorySection.appendChild(clone);
  
  closeButton.addEventListener("click", () => {
    closeButton.closest('.repository-item')?.remove();
  });
}
    