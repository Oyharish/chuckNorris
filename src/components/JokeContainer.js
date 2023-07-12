import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Joke from './Joke';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './JokeContainer.css'; // Import the CSS file

Modal.setAppElement('#root');

const JokeContainer = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [joke, setJoke] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://api.chucknorris.io/jokes/categories');
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJokeByCategory = async (category) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.chucknorris.io/jokes/random?category=${category}`);
      const jokeData = response.data;
      const jokeWithCategory = `${jokeData.value} (${category})`;
      setJoke(jokeWithCategory);
      setIsLoading(false);
      setModalIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleNextJoke = async () => {
    await fetchJokeByCategory(selectedCategory);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    await fetchJokeByCategory(category);
  };

  return (
    <div>
      <h1>Chuck Norris Jokes</h1>
      <div className="category-container">
        {categories.map((category) => (
          <div key={category} className={`category ${selectedCategory === category ? 'active' : ''}`} onClick={() => handleCategoryClick(category)}>
            <h2>{category}</h2>
            <p>Unlimited jokes on {category}</p>
          </div>
        ))}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} className="modal" overlayClassName="overlay">
        <div className="modal-header">
          <h2>{selectedCategory}</h2>
          <button className="close-button" onClick={handleCloseModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {isLoading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        ) : (
          <>
            <Joke joke={joke} />
            <button onClick={handleNextJoke}>Next Joke</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default JokeContainer;
