export default class PostService {
    static async getAll(limit = 15, page = 1) {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?' + new URLSearchParams({
            _limit: limit,
            _page: page
        }));
        return response
    }
}