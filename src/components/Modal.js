import React, {useContext} from 'react';
import './Modal.css';
import axios from 'axios'
import { AuthContext, MessageContext } from '../context/store'
import { useLocation } from 'react-router-dom';

export default function(props){
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  // 모달 정보들 모두 부모로부터 받아옴
  const { open, close, header, name, description, image, price, NFTrewardFactor, tokenURI, tokenId, attributes} = props;
  const {authstate} = useContext(AuthContext);
  const {notify} = useContext(MessageContext);
  const location = useLocation();

  var btn_nftcart = '강화하기';
  //
  const path = (location.pathname).split('/')
  //uri를 가지고 버튼 변경. 구매하기, 강화하기 
  if(path[1] == 'marketplace'){
    btn_nftcart = '구매하기';
  }else if(path[1] == 'mypage'){
    btn_nftcart = '강화하기';
  }
  const handleSubmit = () => {
    //인증 여부 확인 후 post 요청
   if(!authstate.auth) {
     alert('로그인 필요')
     return;
   }

     //구매하기 눌렀을때, tokenUri 만 보냄
   if(path[1] == 'marketplace'){
     //console.log("구매하기 axios");
     let body = { tokenURI: tokenURI}
     axios.request({
       method: 'POST',
       url:'https://olog445.herokuapp.com/onchain/serverNFTBuy',
       data: body,
       withCredentials: true
     })
     .then((res) => {
       if(res.data === "Please proceed wallet synchronization"){
         notify('Mypage에서 Wallet Sync를 진행해주세요', 'error')
       }else if(res.data ==="Not logged in"){
         notify('로그인을 해주세요!', 'error')
       }else if(res.data ==="You don't have enough balance"){
         notify('토큰이 부족합니다', 'error')
         open = false;
       }else if(res.data ==="Minting Failed"){
         notify('민팅에 실패했습니다!\n잠시후 다시 시도해 주세요', 'error')
       }else {
       //console.log(res.data);
       notify('구매성공!');
     }
     })
     .catch((err) => {
       console.log(err);
     })
     
   }

 //mypage에서는 강화하기 진행
 //test 필요!
   if(path[1] == 'mypage'){
     axios.request({
       method: 'POST',
       url:'https://olog445.herokuapp.com/onchain/upgradeNFT',
       data: { username: authstate.username, tokenId : tokenId},
       withCredentials: true
     })
     .then((res) => {
       if(res.data === '0'){
         //모달 닫기
         console.log("ping1");
         notify('강화에 실패했습니다! 다시 시도해 주세요', 'error')
       }
       else if(res.data === '1'){
         //모달 닫기
         console.log("ping2");
         notify('레벨 1 -> 레벨 2 로 강화되었습니다!')
         //getmyNft 다시 호출
       }
       else if(res.data === '2'){
         //모달 닫기
         console.log("ping3");
         notify('레벨 2 -> 레벨 3 으로 강화되었습니다!')
         //getmyNft 다시 호출
       }else if(res.data === 'Not enough balance'){
         console.log("ping4");
         notify('사용가능한 토큰이 부족합니다!', 'error')

       }else {
       console.log("ping5",res.data)
       notify('강화성공!');
   }
       //console.log('강화하기 응답입니다.',res)
       console.log("ping6");
   })
     .catch((err) => {
       console.log("pint7",err);
       notify('Error \n 관리자에게 문의해주세요!', 'error');
     })
   }
 }
      



  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>

          <main>
            {props.children}
            <div>
              <div class = 'modal_grid'>
                <div class = 'g1'>
                  <img className='nftcard_image' src={image} />
                </div>
                <div class = 'g2'>
                  <ul>
                    <li>
                      <div className='key'>name</div>
                      <div className='value'>{name}</div>
                    </li>
                    <li>
                      <div className='key'>description</div>
                      <div className='value'>{description}</div>
                    </li>
                    <li>
                      <div className='key'>reward</div>
                      <div className='value'>{NFTrewardFactor}</div>
                    </li>
                    <li>
                      <div className='key'>price</div>
                      <div className='value'>{price}</div>
                    </li>
                    <li>
                      <div className='key'>attributes</div>
                      <div className='value'>{attributes[0].trait_type}: {attributes[0].value}</div>
                    </li>
                  </ul>
                </div>
                
              </div>
            </div>
          </main>

          <footer>
            <button onClick = {handleSubmit}>{btn_nftcart}</button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};