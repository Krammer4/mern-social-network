import React, { useCallback, useEffect, useState } from "react";
import { useHttp } from "../../hooks/httpHook";
import "./BlogPage.css";
import { Link } from "react-router-dom";
import { PostCard } from "../../components/PostCard/PostCard";
import { ColorRing } from "react-loader-spinner";
import { PostSkeleton } from "../../components/PostSkeleton";

export const BlogPage = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.userId;
  const [allPosts, setAllPosts] = useState([]);
  const { request, loading, error } = useHttp();

  const fetchPosts = useCallback(async () => {
    const data = await request("http://localhost:5000/api/posts", "GET");
    setAllPosts(data.reverse());
    console.log(data);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  // if (loading) {
  //   return (
  //     <ColorRing
  //       visible={true}
  //       height="80"
  //       width="80"
  //       ariaLabel="blocks-loading"
  //       wrapperStyle={{}}
  //       wrapperClass="blocks-wrapper"
  //       colors={["#e7e5f0", "#5c529a", "1aa0a0", "dbf2f2"]}
  //     />
  //   );
  // }

  return (
    <div className="blog">
      <div className="blog _container">
        <div className="blog-content">
          <p className="blog-mainTitle">Лента новостей:</p>
          <p
            className="blog-update"
            onClick={() => {
              fetchPosts();
            }}
          >
            Обновить ленту
          </p>
          {/* {allPosts.length == 0 ? (
            <p className="blog-noBlogs">Нет постов...</p>
          ) : (
            allPosts.map((post) => {
              return (
                <PostCard
                  title={post.title}
                  authorName={post.author.name}
                  authorLastName={post.author.lastName}
                  content={post.content}
                  postId={post._id}
                  authorEmail={post.author.email}
                  username={post.author.username}
                  date={post.date}
                />
              );
            })
          )} */}

          <div className="blog-allPosts-block">
            {loading ? (
              <>
                <div className="blog-post-skeleton">
                  <PostSkeleton />
                </div>
                <div className="blog-post-skeleton">
                  <PostSkeleton />
                </div>
                <div className="blog-post-skeleton">
                  <PostSkeleton />
                </div>
              </>
            ) : allPosts.length > 0 ? (
              allPosts.map((post) => (
                <Link
                  className="postcard-redirectToThisPost"
                  to={`/post/${post._id}`}
                >
                  <PostCard
                    title={post.title}
                    authorName={post.author.name}
                    authorLastName={post.author.lastName}
                    content={post.content}
                    postId={post._id}
                    authorEmail={post.author.email}
                    username={post.author.username}
                    date={post.date}
                    userId={userId}
                    authorId={post.author._id}
                    postImage={post.imageUrl}
                    userAvatar={post.author.avatar}
                  />
                </Link>
              ))
            ) : (
              <p className="blog-noPosts">
                Ждем! Пока тут ничего нет... Вы можете стать первым, опубликовав
                пост во вкладке{" "}
                <Link
                  to={`/profile/${userId}`}
                  className="blog-noPosts-redirect"
                >
                  Профиль
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
