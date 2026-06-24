import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1/chat"
  : "https://movie-website-zr27.onrender.com/api/v1/chat";

export interface ChatResponse {
  reply: string;
  movies: Array<{
    id: string;
    title: string;
    year: string;
    poster: string;
    genre: string;
    imdbRating: string;
  }>;
}

export const sendChatMessage = async (
  message: string
): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>(API_BASE_URL, { message });
  return response.data;
};
