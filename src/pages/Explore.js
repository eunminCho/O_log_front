import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Card from '../components/Card'
import Loading from '../components/Loading'
import { MessageContext } from '../context/store'
import './Explore.css'

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState([]);
  const [postPage, setPostPage] = useState(0);
  const [totalPage, setTotalPage] = useState([]);
  const {notify} = useContext(MessageContext)
  useEffect(() => {
    getPosts();
  }, [])

  //모든 포스트 요청
  const getPosts = () => {
    setIsLoading(true);
    axios.request({
      method:'GET',
      url:'https://olog445.herokuapp.com/offchain/posts'
    })
    .then((res) => {
      //console.log(res.data)
      const data = res.data.reverse();
      let totalNum = data.length%16 ? parseInt(data.length/16) + 1 : data.length/16
      setPosts(res.data.reverse());
      setTotalPage(new Array(totalNum).fill(1))
      setShow(data.slice(postPage*16, postPage*16 + 16))
      setIsLoading(false);
    })
    .catch((err) => {
      //console.log(err)
      notify('포스트를 불러올 수 없습니다.')
      setIsLoading(false);
    })
  }

  const handlePage = (page) => {
    setPostPage(page);
    setShow(posts.slice(16*page, 16*page + 16))
  }

  return (
    <div className='explore'>
      <div className='container'>
        {show.map((el, idx) => {
          return <Card key={idx} postImageUrl={el.postImageUrl} blogLink={el.blogLink} title={el.title} created_at={el.created_at} username={el.username} faviconUrl={el.faviconUrl} />
        })}
      </div>
      <div className='explore_page_area'>
        <div className='explore_page_nums'>
          {totalPage.map((el, idx) => {
            return <div key={idx} className={postPage === idx ? 'active explore_page_num':'explore_page_num'}  onClick={() => handlePage(idx)}><span>{idx + 1}</span></div>
          })}
        </div>
      </div>
      {isLoading ?<Loading />:''}
    </div>
  )
}
