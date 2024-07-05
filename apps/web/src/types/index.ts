export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: null;
  bio: string;
  twitter_username: null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

// const githubUser: GitHubUser = {
//   login: "xx",
//   id: 123,
//   node_id: "123",
//   avatar_url: "https://avatars.githubusercontent.com/u/123?v=4",
//   gravatar_id: "",
//   url: "https://api.github.com/users/xx",
//   html_url: "https://github.com/xx",
//   followers_url: "https://api.github.com/users/xx/followers",
//   following_url:
//     "https://api.github.com/users/xx/following{/other_user}",
//   gists_url: "https://api.github.com/users/xx/gists{/gist_id}",
//   starred_url:
//     "https://api.github.com/users/xx/starred{/owner}{/repo}",
//   subscriptions_url: "https://api.github.com/users/xx/subscriptions",
//   organizations_url: "https://api.github.com/users/xx/orgs",
//   repos_url: "https://api.github.com/users/xx/repos",
//   events_url: "https://api.github.com/users/xx/events{/privacy}",
//   received_events_url:
//     "https://api.github.com/users/xx/received_events",
//   type: "User",
//   site_admin: false,
//   name: "Y",
//   company: "@Github",
//   blog: "",
//   location: "Los Angeles, CA, USA",
//   email: "test@example.com",
//   hireable: null,
//   bio: "",
//   twitter_username: null,
//   public_repos: 72,
//   public_gists: 1,
//   followers: 212,
//   following: 210,
//   created_at: "2014-12-09T02:18:16Z",
//   updated_at: "2024-06-28T02:59:35Z",
// };

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: null | "public";
}

// const emails: GitHubEmail[] = [
//   {
//     email: "test@example.com",
//     primary: false,
//     verified: true,
//     visibility: 'public',
//   },
// ];

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

// const googleUser: GoogleUser = {
//   sub: "123",
//   name: "YZ",
//   given_name: "Y",
//   family_name: "Z",
//   picture:
//     "https://lh3.googleusercontent.com/a/123",
//   email: "example@qq.com",
//   email_verified: true,
// };

export interface NavTab {
  name: string;
  href: string;
}
