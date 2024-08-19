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

async function main() {
    let searchbar = document.getElementById("fuzzy-search-bar")
    let autocomplete = document.getElementById('autocomplete-list');
    let redditposts = await fetchData();
    let cache = createCache(redditposts);

    searchbar.addEventListener("keydown", function () {
        // console.log(searchbar.value)
        // console.log(fuzzySearchTags(searchbar.value, cache))
        let tags = fuzzySearchTags(searchbar.value, cache)
        let uniqRes = queryResults(redditposts, cache, tags);
        console.log(uniqRes)
    });
}



main()