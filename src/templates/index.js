import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
// import Search from "../components/Search";
import PostTemplate from "../components/PostTemplate";

const IndexPage = ({ pageContext }) => {
  //const [search, setSearch] = useState("");
  // const [searchMatches, setSearchMatches] = useState([]);

  const { group, index, first, last, pageCount } = pageContext;
  const previousUrl = index - 1 == 1 ? "/" : `/page/${index - 1}`;
  const nextUrl = "/page/" + (index + 1).toString();

  return (
    <Layout>
      {/*
      <Search
        value={search}
        onChange={value => setSearch({ search: value })}
      />
      */}

      {group.map(({ node }) => (
        <PostTemplate
          key={node.id}
          content={node.html}
          frontmatter={node.frontmatter}
          slug={node.fields.slug}
        />
      ))}

      <nav
        className="pagination is-centered"
        role="navigation"
        aria-label="pagination"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Link
          className="pagination-previous"
          to={previousUrl}
          disabled={first}
          style={{
            // Temp hack to prevent clicking
            // TODO: Render a link without a href instead
            pointerEvents: first ? "none" : "auto",
          }}
        >
          Previous
        </Link>
        <Link
          className="pagination-next"
          to={nextUrl}
          disabled={last}
          style={{
            pointerEvents: last ? "none" : "auto",
          }}
        >
          Next Page
        </Link>
        <ul className="pagination-list">
          {Array(pageCount)
            .fill(null)
            .map((value, i) => {
              const pageNum = i + 1;
              const isCurrent = index === pageNum;
              const url = pageNum === 1 ? "/" : `/page/${pageNum}`;

              return (
                <li key={i}>
                  <Link
                    className={
                      "pagination-link" + (isCurrent ? " is-current" : "")
                    }
                    to={url}
                  >
                    {pageNum}
                  </Link>
                </li>
              );
            })}
        </ul>
        {/*<span>{` Page ${index} of ${pageCount}`}</span>*/}
      </nav>
    </Layout>
  );
};

export default IndexPage;

// Quicky and hacky search
function searchPosts(posts, search) {
  // Store title matches for quick lookup
  let titles = {};

  // Get all posts that have a matching title
  const filterPostsByTitle = posts.filter((post) => {
    const hook = post.node.frontmatter;
    const titleLowerCase = hook.title.toLowerCase();
    const doesInclude = titleLowerCase.includes(search.toLowerCase());
    if (doesInclude) {
      titles[titleLowerCase] = true;
      return true;
    } else {
      return false;
    }
  });

  // Get all posts that have a matching description and DON'T match by title
  const filterPostsByDescription = posts.filter((post) => {
    const hook = post.node.frontmatter;
    const titleLowerCase = hook.title.toLowerCase();
    const description = post.node.html || "";
    return (
      !titles[titleLowerCase] &&
      description.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Add description matches to end of results
  const filteredPosts = filterPostsByTitle.concat(filterPostsByDescription);
  return filteredPosts;
}
