// src/filters.js

export function filterByTags(loreList, selectedTags) {
    return loreList.filter(item =>
        selectedTags.every(tag => item.tags.includes(tag))
    );
}

export function filterByAuthor(loreList, author) {
    return author ? loreList.filter(item => item.author === author) : loreList;
}

export function filterByDate(loreList, range) {
    const now = new Date();
    return loreList.filter(item => {
        const itemDate = new Date(item.date);
        switch (range) {
            case 'lastMonth':
                return (now - itemDate) / (1000 * 60 * 60 * 24) <= 30;
            case 'lastYear':
                return (now - itemDate) / (1000 * 60 * 60 * 24) <= 365;
            case 'older':
                return (now - itemDate) / (1000 * 60 * 60 * 24) > 365;
            default:
                return true;
        }
    });
}