import React from "react";
import { useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { postArticleAPI } from "../actions/index";

const PostModal = (props) => {
  //  text editor functionality on popup
  const [editorText, setEditorText] = useState("");
  // functionality to share the image from computer on the poppop modal
  const [shareImage, setShareImage] = useState("");

  // functionality to share the video from local device
  const [videoLink, setVideoLink] = useState("");

  // asset area state
  const [assetArea, setAssetArea] = useState("");

  //  handle the change when user import file and images on local

  const handleChange = (e) => {
    //get the first element on the files
    const image = e.target.files[0];
    // if you find any error so do this thing
    // if the image is black or image is undefined then those two cases we show a alert otherwise return
    if (image === "" || image === undefined) {
      //alert
      alert(`not an image , the file is a ${typeof image}`);
      // otherwise return
      return;
    } else {
      //And if we dont get any error then do this thing

      // and this will update the upper variable
      setShareImage(image);
    }
  };

  // post article function
  const postArticle = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }

    // define payload image
    const payload = {
      image: shareImage,
      video: videoLink,
      user: props.user,
      description: editorText,
      timestamp: Timestamp.now(),
    };
    //post article payload
    props.postArticle(payload);
    // and call this reset function below to reset everything when it is added
    reset(e);
  };

  // empty state of image and video  as argument
  //choose asset area and passes the image, video
  const switchAssetArea = (area) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const reset = (e) => {
    setEditorText("");
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    props.handleClick(e);
  };

  return (
    // wrap this all thing in the jsx fragment
    <>
      {/* if the props modal state is true so show me all this stuff */}
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <button onClick={(e) => reset(e)}>
                <img src="/images/close-icon.svg" alt="" />
              </button>
            </Header>
            <ShareContent>
              {/* display the user info */}
              <UserInfo>
                {props.user && props.user.photoURL ? (
                  <img src={props.user.photoURL} alt="" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
                <span></span>
              </UserInfo>
              <Editor>
                {/* onchange grab the value from the texteditor on the targetvalue */}
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                />
                {/* scugly brackets */}
                {/* if the assetsarea is image then do this  */}
                {assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      name="image"
                      id="file"
                      //jsx inline styling
                      style={{ display: "none" }}
                      //  run the handle change function to set the image for us
                      onChange={handleChange}
                    />
                    <p>
                      <label
                        style={{
                          cursor: "pointer",
                          display: "block",
                          marginBottom: "15px",
                        }}
                        htmlFor="file"
                      >
                        Select an image to share
                      </label>
                    </p>
                    {/* if the image already exists then do this to show the import image on the poppop box*/}
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} alt="img" />
                    )}
                    {/* for video upload */}
                    {/* first add empty jsx fragment */}
                  </UploadImage>
                ) : (
                  //  and if assetarea is media then do all of this

                  assetArea === "media" && (
                    <>
                      <input
                        style={{ width: "100%", height: "30px" }}
                        type="text"
                        value={videoLink}
                        // take the event and set the video link based on whatever the user gives you the value of the event
                        onChange={(e) => setVideoLink(e.target.value)}
                        placeholder="Please input a video link"
                      />
                      {/* if video link exist then import react player and set the inline style of jsx and the video url 
                       whichever the video link has been set on the state at the movement*/}
                      {videoLink && (
                        <ReactPlayer width="100%" url={videoLink} />
                      )}
                    </>
                  )
                )}
              </Editor>
            </ShareContent>
            <ShareCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea("image")}>
                  <img src="/images/share-image.svg" alt="" />
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea("media")}>
                  <img src="/images/share-video.svg" alt="" />
                </AssetButton>
              </AttachAssets>
              <ShareComment>
                <AssetButton>
                  <img src="/images/share-comment.svg" alt="" />
                  Anyone
                </AssetButton>
              </ShareComment>
              {/* disable a post button when user not filling any information on text editor */}
              {/* means true means disbale and false means not disable */}
              <PostButton
                onClick={(e) => postArticle(e)}
                disabled={!editorText ? true : false}
              >
                Post
              </PostButton>
            </ShareCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

// container style
const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

// content style
const Content = styled.div`
  width: 100%;
  max-width: 552px;
  max-height: 90%;
  background-color: #fff;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

// header style
const Header = styled.div`
  display: block;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 20px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-weight: 400;
  }
  button {
    width: 40px;
    height: 40px;
    min-width: auto;
    border: none;
    outline: none;
    background: transparent;
    img,
    svg {
      pointer-events: none;
    }
  }
`;

// sharedcontent style
const ShareContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 5px 12px;
`;

// userinfo style
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 24px;
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border-radius: 50%;
    border: 2px solid transparent;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

// sharedcreation style
const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 24px 10px 16px;
`;

// assetsbutton style
const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.5);
`;

// attachassests style
const AttachAssets = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
  }
`;

// sharecomment style
const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  ${AssetButton} {
    svg {
      margin-right: 5px;
    }
  }
`;

// postbutton style
const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  background: "#0a66c2";
  color: "white";
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => (props.disabled ? "rgb(0, 0, 0, 0.8)" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "rgb(1, 1, 1, 0.2)" : "white")};
  &:hover {
    background: ${(props) =>
      props.disabled ? "rgb(0, 0, 0, 0.08)" : "#004182"};
  }
`;

// texteditor style
const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
  }
  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

// upload style
const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
`;

// store function of redux

//mapstate
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

//mapdispatch
const mapDispatchToProps = (dispatch) => {
  return { postArticle: (payload) => dispatch(postArticleAPI(payload)) };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
