import { auth, provider, storage } from "../store/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import * as actions from "../actions";
import db from "../store/firebase";
import { signInWithPopup } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType";

// this is for save  the user authentication information into redux on the browsers
export function setUser(payload) {
  return {
    type: SET_USER,
    user: payload,
  };
}

// SET_LOADING_STATUS
export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

// set article status
export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});

// authentication information
export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

// signout functionality come from firebase
export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => dispatch(setUser(null)))
      .catch((err) => alert(err.message));
  };
}

//this help to upload the image to the firebase and helpful for loading bar
export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => dispatch(setUser(payload.user)))
      .catch((err) => alert(err.message));
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    //loading bar start
    dispatch(actions.setLoading(true));

    //loading bar end
    if (payload.image) {
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const uploadRef = uploadBytesResumable(storageRef, payload.image);
      //upload images to firebase
      uploadRef.on(
        "state_changed",
        (snapshot) => {
          const progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //progress bar
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          alert(error);
        },
        //download url
        () => {
          getDownloadURL(uploadRef.snapshot.ref).then((downloadURl) => {
            //db collection for images
            const collRef = collection(db, "articles");
            addDoc(collRef, {
              actor: {
                description: payload.user.email,
                title: payload.user.displayName,
                date: payload.timestamp,
                image: payload.user.photoURL,
              },
              comments: 0,
              video: payload.video,
              description: payload.description,
              shareImg: downloadURl,
            });
          });
          // finish the loading here
          dispatch(actions.setLoading(false));
        }
      );
    }
    // db collection for video
    else if (payload.video) {
      const collRef = collection(db, "articles");
      addDoc(collRef, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        comments: 0,
        video: payload.video,
        description: payload.description,
        shareImg: payload.image,
      });
      // finish the loading here
      dispatch(actions.setLoading(false));
    } else {
      const collRef = collection(db, "articles");
      addDoc(collRef, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        comments: 0,
        video: payload.video,
        description: payload.description,
        shareImg: payload.image,
      });
      dispatch(actions.setLoading(false));
    }
  };
}

// fetch the article on main content area from firebase by using useeffect
export function getArticlesAPI() {
  return (dispatch) => {
    let payload;
    //  fetch data from database
    const collRef = collection(db, "articles");
    const orderedRef = query(collRef, orderBy("actor.date", "desc"));
    // this allow to retain data from firebase
    onSnapshot(orderedRef, (snapshot) => {
      payload = snapshot.docs.map((doc) => doc.data());
      //show articles on frontend by this
      dispatch(actions.getArticles(payload));
    });
  };
}
