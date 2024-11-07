import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFeed = async () => {
    if (feed) return; // Don't fetch if already in the store
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
      setLoading(false);
    } catch (err) {
      setError("Error fetching feed, please try again."+err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []); // Fetch the feed only once when the component mounts

  if (loading) return <h1>Loading...</h1>;

  if (error) return <h1>{error}</h1>;

  if (feed.length === 0)
    return <h1 className="flex justify-center my-10">No new users found!</h1>;

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
