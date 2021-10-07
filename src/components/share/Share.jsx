import React, { useEffect, useState } from 'react'
import Posts from '../posts/Posts'
import axios from 'axios';
import './share.css'

export default function Share() {
    const url = 'https://api.giphy.com/v1/gifs/search?';
    const trending_url = 'https://api.giphy.com/v1/gifs/trending?';
    const api_key = 'api_key=29uoBTfQb5UPANGW114gPP7y9fLyZO0v';
    // let search = `&q=`;
    const [isAddPost, setIsAddPost] = useState(false);
    const [isGifShow, setIsGifShow] = useState(false);
    const [posts, setPosts] = useState([]);
    const [gifs, setGifs] = useState([]);
    // gif search
    const [gifSearch, setGifSearch] = useState('');
    // posts content
    const [content, setContent] = useState('');
    const [gifLink, setGifLink] = useState('');

    const handle_post = () => {
        if(content !== "") {
            setPosts(oldArray => [...oldArray, {content:content,gifLink:gifLink}]);
            cancelAll();
        }
    }
    
    const cancelAll = () => {
        setIsGifShow(false);
        setIsAddPost(false);
        setContent('');
        setGifLink('');
        setGifSearch('');
    }

    useEffect(() => {
        const fetchGIFs = async() => {
            if(gifSearch==="") {
                await axios(trending_url+api_key)
                .then(res=>{
                    setGifs(res.data.data);
                })
                .catch(err=>console.log(err))
            }
            else {
                // idk how useRef works
                await axios(url+api_key+`&q=${gifSearch}`)
                .then(res=>{
                    setGifs(res.data.data);
                    console.log('done')
                })
                .catch(err=>console.log(err))
            }
        }
        fetchGIFs();
    }, [gifSearch])

    return (
        <div className="share_container">
            <button
            className={`share_add_btn ${isAddPost ? 'cancel_btn' : 'add_btn' }`}
            onClick={()=>{ isAddPost ? cancelAll()  : setIsAddPost(true) }}>{ isAddPost ? "Cancel " : "Add " }post</button>
            {
                isAddPost
                ?
                <div className="share_box">
                    <div className="share_content">
                        <textarea value={content} onChange={e=>{setContent(e.target.value)}}
                        name="content_text" id="content_text" className="content_text" cols="30" rows="4" placeholder="Add a GIPHY post!">
                        </textarea>
                        {
                            gifLink !== ""
                            ?
                            <img src={gifLink} alt="" className="gif_preview"/>
                            : null
                        }
                        <div className="gif_section">
                            <button className="gif_btn" onClick={()=>{ isGifShow ? setIsGifShow(false) : setIsGifShow(true) }}>GIF</button>
                            {
                                isGifShow
                                ?
                                <div className="gif_main">
                                    <input type="text" className="gif_input" placeholder="Search GIF" value={gifSearch} onChange={e=>{setGifSearch(e.target.value)}} />
                                    {
                                        gifs.map((data,idx)=>(
                                            <img className="gif_img" key={idx} src={data.images.downsized.url} name={data.images.downsized.url}
                                            onClick={e=>{setGifLink(e.target.name);setIsGifShow(false)}}
                                             alt="giphy gifs" />
                                        ))
                                    }
                                </div>
                                : null
                            }
                        </div>
                    </div>
                <button className="post_btn" onClick={()=>{handle_post();setIsAddPost(false)}}>Post</button>
                </div>
                : null
            }
            {/* post component */}
            {
                posts.map((data, idx)=>(
                    <Posts key={idx} content={data.content} link={data.gifLink}/>
            ))
            }
        </div>
    )
}
