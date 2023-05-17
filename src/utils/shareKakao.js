export const shareKakao = (url, title) => {

    if (window.Kakao) {
        const kakao = window.Kakao;
        if (!kakao.isInitialized()) {
          kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY); // 카카오에서 제공받은 javascript key
        }
        
        kakao.Link.sendDefault({
          objectType: "feed",
          content: {
            title: title,
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%2Fimg_zym.png?alt=media&token=d3f1aaa7-32a8-47ce-b7a9-2d871f160d1f",
            link: {
              mobileWebUrl: url,
              webUrl: url
            }
          },
          buttons: [
            {
              title: "웹에서 보기",
              link: {
                mobileWebUrl: url,
                webUrl: url
              }
            }
          ]
        });
    }
}