import React, {useState, useEffect} from 'react';
import '../styles/App.css';
import PostList from "../components/PostList";
import MyButton from "../components/UI/button/MyButton";
import PostForm from "../components/PostForm";
import PostFilter from "../components/PostFilter";
import MyModal from "../components/UI/MyModal/MyModal";
import {usePosts} from "../hooks/usePosts";
import PostService from "../API/PostService";
import Loader from "../components/UI/Loader/Loader";
import {useFetching} from "../hooks/useFetching";
import {getPageCount, getPagesArray} from "../components/utils/pages";
import Pagination from "../components/UI/pagination/pagination";

function Posts() {
    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const [raspModal, setRaspModal] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)


    const [fetchPosts, isPostsLoading, postError] = useFetching( async(limit, page) => {
        const response = await PostService.getAll(limit, page);
        setPosts(await response.json())
        const totalCount = response.headers.get('x-total-count')
        setTotalPages(getPageCount(totalCount, limit))
    })

    // const [ isPostsLoading, setIsPostsLoading ] = useState(true);
    const [ refetch, setRefetch ] = useState(0);

    useEffect(() => {
        // setIsPostsLoading(true);
        fetchPosts(limit, page)
        // fetch("https://jsonplaceholder.typicode.com/posts")
        //     .then(d => d.json())
        //     .then(d => {
        //         setPosts(d);
        //         console.log(d)
        //     })

        // setIsPostsLoading(false);
    }, [ refetch ])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
        fetchPosts(limit, page)
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
            <MyButton
                style={{float: 'right',marginTop: 30}}
                // onClick={() => setRaspModal(true)}
                >
                    What
            </MyButton>


            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin: '15px 0'}}/>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {postError &&
                <h1>Error ${postError}</h1>
            }
            {isPostsLoading
                ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
                : <PostList remove={removePost} posts={sortedAndSearchedPosts} title={"Посты"}/>
            }
            {posts.length > 0 &&
                <Pagination
                    page={page}
                    changePage={changePage}
                    totalPages={totalPages}
                />
            }
        </div>
    );
}

export default Posts;
