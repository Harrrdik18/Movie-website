// OMDB API types

// Combined entity type used for createEntityAdapter
// Has all fields from search results + detail as optional
export interface MovieEntity {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  imdbRating?: string;
  Plot?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Rated?: string;
  Released?: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  Metascore?: string;
  imdbVotes?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

export interface OMDBMovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  imdbRating?: string;
}

export interface OMDBSearchResponse {
  Search: OMDBMovieSearchResult[];
  totalResults: string;
  Response: "True" | "False";
}

export interface OMDBMovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: "True" | "False";
}

// User types

export interface WatchlistItem {
  movieId: string;
  title: string;
  poster: string;
  type: string;
}

export interface FavoriteItem {
  movieId: string;
  title: string;
  poster: string;
  type: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: { url: string; public_id: string };
  role: string;
  favorites: FavoriteItem[];
  watchlist: WatchlistItem[];
  createdAt: string;
}

// Genre types

export interface Genre {
  id: number;
  name: string;
}

// Redux state types (partial - populated by slices)

export interface MoviesStateBase {
  entities: Record<string, MovieEntity>;
  ids: string[];
}

export interface MoviesState extends MoviesStateBase {
  trending: string[];
  popular: string[];
  topRated: string[];
  upcoming: string[];
  homeLoading: boolean;
  homeError: string | null;
  discover: string[];
  discoverLoading: boolean;
  discoverTotalResults: number;
  discoverError: string | null;
  tvShows: string[];
  tvLoading: boolean;
  tvTotalResults: number;
  tvError: string | null;
  genres: Genre[];
  genreMovies: string[];
  genreLoading: boolean;
  genreError: string | null;
  countryMovies: string[];
  countryLoading: boolean;
  countryError: string | null;
  movieDetails: string | null;
  similarMovies: string[];
  detailLoading: boolean;
  detailError: string | null;
  searchResults: string[];
  searchLoading: boolean;
  searchError: string | null;
  backgroundImageUrl: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export interface RootState {
  user: UserState;
  movies: MoviesState;
}

// Thunk API response types

export interface HomeDataPayload {
  trending: OMDBMovieSearchResult[];
  popular: OMDBMovieSearchResult[];
  topRated: OMDBMovieSearchResult[];
  upcoming: OMDBMovieSearchResult[];
  background: string;
}

export interface DiscoverPayload {
  movies: OMDBMovieSearchResult[];
  totalResults: number;
}

export interface TVShowsPayload {
  shows: OMDBMovieSearchResult[];
  totalResults: number;
}

export interface MovieDetailPayload {
  details: OMDBMovieDetail;
  similar: OMDBMovieSearchResult[];
}
