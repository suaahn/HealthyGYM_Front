import Slider from "react-slick";   // npm install react-slick
import "slick-carousel/slick/slick.css";    // npm install slick-carousel
import "slick-carousel/slick/slick-theme.css";
import sample1 from '../../asset/banner1.png';
import sample2 from '../../asset/banner2.png';
import { Link } from "react-router-dom";


export default function Carousel() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    };

    return (
        <Slider {...settings}>
            <div>
                <Link to="/mate/health">
                    <img alt="" src={sample1} width="1100"/>
                </Link>
            </div>
            <div>
                <Link to="/mate/meal">
                    <img alt="" src={sample2} width="1100"/>
                </Link>
            </div>
        </Slider>
    );
      
}