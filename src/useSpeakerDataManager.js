import speakersReducer from './speakersReducer';
import axios from 'axios';
import { useEffect, useReducer } from 'react';

// all code in this module does not contain the server-side or static
// site generation code from the end of the last module. It all relies
// on the useEffect hook to load speakers data.

function useSpeakerDataManager() {
  const [{ isLoading, speakerList, favoriteClickCount, hasErrored, error}, dispatch] = useReducer(
    speakersReducer, {
    isLoading: true,
    speakerList: [],
    favoriteClickCount: 0,
    hasErrored: false,
    error: null,
  });

  function incrementFavoriteClickCount(){
    dispatch({type: 'incrementFavoriteClickCount'});
  }

  function toggleSpeakerFavorite(speakerRec) {
    const updateData = async function () {
      axios.put(`/api/speakers/${speakerRec.id}`, {
        ...speakerRec,
        favorite: !speakerRec.favorite,
      });
      speakerRec.favorite === true
        ? dispatch({ type: 'unfavorite', id: speakerRec.id })
        : dispatch({ type: 'favorite', id: speakerRec.id });
    };
    updateData();
  }
  useEffect(() => {
    const fetchData = async function () {
      try {
        let result = await axios.get('/api/speakers');
      dispatch({ type: 'setSpeakerList', data: result.data });
        
      } catch (e) {
        dispatch({type: 'errored', error: e});
      }
    };
    fetchData();
    return () => {
      console.log('cleanup');
    };
  }, []);
  return { isLoading, speakerList, favoriteClickCount, 
    incrementFavoriteClickCount ,toggleSpeakerFavorite, hasErrored, error, };
}
export default useSpeakerDataManager;
