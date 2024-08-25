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

function createCardEl(tags, author, text, link) {
    let ftags = ""
    for (let i = 0; i < tags.length; i++) {
        ftags += `#${tags[i]} `
    }
    let textTrunc = text.substring(0, 500);
    let el = `
        <a href="${link}" class="center lore-card-width">
            <div class="lore-card">
                <div class="lore-meta-data">
                    <div class="lore-tags">${ftags}</div>
                    <div class="lore-author">By: ${author}</div>
                </div>
                <div class="lore-text">${textTrunc}...(view more)</div>
            </div>
        </a>
    `
    return el
}

async function main() {
    let searchbar = document.getElementById("fuzzy-search-bar")
    let cardList = document.getElementById("fuzzy-search-container")
    let redditposts = await fetchData();
    let cache = createCache(redditposts);
    for (let i = 0; i < redditposts.length; i++) {
        let r = redditposts[i]
        cardList.innerHTML += createCardEl(r.tags, r.author, r.text, r.link)
    }


    searchbar.addEventListener("keydown", function () {
        let tags = fuzzySearchTags(searchbar.value, cache)
        let searchResults = queryResults(redditposts, cache, tags);
        cardList.innerHTML = ""
        for (let i = 0; i < searchResults.length; i++) {
            let r = searchResults[i]
            cardList.innerHTML += createCardEl(r.tags, r.author, r.text, r.link)
        }
    });
}

main()