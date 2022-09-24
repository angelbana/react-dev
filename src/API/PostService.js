export default class PostService {
    static async getAll() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            return await response.json()
        } catch (e) {
            console.log('Post error: ' + e)
        }
    }
}