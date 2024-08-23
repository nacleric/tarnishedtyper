async function fetchData() {
    return fetch("redditpost.json")
        .then(response => response.json());
}

function createCache(redditposts) {
    let cache = {}

    for (let i = 0; i < redditposts.length; i++) {
        post = redditposts[i]
        post.tags.forEach(tag => {
            cache[tag] = []
        });
    }

    for (let index in cache) {
        for (let i = 0; i < redditposts.length; i++) {
            post = redditposts[i]
            if (post.tags.includes(index)) {
                cache[index].push(post.id)
            }
        }
    }

    return cache
}

function queryResults(redditposts, cache, tags) {
    results = []
    tags.forEach(tag => {
        ids = cache[tag]
        ids.forEach(id => {
            results.push(redditposts[id])
        });
    })
    let uniqRes = [...new Set(results)];

    return uniqRes
}

function fuzzySearchTags(query, items) {
    const queryLower = query.toLowerCase();
    let foo = Object.keys(items).filter(item => item.toLowerCase().includes(queryLower));
    return foo
}

function renderCard(tags, author, text) {
    let ftags = ""
    for (let i = 0; i < tags.length; i++) {
        ftags += `#${tags[i]} `
    }

    let str = `
        <div class="lore-card">
            <div class="lore-meta-data">
                <div class="lore-tags">${ftags}</div>
                <div class="lore-author">Author: ${author}</div>
            </div>
            <div class="lore-text">${text}</div>
        </div>
    `
    return str
}

async function main() {
    let searchbar = document.getElementById("fuzzy-search-bar")
    let cardList = document.getElementById("fuzzy-search-container")
    let redditposts = await fetchData();
    let cache = createCache(redditposts);
    for (let i = 0; i < redditposts.length; i++) {
        let r = redditposts[i]
        cardList.innerHTML += renderCard(r.tags, r.author, r.text)
    }
    console.log(redditposts)
    console.log(cache)

    searchbar.addEventListener("keydown", function () {
        // console.log(searchbar.value)
        // console.log(fuzzySearchTags(searchbar.value, cache))
        let tags = fuzzySearchTags(searchbar.value, cache)
        let uniqRes = queryResults(redditposts, cache, tags);
        console.log(uniqRes)
    });
}



main()