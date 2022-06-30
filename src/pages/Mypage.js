import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import MyComments from '../components/MyComments'
import Mynft from '../components/Mynft'
import MyPosts from '../components/MyPosts'
import Orginfo from '../components/Olginfo'
import Uploadpost from '../components/Uploadpost'
import { AuthContext, MessageContext } from '../context/store'
import './Mypage.css'

export default function Mypage() {
  const [myOLG, setMyOLG] = useState(0)
  const [received, setReceived] = useState(0);
  const [myPosts, setMyPosts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const { authstate } = useContext(AuthContext);
  const { notify } = useContext(MessageContext);
  const location = useLocation();
  const [page, setPage] = useState([]);
  const [postPage, setPostPage] = useState(0);
  const [totalPage, setTotalPage] = useState([]);

  useEffect(()=>{
    //console.log(authstate)
    // if(!authstate.auth){
    //   console.log("your not login back to main");
    //   navigate('/');

    // }else{
    //   console.log("login true");
    //   getMyPosts();
    // }

    getMyPosts();
    getMyOLG();
    getMyNfts();

  },[location.pathname])

  //location.pathname의 nft 요청(인증 상관없이)
  const getMyNfts = () => {
    if(!authstate.auth) {
      return
    };
    axios.request({
      method: 'GET',
      url: `https://olog445.herokuapp.com/offchain/nftmarket/myNFT`,
      withCredentials: true
    })
    .then((res)=> {
      console.log(res.data)
      setMyNfts(res.data);
    })
    .catch((err) => {
      console.log(err)
    })
  }

  //location.pathname의 포스트 요청(인증 상관없이)
  const getMyPosts = () => {
    axios.request({
      method:'GET',
      url: `https://olog445.herokuapp.com/offchain/posts/mypage/${location.pathname.slice(8,)}`,
      withCredentials: true
    })
    .then((res) => {
      //console.log(res.data)
      const data = res.data.reverse()
      setMyPosts(data)
      let totalNum = data.length%8 ? parseInt(data.length/8) + 1 : data.length/8
      setTotalPage(new Array(totalNum).fill(1))
      setPage(data.slice(8*postPage, postPage*8 + 8))
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const handlePage = (page) => {
    setPostPage(page);
    setPage(myPosts.slice(8*page, 8*page + 8))
  }

  //내 OLG 요청(status)
  const getMyOLG = () => {
    if(!(authstate.username === location.pathname.slice(8,))) return;

    axios.request({
      method: 'GET',
      url: 'https://olog445.herokuapp.com/offchain/userinfo/status',
      withCredentials: true
    })
    .then((res) => {
      //console.log(res.data);
      setMyOLG(res.data.expectedToken + res.data.receivedToken)
      setReceived(res.data.receivedToken);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  //OLG Sync 요청
  const handleSync = () => {

    if(!authstate.username) {
      alert('로그인이 필요합니다.')
      return;
    }
    axios.request({
      method: 'GET',
      url:'https://olog445.herokuapp.com/onchain/walletSync',
      withCredentials: true
    })
    .then((res) => {
      console.log(res)
      if(res.data === 'Failed!') notify('sync에 실패했습니다. 다시 시도해주세요', 'error')
      else if(res.data === "Don't need to sync") notify('sync할 OLG가 없습니다', 'error')
      else if(res.data === "Transaction Failed") notify('sync에 실패했습니다. 다시 시도해주세요','error')
      else{
        getMyOLG();
        notify('sync가 성공적으로 이루어졌습니다!', 'success')
      }
    })
    .catch((err) => {
      console.log(err)
      notify('sync를 다시 시도해주세요')
    })
  }

  return (
    <div className='mypage'>
      {location.pathname.slice(8) === authstate.username ?
      <div className='mypage_form'>
      <Uploadpost getMyPosts={getMyPosts} getMyOLG={getMyOLG} />
    </div> :
    ''}
      <div className='mypage_container'>
        <div className='mypage_info'>
          <div className='title'>
            Profile
          </div>
          <div className='username'>
            <div className='label'>username</div>
            <div>{location.pathname.slice(8)}</div>
          </div>
          {location.pathname.slice(8) === authstate.username ?
            <Orginfo myOLG={myOLG} received={received} handleSync={handleSync}/>
          :''}
          <div className='posts_info'>
            <span>올린 포스트 </span>
            <span>{myPosts.length} 개</span>
          </div>
          {location.pathname.slice(8) === authstate.username && myNfts.length ? <Mynft nfts={myNfts}/> : ''}
        </div>
        <div className='mypage_posts'>
          <div className='title'>Posts</div>
          <MyPosts myPosts={page}/>
          <div className='page_area'>
            <div className='page_nums'>
              {totalPage.map((el, idx) => {
                return <div key={idx} className={postPage === idx ? 'active page_num':'page_num'}  onClick={() => handlePage(idx)}><span>{idx + 1}</span></div>
              })}
            </div>
          </div>
        </div>
        <div className='mypage_comment'>
          <div className='title'>
            Comments
          </div>
          <MyComments />
        </div>
      </div>
    </div>
  )
}
