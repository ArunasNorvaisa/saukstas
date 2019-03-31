export default class Likes {
    constructor() {
        this.likes = [];
    }
    
    addLike(id, author, title, img) {
        const like = {
            id: id,
            author: author,
            title: title,
            img: img
        };
        this.likes.push(like);
        return like;
    }
    
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }
    
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    
    getNumLikes() {
        return this.likes.length;
    }
}