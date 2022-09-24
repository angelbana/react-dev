import React, {useState, useEffect} from 'react';
import './styles/App.css';
import PostList from "./components/PostList";
import MyButton from "./components/UI/button/MyButton";
import PostForm from "./components/PostForm";
import PostFilter from "./components/PostFilter";
import MyModal from "./components/UI/MyModal/MyModal";
import {usePosts} from "./hooks/usePosts";
import PostService from "./API/PostService";
import Loader from "./components/UI/Loader/Loader";
import {useFetching} from "./hooks/useFetching";

function App() {
    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
    const [fetchPosts, postError] = useFetching(async() => {
        const posts = await PostService.getAll();
        setPosts(posts)
    })
    const [ isPostsLoading, setIsPostsLoading ] = useState(true);
    const [ refetch, setRefetch ] = useState(0);

    useEffect(() => {
        //fetchPosts()
        setIsPostsLoading(true);
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then(d => d.json())
            .then(d => {
                setPosts(d);
                console.log(d)
            })

        setIsPostsLoading(false);
    }, [ refetch ])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    return (
        <div className="App">
            <MyButton onClick={() => setRefetch(Math.random())}>
                Получить посты
            </MyButton>
            {/*<button onClick={fetchPosts}>GET POSTS</button>*/}
            <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
                Создать пост
            </MyButton>
            <MyButton onClick={() => setPosts([])}>
                Удалить все
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin: '15px 0'}}/>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {isPostsLoading
                ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
                : <PostList remove={removePost} posts={sortedAndSearchedPosts} title={"Посты"}/>
            }
        </div>
    );
}

export default App;
