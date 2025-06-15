import React from 'react';
import Slider from 'react-slick';

const cards = [
  { name: 'Charizard VMAX', image: 'https://via.placeholder.com/300x200?text=Charizard' },
  { name: 'Blue-Eyes White Dragon', image: 'https://via.placeholder.com/300x200?text=Blue+Eyes' },
  { name: 'Black Lotus', image: 'https://via.placeholder.com/300x200?text=Black+Lotus' }
];

function CarouselCards() {
  const settings = {
    dots: true, infinite: true, speed: 500,
    slidesToShow: 1, slidesToScroll: 1, autoplay: true
  };

  return (
    <div className="carousel">
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="card-slide">
            <img src={card.image} alt={card.name} />
            <h3>{card.name}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CarouselCards;
