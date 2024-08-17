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

function queryResults(redditposts, cache, tag) {
    ids = cache[tag]
    results = []

    ids.forEach(id => {
        results.push(redditposts[id])
    });

    return results
}

function fuzzySearch(query, items) {
    const queryLower = query.toLowerCase();
    let foo = Object.keys(items).filter(item => item.toLowerCase().includes(queryLower));
    return foo
}

async function main() {
    let redditposts = await fetchData();
    let cache = createCache(redditposts)
    let results = queryResults(redditposts, cache, "fia")
    // console.log(cache)
    // console.log(results)
    // cache.forEach(i => {console.log(i)})
    console.log(fuzzySearch("a", cache))
}



main()