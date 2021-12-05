import axios from 'axios';
const API_URL = 'https://pixabay.com/api/';
const API_KEY = '24658452-c9a73396c36aa22aa8e7e136d';

export default async function searchImages(userRequest, page) {
  const response = await axios.get(
    `${API_URL}/?key=${API_KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
  );
  return response
}

