import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PostalModal from "./PostModal";
import { getArticlesAPI } from "../actions";
import ReactPlayer from "react-player";

const Main = (props) => {
  // set modal here to show only when click on button
  //here default state is alwayse close
  const [showModal, setShowModal] = useState("close");

  // use useeffect to retain the article data from firebase to frontend
  useEffect(() => {
    props.getArticles();
  }, []);

  // hide and show the modal
  const handleClick = (event) => {
    event.preventDefault();
    if (event.target !== event.currentTarget) {
      return;
    }
    switch (showModal) {
      //open state
      case "open":
        setShowModal("close");
        break;
      // close state
      case "close":
        setShowModal("open");
        break;
      //default state
      default:
        setShowModal("close");
        break;
    }
  };
  return (
    <>
      {/* ajx fragment and ternary operator to not show  the articles if the articles are not in our firebase */}
      {props.articles.length === 0 ? (
        <p>There are No Articles</p>
      ) : (
        <Container>
          <ShareBox>
            <div>
              {/* user image show from google authentication */}
              {props.user && props.user.photoURL ? (
                <img src={props.user.photoURL} alt={props.user.displayName} />
              ) : (
                <img src="/images/user.svg" alt="user-image" />
              )}
              <button
                onClick={handleClick}
                disabled={props.loading ? true : false}
              >
                Start a post
              </button>
            </div>
            <div>
              <button>
                <img src="/images/photo-icon.svg" />
                <span>Photo</span>
              </button>
              <button>
                <img src="/images/video-icon.svg" />
                <span>Video</span>
              </button>
              <button>
                <img src="/images/event-icon.svg" />
                <span>Event</span>
              </button>
              <button>
                <img src="/images/article-icon.svg" />
                <span>Write article</span>
              </button>
            </div>
          </ShareBox>
          <Content>
            {/* loading spinner */}
            {props.loading && <img src="./images/linkedin-loading-bar.svg" />}
            {/* articles loading on frontend */}
            {props.articles.length > 0 &&
              props.articles.map((article, index) => (
                <Article key={index}>
                  <SharedActor>
                    <a>
                      <img src={article.actor.image} />
                      <div>
                        <span>{article.actor.title}</span>
                        <span>{article.actor.description}</span>
                        <span>
                          {article.actor.date.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </a>
                    <button>
                      <img src="/images/ellipses.svg"></img>
                    </button>
                  </SharedActor>
                  <Description>{article.description}</Description>
                  <SharedImg>
                    <a>
                      {!article.shareImg && article.video ? (
                        <ReactPlayer width="100%" url={article.video} />
                      ) : (
                        article.shareImg && <img src={article.shareImg} />
                      )}
                      {/* <img src="/images/random-post-image.jpg" alt="random-post-image"/> */}
                    </a>
                  </SharedImg>
                  <SocialCount>
                    <li>
                      <button>
                        <img src="https://static-exp1.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb" />
                        <img src="https://static-exp1.licdn.com/sc/h/5thsbmikm6a8uov24ygwd914f" />
                        <span>75</span>
                      </button>
                    </li>
                    <li>
                      <a>{article.comments} comments</a>
                    </li>
                  </SocialCount>
                  <SocialActions>
                    <button>
                      <img src="images/like-icon.svg" />
                      <span>Like</span>
                    </button>
                    <button>
                      <img src="images/comment-icon.svg" />
                      <span>Comments</span>
                    </button>
                    <button>
                      <img src="images/share-icon.svg" />
                      <span>Share</span>
                    </button>
                    <button>
                      <img src="images/send-icon.svg" />
                      <span>Send</span>
                    </button>
                  </SocialActions>
                </Article>
              ))}
            <PostalModal showModal={showModal} handleClick={handleClick} />
          </Content>
        </Container>
      )}
    </>
  );
};

// container style
const Container = styled.div`
  grid-area: main;
`;

// maincard/commandcard style
const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

// share style
const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      display: flex;
      align-items: center;
      border: none;
      background-color: transparent;
      font-weight: 600;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 35px;
        text-align: left;
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        img {
          margin: 0 4px 0 -2px;
        }
      }
    }
  }
`;

// article style
const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;

// sharedactor style
const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: #000;
        }
        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
  button {
    position: absolute;
    top: 0;
    right: 12px;
    border: none;
    outline: none;
    background: transparent;
  }
`;

// description style
const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;

// sharedimage style
const SharedImg = styled.div`
  margin: 8px 16px 0;
  background-color: #f9fafb;
  img {
    width: 100%;
    height: 100%;
  }
`;

// socialcounts style
const SocialCount = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9efdf;
  color: rgba(0, 0, 0, 0.6);
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px;
    button {
      display: flex;
      border: none;
      color: rgba(0, 0, 0, 0.6);
      background: transparent;
      span {
        padding-left: 5px;
      }
    }
  }
`;

// socialactions style
const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;
  button {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: #0a66c2;
    border: none;
    background-color: white;

    @media (max-width: 768px) {
      span {
        margin-left: 8px;
      }
    }
  }
`;

// content style
const Content = styled.div`
  text-align: center;
  //loading bar
  & > img {
    width: 30px;
  }
`;

const mapStateToProps = (state) => {
  return {
    loading: state.articleState.loading,
    user: state.userState.user,
    articles: state.articleState.articles,
  };
};

// redux stuffs for fetch data from firebase to frontend
const mapDispatchToProps = (dispatch) => ({
  getArticles: () => dispatch(getArticlesAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
