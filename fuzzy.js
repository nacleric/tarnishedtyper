async function fetchData() {
    return fetch("redditpost.json")
        .then(response => response.json());
}

function createCache(redditposts) {
    let fuzzySearchCache = {}

    for (let i = 0; i < redditposts.length; i++) {
        post = redditposts[i]
        post.tags.forEach(tag => {
            fuzzySearchCache[tag] = []
        });
    }

    for (let index in fuzzySearchCache) {
        for (let i = 0; i < redditposts.length; i++) {
            post = redditposts[i]
            if (post.tags.includes(index)) {
                fuzzySearchCache[index].push(post.id)
            }
        }
    }

    return fuzzySearchCache
}

function queryResults(redditposts, cache, tag) {
    ids = cache[tag]
    results = []

    ids.forEach(id => {
        results.push(redditposts[id])
    });

    return results
}

async function main() {
    let redditposts = await fetchData();
    let fuzzySearchCache = createCache(redditposts)
    let results = queryResults(redditposts, fuzzySearchCache, "fia")
    console.log(fuzzySearchCache)
    console.log(results)
}

main()