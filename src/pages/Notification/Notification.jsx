import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDate, formatTime } from "../../Auth/schema";
import GetApi from "../../services/GetApi";
import "./Notification.scss";

import DataNotAvailable from "../../Components/DataNotFound/DataNotAvailable";

export default function Notification() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMoreData = async () => {
    if (!hasMore) {
      return;
    }
    try {
      const apiUrl = await GetApi(`/getNotification?pageNo=${page}&limit=10`); // Example API URL
      if (apiUrl?.status === 200) {
        const newData = apiUrl.data;
        if (newData.length === 0) {
          setHasMore(false); // No more data to load
        } else {
          const updatedItems = items;
          if (updatedItems?.length < apiUrl?.totalItems) {
            setItems([...items, ...apiUrl.data]);
            setPage(page + 1); // Increment the page number for the next request
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchMoreData();
  }, []);

  return (
    <div className="notificationSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="notificationHeading">Notifications</h2>
            {items?.length === 0 ? (
              <DataNotAvailable />
            ) : (
              <div id="scrollableDiv" style={{ height: 480, overflow: "auto" }}>
                <InfiniteScroll
                  dataLength={items.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  scrollableTarget="scrollableDiv"
                >
                  {items?.map((ele, ind) => (
                    <div key={ind} className=" d-flex notificationMessage mt-1">
                      <div className="d-flex w-25 justify-content-center align-items-center">
                        <b>
                          {formatDate(ele?.createdAt)}{" "}
                          {formatTime(ele?.createdAt)}
                        </b>
                      </div>
                      <div className="d-flex w-75 notificationMsg">
                        {ele?.message}
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
